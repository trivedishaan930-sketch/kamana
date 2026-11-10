# Kamna authentication upgrade — 2026-11-10

## Findings applied

Supabase documents password recovery as a two-step flow: send a recovery link with `resetPasswordForEmail`, then show a dedicated change-password page and call `updateUser({ password })`. Supabase also emits a `PASSWORD_RECOVERY` auth event when a recovery link is opened. Kamna's previous implementation sent the recovery link back to `/signin` without a recovery route marker, then treated every PKCE `?code=` as an email-confirmation callback and navigated to the account page. The fix sends recovery links to `/signin?mode=reset`, distinguishes recovery PKCE callbacks from signup confirmation callbacks, exchanges the code, and keeps the user on a dedicated new-password form.

The reset form now requires the password twice, supports show/hide controls, accepts long passphrases up to 128 characters, and displays a length-oriented strength hint. It does not automatically reveal whether an email exists. Signup, sign-in, resend-confirmation, and password-reset request messages remain generic to reduce account enumeration.

## Security decisions

- Use a consistent password-reset response for existing and non-existing accounts.
- Keep the recovery token in Supabase's flow; do not create a custom token or store credentials in the application.
- Do not put personal moderator email or provider secrets in the repository.
- Keep 18+ disabled.
- Passkeys and MFA are planned follow-ups, not partially implemented in this patch. They require complete enrollment, challenge/verification, recovery, session assurance, and server-side authorization—not just a button in the UI.

## Sources

- [1]: https://supabase.com/docs/guides/auth/passwords "Supabase Password-based Auth"
- [2]: https://supabase.com/docs/reference/javascript/auth-resetpasswordforemail "Supabase JavaScript resetPasswordForEmail"
- [3]: https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html "OWASP Forgot Password Cheat Sheet"
- [4]: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html "OWASP Authentication Cheat Sheet"
- [5]: https://developer.mozilla.org/en-US/docs/Web/Security/Authentication/Passkeys "MDN Passkeys"
- [6]: https://supabase.com/docs/guides/auth/auth-mfa "Supabase Auth MFA"
