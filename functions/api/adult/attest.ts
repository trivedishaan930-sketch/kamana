import { adultEnabled, bodyJson, Context, db, fail, HttpError, json, method, user } from '../../_lib/core';

export const onRequestPost = async (c: Context): Promise<Response> => {
  try {
    method(c, 'POST');
    if (!adultEnabled(c)) throw new HttpError(404, 'The 18+ collection is unavailable in this beta.');
    const current = await user(c);
    const body = await bodyJson(c);
    if (body.confirm !== true) throw new HttpError(400, 'Explicit adult-audience attestation is required.');
    const { error } = await db(c).from('profiles').update({ adult_attested_at: new Date().toISOString() }).eq('id', current.id);
    if (error) throw error;
    return json({ ok: true, attested: true });
  } catch (error) {
    return fail(error);
  }
};
