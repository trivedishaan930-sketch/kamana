import { adultUser, Context, db, fail, HttpError, imageExtension, json, method, signView } from '../../../_lib/core';

export const onRequestGet = async (c: Context): Promise<Response> => {
  try {
    method(c, 'GET');
    const id = c.params.id;
    if (!id) throw new HttpError(400, 'Artwork ID required');
    const { data, error } = await db(c).from('artworks').select('id,provenance_id,object_key,audience_rating,status').eq('id', id).eq('status', 'approved').maybeSingle();
    if (error) throw error;
    if (!data) throw new HttpError(404, 'Approved artwork not found');
    if (data.audience_rating === 'adult') await adultUser(c);
    const filename = `Kamna-${data.provenance_id}.${imageExtension(data.object_key)}`;
    const url = await signView(c, data.object_key, 180, filename);
    return json({ url, filename, provenanceId: data.provenance_id, disclosure: 'AI-generated artwork; Kamna provenance ID included in filename.' });
  } catch (error) {
    return fail(error);
  }
};
