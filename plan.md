# Kamna — AI Art Community Plan

## उद्देश्य और content structure

Kamna एक multi-creator gallery होगी जहाँ केवल AI-generated artwork जमा, human review के बाद प्रकाशित, खोजा और मुफ्त डाउनलोड किया जा सकेगा। हर artwork पर स्थायी “AI-generated” पहचान, उपलब्ध tool/model जानकारी और Kamna का स्थिर artwork/provenance ID दिखेगा। AI output को वास्तविक traditional/community-created artwork बताकर प्रस्तुत नहीं किया जा सकेगा। Folk-style entries पर “AI-inspired; not a traditional/community-created work” जैसा संदर्भ दिखेगा।

Gallery में General Illustration, Festival & Celebration, Nature & Wildlife, Fantasy & Mythology, Portrait & Character, Fashion & Editorial, Architecture & Places, Abstract & Experimental तथा Indian Folk & Traditional जैसी मुख्य categories रहेंगी। भारतीय परंपराओं को अलग नाम और tags से खोजा जा सकेगा: Madhubani/Mithila, Warli, Gond, Odisha Pattachitra, Rajasthani Phad, Kalamkari, Cheriyal और Thanjavur/Tanjore। इन सबको एक ही “tribal” या “classical” शैली नहीं कहा जाएगा। Warli और Gond को भी अलग, जीवित community-based परंपराओं के रूप में दिखाया जाएगा।

अलग 18+ Fashion & Swimwear अनुभाग केवल काल्पनिक, स्पष्ट रूप से वयस्क दिखने वाले subjects और non-nude/non-explicit fashion या opaque swimwear तक सीमित रहेगा। वह default gallery में नहीं मिलेगा; अलग age gate और content rating के पीछे रहेगा। Nudity, sex acts, pornographic/sexually explicit content, minors या ambiguous-age subjects, sexualized minors, non-consensual intimate imagery, वास्तविक व्यक्ति के sexual deepfakes/बिना अनुमति likeness, deception, unlawful material और बिना अधिकार वाली images पर रोक रहेगी। उम्र की self-attestation अपने-आप reliable identity/age verification नहीं होती। यदि लागू कानून या provider के लिए अधिक मज़बूत verification/अनुमति आवश्यक निकले, तो production में 18+ section बंद रहेगा जब तक वह व्यवस्था पूरी न हो। यह plan कानूनी स्वीकृति या पूर्ण कानूनी अनुपालन का दावा नहीं करता।

## Implementation approach

- **Cloudflare Pages + Pages Functions:** Vite/React frontend और server APIs deploy होंगे। Cloudflare Workers Free plan के request/CPU limits का सम्मान किया जाएगा। Vercel Hobby production host नहीं होगा: उसका आधिकारिक free tier personal, non-commercial उपयोग के लिए है, जबकि Kamna public multi-creator service है। Firebase की आवश्यकता नहीं है।
- **Supabase Auth + Postgres + private Storage:** email sign-up/sign-in, creator profiles, artwork metadata, audience rating, reports/takedowns, moderation actions और audit records Postgres में; RLS लागू। Image bytes अलग private Storage bucket `kamna-art` में रहेंगी। Free Storage allowance 1 GB है, इसलिए app hard-stop 750 MB पर होगा; प्रत्येक image अधिकतम 8 MiB, प्रति creator 5 upload reservations/24 घंटे। Signed-in users की uploads service-side handler से गुजरेंगी; public path केवल approved artwork देगा। Free project inactivity के बाद pause हो सकता है और database/egress सीमित हैं।
- **No R2 enablement:** इस Cloudflare account में R2 अभी enabled नहीं है और उसके लिए अलग Dashboard setup चाहिए। Strictly free beta के लिए billing/card setup नहीं करेंगे। R2 बाद में तभी विकल्प होगा जब account में बिना भुगतान की शर्त के enable करना सुनिश्चित हो।
- **AI disclosure/provenance:** हर upload AI-generated होने की अनिवार्य पुष्टि, visible badge, category/rating, उपलब्ध tool/model/process metadata, और unique stable Kamna ID store होंगे। Download metadata/provenance को जहाँ तकनीकी रूप से संभव हो embed किया जाएगा; label हटाने/छिपाने का user control नहीं होगा। तकनीकी समीक्षा के बिना app कानून-अनुपालन का दावा नहीं करेगा।
- **Human moderation:** हर submission private/pending से शुरू होगी; moderator approve, reject, remove और cleanup retry कर सकेगा। Report/takedown queue, reason, receipt ID, timestamps और audit trail होंगे। Automated AI-image detection होने का कोई झूठा दावा नहीं होगा।
- **Email/contact:** दिए गए `sakhisehat09@gmail.com` को private admin/contact configuration और आवश्यक report/takedown contact में उपयोग किया जा सकता है। Confirmation emails तब तक घोषित नहीं होंगे जब तक sender/SMTP की वास्तविक setup और delivery test न हो।

## Project structure

- `src/App.tsx`, `src/styles.css`: responsive gallery, category filters, artwork pages, auth, upload, age gate, report/takedown, creator account और moderator queue.
- `src/lib/taxonomy.ts`: content categories, Indian tradition labels/tags और audience-rating display names.
- `src/lib/supabase.ts`, `src/lib/api.ts`: browser-safe Supabase Auth session और same-origin API calls.
- `functions/api/`: Cloudflare Pages Function handlers; auth verification, private Supabase Storage transfer, approved-only reads, reports, owner deletion और moderator operations.
- `functions/_lib/`: shared auth, Supabase service-role, content validation, quota and AI-provenance helpers.
- `supabase/migrations/`: tables, RLS, category/rating constraints, upload quota reservation, profiles and audit records; Storage bucket setup documented separately.
- `public/`: app mark, static routes manifest and SPA fallback.
- `research/`: dated provider-policy/free-tier findings and sourced Indian folk-art taxonomy.
- `README.md`, `TODO.md`: setup, operational limits and production outcomes; production items remain open until connected services work.

## Visual design

Gallery Ash style बनाए रखें: warm museum-paper surfaces, ink-blue navigation, editorial serif headlines और restrained safety labels। Category navigation mobile पर scrollable/stacked हो; Indian Folk & Traditional featured collection बने। 18+ content default में छिपे, अलग rating badge और gate के बाद ही दिखे। हर card/detail/download context AI-generated status को prominent रखे।
