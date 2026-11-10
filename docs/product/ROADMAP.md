# Kamna roadmap

Status date: 2026-11-10. **Owner approved this roadmap and the additions below on 2026-11-10.** `OWNER_BRIEF.md` remains the source for product goals. This approval does not bypass per-task safety, rights, security, or provider gates. Do not enable 18+ or monetization. Storage: separate directive.

## Owner's measurable goals and baselines

Kamna should become a premium, Pinterest-style discovery site for AI-generated art with a true masonry grid, useful categories, fast search, and smooth mobile browsing. Anyone may view and download approved general-audience work without signing in; creators need an account, clear rights, and human review before publication. Owner earnings precede any later creator benefits.

Baseline recorded from the live page and repository on 2026-11-10: nine general-audience categories; query search and a separate tag filter; the API searches title, description, tags, and creator display name; equal-column responsive CSS grid with fixed-ratio tiles, not masonry; no approved works visible. Homepage title is `Kamna — Art beyond the ordinary`, but the description still calls Kamna an 18+ community. Search speed/relevance, real-device mobile behavior, Core Web Vitals, traffic, and creator demand are not yet measured. The owner has additionally reported mobile problems: the tall header consumes screen space, the sign-in hero pushes the form below the fold, the upload Title label touches the preceding image-upload box, public copy exposes internal provider terms, and signed-out users see an active-looking upload form. Reproduce these in a mobile viewport before fixing; do not invent performance targets.

## First implementation task (T-015): correct page metadata

T-015 remains first. Correct the document title/meta description so Kamna is described as general-audience AI-art discovery, not an 18+ community. Keep the 18+ feature disabled. Acceptance: deployed HTML has the accurate title/description. This is first in the implementation order; this roadmap update does not itself change app code.

## Phase 0 — governance and measured baseline

The owner confirmed Yes to a 10-minute single-writer/stale-lock threshold on 2026-11-10; `AGENTS.md` is the sole rule, and `.ai/DECISIONS.md` records the decision. The two 2026-11-09 reviews' reviewer agent/account remain unknown because no primary evidence identifies them. The owner-requested protected-path and release-safety tasks are in the backlog. Record measured search/mobile/accessibility/performance baselines before setting any numeric budget. Keep 18+ and monetization off.

## Phase 1 — seed the empty gallery without lowering moderation

Plan a path to the owner's requested first **50–100 approved works**, not a requirement to accept any specific submission. Sources: (a) AI works created and rights-cleared by the owner; (b) invited creators who submit voluntarily. Every submission follows the same upload rules, rights confirmation, human quality/safety review, and approval process as later submissions. Do not lower moderation thresholds or auto-approve to reach the target. Record source, creator, AI disclosure, provenance, and permission. A clearly written platform license must cover only the intended hosting, public display, attribution, and free-download scope; any commercial print/product license must be a separate explicit creator opt-in with clear terms. If eligible works are unavailable, keep the gallery honestly empty rather than publish uncleared or unsafe work. No outreach or commercial reuse of creator work is authorized by this planning task alone.

## Phase 2 — core discovery and mobile UX

Replace the uniform grid with true masonry while preserving the nine categories and approved-only behavior. Measure search behavior before proposing a latency budget. Recheck the owner's reported mobile problems and fix: compact the tall header; bring sign-in fields into the first viewport where feasible; add clear vertical space between upload box and Title label; remove public-facing provider/internal terms such as “Supabase” and “backend”; and show signed-out visitors a clear sign-in/create-account prompt instead of an enabled-looking upload form. Preserve accessibility, error recovery, visible rights/safety information, and clear state messaging. Acceptance requires real phone/viewport checks; set numerical speed/bundle/accessibility targets only after baselines.

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

आपने roadmap मंज़ूर कर दिया है।
पहला code काम T-015 title/meta सुधारना है।
Gallery में पहले 50–100 सही अनुमति वाले काम जुटाने की योजना बनेगी।
हर artwork पर वही human moderation लागू रहेगी।
Mobile की बताई समस्याएँ ठीक की जाएँगी।
Moderator reason UI और API दोनों में ज़रूरी होगा।
पहले speed और accessibility की baseline मापेंगे।
Creator की commercial permission अलग से चाहिए।
18+ और कमाई अभी बंद है।
