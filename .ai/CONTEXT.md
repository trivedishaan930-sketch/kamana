# Kamna context

Kamna is a premium discovery site for AI-generated art. Approved works receive a visible AI label and stable Kamna ID, and are free to view/download without signing in. Uploads require an account and human moderation. Indian tradition references must say works are AI-inspired interpretations, not traditional/community-created works. The separate 18+ collection stays closed.

**Stack:** Vite/React/TypeScript frontend; Cloudflare Pages Functions; Supabase Auth/Postgres/private Storage; SQL migrations under `supabase/migrations/`.

**Current task:** T-032 is complete: Proposal A — Editorial Index home page implemented and locally verified on 2026-11-12. T-017, true responsive masonry, is next in the owner-ordered Visual Product Sprint and is not yet claimed. Local provider-backed artwork/empty-data behavior was not verified; see `.ai/REVIEWS/2026-11-12-t032-implementation-review.md`. T-021 is complete. T-031 product-target approval remains separately pending and does not block visual work. T-015 is complete and live. Keep 18+ closed; storage remains a separate directive.

**Where things live:** app in `src/`; APIs in `functions/`; migrations in `supabase/migrations/`; routes in `public/manus-routes.json`; product docs in `docs/product/`; relay records in `.ai/`.

**Ten key rules:** single writer; read state before work; claim one task; push small verified commits; no secrets; no unconnected systems; no policy bypass; keep app-code changes gated by roadmap approval; keep 18+ closed; record what was not verified.
