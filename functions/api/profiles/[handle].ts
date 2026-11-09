import { Context, db, fail, HttpError, json, method, publicArtwork, signView } from '../../_lib/core';

export const onRequestGet = async (c: Context): Promise<Response> => {
  try {
    method(c, 'GET');
    const handle = c.params.handle;
    if (!handle || handle.length > 50) throw new HttpError(400, 'Creator handle required');
    const client = db(c);
    const { data: profile, error: profileError } = await client.from('profiles').select('id,handle,display_name,bio').eq('handle', handle).maybeSingle();
    if (profileError) throw profileError;
    if (!profile) throw new HttpError(404, 'Creator not found');
    const { data, error } = await client.from('artworks')
      .select('id,provenance_id,creator_id,object_key,title,description,tags,category,style,audience_rating,ai_generated,ai_tool,ai_model,ai_disclosure,sensitive,status,created_at,profiles!artworks_creator_id_fkey(handle,display_name)')
      .eq('creator_id', profile.id).eq('status', 'approved').eq('audience_rating', 'general')
      .order('created_at', { ascending: false }).limit(100);
    if (error) throw error;
    const items = await Promise.all((data || []).map(async (row) => ({
      ...publicArtwork(row as unknown as Record<string, any>),
      image_url: await signView(c, row.object_key, 180),
    })));
    return json({ profile: { handle: profile.handle, display_name: profile.display_name, bio: profile.bio }, items });
  } catch (error) {
    return fail(error);
  }
};
