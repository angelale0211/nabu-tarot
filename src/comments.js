/* ============================ comments ============================
   A flat list under a post, a poll or a pile reading. Anyone reads; a
   signed-in person writes; the writer or Nabu deletes. One document per
   comment in comments/ - firestore.rules caps every field and stamps the
   time on the server. The wish jar has none: its own copy promises that a
   wish stays on the phone and nobody reads it.

   Reads are live (onSnapshot) only on the page that shows the list, and the
   router drops the listener when the page is left (NAV.cleanup). The feed
   shows a count per card from an aggregation query, kept for the session in
   CMT.counts so a card is not counted twice. No query here combines where()
   with orderBy() on another field: that needs a composite index the owner
   would have to make in the console by hand. */
const CMT_MAX = 600;
/* A card in the feed counts up to a hundred, then says 99+. */
const CMT_CAP = 100;
/* When a comment happened, as milliseconds. A row the server has not
   stamped yet - just written, or written offline - counts as newest. */
const cmtMs = (c) => (c && c.at && typeof c.at.toMillis === 'function') ? c.at.toMillis()
  : (typeof (c && c.at) === 'number' ? c.at : Number.MAX_SAFE_INTEGER);
const CMT = {
  counts: {},
  key(kind, id) { return kind + ':' + String(id || ''); },
  /* What may carry comments: any feed post except the note that introduces
     Nabu Tarot (the same `welcome` flag the feed uses to set it apart), and
     the two activity kinds people take part in together. */
  allowed(kind, item) {
    if (!item || !item.id) return false;
    if (kind === 'post') return !item.welcome;
    if (kind === 'act') return item.type === 'poll' || item.type === 'pile';
    return false;
  },
  ok() { return !!(typeof BE !== 'undefined' && BE.enabled && BE.db); },
  col() { return BE.db.collection('comments'); },
  /* The shown name is the name the person typed for their profile and
     nothing else: never the login email, never the uid, never the provider's
     photo. Signing in with Google or Facebook copies the account's full name
     into a profile that has none yet (backend.js), so a profile name equal to
     that one is not published; nor one with an @ in it, which is an address
     and which the rules refuse; nor one that would pass for Nabu. What is
     left goes out as "Bạn đọc". Nabu signs as Nabu. */
  myName() {
    if (BE.isAdmin()) return 'Nabu';
    const fold = (s) => String(s || '').replace(/\s+/g, ' ').trim().toLowerCase();
    const full = String((typeof PROFILE !== 'undefined' && PROFILE.name) || '').trim();
    const given = BE.user && BE.user.displayName ? fold(BE.user.displayName) : '';
    if (!full || (given && fold(full) === given) || full.indexOf('@') > -1 || /nabu/i.test(full)) return T().cmtSomeone;
    return full.slice(0, 40);
  },
  async add(key, text) {
    if (!this.ok() || !BE.user) throw new Error('signin');
    const t = String(text || '').trim();
    if (!t) throw new Error('empty');
    if (t.length > CMT_MAX) throw new Error('long');
    await this.col().add({ on: key, uid: BE.user.uid, name: this.myName(), text: t, nabu: BE.isAdmin(),
      at: firebase.firestore.FieldValue.serverTimestamp() });
  },
  remove(id) { return this.col().doc(id).delete(); },
  watch(key, cb) {
    return this.col().where('on', '==', key).onSnapshot((s) => {
      const rows = (s.docs || []).map((d) => Object.assign({ id: d.id }, d.data()));
      rows.sort((a, b) => cmtMs(a) - cmtMs(b));
      this.counts[key] = rows.length;
      cb(rows);
    }, () => cb(null));
  },
  async count(key) {
    if (!this.ok()) return null;
    if (this.counts[key] != null) return this.counts[key];
    /* The Firebase SDK the app loads has no count() on a query, so the number
       is read from the comments themselves - never more than the card shows. */
    try {
      const q = this.col().where('on', '==', key);
      const n = typeof q.count === 'function' ? (await q.count().get()).data().count : (await q.limit(CMT_CAP).get()).docs.length;
      this.counts[key] = n;
      return n;
    } catch (e) { return null; }
  }
};
function cmtCountText(n) { return !n ? '' : (n >= CMT_CAP ? (CMT_CAP - 1) + '+' : String(n)); }
/* A page that shows comments holds one listener. A link opened cold is routed
   more than once before it settles, and each pass that finishes would leave
   its own listener behind; the one that finishes last stops the one before. */
function cmtHold(stop) {
  if (!stop) return;
  if (NAV.cleanup) { const c = NAV.cleanup; NAV.cleanup = null; try { c(); } catch (e) { /* already gone */ } }
  NAV.cleanup = stop;
}
function cmtWhen(c) {
  const S = T(), ms = cmtMs(c);
  if (ms === Number.MAX_SAFE_INTEGER) return S.cmtJustNow;
  const d = new Date(ms);
  return S.dateShort(d) + ' ' + pad2(d.getHours()) + ':' + pad2(d.getMinutes());
}
function cmtRowHTML(c) {
  const S = T(), me = BE.user ? BE.user.uid : '';
  const mine = !!me && c.uid === me, canDel = mine || BE.isAdmin();
  return '<li class="cmt' + (mine ? ' me' : '') + (c.nabu ? ' nabu' : '') + '" data-cmt="' + esc(c.id) + '">'
    + '<b>' + esc(c.nabu ? 'Nabu' : (c.name || S.cmtSomeone)) + (c.nabu ? ' <span class="nabutag">✦ ' + esc(S.cmtAuthor) + '</span>' : '') + '</b>'
    + '<span class="cmttext">' + esc(c.text || '') + '</span>'
    + '<span class="when">' + esc(cmtWhen(c)) + '</span>'
    + (canDel ? '<button type="button" class="linkbtn cmtdel" data-cmtdel="' + esc(c.id) + '">' + esc(S.cmtDelete) + '</button>' : '')
    + (me && !mine && !c.nabu && c.uid
      ? '<button type="button" class="flagb" data-flag="' + esc(c.uid) + '" data-flagname="' + esc(c.name || '')
        + '" data-flagtext="' + esc(String(c.text || '').slice(0, 200)) + '" title="' + esc(S.modReport) + '" aria-label="' + esc(S.modReport) + '">⚑</button>'
      : '')
    + '</li>';
}
/* The writing box. Above Send, the name the comment will carry, from the
   same rule that publishes it, and the way to change it; under the box, that
   comments are public. */
function cmtFormHTML() {
  const S = T();
  return '<div class="cmtform"><textarea class="cmtin" maxlength="' + CMT_MAX + '" placeholder="' + esc(S.cmtPh) + '"></textarea>'
    + '<p class="hint cmtas">' + esc(S.cmtAs) + ' <b>' + esc(CMT.myName()) + '</b>'
    + (BE.isAdmin() ? '' : ' <a class="linkbtn" href="#/me">' + esc(S.cmtRename) + '</a>') + '</p>'
    + '<div class="row"><button type="button" class="btn primary" data-cmtsend>' + esc(S.cmtSend) + '</button><span class="hint cmtst"></span></div>'
    + '<p class="hint cmtpublic">' + esc(S.cmtPublic) + '</p></div>';
}
/* Before a first comment, the comment rules stand where the box would be, and
   one tap agrees to them for good on this phone. Google Play asks that people
   accept terms before they post. The card is the wedding room's terms card.
   Nabu is not asked: the rules are hers. */
function cmtAgreed() { return BE.isAdmin() || !!store.get('nabu-cmt-ok', 0); }
function cmtRulesHTML() {
  const S = T();
  return '<div class="card termscard cmtrules"><div class="ghead"><span class="gk">📜</span><h3>' + esc(S.cmtRulesTitle) + '</h3></div>'
    + '<ol class="terms">' + S.cmtRules.map((r) => '<li>' + esc(r) + '</li>').join('') + '</ol>'
    + '<button type="button" class="btn primary block" data-cmtagree>' + esc(S.cmtAgree) + '</button></div>';
}
/* The block under a post or an activity: heading with the count, the list,
   the report box, and then the writing box, the rules to agree to first, or -
   signed out - one line that says sign in, with the link. Never a dead box. */
function cmtBoxHTML(key) {
  const S = T();
  return '<section class="cmts" data-cmts="' + esc(key) + '"><h3>💬 ' + esc(S.cmtTitle) + ' <span class="n" data-cmtn-head hidden></span></h3>'
    + '<ul class="saylist cmtlist"><li class="hint">…</li></ul>'
    + '<div class="flagbox" data-cmtflag hidden></div>'
    + (BE.enabled && BE.user
      ? (cmtAgreed() ? cmtFormHTML() : cmtRulesHTML())
      : (BE.enabled ? '<p class="hint cmtsignin">' + esc(S.cmtSignIn) + ' <a href="' + esc(signinHref()) + '">' + esc(S.signIn) + '</a></p>' : ''))
    + '</section>';
}
/* Report or block, the same box the wedding room uses (wedding.js). */
function cmtFlag(fb, b, key, repaint) {
  const S = T();
  const uid = b.getAttribute('data-flag'), who = b.getAttribute('data-flagname') || S.cmtSomeone, said = b.getAttribute('data-flagtext') || '';
  fb.hidden = false;
  fb.innerHTML = '<p class="hint">' + esc(S.modAbout(who)) + '</p>'
    + '<div class="row"><button type="button" class="btn sm" id="flagrep">⚑ ' + esc(S.modReport) + '</button>'
    + '<button type="button" class="btn sm danger" id="flagblk">🚫 ' + esc(S.modBlock) + '</button>'
    + '<button type="button" class="btn sm" id="flagno">' + esc(S.loveCancel) + '</button></div>';
  fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  $('#flagno', fb).addEventListener('click', () => { fb.hidden = true; fb.innerHTML = ''; });
  $('#flagrep', fb).addEventListener('click', async () => {
    $('#flagrep', fb).disabled = true;
    try { await MOD.report({ kind: 'comment', where: key, about: uid, aboutName: who, text: said }); fb.innerHTML = '<p class="hint">' + esc(S.modReported) + '</p>'; }
    catch (e) { fb.innerHTML = '<p class="hint err">' + esc(e && e.message === 'signin' ? S.cmtSignIn : loveWhy(e)) + '</p>'; }
  });
  $('#flagblk', fb).addEventListener('click', async () => {
    $('#flagblk', fb).disabled = true;
    await MOD.block(uid);
    fb.hidden = true; fb.innerHTML = '';
    toast(S.modBlocked(who));
    repaint();
  });
}
/* Wires the block: the live list, delete in two taps, the flag, and sending.
   Returns the function that stops the listener, for NAV.cleanup. */
function cmtMount(root, key) {
  const S = T(), box = $('[data-cmts="' + key + '"]', root); if (!box) return null;
  const list = $('.cmtlist', box), head = $('[data-cmtn-head]', box), fb = $('[data-cmtflag]', box);
  if (!CMT.ok()) { list.innerHTML = '<li class="hint">' + esc(S.cmtOffline) + '</li>'; return null; }
  let rows = [];
  const paint = () => {
    /* The list is the wedding room's box that scrolls (wedding.js): it opens
       on the newest line and follows new ones, unless the reader has scrolled
       up to read the older ones. */
    const near = list.scrollHeight - list.scrollTop - list.clientHeight < 60;
    const shown = MOD.keep(rows, (r) => r.uid);
    list.innerHTML = shown.length ? shown.map(cmtRowHTML).join('') : '<li class="hint">' + esc(S.cmtNone) + '</li>';
    if (near) list.scrollTop = list.scrollHeight;
    head.hidden = !shown.length; head.textContent = String(shown.length);
    $$('[data-cmtdel]', list).forEach((b) => b.addEventListener('click', async () => {
      if (!b.getAttribute('data-sure')) { b.setAttribute('data-sure', '1'); b.textContent = S.cmtDeleteSure; return; }
      b.disabled = true;
      try { await CMT.remove(b.getAttribute('data-cmtdel')); toast(S.cmtDeleted); }
      catch (e) { b.disabled = false; toast(loveWhy(e)); }
    }));
    $$('[data-flag]', list).forEach((b) => b.addEventListener('click', () => cmtFlag(fb, b, key, paint)));
  };
  const stop = CMT.watch(key, (r) => {
    if (r === null) { list.innerHTML = '<li class="hint">' + esc(S.cmtOffline) + '</li>'; return; }
    rows = r; paint();
  });
  /* The box is wired whenever it is on the page: at once, or once the rules
     have been agreed to. */
  const bindForm = () => {
    const send = $('[data-cmtsend]', box), ta = $('.cmtin', box), st = $('.cmtst', box);
    if (!send) return null;
    send.addEventListener('click', async () => {
      const text = (ta.value || '').trim();
      if (!text) { st.textContent = S.cmtEmpty; ta.focus(); return; }
      if (text.length > CMT_MAX) { st.textContent = S.cmtTooLong; return; }
      send.disabled = true; st.textContent = '';
      /* Offline, the write waits in the phone's queue and the listener has
         already drawn the line; the button must not wait with it. A refusal
         that comes later still has to be heard: the words go back into the
         box (unless something new is being written there) and the reason is
         said. */
      let refused = false;
      const write = CMT.add(key, text);
      write.catch((e) => {
        refused = true;
        if (!ta.value.trim()) ta.value = text;
        st.textContent = e && e.message === 'signin' ? S.cmtSignIn : loveWhy(e);
      });
      try {
        await Promise.race([write, new Promise((r) => setTimeout(r, 2500))]);
        if (!refused) { ta.value = ''; toast(S.cmtSent); }
      } catch (e) { /* said by the catch above */ }
      send.disabled = false;
    });
    return ta;
  };
  bindForm();
  const agree = $('[data-cmtagree]', box);
  if (agree) agree.addEventListener('click', () => {
    store.set('nabu-cmt-ok', Date.now());
    const card = $('.cmtrules', box); if (!card) return;
    card.outerHTML = cmtFormHTML();
    const ta = bindForm(); if (ta) ta.focus();
  });
  return stop;
}
/* The number on each card in the feed. Asked once per card per session. */
function cmtFillCounts(root) {
  $$('[data-cmtn]', root).forEach((el) => {
    CMT.count(el.getAttribute('data-cmtn')).then((n) => { const s = $('span', el); if (s) s.textContent = cmtCountText(n); });
  });
}
