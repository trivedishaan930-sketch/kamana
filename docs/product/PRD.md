# Kamna product requirements

## Product direction

Kamna is a premium, mobile-friendly discovery site for AI-generated art. It should provide a visual, Pinterest-style browsing experience with an original Kamna identity, a masonry grid, useful categories, fast search, and clear provenance. The current beta is a baseline rather than the finished experience. Product decisions derive from `OWNER_BRIEF.md`; the updated roadmap is awaiting owner approval.

## Users and stories

A visitor can browse approved general-audience work, search by title, creator, or tags, open a stable artwork page, and download approved images without signing in. A creator can create an account, submit AI-generated work with rights and safety confirmations, see pending/approved/rejected status, and request removal. A moderator can review context and approve, reject, or remove work with a reason and audit record. The owner can operate dashboards without putting credentials in the repository. Creators may receive credit, followers, featured placement, and possibly revenue share only in a later design phase; no creator rewards are implemented now.

## Priority requirements

**P0 — trust and public access:** public read/download is limited to approved general-audience work and needs no sign-in; uploads require a confirmed account and human review; pending files stay private; server-side authorization, AI disclosure, stable Kamna ID, rights/safety confirmations, report/takedown intake and audit records remain required; the 18+ feature stays closed.

**P1 — discovery and product quality:** a real masonry layout; nine current general-audience collections remain discoverable; search by title/creator/tags with a separate tag filter; artwork and creator pages; accessible mobile navigation; clear empty/error states; and responsive, smooth phone browsing. Search speed, mobile performance and user success must be measured before numeric targets are selected.

**P2 — growth after evidence:** private-beta feedback, onboarding, collections, sharing, follows, featured work, and bilingual improvements. Creator benefits are designed later; no earnings or revenue share is promised.

**P3 — owner monetization after readiness:** research the owner's revenue options before creator payments. Require real approved content, measured traffic, a country-specific policy and cost review, and owner Yes before enabling one reversible experiment. Monetization is currently off.

## Measured acceptance baseline — 2026-11-10

The live site has nine general-audience category IDs. Search UI and API exist; source code searches title, description, tags, and creator display name, but response time and relevance have not been benchmarked with real approved content. The current CSS grid is equal-column with fixed-ratio artwork tiles, so it is not masonry. CSS has responsive column breakpoints but real-device mobile usability, accessibility and Core Web Vitals have not been measured. The public gallery currently has no approved artworks; therefore the anonymous download path is supported by code but not verifiable end-to-end against an actual public image.

## Acceptance evidence and gates

A requirement is accepted only after a reproducible check and evidence in `.ai/LOG.md` or a review file. Measure a baseline before defining any numeric performance, accessibility, traffic or conversion budget. After owner approval, the first code task is correcting the stale title/meta description; the app code is not changed by this PRD update. Provider-backed upload, moderation, removal and download flows remain unverified until real approved content and end-to-end checks exist. Legal copy requires qualified counsel review.

## Non-goals

Storage-provider changes; enabling 18+; bypassing human review; automated AI-detection claims; free/unlimited service promises; legal-compliance claims; ads, affiliate links, sales, or creator payouts before owner approval; and selling a creator's work without a separate explicit commercial license.

## Owner summary

Kamna AI art खोजने की premium जगह बनेगी।
Approved images बिना sign-in देखी और download होंगी।
Upload के लिए account और human review ज़रूरी है।
पहले title/meta सही होगा, roadmap पर Yes के बाद।
Masonry, तेज search और phone experience की जाँच बाकी है।
Target बताने से पहले baseline मापेंगे।
Owner earnings पहले, creator benefits बाद में।
Ads, 18+ और storage बदलाव अभी मंज़ूर नहीं हैं।
