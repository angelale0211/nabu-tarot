# Nabu Tarot app

Mobile web app for Nabu Tarot, live at https://angelale0211.github.io/nabu-tarot/

Five tabs:

- **Trang chủ** – greeting by name, today's date in the Gregorian, lunar (with the can chi year), Islamic, Hebrew, Persian and Buddhist calendars plus the moon phase, quick links, the visitor's Sun sign / life-path number / zodiac animal, guides matched to their interests, and the feed (Nabu's posts, plus Facebook and Instagram posts once the sync is turned on).
- **Rút bài** – tap one of seven cards; the app writes a reading of the visitor's current energy for the focus they chose (general, love, work, study, money). Fully Vietnamese or fully English.
- **Học** – the knowledge library: 78 tarot cards, 36 Lenormand cards, 12 signs + planets + houses + aspects, 20 spreads, and guides on manifestation and fortune telling (numerology, palmistry, playing cards, zodiac animals, oracle decks).
- **Đặt lịch** – topic, a calendar of Nabu's free hours, details, then send (in the app when accounts are on, otherwise through Instagram with the message pre-copied).
- **Tôi** – profile (name, birthday, interests), sign-in, messages with Nabu, my bookings, install hint, replay the tour.

`#/admin` is Nabu's dashboard: posts, availability, bookings, inbox.

Installs to the home screen on iPhone (Safari → Share → Add to Home Screen) and Android (Chrome → Install app). Works offline after the first visit.

## Everyday tasks

**Post a reading** – open `#/admin`, paste a GitHub token once (below), write the post, tap the cards, tick who it is for (interests, initials, signs), publish. Readers see it within a couple of minutes.

**Change free hours** – `#/admin` → *Lịch rảnh*. Tap hours per weekday, add days off, add slots already booked through Instagram, save.

**GitHub token** – GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate. Repository access: only `nabu-tarot`. Permissions: Contents → Read and write. The token stays in that phone's browser.

**Services and prices** – `src/services.js` (six services with their packages and VND prices, the payment note). The booking screen and the `#/prices` page read from it.

**Handles and wording** – `src/config.js` (Instagram, Facebook page username, Zalo, email, booking text). Then:

```
python build.py
git add -A && git commit -m "..." && git push
```

Bump `CACHE` in `sw.js` whenever `index.html` changes, so installed copies refresh.

## Turning on accounts, messages and in-app bookings (Firebase, free tier)

1. https://console.firebase.google.com → Add project (e.g. `nabu-tarot`).
2. Build → Authentication → Sign-in method: enable **Google**, **Email/Password**, and **Facebook** (Facebook needs a Meta developer app: paste its App ID and secret, and add the OAuth redirect URL Firebase shows into the Meta app). Instagram cannot be used as a login provider (Meta retired that API), so Instagram users sign in with Facebook or email.
3. Authentication → Settings → Authorized domains: add `angelale0211.github.io`.
4. Build → Firestore Database → Create (production mode). Rules tab: paste `firestore.rules` from this repo, replacing `nabu@example.com` with Nabu's login email(s). Publish.
5. Project settings → Your apps → Web app → copy the config object into `CONFIG.firebase` in `src/config.js`, and put the same email(s) into `CONFIG.adminEmails`. Rebuild, push.

After that: visitors can sign in, their profile follows them across devices, the Me tab has a chat with Nabu, booking requests arrive under `#/admin` → *Đặt lịch* (confirming locks the slot for everyone), and the inbox under *Tin nhắn*. Nabu signs in with the admin email on the Me tab to see the dashboard link.

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
firestore.rules    database rules  scripts/fb_sync.py  social sync   logo.svg  brand mark
test/run.py        headless Edge checks (55)     make_icons.py  icons from logo.svg
```
