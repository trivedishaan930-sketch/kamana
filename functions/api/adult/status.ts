import { adultEnabled, Context, fail, json, method } from '../../_lib/core';

export const onRequestGet = async (c: Context): Promise<Response> => {
  try {
    method(c, 'GET');
    return json({ configured: adultEnabled(c) });
  } catch (error) {
    return fail(error);
  }
};
