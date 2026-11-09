# Relay state

- **Active agent:** manus-1
- **Heartbeat (UTC):** 2026-11-09T12:56:05Z
- **Current task:** T-005 — verify public deployment, SMTP, moderator access, and launch gates.
- **Owner direction:** Use Vercel only if its free plan is appropriate; otherwise use the more suitable free Cloudflare option. Vercel account is Hobby; use Cloudflare Pages per existing repo architecture. No paid plan or billing action.
- **Verified:** `kamna.pages.dev` exists but has no deployment, Git source, or Preview/Production runtime variables. Cloudflare Workers Free has a 100,000 dynamic requests/day quota and 10 ms CPU/invocation; static asset requests are free/unlimited; Pages Free has 500 builds/month. Project is Direct Upload, so the repo has a gated GitHub Actions/Wrangler workflow. Current local install/typecheck/build pass. First workflow run exposed that pnpm was not installed before Node's cache setup; workflow order is corrected and will be re-run. Wrangler CLI is not authenticated; GitHub Actions secret listing returned 403 to this integration, with no secret values accessed.
- **Next step:** Push corrected workflow and verify CI. Owner must add the scoped Cloudflare Pages API token/account ID as GitHub Actions secrets; add Supabase/rate-limit runtime settings directly in Cloudflare; verify SMTP, moderator and grievance mailbox; only then set `CF_PAGES_DEPLOY_ENABLED=true`. After owner confirms, verify configuration names/status and run deployment plus end-to-end tests.
- **Blockers:** No production deployment or runtime vars; privileged Supabase service-role key unavailable and must never be sent in chat; email and moderator configuration remain unverified. Keep 18+ and ads off. Do not report as live until backend flows pass.
