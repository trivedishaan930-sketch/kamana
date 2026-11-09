# Errors (blameless, tracked)

No errors found during the 2026-11-09 relay handoff review. The existing Vite bundle-size warning is non-blocking and is recorded in the review evidence.

| Date (UTC) | What | Cause | Fix | Prevention |
|---|---|---|---|---|
| 2026-11-09T10:01:00Z | Secret guard flagged the documented `.dev.vars.example` placeholder | The pattern check included example configuration files | Excluded `.env.example` and `.dev.vars.example` while retaining exact non-example env-file rejection and credential-pattern checks | Keep placeholder examples explicit and test guard rules against tracked examples |
