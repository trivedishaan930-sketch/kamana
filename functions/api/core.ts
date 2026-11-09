import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { S3Client, HeadObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createHmac, randomUUID } from 'node:crypto';

export type User = { id: string; email?: string };
export type Artwork = { id: string; creator_id: string; object_key: string; title: string; description: string; tags: string[]; model: string | null; prompt: string | null; sensitive: boolean; status: 'pending' | 'approved' | 'rejected' | 'removed'; created_at: string; updated_at: string };
export class HttpError extends Error { constructor(public status: number, message: string) { super(message); } }
const env = (key: string): string => { const value = process.env[key]; if (!value) throw new HttpError(503, `Server configuration missing: ${key}`); return value; };
export function json(res: VercelResponse, status: number, data: unknown): VercelResponse { return res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8').json(data); }
export function fail(res: VercelResponse, error: unknown): VercelResponse { if (error instanceof HttpError) return json(res, error.status, { error: error.message }); console.error('API failure', error); return json(res, 500, { error: 'Internal server error' }); }
export function sameOrigin(req: VercelRequest, res: VercelResponse): boolean {
  const origin = req.headers.origin;
  if (!origin) return true;
  try {
    const parsed = new URL(origin);
    const host = (req.headers['x-forwarded-host'] || req.headers.host || '').toString().split(',')[0].trim().toLowerCase();
    const proto = (req.headers['x-forwarded-proto'] || (req.headers.host?.toString().startsWith('localhost') ? 'http' : 'https')).toString().split(',')[0].trim().toLowerCase();
    if (parsed.host.toLowerCase() !== host || parsed.protocol !== `${proto}:`) return false;
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    return true;
  } catch { return false; }
}
export function method(req: VercelRequest, res: VercelResponse, expected: string): boolean {
  if (!sameOrigin(req, res)) { json(res, 403, { error: 'Cross-origin request denied' }); return false; }
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== expected) { res.setHeader('Allow', expected); json(res, 405, { error: 'Method not allowed' }); return false; }
  return true;
}
export function body(req: VercelRequest): Record<string, unknown> {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) throw new HttpError(400, 'Expected a JSON object');
  if (Buffer.byteLength(JSON.stringify(req.body), 'utf8') > 24_000) throw new HttpError(413, 'Request body too large');
  return req.body as Record<string, unknown>;
}
export function text(value: unknown, name: string, max: number, required = false): string {
  if (typeof value !== 'string' || (required && !value.trim()) || value.length > max) throw new HttpError(400, `Invalid ${name}`);
  return value.trim();
}
export function bool(value: unknown, name: string): boolean { if (typeof value !== 'boolean') throw new HttpError(400, `Invalid ${name}`); return value; }
export function uuid(value: unknown, name: string): string { if (typeof value !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) throw new HttpError(400, `Invalid ${name}`); return value; }
export function supabase(): SupabaseClient { return createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'), { auth: { persistSession: false, autoRefreshToken: false } }); }
export async function requireUser(req: VercelRequest): Promise<User> {
  const token = /^Bearer\s+([^\s]+)$/i.exec(req.headers.authorization || '')?.[1];
  if (!token) throw new HttpError(401, 'Authentication required');
  const { data, error } = await supabase().auth.getUser(token);
  if (error || !data.user) throw new HttpError(401, 'Invalid or expired session');
  return { id: data.user.id, email: data.user.email };
}
export async function requireModerator(req: VercelRequest): Promise<User> {
  const user = await requireUser(req); const allowed = env('KAMNA_ADMIN_EMAIL').toLowerCase().split(',').map(v => v.trim()).filter(Boolean);
  if (!user.email || !allowed.includes(user.email.toLowerCase())) throw new HttpError(403, 'Moderator access required');
  return user;
}
export function r2(): S3Client { return new S3Client({ region: 'auto', endpoint: `https://${env('R2_ACCOUNT_ID')}.r2.cloudflarestorage.com`, credentials: { accessKeyId: env('R2_ACCESS_KEY_ID'), secretAccessKey: env('R2_SECRET_ACCESS_KEY') } }); }
export const bucket = (): string => env('R2_BUCKET_NAME');
export async function signView(key: string, seconds = 180): Promise<string> { return getSignedUrl(r2(), new GetObjectCommand({ Bucket: bucket(), Key: key }), { expiresIn: seconds }); }
export async function signDownload(key: string, filename: string, seconds = 180): Promise<string> { const safe=filename.replace(/[^\p{L}\p{N} _-]/gu,'').slice(0,70)||'artwork'; return getSignedUrl(r2(),new GetObjectCommand({Bucket:bucket(),Key:key,ResponseContentDisposition:`attachment; filename=\"${safe}.image\"`}),{expiresIn:seconds}); }
export async function signUpload(key: string, type: string): Promise<string> { return getSignedUrl(r2(), new (await import('@aws-sdk/client-s3')).PutObjectCommand({ Bucket: bucket(), Key: key, ContentType: type }), { expiresIn: 300 }); }
export async function headObject(key: string) { return r2().send(new HeadObjectCommand({ Bucket: bucket(), Key: key })); }
export async function deleteObject(key: string): Promise<void> { await r2().send(new DeleteObjectCommand({ Bucket: bucket(), Key: key })); }
export const newId = (): string => randomUUID();
export function objectKeyOwned(key: unknown, owner: string): string { if (typeof key !== 'string' || !key.startsWith(`${owner}/`) || key.length > 180 || key.includes('..') || !/^([0-9a-f-]{36})\/[0-9a-f-]{36}\.(jpg|png|webp)$/.test(key)) throw new HttpError(400, 'Invalid upload object key'); return key; }
export function clientFingerprint(req: VercelRequest): string {
  const secret = env('KAMNA_RATE_LIMIT_SECRET'); const forwarded = req.headers['x-forwarded-for']; const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0])?.trim() || req.socket.remoteAddress || 'unknown';
  return createHmac('sha256', secret).update(ip).digest('hex');
}
export function validateTags(value: unknown): string[] { if (!Array.isArray(value) || value.length > 8 || value.some(t => typeof t !== 'string' || !t.trim() || t.trim().length > 30)) throw new HttpError(400, 'Invalid tags'); return [...new Set(value.map(t => (t as string).trim().toLowerCase()))]; }
export function queryText(value: unknown, name: string, max: number): string { if (value === undefined) return ''; if (typeof value !== 'string' || value.length > max) throw new HttpError(400, `Invalid ${name}`); return value.trim(); }
