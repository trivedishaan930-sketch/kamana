# Kamna architecture

The browser loads the React application from the Vite bundle. Browser-safe Supabase Auth handles sessions when configured. Browser requests for provider-backed operations use same-origin `/api/*` Pages Functions. Functions validate session and ownership, apply input and quota checks, and use privileged server-side provider access where required. Public reads are limited to approved records; pending and removed submissions remain private.

The trust boundary is between the browser, Pages Functions, Supabase Auth, Postgres/RLS, and private Storage. The browser is untrusted and never receives service-role credentials. Moderation actions require server-side authorization and persistent audit records. This document describes the existing intended flow; live-provider behavior is not verified in this docs-only phase.

Storage remains a separate directive and is intentionally not changed here.
