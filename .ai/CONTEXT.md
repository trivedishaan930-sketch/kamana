# Kamna context

Kamna is a premium discovery site for AI-generated art. Approved works receive a visible AI label and stable Kamna ID, and are free to view/download without signing in. Uploads require an account and human moderation. Indian tradition references must say works are AI-inspired interpretations, not traditional/community-created works. The separate 18+ collection stays closed.

**Stack:** Vite/React/TypeScript frontend; Cloudflare Pages Functions; Supabase Auth/Postgres/private Storage; SQL migrations under `supabase/migrations/`.

**Current task:** T-017 — implement a true responsive masonry gallery with lazy loading and smooth phone behavior. `manus-2`'s heartbeat was stale by >10 minutes and the prior T-017 claim (`ec07a70`) had no code; takeover by `manus-1` is recorded in `.ai/REVIEWS/2026-11-12-T017-stale-takeover-manus-1.md`. T-032 Proposal A home is complete at `de5b885`; review and providerless-preview limitations: `.ai/REVIEWS/2026-11-12-t032-implementation-review.md`. After T-017, remaining visual sprint order is T-033 artwork/profile/download, T-034 sign-in/upload, T-035 Gallery Ash accessibility polish. Measure performance/accessibility after UI exists. Do not fabricate approved artwork or wait for baselines.

**Gates:** T-010 remains open pending repository-level security screenshot; account-level settings and PAT deletion are owner-reported only. T-031 numeric target approval remains separate. Keep 18+ and monetization off; storage is a separate directive. Deploy only via existing GitHub Actions after checks pass; never direct-upload.

**Where things live:** app in `src/`; APIs in `functions/`; migrations in `supabase/migrations/`; routes in `public/manus-routes.json`; product docs in `docs/product/`; relay records in `.ai/`.

**Ten key rules:** single writer; read state before work; claim one task; push small verified commits; no secrets; no unconnected systems; no policy bypass; keep app-code changes within owner-approved scope; keep 18+ closed; record what was not verified.
