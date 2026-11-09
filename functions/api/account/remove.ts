import { bodyJson, Context, db, fail, HttpError, json, method, storeDelete, user, uuid } from '../../_lib/core';

export const onRequestPost = async (c: Context): Promise<Response> => {
  try {
    method(c, 'POST');
    const current = await user(c);
    const body = await bodyJson(c);
    const artworkId = uuid(body.artworkId, 'artworkId');
    const client = db(c);
    const { data, error } = await client.rpc('kamna_remove_owned_artwork', { p_user_id: current.id, p_artwork_id: artworkId });
    if (error) {
      if (/not found|already unavailable/i.test(error.message || '')) throw new HttpError(404, 'Your available artwork was not found');
      throw error;
    }
    const objectKey = data?.object_key;
    if (!objectKey) throw new HttpError(503, 'Artwork was unpublished, but cleanup details are unavailable');
    try { await storeDelete(c, objectKey); }
    catch (error) {
      console.error('Owner removal object cleanup failed', error);
      throw new HttpError(502, 'Artwork is unpublished, but stored-image cleanup is pending moderator follow-up');
    }
    const { error: finishError } = await client.rpc('kamna_finish_cleanup', { p_artwork_id: artworkId });
    if (finishError) {
      console.error('Owner removal cleanup status update failed', finishError);
      throw new HttpError(502, 'Artwork is unpublished; stored-image cleanup status needs moderator follow-up');
    }
    return json({ ok: true, artworkId, status: 'removed', objectDeleted: true });
  } catch (error) {
    return fail(error);
  }
};
