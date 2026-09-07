# Moving the hosting to Cloudflare Pages

The app is served by GitHub Pages today, from the `nabu-tarot` repository, at
**nabutarot.com** (the `CNAME` file in this repo is what claims that domain).
The domain's DNS already lives at Cloudflare.

Moving hosting to Cloudflare Pages changes **who serves the files**. It does not
change the address, so installed apps, the service worker's saved pages, signed-in
accounts and Firebase all carry on exactly as they are. The reason to do it is
that Cloudflare Pages will deploy from a **private** repository for free, and
GitHub Pages will not.

**The app stays up while you do this.** GitHub Pages keeps serving until the DNS
records are changed, and after they change Cloudflare serves the same files at
the same address. Testing can carry on throughout. The only gap is the few
minutes DNS takes to settle, and even then most people keep reaching the old
host until their own copy of the record expires.

## What this repository already has ready

- `_headers` — the caching rules Cloudflare needs (see the warning below).
- `.well-known/assetlinks.json` — at the path Android actually reads.
- `index.html` is committed already built, so there is **no build step to run**.

---

## 1. Make the repository private (do this first)

GitHub → the repo → **Settings** → scroll to **Danger Zone** → **Change
repository visibility** → Private.

Nothing breaks: the scheduled jobs in `.github/workflows` (Facebook sync, posts
sync, horoscopes, tests) keep running and keep committing, because they run as
the repository itself.

GitHub Pages **will stop serving** once the repo is private, on the free plan.
So either do step 2 first and only flip to private at the end, or accept a short
outage between the two. Doing Cloudflare first is calmer.

## 2. Create the Pages project

Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect
to Git** → authorise GitHub → pick `angelale0211/nabu-tarot`.

Then, on the build settings screen:

| Field | Value |
|---|---|
| Production branch | `main` |
| Framework preset | **None** |
| Build command | **leave completely empty** |
| Build output directory | `/` |

The build command must be empty. `index.html` is already built and committed;
if Cloudflare tries to build anything it will either fail or, worse, publish a
directory that does not contain the app.

Press **Save and Deploy**. You get a `something.pages.dev` address. **Open it and
check the app works there before touching DNS.** That address serves the real
app, so this is a genuine test, not a formality.

## 3. Point the domain at it

Still in the Pages project → **Custom domains** → **Set up a domain** →
`nabutarot.com`. Add `www.nabutarot.com` too if you want it to work.

Cloudflare rewrites the DNS records itself. The four GitHub Pages `A` records
(185.199.108–111.153) are replaced by a `CNAME` to your Pages project. You do
not have to edit them by hand, and you should not.

Leave the proxy **orange** (proxied) for the site records. That is the normal
setting for Pages and gives you the caching and the protection. The grey-cloud
rule you learned for GitHub Pages and for the DKIM records does not apply here.

## 4. Check these four things

1. **https://nabutarot.com** loads the app, and the version at the bottom is the
   one you last shipped.
2. **https://nabutarot.com/.well-known/assetlinks.json** returns the JSON.
   Cloudflare Pages skips files beginning with a dot in some configurations, and
   this one file is what Google Play uses to prove the installed app and the
   website are the same thing. If it 404s, the TWA will fail verification later
   with an error that explains nothing. Check it now, not then.
3. **https://nabutarot.com/privacy.html** loads — the store listings link to it.
4. Open the app, change something small, push, and confirm the change appears
   after a reload. That proves the whole pipe.

## 5. Two things to change afterwards

- **The Firebase authorised domains.** Firebase Console → Authentication →
  Settings → Authorised domains. `nabutarot.com` is already there, but add the
  `*.pages.dev` address if you want sign-in to work on the preview URL too.
- **The AI worker.** `worker/wrangler.toml` now says
  `ALLOWED_ORIGIN = "https://nabutarot.com"`. That value only reaches the live
  worker when it is deployed: `cd worker && npx wrangler deploy`. It was still
  pointing at the old `github.io` address, which is not where anybody has loaded
  the app since the domain was set up.

## What this does not do

It does not stop anyone copying the app. Nabu is a static web app: to run it, a
browser downloads all of it, and anyone can read what their browser downloaded,
on any host. What goes private is the workshop — the build script, the source
split into readable files, the history, and anything half-finished.

What protects the work itself is `LICENSE` and the notice carried in the page,
which make ownership unambiguous if you ever have to ask someone to take a copy
down.
