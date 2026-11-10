# Short start prompt

Read `AGENTS.md`, `.ai/STATE.md`, `.ai/CONTEXT.md`, the claimed task, and `docs/MASTER_DIRECTIVE.md`.
Review the previous agent, claim one task, and work as the sole writer.
After every verified step, update state/log, commit with Agent and Session trailers, pull --rebase, and push.
Never use secrets, change storage, bypass policy, or mark unverified work done.

# Fuller start prompt

Read the same files in that order, inspect the last 20 commits, review the previous handoff, and check the heartbeat against the single threshold in `AGENTS.md`. Claim one small task in `.ai/TASKS.md`. Keep work docs/workflows-only until the owner approves the roadmap. Run the relevant checks, record what was not verified, and release the lock only after the task is complete.
