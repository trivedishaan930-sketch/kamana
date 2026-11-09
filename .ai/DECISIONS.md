# Decisions

1. **GitHub is the single source of truth.** Agents communicate through committed repository files and `main`; never force-push.
2. **Single-writer relay.** Exactly one agent may work at a time; a heartbeat younger than three hours blocks takeover.
3. **Firebase Storage is excluded.** It requires Blaze billing for the intended storage path.
4. **Cloudflare R2 stays off** until it can be enabled without a card and provider suitability is confirmed.
5. **The 18+ section stays closed** until provider policies, legal requirements, and stronger age controls are verified.
6. **Future storage waterfall is recorded, not implemented in this protocol change.** The proposed order is Supabase private (750 MiB app cap), ImageKit, then Backblaze B2, with provider recorded per artwork, 70% admin warning, 80% switch, read-back verification, no movement of existing files, WebP conversion, and a 3 MB limit. A later implementation must receive independent security review.
7. **The legacy research concept is archived.** `plan.md` and `TODO.md` are current; the archived concept is historical only.
8. **Owner-approved dashboard exception.** Prompt 2 requires a daily `.ai/DASHBOARD.md`; GitHub Actions may be its single automated writer. The workflow is serialized with a concurrency group, rebases before push, changes only that generated file, and is not an agent or a substitute for human task ownership/review.
