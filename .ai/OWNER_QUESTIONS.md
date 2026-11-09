# Owner questions

## Roadmap approval — resolved

Problem: आगे के product और app work से पहले roadmap approve करना था।

What I already did: phase 0 audit, tool registry, product docs, sitemap reconciliation, security/QA plan और owner guide तैयार किए।

What you need to do: Owner ने 2026-11-09 को Yes दिया; approval `.ai/LOG.md` में दर्ज है।

Reply: **Yes** (resolved).

## Hosting plan — resolved

Owner ने पूछा कि Vercel मुफ़्त हो तो वहाँ रखें, वरना अधिक उपयुक्त free hosting पर जाएँ। Vercel Hobby $0 है, पर personal/non-commercial use तक सीमित है; Kamna के public creator platform के लिए यह उचित production plan नहीं है। Owner ने no-new-paid-plan विकल्प के रूप में Cloudflare चुना। Cloudflare के free limits अलग से monitor करने होंगे। कोई billing action नहीं हुआ।

## Cloudflare production setup — owner action needed

Problem: `kamna.pages.dev` Pages project मौजूद है, पर Cloudflare API में अभी deployment, Git source और Preview/Production environment variables नहीं हैं। Project Direct Upload mode में है। Wrangler CLI login उपलब्ध नहीं; GitHub Actions secrets API इस integration को access नहीं देती। इसलिए production deploy credentials या privileged Supabase key मैं नहीं देख/बना सकता।

What I already did: repo में Direct Upload के लिए gated GitHub Actions build/deploy workflow और phone-friendly steps जोड़े। Workflow build/typecheck चलाती है, लेकिन `CF_PAGES_DEPLOY_ENABLED=true` होने तक production deploy नहीं करती।

What you need to do: `docs/product/OWNER_GUIDE.md` के Cloudflare Pages deployment section के steps पूरे करें—GitHub Actions में scoped `CLOUDFLARE_API_TOKEN` और `CLOUDFLARE_ACCOUNT_ID`; Cloudflare Pages में `SUPABASE_SERVICE_ROLE_KEY` और `KAMNA_RATE_LIMIT_SECRET` को secrets सहित runtime variables; verified moderator email; Supabase SMTP/Auth redirect; फिर GitHub Actions variable `CF_PAGES_DEPLOY_ENABLED=true`। Secret values chat में न भेजें।

Reply **Yes** only after the setup is complete; reply **No** if you need the setup steps explained first. इसके बाद मैं secret values देखे बिना configuration names/status verify करूँगा और deployment/test पूरा करूँगा।
