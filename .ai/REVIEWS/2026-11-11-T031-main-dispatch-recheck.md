# T-031 review — main-ref dispatch safeguard

- **Task ID (T-###):** T-031
- **Change/commit:** Uncommitted scorecard workflow draft, reviewed 2026-11-11
- **Author agent:** manus-2
- **Author tool/account:** Manus Sandbox `8tivKkwMPGs45mRsxpsfoz`
- **Reviewer agent:** `job_sjITEK4l` (read-only Manus subagent)
- **Reviewer tool/account:** Manus subagent in the same Manus Sandbox/account session
- **Truly independent:** no
- **Independence evidence:** This was a separate subagent job but not a separate Manus account. It does not qualify as a truly independent separate-account review.
- **Role:** Reviewer
- **Verdict:** changes
- **Issues:** The non-main manual-dispatch path is closed by the job condition and explicit `main` checkout. A low-severity concurrency issue remained: the draft used `kamna-relay-dashboard`, while both the claim commit and `origin/main` used `kamana-relay-dashboard`. Different concurrency groups could let an old and revised scorecard run overlap. Restore the established key.
- **Evidence:** The reviewer inspected the workflow triggers, branch guard, checkout, staging/commit/push steps, seven-day filter, 2,000-record cap, skipped/cancelled accounting, and `>=600` stale-lock comparison. `git show f470ae3:.github/workflows/ai-dashboard.yml` and `git show origin/main:.github/workflows/ai-dashboard.yml` both confirm `kamana-relay-dashboard` as the established group.
- **Not verified:** The corrected workflow has not yet run on GitHub. No separate-account independent review is available in this session. The owner has not approved `TARGETS.md`.
