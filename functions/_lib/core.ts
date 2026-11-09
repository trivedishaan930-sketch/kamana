import { createClient, type SupabaseClient, type User as SupabaseUser } from '@supabase/supabase-js';

export type Env = Record<string, string | undefined>;
export type Context = {
  request: Request;
  env: Env;
  params: Record<string, string | undefined>;
};
export type KamnaUser = Pick<SupabaseUser, 'id' | 'email' | 'email_confirmed_at'>;

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'HttpError';
  }
}

const STORAGE_BUCKET = 'kamna-art';
const MAX_JSON_BYTES = 24_000;
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
export const CATEGORIES = [
  'general-illustration', 'festival-celebration', 'nature-wildlife',
  'fantasy-mythology', 'portrait-character', 'fashion-editorial',
  'architecture-places', 'abstract-experimental', 'indian-folk-traditional',
  'adult-fashion-swimwear',
] as const;
export const STYLES = [
  'madhubani', 'warli', 'gond', 'odisha-pattachitra', 'rajasthani-phad',
  'kalamkari-srikalahasti', 'kalamkari-machilipatnam-pedana', 'cheriyal',
  'thanjavur-tanjore', 'other',
] as const;

function setting(c: Context, name: string): string {
  const value = c.env[name];
  if (!value?.trim()) throw new HttpError(503, 'The service is not configured yet. Please try again later.');
  return value.trim();
}

export function db(c: Context): SupabaseClient {
  return createClient(setting(c, 'SUPABASE_URL'), setting(c, 'SUPABASE_SERVICE_ROLE_KEY'), {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

export function adultEnabled(c: Context): boolean {
  return c.env.ADULT_SECTION_ENABLED?.trim().toLowerCase() === 'true';
}

export function json(data: unknown, status = 200, extraHeaders?: HeadersInit): Response {
  const headers = new Headers(extraHeaders);
  headers.set('Content-Type', 'application/json; charset=utf-8');
  headers.set('Cache-Control', 'no-store');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'same-origin');
  return new Response(JSON.stringify(data), { status, headers });
}

export function fail(error: unknown): Response {
  if (error instanceof HttpError) return json({ error: error.message }, error.status);
  console.error('Kamna API failure', error);
  return json({ error: 'The request could not be completed. Please try again later.' }, 500);
}

export function method(c: Context, expected: string): void {
  const { request } = c;
  const url = new URL(request.url);
  const origin = request.headers.get('Origin');
  if (origin) {
    try {
      if (new URL(origin).origin !== url.origin) throw new HttpError(403, 'Cross-origin request denied');
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new HttpError(403, 'Cross-origin request denied');
    }
  } else if (expected !== 'GET' && expected !== 'HEAD') {
    throw new HttpError(403, 'A same-origin request is required');
  }
  if (request.method !== expected) throw new HttpError(405, `Method ${expected} required`);
}

export async function bodyJson(c: Context): Promise<Record<string, unknown>> {
  const contentLength = Number(c.request.headers.get('Content-Length') || '0');
  if (contentLength > MAX_JSON_BYTES) throw new HttpError(413, 'Request body is too large');
  let value: unknown;
  try { value = await c.request.json(); } catch { throw new HttpError(400, 'A valid JSON object is required'); }
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new HttpError(400, 'A JSON object is required');
  if (new TextEncoder().encode(JSON.stringify(value)).byteLength > MAX_JSON_BYTES) throw new HttpError(413, 'Request body is too large');
  return value as Record<string, unknown>;
}

export function text(value: unknown, name: string, max: number, required = false): string {
  if (typeof value !== 'string') {
    if (required) throw new HttpError(400, `Invalid ${name}`);
    return '';
  }
  const normalized = value.trim();
  if ((required && !normalized) || normalized.length > max) throw new HttpError(400, `Invalid ${name}`);
  return normalized;
}

export function uuid(value: unknown, name: string): string {
  if (typeof value !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) {
    throw new HttpError(400, `Invalid ${name}`);
  }
  return value;
}

export function tags(value: unknown): string[] {
  if (!Array.isArray(value) || value.length > 8 || value.some((tag) => typeof tag !== 'string' || !tag.trim() || tag.trim().length > 30)) {
    throw new HttpError(400, 'Invalid tags');
  }
  return [...new Set(value.map((tag) => (tag as string).trim().toLowerCase()))];
}

export function enumValue<T extends readonly string[]>(value: unknown, choices: T, name: string): T[number] {
  if (typeof value !== 'string' || !choices.includes(value)) throw new HttpError(400, `Invalid ${name}`);
  return value;
}

export async function user(c: Context): Promise<KamnaUser> {
  const token = /^Bearer\s+([^\s]+)$/i.exec(c.request.headers.get('Authorization') || '')?.[1];
  if (!token) throw new HttpError(401, 'Sign in with a confirmed account to continue.');
  const { data, error } = await db(c).auth.getUser(token);
  if (error || !data.user) throw new HttpError(401, 'Your session is invalid or has expired. Please sign in again.');
  if (!data.user.email || !data.user.email_confirmed_at) throw new HttpError(403, 'Confirm your email before continuing.');
  return { id: data.user.id, email: data.user.email, email_confirmed_at: data.user.email_confirmed_at };
}

export async function moderator(c: Context): Promise<KamnaUser> {
  const current = await user(c);
  const allowed = setting(c, 'KAMNA_ADMIN_EMAIL').split(',').map((email) => email.trim().toLowerCase()).filter(Boolean);
  if (!current.email || !allowed.includes(current.email.toLowerCase())) throw new HttpError(403, 'Moderator access required.');
  return current;
}

export async function adultUser(c: Context): Promise<KamnaUser> {
  if (!adultEnabled(c)) throw new HttpError(404, 'The 18+ collection is unavailable in this beta.');
  const current = await user(c);
  const { data, error } = await db(c).from('profiles').select('adult_attested_at').eq('id', current.id).maybeSingle();
  if (error) throw error;
  if (!data?.adult_attested_at) throw new HttpError(403, 'Complete the adult-audience attestation before viewing this collection.');
  return current;
}

export async function storePut(c: Context, key: string, bytes: Uint8Array, mime: string, metadata: Record<string, string>): Promise<void> {
  const { error } = await db(c).storage.from(STORAGE_BUCKET).upload(key, bytes, {
    contentType: mime,
    cacheControl: '0',
    upsert: false,
    metadata,
  });
  if (error) throw error;
}

export async function storeDelete(c: Context, key: string): Promise<void> {
  const { error } = await db(c).storage.from(STORAGE_BUCKET).remove([key]);
  if (error) throw error;
}

export async function signView(c: Context, key: string, seconds = 180, download?: string): Promise<string> {
  const options = download ? { download } : undefined;
  const { data, error } = await db(c).storage.from(STORAGE_BUCKET).createSignedUrl(key, seconds, options);
  if (error || !data?.signedUrl) throw error || new Error('Storage did not return a signed URL');
  return data.signedUrl;
}

export async function clientFingerprint(c: Context): Promise<string> {
  const ip = c.request.headers.get('CF-Connecting-IP')?.trim() || 'unknown';
  const secret = setting(c, 'KAMNA_RATE_LIMIT_SECRET');
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(ip)));
  return Array.from(signature, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function requestParam(c: Context, name: string, max: number): string {
  const value = new URL(c.request.url).searchParams.get(name) || '';
  if (value.length > max) throw new HttpError(400, `Invalid ${name}`);
  return value.trim();
}

export function safeSearch(value: string): string {
  return value.normalize('NFKC').replace(/[^\p{L}\p{N}\s-]/gu, ' ').replace(/\s+/g, ' ').trim().slice(0, 100);
}

export function publicArtwork(row: Record<string, any>): Record<string, unknown> {
  const relation = row.profiles as { handle?: string; display_name?: string } | Array<{ handle?: string; display_name?: string }> | null;
  const profile = Array.isArray(relation) ? relation[0] : relation;
  return {
    id: row.id,
    provenance_id: row.provenance_id,
    creator_id: row.creator_id,
    title: row.title,
    description: row.description,
    tags: row.tags || [],
    category: row.category,
    style: row.style,
    audience_rating: row.audience_rating,
    ai_generated: row.ai_generated === true,
    ai_tool: row.ai_tool,
    ai_model: row.ai_model,
    ai_disclosure: row.ai_disclosure,
    sensitive: row.sensitive,
    status: row.status,
    created_at: row.created_at,
    creator_name: profile?.display_name || 'Creator',
    handle: profile?.handle || '',
  };
}

export function imageExtension(objectKey: string): string {
  const extension = objectKey.split('.').pop()?.toLowerCase();
  return extension === 'png' || extension === 'webp' ? extension : 'jpg';
}
