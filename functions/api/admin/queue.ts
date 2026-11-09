import { Context, db, fail, json, method, moderator, publicArtwork, signView } from '../../_lib/core';

export const onRequestGet = async (c: Context): Promise<Response> => {
  try {
    method(c, 'GET');
    await moderator(c);
    const client = db(c);
    const [{ data: artworks, error: artworkError }, { data: reports, error: reportError }] = await Promise.all([
      client.from('artworks').select('id,provenance_id,creator_id,object_key,title,description,tags,category,style,audience_rating,ai_generated,ai_tool,ai_model,ai_prompt,ai_disclosure,rights_disclosure,sensitive,status,cleanup_status,created_at,profiles!artworks_creator_id_fkey(handle,display_name)')
        .or('status.eq.pending,cleanup_status.eq.pending').order('created_at', { ascending: true }).limit(100),
      client.from('reports').select('id,artwork_id,type,category,details,contact_email,status,created_at').eq('status', 'open').order('created_at', { ascending: true }).limit(100),
    ]);
    if (artworkError) throw artworkError;
    if (reportError) throw reportError;
    const items = await Promise.all((artworks || []).map(async (row) => ({
      ...publicArtwork(row as unknown as Record<string, any>),
      ai_prompt: row.ai_prompt,
      rights_disclosure: row.rights_disclosure,
      cleanup_status: row.cleanup_status,
      image_url: await signView(c, row.object_key, 120),
    })));
    return json({ artworks: items, reports: reports || [] });
  } catch (error) {
    return fail(error);
  }
};
