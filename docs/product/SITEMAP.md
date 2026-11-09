# Kamna sitemap

The following routes are currently declared in `public/manus-routes.json` and implemented by `src/App.tsx` as of 2026-11-09: `/`, `/18-plus`, `/artwork/:id`, `/signin`, `/upload`, `/account`, `/profile/:handle`, `/report`, `/moderation`, `/rules`, `/privacy`, and `/terms`. `App.tsx` also has a wildcard fallback that renders a 404-style page; `*` is intentionally not listed as a public route in the manifest.

The target information architecture also needs category landing pages, one page per named Indian tradition, search, about, copyright/takedown, contact/grievance, and a noindex admin/moderation section. These are **planned routes**, not claims that they currently exist. A future route change must update `public/manus-routes.json` and be approved after roadmap Yes.

Target route set: Home; Explore/Gallery; category pages; Indian Folk & Traditional collection; Madhubani/Mithila; Warli; Gond; Pattachitra; Phad; Kalamkari; Cheriyal; Thanjavur; artwork by Kamna ID; creator profile; search; upload; account; sign in/up; report/takedown; rules; about; terms; privacy; copyright/takedown; contact/grievance; admin/moderation noindex; closed 18+; 404. Search is currently a query/filter state on `/`, not a separate `/search` route. The current noindex moderation surface is `/moderation`, not `/admin`.

## Owner summary

Current routes और planned routes अलग लिखे गए हैं।
जो route अभी नहीं है उसे existing नहीं माना गया।
हर नई route को manifest में जोड़ना होगा।
Admin और private pages noindex रहेंगे।
18+ route मौजूद हो सकता है, लेकिन collection बंद रहेगा।
