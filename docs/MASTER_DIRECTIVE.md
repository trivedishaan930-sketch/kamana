# KAMNA MASTER DIRECTIVE

Repo: trivedishaan930-sketch/kamana. You are one agent in a strict one-at-a-time relay of AI agents (Manus accounts, Codex, Lovable, Google AI Studio, Cursor, Copilot, Gemini CLI/Jules, Windsurf, Cline). The owner has NO coding or web experience and works from a phone. Act as a full company team: product manager, architect, UX/UI designer, market analyst, SEO strategist, security engineer, QA and DevOps.

Save this directive as docs/MASTER_DIRECTIVE.md and add one line to AGENTS.md pointing to it. AGENTS.md rules (single writer, boundaries, no credentials, no bypassing limits/policies) always win over this directive. Until the owner approves the roadmap (see First Action), change only docs and workflow files, not app code.

OUT OF SCOPE: storage. Do not change storage providers, storage code or the storage section of plan.md. Keep the current storage as it is. The owner will give a separate storage directive later.

## 1. Mission and quality bar
Build Kamna into a premium, fast, secure, Google-discoverable AI-art community gallery (polish and engagement in the class of Pinterest/Behance, but original; never copy competitors). Core rules from plan.md stay: AI-only artwork, human moderation, permanent AI-generated badge and Kamna ID, free downloads, Indian folk styles labelled "AI-inspired; not a traditional/community-created work". Visual style "Gallery Ash": warm museum paper, ink-blue navigation, editorial serif headings, masonry grid, mobile-first. The 18+ Fashion & Swimwear section stays CLOSED until provider policies and age-assurance requirements are verified and the owner approves.
Target: zero known critical or high-severity bugs at every release. Keep .ai/KNOWN_ISSUES.md honest. Never claim "done" without running and verifying it.

## 2. Owner interaction (very important)
- Decide the technical details yourself. Never ask the owner how to build something.
- Ask the owner only for Yes/No approval for: approving the roadmap, go-live/deployment, production database migrations, anything involving cost, a card, a domain or a new account, monetization/ads, publishing legal pages, enabling the 18+ section, and changing plan.md scope.
- Write every owner question in .ai/OWNER_QUESTIONS.md in this exact format, in very simple Hindi/Hinglish, mobile-friendly: (1) Problem in one line (2) What I already did (3) What you need to do: max 3 numbered steps, one action per step, say which screen to open and which screenshot to send back (4) Reply "Yes" or "No". Never ask more than one question at a time.
- Agents never ask for, receive or store keys/passwords/tokens. Tell the owner exactly where in the provider dashboard (Cloudflare, Supabase, GitHub settings) to enter them.

## 3. Workstream A: finish the relay for ALL tools
1. AGENTS.md stays the single source of truth. Every tool-specific file only says "Read AGENTS.md and .ai/STATE.md first".
2. Create .ai/TOOLS.md with one short section per tool: Manus, Codex, Lovable, Google AI Studio, Cursor, GitHub Copilot, Gemini CLI/Jules, Windsurf, Cline, Bolt, plus a template for any new tool. For each: how it connects to the repo, which instruction file it auto-reads (verify in official docs, add source link and date), and whether the owner must paste .ai/START_PROMPT.md manually.
3. Create tool-specific pointer files only where official docs confirm a convention (e.g. .github/copilot-instructions.md, GEMINI.md, .windsurf/rules, .clinerules). Mark anything unverified as "unverified".
4. Add "How to add a new AI tool" (5 steps) to TOOLS.md and a "planned" row in .ai/AGENTS_REGISTRY.md.
5. Provide two versions of .ai/START_PROMPT.md: a 4-line short one and a fuller one.

## 4. Workstream B: fix the open audit findings
- Add tsconfig.tsbuildinfo to .gitignore and untrack it.
- .ai/LOG.md has an out-of-order timestamp (09:55Z after 10:01Z): add a new correcting entry; never rewrite old lines.
- The two "independent" reviews in .ai/REVIEWS/ do not show who the reviewer was (all commits come from the owner's account). From now on every commit message ends with trailers "Agent: <agent-id>" and "Session: <tool/account label>", and every review file records reviewer agent, tool/account and whether it is truly independent of the author. A review by the same agent/account is marked NOT independent and cannot approve security-sensitive work. Tell the owner which agent did the two existing reviews, or mark them "unknown".
- Make .github/workflows/ai-dashboard.yml run on schedule, on push to .ai/**, and manually; it commits only .ai/DASHBOARD.md with [skip ci], after pulling; agents never edit that file by hand. If it needs Settings → Actions → General → Workflow permissions "Read and write", ask the owner (simple steps).
- Owner-only GitHub settings (cannot be done by an agent): enable Dependabot alerts, secret scanning and push protection, and CodeQL under Settings → Code security. Give the owner mobile-friendly steps, then verify and record the status in .ai/DECISIONS.md.
- The repo is public. Search plan.md, TODO.md and all docs for any personal email, phone number or key. Replace personal contact details with an ADMIN_CONTACT_EMAIL placeholder/env variable after owner Yes.

## 5. Workstream C: the product documentation set (docs/product/)
Create these, with every external claim carrying a source link and date, and unknowns marked "unknown":
VISION.md (goal, audience, principles), PRD.md (users, user stories, features by priority, acceptance criteria, non-goals), ROADMAP.md, SITEMAP.md and INFORMATION_ARCHITECTURE.md, DESIGN_SYSTEM.md (Gallery Ash tokens, components, accessibility), MARKET_RESEARCH.md, MONETIZATION.md, SEO_GROWTH.md, SECURITY_PLAN.md (threat model, RLS audit list, upload validation, rate limits, backups), QA_PLAN.md, LAUNCH_CHECKLIST.md, OWNER_GUIDE.md (simple Hindi steps for every owner-only task).

Seed SITEMAP.md, then reconcile with the real routes in src/App.tsx and public/manus-routes.json (do not invent conflicting routes): Home; Explore/Gallery; category pages; Indian Folk & Traditional collection with one page per tradition (Madhubani/Mithila, Warli, Gond, Pattachitra, Phad, Kalamkari, Cheriyal, Thanjavur); artwork page by Kamna ID; creator profile; search; upload (signed in); account; sign in/up; report/takedown; community rules; about; terms; privacy; copyright/takedown; contact/grievance; admin/moderation (noindex); 18+ (closed); 404.

Seed ROADMAP.md with these phases and acceptance criteria, then refine:
0 Stabilise and audit (status report, CI green, privacy cleanup, GitHub security settings).
1 Go-live foundations (connect Cloudflare Pages, run Supabase migrations, owner sets environment variables in dashboards, moderator account, email), then a private beta.
2 Core product quality (masonry gallery, search/tags, artwork pages, upload flow, accessibility, performance, legal pages).
3 Trust and safety plus security hardening.
4 SEO and discovery.
5 Growth and community (sharing, creator onboarding, collections).
6 Monetization, only after real traffic and a policy check.
7 Maintenance rhythm: weekly security audit, dependency updates, weekly Scout report on new free tools.
(Storage is handled separately by the owner; leave a placeholder line "Storage: separate directive" in the roadmap.)
Turn each phase into small tasks in .ai/TASKS.md with owner-approval gates marked.

## 6. Workstream D: SEO, discovery, market research, monetization
- Technical SEO: generated sitemap.xml and robots.txt, canonical URLs, OpenGraph and Twitter cards, JSON-LD (ImageObject/CreativeWork), semantic HTML, Core Web Vitals budget. Admin and private pages noindex. Give the owner simple steps for Google Search Console and analytics.
- Market research: benchmark real comparable platforms, audience, search keywords and creator acquisition ideas, with sources and dates. No invented statistics.
- Monetization: design slots and a checklist only. Before any ads, affiliate links or paid badges, verify the ad/affiliate provider's policy on AI-generated art and adult-adjacent content, and get the owner's Yes. Never promise income.
- Legal: draft terms, privacy, copyright and grievance pages, and flag clearly that they need review by a qualified lawyer before launch. Do not claim legal compliance.

## 7. Workstream E: security and QA
Never put service_role keys or secrets in frontend or repo. Enforce RLS, validate MIME and bytes, sanitize input, rate limit, and make sure the pending to approved moderation flow cannot be bypassed via direct API calls. Add automated tests for these where possible. Weekly security audit task; every security-sensitive change needs a truly independent review.

## 8. Git failure and merge-conflict protocol
Prevent: single writer, pull --rebase before every push, small commits, never force-push, never "git reset --hard" on shared work. Add a .gitattributes with "merge=union" for append-only logs (.ai/LOG.md, .ai/ERRORS.md).
When something fails:
1. Push rejected: git pull --rebase, rerun typecheck/build, push again.
2. Merge conflict in append-only logs: keep both sides, order by timestamp. In code or docs: understand both changes, keep both intents, rerun build and tests.
3. CI fails after push: fix forward quickly; if not fixed within 2 attempts, git revert the bad commit (never rewrite history).
4. Before any risky step, save work on a branch recovery/<agent>-<date>.
5. Stale lock: follow the 3-hour rule in AGENTS.md and log the takeover.
6. If still unresolved after 3 different attempts: write .ai/INCIDENTS/<date>-<id>.md (exact error text, what was tried, current state, safest next step) and put a simple-Hindi question in OWNER_QUESTIONS.md with at most 3 mobile steps and the screenshot to send. Then stop; do not improvise.
Also add a TROUBLESHOOTING section for commit/merge failures to docs/product/OWNER_GUIDE.md.

## 9. Every session (loop)
Read AGENTS.md, .ai/STATE.md, .ai/TASKS.md, docs/MASTER_DIRECTIVE.md, plan.md, TODO.md, the last 20 commits. Review the previous agent's work first. Claim one task. After every small verified step: update STATE.md and LOG.md, commit with trailers, pull --rebase, push. Update the roadmap status. End with a short plain-language status for the owner and the single next Yes/No, if any.

## 10. FIRST ACTION NOW
1. Scan the whole repo and write docs/STATUS_REPORT.md: what works, what is missing, bugs and risks found, in plain non-technical language, plus what is verified and what is not.
2. Complete workstreams A, B and C (docs and workflow files only).
3. Put one short question in OWNER_QUESTIONS.md asking the owner to approve the roadmap with Yes/No. Then stop. Log completion in .ai/LOG.md.

## ADDENDUM: sections 11-17 (append to docs/MASTER_DIRECTIVE.md; same rules apply: docs and config files only until the owner approves the roadmap; storage still out of scope)

## 11. Context efficiency (free tools have small token budgets)
Create .ai/CONTEXT.md (one page: what Kamna is, stack, current phase, where things live, 10 key rules), .ai/REPO_MAP.md (folder-by-folder map) and docs/ARCHITECTURE.md (request flow, data model, trust boundaries). Change every session's read order to: AGENTS.md, .ai/STATE.md, .ai/CONTEXT.md, the claimed task, and only the docs that task needs. Size tasks so one fits in a single short session; a task that cannot be finished must be split in TASKS.md. Keep CONTEXT.md and REPO_MAP.md updated whenever structure changes.

## 12. Quality gates and Definition of Done
Configure free GitHub Actions gates: typecheck, build, lint/format (add shared config so every tool writes the same style), unit tests for API handlers, end-to-end smoke tests (sign in, upload, moderation approve, public view, download, report), automated accessibility checks, and Lighthouse checks. Set numeric budgets (performance, accessibility, bundle size) only AFTER measuring a baseline; never invent targets. Every bug fix adds a regression test. Add .ai/DEFINITION_OF_DONE.md: builds, tests pass, reviewed by a truly independent agent, docs updated, nothing unverified claimed as done, what was NOT verified is listed.

## 13. Environments, releases and rollback
Use Cloudflare Pages preview deployments per branch if available. Check whether a second free Supabase project can serve as staging (verify current limits, source and date); test every migration on staging before production, and only after owner Yes. Migrations are forward-only and additive; never edit an applied migration. Add a CHANGELOG, semantic versions, a written rollback plan for each release, and feature flags so the 18+ section and monetization stay off. Plan database backups and run one documented restore drill before launch.

## 14. Protected paths and generator tools
Add CODEOWNERS and a CI paths guard for: functions/, supabase/migrations/, .ai/, .github/, AGENTS.md, plan.md. Tools that regenerate code (Lovable, Bolt, Google AI Studio) must work on a branch and open a pull request; they may not overwrite protected paths unless the pull request has a truly independent review (and a Security Auditor review for security-sensitive paths). The relay agents keep pushing small docs/code commits to main under the existing single-writer rules. Pin GitHub Actions to full commit SHAs and keep dependencies pinned via the lockfile; run a dependency audit in CI.

## 15. Observability, incidents and cost guardrails
Create docs/product/SERVICES_REGISTER.md: every external service, its current free limits, whether a card is required, content/ToS policy, and usage thresholds, each with source link and date. Never add a payment card anywhere; if a service needs one, stop and ask the owner. Propose free error monitoring and uptime checks (verify they are free and need no card). Never log personal data. Write an incident runbook (detect, contain, fix, record in .ai/INCIDENTS/).

## 16. Product depth
- Bilingual UI plan (Hindi and English): Devanagari-capable fonts, hreflang, Hindi search keywords.
- Image delivery: responsive sizes, lazy loading, blur placeholders, accessible infinite scroll, caching rules.
- Moderation playbook: review checklist, response targets only if staffed, appeals, an urgent path for intimate-image or impersonation reports, repeat-offender policy.
- Community features, designed first and built after approval: creator onboarding, collections, featured artists, weekly themes.
- Analytics plan: privacy-respecting, with KPIs defined after a baseline exists and no collection of unnecessary personal data.
- Research item: feasibility of content credentials/provenance metadata (for example C2PA) for downloads; mark as unverified until sources confirm.
- For UI/UX choices produce at least two design proposals and score them with .ai/RUBRICS.md.

## 17. Compliance register
Create docs/product/COMPLIANCE_REGISTER.md: obligations that may apply to an Indian user-generated-content platform (privacy, copyright takedown, intermediary duties, minors, adult content), each with a source link and date, status, and a "needs lawyer review" flag. Never claim compliance.

## 18. Pacing
Order: P1 sections 11, 12, 14; P2 sections 13, 15; P3 sections 16, 17. If tokens run low, finish one workstream, log it in .ai/LOG.md and hand off; the next agent continues. Add all of this to ROADMAP.md as phase 0/1 tasks. Update the owner question to also ask for the roadmap Yes/No only once.

## ADDENDUM 2: sections 19-23 (docs only; same rules; storage still out of scope)

## 19. UX research and user journeys
Write docs/product/UX_RESEARCH.md: personas (visitor, creator, moderator, admin/owner), jobs-to-be-done, a competitor teardown of comparable platforms (source link and date for each), a heuristic review of the current Kamna UI, and a gap analysis of the existing code against the PRD. Write docs/product/USER_JOURNEYS.md with a flow for each: first-time visitor arriving from Google or social media; browsing and searching; sharing; sign-up and onboarding; becoming a creator and uploading; waiting for review and getting approved or rejected; downloading; reporting content; a creator requesting removal. For every flow list the screens, what the user sees, what can go wrong, and the empty/error states. State clearly that AI research does not replace real users: plan a small private beta test with 5-10 real creators and list the questions to ask.

## 20. Roles, permissions and the admin panel
Write docs/product/ROLES_AND_PERMISSIONS.md with a table for visitor, member/creator, moderator and admin (owner): what each can see and do. Audit what the existing code and database already enforce and list the gaps. The admin/moderator area must be a separate section (/admin, noindex) with server-side permission checks on every API call (never rely on hiding buttons), least privilege, a reason required for every action, and a permanent audit log. Check whether Supabase Auth offers MFA on the free plan and recommend it for staff accounts if available (source and date). The first admin account is created by the owner through a dashboard step documented in simple Hindi in OWNER_GUIDE.md; no admin credentials are ever stored in the repo. Write docs/product/ADMIN_PANEL_SPEC.md: moderation queue, approve/reject/remove with reasons, reports and takedown handling, creator suspension and appeals, category/tag/collection management, featured artworks, feature flags (18+ section off, ads off), audit log viewer, and a service usage meter. Design the creator dashboard separately (my uploads and their status, edit, delete, downloads count, profile).

## 21. Content creation experience
Write docs/product/CONTENT_FLOW.md: the exact upload form steps and field rules, the AI disclosure and rights confirmations, status messages (pending, approved, rejected with a reason, removed), how a creator edits or deletes work, and how tags and categories are chosen. Define the quality and safety review checklist a moderator uses and the rejection reasons list.

## 22. Value and business model
Write docs/product/VALUE_AND_BUSINESS.md: the value proposition for visitors, creators and the owner; what users gain; what the owner gains and how (in the order: audience, trust, then revenue); a monetization sequence with prerequisites for each step (traffic, policy check, owner Yes); a realistic cost table for the free services; and the risks and what would change the plan. No income promises and no invented numbers; mark every estimate as an assumption.

## 23. Design proposals and wireframes
Produce docs/product/WIREFRAMES.md with simple text or Mermaid wireframes for: home, explore, artwork page, creator profile, upload flow, creator dashboard, moderation queue, admin panel, mobile navigation and empty/error states. Prepare at least two UI/UX design proposals (different layouts/visual emphasis), score them with .ai/RUBRICS.md by agents other than the author, and select one. Do NOT change app code or deploy designs until the owner approves the roadmap.
Every document above must end with a section "Owner summary" of at most 10 plain Hindi lines for a non-technical phone reader.
Add all of these as tasks in .ai/TASKS.md: phase 0/1, priority order 19, 20, 21, 22, 23.