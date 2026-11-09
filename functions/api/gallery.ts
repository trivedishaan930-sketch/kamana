import { adultEnabled, adultUser, CATEGORIES, Context, db, enumValue, fail, json, method, publicArtwork, requestParam, safeSearch, STYLES, signView, HttpError } from '../_lib/core';

export const onRequestGet = async (c: Context): Promise<Response> => {
  try {
    method(c, 'GET');
    const rating = requestParam(c, 'rating', 16) || 'general';
    if (rating !== 'general' && rating !== 'adult') throw new HttpError(400, 'Invalid audience rating');
    if (rating === 'adult') await adultUser(c);
    const categoryParam = requestParam(c, 'category', 48);
    const category = categoryParam ? enumValue(categoryParam, CATEGORIES, 'category') : '';
    const styleParam = requestParam(c, 'style', 48);
    const style = styleParam ? enumValue(styleParam, STYLES, 'style') : '';
    if (category === 'adult-fashion-swimwear' && rating !== 'adult') throw new HttpError(400, 'Adult artwork requires an adult audience request');
    if (rating === 'adult' && category && category !== 'adult-fashion-swimwear') throw new HttpError(400, 'The 18+ collection only contains Fashion & Swimwear');
    if (style && category && category !== 'indian-folk-traditional') throw new HttpError(400, 'Tradition filters only apply to Indian Folk & Traditional');

    const rawSearch = requestParam(c, 'search', 100);
    const search = safeSearch(rawSearch);
    const tag = requestParam(c, 'tag', 30).toLowerCase();
    const sort = requestParam(c, 'sort', 20) || 'latest';
    if (sort !== 'latest') throw new HttpError(400, 'Only latest-first sorting is available');
    const offset = Number(requestParam(c, 'offset', 8) || 0);
    const limit = Number(requestParam(c, 'limit', 8) || 24);
    if (!Number.isInteger(offset) || offset < 0 || offset > 10_000 || !Number.isInteger(limit) || limit < 1 || limit > 48) throw new HttpError(400, 'Invalid pagination');

    const client = db(c);
    let query = client.from('artworks')
      .select('id,provenance_id,creator_id,object_key,title,description,tags,category,style,audience_rating,ai_generated,ai_tool,ai_model,ai_disclosure,sensitive,status,created_at,profiles!artworks_creator_id_fkey(handle,display_name)', { count: 'exact' })
      .eq('status', 'approved')
      .eq('audience_rating', rating);
    if (category) query = query.eq('category', category);
    if (style) query = query.eq('style', style);
    if (tag) query = query.contains('tags', [tag]);
    if (search) {
      const [{ data: creators, error: profileError }] = await Promise.all([
        client.from('profiles').select('id').ilike('display_name', `%${search}%`).limit(50),
      ]);
      if (profileError) throw profileError;
      const creatorIds = (creators || []).map((item) => item.id);
      const terms = [`title.ilike.%${search}%`, `description.ilike.%${search}%`];
      if (!search.includes(' ')) terms.push(`tags.cs.{${search}}`);
      if (creatorIds.length) terms.push(`creator_id.in.(${creatorIds.join(',')})`);
      query = query.or(terms.join(','));
    }
    const { data, error, count } = await query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);
    if (error) throw error;
    const items = await Promise.all((data || []).map(async (row) => ({
      ...publicArtwork(row as unknown as Record<string, any>),
      image_url: await signView(c, row.object_key as string, 180),
    })));
    return json({ items, total: count || 0, offset, limit, configured: rating === 'adult' && adultEnabled(c) });
  } catch (error) {
    return fail(error);
  }
};
