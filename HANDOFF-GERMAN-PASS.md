# Handover — German localization pass, privacy correction, composer German

Session of 2026-09-08. Released as `4bf2839` on `main`, pushed, and confirmed
live at https://nabutarot.com. Start here if you are picking the work up.

---

## What shipped

**1 · The whole of `NABU_TEXT_REVIEW_100_PERCENT_COMPLETE.md`**
(the file is at `~/Downloads/`, not in the repo). Every numbered section is
applied. Highlights:

- `kb-questions.js` — the 540 course Q&A now exist in all three languages
  (78 cards × VI/EN/DE), and the 16 court cards carry the reviewed Vietnamese.
- `src/insight-de.js` — **new file**, German insights for all 78 cards.
  Registered in `build.py` between `insight-minors.js` and `len-art.js`.
- `kb-guides.js` — German for all 26 guides, plus the two `mani-*` rewrites.
- `strings.js` — sections 2, 3, 11–13 and the section 35 residual pass.
  All three STR blocks now hold exactly **1609 keys** each.
- Spreads, lessons, quizzes, astrology, numerology, fortune, pets, services,
  looks, gifts, config and TOPICS all have German.
- `Đức Vua` → `Vua` throughout (10 places).

**2 · The privacy policy was factually wrong and is now corrected.**
It said Nabu AI questions go to Google Gemini. They do not — see below.
Rewritten in VI/EN/DE, mirrored into `privacy.html`, with `PLAY-DATA-SAFETY.md`
carrying the matching Play Console answers.

**3 · German for the polls and wish posts** — `activities.json` and
`activities-stock.json`, 298 blocks, 53 items. **Read the warning below.**

**4 · Both composers take German** — post title/body in `admin.js`; activity
title, intro, poll options and pile messages in `play.js`.

---

## How Nabu AI actually works (verify before touching the policy again)

| Fact | Where it is in the code |
|---|---|
| `geminiKey` is empty, so Gemini is **not** used | `src/config.js:72` |
| Questions go to a Cloudflare Worker | `src/config.js:67` `aiEndpoint` |
| The worker answers with Anthropic Claude (`claude-opus-5`) | `worker/src/index.ts:291-301` |
| With no Anthropic key it falls back to Cloudflare Llama | `worker/src/index.ts:278-284` |
| What is sent: question, on-screen content, display name, star sign, last six turns | `src/ai.js:348` |
| Plus a Firebase token when signed in, so the worker can count per person | `src/ai.js:346` |
| The worker caches an answer 24h under a SHA-256 of the request; the question text is not stored | `worker/src/limit.ts:65-87` |
| `bookingEndpoint` and `reportEndpoint` are empty, so Resend is **not** in use | `src/config.js:56-60` |

If any of that changes, `privacy.json` sections 4, 7 and 8 and
`PLAY-DATA-SAFETY.md` have to change with it.

---

## ⚠ The one thing that is done but not yet visible to users

**The live polls come from Firestore, not from the JSON files.**
`loadContent()` (`src/core.js:562`) reads the cloud copy first and only falls
back to `activities.json`. Anything ever saved from the dashboard lives in the
cloud, so the German added to the files does **not** reach visitors on its own.
This was confirmed by rendering a poll page: the UI was German, the poll itself
was still English.

**What the owner has to do, once, signed in as admin:**
Dashboard → activities → **"🇩🇪 Lấy bản tiếng Đức từ tệp"** (Fill German from
the files). It reads both JSON files, fills any missing `de` on the published
activities, saves them back through `BE.setContent('activities', …)`, and
reports how many strings it could not find German for. It only ever adds a
missing `de`; nothing existing is touched.

Until that button is pressed, task 3 is complete in the repo and invisible in
the app. **Check this first if the polls still look English.**

---

## Still open

1. **Press the German import button** (above). Highest priority.
2. **Install / distribution copy — section 17 of the review, deliberately not
   applied.** The app is in Google Play closed testing with too few testers, so
   nothing is distributed yet. `#/install` still describes the APK sideload plus
   the iOS Safari route, which is accurate today. Once the Play track opens,
   `instAndroidIntro`, `instDownload`, `instAndroidNote` and `instUpdates`
   should point at Play instead, in all three languages. The stale claims the
   review worried about ("Google Play will come later", "App do Nabu ký, an
   toàn") are **not** in the current source — already gone.
3. **Play Console, two jobs that are not in the repo:** update the store
   listing description (review §31.1 gives VI/EN/DE), and redo the Data safety
   form from `PLAY-DATA-SAFETY.md`. No new `.aab` is needed for any of this —
   the Play app is a Trusted Web Activity that opens the live site, so testers
   get new copy as soon as the site is pushed.
4. **Owner review of the German prose.** Machine checks pass, but nobody has
   read it with a native eye yet.
5. **`_patch/` is scratch** — every patch script, the audit tools, and
   pre-change backups of each file touched. Untracked and safe to delete.
6. Untracked and not mine: `docs/superpowers/specs/2026-09-08-play-billing-subscriptions-design.md`.

---

## How to check this work

```
python build.py                  # src/ -> index.html + privacy.html
python test/run.py               # 604 checks, all passing as of 4bf2839
python _patch/jscheck.py         # parse-only check, builds to a temp dir
python _patch/de_audit.py        # every STR.de leaf identical to STR.en
python _patch/parity.py          # key parity across the three STR blocks
python _patch/ask_verify.py      # 78 cards / 540 Q&A in each language
python test/layout_probe.py --lang de --routes me --widths 320 --shots all
```

`de_audit.py` currently reports 27 identical EN/DE leaves. All are legitimately
identical German: `Element`, `Emoji`, `November`, `April`, `Gold`, `Level `,
`Name`, `Dashboard`, brand names, and the `Intl` option values. Adding to this
list is fine; it should never grow with real sentences.

---

## Things worth knowing before editing

- **Never build, commit or release while another session is working** on this
  repo — two windows share one built `index.html`.
- The build pins the inline script by SHA-256 in the CSP. Editing `index.html`
  by hand silently breaks the page: the script is blocked and you get a blank
  screen. Always go through `python build.py`.
- Six checks in `test/test.html` were updated because they asserted old copy or
  the old German→English fallback: the lunar animal names (now locale-aware),
  the English insight check (one press of the language pill lands on German,
  which is now really German), life path 7, the booking hint, the footer
  privacy link, and the privacy providers.
- `.foot .links` was allowed to wrap: the reviewed `Quyền riêng tư` is longer
  than the old `Riêng tư` and pushed the footer off a 320px screen.
- 28 English fragments in `STR.de` were translated although the review file
  never listed them (`petStreak`, `luckWorth`, `diaryCount`, `wedCannotCome`,
  `actArts` and similar). Everything else is the review file's exact wording.
- Where sections 2, 11 and 35 disagreed on German, **35 wins** — the review
  file says so itself.
