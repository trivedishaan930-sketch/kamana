# Kamna provider and AI-content policy notes

Checked 9 November 2026. These notes help choose a cautious beta architecture; they are not legal advice or provider approval.

## Hosting choice

Vercel’s Hobby plan is described as free for personal projects and restricted to non-commercial, personal use. Its Acceptable Use Policy applies to customers and their users; it prohibits certain unlawful, obscene, abusive, sexually exploitative or otherwise illegal material and says non-Enterprise customers may not use a service for an “objectionable purpose.” A public multi-creator upload/download community does not fit the safest reading of a personal Hobby deployment, so Kamna should not use Vercel Hobby as its production host without written approval. [1] [2]

The selected implementation uses Cloudflare Pages/Pages Functions for the web app and API, and Supabase Auth, Postgres, and a private Supabase Storage bucket for uploaded images. A Free Supabase project named Kamna was created in the Mumbai region after a $0/month creation quote and explicit owner approval. This is not a promise that future usage, overages, delivery, or other providers will remain free. The code enforces a 750 MiB storage reservation ceiling below the Free tier's listed 1 GB file-storage allowance. R2 and Firebase are not part of this implementation. Cloudflare's free Pages/Workers limits still apply to the Pages Functions workload. [3] [5]

The project notes checked for this build list Supabase Free at 50,000 monthly active users, 500 MB database, 1 GB file storage and 5 GB egress; free projects may pause after inactivity, and organization project limits apply. Re-check current provider dashboards before public launch and monitor usage; the 750 MiB application cap does not guarantee zero spend outside the stated Free plan. [6] [7]

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

## Hosting free-tier comparison — checked 9 November 2026

Vercel Hobby is $0/month but limited to personal, non-commercial use; Vercel lists Pro at $20 per developer seat/month before applicable taxes and metered usage. The owner chose Cloudflare rather than paying for Vercel Pro. This is a plan/policy choice, not a claim that the whole product will remain free at every usage level. [11] [12]

Cloudflare Pages Free includes 500 builds/month, one concurrent build, up to 20,000 site files, and a 25 MiB per-file asset limit. Pages Functions count against Workers limits. Workers Free includes 100,000 dynamic requests/day, 10 ms CPU per invocation, 128 MB memory, and 50 subrequests per invocation; static asset requests are free/unlimited. The daily Functions limit can return an error when exceeded; it does not silently become an unlimited paid plan. The Workers Paid plan starts at $5/month plus usage, so do not enable or upgrade it without owner approval. [13] [14] [15]

Cloudflare API inspection on 2026-11-09 found the existing `kamna.pages.dev` project has `source: null`, `latest_deployment: null`, no Preview/Production environment variable names, and production branch `main`. This is a Direct Upload project. Wrangler CLI is not authenticated in the current environment, so deployment is arranged through a guarded GitHub Actions/Wrangler workflow. Do not connect Git integration or convert project type casually; follow the official project-mode guidance. [16] [17]

### Hosting and deployment references

[11]: https://vercel.com/docs/limits/fair-use-guidelines "Vercel Hobby fair-use guidance"
[12]: https://vercel.com/pricing "Vercel plans and pricing"
[13]: https://developers.cloudflare.com/pages/platform/limits/ "Cloudflare Pages limits"
[14]: https://developers.cloudflare.com/workers/platform/limits/ "Cloudflare Workers limits"
[15]: https://developers.cloudflare.com/workers/platform/pricing/ "Cloudflare Workers pricing"
[16]: https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/ "Cloudflare Pages Direct Upload via CI"
[17]: https://developers.cloudflare.com/pages/platform/known-issues/ "Cloudflare Pages project mode limitations"
