import { adultUser, Context, db, fail, HttpError, json, method, publicArtwork, signView } from '../../_lib/core';

export const onRequestGet = async (c: Context): Promise<Response> => {
  try {
    method(c, 'GET');
    const id = c.params.id;
    if (!id) throw new HttpError(400, 'Artwork ID required');
    const { data, error } = await db(c).from('artworks')
      .select('id,provenance_id,creator_id,object_key,title,description,tags,category,style,audience_rating,ai_generated,ai_tool,ai_model,ai_disclosure,rights_disclosure,sensitive,status,created_at,profiles!artworks_creator_id_fkey(handle,display_name)')
      .eq('id', id).eq('status', 'approved').maybeSingle();
    if (error) throw error;
    if (!data) throw new HttpError(404, 'Artwork not found');
    if (data.audience_rating === 'adult') await adultUser(c);
    return json({ ...publicArtwork(data as unknown as Record<string, any>), rights_disclosure: data.rights_disclosure, image_url: await signView(c, data.object_key, 180) });
  } catch (error) {
    return fail(error);
  }
};
