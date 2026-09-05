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
  if (BE.user) return '';
  const prov = CONFIG.authProviders;
  return '<div class="card"><h3 style="margin-bottom:10px">' + esc(S.signIn) + '</h3><div class="providers">'
    + (prov.indexOf('google') > -1 ? '<button class="btn block" data-auth="google"><svg viewBox="0 0 24 24"><path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.4z"/><path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z"/><path fill="#FBBC05" d="M6.4 14a6 6 0 0 1 0-3.9V7.5H3.1a10 10 0 0 0 0 9z"/><path fill="#EA4335" d="M12 6c1.5 0 2.8.5 3.8 1.5l2.8-2.8A10 10 0 0 0 3.1 7.5l3.3 2.6C7.2 7.8 9.4 6 12 6z"/></svg>' + esc(S.signInWith.google) + '</button>' : '')
    + (prov.indexOf('facebook') > -1 ? '<button class="btn block" data-auth="facebook" style="background:#1877F2;color:#fff;border-color:transparent">' + esc(S.signInWith.facebook) + '</button>' : '')
    + (prov.indexOf('email') > -1 ? '<button class="btn block" data-auth="email">' + esc(S.signInWith.email) + '</button>' : '')
    + '</div><div id="emailform" hidden style="margin-top:12px"><label class="f" for="aemail">' + esc(S.emailLabel) + '</label><input id="aemail" type="email" autocomplete="email"><label class="f" for="apw">' + esc(S.passwordLabel) + '</label><input id="apw" type="password" autocomplete="current-password">'
    + '<div class="row" style="margin-top:12px"><button class="btn primary" id="alogin">' + esc(S.signIn) + '</button><button class="btn" id="acreate">' + esc(S.createAccount) + '</button><button class="btn sm" id="aforgot">' + esc(S.forgot) + '</button></div></div>'
    + '<p class="hint" id="astatus">' + (BE.enabled ? '' : esc(S.accountsSoon)) + '</p></div>';
}
function bindAuth(root) {
  const S = T();
  const status = (msg, cls) => { const s = $('#astatus', root); if (s) { s.textContent = msg; s.className = 'hint ' + (cls || ''); } };
  $$('[data-auth]', root).forEach((b) => b.addEventListener('click', async () => {
    const p = b.getAttribute('data-auth');
    if (!BE.enabled) { status(S.accountsSoon, 'err'); toast(S.accountsOff); return; }
    if (p === 'email') { $('#emailform').hidden = !$('#emailform').hidden; return; }
    try { await BE.signIn(p); } catch (e) { status(authMessage(e, p), 'err'); }
  }));
  const em = () => $('#aemail').value.trim(), pw = () => $('#apw').value;
  const el = $('#alogin', root);
  if (el && BE.enabled) {
    el.addEventListener('click', async () => { try { await BE.signInEmail(em(), pw(), false); } catch (e) { status(S.authFail + ': ' + (e.message || e.code), 'err'); } });
    $('#acreate', root).addEventListener('click', async () => { try { await BE.signInEmail(em(), pw(), true); } catch (e) { status(S.authFail + ': ' + (e.message || e.code), 'err'); } });
    $('#aforgot', root).addEventListener('click', async () => { try { await BE.resetPassword(em()); status(S.resetSent, 'ok'); } catch (e) { status(e.message, 'err'); } });
  }
}
/* Nabu's own card on the Me tab: what is waiting, and the notification switch. */
function adminSummaryHTML() {
  const S = T(), st = notifyState();
  return '<div class="card admin-sum"><div class="eyebrow">' + esc(S.adminSummary) + '</div>'
    + '<div class="cnt"><a href="#/admin?tab=inbox"><b>' + UNREAD + '</b><span>' + esc(S.unreadMsgs) + '</span></a><a href="#/admin?tab=bookings"><b>' + NEWBK + '</b><span>' + esc(S.newBookings) + '</span></a></div>'
    + '<a class="btn primary block" href="#/admin">' + esc(S.openAdmin) + '</a>'
    + (st === 'granted' ? '<p class="hint ok">🔔 ' + esc(S.notifOn) + '</p>' : st === 'denied' ? '<p class="hint err">' + esc(S.notifDenied) + '</p>' : st === 'unsupported' ? '<p class="hint">' + esc(S.notifUnsupported) + '</p>' : '<button class="btn block" id="notifon">🔔 ' + esc(S.enableNotif) + '</button><p class="hint">' + esc(S.notifHint) + '</p>')
    + '</div>';
}
function bindNotify(root) {
  const b = $('#notifon', root); if (!b) return;
  b.addEventListener('click', async () => { const r = await askNotify(); toast(r === 'granted' ? T().notifOn : T().notifDenied); if (r === 'granted') route(); });
}
function chatHTML(msgs, mine) {
  const S = T();
  if (!msgs.length) return '<p class="empty">' + esc(S.noMsgs) + '</p>';
  return msgs.map((m) => {
    const at = m.at && m.at.toDate ? m.at.toDate() : null;
    const att = m.kind === 'image' && m.url ? '<a href="' + esc(m.url) + '" target="_blank" rel="noopener"><img src="' + esc(m.url) + '" alt="" class="att"></a>' : m.kind === 'audio' && m.url ? '<audio controls src="' + esc(m.url) + '" class="att"></audio>' : '';
    const who = m.from === mine ? S.youLabel : (m.from === 'nabu' ? 'Nabu' : (m.name || S.guestLabel));
    return '<div class="msg ' + (m.from === mine ? 'me' : 'them') + '"><span class="who">' + esc(who) + '</span>' + att + esc(m.text || '').replace(/\n/g, '<br>') + (at ? '<span class="t">' + esc(T().dateShort(at)) + ' ' + pad2(at.getHours()) + ':' + pad2(at.getMinutes()) + '</span>' : '') + '</div>';
  }).join('');
}
/* Chat bar with text, a photo button and a hold-to-record voice button. */
/* Firebase error codes in plain words. */
function authMessage(e, provider) {
  const S = T(), code = (e && e.code) || '';
  if (code === 'auth/operation-not-allowed') return provider === 'facebook' ? S.authFbOff : S.authProviderOff;
  if (code === 'auth/unauthorized-domain') return S.authDomain;
  if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return S.authCancelled;
  if (code === 'auth/account-exists-with-different-credential') return S.authOtherProvider;
  if (code === 'auth/network-request-failed') return S.authNetwork;
  return S.authFail + ': ' + ((e && (e.message || e.code)) || '');
}
function chatBarHTML(idText, idSend, label) {
  const S = T();
  const att = (CONFIG.attachments || CONFIG.chatImages ? '<label class="btn sm att-btn" title="' + esc(S.sendPhoto) + '">📷<input type="file" accept="image/*" data-chat-img hidden></label>' : '') + (CONFIG.attachments ? '<button class="btn sm att-btn" data-chat-voice title="' + esc(S.holdToRecord) + '">🎤</button>' : '');
  return '<div class="emojis" data-chat-emojis hidden>' + EMOJIS.map((e) => '<button type="button">' + e + '</button>').join('') + '</div><div class="chatbar"><button class="btn sm att-btn" data-chat-emoji title="' + esc(S.emojiBtn) + '">😊</button>' + att + '<textarea id="' + idText + '" placeholder="' + esc(S.typeMsg) + '"></textarea><button class="btn primary" id="' + idSend + '">' + esc(label) + '</button></div><p class="hint" data-chat-status></p>';
}
function bindChatBar(root, sendFn) {
  const S = T(), status = $('[data-chat-status]', root);
  const say = (t) => { if (status) status.textContent = t || ''; };
  const em = $('[data-chat-emoji]', root), pal = $('[data-chat-emojis]', root), ta = $('.chatbar textarea', root);
  if (em && pal) { em.addEventListener('click', () => { pal.hidden = !pal.hidden; }); $$('button', pal).forEach((b) => b.addEventListener('click', () => { const st = ta.selectionStart || ta.value.length; ta.value = ta.value.slice(0, st) + b.textContent + ta.value.slice(st); ta.focus(); })); }
  const img = $('[data-chat-img]', root);
  if (img) img.addEventListener('change', async () => {
    const f = img.files && img.files[0]; if (!f) return;
    if (f.size > 12 * 1024 * 1024) { say(S.fileTooBig); return; }
    say(S.uploading);
    try { await sendFn('', f, 'image'); say(''); } catch (e) { say(S.publishFail + ': ' + e.message); }
    img.value = '';
  });
  const mic = $('[data-chat-voice]', root);
  if (mic) {
    let rec = null, chunks = [];
    const stop = () => { if (rec && rec.state !== 'inactive') rec.stop(); };
    const start = async () => {
      if (!navigator.mediaDevices || !window.MediaRecorder) { say(S.noMic); return; }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        chunks = []; rec = new MediaRecorder(stream);
        rec.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
        rec.onstop = async () => {
          stream.getTracks().forEach((t) => t.stop()); mic.classList.remove('rec');
          const blob = new Blob(chunks, { type: rec.mimeType || 'audio/webm' });
          if (blob.size < 2000) { say(''); return; }
          say(S.uploading);
          try { await sendFn('', blob, 'audio'); say(''); } catch (e) { say(S.publishFail + ': ' + e.message); }
        };
        rec.start(); mic.classList.add('rec'); say(S.recording);
      } catch (e) { say(S.noMic); }
    };
    mic.addEventListener('click', () => { if (rec && rec.state === 'recording') stop(); else start(); });
  }
}
/* Without Storage a photo is shrunk and travels inside the message document. */
async function chatAttachment(file, uid, kind) {
  if (BE.storage) return BE.uploadAttachment(file, uid, kind);
  if (kind !== 'image') throw new Error(T().noMic);
  const data = await shrinkImage(file, 900, 0.72);
  if (data.length > 700000) throw new Error(T().imgTooBigChat);
  return { url: data, kind: 'image' };
}
function bookingRow(b, admin) {
  const S = T();
  const items = Array.isArray(b.items) && b.items.length ? b.items : (b.service ? [{ service: b.service, pkg: b.pkg || '', price: b.price || 0, topic: b.topic || '' }] : []);
  const list = items.map((it) => '<li>' + esc(String(it.service || '') + (it.pkg ? ' – ' + it.pkg : '')) + (it.price ? ' <b>' + fmtPrice(it.price) + '</b>' : '') + (it.topic ? '<br><small>' + esc(S.msgTopic) + ': ' + esc(it.topic) + '</small>' : '') + '</li>').join('');
  const total = items.length > 1 ? '<div class="tot"><span>' + esc(S.msgTotal) + '</span><b>' + fmtPrice(b.price || items.reduce((n, x) => n + (x.price || 0), 0)) + '</b></div>' : '';
  const meta = [admin && (b.name || b.email) ? '🙋 ' + esc([b.name, b.email].filter(Boolean).join(' · ')) : '', b.birth ? '🎂 ' + esc(b.birth) : '', b.note ? '📝 ' + esc(b.note) : '', b.card ? '🃏 ' + esc(b.card) : ''].filter(Boolean).join('<br>');
  const d = slotDate(b.slot), future = d && d.getTime() > Date.now(), live = ['requested', 'confirmed', 'change_requested', 'cancel_requested'].indexOf(b.status) > -1;
  const change = b.status === 'change_requested' && b.newSlot ? '<div class="chg">🔁 ' + esc(S.newSlotLabel) + ': ' + esc(slotLabel(b.newSlot)) + '</div>' : '';
  let acts = '';
  if (admin) {
    if (b.status === 'requested') acts = '<button class="btn sm primary" data-bk="confirmed" data-id="' + b.id + '">' + esc(S.confirm) + '</button><button class="btn sm" data-bk="declined" data-id="' + b.id + '">' + esc(S.decline) + '</button>';
    else if (b.status === 'change_requested') acts = '<button class="btn sm primary" data-bk="confirmed" data-id="' + b.id + '">' + esc(S.adminApplyChange) + '</button><button class="btn sm" data-bk="keep" data-id="' + b.id + '">' + esc(S.adminKeep) + '</button>';
    else if (b.status === 'cancel_requested') acts = '<button class="btn sm primary" data-bk="cancelled" data-id="' + b.id + '">' + esc(S.adminApplyCancel) + '</button><button class="btn sm" data-bk="keep" data-id="' + b.id + '">' + esc(S.adminKeepBooking) + '</button>';
    if (live && future) acts += '<button type="button" class="btn sm" data-ics="' + b.id + '">📅 ' + esc(S.addToCalendar) + '</button><a class="btn sm" href="' + esc(gcalLink(b)) + '" target="_blank" rel="noopener">🗓 ' + esc(S.gcal) + '</a>';
  } else if (live && future) {
    acts = '<a class="btn sm" href="#/book?change=' + esc(b.id) + '">🔁 ' + esc(S.changeSlot) + '</a><button class="btn sm" data-cancel="' + b.id + '">✕ ' + esc(S.cancelBooking) + '</button>'
      + '<button type="button" class="btn sm" data-ics="' + b.id + '">📅 ' + esc(S.addToCalendar) + '</button><a class="btn sm" href="' + esc(gcalLink(b)) + '" target="_blank" rel="noopener">🗓 ' + esc(S.gcal) + '</a>';
  }
  return '<div class="bk"><div class="bkh"><b>📅 ' + esc(slotLabel(b.slot)) + '</b><span class="st ' + esc(b.status) + '">' + esc(S.status[b.status] || b.status) + '</span></div>' + change
    + (list ? '<ul>' + list + '</ul>' : '') + total + (meta ? '<p class="meta">' + meta + '</p>' : '')
    + (acts ? '<div class="acts">' + acts + '</div>' : '') + '</div>';
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
    if (BE.isAdmin()) h += adminSummaryHTML();
    h += authHTML() + profileFormHTML();
    if (BE.enabled) {
      h += '<div class="card"><h3 style="margin-bottom:4px">' + esc(S.messages) + '</h3><p class="hint" style="margin-bottom:8px">' + esc(BE.isAdmin() ? S.ownThreadHint : S.messagesIntro) + '</p>'
        + (BE.user ? '<div class="chat" id="chat"></div>' + chatBarHTML('mtext', 'msend', S.send) : '<p class="muted">' + esc(S.needLogin) + '</p>') + '</div>';
      if (BE.user) h += '<div class="card"><h3 style="margin-bottom:8px">' + esc(S.myBookings) + '</h3><div id="mybk"><p class="hint">…</p></div>' + (notifyState() === 'default' ? '<button class="btn block" id="notifon" style="margin-top:8px">🔔 ' + esc(S.reminderOn) + '</button>' : '') + '<p class="hint">' + esc(S.reminderHint) + ' ' + esc(S.calendarHint) + '</p></div>';
    } else if (CONFIG.instagram) {
      h += '<div class="card"><h3 style="margin-bottom:4px">' + esc(S.messages) + '</h3><p class="muted" style="font-size:14px">' + esc(S.messagesSoon) + '</p><a class="btn block" href="https://ig.me/m/' + esc(CONFIG.instagram) + '" target="_blank" rel="noopener">' + esc(S.viaInstagram) + '</a></div>';
    }
    h += aiPanelHTML({ type: 'general' });
    h += '<div class="card"><h3 style="margin-bottom:8px">' + esc(S.myCourses) + '</h3>' + COURSES.map((c) => { const a = ACCESS.isAdmin() ? '9999-12-31' : ACCESS.get()[c.id]; return '<div class="course"><span>' + esc(L(c.name)) + '</span><span class="faint">' + (a ? (ACCESS.has(c.id) ? '✓ ' + esc(S.activeUntil(fmtDate(a))) : esc(S.expiredOn(fmtDate(a)))) : (isTWA() ? '🔒' : '🔒 ' + fmtPrice(c.price))) + '</span></div>'; }).join('')
      + '<label class="f" for="mcode">' + esc(S.enterCode) + '</label><div class="row nw"><input id="mcode" placeholder="NABU-T-…" autocapitalize="characters"><button class="btn" id="munlock">' + esc(S.unlock) + '</button></div><p class="hint" id="mcstatus"></p></div>';
    h += '<div class="card"><h3 style="margin-bottom:8px">' + esc(S.themeTitle) + '</h3><div class="chips">' + ['auto', 'light', 'dark', 'pink'].map((t) => '<button class="chip' + (themeChoice() === t ? ' on' : '') + '" data-theme-pick="' + t + '">' + esc(S.themes[t]) + '</button>').join('') + '</div><p class="hint">' + esc(S.themeHint) + '</p></div>';
    h += '<div class="row">' + (BE.user ? '<button class="btn" id="signout">' + esc(S.signOut) + '</button>' : '') + '<a class="btn" href="#/contact">💬 ' + esc(S.contactLink) + '</a><a class="btn" href="#/report">🐞 ' + esc(S.reportLink) + '</a><button class="btn" id="retour">' + (lang === 'vi' ? 'Xem lại hướng dẫn' : 'Replay the tour') + '</button>' + (BE.isAdmin() ? '<a class="btn gold" href="#/admin">' + esc(S.adminTitle) + '</a>' : '') + '</div>';
    if (BE.enabled && BE.user) h += '<div class="card danger"><h3 style="margin-bottom:4px">' + esc(S.delAccount) + '</h3><p class="hint" style="margin-bottom:10px">' + esc(S.delHint) + '</p><button class="btn block" id="delacct">🗑 ' + esc(S.delAccount) + '</button><p class="hint" id="delstatus"></p></div>';
    h += '<p class="hint" style="text-align:center;margin-top:16px">' + esc(S.versionLine(window.APP_VERSION || '')) + ' · <button type="button" class="linkbtn" id="chkupd">' + esc(S.checkUpdate) + '</button> · <a href="#/privacy">' + esc(S.privacyLink) + '</a></p>';
    body.innerHTML = h;
    bindAuth(body); bindAI(body); bindNotify(body);
    $('#chkupd').addEventListener('click', async () => {
      toast(S.updating);
      try { if ('serviceWorker' in navigator) { const reg = await navigator.serviceWorker.getRegistration(); if (reg) await reg.update(); } } catch (e) { /* offline */ }
      setTimeout(() => location.reload(), 800);
    });
    bindProfileForm(body, () => { if (params.next === 'book') location.hash = '#/book'; });
    $('#munlock').addEventListener('click', () => { const r = parseCode($('#mcode').value); const st = $('#mcstatus'); if (!r) { st.textContent = S.badCode; st.className = 'hint err'; return; } ACCESS.grant(r.course, r.until); toast(S.unlocked); draw(); });
    $$('[data-theme-pick]', body).forEach((b) => b.addEventListener('click', () => { setTheme(b.getAttribute('data-theme-pick')); $$('[data-theme-pick]', body).forEach((x) => x.classList.toggle('on', x === b)); }));
    $('#retour').addEventListener('click', () => { saveProfileLocal({ tourDone: false }); location.hash = '#/home'; });
    const so = $('#signout'); if (so) so.addEventListener('click', () => BE.signOut());
    const da = $('#delacct'); if (da) da.addEventListener('click', async () => {
      if (!confirm(S.delConfirm)) return;
      da.disabled = true; const st = $('#delstatus'); st.textContent = S.sending;
      try { await BE.deleteAccount(); toast(S.delDone); location.hash = '#/home'; }
      catch (e) { da.disabled = false; if (e && e.code === 'auth/requires-recent-login') { st.textContent = S.delRelogin; st.className = 'hint err'; try { await BE.signOut(); } catch (e2) { /* already out */ } } else { st.textContent = S.publishFail + ': ' + (e && e.message || e); st.className = 'hint err'; } }
    });
    if (BE.enabled && BE.user) {
      const chat = $('#chat');
      meUnsubs.push(BE.watchMessages(BE.user.uid, (msgs) => { chat.innerHTML = chatHTML(msgs, 'user'); chat.scrollTop = chat.scrollHeight; BE.markRead(BE.user.uid, 'user'); }));
      const sendUser = async (text, file, kind) => { let att = null; if (file) att = await chatAttachment(file, BE.user.uid, kind); await BE.sendMessage(text, null, att); };
      $('#msend').addEventListener('click', async () => { const t = $('#mtext').value.trim(); if (!t) return; $('#mtext').value = ''; try { await sendUser(t); } catch (e) { toast(e.message); } });
      bindChatBar(body, sendUser);
      meUnsubs.push(BE.watchMyBookings((list) => {
        $('#mybk').innerHTML = list.length ? list.map((b) => bookingRow(b, false)).join('') : '<p class="hint">' + esc(S.noBookings) + '</p>';
        $$('[data-ics]', body).forEach((x) => x.addEventListener('click', () => { const bk = list.filter((y) => y.id === x.getAttribute('data-ics'))[0]; if (bk) addToCalendar(bk); }));
        $$('[data-cancel]', body).forEach((x) => x.addEventListener('click', async () => { const bk = list.filter((y) => y.id === x.getAttribute('data-cancel'))[0]; if (!bk || !confirm(S.confirmCancel)) return; try { await BE.requestCancel(bk); toast(S.cancelSent); } catch (e) { toast(e.message); } }));
        scheduleReminders(list);
      }));
    }
  };
  draw();
  if (BE.enabled) { const cb = () => { if (parseHash().route === 'me') { renderChrome('me'); draw(); } }; BE.listeners.push(cb); meUnsubs.push(() => { BE.listeners = BE.listeners.filter((x) => x !== cb); }); }
}
ROUTES.me = { nav: 'me', render: renderMe };
