# Kamna agent relay

Read in order: `AGENTS.md`, `.ai/STATE.md`, `.ai/TASKS.md`, `plan.md`, `TODO.md`, `.ai/DECISIONS.md`.

## Strict single-writer protocol

1. Check the active agent and heartbeat in `.ai/STATE.md`. If another heartbeat is under 3 hours old, stop and report only. If older, mark it stale, take over, and log the takeover.
2. At session start, review the previous agent's last commits, build/security status, and plan consistency. Write that review to `.ai/REVIEWS/`; log errors in `.ai/ERRORS.md` and fix small issues or create a task before new work.
3. Claim one task in `.ai/TASKS.md` with status, owner, and UTC time; push the claim immediately.
4. Work sequentially. After every small finished step, update `.ai/STATE.md`, append `.ai/LOG.md`, commit as `[agent-id] T-xxx: message`, then `git pull --rebase` and push to `main`. Never force-push.
5. Keep steps small and the repository buildable. Run the available typecheck/build before pushing code. Never mark TODO work done without real-provider evidence; record what was not verified.

## Boundaries

Only work inside this repository and the assigned task. Never access unconnected systems, request or use credentials, commit secrets, bypass policies, or create accounts. Keys belong only in provider dashboards. Do not change app behavior for a docs/workflow task.

`plan.md` and `TODO.md` are the source of truth. Record alternatives or changes in `.ai/DECISIONS.md` before updating them in the same commit. Significant changes need a review file in `.ai/REVIEWS/`; auth, storage, RLS, uploads, secrets, and moderation also need Security Auditor review. The author cannot review or score their own change.

Use `.ai/REGISTRY.md`, `.ai/ROLES.md`, `.ai/RUBRICS.md`, `.ai/OWNER_QUESTIONS.md`, `.ai/ERRORS.md`, and `.ai/REVIEWS/` for relay communication. GitHub Actions may maintain `.ai/DASHBOARD.md`; no automation outside GitHub Actions is added without an owner-approved decision.
