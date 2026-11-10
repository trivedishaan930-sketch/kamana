# Kamna context

Kamna is a premium discovery site for AI-generated art. Approved works receive a visible AI label and stable Kamna ID, and are free to view/download without signing in. Uploads require an account and human moderation. Indian tradition references must say works are AI-inspired interpretations, not traditional/community-created works. The separate 18+ collection stays closed.

**Stack:** Vite/React/TypeScript frontend; Cloudflare Pages Functions; Supabase Auth/Postgres/private Storage; SQL migrations under `supabase/migrations/`.

**Current task:** T-014 is docs-only owner-brief and roadmap alignment plus a read-only report. The beta is deployed at `kamna.pages.dev`; T-005/Supabase Auth Step 3 is complete by owner-reported five-check evidence. Broader upload, moderation, report/removal, policy, and operational gates remain open. The latest owner request does not authorize app-code or live-configuration changes in this task. Storage remains a separate directive.

**Where things live:** app in `src/`; APIs in `functions/`; migrations in `supabase/migrations/`; routes in `public/manus-routes.json`; product docs in `docs/product/`; relay records in `.ai/`.

**Ten key rules:** single writer; read state before work; claim one task; push small verified commits; no secrets; no unconnected systems; no policy bypass; keep app-code changes gated by roadmap approval; keep 18+ closed; record what was not verified.
