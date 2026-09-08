# How Nabu Tarot is put together

One page, so that a new session (or a new person) can see the shape of the
thing before reading any of it.

## The pieces

```mermaid
flowchart TB
  subgraph phone["The reader's phone"]
    app["index.html<br/>one file, built from src/<br/>service worker, works offline"]
    ls[("localStorage<br/>profile, ACCESS, alerts")]
    app --- ls
  end

  subgraph pages["GitHub Pages (moving to Cloudflare Pages)"]
    html["index.html, sw.js, icons"]
    json["posts.json, schedule.json,<br/>horoscope.json, sale.json"]
  end

  subgraph fb["Firebase"]
    auth["Auth<br/>Google, Facebook, email"]
    fs[("Firestore<br/>users, bookings, threads,<br/>bonds, weddings, errors, codes")]
    st["Storage<br/>chat photos, voice notes"]
  end

  subgraph cf["Cloudflare Worker (worker/)"]
    w["nabu-ai<br/>verifies the Firebase token,<br/>counts what each person asks for,<br/>caches repeated answers"]
  end

  subgraph out["Paid for, and never reached from the phone"]
    claude["Claude / Gemini / Workers AI"]
    resend["Resend<br/>booking invitations, bug reports"]
  end

  subgraph gha["GitHub Actions"]
    ci["tests on every push<br/>worker typecheck + deploy<br/>health every 6h"]
    sync["fb-sync, posts-sync, horoscope<br/>write the .json files back"]
  end

  app -->|"first load, then cached"| html
  app -->|"revalidated each start"| json
  app <-->|"signs in"| auth
  app <-->|"reads and writes as the signed-in person,<br/>bounded by firestore.rules"| fs
  app <--> st
  app -->|"POST + Bearer id token"| w
  w --> claude
  w --> resend
  sync --> json
  ci --> w
```

## Where trust sits, and where it does not

This matters more than the boxes.

- **The bundle is public.** Every lesson, every card meaning and every price is
  inside `index.html`, which anybody can read. Nothing in the app is secret
  because nothing in the app *can* be.
- **`ACCESS` is a cache of the account.** `users/{uid}.access` is the truth,
  written only by Nabu's dashboard and by the worker (a Play purchase, a
  redeemed code); the phone reads it back and never writes it. `ACCESS.has()`
  still reads localStorage, so it decides what the app shows, not what a
  person is able to obtain: binding an unlock to an account stops it being
  *shared*; it does not stop it being *tampered with* on the person's own
  device. Say so plainly when it comes up rather than implying the paywall is
  a lock.
- **Codes are checked by the worker.** The book (`content/codes`) is readable
  by Nabu and the service account only; the phone sends the code to `/redeem`
  with its sign-in, and the worker binds the code to that account.
- **`firestore.rules` is the only real boundary.** Everything the phone does to
  the database, it does as the signed-in person. Whatever the rules permit is
  what the app can do, whoever is driving it. That is why an unpublished rules
  change is a broken feature, and why `isAdmin()` insists on a verified email.
- **The worker holds the keys.** The Anthropic, Gemini and Resend keys live
  there and never reach a browser. Since it also costs money per call, it now
  checks a Firebase ID token before answering and counts what each person asks
  for.
- **The GitHub token is Nabu's own.** It lives in Nabu's browser only, and is
  only used when Firebase is off.

## The build

`src/*.js` and `src/shell.html` are concatenated by `build.py` into a single
committed `index.html`. Order matters — see `SCRIPTS` at the top of `build.py`:
data files before `core.js`, screens before `main.js`.

Two things must move together for a release, and CI checks the second:

- `src/main.js` — `window.APP_VERSION`
- `sw.js` — `const CACHE`

Without the `sw.js` bump the update never reaches an installed phone.

## The globals

`store` (localStorage), `ACCESS` (what is unlocked), `ALERTS` (the bell),
`BE` (Firebase), `LOVE` / `LOVEDB` (the red thread), `WED` (weddings),
`PROFILE`, `CONFIG`, `COURSES`, `T()` (strings for the current language),
`L(obj)` (picks `.vi` / `.en`), `lang`.

## The checks

`test/run.py` serves the repo, opens `test/test.html`, and that page drives the
built `index.html` in an iframe with a stand-in for Firestore. The page posts
its results back to the runner as it goes, so a run that stops half way still
says which check it stopped after.
