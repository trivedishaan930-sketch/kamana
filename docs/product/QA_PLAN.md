# QA plan

The current baseline checks are `pnpm install --frozen-lockfile`, `pnpm typecheck`, and `pnpm build`. Before app-code changes are authorized, add shared formatting/lint configuration, unit tests for API handlers, accessibility checks, and a smoke path covering sign-in, upload, pending state, moderator approval, public view, download, report, and takedown. Exact performance and bundle budgets must be measured first, not invented.

Every bug fix needs a regression test where technically possible. Test both allowed and denied paths, including direct API calls that bypass hidden buttons. Record environment, command, result, and unverified provider assumptions. Never use production data for destructive testing.

## Owner summary

हर change के बाद typecheck और build चलेंगे।
बाद में unit, accessibility और smoke tests जोड़ेंगे।
Security tests hidden buttons पर निर्भर नहीं होंगे।
हर bug fix के साथ regression test होगा।
Production data पर destructive test नहीं होगा।
