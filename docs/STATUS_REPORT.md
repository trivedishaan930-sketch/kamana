# Kamna status report

## What is present

Kamna is a Vite/React gallery with Cloudflare Pages Functions and Supabase-oriented authentication, artwork metadata, private storage, moderation, reports, takedown intake, provenance labels, category filters, creator pages, and draft policy pages. The application already contains a public route manifest and a Gallery Ash visual system. The repository also has five recorded Supabase migrations, provider research, and relay documentation.

## What is not verified

The current repository has not been verified here against a live Supabase account, live Cloudflare Pages deployment, production email delivery, a real moderator account, or end-to-end account/upload/moderation/download/report/removal flows. The 18+ section must remain closed. GitHub Actions currently verifies the repository check and CodeQL, but owner-only GitHub security settings still require dashboard confirmation.

## Known risks and gaps

The product route set is smaller than the master-directive target sitemap. The product docs are incomplete and need reconciliation with the real routes before any app-code work. There is no independent evidence yet for current external provider limits beyond the dated research already committed. The repository contains no production credentials, which is correct.

## Immediate next steps

Complete the docs-only product set, add the owner approval question, record source dates beside external claims, and keep storage explicitly separate. Do not mark product outcomes complete until their evidence is actually run and recorded.
