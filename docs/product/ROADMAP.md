# Kamna roadmap

Status date: 2026-11-10. This roadmap has been re-based on `OWNER_BRIEF.md`; approval of this revised roadmap is pending. The earlier Yes applied to the previous roadmap only. Do not change app code, start a provider, add storage, or deploy a feature until the applicable owner approval. Storage: separate directive.

## Owner's measurable goals and current baselines

The owner wants a premium, Pinterest-style discovery experience for AI-generated art: masonry layout, useful categories, fast search, smooth mobile browsing, and public view/download without sign-in. Uploads require an account and human review. Owner revenue comes before any later creator reward program.

Baseline recorded from the live page and current repository on 2026-11-10: nine general-audience categories are declared in `src/App.tsx`; query search and a separate tag filter are present, and the API can search title, description, tags, and creator display name; the current gallery is a responsive equal-column grid with fixed-ratio cards, not masonry; the responsive CSS changes from three to two to one columns; no approved works are currently visible; the title is `Kamna — Art beyond the ordinary`, while the meta description still identifies the site as an 18+ community. Search response time, mobile-device experience, Core Web Vitals, user success, traffic, and creator demand have not been measured. Those unknowns are baselines to collect, not permission to invent targets.

## Phase 0 — stabilise, measure, and approve

Acceptance: status report, security review, and current routes remain accurate; identify all known gaps; measure search and mobile/performance baselines before setting numeric targets; keep owner-only GitHub settings and personal-contact cleanup on the proper owner path; and obtain a new Yes for this revised roadmap. Preserve `Storage: separate directive`. Keep the 18+ area closed and monetization off.

## Phase 1 — first approved code task: correct page metadata

This is the first app-code task after the owner says Yes to this revised roadmap. Update the document title and meta description so they accurately describe general-audience AI-art discovery and do not call Kamna an 18+ community. Preserve the 18+ feature flag as off. Acceptance: the deployed page source shows the new accurate title and description and contains no old 18+ meta wording. No such code change is part of this documentation task.

## Phase 2 — core discovery quality

Acceptance: the gallery presents an actual masonry layout rather than equal fixed-ratio tiles; all nine current collections remain discoverable; search and tags return the expected approved results; users can browse and download approved general-audience images without signing in; and phone browsing is tested for layout, accessibility, loading and errors. Start by measuring current behavior, then agree numeric performance budgets from that evidence. Do not invent a category count or search-latency target.

Small queued tasks are in `.ai/TASKS.md`: T-015 metadata; T-016 search correctness and latency baseline; T-017 masonry; T-018 phone/accessibility/performance baseline; T-019 categories and search usability; T-020 anonymous download end-to-end check when an approved work exists; T-021 two independently scored visual proposals before changing the design.

## Phase 3 — trust and safety hardening

Acceptance: server-side permission checks, rate limits, upload-byte validation, moderation audit, takedown handling, abuse controls, incident drill and independent security review are evidenced. Uploads stay private and pending until human approval. Do not claim a provider-backed flow is complete without a real end-to-end test.

## Phase 4 — SEO and discovery

Acceptance: public pages have accurate metadata and social cards; sitemap and robots behavior match real routes; private, moderation and closed 18+ surfaces are not indexed; structured data is accurate; and search discovery/performance is measured. Provide owner instructions for Search Console and privacy-respecting analytics.

## Phase 5 — growth and community

Acceptance: actual private-beta feedback informs creator onboarding, collection structure, sharing, and discovery improvements. Plan a small private beta with 5–10 real creators; AI research is not a replacement for real users. No new feature is adopted from a design proposal without its decision record and required owner approval.

## Phase 6 — owner revenue first

Acceptance: real approved content and a measured traffic baseline exist; current provider eligibility, AI/art and adult-adjacent policies, payout path, card and all costs are verified for India; privacy and legal risks are reviewed; and the owner says Yes before one reversible experiment. Research on AdSense, Amazon.in Associates, Printify and Shopify is in `MONETIZATION.md`; none is approved for use now. Never promise income.

## Phase 7 — creator-benefit design later; maintenance

Only after the owner-first revenue stage has been considered and real creator participation exists, design creator credit, follows, featured slots and possibly revenue sharing. Design only at first; no payout or monetization code is authorized. Define creator consent, attribution, calculations, taxes, disputes, refund and takedown handling before any later build. Continue the weekly security audit, dependency updates, issue review, Scout report and rollback rehearsal.

## Owner summary

पहले नया roadmap approve होगा।
पहला code task पुराना title/meta ठीक करना है।
अभी app code नहीं बदला गया है।
Gallery में अभी 9 मुख्य categories हैं।
Masonry और mobile performance अभी जाँचने बाकी हैं।
पहले baseline मापेंगे, फिर target तय करेंगे।
Owner की कमाई पहले जाँची जाएगी।
Creators के rewards बाद में design होंगे।
Ads और 18+ अभी बंद रहेंगे।
Storage अलग directive से ही बदलेगा।
