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
/* Signing in has a page of its own at #/signin. What is left on the profile is
   the door to it, so somebody who lands here without an account still sees one
   obvious way in. */
function authHTML() {
  const S = T();
  if (BE.user) return '';
  return '<div class="card needin"><div class="ic">\uD83D\uDD11</div>'
    + '<p class="lead">' + esc(S.signIn) + '</p>'
    + '<p class="hint">' + esc(S.signinLead) + '</p>'
    + '<a class="btn primary block" href="' + esc(signinHref('/me')) + '">' + esc(S.needInGo) + '</a>'
    + (BE.enabled ? '' : '<p class="hint">' + esc(S.accountsSoon) + '</p>') + '</div>';
}
/* Kept, and empty: the profile carries no sign-in control any more, and the
   sign-in page binds its own. */
function bindAuth() { }
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
    /* Not a link: a data: URL cannot be navigated to, so the old anchor did
       nothing at all when tapped. The viewer opens it instead. */
    const att = m.kind === 'image' && m.url ? '<img src="' + esc(m.url) + '" alt="" class="att" data-img="1">'
      : m.kind === 'audio' && m.url ? '<audio controls src="' + esc(m.url) + '" class="att"></audio>' : '';
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
  /* The two small buttons stack down the left rather than sitting in the row,
     so they stay level with a compose box of any height instead of being
     dwarfed by it. */
  return '<div class="emojis" data-chat-emojis hidden>' + EMOJIS.map((e) => '<button type="button">' + e + '</button>').join('') + '</div>'
    + '<div class="chatbar">'
    + '<div class="chattools"><button class="btn sm att-btn" data-chat-emoji title="' + esc(S.emojiBtn) + '">😊</button>' + att + '</div>'
    + '<textarea id="' + idText + '" placeholder="' + esc(S.typeMsg) + '"></textarea>'
    + '<button class="btn primary" id="' + idSend + '">' + esc(label) + '</button></div><p class="hint" data-chat-status></p>';
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
/* An unlock order has no date and no calendar file: it is a list of what was
   chosen, a total, and a code to send back. */
function unlockRequestRow(b, admin) {
  const S = T(), items = Array.isArray(b.items) ? b.items : [];
  const list = items.map((it) => '<li>' + esc(it.name || it.id || '') + (it.price ? ' <b>' + fmtPrice(it.price) + '</b>' : '') + '</li>').join('');
  const meta = admin && (b.name || b.email) ? '🙋 ' + esc([b.name, b.email].filter(Boolean).join(' · ')) : '';
  let acts = '';
  if (admin && b.status === 'requested') acts = '<button class="btn sm primary" data-bk="confirmed" data-id="' + b.id + '">' + esc(S.confirm) + '</button><button class="btn sm" data-bk="declined" data-id="' + b.id + '">' + esc(S.decline) + '</button>';
  /* The second press. Confirming was only ever an agreement to sell; this is
     the money arriving, and this is what opens anything. */
  if (admin && !b.paid && ['declined', 'cancelled'].indexOf(b.status) < 0) {
    acts += '<button type="button" class="btn sm primary" data-paid="' + b.id + '">💰 ' + esc(S.adminGotPaid) + '</button>';
  }
  /* Plenty of people order and never write a word, and until now there was no
     way to reach them from the order at all: the only door to somebody's thread
     was the inbox, which lists the people who already wrote. This opens theirs,
     where what they hold and the way to take it back also live. */
  if (admin && b.uid) {
    acts += '<button type="button" class="btn sm" data-person="' + esc(b.uid) + '">💬 ' + esc(S.adminMessageThem) + '</button>';
  }
  return '<div class="bk unlockreq' + (b.paid ? ' ispaid' : '') + '"><div class="bkh"><b>🔓 ' + esc(S.reqKindUnlock) + '</b><span class="st ' + esc(b.paid ? 'confirmed' : (b.status || '')) + '">' + esc(b.paid ? S.adminPaidTag : ((S.status && S.status[b.status]) || b.status || '')) + '</span></div>'
    + (list ? '<ul>' + list + '</ul>' : '')
    + (b.price ? '<div class="tot"><span>' + esc(S.unlockTotal) + '</span><b>' + fmtPrice(b.price) + '</b></div>' : '')
    + (meta ? '<p class="hint">' + meta + '</p>' : '')
    + (acts ? '<div class="acts">' + acts + '</div>' : '')
    + '</div>';
}
function bookingRow(b, admin) {
  const S = T();
  if (b.kind === 'unlock') return unlockRequestRow(b, admin);
  const items = Array.isArray(b.items) && b.items.length ? b.items : (b.service ? [{ service: b.service, pkg: b.pkg || '', price: b.price || 0, topic: b.topic || '' }] : []);
  const list = items.map((it) => '<li>' + esc(String(it.service || '') + (it.pkg ? ' – ' + it.pkg : '')) + (it.price ? ' <b>' + fmtPrice(it.price) + '</b>' : '') + (it.topic ? '<br><small>' + esc(S.msgTopic) + ': ' + esc(it.topic) + '</small>' : '') + '</li>').join('');
  const total = items.length > 1 ? '<div class="tot"><span>' + esc(S.msgTotal) + '</span><b>' + fmtPrice(b.price || items.reduce((n, x) => n + (x.price || 0), 0)) + '</b></div>' : '';
  const wh = b.where ? whereOf(b.where) : null;
  const meta = [admin && (b.name || b.email) ? '🙋 ' + esc([b.name, b.email].filter(Boolean).join(' · ')) : '',
    wh ? wh.icon + ' ' + esc(S.msgWhere) + ': <b>' + esc(L(wh.name)) + '</b>'
        + (b.whereId ? ' · <b>' + esc(b.whereId) + '</b>' : '')
      : (b.whereName ? '💬 ' + esc(S.msgWhere) + ': <b>' + esc(b.whereName) + '</b>' : ''),
    b.birth ? '🎂 ' + esc(b.birth) : '', b.note ? '📝 ' + esc(b.note) : '', b.card ? '🃏 ' + esc(b.card) : ''].filter(Boolean).join('<br>');
  const d = slotDate(b.slot), future = d && d.getTime() > Date.now(), live = ['requested', 'confirmed', 'change_requested', 'cancel_requested'].indexOf(b.status) > -1;
  const change = b.status === 'change_requested' && b.newSlot ? '<div class="chg">🔁 ' + esc(S.newSlotLabel) + ': ' + esc(slotLabel(b.newSlot)) + '</div>' : '';
  let acts = '';
  if (admin) {
    if (b.status === 'requested') acts = '<button class="btn sm primary" data-bk="confirmed" data-id="' + b.id + '">' + esc(S.confirm) + '</button><button class="btn sm" data-bk="declined" data-id="' + b.id + '">' + esc(S.decline) + '</button>';
    else if (b.status === 'change_requested') acts = '<button class="btn sm primary" data-bk="confirmed" data-id="' + b.id + '">' + esc(S.adminApplyChange) + '</button><button class="btn sm" data-bk="keep" data-id="' + b.id + '">' + esc(S.adminKeep) + '</button>';
    else if (b.status === 'cancel_requested') acts = '<button class="btn sm primary" data-bk="cancelled" data-id="' + b.id + '">' + esc(S.adminApplyCancel) + '</button><button class="btn sm" data-bk="keep" data-id="' + b.id + '">' + esc(S.adminKeepBooking) + '</button>';
    /* Nabu could confirm, decline, and agree to a cancellation somebody else
       asked for - but not call one off. Anyone who takes bookings falls ill. */
    if (live && b.status !== 'cancel_requested') acts += '<button type="button" class="btn sm" data-bkoff="' + b.id + '">✕ ' + esc(S.adminCancel) + '</button>';
    /* A reading has nothing to unlock, but Nabu still needs to know which
       ones have been settled. */
    if (!b.paid && live) acts += '<button type="button" class="btn sm" data-paid="' + b.id + '">💰 ' + esc(S.adminGotPaid) + '</button>';
    if (live && future) acts += '<button type="button" class="btn sm" data-ics="' + b.id + '">📅 ' + esc(S.addToCalendar) + '</button><a class="btn sm" href="' + esc(gcalLink(b)) + '" target="_blank" rel="noopener">🗓 ' + esc(S.gcal) + '</a>';
  } else if (live && future) {
    acts = '<a class="btn sm" href="#/book?change=' + esc(b.id) + '">🔁 ' + esc(S.changeSlot) + '</a><button class="btn sm" data-cancel="' + b.id + '">✕ ' + esc(S.cancelBooking) + '</button>'
      + '<button type="button" class="btn sm" data-ics="' + b.id + '">📅 ' + esc(S.addToCalendar) + '</button><a class="btn sm" href="' + esc(gcalLink(b)) + '" target="_blank" rel="noopener">🗓 ' + esc(S.gcal) + '</a>';
  }
  return '<div class="bk"><div class="bkh"><b>📅 ' + esc(S.reqKindBooking) + ' · ' + esc(slotLabel(b.slot)) + '</b><span class="st ' + esc(b.status) + '">' + esc(S.status[b.status] || b.status) + '</span></div>' + change
    + (list ? '<ul>' + list + '</ul>' : '') + total + (meta ? '<p class="meta">' + meta + '</p>' : '')
    + (acts ? '<div class="acts">' + acts + '</div>' : '') + '</div>';
}

function renderMe(args, params) {
  meCleanup();
  const S = T(), m = $('#main');
  const name = (PROFILE.name || '').trim();
  const head = '<div class="me-head"><div class="avatar">' + esc((name || '?').charAt(0).toUpperCase()) + '</div><div><b>' + esc(name || S.helloGuest) + '</b><span class="faint">' + esc(BE.user ? (BE.user.email || '') : S.localOnly) + '</span></div></div>';
  m.innerHTML = head + loveBadgeHTML() + '<div id="mebody"></div>';
  const body = $('#mebody');
/* A folding group. Whether it was open is kept per device, so the page comes
   back the way somebody left it rather than the way it was designed. */
function meOpen(id, fallback) {
  const m = store.get('nabu-me-open', {}) || {};
  return Object.prototype.hasOwnProperty.call(m, id) ? !!m[id] : !!fallback;
}
function meSect(id, icon, title, body, openByDefault, force) {
  if (!body) return '';
  return '<details class="sect" data-sect="' + esc(id) + '"' + (force || meOpen(id, openByDefault) ? ' open' : '') + '>'
    + '<summary><span class="si">' + icon + '</span><b>' + esc(title) + '</b><span class="sx" aria-hidden="true">\u203A</span></summary>'
    + '<div class="sbody">' + body + '</div></details>';
}

  const draw = () => {
    meCleanup();
    let h = '';
    if (params.next === 'book' && !BE.user) h += '<div class="banner">' + esc(S.needLogin) + '</div>';
    if (BE.isAdmin()) h += adminSummaryHTML();
    /* Group one: who you are. Always open - it is the reason the tab exists. */
    /* Folded shut, this section hides the only way back in. Somebody who has
       just signed out, or has never signed in, must be able to see the buttons
       without knowing to open anything - so with nobody signed in it is opened
       whatever this device last chose. */
    h += meSect('who', '\uD83D\uDC64', S.meGroupYou, authHTML() + profileFormHTML(), true, !BE.user);
    let talk = '';
    if (BE.enabled) {
      /* Nabu already has an inbox on the dashboard holding every conversation.
         A second chat box here is Nabu's thread with Nabu, which exists only
         because the code never told the two apart. For a visitor this box is
         the one way to reach Nabu, and stays exactly where it is. */
      if (BE.isAdmin()) {
        talk += '<a class="card" href="#/admin?tab=inbox" style="display:block;text-decoration:none;color:inherit">'
          + '<h3 style="margin-bottom:4px">\uD83D\uDCE8 ' + esc(S.adminTabs.inbox) + '</h3>'
          + '<p class="hint">' + esc(S.meInboxHint) + '</p></a>';
      } else {
        talk += '<div class="card"><h3 style="margin-bottom:4px">' + esc(S.messages) + '</h3><p class="hint" style="margin-bottom:8px">' + esc(S.messagesIntro) + '</p>'
          + (BE.user ? '<div class="chat" id="chat"></div>' + chatBarHTML('mtext', 'msend', S.send) : '<p class="muted">' + esc(S.needLogin) + '</p>') + '</div>';
      }
      if (BE.user) talk += wedComingHTML();
      if (BE.user) talk += '<div class="card"><h3 style="margin-bottom:8px">' + esc(S.myBookings) + '</h3><div id="mybk"><p class="hint">…</p></div>' + (notifyState() === 'default' ? '<button class="btn block" id="notifon" style="margin-top:8px">🔔 ' + esc(S.reminderOn) + '</button>' : '') + '<p class="hint">' + esc(S.reminderHint) + ' ' + esc(S.calendarHint) + '</p></div>';
    } else if (CONFIG.instagram) {
      talk += '<div class="card"><h3 style="margin-bottom:4px">' + esc(S.messages) + '</h3><p class="muted" style="font-size:14px">' + esc(S.messagesSoon) + '</p><a class="btn block" href="https://ig.me/m/' + esc(CONFIG.instagram) + '" target="_blank" rel="noopener">' + esc(S.viaInstagram) + '</a></div>';
    }
    talk += aiPanelHTML({ type: 'general' });
    /* Group two: everything that is a conversation - with Nabu, and with the
       machine. Open, because it is the half people come back for. */
    h += meSect('talk', '\uD83D\uDCAC', S.meGroupTalk, talk, true);

    /* Not in the installed app. On the web this list is useful - it is where
       somebody checks what they hold and when it runs out. Inside the Android
       app it is also the first thing a Play reviewer sees, and a list of paid
       courses with dates against them, next to prices, reads as selling digital
       goods outside Play whatever the truth of it. The prices were already kept
       out of the app for that reason; the rest of the row belongs with them.
       The box for entering a code stays, so an unlock still works here. */
    let own = '<div class="card"><h3 style="margin-bottom:8px">' + esc(S.myCourses) + '</h3>' + (isTWA() ? '' : COURSES.map((c) => { const a = ACCESS.isAdmin() ? '9999-12-31' : ACCESS.get()[c.id]; const on = ACCESS.has(c.id);
      const ic = a ? (on ? '✓' : '⌛') : '🔒';
      // The tick and the hourglass already say open or expired, so the column
      // only carries the date. Spelling it out pushed long course names onto a
      // second line and left the column ragged.
      const right = a ? esc(a.slice(8, 10) + '/' + a.slice(5, 7) + '/' + a.slice(0, 4)) : (isTWA() ? '' : priceHTML(c.price, 'unlock', c.id));
      return '<div class="course"><span class="nm">' + esc(L(c.name)) + '</span><span class="ic">' + ic + '</span><span class="pr faint">' + right + '</span></div>'; }).join(''))
      + '<label class="f" for="mcode">' + esc(S.enterCode) + '</label><div class="row nw"><input id="mcode" placeholder="NABU-T-…" autocapitalize="characters"><button class="btn" id="munlock">' + esc(S.unlock) + '</button></div><p class="hint" id="mcstatus"></p></div>';
    /* A block nobody can undo is a trap rather than a tool: somebody blocks in
       a bad moment and has no way back. Shown only once there is somebody on
       the list, so it does not sit there puzzling people who never used it. */
    if (MOD.list().length) {
      own += '<div class="card"><h3 style="margin-bottom:8px">' + esc(S.modBlockedList) + '</h3>'
        + MOD.list().map((uid) => '<div class="course"><span class="nm">' + esc(uid.slice(0, 10)) + '\u2026</span>'
          + '<span class="pr"><button type="button" class="btn sm" data-unblock="' + esc(uid) + '">' + esc(S.modUnblock) + '</button></span></div>').join('')
        + '</div>';
    }
    own += '<div class="melinks"><a class="btn" href="#/looks">\uD83C\uDFA8 ' + esc(S.looksLink) + '</a><a class="btn" href="#/rewards">\uD83E\uDE99 ' + esc(S.luckLink) + '</a></div>';
    /* Group three: what this account holds. Folded by default - it is a place
       you go to check something, not a place you read. */
    h += meSect('own', '\uD83D\uDD11', S.meGroupOwn, own, false);

    let app = '<div class="card"><h3 style="margin-bottom:8px">' + esc(S.themeTitle) + '</h3><div class="themes">' + ['auto', 'light', 'dark', 'pink'].map((t) => '<button class="chip' + (themeChoice() === t ? ' on' : '') + '" data-theme-pick="' + t + '" title="' + esc(S.themes[t]) + '">' + esc(S.themeShort[t]) + '</button>').join('') + '</div></div>';
    if (!(isStandalone() || isTWA())) app += '<a class="card" href="#/install" style="display:block;text-decoration:none;color:inherit"><h3 style="margin-bottom:4px">\uD83D\uDCF2 ' + esc(S.installTitle) + '</h3><p class="hint">' + esc(S.instIntro) + '</p></a>';
    app += '<div class="meacts"><div class="row3"><a class="btn" href="#/contact">💬 ' + esc(S.contactLink) + '</a><a class="btn" href="#/report">🐞 ' + esc(S.reportLink) + '</a><button class="btn" id="retour">🎓 ' + esc(S.tourLink) + '</button></div>'
      + (BE.user || BE.isAdmin() ? '<div class="row">' + (BE.user ? '<button class="btn" id="signout" style="flex:1">🚪 ' + esc(S.signOut) + '</button>' : '') + (BE.isAdmin() ? '<a class="btn gold" href="#/admin" style="flex:1">🛠 ' + esc(S.adminTitle) + '</a>' : '') + '</div>' : '') + '</div>';
    if (BE.enabled && BE.user) app += '<div class="card danger"><h3 style="margin-bottom:4px">' + esc(S.delAccount) + '</h3><p class="hint" style="margin-bottom:10px">' + esc(S.delHint) + '</p><button class="btn block" id="delacct">🗑 ' + esc(S.delAccount) + '</button><p class="hint" id="delstatus"></p></div>';
    app += '<p class="hint" style="text-align:center;margin-top:16px">' + esc(S.versionLine(window.APP_VERSION || '')) + ' · <button type="button" class="linkbtn" id="chkupd">' + esc(S.checkUpdate) + '</button> · <a href="#/privacy">' + esc(S.privacyLink) + '</a></p>';
    /* Group four: the app itself. Folded - nobody changes their theme twice a
       day, and deleting the account should take a deliberate reach. */
    h += meSect('app', '\u2699\uFE0F', S.meGroupApp, app, false);
    body.innerHTML = h;
    /* Remember how they left it. */
    $$('details[data-sect]', body).forEach((el) => el.addEventListener('toggle', () => {
      const m = store.get('nabu-me-open', {}) || {};
      m[el.getAttribute('data-sect')] = el.open;
      store.set('nabu-me-open', m);
    }));
    bindAuth(body); bindAI(body); bindNotify(body);
    $('#chkupd').addEventListener('click', async () => {
      toast(S.updating);
      try { if ('serviceWorker' in navigator) { const reg = await navigator.serviceWorker.getRegistration(); if (reg) await reg.update(); } } catch (e) { /* offline */ }
      setTimeout(() => location.reload(), 800);
    });
    bindProfileForm(body, () => {
      if (params.next === 'book') location.hash = '#/book';
      /* Back through the door they came in by, so the page still leads with
         whatever they were trying to unlock. */
      else if (params.next === 'unlock') location.hash = '#/unlock?from=' + (store.get('nabu-unlock-from', '') || '');
      /* Back to the door they were standing at when they were asked to
         make an account. */
      else if (params.next === 'wedding') { const w = store.get('nabu-wed-next', ''); location.hash = w ? '#/wedding/' + w : '#/wedding'; }
    });
    $('#munlock').addEventListener('click', async () => {
      const st = $('#mcstatus'), btn = $('#munlock');
      st.textContent = S.codeChecking; st.className = 'hint'; btn.disabled = true;
      const r = await redeemCode($('#mcode').value).catch((e) => e);
      btn.disabled = false;
      if (!r || r instanceof Error) { st.textContent = redeemWhy(r); st.className = 'hint err'; return; }
      toast(S.unlocked); draw();
    });
    $$('[data-theme-pick]', body).forEach((b) => b.addEventListener('click', () => { setTheme(b.getAttribute('data-theme-pick')); $$('[data-theme-pick]', body).forEach((x) => x.classList.toggle('on', x === b)); }));
    // The tour opens here rather than throwing the visitor back to the home
    // screen. It sits above the row of buttons and closes from its own link.
    $('#retour').addEventListener('click', () => {
      const acts = $('.meacts', body);
      if ($('#tour', body)) { $('#tour', body).remove(); return; }
      acts.insertAdjacentHTML('beforebegin', tourHTML(0));
      bindTour(body, 0);
      $('#tour', body).scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    $$('[data-unblock]', body).forEach((b) => b.addEventListener('click', async () => {
      b.disabled = true;
      await MOD.unblock(b.getAttribute('data-unblock'));
      renderMe(args, params);
    }));
    const so = $('#signout'); if (so) so.addEventListener('click', () => BE.signOut());
    const da = $('#delacct'); if (da) da.addEventListener('click', async () => {
      if (!confirm(S.delConfirm)) return;
      da.disabled = true; const st = $('#delstatus'); st.textContent = S.sending;
      try { await BE.deleteAccount(); toast(S.delDone); location.hash = '#/home'; }
      catch (e) { da.disabled = false; if (e && e.code === 'auth/requires-recent-login') { st.textContent = S.delRelogin; st.className = 'hint err'; try { await BE.signOut(); } catch (e2) { /* already out */ } } else { st.textContent = S.publishFail + ': ' + (e && e.message || e); st.className = 'hint err'; } }
    });
    if (BE.enabled && BE.user) {
      /* Nabu's own profile has no chat box, so there is nothing to bind. */
      const chat = $('#chat');
      if (chat) {
      meUnsubs.push(BE.watchMessages(BE.user.uid, (msgs) => { chat.innerHTML = chatHTML(msgs, 'user'); chat.scrollTop = chat.scrollHeight; BE.markRead(BE.user.uid, 'user'); }));
      const sendUser = async (text, file, kind) => { let att = null; if (file) att = await chatAttachment(file, BE.user.uid, kind); await BE.sendMessage(text, null, att); };
      $('#msend').addEventListener('click', async () => { const t = $('#mtext').value.trim(); if (!t) return; $('#mtext').value = ''; try { await sendUser(t); } catch (e) { toast(e.message); } });
      bindChatBar(body, sendUser); }
      meUnsubs.push(BE.watchMyBookings((list) => {
        $('#mybk').innerHTML = list.length ? list.map((b) => bookingRow(b, false)).join('') : '<p class="hint">' + esc(S.noBookings) + '</p>';
        $$('[data-ics]', body).forEach((x) => x.addEventListener('click', () => { const bk = list.filter((y) => y.id === x.getAttribute('data-ics'))[0]; if (bk) addToCalendar(bk); }));
        /* Nabu can call one off from here too, behind a question. */
        $$('[data-bkoff]', body).forEach((x) => x.addEventListener('click', async () => {
          const bk = list.filter((y) => y.id === x.getAttribute('data-bkoff'))[0];
          if (!bk || !confirm(S.adminCancelAsk)) return;
          try { await BE.setBookingStatus(bk, 'cancelled'); toast(S.adminCancelDone); } catch (e) { toast(e.message); }
        }));
        $$('[data-cancel]', body).forEach((x) => x.addEventListener('click', async () => { const bk = list.filter((y) => y.id === x.getAttribute('data-cancel'))[0]; if (!bk || !confirm(S.confirmCancel)) return; try { await BE.requestCancel(bk); toast(S.cancelSent); } catch (e) { toast(e.message); } }));
        scheduleReminders(list);
      }));
    }
  };
  draw();
  if (BE.enabled) { const cb = () => { if (parseHash().route === 'me') { renderChrome('me'); draw(); } }; BE.listeners.push(cb); meUnsubs.push(() => { BE.listeners = BE.listeners.filter((x) => x !== cb); }); }
}
ROUTES.me = { nav: 'me', render: renderMe };
