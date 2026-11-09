# Roles and permissions

| Role | Can see | Can do |
|---|---|---|
| Visitor | approved public artwork and public policy pages | browse, search, download approved work, report |
| Member/creator | own account, own submissions, public approved work | submit, view own status, request removal |
| Moderator | moderation queue and necessary review context | approve/reject/remove with reason, record audit action |
| Admin/owner | operational configuration and audit | manage allowlist/settings through dashboards; approve launch gates |

The UI must never be the permission boundary. Every API call needs server-side role and ownership checks. The current repository has moderator routes and server checks in the intended implementation, but live-provider enforcement is not independently verified. The admin area should be `/admin`, noindex, separate from public navigation. Staff MFA availability on the selected free plan is **unknown** and must be checked in official provider documentation before launch.

## Owner summary

Visitor केवल public approved work देखेगा।
Creator केवल अपना data बदल सकेगा।
Moderator reason के साथ review करेगा।
Admin owner-only settings संभालेगा।
Buttons छिपाना security नहीं है; API checks जरूरी हैं।
