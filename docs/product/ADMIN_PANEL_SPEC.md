# Admin and creator dashboard specification

The admin/moderation area is separate, noindex, and server-authorized on every request. It contains a queue with artwork, creator, category, rating, AI disclosure, rights confirmation, and report context. Actions are approve, reject, remove, retry cleanup, suspend creator, and handle appeals; every action requires a reason and creates a permanent audit record.

Operational panels should include reports/takedowns, category/tag/collection management, featured-artwork controls, feature flags showing 18+ off and ads off, audit-log viewer, and a service-usage meter. The creator dashboard is separate: own uploads, status, edit/delete where allowed, download count, and profile controls. Exact provider usage values remain unknown until live services are connected.

## Owner summary

Admin panel public navigation से अलग रहेगा।
हर action का reason और audit record होगा।
18+ और ads feature flags से off रहेंगे।
Creator dashboard में केवल अपना data होगा।
Service meter live provider के बाद verify होगा।
