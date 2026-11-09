import { Context, db, fail, json, method, publicArtwork, signView, user } from '../../_lib/core';

export const onRequestGet = async (c: Context): Promise<Response> => {
  try {
    method(c, 'GET');
    const current = await user(c);
    const { data, error } = await db(c).from('artworks')
      .select('id,provenance_id,creator_id,object_key,title,description,tags,category,style,audience_rating,ai_generated,ai_tool,ai_model,ai_disclosure,sensitive,status,created_at,profiles!artworks_creator_id_fkey(handle,display_name)')
      .eq('creator_id', current.id).order('created_at', { ascending: false }).limit(100);
    if (error) throw error;
    const items = await Promise.all((data || []).map(async (row) => ({
      ...publicArtwork(row as unknown as Record<string, any>),
      image_url: row.status === 'removed' || row.status === 'rejected' ? null : await signView(c, row.object_key, 120),
    })));
    return json({ items });
  } catch (error) {
    return fail(error);
  }
};
