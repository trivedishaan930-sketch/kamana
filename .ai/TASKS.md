# Relay tasks

| ID | Title | Status | Owner | Claimed at (UTC) | Notes |
|---|---|---|---|---|---|
| T-001 | Establish the AI relay protocol and sequential handoff rules | done | manus-1 | 2026-11-09T09:39:00Z | Independent final approval recorded; install, typecheck, build, guard, and boundary checks passed. |
| T-007 | Execute the master directive docs-only phase 0 audit and product documentation | doing | manus-1 | 2026-11-09T10:12:00Z | Storage and app code are out of scope until roadmap approval. |
| T-008 | Verify AI-tool repository conventions and maintain pointer files | done | manus-1 | 2026-11-09T10:14:00Z | Official sources recorded in `.ai/TOOLS.md`; unverified conventions are marked. |
| T-002 | Configure provider-backed auth, profiles, and account isolation | todo | unassigned | — | Keep open until real Supabase flows are verified. |
| T-003 | Complete artwork upload validation, provenance, and private storage | todo | unassigned | — | Real-provider verification required. |
| T-004 | Complete approved-only moderation, reports, takedowns, and audit trail | todo | unassigned | — | Security Auditor review required. |
| T-005 | Verify public deployment, SMTP, moderator access, and launch gates | todo | unassigned | — | Do not enable the 18+ section or call the site live prematurely. |
| T-006 | Multi-provider storage waterfall: Supabase private (cap 750 MiB), then ImageKit, then Backblaze B2 | todo | unassigned | — | Record provider per artwork row; switch at 80% usage; warn admin at 70%; read-back verify every upload; never move existing files; WebP conversion and 3 MB limit. Implement only after the decision and plan entries are approved. |
