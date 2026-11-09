# Relay tasks

| ID | Title | Status | Owner | Claimed at (UTC) | Notes |
|---|---|---|---|---|---|
| T-001 | Establish the AI relay protocol and sequential handoff rules | done | manus-1 | 2026-11-09T09:39:00Z | Independent final approval recorded; install, typecheck, build, guard, and boundary checks passed. |
| T-007 | Execute the master directive docs-only phase 0 audit and product documentation | done | manus-1 | 2026-11-09T10:12:00Z | Docs-only workstreams A/B/C completed; owner roadmap approval recorded. |
| T-008 | Verify AI-tool repository conventions and maintain pointer files | done | manus-1 | 2026-11-09T10:14:00Z | Official sources recorded in `.ai/TOOLS.md`; unverified conventions are marked. |
| T-013 | Phase 0 weekly security audit and dependency update rhythm | todo | unassigned | — | Keep storage separate. |
| T-012 | Private beta with 5–10 real creators and accessibility/performance baseline | todo | unassigned | Requires owner approval and real participants. |
| T-011 | Reconcile sitemap against current routes and future approved route changes | done | manus-1 | 2026-11-09T12:10:00Z | Manifest and App.tsx parity verified; wildcard 404, query-search, and `/moderation` boundaries documented. |
| T-010 | Verify owner-only GitHub security settings | blocked | owner | — | Requires authenticated owner dashboard access. |
| T-009 | Draft and reconcile the phase 0/1 product documentation set | done | manus-1 | 2026-11-09T10:18:00Z | Docs only; routes distinguish current from planned; owner approval recorded. |
| T-002 | Configure provider-backed auth, profiles, and account isolation | todo | unassigned | — | Keep open until real Supabase flows are verified. |
| T-003 | Complete artwork upload validation, provenance, and private storage | todo | unassigned | — | Real-provider verification required. |
| T-004 | Complete approved-only moderation, reports, takedowns, and audit trail | todo | unassigned | — | Security Auditor review required. |
| T-005 | Deploy Cloudflare production and complete Supabase Auth Step 3 | in_progress | manus-1 | 2026-11-09T12:42:03Z | Owner now explicitly authorizes checking credentials, enabling the deploy gate, deploying via GitHub Actions, and completing Step 3. Cloudflare API confirms Production runtime names present and adult flag false, Preview runtime names absent; project is Direct Upload with no deployments. Workflow command/output path are correct; known CI `42621146863` passed build/typecheck and skipped deploy when gate was unset. Latest Actions/secrets cannot be inspected because GitHub REST currently returns 404; browser is signed out and My Browser connector is disabled. Next Manus: obtain authorized GitHub Actions access; verify secret names and Pages:Edit permission without values; set gate; run workflow; verify production root/signin; use authorized test inbox to verify signup, Brevo confirmation and `/signin`; compare moderator email to allowlist without revealing either. No deployment or config mutation has yet occurred. Keep 18+ off. Handoff details in `.ai/STATE.md`.
| T-006 | Multi-provider storage waterfall: Supabase private (cap 750 MiB), then ImageKit, then Backblaze B2 | todo | unassigned | — | Record provider per artwork row; switch at 80% usage; warn admin at 70%; read-back verify every upload; never move existing files; implement only after separate approval. |
