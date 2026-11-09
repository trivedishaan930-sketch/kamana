# User journeys

Each journey must show a clear loading, empty, error, and recovery state. Current routes are listed in `SITEMAP.md`; planned screens are marked planned.

**Discovery:** Google/social → home → search/category → artwork page → share/download. Risks: stale route, no approved result, missing image, misleading metadata.

**Creator onboarding:** sign in/up → confirmation → account → upload → preview and rights/AI confirmations → pending status. Risks: provider unavailable, invalid bytes, quota, unclear rejection.

**Review:** creator waits → moderator queue → approve/reject/remove with reason → creator status. Risks: unauthorized action, missing reason, audit failure, public pending leak.

**Reporting/removal:** artwork page → report or takedown → receipt/status → moderation action. Risks: abuse, private contact leakage, no staffed escalation.

**Download:** approved artwork page → visible AI badge/ID → download. Risks: non-approved object access, missing provenance, broken object cleanup.

Private-beta testing must use 5–10 real creators and record questions/results separately.

## Owner summary

हर journey में success और error दोनों लिखे गए हैं।
Upload के बाद pending status साफ़ होगा।
Moderator reason के बिना action नहीं करेगा।
Report को receipt और status मिलेगा।
Download केवल approved artwork का होगा।
