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

/* Somebody is sent here when their account holds no username.
   BE.profileRead is what keeps this honest: it is only ever set by a real
   pullProfile, so "no username" means the account was read and had none,
   not merely that the account's profile has not been fetched yet. */
function needsWelcome() {
  return !!(BE && BE.enabled && BE.user && BE.profileRead === true && !(PROFILE && PROFILE.handle));
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
