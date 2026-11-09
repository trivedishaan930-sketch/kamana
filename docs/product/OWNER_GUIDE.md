# Owner guide

यह guide phone से follow करने के लिए है। Keys, passwords और tokens chat में न भेजें। उन्हें केवल संबंधित provider dashboard या GitHub Actions secret settings में डालें।

## Roadmap approval

Roadmap पर owner की **Yes** approval 2026-11-09 को `.ai/LOG.md` में दर्ज है।

## Hosting decision

Vercel Hobby मुफ़्त है, लेकिन personal/non-commercial use के लिए है। Kamna जैसे public creator platform के लिए owner ने बिना नया paid plan लिए Cloudflare Pages चुना है। Free limits और provider policy के official sources `research/provider-policy-2026-11-09.md` में हैं।

## Cloudflare Pages deployment

`kamna.pages.dev` project पहले से है, पर अभी Direct Upload mode में है—Git source, deployment और runtime variables configured नहीं हैं। Repo में `.github/workflows/deploy-cloudflare-pages.yml` build/typecheck करता है; production deploy बंद रहेगा जब तक owner इसे explicitly enable न करे।

1. Cloudflare Dashboard → **API Tokens** → Create Token → **Custom Token** में scope **Account → Cloudflare Pages → Edit** चुनें। Token को सिर्फ GitHub Actions secret `CLOUDFLARE_API_TOKEN` के रूप में repository Settings → **Secrets and variables → Actions** में डालें। उसी जगह `CLOUDFLARE_ACCOUNT_ID` secret भी रखें। Token chat या repository में न लिखें।
2. Cloudflare Dashboard → **Workers & Pages → Pages → kamna → Settings → Environment variables** में Preview और Production दोनों के लिए ये values जोड़ें: `SUPABASE_URL` (plain text), `SUPABASE_SERVICE_ROLE_KEY` (secret), `KAMNA_ADMIN_EMAIL` (verified moderator का exact email, plain text), `KAMNA_RATE_LIMIT_SECRET` (नया unpredictable secret, secret), `ADULT_SECTION_ENABLED=false` (plain text)। Service-role key Supabase से सीधे dashboard में लें; publishable key इसका विकल्प नहीं है। `VITE_SUPABASE_URL` और `VITE_SUPABASE_PUBLISHABLE_KEY` build workflow में client-safe values के रूप में हैं; इन्हें privileged key न समझें।
3. Supabase Dashboard → **Authentication → URL Configuration** में Site URL `https://kamna.pages.dev` और email confirmation redirect `https://kamna.pages.dev/signin` जोड़ें। Email confirmation और production SMTP/sender चालू व test करें। Moderator account email-verified हो और वही email `KAMNA_ADMIN_EMAIL` से मेल खाए।
4. Launch checklist पूरा होने पर GitHub repository Settings → **Secrets and variables → Actions → Variables** में `CF_PAGES_DEPLOY_ENABLED=true` बनाएँ। फिर **Actions → Cloudflare Pages deploy → Run workflow** चलाएँ; इसके बाद main branch pushes build और deploy करेंगी। पहले production secrets/SMTP/moderator test हुए बिना variable enable न करें।
5. `ADULT_SECTION_ENABLED` false ही रखें। Report/takedown mailbox staffed और legally suitable होनी चाहिए; app अभी queue में reports रखती है, email alert नहीं भेजती।

## GitHub security settings

GitHub mobile/browser में repository खोलें। **Settings → Code security and analysis** खोलें। Dependabot alerts, secret scanning, push protection, और CodeQL जो options उपलब्ध हों उन्हें enable करें। Settings page का screenshot भेजें। Agent कोई key नहीं माँगेगा।

## Troubleshooting

Push rejected हो तो पहले `git pull --rebase`, फिर relevant check, फिर push करें। Append-only log conflict में दोनों entries रखें और UTC timestamp order करें। Code/doc conflict में दोनों intents समझकर merge करें। CI दो attempts में ठीक न हो तो exact error को `.ai/INCIDENTS/` में लिखें और stop करें। Shared work पर `git reset --hard` या force-push न करें।

## Owner summary

यह repo अभी production में deployed नहीं है। आवश्यक credentials केवल dashboards/GitHub secrets में डालें; उन्हें chat में न भेजें। Cloudflare workflow तभी deploy करेगी जब `CF_PAGES_DEPLOY_ENABLED=true` हो। 18+ तथा ads बंद रहेंगे और public launch से पहले provider-backed end-to-end checks जरूरी हैं।
