# SEO and discovery

Approved public artwork pages should have stable URLs, descriptive titles, accurate descriptions, canonical URLs, Open Graph/Twitter cards, useful alt text, descriptive filenames, and JSON-LD only for information visible on the page. Google recommends descriptive image metadata and structured data that accurately describes visible content.[1] Admin, private, pending, removed, and closed 18+ pages must not be indexed.

The technical backlog is: generate and validate `sitemap.xml`; publish `robots.txt`; add canonical and social metadata; add ImageObject/CreativeWork JSON-LD after measuring current route rendering; use Search Console; and measure Core Web Vitals. Google’s current good targets are LCP within 2.5 seconds, INP below 200 ms, and CLS below 0.1.[2] These are external recommendations, not a claim that Kamna currently meets them.

## Owner steps

The owner must create or select a Search Console property, verify the domain using the offered dashboard method, submit the sitemap URL, and send a screenshot of the property verification and sitemap status. Do not add analytics until privacy notice, consent, and data minimization are reviewed.

## References

[1]: https://developers.google.com/search/docs/appearance/google-images "Google image SEO guidance, accessed 2026-11-09"
[2]: https://developers.google.com/search/docs/appearance/core-web-vitals "Google Core Web Vitals guidance, accessed 2026-11-09"
[3]: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data "Google structured data guidance, accessed 2026-11-09"

## Owner summary

Google discovery के लिए साफ़ public pages चाहिए।
Private और admin pages index नहीं होंगे।
Sitemap और Search Console setup launch से पहले verify होगा।
Performance numbers अभी target हैं, achieved नहीं।
Analytics privacy review के बिना नहीं लगेगा।
