import { bodyJson, Context, db, fail, HttpError, json, method, moderator, storeDelete, text, uuid } from '../../_lib/core';

export const onRequestPost = async (c: Context): Promise<Response> => {
  try {
    method(c, 'POST');
    const actor = await moderator(c);
    const body = await bodyJson(c);
    const reason = text(body.reason ?? '', 'reason', 500);
    const client = db(c);

    if (body.artworkId !== undefined) {
      const artworkId = uuid(body.artworkId, 'artworkId');
      const action = body.action;
      if (action === 'retry_cleanup') {
        const { data, error } = await client.rpc('kamna_retry_cleanup', { p_artwork_id: artworkId, p_actor_id: actor.id, p_reason: reason || null });
        if (error) {
          if (/not found|no cleanup/i.test(error.message || '')) throw new HttpError(409, 'No pending image cleanup exists for this artwork');
          throw error;
        }
        try { await storeDelete(c, data.object_key); }
        catch (error) {
          console.error('Moderator cleanup retry failed', error);
          throw new HttpError(502, 'Image cleanup is still pending; retry again later');
        }
        const { error: finishError } = await client.rpc('kamna_finish_cleanup', { p_artwork_id: artworkId });
        if (finishError) throw finishError;
        return json({ ok: true, artworkId, action: 'retry_cleanup' });
      }
      if (action !== 'approve' && action !== 'reject' && action !== 'remove') throw new HttpError(400, 'Invalid artwork action');
      const { data, error } = await client.rpc('kamna_moderate_artwork', {
        p_artwork_id: artworkId,
        p_actor_id: actor.id,
        p_action: action,
        p_reason: reason || null,
      });
      if (error) {
        if (/not found/i.test(error.message || '')) throw new HttpError(404, 'Artwork not found');
        if (/only pending|already unavailable/i.test(error.message || '')) throw new HttpError(409, 'Artwork is no longer in a reviewable state');
        throw error;
      }
      if (action !== 'approve') {
        try { await storeDelete(c, data.object_key); }
        catch (error) {
          console.error('Moderation object cleanup failed', error);
          throw new HttpError(502, 'Artwork is unpublished, but image cleanup is pending; retry required');
        }
        const { error: finishError } = await client.rpc('kamna_finish_cleanup', { p_artwork_id: artworkId });
        if (finishError) throw finishError;
      }
      return json({ ok: true, artworkId, action });
    }

    if (body.reportId !== undefined) {
      const reportId = uuid(body.reportId, 'reportId');
      const action = body.action;
      if (action !== 'resolve' && action !== 'reject') throw new HttpError(400, 'Invalid report action');
      const { error } = await client.rpc('kamna_update_report', {
        p_report_id: reportId,
        p_actor_id: actor.id,
        p_action: action,
        p_reason: reason || null,
      });
      if (error) {
        if (/not found|not open/i.test(error.message || '')) throw new HttpError(404, 'Open report not found');
        throw error;
      }
      return json({ ok: true, reportId, action });
    }
    throw new HttpError(400, 'artworkId or reportId is required');
  } catch (error) {
    return fail(error);
  }
};
