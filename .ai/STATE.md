# Relay state

- **Active agent:** manus-1
- **Heartbeat (UTC):** 2026-11-09T12:46:10Z
- **Current task:** T-005 claimed — verify public deployment, SMTP, moderator access, and launch gates.
- **Takeover:** Owner explicitly confirmed and authorized this session to proceed after T-011; remote `main` and prior handoff were reviewed before claiming.
- **Verified:** Current install, typecheck, and build pass; existing Vite bundle warning remains. Supabase Kamna is healthy with five migrations and no security-advisor lints. Cloudflare Pages `kamna.pages.dev` exists but has zero deployments and null Preview/Production env-variable configuration. Vercel account profile reports Hobby; Vercel project/team API reads still return 403 after two owner-approved access links.
- **Architecture finding:** User requests Vercel static frontend with Cloudflare Pages Functions and Supabase backend. The current API client uses same-origin `/api/*`; external Vercel rewrites are supported by Vercel docs, but Cloudflare `functions/_lib/core.ts` currently rejects the forwarded Vercel `Origin` because it does not equal `kamna.pages.dev`. A production-origin allowlist or reviewed equivalent is required before the split works.
- **Next step:** Owner must choose paid Vercel Pro (or Enterprise) versus the repo's currently selected Cloudflare Pages frontend. Do not change billing. After that, resolve team-scope access, reconcile docs/config, configure production secrets through provider dashboards, and verify end-to-end launch gates.
- **Blockers:** Vercel Hobby is restricted to personal/non-commercial use; commercial usage requires Pro/Enterprise. Pro is $20 per developer seat/month before applicable taxes/usage. Cloudflare Pages has no deployment/runtime vars; production SMTP and moderator account are unverified. Do not call site live until flows pass; keep 18+ closed.
