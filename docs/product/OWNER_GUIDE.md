# Owner guide

यह guide phone से follow करने के लिए है। Keys, passwords और tokens chat में न भेजें। उन्हें केवल संबंधित provider dashboard के secret/environment settings में डालें।

## Roadmap approval

Problem: docs और future product work शुरू करने से पहले scope approve करना है। What I already did: phase 0 audit और docs-only roadmap तैयार किया। What you need to do: 1. GitHub पर repository खोलें। 2. `docs/product/ROADMAP.md` पढ़कर screenshot भेजें। 3. Reply exactly **Yes** या **No**. This is the single roadmap question.

## GitHub security settings

GitHub mobile/browser में repository खोलें। **Settings → Code security and analysis** खोलें। Dependabot alerts, secret scanning, push protection, और CodeQL जो options उपलब्ध हों उन्हें enable करें। Settings page का screenshot भेजें। Agent कोई key नहीं माँगेगा।

## Provider setup

Cloudflare Pages और Supabase dashboards में owner स्वयं environment values दर्ज करेगा। Repository में service-role key नहीं रखनी है। SMTP sender और moderator account तभी production-ready माने जाएंगे जब test evidence हो।

## Troubleshooting

Push rejected हो तो पहले `git pull --rebase`, फिर relevant check, फिर push करें। Append-only log conflict में दोनों entries रखें और UTC timestamp order करें। Code/doc conflict में दोनों intents समझकर merge करें। CI दो attempts में ठीक न हो तो exact error को `.ai/INCIDENTS/` में लिखें और stop करें। Shared work पर `git reset --hard` या force-push न करें.

## Owner summary

मैं phone-friendly steps दूँगा।
आपको keys या passwords भेजने की जरूरत नहीं है।
पहला काम roadmap पर Yes/No देना है।
GitHub security settings का screenshot देना है।
18+ और public launch के लिए अलग approval लगेगा।
