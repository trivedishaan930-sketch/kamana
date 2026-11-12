# Kamna context

Kamna is a premium discovery site for AI-generated art. Approved works receive a visible AI label and stable Kamna ID, and are free to view/download without signing in. Uploads require an account and human moderation. Indian tradition references must say works are AI-inspired interpretations, not traditional/community-created works. The separate 18+ collection stays closed.

**Stack:** Vite/React/TypeScript frontend; Cloudflare Pages Functions; Supabase Auth/Postgres/private Storage; SQL migrations under `supabase/migrations/`.

**Current task:** T-033 — polish artwork detail, creator profile, and anonymous download. The latest ordered visual sprint is home (T-032 complete), responsive masonry (T-017 complete), artwork/profile/download (T-033 active), sign-in/upload (T-034 next), then Gallery Ash/accessibility polish (T-035). T-017's independent review, viewport evidence and CLS limitation are in `.ai/REVIEWS/2026-11-12-t017-implementation-review.md`. No provider-backed artwork was available. Keep approved-only APIs, public download of approved general-audience items, adult authorization, and stable provenance. Do not change storage/backend policy as part of visual work.

**Gates:** T-010 remains open pending repository-level security screenshot; account-level settings/PAT deletion are owner-reported only. T-031 numeric target approval remains separate. Keep 18+ and monetization off; storage is a separate directive. Deploy only via existing GitHub Actions after checks pass; never direct-upload. Measure speed/accessibility after UI exists.

**Where things live:** app in `src/`; APIs in `functions/`; migrations in `supabase/migrations/`; routes in `public/manus-routes.json`; product docs in `docs/product/`; relay records in `.ai/`.

**Ten key rules:** single writer; read state before work; claim one task; push small verified commits; no secrets; no unconnected systems; no policy bypass; keep app-code changes within owner-approved scope; keep 18+ closed; record what was not verified.
