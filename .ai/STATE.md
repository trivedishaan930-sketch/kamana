# Relay state

- **Active agent:** manus-1
- **Heartbeat (UTC):** 2026-11-09T12:54:15Z
- **Current task:** T-005 — verify public deployment, SMTP, moderator access, and launch gates.
- **Owner direction:** Use Vercel only if its free plan is appropriate; otherwise use the more suitable free Cloudflare option. Vercel account is Hobby; choose Cloudflare Pages per existing repo architecture. No paid plan or billing action.
- **Verified:** `kamna.pages.dev` exists but has no deployment, Git source, or Preview/Production runtime variables. Cloudflare Workers Free currently provides 100,000 dynamic requests/day and 10 ms CPU/invocation; static asset requests are free/unlimited; Pages Free includes 500 builds/month. Cloudflare project is Direct Upload, so the repo has a gated GitHub Actions/Wrangler workflow. Wrangler CLI is not authenticated; GitHub Actions secret listing returned 403 to this integration, and no secret values were accessed. Current install/typecheck/build pass; previous Vercel plan is Hobby.
- **Next step:** Owner must add the scoped Cloudflare Pages API token/account ID as GitHub Actions secrets; add the listed Supabase and rate-limit runtime settings directly in Cloudflare; verify SMTP, moderator and grievance mailbox; only then set `CF_PAGES_DEPLOY_ENABLED=true`. After owner confirms, verify presence by names only and run the deployment plus end-to-end tests.
- **Blockers:** No production deployment or runtime vars; privileged Supabase service-role key unavailable and must never be sent in chat; email and moderator configuration remain unverified. Keep 18+ and ads off. Do not report as live until backend flows pass.
