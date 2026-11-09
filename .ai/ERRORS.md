# Errors (blameless, tracked)

No errors found during the 2026-11-09 relay handoff review. The existing Vite bundle-size warning is non-blocking and is recorded in the review evidence.

| Date (UTC) | What | Cause | Fix | Prevention |
|---|---|---|---|---|
| 2026-11-09T10:01:00Z | Secret guard flagged the documented `.dev.vars.example` placeholder | The pattern check included example configuration files | Excluded `.env.example` and `.dev.vars.example` while retaining exact non-example env-file rejection and credential-pattern checks | Keep placeholder examples explicit and test guard rules against tracked examples |
| 2026-11-09T09:53:00Z | Initial self-review and dashboard writer could conflict with relay rules | The first review was authored by the change owner and dashboard serialization was not explicit | Added an independent review record, documented the owner-approved dashboard exception, and serialized/rebased dashboard writes | Require independent review and concurrency/rebase controls before marking relay work complete |
| 2026-11-09T18:41:10Z | Could not set `CF_PAGES_DEPLOY_ENABLED` through the authenticated GitHub CLI | GitHub Actions variables endpoint returned HTTP 403 `Resource not accessible by integration`; repo metadata still reports admin/push access | Stop without bypassing; owner must set the non-secret variable in GitHub Settings, then the agent can dispatch and verify the existing workflow | Treat Actions settings API access as a separate capability from repository push access; never replace a gated deploy with a direct provider upload |
