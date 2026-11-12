# Known issues

This file is intentionally honest and current. No critical or high-severity issue has been independently re-run in this documentation-only update.

- Owner-reported real-provider authentication/email/moderator flows are verified for Step 3. Broader upload, download, report, removal, and operational mailbox flows still need end-to-end evidence.
- The 18+ collection is closed and must not be enabled.
- The product documentation and target sitemap are reconciled with the current route manifest; broader launch acceptance remains open.
- GitHub CodeQL and repository checks have passed on the latest fix commit; owner-only security settings are not confirmed here.
- The existing Vite build emits a non-blocking large JavaScript chunk warning.
- The existing plan/TODO include a personal admin contact; placeholder cleanup is pending the owner-approved roadmap/contact decision.

- T-017 responsive masonry uses intrinsic image dimensions, but current Artwork/API records expose no width/height/aspect-ratio metadata. Lazy-loaded real images can shift card heights when they load. Provider-backed image behavior and CLS were not measured; do not change storage/API scope just to close this visual task. Measure after the visual UI exists and address with owner-approved data/API scope if evidence warrants it.
