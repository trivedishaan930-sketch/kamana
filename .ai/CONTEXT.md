# Kamna context

Kamna is a premium discovery site for AI-generated art. Approved works receive a visible AI label and stable Kamna ID, and are free to view/download without signing in. Uploads require an account and human moderation. Indian tradition references must say works are AI-inspired interpretations, not traditional/community-created works. The separate 18+ collection stays closed.

**Stack:** Vite/React/TypeScript frontend; Cloudflare Pages Functions; Supabase Auth/Postgres/private Storage; SQL migrations under `supabase/migrations/`.

**Current task:** T-017 is in progress: implement the owner-ordered responsive masonry gallery, lazy loading and smooth phone behavior. T-032 Proposal A is complete, pushed as `de5b885ac68f9254cd7a86dca4d447d0bc72607b`, and its AI relay, Security analysis and Cloudflare Pages workflows succeeded; review and providerless-preview limits are in `.ai/REVIEWS/2026-11-12-t032-implementation-review.md`. Latest `origin/main` has a scorecard-only `0c61766` commit to preserve when pushing the T-017 claim. T-021 is complete. T-031 product-target approval remains separately pending and does not block visual work. T-015 is complete and live. Keep 18+ closed; storage remains a separate directive.

**Where things live:** app in `src/`; APIs in `functions/`; migrations in `supabase/migrations/`; routes in `public/manus-routes.json`; product docs in `docs/product/`; relay records in `.ai/`.

**Ten key rules:** single writer; read state before work; claim one task; push small verified commits; no secrets; no unconnected systems; no policy bypass; keep app-code changes gated by roadmap approval; keep 18+ closed; record what was not verified.
