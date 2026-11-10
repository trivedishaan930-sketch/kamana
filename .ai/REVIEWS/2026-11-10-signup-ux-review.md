# Signup UX review — 2026-11-10

## Owner-reported acceptance evidence

The owner reported these four Step 3 checks passed in manual real-email testing:

1. Signup email received.
2. Confirmation link confirmed the account and automatic login worked.
3. A Supabase user record was created.
4. Forgot-password email set a new password and login with the new password worked.

Moderator access remains a separate check: sign in with the exact configured `KAMNA_ADMIN_EMAIL`, open `/moderation`, and confirm the moderation queue is available; a normal user must be denied. No secret value was requested or read.

## UX change

The signup response now uses the provider response safely:

- A session response gets a welcome-and-signed-in message.
- A new identity response gets a welcome message explaining that the confirmation link was sent and that opening it completes setup.
- An empty identity response gives sign-in/Forgot-password guidance for a possible existing account.

The app does not make an unconditional account-existence claim because auth providers intentionally avoid account enumeration. Resend confirmation is shown only when the provider reports a new pending identity.

## Validation

- `pnpm typecheck` passed.
- `pnpm build` passed; the existing Vite large-chunk warning is non-blocking.
- `git diff --check` passed.
