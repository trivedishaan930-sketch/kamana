# Kamna product requirements

## Product direction

Kamna is a premium, mobile-friendly discovery site for AI-generated art. It should provide an original Pinterest-style browsing experience with masonry, useful categories, fast search, and clear provenance. The owner approved this roadmap on 2026-11-10; product requirements derive from `OWNER_BRIEF.md`. T-015 metadata remains the first implementation task.

## Users and stories

A visitor can browse approved general-audience work, search by title, creator, or tags, open a stable artwork page, and download approved images without signing in. A signed-out visitor who opens upload sees a clear invitation to sign in/create an account, not an active-looking submission form. A creator can submit AI work with clear rights and safety confirmations, see review status, and request removal. A moderator can review context and approve, reject, or remove work only with a required reason recorded in a durable audit record. The owner can operate dashboards without credentials in the repository. Creator credit, follows, featured placement, and possible revenue share are future design only; no creator rewards are implemented now.

## Priority requirements

**P0 — trust and public access:** public read/download is limited to approved general-audience work and needs no sign-in; uploads require a confirmed account and human review; pending files stay private; server-side authorization, AI disclosure, stable Kamna ID, rights/safety confirmations, report/takedown intake and audit records remain required; the 18+ feature stays closed.

**P1 — discovery and mobile product quality:** true masonry; nine current general-audience collections; title/creator/tag search with a separate tag filter; artwork and creator pages; accessible mobile navigation; clear empty/error states; smooth phone browsing. Fix owner-reported mobile defects: excessive header height, sign-in hero displacing fields below the fold, insufficient gap between upload control and Title label, internal provider/backend wording on public pages, and misleading active-looking signed-out upload form. Measure usability/performance before numeric targets.

**P1 — rights-cleared content seeding:** plan a path toward the owner's target of 50–100 approved works from owner-made AI work and invited creators. Record a clear platform license for hosting/display/attribution/free downloads; commercial print or product use requires separate explicit creator opt-in and terms. Every item receives the same human safety/quality review; the target never lowers the bar or requires auto-approval. Do not publish without rights evidence.

**P1 — moderation staff area:** require a non-empty reason in UI and server API for each state-changing moderation/report action; persist the reason in the audit record; fail closed on blank/missing reasons. Align the staff route with `/admin`, add noindex to its HTML, update route manifest/links, and keep server-side moderator authorization on every API call.

**P2 — growth after evidence:** private-beta feedback, onboarding, collections, sharing, follows, featured work, and bilingual improvements. Creator benefits are designed later; no earnings or revenue share is promised.

**P3 — owner monetization after readiness:** research the owner's revenue options before creator payments. Require real approved content, measured traffic, a country-specific policy/cost review, and owner Yes before enabling one reversible experiment. Monetization is currently off.

## Measured acceptance baseline — 2026-11-10

The live site has nine general-audience category IDs. Search UI/API exist; source code searches title, description, tags, and creator display name, but response time and relevance have not been benchmarked with real approved content. The current CSS grid is equal-column with fixed-ratio artwork tiles, not masonry. CSS has responsive breakpoints, but real-device mobile usability, accessibility, and Core Web Vitals have not been measured. The gallery has no approved artwork, so anonymous download cannot be verified end-to-end against a real public image. The live staff route is `/moderation`, not the planned `/admin`; noindex is not present.

## Acceptance evidence and gates

Accept a requirement only after a reproducible check and evidence in `.ai/LOG.md` or a review file. Measure a baseline before defining numeric performance, accessibility, or bundle budgets. T-015 corrects the stale title/meta first. Mobile fixes require real phone/viewport checks. Moderator reason enforcement requires UI and direct API tests, audit evidence, and independent Security Auditor review. Route migration requires updated manifest/links, authorization checks, and a noindex check. Provider-backed upload, moderation, removal, and download remain unverified until real content and end-to-end tests exist. Legal copy and commercial licensing require qualified counsel review.

## Non-goals

Storage-provider changes; enabling 18+; bypassing human review or auto-approving to meet a seeding target; automated AI-detection claims; free/unlimited service promises; legal-compliance claims; ads, affiliate links, sales, or creator payouts before owner approval; and selling a creator's work without a separate explicit commercial license.

## Owner summary

Kamna AI art खोजने की premium जगह बनेगी।
Approved images बिना sign-in देखी और download होंगी।
Upload के लिए account, rights और human review ज़रूरी है।
T-015 सबसे पहला code task है।
50–100 works का लक्ष्य moderation कम करके पूरा नहीं होगा।
Phone पर header, sign-in और upload layout सुधारेंगे।
Moderator reason UI और API दोनों में ज़रूरी होगा।
`/admin` noindex होगा और access server पर जाँचा जाएगा।
पहले baseline मापेंगे, फिर targets तय करेंगे।
