# Kamna

Kamna is a moderated gallery for clearly labelled AI-generated artwork. It is a creator upload/download community, not an image generator or pornography site. The separate 18+ fashion/swimwear path is **disabled by default** and must remain off until its controls and provider/legal readiness have been reviewed.

## Current backend

- **Frontend/API:** React + Vite, served by Cloudflare Pages with Cloudflare Pages Functions under `functions/`.
- **Auth/database/images:** Supabase Auth, Postgres, and a private Storage bucket named `kamna-art`; images are not public-bucket objects.
- **Project:** Supabase project `Kamna`, ref `cgtlvfhvmhqpklkzbuma`, region `ap-south-1` (Mumbai), on the Free plan. The project was created after a $0/month quote and owner approval. A $0 creation quote is not a guarantee that all future use or other services will remain free.
- **Database:** the committed migrations in `supabase/migrations/` were applied to that project. They add AI/provenance metadata, the 750 MiB app-level storage ceiling, private bucket, upload reservations, moderation/report RPCs, and deny-by-default client access to server-only data.
- **Not used:** Firebase, Vercel, Cloudflare R2, third-party image generation, payment processing.

## Local setup

Use Node.js and the pinned pnpm version declared in `package.json`.

```sh
pnpm install --frozen-lockfile
cp .env.example .env.local
cp .dev.vars.example .dev.vars
```

`.env.local` contains only the browser-safe Supabase URL and publishable key. In `.dev.vars`, set:

- `SUPABASE_SERVICE_ROLE_KEY` to the project’s service-role secret (Cloudflare/local runtime only; never place it in `VITE_*` variables or commit it).
- `KAMNA_ADMIN_EMAIL` to the exact, email-verified moderator account allowed to open the queue.
- `KAMNA_RATE_LIMIT_SECRET` to a strong random value, e.g. `openssl rand -hex 32`.
- Keep `ADULT_SECTION_ENABLED=false` for normal development and until a separately reviewed launch decision.

Then start the Cloudflare Pages preview (it builds the app and serves the Pages Functions):

```sh
pnpm preview:pages
```

`pnpm dev` starts Vite only; it does not run Cloudflare Pages Functions. The Pages preview will return setup errors for API routes until the required `.dev.vars` values have been supplied. The local secret file is ignored by Git.

## Cloudflare Pages configuration

Connect the existing GitHub repository to a Cloudflare Pages project. Use the repository root, build command `pnpm install --frozen-lockfile && pnpm build`, and output directory `dist`. Pages automatically discovers the `functions/` directory.

Set the following for both Preview and Production environments:

**Build-time browser-safe variables**

- `VITE_SUPABASE_URL=https://cgtlvfhvmhqpklkzbuma.supabase.co`
- `VITE_SUPABASE_PUBLISHABLE_KEY` from the committed `.env.example` (publishable/client key only).

**Pages Functions runtime variables/secrets**

- `SUPABASE_URL=https://cgtlvfhvmhqpklkzbuma.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` as a Cloudflare **secret**.
- `KAMNA_ADMIN_EMAIL` as the verified moderator email allowlist.
- `KAMNA_RATE_LIMIT_SECRET` as a Cloudflare **secret**.
- `ADULT_SECTION_ENABLED=false`.

Do not copy `.dev.vars.example` verbatim into production: replace each placeholder and keep privileged values in Cloudflare’s secret manager. Configure Supabase Auth email confirmation and production SMTP before public sign-up. Create/verify the moderator account, then set its exact email in the allowlist. Never commit `.env.local`, `.dev.vars`, a service-role key, or other private credentials.

## Safety and operating limits

The server validates image bytes (JPG, PNG, WebP; at most 8 MiB), reserves no more than five uploads per creator per rolling 24 hours, and enforces a 750 MiB artwork-storage ceiling. Every upload starts private and pending. Only approved artwork is returned by public gallery, profile, detail, and download APIs. Downloads are free and include the Kamna provenance ID in the filename; free access does not transfer copyright. Moderation actions are recorded in a database audit trail; failed object cleanup stays pending and can be retried.

The 18+ collection is hidden unless the operator explicitly enables its feature flag. An adult self-attestation is not identity verification. Its content policy excludes nudity, sexual acts, pornographic/explicit content, minors or ambiguous-age subjects, sexualized minors, non-consensual intimate imagery, sexual deepfakes, and unauthorized likenesses. Do not enable it if provider terms, law, or required stronger controls are unresolved.

## Before public launch

This repository and database are prepared, but the public site is **not deployed by this change**. Cloudflare Pages credentials/configuration, production secrets, SMTP, an approved moderator account, and a verified/operational grievance mailbox still need owner-side setup. The report form stores submissions in the moderator queue; it does not send email notifications. The visible contact address in the site is not proof that an inbox is monitored. Confirm it is staffed and legally suitable before relying on it. The privacy, terms, and content-policy pages are beta drafts, not legal advice or a claim of full legal compliance.

After configuration, verify: confirmed-email sign-in; upload and pending state; public invisibility before approval; moderator allowlist and audit trail; approval-to-gallery visibility; adult collection remains hidden unless deliberately enabled; short-lived image links and ID-bearing downloads; report receipt/queue; creator removal; and successful private-object cleanup.
