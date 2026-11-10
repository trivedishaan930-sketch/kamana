# Auth callback peer review — 2026-11-10

Independent read-only review inspected the T-005 client auth patch before commit.

Findings and fixes:

- High: callback exchange/OTP rejection could leave the form busy and create an unhandled rejection. Fixed with `try/catch/finally` and an actionable message.
- Medium: token-hash confirmation may use `type=signup`; fixed by accepting `email`, `signup`, and `recovery`, while keeping recovery mode separate.
- Low: query strings were decoded twice. Fixed by using the URLSearchParams value directly.
- Low: forged `confirmed=1`/`updated=1` URLs could show a false success claim. Copy is now neutral until a verified session/event or successful update supplies the success message.

The review found `useId()` prevents duplicate auth form IDs. BroadcastChannel/localStorage notices are informational and do not grant authentication. Real-provider email delivery and cross-device E2E remain unverified.
