import { adultUser, CATEGORIES, Context, db, enumValue, fail, HttpError, json, MAX_IMAGE_BYTES, method, storeDelete, storePut, STYLES, tags, text, user } from '../_lib/core';

function sniff(bytes: Uint8Array): string | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg';
  if (bytes.length >= 8 && [137, 80, 78, 71, 13, 10, 26, 10].every((value, index) => bytes[index] === value)) return 'image/png';
  if (bytes.length >= 12 && String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' && String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP') return 'image/webp';
  return null;
}

export const onRequestPost = async (c: Context): Promise<Response> => {
  let objectKey = '';
  let uploaded = false;
  try {
    method(c, 'POST');
    const length = Number(c.request.headers.get('Content-Length') || 0);
    if (length > MAX_IMAGE_BYTES + 64_000) throw new HttpError(413, 'Image must be 8 MiB or smaller');
    const creator = await user(c);
    let form: FormData;
    try { form = await c.request.formData(); } catch { throw new HttpError(400, 'A multipart image upload is required'); }
    const file = form.get('file');
    if (!(file instanceof File) || file.size < 1 || file.size > MAX_IMAGE_BYTES) throw new HttpError(400, 'Only JPG, PNG, or WebP images up to 8 MiB are accepted');
    const bytes = new Uint8Array(await file.arrayBuffer());
    const mime = sniff(bytes);
    if (!mime || file.type !== mime) throw new HttpError(400, 'Image signature does not match JPG, PNG, or WebP');

    const category = enumValue(String(form.get('category') || ''), CATEGORIES, 'category');
    const style = enumValue(String(form.get('style') || 'other'), STYLES, 'style');
    const rating = enumValue(String(form.get('rating') || 'general'), ['general', 'adult'] as const, 'audience rating');
    if (rating === 'adult') {
      await adultUser(c);
      if (category !== 'adult-fashion-swimwear') throw new HttpError(400, 'Adult artwork is limited to the 18+ Fashion & Swimwear category');
    } else if (category === 'adult-fashion-swimwear') {
      throw new HttpError(400, 'The 18+ category requires an adult audience rating');
    }
    if (category === 'indian-folk-traditional' && style === 'other') throw new HttpError(400, 'Choose the specific Indian art tradition for this collection');
    if (category !== 'indian-folk-traditional' && style !== 'other') throw new HttpError(400, 'Tradition labels only apply to Indian Folk & Traditional');

    const title = text(form.get('title'), 'title', 80, true);
    const description = text(form.get('description') || '', 'description', 600);
    let tagValues: string[];
    try { tagValues = tags(JSON.parse(String(form.get('tags') || '[]'))); } catch (error) { throw error instanceof HttpError ? error : new HttpError(400, 'Invalid tags'); }
    const tool = text(form.get('tool') || '', 'AI tool', 100);
    const model = text(form.get('model') || '', 'AI model', 100);
    const prompt = text(form.get('prompt') || '', 'prompt / process note', 1000);
    const sensitive = form.get('sensitive') === 'true';
    if (form.get('aiGenerated') !== 'true' || form.get('aiDisclosureConfirmed') !== 'true') throw new HttpError(400, 'Confirm that this work is AI-generated');
    if (form.get('rightsConfirmed') !== 'true') throw new HttpError(400, 'Confirm that you have rights to publish this image');
    if (form.get('contentPolicyConfirmed') !== 'true') throw new HttpError(400, 'Confirm that this upload follows the content rules');

    const extension = mime === 'image/jpeg' ? 'jpg' : mime === 'image/png' ? 'png' : 'webp';
    const artworkId = crypto.randomUUID();
    objectKey = `${creator.id}/${artworkId}.${extension}`;
    const client = db(c);
    const { data: reservation, error: reservationError } = await client.rpc('kamna_reserve_upload', {
      p_user_id: creator.id,
      p_object_key: objectKey,
      p_size_bytes: file.size,
      p_mime_type: mime,
    });
    if (reservationError || !reservation) {
      const message = reservationError?.message || '';
      if (/limit|capacity|ceiling|quota/i.test(message)) throw new HttpError(429, 'Upload reservation limit or storage capacity reached');
      console.error('Upload reservation failed', reservationError);
      throw new HttpError(503, 'Upload could not be reserved; please try again later');
    }

    await storePut(c, objectKey, bytes, mime, { provenance_id: artworkId, ai_generated: 'true', category, rating });
    uploaded = true;
    const { data: artwork, error: finalizeError } = await client.rpc('kamna_finalize_upload', {
      p_user_id: creator.id,
      p_object_key: objectKey,
      p_size_bytes: file.size,
      p_title: title,
      p_description: description,
      p_tags: tagValues,
      p_category: category,
      p_style: style,
      p_rating: rating,
      p_ai_tool: tool || null,
      p_ai_model: model || null,
      p_ai_prompt: prompt || null,
      p_sensitive: sensitive,
      p_provenance_id: artworkId,
      p_rights_disclosure: 'Uploader confirms rights to publish',
      p_ai_disclosure: 'AI-generated; uploader-confirmed',
    });
    if (finalizeError || !artwork) {
      console.error('Upload finalization failed', finalizeError);
      throw new HttpError(503, 'The upload could not be finalized; please try again later');
    }
    return json({ artwork }, 201);
  } catch (error) {
    if (uploaded && objectKey) {
      try { await storeDelete(c, objectKey); }
      catch (cleanupError) { console.error('Upload compensation failed', cleanupError); }
    }
    return fail(error);
  }
};
