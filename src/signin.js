/* ======================= the sign-in page =======================

   One page at #/signin, where signing in used to be a card folded into the Me
   tab. Every gate in the app - the second card of the day, the diary, the
   coin, a companion, a booking, an order - sends people here, and the link
   they arrive by says where to send them back:

       #/signin?next=/play/coin

   The page is the same door whichever way you reach it: the providers first,
   then email and password, then the way to an account or a lost password.
   Nothing here talks to Firebase on its own; BE in backend.js is the only
   auth path, and this page only calls it. */

/* The link a gate offers. With no argument it points back to the screen the
   visitor is standing on, which is what a gate nearly always wants. */
function signinHref(next) {
  const to = next || (location.hash || '#/home').replace(/^#/, '');
  return '#/signin?next=' + encodeURIComponent(to);
}
/* Where to go once signed in. Only a screen of the app is honoured: anything
   that is not a path starting with one slash falls back to the profile. */
function signinNext(params) {
  const n = String((params && params.next) || '');
  if (!/^\/[A-Za-z0-9_\-\/?=&%.:+]*$/.test(n) || n.indexOf('//') === 0 || n.indexOf('/signin') === 0) return '#/me';
  return '#' + n;
}

const GOOGLE_MARK = '<svg viewBox="0 0 24 24"><path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.4z"/><path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z"/><path fill="#FBBC05" d="M6.4 14a6 6 0 0 1 0-3.9V7.5H3.1a10 10 0 0 0 0 9z"/><path fill="#EA4335" d="M12 6c1.5 0 2.8.5 3.8 1.5l2.8-2.8A10 10 0 0 0 3.1 7.5l3.3 2.6C7.2 7.8 9.4 6 12 6z"/></svg>';

/* Each block rises into place a beat after the one above it (.srise, with
   --i counting the beats). The stagger is decoration: with reduced motion on
   the page simply appears, complete. */
function signinHTML(mode) {
  const S = T(), prov = CONFIG.authProviders || [], create = mode === 'create';
  let i = 0;
  /* The beat is added to whatever the block already is, never in front of it.
     Writing a second class attribute instead loses the first: the parser keeps
     one, so `<p class="srise" class="lead">` is a paragraph that is no longer
     a lead, and the block silently loses its own styling. */
  const rise = (html) => {
    const beat = ' style="--i:' + (i++) + '"';
    return /^<\w+[^>]*\sclass="/.test(html)
      ? html.replace(/^(<\w+[^>]*?)\sclass="/, '$1' + beat + ' class="srise ')
      : html.replace(/^(<\w+)/, '$1 class="srise"' + beat);
  };
  const social = (prov.indexOf('google') > -1 ? '<button type="button" class="btn block" data-auth="google">' + GOOGLE_MARK + esc(S.signInWith.google) + '</button>' : '')
    + (prov.indexOf('facebook') > -1 ? '<button type="button" class="btn block" data-auth="facebook" style="background:#1461C7;color:#fff;border-color:transparent">' + esc(S.signInWith.facebook) + '</button>' : '');
  const email = prov.indexOf('email') > -1;
  return '<section class="signin">'
    + rise('<div class="hlogo">' + LOGO + '</div>')
    + rise('<h1>' + esc(create ? S.createAccount : S.signIn) + '</h1>')
    /* The lead is two lines in the owner's own words - the promise, then the
       reassurance - and each is its own block so the first can lead and the
       second can sit softer beneath it, whatever the width. */
    + rise('<p class="lead">' + esc(S.signinLead).split('\n').map((l, i) => '<span class="ln ln' + (i + 1) + '">' + l + '</span>').join('') + '</p>')
    + (social ? rise('<div class="providers">' + social + '</div>') : '')
    + (social && email ? rise('<div class="orline"><span>' + esc(S.signinOr) + '</span></div>') : '')
    + (email ? '<form id="aform">'
        + rise('<div><label class="f" for="aemail">' + esc(S.emailLabel) + '</label><input id="aemail" type="email" autocomplete="email" inputmode="email" autocapitalize="off" spellcheck="false" required></div>')
        + rise('<div><label class="f" for="apw">' + esc(S.passwordLabel) + '</label><input id="apw" type="password" autocomplete="' + (create ? 'new-password' : 'current-password') + '" minlength="6" required></div>')
        + rise('<button type="submit" class="btn primary block" id="alogin">' + esc(create ? S.createAccount : S.signIn) + '</button>')
        + '</form>'
        + rise('<p class="links"><button type="button" class="linkbtn" id="amode">' + esc(create ? S.haveAccount : S.noAccount) + '</button>'
          + (create ? '' : ' · <button type="button" class="linkbtn" id="aforgot">' + esc(S.forgot) + '</button>') + '</p>')
      : '')
    + '<p class="hint" id="astatus">' + (BE.enabled ? '' : esc(S.accountsSoon)) + '</p>'
    + rise('<p class="hint later"><a href="#/home">' + esc(S.signinLater) + '</a></p>')
    + '</section>';
}

function renderSignin(args, params) {
  const S = T(), m = $('#main');
  /* Already in - a redirect sign-in coming back, or a stale link. Straight on. */
  if (BE.user) { redirect(signinNext(params)); return; }
  let mode = 'in';
  const draw = (keepEmail) => {
    m.innerHTML = signinHTML(mode);
    const status = (msg, cls) => { const s = $('#astatus', m); if (s) { s.textContent = msg; s.className = 'hint ' + (cls || ''); } };
    /* A brand new account goes to the welcome screen; somebody signing back in
       carries on where they were headed. */
    const onward = () => { if (BE.user) redirect(mode === 'create' ? '#/welcome' : signinNext(params)); };
    $$('[data-auth]', m).forEach((b) => b.addEventListener('click', async () => {
      const p = b.getAttribute('data-auth');
      if (!BE.enabled) { status(S.accountsSoon, 'err'); toast(S.accountsOff); return; }
      b.disabled = true;
      try { await BE.signIn(p); onward(); } catch (e) { status(authMessage(e, p), 'err'); }
      b.disabled = false;
    }));
    const form = $('#aform', m);
    if (form) {
      const em = () => $('#aemail', m).value.trim(), pw = () => $('#apw', m).value;
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!BE.enabled) { status(S.accountsSoon, 'err'); toast(S.accountsOff); return; }
        const btn = $('#alogin', m); btn.disabled = true;
        try { await BE.signInEmail(em(), pw(), mode === 'create'); onward(); }
        catch (e2) { status(authMessage(e2, 'email'), 'err'); }
        btn.disabled = false;
      });
      $('#amode', m).addEventListener('click', () => { mode = mode === 'create' ? 'in' : 'create'; draw(em()); });
      const forgot = $('#aforgot', m);
      if (forgot) forgot.addEventListener('click', async () => {
        if (!BE.enabled) { status(S.accountsSoon, 'err'); return; }
        try { await BE.resetPassword(em()); status(S.resetSent, 'ok'); } catch (e) { status(authMessage(e, 'email'), 'err'); }
      });
      if (keepEmail) { $('#aemail', m).value = keepEmail; $('#apw', m).focus(); }
    }
  };
  draw('');
}
ROUTES.signin = { nav: 'me', render: renderSignin };

/* A sign-in that finishes while this page is open - the popup closing, or the
   redirect flow landing back here - moves on to wherever the link said. */
BE.onAuth((u) => {
  if (u && parseHash().route === 'signin') redirect(signinNext(parseHash().params));
});
