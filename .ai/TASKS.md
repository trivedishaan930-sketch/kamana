# Relay tasks

| ID | Title | Status | Owner | Claimed at (UTC) | Notes |
|---|---|---|---|---|---|
| T-001 | Establish the AI relay protocol and sequential handoff rules | done | manus-1 | 2026-11-09T09:39:00Z | Independent final approval recorded; install, typecheck, build, guard, and boundary checks passed. |
| T-007 | Execute the master directive docs-only phase 0 audit and product documentation | done | manus-1 | 2026-11-09T10:12:00Z | Docs-only workstreams A/B/C completed; original roadmap approval recorded. |
| T-008 | Verify AI-tool repository conventions and maintain pointer files | done | manus-1 | 2026-11-09T10:14:00Z | Official sources recorded in `.ai/TOOLS.md`; unverified conventions are marked. |
| T-013 | Phase 0 weekly security audit and dependency update rhythm | todo | unassigned | — | Keep storage separate. |
| T-012 | Private beta with 5–10 real creators and accessibility/performance baseline | todo | unassigned | Requires owner approval and real participants. |
| T-011 | Reconcile sitemap with current routes and future approved route changes | done | manus-1 | 2026-11-09T12:10:00Z | Manifest and App.tsx parity verified; wildcard 404, query-search, and `/moderation` boundaries documented. |
| T-010 | Verify owner-only GitHub security settings | blocked | owner | — | Requires authenticated owner dashboard access. |
| T-009 | Draft and reconcile the phase 0/1 product documentation set | done | manus-1 | 2026-11-09T10:18:00Z | Docs only; routes distinguish current from planned; original roadmap approval recorded. |
| T-002 | Configure provider-backed auth, profiles, and account isolation | todo | unassigned | — | Keep open until real Supabase flows are verified. |
| T-003 | Complete artwork upload validation, provenance, and private storage | todo | unassigned | — | Real-provider verification required. |
| T-004 | Complete approved-only moderation, reports, takedowns, and audit trail | todo | unassigned | — | Security Auditor review required. |
| T-005 | Deploy Cloudflare production and complete Supabase Auth Step 3 | done | manus-1 | 2026-11-09T12:42:03Z | Upstream completion recorded in `1084b43` and status reconciliation in `83bdf23`. Owner confirmed signup receipt, confirmation/automatic login, Supabase user creation, password reset/new-password login, and moderator access. Broader upload/moderation/report/removal and operational gates remain open. |
| T-006 | Multi-provider storage waterfall: Supabase private (cap 750 MiB), then ImageKit, then Backblaze B2 | todo | unassigned | — | Record provider per artwork row; switch at 80% usage; warn admin at 70%; read-back verify every upload; never move existing files; implement only after separate approval and a separate storage directive. |
| T-014 | Rebase owner brief, roadmap, PRD and tasks; run requested read-only repo/live-site audit | in_progress | manus-2 | 2026-11-10T06:38:30Z | Stale manus-1 handoff taken over under owner-approved 10-minute rule; see `.ai/REVIEWS/2026-11-10-T014-takeover-manus-2.md`. Docs-only Part 1; Part 2 is a read-only chat report. |
| T-015 | First post-approval code task: correct the stale document title and meta description | todo | unassigned | — | Blocked until the owner approves the revised roadmap. Remove the old 18+ community description; describe general-audience AI-art discovery; keep 18+ closed; verify deployed head after approval. |
| T-016 | Measure search baseline and verify query correctness with approved works | todo | unassigned | — | After roadmap Yes and when real approved content is available, measure latency/relevance across title, creator, tags, categories, mobile, and empty states; set no numeric target before measurement. |
| T-017 | Implement and verify a true masonry gallery | todo | unassigned | — | After roadmap Yes and baseline. Preserve the nine current categories, stable IDs, labels, approved-only reads, and responsive breakpoints. App code remains untouched until approval. |
| T-018 | Measure mobile usability, accessibility, loading, and Core Web Vitals | todo | unassigned | — | After roadmap Yes; capture real-device baseline first, then propose numeric budgets. Do not invent thresholds. |
| T-019 | Improve category and search discovery from measured user feedback | todo | unassigned | — | After roadmap Yes and small private-beta evidence; keep tradition labels distinct and do not invent category demand. |
| T-020 | End-to-end verify anonymous view/download of an approved general-audience artwork | todo | unassigned | — | Requires an actual approved work and provider-backed evidence; never sign in for public route/download check. |
| T-021 | Prepare two distinct premium visual proposals and obtain independent rubric scores | todo | unassigned | — | Design only until owner approval; author cannot score their own proposal. Do not change app code here. |
