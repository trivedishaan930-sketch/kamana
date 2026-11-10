# Owner brief

Status: re-based on the owner's request dated 2026-11-10. This is the source for the updated PRD, roadmap, and task sequence. The new roadmap approval is pending. This document does not authorize app-code, provider, storage, or live-site changes.

## Product direction

Kamna should become a premium, mobile-friendly discovery site for AI-generated art. The experience should feel as easy to browse as a Pinterest-style visual gallery, but remain original to Kamna. The owner specifically wants a masonry grid, many useful categories, fast search, smooth mobile browsing, and a more premium look than the current live beta.

Anyone should be able to view and download an approved image without signing in. Uploading requires an account, the uploader's rights and AI disclosures, and the existing human review. A submission must remain private until a moderator approves it. A free download is not a transfer of commercial or republication rights.

The outdated live meta description — “Kamna — an 18+ community for lawful, fictional AI artwork.” — misstates the public product. Correcting the page title/meta description is the first code task after the owner approves this revised roadmap. No metadata code is changed in this docs-only task. The 18+ section remains closed unless separately reviewed and approved.

## Baseline measured on 2026-11-10

The current homepage has nine general-audience collection categories. It also has separate Indian tradition/style filters. The search field and API query exist: code searches artwork title, description, tags, and creator display name. Search speed and real-user success have not been measured, so no numeric performance target is set.

The current gallery is a responsive equal-column CSS grid, not masonry. Desktop uses three columns; the CSS switches to two columns at narrower widths and one column at the smallest breakpoint. Artwork tiles use a fixed aspect ratio. No approved artworks are currently visible, so the visitor's real gallery, search relevance, and anonymous image-download experience cannot be end-to-end tested against an actual public work.

The code has a public `/upload` route whose submit control requires a signed-in account and configured provider, and a moderator screen at `/moderation` (there is no `/admin` route). The homepage title is `Kamna — Art beyond the ordinary`; the meta description still contains the old 18+ wording. Mobile responsiveness exists in CSS, but smoothness, accessibility, loading time, and performance on real phones have not been measured.

## Earnings order

First investigate possible earnings for the owner. The owner asked for options with zero cost and no card, including advertising, affiliate links, print/product links, print-on-demand, and a store such as Shopify. The dated policy and cost checks are in `MONETIZATION.md` and `SERVICES_REGISTER.md`. Findings are conditional: there is no confirmed option that simultaneously meets all of the zero-cost, no-card, India, site-readiness, and policy requirements today. Do not add ads or sales links, create accounts, enter payment information, or promise income without the required owner approval.

Only later, once traffic and creator participation exist, design creator benefits. Candidate benefits are proper creator credit and provenance, followers, featured placement, and possibly revenue sharing. They are not being built now. Selling another creator's uploads as prints requires that creator's explicit commercial license and clear terms for scope, duration, attribution, compensation, takedown, refunds, and responsibility. Current free-download terms do not grant those rights.

## Risks and decision rules

An ad or affiliate provider may reject a thin, image-heavy, empty, adult-adjacent, or otherwise unsuitable site. A platform's general permission to use AI is not proof that it will approve Kamna for monetization. AI artwork may raise ownership, infringement, likeness, and licensing questions; no copyrightability guarantee is made. A qualified lawyer familiar with the relevant jurisdiction must review the position before commercial use. These documents are product planning, not legal advice or a compliance claim.

The public beta remains non-explicit. Keep the 18+ feature and monetization off. Measure performance and user experience before setting numeric targets; do not invent traffic, income, or conversion figures.

## Owner summary

Kamna को premium AI-art discovery site बनाना है।
Gallery masonry होगी और phone पर आसान चलेगी।
Approved images बिना sign-in देखी और download की जा सकेंगी।
Upload के लिए account और human review ज़रूरी रहेंगे।
पहला code task metadata सुधारना है, पर नए roadmap पर Yes के बाद।
Owner की कमाई पहले; creators को लाभ बाद में design होगा।
अभी कोई ads, store या paid feature चालू नहीं होगा।
किसी creator की art बेचने से पहले उसकी साफ़ written permission चाहिए।
Income या copyright की guarantee नहीं है।
