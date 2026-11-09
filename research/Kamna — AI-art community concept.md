# Kamna — AI-art community concept

Kamna is an English-language 18+ community concept for discovering, publishing, viewing, and downloading fictional adult AI-generated artwork. The approved visual direction is **Gallery Ash**: warm museum-like paper, ink-blue navigation, editorial typography, and restrained safety labels.

## Current project structure

- `src/App.tsx` contains the routes, gallery, artwork detail view, creator profile, upload preview flow, age gate, demo reporting, moderation view, and draft information pages.
- `src/styles.css` contains the responsive Gallery Ash design system.
- `src/main.tsx` boots React Router; `index.html` is the static entry document.
- `public/manus-routes.json` declares the pages served by the application; `public/_redirects` supplies a Cloudflare Pages SPA fallback if deployment is later approved.
- `public/kamna-mark.svg` is the site mark/favicon; `app.config.ts` supplies the project logo URL.
- `TODO.md` tracks the approved product outcomes.

## What works in this prototype

The gallery supports search, tag/category filtering, sorting, sensitive-thumbnail reveal, artwork detail pages, creator profiles, and local demo downloads. The upload form checks JPG/PNG/WebP type and an 8 MB size limit, previews the file in the browser, collects title/description/tags and AI metadata, and requires rights and fictional-adult safety confirmations. A post is visible only in the current tab session. Reports appear in a local demonstration queue only.

The age gate is a self-attestation, not identity or age verification. Sign-in, persistent profiles, public uploads, cloud image storage, production downloads, server-side safety scanning, human moderation, takedowns, email notifications, and audit records are not connected. Refreshing or closing the tab discards demo posts and reports. The legal pages are drafts and do not constitute legal advice or launch-ready terms.

## Proposed free-tier architecture (not connected)

A reasonable evaluation path is a static React build on a provider whose current plan and policy explicitly permit this exact adult user-generated-content use; Supabase for account/authentication and relational metadata; and Cloudflare R2 Standard for image originals and derived previews if Cloudflare confirms this content category is acceptable. Use private upload authorization, generated previews, explicit MIME/size limits, server-side moderation gates, abuse controls, usage budgets, and backups. Store tags, creator ownership, content ratings, reports, moderation decisions, licenses, and audit history in a relational database. Never expose privileged storage keys in browser code.

Do **not** connect or publish actual adult uploads until each provider confirms in writing that lawful consensual adult AI artwork and the planned user-upload, distribution, and download workflow are allowed. The surfaced policies expressly prohibit CSAM and non-consensual sexual imagery/deepfakes. Provider acceptance may also depend on whether content is deemed obscene, sexually exploitative, or otherwise objectionable, and on the launch jurisdictions.

## Free does not mean unlimited or guaranteed zero cost

As checked on 2026-11-08, Supabase's official Free plan page lists $0/month, 500 MB database per project, 1 GB file storage, 5 GB egress, 5 GB cached egress, 50,000 monthly active users, up to two active projects, and pausing a free project after one week of inactivity. Cloudflare R2 Standard lists a monthly free allowance of 10 GB-month storage, 1 million Class A requests, and 10 million Class B requests, with egress to the Internet free. Its documented overage prices mean usage outside allowances can incur charges. These allowances can change and are not a guarantee of a zero bill.

Vercel's current Hobby terms limit the plan to personal/non-commercial use. Its Acceptable Use Policy prohibits non-consensual intimate imagery, including synthetic media/deepfakes, and describes restrictions on obscene, sexually exploitative, or otherwise objectionable content for non-Enterprise customers. Kamna should not rely on Hobby for the public adult community without written provider approval. Cloudflare's Trust Hub says it may block or remove child sexual abuse material, infringing, unlawful, harmful, or rights-violating content, but the material reviewed does not affirmatively approve lawful consensual adult UGC. Treat Cloudflare Pages/R2 suitability as **unconfirmed**, not as approved.

## Safety and operational requirements before launch

A real service needs a robust age/identity strategy proportionate to its jurisdictions; prevention of minor or ambiguous-age content; a ban on CSAM, NCII, real-person sexual deepfakes, unlawful content, and unlicensed works; reliable reporting and urgent escalation; human review and takedown handling; repeat-offender enforcement; a tested privacy/security design; copyright process; provider approval; and jurisdiction-specific legal review. A click-through 18+ gate alone is not sufficient age assurance.

## Primary policy and pricing references (checked 2026-11-08)

- [Vercel Acceptable Use Policy](https://vercel.com/legal/acceptable-use-policy)
- [Vercel Hobby plan](https://vercel.com/docs/plans/hobby)
- [Vercel Terms of Service](https://vercel.com/legal/terms)
- [Cloudflare Self-Serve Subscription Agreement](https://www.cloudflare.com/terms/)
- [Cloudflare abuse approach](https://www.cloudflare.com/trust-hub/abuse-approach/)
- [Cloudflare R2 pricing](https://developers.cloudflare.com/r2/pricing/)
- [Supabase Acceptable Use Policy](https://supabase.com/aup)
- [Supabase pricing](https://supabase.com/pricing)
