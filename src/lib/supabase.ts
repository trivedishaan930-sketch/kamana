import { createClient, type Session } from '@supabase/supabase-js';

const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
const url = env?.VITE_SUPABASE_URL;
const anonKey = env?.VITE_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(url && anonKey);
export const supabase = url && anonKey
  ? createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export type { Session };

export async function getSession(): Promise<Session | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function getPublicProfile(
  handle: string,
): Promise<{ handle: string; display_name: string | null; bio: string | null } | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('handle,display_name,bio')
    .eq('handle', handle)
    .maybeSingle();
  if (error) throw error;
  return data;
}
