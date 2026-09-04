# Nabu Tarot app

A mobile web app for Nabu Tarot. Three screens:

- **Dự đoán** – the feed of readings Nabu posts.
- **Rút bài** – the visitor taps one of seven face-down cards and gets a quick reading of their current energy, generated from the built-in knowledge base (all 78 cards, Vietnamese and English, with Thu Anh's keywords and question readings).
- **Đặt lịch** – the five preset topics with their five questions, a short form, and one-tap sending to Instagram / Messenger / Zalo with the message already copied.

Works offline once opened, installs to the home screen on iPhone and Android, no login, no server.

## Posting a reading (from your phone)

1. Open the app and go to `#/admin` – for example `https://angelale0211.github.io/nabu-tarot/#/admin`.
2. The first time, paste a GitHub token and press *Lưu token*. To create one: GitHub → Settings → Developer settings → Personal access tokens → **Fine-grained tokens** → Generate. Repository access: *Only select repositories* → `nabu-tarot`. Permissions: *Contents: Read and write*. Copy the token. It stays in that phone's browser only.
3. Write the post (Vietnamese; English optional), tap the cards you drew, add markers (initials, signs) if it is a pick-a-card post, and press **Đăng bài**.
4. GitHub Pages republishes within a minute or two. Readers see the post the next time they open the app.

Posts live in `posts.json`; the composer edits that file through the GitHub API. You can also edit the file by hand on GitHub.

## Changing handles, links and wording

Edit `src/config.js` (Instagram handle, Facebook page username for Messenger, Zalo, email, booking text), then rebuild and push:

```
python build.py
git add -A && git commit -m "..." && git push
```

Buttons whose value is empty are hidden.

## Layout

```
src/shell.html     page markup + CSS
src/config.js      brand settings
src/strings.js     UI strings (vi/en) + the five preset topics (verbatim brand copy)
src/art.js         card artwork (SVG), shared with The Learner's Deck
src/tarot-en.js    English card text
src/tarot-vi.js    Vietnamese card names + text
src/kb-thuanh.js   Thu Anh's keywords (KW) and question readings (ASK), Vietnamese
src/app.js         the app
src/fonts.css      Be Vietnam Pro + Playfair Display, embedded
build.py           assembles index.html
sw.js              offline cache (bump CACHE on each release)
posts.json         the feed
test/              headless Edge checks (python test/run.py)
```

Card meanings and question readings are transcribed from **Tự Học Tarot cùng Thu Anh** (YouTube) and are attributed to her in the app.
