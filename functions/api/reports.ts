import { bodyJson, clientFingerprint, Context, db, fail, HttpError, json, method, text, uuid } from '../_lib/core';

const REPORT_CATEGORIES = new Set([
  'prohibited-sexual-content', 'minor-or-ambiguous-age', 'non-consensual-or-deepfake',
  'copyright-rights', 'unlawful-content', 'other',
]);

export const onRequestPost = async (c: Context): Promise<Response> => {
  try {
    method(c, 'POST');
    const body = await bodyJson(c);
    const artworkId = uuid(body.artworkId, 'artworkId');
    const type = body.type;
    if (type !== 'content' && type !== 'takedown') throw new HttpError(400, 'Invalid request type');
    const category = text(body.category, 'category', 40, true);
    if (!REPORT_CATEGORIES.has(category)) throw new HttpError(400, 'Choose a valid report reason');
    const details = text(body.details ?? '', 'details', 2000);
    const contactEmail = text(body.contactEmail ?? '', 'contact email', 254);
    if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) throw new HttpError(400, 'Invalid contact email');

    const fingerprint = await clientFingerprint(c);
    const { data, error } = await db(c).rpc('kamna_submit_report', {
      p_artwork_id: artworkId,
      p_type: type,
      p_category: category,
      p_details: details || null,
      p_contact_email: contactEmail || null,
      p_fingerprint: fingerprint,
    });
    if (error) {
      const message = error.message || '';
      if (/rate limit/i.test(message)) throw new HttpError(429, 'Report limit reached. Please try again later.');
      if (/approved artwork/i.test(message)) throw new HttpError(404, 'Approved artwork not found');
      console.error('Report submission failed', error);
      throw new HttpError(503, 'The report service is temporarily unavailable. Please use the urgent contact path if someone may be at immediate risk.');
    }
    if (!data?.id) throw new HttpError(503, 'The report service did not return a receipt');
    return json({ id: data.id, status: 'open', receiptId: data.id, deduplicated: data.deduplicated === true }, data.deduplicated ? 200 : 201);
  } catch (error) {
    return fail(error);
  }
};
