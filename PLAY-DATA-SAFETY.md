# Google Play — Data safety answers

What to put in the Data safety form in Play Console, so it agrees with
`privacy.json` / `privacy.html`. Everything below was read out of the source,
not assumed; the file it came from is named beside each line.

Policy URL to give Play: **https://nabutarot.com/privacy.html**

---

## The short version of what changed

The old policy said AI questions went to **Google Gemini**. They do not.
`CONFIG.geminiKey` is empty, so questions go to Nabu's own **Cloudflare**
Worker, which answers them with **Anthropic's Claude**. So the form's
third-party sharing answers change: it is no longer "Google only".

---

## Data collected

| Play category | Data type | Collected? | Shared? | Why | Optional? | Where in the code |
|---|---|---|---|---|---|---|
| Personal info | Name | Yes | Yes → Anthropic (sent with an AI question) | App functionality, Personalisation | Optional | `src/ai.js:348` `profile.name` |
| Personal info | Email address | Yes | No | Account management | Required to sign in | Firebase Auth, `src/backend.js` |
| Personal info | Other info (birthday, star sign, interests, search handle) | Yes | Star sign only → Anthropic | Personalisation, App functionality | Optional | `saveProfileLocal`, `src/ai.js:348` `profile.sign` |
| Messages | Other in-app messages | Yes | No | App functionality | Optional | `threads/{uid}/messages` in Firestore |
| Photos and videos | Photos | Yes | No | App functionality | Optional | chat images, shrunk on device (`chatImages: true`) |
| App activity | Other user-generated content (bookings: package, topic, time, name, extra question, and birth date/time for a Tử vi package; comments under posts, polls and pile readings: the nickname the person chose and their words, shown publicly because they chose to post them, since v225) | Yes | No | App functionality | Optional | `bookings` and `comments` collections |
| App activity | Other actions (Nabu AI questions and the last six turns of that conversation) | Yes | **Yes → Cloudflare, Anthropic** | App functionality | Optional | `src/ai.js:341-348` |
| App info and performance | Crash logs / diagnostics (app version, screen, browser, last error) | Yes | No | Diagnostics | Optional — only when you send a bug report | `src/report.js:32` |

Not collected: location, contacts, calendar, financial info, health, SMS,
files, and **no advertising or analytics ID**. Bank transfers happen outside
the app, so no card or payment data is handled.

## Data security section

- **Data is encrypted in transit** — yes. Everything is HTTPS; the built page
  carries a CSP that names each host it may reach (`build.py`).
- **You can request that data be deleted** — yes. In the app: Profile →
  Delete account, which removes the login, profile, messages, bookings and comments
  (`BE.deleteAccount`, `src/backend.js:90`). There is also an email route in
  the policy, answered within 7 days.
- **Committed to the Play Families Policy** — no; the app is stated as 13+.

## Third-party sharing — the part that changed

Declare sharing for the two rows marked above, and name the recipients:

- **Cloudflare** — runs the server that receives a Nabu AI question. It keeps
  a per-person count of questions to hold the daily limit, and caches an
  answer for 24 hours under a SHA-256 of the request, so the question text
  itself is not stored (`worker/src/limit.ts`).
- **Anthropic** — writes the AI answer with Claude
  (`worker/src/index.ts`, model `claude-opus-5`). With no Anthropic key set,
  the worker falls back to Cloudflare Workers AI (Llama) instead.
- **Google (Firebase)** — holds accounts, messages and bookings. This is
  processing for Nabu rather than sharing, but Play's form treats a
  third-party processor as sharing in some categories; declare it the same
  way you did before.

## Two things that are wired but currently off

Neither is live today, so neither belongs in the form yet. If you switch
either on, come back and add **Resend** as a recipient of your email address:

- `bookingEndpoint` is empty — booking invitations are not being mailed.
- `reportEndpoint` is empty — bug reports go to Firestore, not to Resend.
