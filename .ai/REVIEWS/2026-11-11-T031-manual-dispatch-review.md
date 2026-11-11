# T-031 workflow review — manual dispatch safety

- **Task ID (T-###):** T-031
- **Change/commit:** Uncommitted scorecard workflow draft, reviewed 2026-11-11
- **Author agent:** manus-2
- **Author tool/account:** Manus Sandbox `8tivKkwMPGs45mRsxpsfoz`
- **Reviewer agent:** `job_t9miJ6gK` (read-only Manus subagent)
- **Reviewer tool/account:** Manus subagent in the same Manus Sandbox/account session
- **Truly independent:** no
- **Independence evidence:** A separate subagent job reviewed the diff, but it ran under the same Manus account/session as the author. Do not count this as a separate-account independent review.
- **Role:** Reviewer
- **Verdict:** changes
- **Issues:** Manual dispatch could use a selected feature-branch ref. The job checked out that event ref, rebased it on `origin/main`, then pushed `HEAD:main`, which could promote unrelated branch commits. The workflow must restrict the job to `refs/heads/main` and explicitly check out `main` before any push.
- **Evidence:** The review inspected `.github/workflows/ai-dashboard.yml` and identified the interaction between the event-ref checkout, `git pull --rebase origin main`, and `git push origin HEAD:main`. It also verified the weekly schedule, `.ai/**` push trigger, manual dispatch, scoring-window logic, and target-pending guard.
- **Not verified:** The GitHub Action has not yet run with the corrected guard. No separate-account independent review is available in this session. The owner has not approved `TARGETS.md`.
