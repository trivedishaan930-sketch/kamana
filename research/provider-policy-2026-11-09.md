# Kamna provider and AI-content policy notes

Checked 9 November 2026. These notes help choose a cautious beta architecture; they are not legal advice or provider approval.

## Hosting choice

Vercel’s Hobby plan is described as free for personal projects and restricted to non-commercial, personal use. Its Acceptable Use Policy applies to customers and their users; it prohibits certain unlawful, obscene, abusive, sexually exploitative or otherwise illegal material and says non-Enterprise customers may not use a service for an “objectionable purpose.” A public multi-creator upload/download community does not fit the safest reading of a personal Hobby deployment, so Kamna should not use Vercel Hobby as its production host without written approval. [1] [2]

Cloudflare’s free Workers/Pages offering is a closer technical fit for a small public beta: static assets are free and unlimited under the Workers pricing page, while Pages Functions count as Workers and the Free plan includes 100,000 requests per day and 10 ms CPU per invocation. R2 Standard includes 10 GB-month storage, 1 million Class A operations, 10 million Class B operations, and no egress charge; usage above included allowances can cost money. Do not use the Cloudflare CDN to serve a disproportionate amount of image content; keep image bytes in R2. [3] [4] [5]

Supabase Free currently lists 50,000 monthly active users, 500 MB database, 1 GB file storage and 5 GB egress; free projects pause after one week of inactivity and the organization is limited to two active free projects. Store only metadata/auth records in Supabase and keep artwork bytes in R2. Firebase is not needed for this stack. Google Cloud’s AUP prohibits illegal activity, non-consensual explicit imagery, child sexual exploitation and infringement; Firebase’s terms also state that use is for purposes related to a trade, business, craft or profession. [6] [7] [8]

## Adult/suggestive category boundary

The current written policies do not give unconditional approval for a public adult-image community. Supabase prohibits CSAM, synthetic media intended to deceive or harass (including non-consensual sexual imagery), privacy violations, unlawful activity and infringement. Cloudflare prohibits unlawful material, CSAM/exploitation and rights violations; it may disable hosted content that violates applicable terms. These policies do not expressly say that ordinary, non-nude swimwear/fashion art is prohibited, but they are not a written provider guarantee for “hot” or sexually suggestive material. Keep the separate 18+ fashion/swimwear category limited to fictional, clearly adult, fully clothed or non-explicit swimwear depictions, subject to human approval; block nudity, sexual acts, explicit/pornographic content, ambiguous-age depictions, sexualized minors, non-consensual likenesses and real-person sexual deepfakes. A self-attestation age gate is not reliable identity verification and must not be advertised as legally sufficient. [6] [7] [8]

## Indian AI-content transparency

The Ministry of Electronics and Information Technology’s 10 February 2026 amendment (G.S.R. 120(E)) defines obligations for synthetic information. The Gazette text calls for reasonable and appropriate technical measures to prevent specified unlawful synthetic content. Permissible synthetic content must carry prominent visual/audio identification and, to the extent technically feasible, permanent metadata or another provenance mechanism, including an identifier for the intermediary’s system; users must not be enabled to suppress or remove that identification. The amendment also changes complaint timelines for certain categories, including a two-hour period for specified intimate-image/impersonation complaints. A visible site badge alone may not satisfy every applicable provenance duty, so the implementation needs a stable record/identifier and legal review before claiming full compliance. [9] [10]

## References

[1]: https://vercel.com/docs/plans/hobby "Vercel Hobby Plan"
[2]: https://vercel.com/legal/acceptable-use-policy "Vercel Acceptable Use Policy"
[3]: https://developers.cloudflare.com/workers/platform/pricing/ "Cloudflare Workers Pricing"
[4]: https://developers.cloudflare.com/r2/pricing/ "Cloudflare R2 Pricing"
[5]: https://www.cloudflare.com/service-specific-terms-application-services/ "Cloudflare Service-Specific Terms"
[6]: https://supabase.com/aup "Supabase Acceptable Use Policy"
[7]: https://www.cloudflare.com/terms/ "Cloudflare Terms of Service"
[8]: https://cloud.google.com/terms/aup "Google Cloud Acceptable Use Policy"
[9]: https://firebase.google.com/terms "Terms of Service for Firebase Services"
[10]: https://www.meity.gov.in/static/uploads/2026/02/550681ab908f8afb135b0ad42816a1c9.pdf "Information Technology Intermediary Rules Amendment, 10 February 2026"
