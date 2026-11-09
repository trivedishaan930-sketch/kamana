# Decisions

1. **GitHub is the single source of truth.** Agents communicate through committed repository files and `main`; never force-push.
2. **Single-writer relay.** Exactly one agent may work at a time; a heartbeat younger than three hours blocks takeover.
3. **Firebase Storage is excluded.** It requires Blaze billing for the intended storage path.
4. **Cloudflare R2 stays off** until it can be enabled without a card and provider suitability is confirmed.
5. **The 18+ section stays closed** until provider policies, legal requirements, and stronger age controls are verified.
6. **Future storage waterfall is recorded, not implemented in this protocol change.** The proposed order is Supabase private (750 MiB app cap), ImageKit, then Backblaze B2, with provider recorded per artwork, 70% admin warning, 80% switch, read-back verification, no movement of existing files, WebP conversion, and a 3 MB limit. A later implementation must receive independent security review.
7. **The legacy research concept is archived.** `plan.md` and `TODO.md` are current; the archived concept is historical only.
8. **Owner-approved dashboard exception.** Prompt 2 requires a daily `.ai/DASHBOARD.md`; GitHub Actions may be its single automated writer. The workflow is serialized with a concurrency group, rebases before push, changes only that generated file, and is not an agent or a substitute for human task ownership/review.

12. **Owner-directed hosting split (2026-11-09):** Owner explicitly requested the visible frontend be hosted on Vercel, with API/backend functions on Cloudflare and authentication/database on Supabase. This updates the earlier Cloudflare Pages full-stack default only after feasibility and provider-policy checks; preserve the existing Cloudflare Pages Functions API and Supabase private-storage design. Use a same-origin Vercel rewrite/proxy to `kamna.pages.dev/api/*` (or a reviewed equivalent) so the existing browser API client and Authorization headers continue to work; do not expose privileged credentials to Vercel/browser. Vercel team access is not yet confirmed (403 remains), Cloudflare Pages has no deployments or runtime variables, and the Vercel plan/terms and launch gates are unverified. Do not call the site live until real flows pass; keep 18+ closed.
