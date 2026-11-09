# Kamna context

Kamna is a Gallery Ash, AI-art-only community gallery. Approved works are human-moderated, visibly AI-generated, assigned a stable Kamna ID, and downloadable for free. Indian tradition references must say they are AI-inspired interpretations, not traditional/community-created works. The separate 18+ collection is closed.

**Stack:** Vite/React/TypeScript frontend; Cloudflare Pages Functions; Supabase Auth/Postgres/private Storage; SQL migrations under `supabase/migrations/`.

**Current phase:** Phase 0 documentation and audit. Roadmap approval is still pending. Storage is a separate directive and must not be changed.

**Where things live:** app in `src/`; APIs in `functions/`; database migrations in `supabase/migrations/`; routes in `public/manus-routes.json`; product docs in `docs/product/`; relay records in `.ai/`.

**Ten key rules:** single writer; read state before work; claim one task; push small verified commits; no secrets; no unconnected systems; no policy bypass; no app code before roadmap approval; keep 18+ closed; record what was not verified.
