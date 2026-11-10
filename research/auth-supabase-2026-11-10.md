# Supabase auth flow evidence — 2026-11-10

These implementation notes use official Supabase JavaScript documentation accessed on 2026-11-10.

- Password recovery uses `resetPasswordForEmail(email, { redirectTo })`; after the redirect, the app should present a change-password page and call `updateUser({ password })`.
- Supabase emits `PASSWORD_RECOVERY` through `onAuthStateChange` when a recovery link is opened. Auth events are also emitted across browser tabs for a shared client storage context.
- Signup confirmation resend uses `auth.resend({ type: 'signup', email, options: { emailRedirectTo } })`.
- Signup accepts `options.emailRedirectTo`; the app uses a confirmation marker only as a neutral post-redirect hint and relies on the verified auth event/session for success behavior.

Sources:

- https://supabase.com/docs/guides/auth/passwords — Password reset flow and redirect/update sequence, accessed 2026-11-10.
- https://supabase.com/docs/reference/javascript/auth-onauthstatechange — `PASSWORD_RECOVERY`, session events, and cross-tab event behavior, accessed 2026-11-10.
- https://supabase.com/docs/reference/javascript/auth-resend — signup confirmation resend and recovery method distinction, accessed 2026-11-10.
- https://supabase.com/docs/reference/javascript/auth-signup — email signup redirect option, accessed 2026-11-10.
- https://supabase.com/docs/reference/javascript/auth-updateuser — authenticated password update, accessed 2026-11-10.
