# Nabu Tarot app

Mobile web app for Nabu Tarot, live at https://angelale0211.github.io/nabu-tarot/

Five tabs:

- **Trang chủ** – greeting by name, today's date in the Gregorian, lunar (with the can chi year), Islamic, Hebrew, Persian and Buddhist calendars plus the moon phase, quick links, the visitor's Sun sign / life-path number / zodiac animal, guides matched to their interests, and the feed (Nabu's posts, plus Facebook and Instagram posts once the sync is turned on).
- **Rút bài** – tap one of seven cards; the app writes a reading of the visitor's current energy for the focus they chose (general, love, work, study, money). Fully Vietnamese or fully English.
- **Học** – two paid courses (Tarot: 78 cards + 13 spreads + guides; Lenormand: 36 cards + 7 spreads + guides; 200.000đ for 6 months each, unlocked with a code) and three free areas: astrology (12 signs, planets, houses, aspects), manifestation, fortune telling.
- **Đặt lịch** – topic, a calendar of Nabu's free hours, details, then send (in the app when accounts are on, otherwise through Instagram with the message pre-copied).
- **Tôi** – profile (name, birthday, interests), sign-in, messages with Nabu, my bookings, install hint, replay the tour.

`#/admin` is Nabu's dashboard: posts, availability, bookings, inbox.

Installs to the home screen on iPhone (Safari → Share → Add to Home Screen) and Android (Chrome → Install app). Works offline after the first visit.

## Everyday tasks

**Post a reading** – open `#/admin`, paste a GitHub token once (below), write the post, tap the cards, tick who it is for (interests, initials, signs), publish. Readers see it within a couple of minutes.

**Change free hours** – `#/admin` → *Lịch rảnh*. Tap hours per weekday, add days off, add slots already booked through Instagram, save.

**GitHub token** – GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate. Repository access: only `nabu-tarot`. Permissions: Contents → Read and write. The token stays in that phone's browser.

**Course codes** – after a client pays, open `#/admin` → *Mã học*, pick the course and start date, press *Tạo mã*, send the code. The client enters it on the course page or under Tôi → Khóa học của tôi. Codes are checked on the device against `CONFIG.courseSecret` (change it once to something private; older codes then stop working).

**Services and prices** – `src/services.js` (six services with their packages and VND prices, the payment note). The booking screen and the `#/prices` page read from it.

**Handles and wording** – `src/config.js` (Instagram, Facebook page username, Zalo, email, booking text). Then:

```
python build.py
git add -A && git commit -m "..." && git push
```

Bump `CACHE` in `sw.js` whenever `index.html` changes, so installed copies refresh.

## Nabu AI

Every card, lesson, sign and numbers page has a "Nabu AI" box. Out of the box it answers from the app's own knowledge base (no key, no cost, works offline, but it only knows what the app knows). Three ways to make it a real AI, in order of effort:

**A. Gemini, free, with web search (about 5 minutes).** Go to https://aistudio.google.com → *Get API key* → create a key. Then in https://console.cloud.google.com → APIs & Services → Credentials → open that key → *Application restrictions: Websites* → add `https://angelale0211.github.io/*`. Paste the key into `CONFIG.geminiKey` in `src/config.js`, rebuild, push. The app calls Gemini straight from the browser, and Gemini can search the web to answer questions the app's knowledge does not cover. The free tier is enough for a small audience; the referrer restriction stops other sites from using your key.

**B. Open model on Cloudflare Workers AI, free.** In `worker/wrangler.toml` uncomment the `[ai]` binding, then `cd worker && npm install && npx wrangler login && npx wrangler deploy`. Put the printed URL into `CONFIG.aiEndpoint`. Answers come from Llama 3.3 (open weights) without any key; no web search.

**C. Claude (paid, best quality):**

1. `cd worker && npm install`
2. `npx wrangler login`, then `npx wrangler secret put ANTHROPIC_API_KEY` (paste an Anthropic API key from console.anthropic.com).
3. `npx wrangler deploy` prints a URL like `https://nabu-ai.<you>.workers.dev`.
4. Put that URL into `CONFIG.aiEndpoint` in `src/config.js`, rebuild, push.

The worker keeps the key server-side, sends the model the same knowledge the page shows plus the question, and answers in the app's language. Whatever option is on, if the call fails the app falls back to the built-in answers.

## Turning on accounts, messages and in-app bookings (Firebase, free tier)

1. https://console.firebase.google.com → Add project (e.g. `nabu-tarot`).
2. Build → Authentication → Sign-in method: enable **Google**, **Email/Password**, and **Facebook** (Facebook needs a Meta developer app: paste its App ID and secret, and add the OAuth redirect URL Firebase shows into the Meta app). Instagram cannot be used as a login provider (Meta retired that API), so Instagram users sign in with Facebook or email.
3. Authentication → Settings → Authorized domains: add `angelale0211.github.io`.
4. Build → Firestore Database → Create (production mode). Rules tab: paste `firestore.rules` from this repo, replacing `nabu@example.com` with Nabu's login email(s). Publish.
5. Project settings → Your apps → Web app → copy the config object into `CONFIG.firebase` in `src/config.js`, and put the same email(s) into `CONFIG.adminEmails`. Rebuild, push. (Done for project `nabutarot`; admins are nabutarot@outlook.com and angela_le_@outlook.com.)

**Chat with photos and voice notes.** Once accounts are on, the chat on the Me tab and in the dashboard has a 📷 button (send a photo, up to 8 MB) and a 🎤 button (tap to record a voice note, tap again to send). Files go to Firebase Storage: in the Firebase console open Build → Storage → Get started (new projects need the pay-as-you-go plan for this; usage at this size stays inside the free quota), then paste `storage.rules` from this repo into its Rules tab and set `CONFIG.attachments = true`. Until then the chat has no 📷/🎤 buttons.

**Posts and availability without a GitHub token.** With Firebase on, the dashboard saves posts and availability to Firestore documents `content/posts` and `content/schedule` (rules: public read, admin write). The app reads those first and falls back to `posts.json` / `schedule.json` in the repo. The GitHub-token path is only shown when Firebase is off.

**Bookings straight into Outlook, bug reports by email.** Every in-app booking is saved to Firestore (dashboard → Đặt lịch) and, when the worker is deployed with a Resend key, also mailed to every address in `CONFIG.adminNotifyEmails` (nabutarot@outlook.com and angela_le_@outlook.com) as a calendar invitation that Outlook adds to the calendar. Bug reports from `#/report` are mailed to the same addresses, and this works even without Firebase. Steps: create a free account at https://resend.com → API Keys → create one → `cd worker && npx wrangler secret put RESEND_API_KEY` → `npx wrangler deploy` → set `CONFIG.bookingEndpoint` to `<worker url>/booking` and `CONFIG.reportEndpoint` to `<worker url>/report`. Note: on Resend's free tier, mail from onboarding@resend.dev can only reach the address you signed up with, so sign up with nabutarot@outlook.com; to also deliver to angela_le_@outlook.com, add and verify a domain in Resend (any domain you own) and change the `from` address in `worker/src/index.ts`.

After that: visitors can sign in, their profile follows them across devices, the Me tab has a chat with Nabu, booking requests arrive under `#/admin` → *Đặt lịch* (confirming locks the slot for everyone), and the inbox under *Tin nhắn*. Nabu signs in with the admin email on the Me tab to see the dashboard link.

## Weekly and monthly horoscopes

`.github/workflows/horoscope.yml` runs every day, pulls the general weekly and monthly forecasts for the 12 signs from Horoscope.com, translates them to Vietnamese, and writes `horoscope.json`. The home screen shows the two forecasts for the visitor's Sun sign under "Có thể bạn quan tâm", with the source named. No secrets are needed.

## Linking Facebook and Instagram posts

`.github/workflows/fb-sync.yml` pulls the page's posts into `fb.json` every 30 minutes; the app shows them in the feed with a link back. It needs a Meta app with the page connected:

1. https://developers.facebook.com → My Apps → Create app (Business) → add the **Facebook Login** product is not needed; add **Pages** permissions through Graph API Explorer instead.
2. Graph API Explorer → select the app → User token with `pages_show_list`, `pages_read_engagement`, `pages_read_user_content` (and `instagram_basic` for Instagram) → Generate → then call `me/accounts` to get the **Page ID** and a **Page access token**. Exchange for a long-lived token (Access Token Debugger → Extend), or use a System User token so it does not expire.
3. For Instagram: the Instagram account must be a Professional account linked to the page; `GET /{page-id}?fields=instagram_business_account` returns the **IG user ID**.
4. GitHub repo → Settings → Secrets and variables → Actions: add `FB_PAGE_ID`, `FB_PAGE_TOKEN`, and optionally `IG_USER_ID`. Run the workflow once from the Actions tab.

Until the secrets exist the workflow does nothing and the feed shows only in-app posts.

## Layout

```
src/shell.html     markup + CSS (palette from the logo)
src/config.js      brand settings, interests
src/services.js    services, packages, prices
src/strings.js     UI strings (vi/en), the five preset topics (verbatim)
src/art.js, tarot-en.js, tarot-vi.js      card artwork and card text
src/insight-en.js, insight-vi.js          the reading generator's text, 78 cards x 8 fields per language
src/kb-thuanh.js   Vietnamese keyword sets and question readings per card
src/len-*.js       Lenormand text and artwork
src/astro.js, astro-kb.js, zodiac.js      correspondences, planets/houses/aspects, sign profiles, numerology
src/spreads.js     20 layouts
src/kb-guides.js   guides (tarot, lenormand, astrology, manifestation, fortune telling)
src/core.js        utilities, deck, logo, router
src/backend.js     Firebase wrapper (auth, profile, messages, bookings)
src/home.js pick.js learn.js book.js me.js admin.js main.js
build.py           assembles index.html (strips working comments from data files)
sw.js              offline cache
posts.json         the feed        schedule.json  free hours        fb.json  synced social posts
firestore.rules    database rules  scripts/fb_sync.py  social sync   logo.png (the real avatar)  brand mark
test/run.py        headless Edge checks (55)     make_icons.py  icons from logo.png (the real avatar)
```

**Better horoscope translations.** `scripts/horoscope_sync.py` strips the site's adverts, splits each forecast into short emoji-led paragraphs, and translates with Google Translate plus an astrology glossary (houses become "nhà số 3 (khu vực giao tiếp)"). For natural Vietnamese add a free Gemini key as the repository secret `GEMINI_API_KEY` (https://aistudio.google.com → Get API key) and add `GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}` under `env:` of the "Fetch forecasts" step in `.github/workflows/horoscope.yml`; the script then rewrites every paragraph through Gemini and falls back to the glossary path if the key stops working.


## Google Play (Trusted Web Activity)

The Play app is the live site wrapped as a Trusted Web Activity: it opens the same URL full screen, with no browser bar, and updates the moment the site updates. Build it without any local tooling at https://www.pwabuilder.com (enter the site URL, Package for stores, Android): it returns an `.aab`, a signing key and the SHA-256 fingerprint. The signed package is in the repo as `nabu-tarot.apk` (installable from `#/install`); the `.aab` for Play, the keystore and its passwords live outside the repo in `C:\Users\angel\nabu-tarot-keys\pkg` (back that folder up: Play needs the same key for every future upload). The fingerprint is published at `https://angelale0211.github.io/.well-known/assetlinks.json` (repository `angelale0211.github.io`, copy in `well-known/assetlinks.json`), which is what lets the app open without a browser bar. Inside the Play build `isTWA()` is true (android-app referrer), so course prices and the buy buttons are hidden and only unlock codes are taken, as Play's payment policy requires for digital content sold outside Play Billing. Privacy policy: `privacy.html` (built from `privacy.json`, also shown at `#/privacy`). Account deletion: Me → Xoá tài khoản (`BE.deleteAccount`), plus the email route in the policy.
