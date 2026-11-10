# Owner brief

Status: updated 2026-11-10. This is the source for the PRD, roadmap, and task sequence. The owner approved the updated roadmap and additions on 2026-11-10. This planning record does not itself implement app code, create accounts, change providers/storage, or deploy features.

## Product direction

Kamna should become a premium, mobile-friendly discovery site for AI-generated art. The experience should feel as easy to browse as a Pinterest-style visual gallery, but remain original to Kamna. The owner wants a masonry grid, useful categories, fast search, smooth mobile browsing, and a more premium look than the current live beta.

Anyone should be able to view and download approved general-audience images without signing in. Uploading requires an account, the uploader's rights and AI disclosures, and the existing human review. A submission must remain private until a moderator approves it. A free download is not a transfer of commercial or republication rights.

The outdated live meta description—“Kamna — an 18+ community for lawful, fictional AI artwork.”—misstates the product. Correcting the page title/meta description is T-015, the first implementation task under the approved roadmap. The 18+ section remains closed unless separately reviewed and approved.

## Current baselines and reported mobile defects

Baseline measured from the live page and repository on 2026-11-10: nine general-audience collection categories; title/description/tag/creator search exists but speed and real-user success have not been measured; the current responsive equal-column CSS grid is not masonry; and no approved artworks are visible. Search relevance, real-device mobile behavior, Core Web Vitals, traffic, and creator demand remain unknown; do not invent targets.

The owner reports these mobile/public-UX defects for a future fix task: the tall header consumes too much of the phone screen; the sign-in hero pushes the form below the fold; the upload Title label touches the image-upload box; public pages expose internal terms such as “Supabase” and “backend”; and signed-out visitors see an active-looking upload form instead of a clear sign-in/create-account prompt. Reproduce the layout in a phone viewport before changing it.

The upload route is `/upload`; upload is account-gated. The current moderator screen is `/moderation`, whereas the approved spec calls for `/admin`; the route needs alignment and the staff page must be noindex. A nonblank moderator reason must be required by both UI and server API for state-changing actions and written to a durable audit record.

## Seeding the empty gallery

The owner wants a plan to acquire the first **50–100 approved works** with clear rights, without relaxing review. Candidate sources are AI works made and rights-cleared by the owner and invited creators who submit voluntarily. Every work must pass the same human safety/quality review as all later submissions; the target is not a quota, and the gallery should remain empty if there are not enough eligible works.

A written platform license must make clear whether it covers hosting, public display, attribution, and free downloads. Commercial printing, product links, or other commercial reuse of creator uploads requires a separate explicit creator opt-in and clear terms; the free-download permission alone does not grant it. Store rights/provenance evidence with each submission. The planning task does not itself authorize outreach, publication, or commercial use.

## Earnings order

First investigate possible earnings for the owner. The owner asked for options with zero cost and no card, including advertising, affiliate links, print/product links, print-on-demand, and a store such as Shopify. Dated provider policy and cost checks are in `MONETIZATION.md` and `SERVICES_REGISTER.md`. No option is currently confirmed to satisfy every zero-cost, no-card, India, site-readiness, and policy condition. Do not add ads or sales links, create accounts, enter payment information, or promise income without the required approval.

Only later, once traffic and creator participation exist, design creator benefits: creator credit/provenance, followers, featured placement, and possibly revenue sharing. These are not being built now. A qualified lawyer must review AI-art copyright, ownership, infringement, likeness, and licensing uncertainty before commercial use. These documents are product planning, not legal advice or a compliance claim.

## Decision rules

Keep the public beta non-explicit. Keep 18+ and monetization off. Maintain the existing human-review bar while seeding the gallery; never auto-approve to meet the 50–100 target. Measure performance and user experience before setting numeric targets. Creator rewards, commercial print rights, revenue, and provider approval must not be promised.

## Owner summary

Kamna को premium AI-art discovery site बनाना है।
Gallery masonry होगी और phone पर आसान चलेगी।
Approved images बिना sign-in देखी और download की जा सकेंगी।
Upload के लिए account, साफ rights और human review ज़रूरी हैं।
पहला code task T-015 metadata सुधारना है।
पहले 50–100 eligible works की plan बनेगी, review कम नहीं होगा।
Mobile और moderation की बताई समस्याएँ ठीक होंगी।
Owner की कमाई पहले; creator benefits बाद में design होंगे।
Creator की commercial art sale के लिए अलग साफ़ permission चाहिए।
18+ और monetization अभी बंद हैं।
