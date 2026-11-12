# Kamna roadmap

Status date: 2026-11-12. The owner approved the original roadmap on 2026-11-10 and explicitly reordered the upcoming work on 2026-11-11. This visual-priority override does not bypass per-task safety, rights, security, or provider gates. Do not enable 18+ or monetization. Storage: separate directive.

## Top priority — Visual Product Sprint (owner-ordered 2026-11-11)

Build the visible experience before measuring it and without waiting for approved works. T-021 is complete: Proposal A — Editorial Index won with independent rubric totals 31/35 and 32/35, compared with Proposal B at 25/35 and 28/35. See `docs/product/WIREFRAMES.md` and `.ai/REVIEWS/2026-11-11-t021-proposal-scores.md`. T-032 is complete; T-017 is next in order:

1. **Home page — complete (T-032, 2026-11-12):** compact header; hero with search; all nine general categories always visible as attractive tiles even when empty; featured and latest sections; a designed empty state with no “backend”/“Supabase” wording. Loading placeholders may be skeleton cards only. Never show invented or pretend artwork.
2. **Gallery — next (T-017):** true responsive masonry with lazy loading and smooth phone behavior; preserve useful reading order, visible provenance, and approved-only content.
3. **Artwork, creator, and download:** polish artwork details, creator pages, and anonymous free downloads without obscuring AI labels, IDs, or rights terms.
4. **Sign-in and upload:** compact flow with the form visible first and a clear sign-in/create-account prompt for signed-out visitors; preserve account, rights, privacy, and human-review rules.
5. **Visual polish:** typography, spacing, color, motion, and accessibility in the Gallery Ash style; use keyboard, screen-reader, contrast, touch-target, and reduced-motion checks.

Only after the visible UI exists, measure performance, accessibility, mobile usability, search behavior, and Core Web Vitals. Do not invent numeric targets. Keep the empty gallery honest: decorative category icons/patterns are acceptable when unmistakably UI, but fake artwork, stock art, auto-approval, and lowered moderation are not. Deploy only through the existing GitHub Actions workflow after its checks pass. Keep 18+ and monetization off.

T-032 verification used the repository's typecheck/build and local Wrangler Pages preview; the home and route-manifest requests returned HTTP 200, and desktop/mobile viewport checks confirmed category visibility and compact navigation. No local provider configuration was available, so real artwork, live empty-data behavior, and provider/network skeleton timing remain unverified. The build has a non-blocking Vite advisory for a main JavaScript chunk above 500 kB; no budget is active.

## Owner's measurable goals and baselines

Kamna should become a premium, Pinterest-style discovery site for AI-generated art with a true masonry grid, useful categories, fast search, and smooth mobile browsing. Anyone may view and download approved general-audience work without signing in; creators need an account, clear rights, and human review before publication. Owner earnings precede any later creator benefits.

Baseline recorded from the live page and repository on 2026-11-10, before T-015: nine general-audience categories; query search and a separate tag filter; the API searches title, description, tags, and creator display name; equal-column responsive CSS grid with fixed-ratio tiles, not masonry; no approved works visible. At baseline the title was `Kamna — Art beyond the ordinary` and the description incorrectly called Kamna an 18+ community. T-015 completed in commit `af4bb84`; the deployed title is now `Kamna — AI Art Discovery` and the description describes AI-generated art and free downloads without 18+ wording. Search speed/relevance, real-device mobile behavior, Core Web Vitals, traffic, and creator demand are not yet measured. The owner has additionally reported mobile problems: the tall header consumes screen space, the sign-in hero pushes the form below the fold, the upload Title label touches the preceding image-upload box, public copy exposes internal provider terms, and signed-out users see an active-looking upload form. These reported visual defects are included in the sprint above; reproduce them in a mobile viewport before fixing. The lack of approved artworks and baselines is not a UI blocker.

## Historical first implementation task (T-015) — complete

T-015 was the first code change and is complete in commit `af4bb84`: the document title and description now describe general-audience AI-art discovery, not an 18+ community. The deployed HTML was verified at HTTP 200; the 18+ feature remains disabled. This is historical completion; the owner's 2026-11-11 decision supersedes it as the next work. T-016 search measurement waits until the visual UI exists and approved works are available; do not invent numeric targets.

## Later Phase 0 — governance and measured baseline

The owner confirmed Yes to a 10-minute single-writer/stale-lock threshold on 2026-11-10; `AGENTS.md` is the sole rule, and `.ai/DECISIONS.md` records the decision. The two 2026-11-09 reviews' reviewer agent/account remain unknown because no primary evidence identifies them. The owner-requested protected-path and release-safety tasks are in the backlog. Record measured search/mobile/accessibility/performance baselines after the visual sprint and before setting any numeric budget. Keep 18+ and monetization off.

## Later Phase 1 — seed the empty gallery without lowering moderation

Plan a path to the owner's requested first **50–100 approved works**, not a requirement to accept any specific submission. Sources: (a) AI works created and rights-cleared by the owner; (b) invited creators who submit voluntarily. Every submission follows the same upload rules, rights confirmation, human quality/safety review, and approval process as later submissions. Do not lower moderation thresholds or auto-approve to reach the target. Record source, creator, AI disclosure, provenance, and permission. A clearly written platform license must cover only the intended hosting, public display, attribution, and free-download scope; any commercial print/product license must be a separate explicit creator opt-in with clear terms. If eligible works are unavailable, keep the gallery honestly empty rather than publish uncleared or unsafe work. The visual sprint must not wait for seed content. No outreach or commercial reuse of creator work is authorized by this planning task alone.

## Later Phase 2 — discovery validation and mobile follow-up

The true masonry and compact mobile UI are built earlier in the visual sprint. After those screens exist, measure search behavior and recheck the owner's reported mobile issues: compact the tall header; bring sign-in fields into the first viewport where feasible; add clear vertical space between upload box and Title label; remove public-facing provider/internal terms such as “Supabase” and “backend”; and show signed-out visitors a clear sign-in/create-account prompt instead of an enabled-looking upload form. Preserve accessibility, error recovery, visible rights/safety information, and clear state messaging. Acceptance requires real phone/viewport checks; set numerical speed/bundle/accessibility targets only after baselines.

## Phase 3 — moderation, trust and safety

Require a non-empty, trimmed reason in both moderator UI and server API for every moderation/report action that changes state; fail closed and test direct API calls with missing/blank reasons. Ensure the durable audit record stores the reason. Align the staff route with the spec at `/admin`, mark the HTML page noindex (and cover robots/canonical behavior as appropriate), update route manifest and tests, and avoid exposing staff controls in public navigation. Keep server-side authorization on every request and review the route migration for stale `/moderation` links. Pending uploads remain private until human approval.

## Phase 4 — protected paths and release safety

Add `.github/CODEOWNERS` and a CI paths guard for the protected paths in the directive; pin every GitHub Action to a verified full commit SHA; keep dependency lockfiles and dependency audit current. Add a `CHANGELOG` and a written rollback plan appropriate to each release, including frontend/function rollback and safe database-migration limits. Do not edit already-applied migrations; prefer forward-only additive migrations. Keep the 18+ and monetization flags off by default.

## Phase 5 — quality gates after baselines

Add shared lint/format checks, unit tests for API handlers, authenticated E2E smoke coverage for sign-in/upload/review/public view/download/report, automated accessibility checks, and Lighthouse checks after establishing baselines. Every bug fix should include regression coverage. Do not invent performance, accessibility, or bundle thresholds; measure first and propose budgets for owner review where needed. Record unavailable real-provider scenarios explicitly rather than marking them passed.

## Phase 6 — SEO and growth

Keep public metadata, social cards, sitemap, and robots behavior accurate; keep staff/private surfaces out of search indexing. Use measured search and mobile evidence and private beta feedback from 5–10 real creators to refine categories, onboarding, sharing and discovery. AI research is not a substitute for real users.

## Phase 7 — owner revenue first; creator benefits later

Only after useful approved content and measured traffic exist, re-check India-specific provider acceptance, AI/art and adult-adjacent policies, card and payout requirements, full costs, privacy and legal risks. Get owner Yes before one reversible owner-earnings experiment. Existing research in `MONETIZATION.md` approves no provider or income claim. Later, design creator credit, follows, featured slots, and perhaps revenue sharing; commercial use of creator uploads needs a separate explicit license. No creator payouts or commercial-print feature are authorized now.

## Phase 8 — maintenance

Continue weekly security review, dependency updates, issue review, Scout report, incident readiness, rollback rehearsal and backup/restore planning. Preserve `Storage: separate directive`.

## Owner summary

पहले वेबसाइट का दिखने वाला हिस्सा बेहतर बनेगा; माप बाद में होगा।
दो design प्रस्ताव बनेंगे और दो अलग agents उन्हें score करेंगे।
फिर home, masonry gallery, artwork/creator pages, sign-in/upload और accessibility सुधरेंगे।
हर category खाली होने पर भी दिखेगी।
गलत या नकली artwork नहीं दिखाया जाएगा।
18+ और कमाई वाले फीचर बंद रहेंगे।
