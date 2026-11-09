import { supabase } from './supabase';

export type Artwork = {
  id: string;
  title: string;
  creator_id?: string;
  creator_name: string;
  handle: string;
  description?: string;
  tags: string[];
  category?: string;
  style?: string | null;
  audience_rating?: 'general' | 'adult';
  provenance_id?: string | null;
  ai_model?: string | null;
  ai_tool?: string | null;
  sensitive?: boolean;
  status?: string;
  created_at?: string;
  image_url: string | null;
};

export type Report = {
  id: string;
  artwork_id?: string;
  artworkId?: string;
  category?: string;
  details?: string;
  contact_email?: string;
  contactEmail?: string;
  type?: string;
  contact_type?: string;
  status?: string;
  created_at?: string;
};

function readableError(value: unknown): string {
  if (typeof value === 'string' && value.trim()) return value;
  if (value && typeof value === 'object') {
    const error = value as Record<string, unknown>;
    for (const key of ['error', 'message', 'msg', 'error_description']) {
      if (typeof error[key] === 'string' && error[key]) return error[key] as string;
    }
  }
  return 'The request could not be completed. Please try again.';
}

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const session = await supabase?.auth.getSession();
  const headers = new Headers(init.headers);
  if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (session?.data.session?.access_token) {
    headers.set('Authorization', `Bearer ${session.data.session.access_token}`);
  }

  let response: Response;
  try {
    const endpoint = path.startsWith('/api/') ? path : `/api/${path.replace(/^\//, '')}`;
    response = await fetch(endpoint, { ...init, headers });
  } catch {
    throw new ApiError('The service could not be reached. Please try again later.', 0);
  }

  const body: unknown = await response.json().catch(() => ({}));
  if (!response.ok) {
    const fallback = response.status === 401
      ? 'Please sign in to continue.'
      : `Request failed (${response.status}).`;
    throw new ApiError(readableError(body) || fallback, response.status);
  }
  return body as T;
}
