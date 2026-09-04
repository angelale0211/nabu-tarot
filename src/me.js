/* ============================ me ============================
   Profile (name, birthday, interests), sign-in when accounts are on,
   messages with Nabu, my bookings, install hint, replay the tour. */
let meUnsubs = [];
function meCleanup() { meUnsubs.forEach((u) => { try { u(); } catch (e) { /* already gone */ } }); meUnsubs = []; }

function profileFormHTML() {
  const S = T();
  return '<div class="card"><h3 style="margin-bottom:4px">' + esc(S.meTitle) + '</h3><p class="hint" style="margin-bottom:6px">' + esc(S.meIntro) + '</p>'
    + '<label class="f" for="pname">' + esc(S.displayName) + '</label><input id="pname" value="' + esc(PROFILE.name || '') + '" autocomplete="nickname">'
    + '<label class="f" for="pbday">' + esc(S.birthday) + '</label><input id="pbday" type="date" value="' + esc(PROFILE.birthday || '') + '" max="' + isoDate(new Date()) + '">'
    + '<label class="f">' + esc(S.interests) + '</label><div class="chips">' + INTERESTS.map((i) => '<button class="chip' + ((PROFILE.interests || []).indexOf(i.id) > -1 ? ' on' : '') + '" data-int="' + i.id + '">' + esc(i[lang]) + '</button>').join('') + '</div>'
    + '<button class="btn primary block" id="psave" style="margin-top:16px">' + esc(S.saveProfile) + '</button>'
    + '<p class="hint" id="pstatus">' + esc(BE.user ? '' : S.localOnly) + '</p></div>';
}
function bindProfileForm(root, after) {
  $$('[data-int]', root).forEach((b) => b.addEventListener('click', () => b.classList.toggle('on')));
  $('#psave', root).addEventListener('click', async () => {
    saveProfileLocal({ name: $('#pname').value.trim(), birthday: $('#pbday').value, interests: $$('[data-int].on', root).map((b) => b.getAttribute('data-int')) });
    if (BE.user) { try { await BE.pushProfile(); } catch (e) { /* offline: local copy stays */ } }
    toast(T().saved); if (after) after();
  });
}
function authHTML() {
  const S = T();
  if (!BE.enabled) return '<div class="card"><h3 style="margin-bottom:6px">' + esc(S.signIn) + '</h3><p class="muted" style="font-size:14px">' + esc(S.accountsSoon) + '</p></div>';
  if (BE.user) return '';
  const prov = CONFIG.authProviders;
  return '<div class="card"><h3 style="margin-bottom:10px">' + esc(S.signIn) + '</h3><div class="providers">'
    + (prov.indexOf('google') > -1 ? '<button class="btn block" data-auth="google"><svg viewBox="0 0 24 24"><path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.4z"/><path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z"/><path fill="#FBBC05" d="M6.4 14a6 6 0 0 1 0-3.9V7.5H3.1a10 10 0 0 0 0 9z"/><path fill="#EA4335" d="M12 6c1.5 0 2.8.5 3.8 1.5l2.8-2.8A10 10 0 0 0 3.1 7.5l3.3 2.6C7.2 7.8 9.4 6 12 6z"/></svg>' + esc(S.signInWith.google) + '</button>' : '')
    + (prov.indexOf('facebook') > -1 ? '<button class="btn block" data-auth="facebook" style="background:#1877F2;color:#fff;border-color:transparent">' + esc(S.signInWith.facebook) + '</button>' : '')
    + (prov.indexOf('email') > -1 ? '<button class="btn block" data-auth="email">' + esc(S.signInWith.email) + '</button>' : '')
    + '</div><div id="emailform" hidden style="margin-top:12px"><label class="f" for="aemail">' + esc(S.emailLabel) + '</label><input id="aemail" type="email" autocomplete="email"><label class="f" for="apw">' + esc(S.passwordLabel) + '</label><input id="apw" type="password" autocomplete="current-password">'
    + '<div class="row" style="margin-top:12px"><button class="btn primary" id="alogin">' + esc(S.signIn) + '</button><button class="btn" id="acreate">' + esc(S.createAccount) + '</button><button class="btn sm" id="aforgot">' + esc(S.forgot) + '</button></div></div>'
    + '<p class="hint" id="astatus"></p></div>';
}
function bindAuth(root) {
  const S = T();
  const status = (msg, cls) => { const s = $('#astatus', root); if (s) { s.textContent = msg; s.className = 'hint ' + (cls || ''); } };
  $$('[data-auth]', root).forEach((b) => b.addEventListener('click', async () => {
    const p = b.getAttribute('data-auth');
    if (p === 'email') { $('#emailform').hidden = !$('#emailform').hidden; return; }
    try { await BE.signIn(p); } catch (e) { status(S.authFail + ': ' + (e.message || e.code), 'err'); }
  }));
  const em = () => $('#aemail').value.trim(), pw = () => $('#apw').value;
  const el = $('#alogin', root);
  if (el) {
    el.addEventListener('click', async () => { try { await BE.signInEmail(em(), pw(), false); } catch (e) { status(S.authFail + ': ' + (e.message || e.code), 'err'); } });
    $('#acreate', root).addEventListener('click', async () => { try { await BE.signInEmail(em(), pw(), true); } catch (e) { status(S.authFail + ': ' + (e.message || e.code), 'err'); } });
    $('#aforgot', root).addEventListener('click', async () => { try { await BE.resetPassword(em()); status(S.resetSent, 'ok'); } catch (e) { status(e.message, 'err'); } });
  }
}
function chatHTML(msgs, mine) {
  const S = T();
  if (!msgs.length) return '<p class="empty">' + esc(S.noMsgs) + '</p>';
  return msgs.map((m) => { const at = m.at && m.at.toDate ? m.at.toDate() : null; return '<div class="msg ' + (m.from === mine ? 'me' : 'them') + '">' + esc(m.text).replace(/\n/g, '<br>') + (at ? '<span class="t">' + esc(T().dateShort(at)) + ' ' + pad2(at.getHours()) + ':' + pad2(at.getMinutes()) + '</span>' : '') + '</div>'; }).join('');
}
function bookingRow(b, admin) {
  const S = T();
  return '<div class="bk"><div><b>' + esc(slotLabel(b.slot)) + '</b><br><span class="faint">' + (b.service ? esc(b.service + (b.pkg ? ' – ' + b.pkg : '') + (b.price ? ' (' + fmtPrice(b.price) + ')' : '')) + '<br>' : '') + esc(b.topic || '') + (b.birth ? '<br>🎂 ' + esc(b.birth) : '') + (admin ? ' · ' + esc(b.name || '') + ' ' + esc(b.email || '') : '') + (b.note ? '<br>' + esc(b.note) : '') + (b.card ? '<br>🃏 ' + esc(b.card) : '') + '</span></div>'
    + (admin && b.status === 'requested' ? '<div class="row" style="flex-direction:column"><button class="btn sm primary" data-bk="confirmed" data-id="' + b.id + '">' + esc(S.confirm) + '</button><button class="btn sm" data-bk="declined" data-id="' + b.id + '">' + esc(S.decline) + '</button></div>'
      : '<span class="st ' + esc(b.status) + '">' + esc(S.status[b.status] || b.status) + '</span>') + '</div>';
}

function renderMe(args, params) {
  meCleanup();
  const S = T(), m = $('#main');
  const name = (PROFILE.name || '').trim();
  const head = '<div class="me-head"><div class="avatar">' + esc((name || '?').charAt(0).toUpperCase()) + '</div><div><b>' + esc(name || S.helloGuest) + '</b><span class="faint">' + esc(BE.user ? (BE.user.email || '') : S.localOnly) + '</span></div></div>';
  m.innerHTML = head + '<div id="mebody"></div>';
  const body = $('#mebody');
  const draw = () => {
    meCleanup();
    let h = '';
    if (params.next === 'book' && !BE.user) h += '<div class="banner">' + esc(S.needLogin) + '</div>';
    h += authHTML() + profileFormHTML();
    if (BE.enabled) {
      h += '<div class="card"><h3 style="margin-bottom:4px">' + esc(S.messages) + '</h3><p class="hint" style="margin-bottom:8px">' + esc(S.messagesIntro) + '</p>'
        + (BE.user ? '<div class="chat" id="chat"></div><div class="chatbar"><textarea id="mtext" placeholder="' + esc(S.typeMsg) + '"></textarea><button class="btn primary" id="msend">' + esc(S.send) + '</button></div>' : '<p class="muted">' + esc(S.needLogin) + '</p>') + '</div>';
      if (BE.user) h += '<div class="card"><h3 style="margin-bottom:8px">' + esc(S.myBookings) + '</h3><div id="mybk"><p class="hint">…</p></div></div>';
    } else if (CONFIG.instagram) {
      h += '<div class="card"><h3 style="margin-bottom:4px">' + esc(S.messages) + '</h3><p class="muted" style="font-size:14px">' + esc(S.messagesSoon) + '</p><a class="btn block" href="https://ig.me/m/' + esc(CONFIG.instagram) + '" target="_blank" rel="noopener">' + esc(S.viaInstagram) + '</a></div>';
    }
    h += '<div class="card"><h3 style="margin-bottom:8px">' + esc(S.myCourses) + '</h3>' + COURSES.map((c) => { const a = ACCESS.get()[c.id]; return '<div class="course"><span>' + esc(L(c.name)) + '</span><span class="faint">' + (a ? (ACCESS.has(c.id) ? '✓ ' + esc(S.activeUntil(fmtDate(a))) : esc(S.expiredOn(fmtDate(a)))) : '🔒 ' + fmtPrice(c.price)) + '</span></div>'; }).join('')
      + '<label class="f" for="mcode">' + esc(S.enterCode) + '</label><div class="row"><input id="mcode" placeholder="NABU-T-…" autocapitalize="characters" style="flex:1"><button class="btn" id="munlock">' + esc(S.unlock) + '</button></div><p class="hint" id="mcstatus"></p></div>';
    h += '<div class="card"><h3 style="margin-bottom:8px">' + esc(S.themeTitle) + '</h3><div class="chips">' + ['auto', 'light', 'dark'].map((t) => '<button class="chip' + (themeChoice() === t ? ' on' : '') + '" data-theme-pick="' + t + '">' + esc(S.themes[t]) + '</button>').join('') + '</div><p class="hint">' + esc(S.themeHint) + '</p></div>';
    h += '<div class="card"><h3 style="margin-bottom:6px">' + esc(S.installTitle) + '</h3><p class="muted" style="font-size:14px">' + esc(S.install) + '</p></div>';
    h += '<div class="row">' + (BE.user ? '<button class="btn" id="signout">' + esc(S.signOut) + '</button>' : '') + '<button class="btn" id="retour">' + (lang === 'vi' ? 'Xem lại hướng dẫn' : 'Replay the tour') + '</button>' + (BE.isAdmin() ? '<a class="btn gold" href="#/admin">' + esc(S.adminTitle) + '</a>' : '') + '</div>';
    body.innerHTML = h;
    bindAuth(body);
    bindProfileForm(body, () => { if (params.next === 'book') location.hash = '#/book'; });
    $('#munlock').addEventListener('click', () => { const r = parseCode($('#mcode').value); const st = $('#mcstatus'); if (!r) { st.textContent = S.badCode; st.className = 'hint err'; return; } ACCESS.grant(r.course, r.until); toast(S.unlocked); draw(); });
    $$('[data-theme-pick]', body).forEach((b) => b.addEventListener('click', () => { setTheme(b.getAttribute('data-theme-pick')); $$('[data-theme-pick]', body).forEach((x) => x.classList.toggle('on', x === b)); }));
    $('#retour').addEventListener('click', () => { saveProfileLocal({ tourDone: false }); location.hash = '#/home'; });
    const so = $('#signout'); if (so) so.addEventListener('click', () => BE.signOut());
    if (BE.enabled && BE.user) {
      const chat = $('#chat');
      meUnsubs.push(BE.watchMessages(BE.user.uid, (msgs) => { chat.innerHTML = chatHTML(msgs, 'user'); chat.scrollTop = chat.scrollHeight; BE.markRead(BE.user.uid, 'user'); }));
      $('#msend').addEventListener('click', async () => { const t = $('#mtext').value.trim(); if (!t) return; $('#mtext').value = ''; try { await BE.sendMessage(t); } catch (e) { toast(e.message); } });
      meUnsubs.push(BE.watchMyBookings((list) => { $('#mybk').innerHTML = list.length ? list.map((b) => bookingRow(b, false)).join('') : '<p class="hint">' + esc(S.noBookings) + '</p>'; }));
    }
  };
  draw();
  if (BE.enabled) { const cb = () => { if (parseHash().route === 'me') { renderChrome('me'); draw(); } }; BE.listeners.push(cb); meUnsubs.push(() => { BE.listeners = BE.listeners.filter((x) => x !== cb); }); }
}
ROUTES.me = { nav: 'me', render: renderMe };
