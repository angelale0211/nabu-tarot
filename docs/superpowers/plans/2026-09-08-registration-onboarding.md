# Registration onboarding — implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development (recommended) or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A person who creates an account is asked once for language, display
name, username, birthday and interests, then shown the eight-step tour, then
put on the home screen — and is never asked for any of it again.

**Architecture:** A new screen at `#/welcome`, in its own file. It is reached
after the account is created, and again on any later visit while the account
has no `handle`. It writes `users/{uid}`, `people/{uid}` and `handles/{handle}`
using the helpers `love.js` already has, then turns itself into the tour that
`home.js` already draws. `src/signin.js` changes by one line and is otherwise
untouched.

**Tech Stack:** Vanilla JS concatenated by `build.py` into `index.html`.
Firebase Auth + Firestore from the browser. Checks are `ok(cond, msg)` lines in
`test/test.html`, run by `PYTHONIOENCODING=utf-8 python test/run.py`.

**Spec:** `docs/superpowers/specs/2026-09-08-registration-onboarding-design.md`

## Global Constraints

- **Scope is stage 1 only.** The love system keeps its username step in this
  plan. It becomes unreachable for anybody who registers, because `love.js`
  already skips it when a handle exists. Deleting that code and rewriting its
  checks is stage 2, a separate plan.
- **Do not edit `src/signin.js` beyond the single documented line.** Another
  window owns that file's design.
- **Vietnamese copy is the owner's, verbatim.** Never retranslate or tidy it:
  `Chào bạn! ✨` · `Chỉ vài câu thôi — bạn có thể đổi lại bất cứ lúc nào.` ·
  `Tên hiển thị` · `Tên riêng của bạn` · `Bạn bè có thể tìm bạn bằng tên này.` ·
  `Ngày sinh giúp Nabu xác định cung và chọn dự đoán phù hợp với bạn.` ·
  `Tiếp tục`
- **The username is `Tên riêng của bạn`, never `Tên hiển thị`.** That string is
  already the display-name field in two places.
- **Encode before you open.** `data = s.encode('utf-8')` then
  `io.open(p,'wb').write(data)`. Never `io.open(p,'wb').write(s.encode())`.
- **Never use a bash heredoc for a file with Vietnamese, German or emoji.** Use
  the Write or Edit tool. Heredocs eat backslashes and mangle diacritics.
- **`assert s.count(old) == 1` before every scripted replace.**
- **A release is two edits plus a rebuild:** `APP_VERSION` in `src/main.js` and
  `CACHE` in `sw.js` must match, or `health.yml` fails.
- **Never build or run the suite while another window is active.** Check
  `git status --short`, file mtimes, and that port 8765 is free first.

---

### Task 1: The copy, in three languages

Everything else renders these, so they come first.

**Files:**
- Modify: `src/strings.js` — the `vi`, `en` and `de` blocks

**Interfaces:**
- Produces: `S.welTitle`, `S.welLead`, `S.welHandle`, `S.welHandleHint`,
  `S.welBirthHint`, `S.welGo`, `S.welLang`, `S.welTaken`, `S.welShort`,
  `S.welSaving`

- [ ] **Step 1: Add the Vietnamese block**

Find the line beginning `codeChecking:` in the `vi` block and add a new line
after the block that contains it:

```js
    welTitle: 'Chào bạn! ✨', welLead: 'Chỉ vài câu thôi — bạn có thể đổi lại bất cứ lúc nào.',
    welLang: 'Ngôn ngữ', welHandle: 'Tên riêng của bạn', welHandleHint: 'Bạn bè có thể tìm bạn bằng tên này.',
    welBirthHint: 'Ngày sinh giúp Nabu xác định cung và chọn dự đoán phù hợp với bạn.',
    welGo: 'Tiếp tục', welSaving: 'Đang lưu…',
    welShort: 'Tên này ngắn quá. Bạn thêm vài ký tự nhé.',
    welTaken: 'Tên này có người dùng rồi, Nabu đã chọn giúp bạn một tên gần giống.',
```

- [ ] **Step 2: Add the English block**

```js
    welTitle: 'Hello! ✨', welLead: 'Just a few questions — you can change any of it later.',
    welLang: 'Language', welHandle: 'Your own name', welHandleHint: 'This is how friends find you.',
    welBirthHint: 'Your birthday is what gives Nabu your sign and the right forecast for you.',
    welGo: 'Continue', welSaving: 'Saving…',
    welShort: 'That is a little short. Add a few more characters.',
    welTaken: 'Somebody has that one already, so Nabu picked the nearest free name for you.',
```

- [ ] **Step 3: Add the German block**

```js
    welTitle: 'Hallo! ✨', welLead: 'Nur ein paar Fragen — du kannst alles später ändern.',
    welLang: 'Sprache', welHandle: 'Dein eigener Name', welHandleHint: 'So finden dich deine Freunde.',
    welBirthHint: 'Dein Geburtstag gibt Nabu dein Sternzeichen und die passende Vorhersage.',
    welGo: 'Weiter', welSaving: 'Wird gespeichert…',
    welShort: 'Das ist etwas kurz. Nimm noch ein paar Zeichen dazu.',
    welTaken: 'Den hat schon jemand, also hat Nabu den nächsten freien Namen für dich gewählt.',
```

- [ ] **Step 4: Verify all three exist**

```bash
grep -c "welTitle:" src/strings.js     # expect 3
```

- [ ] **Step 5: Commit**

```bash
git add src/strings.js
git commit -m "strings: the welcome screen, in three languages"
```

---

### Task 2: The welcome screen

**Files:**
- Create: `src/welcome.js`
- Modify: `build.py` — `SCRIPTS`, insert `'welcome.js'` between `'love.js'` and `'quiz.js'`

`welcome.js` must come after `love.js` (it calls `handleFrom`, `HANDLE_RE` and
`LOVEDB.claimHandle`) and after `home.js` (it calls `tourHTML` and `bindTour`).

**Interfaces:**
- Consumes: `handleFrom(name)` and `HANDLE_RE` from `love.js:25,620`;
  `LOVEDB.claimHandle(handle, name)` from `love.js`; `tourHTML(step)` and
  `bindTour(root, step)` from `home.js:55,76`; `saveProfileLocal`, `PROFILE`,
  `INTERESTS`, `LANGS`, `lang`, `store`, `BE`, `T`, `esc`, `isoDate` from
  `core.js`.
- Produces: `renderWelcome(args, params)`, `ROUTES.welcome`, and
  `needsWelcome()` returning a boolean, used by Task 3.

- [ ] **Step 1: Write the failing checks**

Add to `test/test.html`, immediately before the `// admin` comment:

```js
    { /* The welcome screen: asked once, at registration, and never again. */
      const keepW = { db: N.BE.db, user: N.BE.user, on: N.BE.enabled };
      const wdocs = {};
      N.BE.db = { collection: (c) => ({ doc: (id) => ({
        get: async () => ({ exists: wdocs[c + '/' + id] !== undefined, data: () => wdocs[c + '/' + id] }),
        set: async (v, o) => { wdocs[c + '/' + id] = (o && o.merge) ? Object.assign({}, wdocs[c + '/' + id] || {}, v) : v; },
        delete: async () => { delete wdocs[c + '/' + id]; } }) }) };
      N.BE.enabled = true; N.BE.user = { uid: 'uidW', email: 'w@test' };
      await go('#/welcome', '#welname');
      ok(d.querySelector('#welname') && d.querySelector('#welhandle') && d.querySelector('#welbday')
         && d.querySelectorAll('#main [data-int]').length === N.INTERESTS.length
         && d.querySelectorAll('#main [data-wlang]').length === 3,
        'the welcome screen asks language, name, username, birthday and interests on one page');
      d.querySelector('#welname').value = 'Mai Anh';
      d.querySelector('#welname').dispatchEvent(new w.Event('input'));
      await sleep(30);
      ok(d.querySelector('#welhandle').value === 'maianh',
        'the username follows the display name as it is typed');
      d.querySelector('#welhandle').value = 'nabufan';
      d.querySelector('#welhandle').dispatchEvent(new w.Event('input'));
      d.querySelector('#welname').value = 'Mai Anh Nguyen';
      d.querySelector('#welname').dispatchEvent(new w.Event('input'));
      await sleep(30);
      ok(d.querySelector('#welhandle').value === 'nabufan',
        'once the username is edited by hand it stops following the name');
      d.querySelector('#welgo').click();
      await waitFor(() => d.querySelector('#tour'), 6000);
      ok(wdocs['handles/nabufan'] && wdocs['handles/nabufan'].uid === 'uidW'
         && wdocs['people/uidW'] && wdocs['people/uidW'].handle === 'nabufan'
         && d.querySelector('#tour'),
        'finishing the welcome screen claims the username and shows the tour');
      N.BE.db = keepW.db; N.BE.user = keepW.user; N.BE.enabled = keepW.on; }
```

- [ ] **Step 2: Run the suite and watch these fail**

```bash
PYTHONIOENCODING=utf-8 python test/run.py 2>&1 | grep -E "^FAIL|checks,"
```

Expected: the four new lines FAIL, because `#/welcome` is not a route yet.

- [ ] **Step 3: Write `src/welcome.js`**

Use the Write tool, not a heredoc — this file contains Vietnamese and emoji.

```js
/* ======================= the welcome screen =======================
   Asked once, when the account is made, and never again.

   Before this, the same person was asked for a name on the Me tab, asked to
   register beside it, and then asked for a third name - a username - the first
   time they opened the red thread. One person, three names.

   It cannot come before the account exists: firestore.rules only lets a
   signed-in person read handles/{handle}, so no username can be checked as
   free until there is somebody to check it for. That is why this is a screen
   after registration rather than a step inside it. */

const WEL = { handleEdited: false };

/* Somebody is sent here when their account holds no username. */
function needsWelcome() {
  return !!(BE && BE.enabled && BE.user && !(PROFILE && PROFILE.handle));
}

function welcomeHTML() {
  const S = T(), p = PROFILE || {};
  const langBtn = (code, label) => '<button type="button" class="chip' + (lang === code ? ' on' : '')
    + '" data-wlang="' + code + '">' + esc(label) + '</button>';
  return '<div class="card welcard">'
    + '<h1 style="margin-bottom:4px">' + esc(S.welTitle) + '</h1>'
    + '<p class="hint" style="margin-bottom:14px">' + esc(S.welLead) + '</p>'
    + '<label class="f">' + esc(S.welLang) + '</label>'
    + '<div class="chips">' + langBtn('vi', 'Tiếng Việt') + langBtn('en', 'English') + langBtn('de', 'Deutsch') + '</div>'
    + '<label class="f" for="welname">' + esc(S.displayName) + '</label>'
    + '<input id="welname" maxlength="24" autocomplete="nickname" value="' + esc(p.name || '') + '">'
    + '<label class="f" for="welhandle">' + esc(S.welHandle) + '</label>'
    + '<div class="row nw athandle"><span class="at">@</span>'
    + '<input id="welhandle" maxlength="20" autocapitalize="none" spellcheck="false" value="' + esc(p.handle || '') + '"></div>'
    + '<p class="hint">' + esc(S.welHandleHint) + '</p>'
    + '<label class="f" for="welbday">' + esc(S.birthday) + '</label>'
    + '<input id="welbday" type="date" value="' + esc(p.birthday || '') + '" max="' + isoDate(new Date()) + '">'
    + '<p class="hint">' + esc(S.welBirthHint) + '</p>'
    + '<label class="f">' + esc(S.interests) + '</label>'
    + '<div class="chips">' + INTERESTS.map((i) => '<button type="button" class="chip'
      + ((p.interests || []).indexOf(i.id) > -1 ? ' on' : '') + '" data-int="' + esc(i.id) + '">'
      + esc(i[lang] || i.en) + '</button>').join('') + '</div>'
    + '<button type="button" class="btn primary block" id="welgo" style="margin-top:16px">' + esc(S.welGo) + '</button>'
    + '<p class="hint" id="welstatus"></p></div>';
}

function renderWelcome() {
  const m = $('#main');
  WEL.handleEdited = false;
  const draw = () => {
    m.innerHTML = welcomeHTML();
    const nameEl = $('#welname', m), hEl = $('#welhandle', m);

    /* The username follows the name until the person takes it over. After
       that it is theirs, and typing more of their name must not overwrite it. */
    nameEl.addEventListener('input', () => {
      if (WEL.handleEdited) return;
      hEl.value = handleFrom(nameEl.value);
    });
    hEl.addEventListener('input', () => { WEL.handleEdited = true; });

    $$('[data-wlang]', m).forEach((b) => b.addEventListener('click', () => {
      lang = b.getAttribute('data-wlang');
      store.set('nabu-lang', lang);
      draw();                                  // redraw so the rest is readable in it
    }));
    $$('[data-int]', m).forEach((b) => b.addEventListener('click', () => b.classList.toggle('on')));

    $('#welgo', m).addEventListener('click', async () => {
      const b = $('#welgo', m), st = $('#welstatus', m);
      const name = nameEl.value.trim();
      const wanted = handleFrom(hEl.value || name);
      if (wanted.length < 3) { st.className = 'hint err'; st.textContent = T().welShort; return; }
      b.disabled = true; st.className = 'hint'; st.textContent = T().welSaving;
      try {
        const got = await claimFreeHandle(wanted, name);
        saveProfileLocal({
          name: name, handle: got, lang: lang,
          birthday: $('#welbday', m).value,
          interests: $$('[data-int].on', m).map((x) => x.getAttribute('data-int'))
        });
        if (BE.user) { try { await BE.pushProfile(); } catch (e) { /* offline: the local copy stays */ } }
        if (got !== wanted) toast(T().welTaken);
        showTour(m);
      } catch (e) {
        b.disabled = false;
        st.className = 'hint err';
        st.textContent = (typeof loveWhy === 'function') ? loveWhy(e) : String(e.message || e);
      }
    });
  };
  draw();
}

/* Claim the name they asked for, or the nearest free one. love.js throws
   'taken' rather than choosing for them, which is right on a screen they came
   to on purpose and wrong on the way in - nobody should be stopped at
   registration by a stranger's username. */
async function claimFreeHandle(wanted, name) {
  for (let n = 0; n < 12; n++) {
    const tryThis = n === 0 ? wanted : (wanted + (n + 1)).slice(0, 20);
    try { return await LOVEDB.claimHandle(tryThis, name); }
    catch (e) { if (String(e.message) !== 'taken') throw e; }
  }
  throw new Error('taken');
}

/* The same screen becomes the tour. Not a route of its own: a second address
   would let the back button drop somebody onto a questionnaire they have
   already answered. */
function showTour(m) {
  m.innerHTML = tourHTML(0);
  bindTour(m, 0);
}

ROUTES.welcome = { nav: 'me', render: renderWelcome };
```

- [ ] **Step 3b: Carry the two new answers on the account**

`pushProfile()` in `src/backend.js` builds the document by hand and does not
know about `handle` or `lang`. Without this step the welcome screen's answers
stay on the phone that gave them, and a second phone is sent to the welcome
screen all over again. In the `const p = { ... }` line, after
`interests: PROFILE.interests || [],` add:

```js
      handle: PROFILE.handle || '', lang: PROFILE.lang || '',
```

`pullProfile()` needs no change: it calls `saveProfileLocal(d)` with the whole
document, so both fields come back down on their own.

- [ ] **Step 3c: Let the checks see the interest list**

`INTERESTS` is a top-level `const` in `src/config.js`, which makes it invisible
to `test/test.html` — a `const` is not a `window` property, and it is not on
`window.NABU`. In `src/main.js`, inside the `window.NABU = {` object, directly
after `ACCESS: ACCESS,` add:

```js
INTERESTS: INTERESTS,
```

- [ ] **Step 4: Add it to the build**

In `build.py`, in `SCRIPTS`, replace `'love.js', 'quiz.js'` with
`'love.js', 'welcome.js', 'quiz.js'`.

- [ ] **Step 5: Rebuild and run the suite**

```bash
python build.py
PYTHONIOENCODING=utf-8 python test/run.py 2>&1 | grep -E "^FAIL|checks,"
```

Expected: the four new checks PASS, and no previously passing check fails.

- [ ] **Step 6: Commit**

```bash
git add src/welcome.js build.py test/test.html index.html
git commit -m "welcome: one screen that asks everything once"
```

---

### Task 3: Getting there, and being sent back

**Files:**
- Modify: `src/signin.js` — the `onward()` function only
- Modify: `src/core.js` — `route()` at line 747

**Interfaces:**
- Consumes: `needsWelcome()` from Task 2.

- [ ] **Step 1: Write the failing check**

Add to `test/test.html`, directly after the Task 2 block:

```js
    { /* An account with no username is sent to the welcome screen, wherever
         it tries to go. An account that has one is left alone. */
      const keepG = { user: N.BE.user, on: N.BE.enabled };
      N.BE.enabled = true; N.BE.user = { uid: 'uidG2', email: 'g2@test' };
      const hadHandle = N.PROFILE().handle;
      w.saveProfileLocal({ handle: '' });
      await go('#/home', '#main'); await sleep(120);
      ok(/#\/welcome/.test(w.location.hash), 'an account with no username is sent to the welcome screen');
      w.saveProfileLocal({ handle: 'someone' });
      await go('#/home', '#main'); await sleep(120);
      ok(/#\/home/.test(w.location.hash), 'and an account that has one is left where it was');
      w.saveProfileLocal({ handle: hadHandle || '' });
      N.BE.user = keepG.user; N.BE.enabled = keepG.on; }
```

- [ ] **Step 2: Run the suite and watch it fail**

```bash
PYTHONIOENCODING=utf-8 python test/run.py 2>&1 | grep -E "^FAIL|checks,"
```

Expected: both new lines FAIL.

- [ ] **Step 3: Add the gate to `route()`**

In `src/core.js`, immediately after `if (!def) { redirect('#/home'); return; }`:

```js
  /* Somebody who has an account but never answered the welcome screen is sent
     to it, from wherever they were going. It is the one screen that may
     interrupt, because everything after it assumes those answers exist.
     Signing out, the privacy page and the welcome screen itself are exempt:
     the first two are how somebody leaves, and the third is the destination. */
  if (r.route !== 'welcome' && r.route !== 'privacy' && typeof needsWelcome === 'function' && needsWelcome()) {
    redirect('#/welcome'); return;
  }
```

- [ ] **Step 4: Point registration at it**

In `src/signin.js`, in `onward()`, send a newly created account to the welcome
screen. Change only the create branch; leave signing in alone.

```js
  const onward = () => { location.hash = (mode === 'create') ? '#/welcome' : signinNext(params); };
```

- [ ] **Step 5: Rebuild and run the suite**

```bash
python build.py
PYTHONIOENCODING=utf-8 python test/run.py 2>&1 | grep -E "^FAIL|checks,"
```

Expected: both new checks PASS.

- [ ] **Step 6: Commit**

```bash
git add src/core.js src/signin.js test/test.html index.html
git commit -m "welcome: reached after registering, and again until it is answered"
```

---

### Task 4: The Me tab stops asking twice

**Files:**
- Modify: `src/me.js` — `profileFormHTML()` at line 7

- [ ] **Step 1: Write the failing check**

Add to `test/test.html` next to the existing me-tab block:

```js
    { /* Signed in, the Me tab shows what they answered rather than asking
         again. Signed out, it asks for the two things that make the home
         screen personal, and nothing else. */
      const keepM = { user: N.BE.user, on: N.BE.enabled };
      N.BE.enabled = true; N.BE.user = { uid: 'uidM', email: 'm@test' };
      w.saveProfileLocal({ handle: 'someone', name: 'Mai' });
      await go('#/me', '#main'); await sleep(60);
      ok(!d.querySelector('#pname') && /@someone/.test(d.querySelector('#main').textContent)
         && d.querySelector('#main a[href="#/welcome"]'),
        'signed in, the Me tab shows the profile with an edit link, not the form again');
      N.BE.user = null; N.BE.enabled = keepM.on;
      await go('#/me', '#pname'); await sleep(60);
      ok(d.querySelector('#pname') && d.querySelector('#pbday') && !d.querySelector('#welhandle'),
        'signed out, it asks only for a name and a birthday');
      N.BE.user = keepM.user; N.BE.enabled = keepM.on; }
```

- [ ] **Step 2: Run the suite and watch it fail**

Expected: both new lines FAIL.

- [ ] **Step 3: Split the profile card**

Replace `profileFormHTML()` in `src/me.js` with:

```js
/* Two shapes, because two different people are looking.

   Signed in, everything here was answered on the welcome screen, so this is a
   summary and a way back to it - asking again is what made this tab confusing.

   Signed out, the app still greets people by name and reads their sign, so
   the two answers that do that are still offered. They are carried into the
   welcome screen when the person registers, so nothing is asked twice. */
function profileFormHTML() {
  const S = T(), p = PROFILE || {};
  if (BE.user) {
    const line = (k, v) => '<p class="hint" style="margin:0 0 4px"><b>' + esc(k) + '</b> · ' + esc(v) + '</p>';
    return '<div class="card"><h3 style="margin-bottom:8px">' + esc(S.meTitle) + '</h3>'
      + line(S.displayName, p.name || '—')
      + line(S.welHandle, p.handle ? '@' + p.handle : '—')
      + line(S.birthday, p.birthday || '—')
      + '<a class="btn block" href="#/welcome" style="margin-top:12px">' + esc(S.editProfile) + '</a></div>';
  }
  return '<div class="card"><h3 style="margin-bottom:4px">' + esc(S.meTitle) + '</h3><p class="hint" style="margin-bottom:6px">' + esc(S.meIntro) + '</p>'
    + '<label class="f" for="pname">' + esc(S.displayName) + '</label><input id="pname" value="' + esc(p.name || '') + '" autocomplete="nickname">'
    + '<label class="f" for="pbday">' + esc(S.birthday) + '</label><input id="pbday" type="date" value="' + esc(p.birthday || '') + '" max="' + isoDate(new Date()) + '">'
    + '<button class="btn primary block" id="psave" style="margin-top:16px">' + esc(S.saveProfile) + '</button>'
    + '<p class="hint" id="pstatus">' + esc(S.localOnly) + '</p></div>';
}
```

- [ ] **Step 4: Guard the binding**

`bindProfileForm` now runs against a card that has no `#psave` when signed in.
In `src/me.js`, make its first line tolerant:

```js
function bindProfileForm(root, after) {
  const save = $('#psave', root);
  if (!save) return;                 // signed in: a summary, nothing to bind
  $$('[data-int]', root).forEach((b) => b.addEventListener('click', () => b.classList.toggle('on')));
  save.addEventListener('click', async () => {
```

The rest of the function is unchanged except for the `saveProfileLocal(...)`
line. The guest card no longer has interest chips, and `$$` returns an empty
list when there are none — which `saveProfileLocal` would merge in and so erase
interests the person chose on the welcome screen. Replace that one line with:

```js
    const chips = $$('[data-int]', root);
    const next = { name: $('#pname').value.trim(), birthday: $('#pbday').value };
    if (chips.length) next.interests = $$('[data-int].on', root).map((b) => b.getAttribute('data-int'));
    saveProfileLocal(next);
```

- [ ] **Step 5: Add the `editProfile` string**

Three languages, beside `saveProfile` in `src/strings.js`:

```js
    editProfile: 'Sửa hồ sơ',      // vi
    editProfile: 'Edit profile',   // en
    editProfile: 'Profil bearbeiten', // de
```

- [ ] **Step 6: Rebuild and run the suite**

Expected: both new checks PASS, and the existing check
`me tab: device-only profile, Instagram, my courses with status` still passes —
it runs signed out, where the form is unchanged apart from the interest chips.
If it fails on `courses`, that is unrelated to this task; check the access
fixture, not this code.

- [ ] **Step 7: Commit**

```bash
git add src/me.js src/strings.js test/test.html index.html
git commit -m "me: show what was answered instead of asking again"
```

---

### Task 5: Language follows the account

**Files:**
- Modify: `src/backend.js` — `pullProfile()`
- Modify: `src/core.js` — the `#lang` click handler at line 942

- [ ] **Step 1: Write the failing check**

```js
    { /* The language chosen at registration follows the person to a new
         phone, rather than being remembered only on the one they signed up on. */
      const keepL = { user: N.BE.user, on: N.BE.enabled, lang: w.localStorage.getItem('nabu-lang') };
      w.localStorage.setItem('nabu-lang', '"vi"');
      w.saveProfileLocal({ lang: 'en' });
      w.applyAccountLang();
      ok(w.localStorage.getItem('nabu-lang') === '"en"',
        'the account language is applied to the device on sign-in');
      if (keepL.lang == null) w.localStorage.removeItem('nabu-lang'); else w.localStorage.setItem('nabu-lang', keepL.lang);
      N.BE.user = keepL.user; N.BE.enabled = keepL.on; }
```

- [ ] **Step 2: Run the suite and watch it fail**

Expected: FAIL, `applyAccountLang is not a function`.

- [ ] **Step 3: Add the helper in `src/core.js`**

Directly after `let lang = store.get('nabu-lang', 'vi');`:

```js
/* The language belongs to the person, not to the handset. It is chosen once on
   the welcome screen and carried on the account, so a second phone or a
   reinstall opens in the right language instead of falling back to Vietnamese.
   The header button still works for everybody; while signed in it writes back. */
function applyAccountLang() {
  const want = PROFILE && PROFILE.lang;
  if (!want || LANGS.indexOf(want) < 0 || want === lang) return false;
  lang = want; store.set('nabu-lang', lang);
  return true;
}
```

- [ ] **Step 4: Call it after the profile is read**

In `src/backend.js`, in `pullProfile()`, on the line after
`delete d.access; delete d.revoked; saveProfileLocal(d);`:

```js
    if (typeof applyAccountLang === 'function' && applyAccountLang() && typeof route === 'function') route();
```

- [ ] **Step 5: Write it back from the button**

In `src/core.js`, replace the `#lang` handler body:

```js
  $('#lang').addEventListener('click', () => {
    lang = LANGS[(LANGS.indexOf(lang) + 1) % LANGS.length];
    store.set('nabu-lang', lang);
    /* Signed in, the choice belongs to the account too, or the next device
       would contradict this one. */
    if (typeof BE !== 'undefined' && BE.user) { saveProfileLocal({ lang: lang }); BE.pushProfile(); }
    route();
  });
```

- [ ] **Step 6: Rebuild, run the suite, commit**

```bash
python build.py
PYTHONIOENCODING=utf-8 python test/run.py 2>&1 | grep -E "^FAIL|checks,"
git add src/core.js src/backend.js test/test.html index.html
git commit -m "language: chosen once, carried on the account"
```

---

### Task 6: Layout, on every screen size

The owner tests on Android, iPhone and a PC, and cares about this more than
about any other part of the work.

**Files:**
- Modify: `test/test.html` — the responsive block that names the busiest screens
- Modify: `src/shell.html` — `.welcard` styles

- [ ] **Step 1: Add the screen to the responsive check**

Find the check whose message ends
`nothing leaves the screen at 320, 360 or 390 across the five busiest screens`
and add `'#/welcome'` to the list of routes it walks. Update the message to say
`six busiest screens`.

- [ ] **Step 2: Run it and see what breaks**

```bash
python build.py
PYTHONIOENCODING=utf-8 python test/run.py 2>&1 | grep -E "^FAIL|checks,"
```

- [ ] **Step 3: Give it the single-column shape on a desk**

On a wide window the app lays most screens out as a grid; screens that are one
thing get a centred single column via the `ONE_COL` list in `src/core.js`,
which `route()` reads to set `data-shape` on the body. The welcome screen is
one thing. Add `'welcome'` to the `ONE_COL` array.

- [ ] **Step 3b: Add the styles**

In `src/shell.html`, beside the other card rules:

```css
.welcard { max-width: 520px; margin: 0 auto; }
.welcard .chips { display: flex; flex-wrap: wrap; gap: 8px; }
.welcard input[type=date] { width: 100%; box-sizing: border-box; min-height: 44px; }
.welcard .athandle input { width: 100%; }
.welcard .btn.block { width: 100%; }
```

The date box is the control most likely to break the layout, because Safari
and Chrome size it differently; `width:100%` with `box-sizing:border-box` is
what stops it pushing the card wider than the screen.

- [ ] **Step 4: Re-run until green, then commit**

```bash
git add src/shell.html test/test.html index.html
git commit -m "welcome: holds its shape from 320px to a desk"
```

---

### Task 7: Release

- [ ] **Step 1: Check no other window is working**

```bash
git status --short          # expect empty apart from your own work
netstat -ano | grep -c ':8765.*LISTENING'   # expect 0
```

- [ ] **Step 2: Bump both version numbers**

`src/main.js` → `window.APP_VERSION = 'v185';`
`sw.js` → `const CACHE = 'nabu-tarot-v185';`

They must match or `health.yml` fails.

- [ ] **Step 3: Build, run the full suite, and read the count**

```bash
python build.py
PYTHONIOENCODING=utf-8 python test/run.py 2>&1 | tail -3
```

Expected: 0 failed.

- [ ] **Step 4: Confirm the build carries the work**

A commit's build can predate its own source. Check before pushing:

```bash
grep -c "renderWelcome" index.html      # expect 2 or more
grep -c "applyAccountLang" index.html   # expect 2 or more
```

- [ ] **Step 5: Commit and push**

```bash
git add -A
git commit -m "v185 - one registration that asks everything once"
git push origin main
```

- [ ] **Step 6: Verify it is live**

```bash
curl -s https://nabutarot.com/ | grep -c renderWelcome    # expect 2 or more
```

---

## Needs the owner's words, not in this plan

The eighth tour step (`TOUR[7]` in `src/home.js`) tells people to enter their
name and birthday so Nabu can personalise things. After this plan ships they
will have done exactly that two screens earlier, so the step reads as stale.
It should be reworded to say where the profile lives (`Hồ sơ` → `Sửa hồ sơ`).
The tour is the owner's Vietnamese verbatim, so the new line comes from the
owner; do not draft it. Ask, then apply to all three languages.

## Stage 2, not in this plan

Deleting the love system's own username step (`drawHandle` in `src/love.js`,
and `loveStepOne`, `loveClaim`, `loveNameLabel` and friends in `strings.js`),
and rewriting the love checks in `test/test.html` that drive `#lvname` and
`#lvsave`. It is unreachable for anybody who registers after this plan ships,
because `love.js` already skips it when a handle exists. Worth doing, worth
doing separately.
