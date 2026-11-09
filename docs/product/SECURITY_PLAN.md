# Security plan

Threats include unauthorized reads of pending art, cross-account edits, moderator privilege abuse, malicious files, prompt/input injection into metadata, report abuse, credential leakage, rate-limit exhaustion, and accidental exposure of personal contact data. The browser is untrusted. Every API must authenticate and authorize server-side; RLS must constrain database reads/writes; uploads must validate size, type, and bytes; and public reads must filter approved records.

The security checklist is: inspect RLS policies; test direct API calls for pending/removed IDs; validate MIME and magic bytes; cap fields and tags; rate-limit auth/upload/report endpoints; avoid logging personal data; keep service-role keys server-only; audit moderator actions with required reasons; test object cleanup; review dependencies; and document backups/restore. A security-sensitive change needs an independent reviewer and Security Auditor.

Storage is intentionally separate and unchanged by this document.

## Owner summary

Browser पर भरोसा नहीं किया जाएगा।
हर API पर server-side permission check होगा।
Pending artwork public नहीं होगा।
Secrets repo में नहीं होंगे।
Upload, rate limit, RLS और moderation की अलग जाँच होगी।

## References

[1]: https://www.meity.gov.in/static/uploads/2024/06/2bf1f0e9f04e6fb4f8fef35e82c42aa5.pdf "India Digital Personal Data Protection Act 2023, accessed 2026-11-09"
