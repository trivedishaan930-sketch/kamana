# Relay tasks

| ID | Title | Status | Owner | Claimed at (UTC) | Notes |
|---|---|---|---|---|---|
| T-001 | Establish the AI relay protocol and sequential handoff rules | done | manus-1 | 2026-11-09T09:39:00Z | Independent final approval recorded; install, typecheck, build, guard, and boundary checks passed. |
| T-007 | Execute the master directive docs-only phase 0 audit and product documentation | done | manus-1 | 2026-11-09T10:12:00Z | Docs-only workstreams A/B/C completed; original roadmap approval recorded. |
| T-008 | Verify AI-tool repository conventions and maintain pointer files | done | manus-1 | 2026-11-09T10:14:00Z | Official sources recorded in `.ai/TOOLS.md`; unverified conventions are marked. |
| T-013 | Phase 0 weekly security audit and dependency update rhythm | todo | unassigned | — | Keep storage separate. |
| T-012 | Private beta with 5–10 real creators and accessibility/performance baseline | todo | unassigned | Requires real participants; do not substitute AI research. |
| T-011 | Reconcile sitemap with current routes and future approved route changes | done | manus-1 | 2026-11-09T12:10:00Z | Manifest and App.tsx parity verified; wildcard 404, query-search, and `/moderation` boundaries documented. |
| T-010 | Verify owner-only GitHub security settings | blocked | owner | — | Owner reports old PAT deleted/token list empty and account-level Dependabot alerts and push protection on. Owner-level report only; repository-level screenshot still pending. Keep open until screenshot confirms repo-level status. |
| T-009 | Draft and reconcile the phase 0/1 product documentation set | done | manus-1 | 2026-11-09T10:18:00Z | Docs only; routes distinguish current from planned; original roadmap approval recorded. |
| T-002 | Configure provider-backed auth, profiles, and account isolation | todo | unassigned | — | Keep open until real Supabase flows are verified. |
| T-003 | Complete artwork upload validation, provenance, and private storage | todo | unassigned | — | Real-provider verification required. |
| T-004 | Complete approved-only moderation, reports, takedowns, and audit trail | todo | unassigned | — | Security Auditor review required. |
| T-005 | Deploy Cloudflare production and complete Supabase Auth Step 3 | done | manus-1 | 2026-11-09T12:42:03Z | Upstream completion recorded in `1084b43` and `83bdf23`; broader upload/moderation/report/removal gates remain open. |
| T-006 | Multi-provider storage waterfall: Supabase private (cap 750 MiB), then ImageKit, then Backblaze B2 | todo | unassigned | — | Separate storage directive required; record provider, quotas and read-back verification; never move existing files. |
| T-014 | Rebase owner brief, roadmap, PRD and tasks; run requested read-only repo/live-site audit | done | manus-2 | 2026-11-10T06:38:30Z | Completed; commits `7254355`, `bd51fe6`, `2f1fe57`. |
| T-015 | Historical first implementation task: correct stale page title and meta description | done | manus-2 | 2026-11-10T07:34:32Z | Completed and deployed in `af4bb84`; historical task superseded in order by visual sprint. |
| T-016 | Measure search baseline and verify query correctness with approved works | todo | unassigned | — | Do not gate UI work on this. Measure after visual UI exists; approved works needed for real relevance/latency evidence. No invented budget. |
| T-017 | Implement and verify a true responsive masonry gallery | in_progress | manus-1 | 2026-11-12T04:18:59Z | Resumed after stale manus-2 heartbeat; prior `ec07a70` was claim-only. Preserve nine categories, reading order, provenance, approved-only reads; lazy-load and verify phone behavior. |
| T-018 | Measure mobile usability, accessibility, loading and Core Web Vitals | todo | unassigned | — | Measure after visual UI exists; capture actual baselines before setting budgets. |
| T-019 | Improve category/search discovery from measured user feedback | todo | unassigned | — | After private-beta evidence; preserve distinct Indian tradition labels. |
| T-020 | Verify anonymous view/download with an actual approved general-audience artwork | todo | unassigned | — | Requires real approved work and provider-backed E2E evidence; never sign in for public check. |
| T-021 | Prepare two distinct visual proposals and obtain independent rubric scores | done | manus-2 | 2026-11-11T13:26:18Z | Independent scores; Proposal A selected. See `.ai/REVIEWS/2026-11-11-t021-proposal-scores.md`. |
| T-022 | Record approved roadmap additions and relay governance clarifications | done | manus-2 | 2026-11-10T07:10:00Z | Docs-only; no app code/storage changed. |
| T-023 | Plan content seeding for first 50–100 rights-cleared approved works | todo | unassigned | — | Rights-cleared owner work/invited creators; identical human review; distinct opt-in commercial-print license. Planning only. |
| T-024 | Fix reported mobile UX and signed-out upload presentation | todo | unassigned | — | Integrate with T-034: compact form, spacing, no provider jargon, clear sign-in prompt; preserve safeguards. |
| T-025 | Make moderation reasons mandatory and align staff route with spec | todo | unassigned | — | Security-sensitive; Security Auditor review required. |
| T-026 | Add CODEOWNERS, protected-path CI guard, and full-SHA Action pins | todo | unassigned | — | Verify SHAs and test protected-path guard. |
| T-027 | Add changelog and written release rollback plan | todo | unassigned | — | Include frontend/functions rollback and migration constraints. |
| T-028 | Add lint, unit, E2E, accessibility and Lighthouse gates after baselines | todo | unassigned | — | Baseline first; no invented thresholds. |
| T-029 | Resolve stale-lock threshold | done | manus-2 | 2026-11-10T07:28:49Z | Owner confirmed 10 minutes; `AGENTS.md` is sole rule. |
| T-030 | Preserve unknown attribution for historic reviews | done | manus-2 | 2026-11-10T07:12:00Z | Historic reviewer identities remain unknown. |
| T-031 | Product targets and weekly scorecard | blocked | owner | — | Separate Yes/No pending; visual-priority override does not approve targets. |
| T-032 | Visual sprint step 1: compact, search-led home page | done | manus-2 | 2026-11-11T13:37:19Z | Proposal A implemented and locally verified; provider-backed works and real network loading remain unverified. |
| T-033 | Visual sprint step 3: artwork, creator and anonymous download pages | todo | unassigned | — | Polish detail/profile and anonymous approved general-audience download; preserve rights, AI label and provenance. |
| T-034 | Visual sprint step 4: compact sign-in and upload experience | todo | unassigned | — | Form first, clear signed-out sign-in/create-account prompt, mobile spacing, no public provider jargon; preserve auth/rights/review. |
| T-035 | Visual sprint step 5: Gallery Ash design/accessibility polish | todo | unassigned | — | Verify keyboard/focus, contrast, labels, touch targets, alt and reduced motion; measure after UI exists. |
