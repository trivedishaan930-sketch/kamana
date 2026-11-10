# Kamna context

Kamna is a premium discovery site for AI-generated art. Approved works receive a visible AI label and stable Kamna ID, and are free to view/download without signing in. Uploads require an account and human moderation. Indian tradition references must say works are AI-inspired interpretations, not traditional/community-created works. The separate 18+ collection stays closed.

**Stack:** Vite/React/TypeScript frontend; Cloudflare Pages Functions; Supabase Auth/Postgres/private Storage; SQL migrations under `supabase/migrations/`.

**Current task:** T-031 is documentation/workflow only: propose product and relay-system targets, configure the existing weekly dashboard Action, and leave target approval pending in `.ai/OWNER_QUESTIONS.md`. T-015 is complete and live. T-016 (search baseline) remains blocked until approved works exist. The 18+ collection stays closed; storage remains a separate directive.

**Where things live:** app in `src/`; APIs in `functions/`; migrations in `supabase/migrations/`; routes in `public/manus-routes.json`; product docs in `docs/product/`; relay records in `.ai/`.

**Ten key rules:** single writer; read state before work; claim one task; push small verified commits; no secrets; no unconnected systems; no policy bypass; keep app-code changes gated by roadmap approval; keep 18+ closed; record what was not verified.
