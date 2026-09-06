/* ======================= the red thread =======================
   An old story says two people who are meant to meet are tied at the little
   finger by a red thread. It may tangle or stretch; it does not break.

   This is that, in the app: two people who both agree are shown as tied, with
   the day it began and the days since.

   Three rules shape everything here, and they are not decoration.

     Nothing is shown until both agree. A thread is offered by one and has to
     be accepted by the other. Until then it exists only as a request, which
     the sender can withdraw and the receiver can refuse.

     Anyone may untie alone, at any moment, without asking and without giving a
     reason. No app should be able to hold someone in a relationship.

     It is a keepsake, not a document. The page says so: nothing here carries
     legal weight anywhere.

   What other people can see is deliberately small - a chosen name, a handle,
   whether you are tied and since when. Not an email, not a birthday, not a
   location. And you are found only by someone typing your handle exactly, so
   this never becomes a directory of strangers to browse. */

const HANDLE_RE = /^[a-z0-9][a-z0-9._]{1,18}[a-z0-9]$/;
/* The token in an invitation link is the whole secret, so it is long enough
   that guessing one is hopeless and drawn from the machine's own randomness. */
const INVITE_ALPHABET = 'abcdefghijkmnpqrstuvwxyz23456789';
const INVITE_LEN = 16;
function loveToken() {
  const n = new Uint8Array(INVITE_LEN);
  (window.crypto || window.msCrypto).getRandomValues(n);
  let out = '';
  for (let i = 0; i < INVITE_LEN; i++) out += INVITE_ALPHABET[n[i] % INVITE_ALPHABET.length];
  return out;
}
function loveLink(token) {
  return location.origin + location.pathname + '#/love/join/' + token;
}
/* Copying is worth trying three ways: some phones refuse the clipboard unless
   the page is in the foreground, and some older ones have no clipboard at all.
   If none of them work the link is on screen to be held and copied by hand. */
async function copyText(text, field) {
  try { await navigator.clipboard.writeText(text); return true; } catch (e) { /* try the old way */ }
  try {
    if (field) { field.removeAttribute('readonly'); field.select(); field.setSelectionRange(0, 9999); }
    const done = document.execCommand && document.execCommand('copy');
    if (field) field.setAttribute('readonly', 'readonly');
    if (done) return true;
  } catch (e) { /* nothing left to try */ }
  return false;
}

const LOVE = {
  /* What this device remembers: the handle claimed and the bond last seen, so
     the screen and the badge can draw before the cloud answers. */
  local() { return store.get('nabu-love', {}) || {}; },
  save(o) { store.set('nabu-love', Object.assign(this.local(), o)); },
  handle() { return this.local().handle || ''; },
  /* The other person, from my side of a bond. */
  other(bond, uid) {
    if (!bond) return null;
    return bond.a === uid
      ? { uid: bond.b, name: bond.bName, handle: bond.bHandle }
      : { uid: bond.a, name: bond.aName, handle: bond.aHandle };
  },
  mine(bond, uid) {
    if (!bond) return null;
    return bond.a === uid
      ? { uid: bond.a, name: bond.aName, handle: bond.aHandle }
      : { uid: bond.b, name: bond.bName, handle: bond.bHandle };
  },
  days(bond) {
    if (!bond || !bond.since) return 0;
    const from = new Date(bond.since + 'T00:00:00');
    if (isNaN(from)) return 0;
    return Math.max(0, Math.floor((Date.now() - from.getTime()) / 86400000));
  },
  /* Round numbers worth noticing, and the next one coming. */
  marks: [7, 30, 100, 200, 365, 500, 730, 1000, 1461, 3650],
  nextMark(days) {
    const m = this.marks.filter((n) => n > days)[0];
    return m ? { at: m, inDays: m - days } : null;
  }
};

/* ---- the thread itself ----
   Two hands, little fingers reaching towards each other, and the knot between
   them. The knot beats slowly, because a thread that is alive is the point. */
function threadSVG(state, still) {
  const RED = '#D6314B', SOFT = '#F2789F', SKIN = '#F6DCC6', SKIN2 = '#E9C4A6';
  /* A closed hand with one finger out of it: the wrist coming in from the
     edge, the fist, the fingers curled along its lower edge, the thumb over
     them, and the little finger reaching to the middle with the thread wound
     twice round it. */
  const hand = (flip) => '<g transform="' + (flip ? 'translate(240,0) scale(-1,1)' : '') + '">'
    + '<path d="M0 98 L30 92 L34 144 L0 150 Z" fill="' + SKIN2 + '" opacity=".85"/>'
    + '<path d="M24 92 Q54 78 78 92 Q94 101 94 117 Q94 136 74 144 Q48 152 30 141 Q18 132 18 115 Q18 99 24 92 Z" fill="' + SKIN + '"/>'
    + '<g stroke="' + SKIN2 + '" stroke-width="2" fill="none" opacity=".55" stroke-linecap="round">'
    + '<path d="M42 148 q7 -15 3 -31 M60 150 q7 -15 3 -32 M78 143 q6 -13 2 -27"/></g>'
    + '<g stroke="' + SKIN2 + '" stroke-width="1.6" fill="none" opacity=".5" stroke-linecap="round">'
    + '<path d="M32 100 q9 -6 18 -2 M56 94 q9 -5 18 1"/></g>'
    + '<path d="M28 134 Q20 146 30 152 Q42 156 48 144 Q44 138 28 134 Z" fill="' + SKIN + '" stroke="' + SKIN2 + '" stroke-width="1.2"/>'
    + '<path d="M88 104 Q106 98 120 102 Q126 104 124 111 Q122 118 112 118 Q100 118 88 114 Z" fill="' + SKIN + '" stroke="' + SKIN2 + '" stroke-width="1.3"/>'
    + '<g stroke="' + RED + '" fill="none" stroke-linecap="round"><path d="M103 100 q5 9 0 18" stroke-width="2.6"/>'
    + '<path d="M110 100 q5 9 0 18" stroke-width="2.2" opacity=".9"/></g>'
    + '</g>';
  const knot = '<g class="knot' + (still ? '' : ' beat') + '">'
    + '<circle cx="120" cy="109" r="8.5" fill="' + RED + '"/><circle cx="120" cy="109" r="3.6" fill="' + SOFT + '"/>'
    + '<path d="M112 101 q8 -7 16 0 M112 117 q8 7 16 0" stroke="' + RED + '" stroke-width="3" fill="none" stroke-linecap="round"/>'
    + '</g>';
  const rings = state === 'married'
    ? '<g fill="none" stroke="#E5BE5E" stroke-width="3"><circle cx="107" cy="150" r="9"/><circle cx="133" cy="150" r="9"/></g>'
    : '';
  return '<svg viewBox="0 0 240 178" class="threadart" role="img" aria-hidden="true">'
    + '<ellipse cx="120" cy="168" rx="80" ry="7" fill="#C9A5D8" opacity=".2"/>'
    + hand(false) + hand(true)
    + '<path d="M120 114 q-26 22 -58 26" stroke="' + RED + '" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".55"/>'
    + '<path d="M120 114 q26 22 58 26" stroke="' + RED + '" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".55"/>'
    + knot + rings
    + '</svg>';
}

/* ---- the cloud side ----
   All of this needs an account, because it is about two people and the app has
   to know which two. */
const LOVEDB = {
  ok() { return !!(BE && BE.enabled && BE.db && BE.user); },
  me() { return BE.user ? BE.user.uid : ''; },
  /* A handle is claimed once and points at one account. The old one is given
     back so nobody has to hold a name they no longer use. */
  async claimHandle(handle, name) {
    const h = String(handle || '').toLowerCase().trim().replace(/^@/, '');
    if (!HANDLE_RE.test(h)) throw new Error('handle');
    const ref = BE.db.collection('handles').doc(h);
    const snap = await ref.get();
    if (snap.exists && snap.data().uid !== this.me()) throw new Error('taken');
    const old = LOVE.handle();
    const nm = String(name || '').slice(0, 24);
    await ref.set({ uid: this.me() });
    await BE.db.collection('people').doc(this.me()).set({ name: nm, handle: h }, { merge: true });
    if (old && old !== h) await BE.db.collection('handles').doc(old).delete().catch(() => {});
    LOVE.save({ handle: h, name: nm });
    return h;
  },
  async findByHandle(handle) {
    const h = String(handle || '').toLowerCase().trim().replace(/^@/, '');
    if (!HANDLE_RE.test(h)) return null;
    const snap = await BE.db.collection('handles').doc(h).get();
    if (!snap.exists) return null;
    const uid = snap.data().uid;
    if (uid === this.me()) return { uid: uid, self: true };
    const p = await BE.db.collection('people').doc(uid).get();
    const tied = await this.bondOf(uid);
    return Object.assign({ uid: uid, tied: !!tied }, p.exists ? p.data() : {});
  },
  async myPerson() {
    if (!this.ok()) return null;
    const d = await BE.db.collection('people').doc(this.me()).get();
    return d.exists ? d.data() : null;
  },
  /* A bond carries both people, so either side can draw the page without
     reading the other's card, and it is found from either side by the pair of
     ids it holds. */
  async bondOf(uid) {
    const s = await BE.db.collection('bonds').where('uids', 'array-contains', uid).limit(1).get();
    return s.docs.length ? Object.assign({ id: s.docs[0].id }, s.docs[0].data()) : null;
  },
  watchMine(cb) {
    if (!this.ok()) return () => {};
    return BE.db.collection('bonds').where('uids', 'array-contains', this.me()).limit(1)
      .onSnapshot((s) => cb(s.docs.length ? Object.assign({ id: s.docs[0].id }, s.docs[0].data()) : null), () => cb(null));
  },
  /* A request is one person offering, and carries who is offering so the other
     side sees a name without another read. */
  async offer(toUid, note) {
    const me = this.me(), mine = (await this.myPerson()) || {};
    await BE.db.collection('requests').doc(toUid).collection('from').doc(me).set({
      uid: me, name: mine.name || '', handle: mine.handle || LOVE.handle(),
      note: String(note || '').slice(0, 200), at: Date.now()
    });
  },
  watchRequests(cb) {
    if (!this.ok()) return () => {};
    return BE.db.collection('requests').doc(this.me()).collection('from')
      .onSnapshot((s) => cb(s.docs.map((d) => d.data())), () => cb([]));
  },
  async accept(req) {
    const me = this.me(), other = req.uid;
    if (await this.bondOf(other)) throw new Error('taken');
    const mine = (await this.myPerson()) || {};
    const pair = [me, other].sort();
    const bond = {
      uids: pair, a: pair[0], b: pair[1], state: 'tied',
      since: isoDate(new Date()), at: Date.now(),
      aName: pair[0] === me ? (mine.name || '') : (req.name || ''),
      bName: pair[1] === me ? (mine.name || '') : (req.name || ''),
      aHandle: pair[0] === me ? (mine.handle || '') : (req.handle || ''),
      bHandle: pair[1] === me ? (mine.handle || '') : (req.handle || '')
    };
    const id = pair.join('__');
    await BE.db.collection('bonds').doc(id).set(bond);
    await BE.db.collection('requests').doc(me).collection('from').doc(other).delete().catch(() => {});
    LOVE.save({ bond: id, since: bond.since, withName: (LOVE.other(bond, me) || {}).name || '' });
    return id;
  },
  /* A link, rather than a name typed into a box. It carries who is asking so
     the other end can show a name before they have an account at all. */
  async makeInvite() {
    const mine = (await this.myPerson()) || {};
    const t = loveToken();
    await BE.db.collection('invites').doc(t).set({
      from: this.me(), name: mine.name || '', handle: mine.handle || LOVE.handle(), at: Date.now()
    });
    LOVE.save({ invite: t });
    return t;
  },
  async readInvite(token) {
    const t = String(token || '').trim();
    if (!t || t.length > 40) return null;
    const d = await BE.db.collection('invites').doc(t).get();
    return d.exists ? Object.assign({ token: d.id }, d.data()) : null;
  },
  /* Taking the thread from a link is the same act as accepting an invitation
     inside the app, and the server checks it the same way: the bond names the
     link it came from, and the link says who made it. */
  async acceptInvite(inv) {
    const me = this.me(), other = inv.from;
    if (!other || other === me) throw new Error('self');
    if (await this.bondOf(me)) throw new Error('mine');
    if (await this.bondOf(other)) throw new Error('taken');
    const mine = (await this.myPerson()) || {};
    const pair = [me, other].sort();
    const bond = {
      uids: pair, a: pair[0], b: pair[1], state: 'tied', invite: inv.token,
      since: isoDate(new Date()), at: Date.now(),
      aName: pair[0] === me ? (mine.name || '') : (inv.name || ''),
      bName: pair[1] === me ? (mine.name || '') : (inv.name || ''),
      aHandle: pair[0] === me ? (mine.handle || '') : (inv.handle || ''),
      bHandle: pair[1] === me ? (mine.handle || '') : (inv.handle || '')
    };
    await BE.db.collection('bonds').doc(pair.join('__')).set(bond);
    await BE.db.collection('invites').doc(inv.token).delete().catch(() => {});
    LOVE.save({ bond: pair.join('__'), since: bond.since, join: '', invite: '',
      withName: (LOVE.other(bond, me) || {}).name || '' });
    return pair.join('__');
  },
  async decline(fromUid) {
    await BE.db.collection('requests').doc(this.me()).collection('from').doc(fromUid).delete().catch(() => {});
  },
  /* The day it began can be moved back to the day it really began, by either
     of them, and never forward past today. */
  async setSince(id, iso) {
    await BE.db.collection('bonds').doc(id).update({ since: iso });
    LOVE.save({ since: iso });
  },
  /* Untying is one person's decision and needs nobody's permission. */
  async untie(id) {
    await BE.db.collection('bonds').doc(id).delete();
    LOVE.save({ bond: '', since: '', withName: '' });
  }
};

/* The little tag that says where someone stands, drawn from what this device
   already knows so it costs nothing to show. */
function loveBadgeHTML() {
  const S = T(), l = LOVE.local();
  /* Someone opened an invitation link and then went off to make an account.
     This is how they find their way back to it. */
  if (!l.bond && l.join) {
    return '<a class="lovetag waiting" href="#/love/join/' + esc(l.join) + '"><span class="k">💌</span>'
      + '<b>' + esc(S.loveJoinWaiting) + '</b><span class="d">' + esc(S.loveJoinOpen) + ' ›</span></a>';
  }
  if (!l.bond) return '';
  return '<a class="lovetag" href="#/love"><span class="k">🧵</span><b>' + esc(S.loveTagTied) + '</b>'
    + (l.withName ? '<span class="w">' + esc(l.withName) + '</span>' : '')
    + '<span class="d">' + esc(S.loveDaysN(LOVE.days({ since: l.since }))) + '</span></a>';
}

/* ---- the screen ---- */
function renderLove(wantHandle) {
  const S = T(), m = $('#main');
  let stop = [], forceHandle = !!wantHandle;
  const cleanup = () => { stop.forEach((f) => { try { f(); } catch (e) { /* already gone */ } }); stop = []; };
  NAV.cleanup = cleanup;

  const head = () => '<div class="eyebrow">' + esc(CONFIG.brand) + '</div><h1 style="margin-bottom:6px">🧵 ' + esc(S.loveTitle) + '</h1>'
    + '<p class="muted">' + esc(S.loveIntro) + '</p>';
  const foot = () => '<p class="hint" style="margin-top:16px">' + esc(S.loveNote) + '</p>';

  const drawGuest = () => {
    m.innerHTML = head()
      + '<div class="card lovecard">' + threadSVG('tied', true)
      + '<p class="lead">' + esc(S.loveNeedAccount) + '</p>'
      + '<a class="btn primary block" href="#/me">' + esc(S.signIn) + '</a></div>' + foot();
  };

  const drawHandle = (err) => {
    m.innerHTML = head()
      + '<div class="card"><h3 style="margin-bottom:4px">' + esc(S.loveHandleTitle) + '</h3>'
      + '<p class="hint" style="margin-bottom:10px">' + esc(S.loveHandleHint) + '</p>'
      + '<label class="f" for="lvname">' + esc(S.loveYourName) + '</label>'
      + '<input id="lvname" maxlength="24" value="' + esc(LOVE.local().name || PROFILE.name || '') + '">'
      + '<label class="f" for="lvhandle" style="margin-top:10px">' + esc(S.loveHandle) + '</label>'
      + '<div class="row nw athandle"><span class="at">@</span><input id="lvhandle" maxlength="20" autocapitalize="none" spellcheck="false" value="' + esc(LOVE.handle()) + '"></div>'
      + '<button type="button" class="btn primary block" id="lvsave" style="margin-top:12px">' + esc(S.loveClaim) + '</button>'
      + '<p class="hint' + (err ? ' err' : '') + '" id="lvstatus">' + esc(err || '') + '</p></div>' + foot();
    $('#lvsave').addEventListener('click', async () => {
      const b = $('#lvsave'), st = $('#lvstatus');
      const h = $('#lvhandle').value.toLowerCase().replace(/^@/, '').trim();
      if (!HANDLE_RE.test(h)) { drawHandle(S.loveHandleBad); return; }
      b.disabled = true; st.className = 'hint'; st.textContent = S.loveSaving;
      try { await LOVEDB.claimHandle(h, $('#lvname').value.trim()); forceHandle = false; draw(); }
      catch (e) { drawHandle(e.message === 'taken' ? S.loveHandleTaken : e.message === 'handle' ? S.loveHandleBad : S.publishFail); }
    });
  };

  const drawSingle = (reqs) => {
    const list = reqs || [];
    m.innerHTML = head()
      + '<div class="card lovecard">' + threadSVG('tied', true)
      + '<p class="lead">' + esc(S.loveSingle) + '</p>'
      + '<p class="hint" style="text-align:center">' + esc(S.loveYouAre) + ' <b>@' + esc(LOVE.handle()) + '</b></p></div>'
      + (list.length
        ? '<div class="sec"><div class="eyebrow">' + esc(S.loveRequests) + '</div>'
          + list.map((r) => '<div class="card reqcard"><b>' + esc(r.name || ('@' + r.handle)) + '</b>'
            + '<span class="faint">@' + esc(r.handle || '') + '</span>'
            + (r.note ? '<p class="note">' + esc(r.note) + '</p>' : '')
            + '<div class="row2"><button type="button" class="btn primary" data-accept="' + esc(r.uid) + '">' + esc(S.loveAccept) + '</button>'
            + '<button type="button" class="btn" data-decline="' + esc(r.uid) + '">' + esc(S.loveDecline) + '</button></div></div>').join('')
          + '</div>'
        : '')
      + '<div class="card"><h3 style="margin-bottom:4px">' + esc(S.loveFindTitle) + '</h3>'
      + '<p class="hint" style="margin-bottom:10px">' + esc(S.loveFindHint) + '</p>'
      + '<div class="row nw athandle"><span class="at">@</span><input id="lvfind" maxlength="20" autocapitalize="none" spellcheck="false" placeholder="' + esc(S.loveHandlePh) + '"><button type="button" class="btn" id="lvgo">' + esc(S.loveFind) + '</button></div>'
      + '<div id="lvfound"></div><p class="hint" id="lvfstatus"></p></div>'
      + '<div class="card invitecard"><h3 style="margin-bottom:4px">💌 ' + esc(S.loveInviteTitle) + '</h3>'
      + '<p class="hint" style="margin-bottom:10px">' + esc(S.loveInviteHint) + '</p>'
      + '<div id="lvlink"></div></div>'
      + '<p><a class="backlink" href="#/love/handle">' + esc(S.loveChangeHandle) + '</a></p>'
      + foot();

    /* One link at a time, kept on the phone, so it can be copied again later
       rather than making a new one every time the screen is opened. */
    const showLink = (t) => {
      const url = loveLink(t), box = $('#lvlink');
      box.innerHTML = '<p class="hint ok">' + esc(S.loveLinkReady) + '</p>'
        + '<input id="lvurl" readonly value="' + esc(url) + '">'
        + '<div class="row2"><button type="button" class="btn primary" id="lvcopy">' + esc(S.loveCopy) + '</button>'
        + '<button type="button" class="btn" id="lvsend">' + esc(navigator.share ? S.loveShare : S.loveNewLink) + '</button></div>'
        + '<p class="hint" id="lvcopyst"></p>';
      $('#lvcopy').addEventListener('click', async () => {
        const st = $('#lvcopyst');
        const done = await copyText(url, $('#lvurl'));
        st.className = done ? 'hint ok' : 'hint';
        st.textContent = done ? S.loveCopied : S.loveCopyFail;
      });
      $('#lvsend').addEventListener('click', async () => {
        if (navigator.share) { try { await navigator.share({ title: S.loveTitle, text: S.loveShareText, url: url }); } catch (e) { /* they changed their mind */ } return; }
        await makeLink(true);
      });
    };
    const makeLink = async (fresh) => {
      const box = $('#lvlink');
      const kept = LOVE.local().invite;
      if (kept && !fresh) { showLink(kept); return; }
      box.innerHTML = '<p class="hint">' + esc(S.loveSaving) + '</p>';
      try { showLink(await LOVEDB.makeInvite()); }
      catch (e) { box.innerHTML = '<p class="hint err">' + esc(S.publishFail) + '</p>'; }
    };
    if (LOVE.local().invite) showLink(LOVE.local().invite);
    else $('#lvlink').innerHTML = '<button type="button" class="btn primary block" id="lvmake">🔗 ' + esc(S.loveMakeLink) + '</button>';
    { const mk = $('#lvmake'); if (mk) mk.addEventListener('click', () => makeLink(false)); }

    $$('[data-accept]', m).forEach((b) => b.addEventListener('click', async () => {
      const r = list.filter((x) => x.uid === b.getAttribute('data-accept'))[0];
      if (!r || !confirm(S.loveAcceptAsk(r.name || ('@' + r.handle)))) return;
      b.disabled = true;
      try { await LOVEDB.accept(r); toast(S.loveTied); }
      catch (e) { toast(e.message === 'taken' ? S.loveTheyTied : S.publishFail); b.disabled = false; }
    }));
    $$('[data-decline]', m).forEach((b) => b.addEventListener('click', async () => {
      b.disabled = true;
      await LOVEDB.decline(b.getAttribute('data-decline'));
    }));
    $('#lvgo').addEventListener('click', async () => {
      const st = $('#lvfstatus'), out = $('#lvfound');
      out.innerHTML = ''; st.className = 'hint'; st.textContent = S.loveLooking;
      let who = null;
      try { who = await LOVEDB.findByHandle($('#lvfind').value); } catch (e) { who = null; }
      /* Nobody by that name is almost never a typo - it is someone who has
         never opened this app. Saying so, and handing over the thing that
         helps, beats a dead end. */
      if (!who) {
        st.textContent = '';
        out.innerHTML = '<div class="card reqcard nothere"><b>' + esc(S.loveNotHere) + '</b>'
          + '<p class="note">' + esc(S.loveNotHereWhy) + '</p>'
          + '<button type="button" class="btn primary block" id="lvmake2" style="margin-top:10px">💌 ' + esc(S.loveMakeLink) + '</button></div>';
        $('#lvmake2').addEventListener('click', async () => {
          await makeLink(false);
          const c = $('.invitecard');
          if (c && c.scrollIntoView) c.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
        return;
      }
      if (who.self) { st.className = 'hint err'; st.textContent = S.loveThatsYou; return; }
      st.textContent = '';
      out.innerHTML = '<div class="card reqcard found"><b>' + esc(who.name || ('@' + who.handle)) + '</b><span class="faint">@' + esc(who.handle || '') + '</span>'
        + (who.tied ? '<p class="hint">' + esc(S.loveAlreadyTied) + '</p>'
          : '<label class="f" for="lvnote" style="margin-top:8px">' + esc(S.loveNoteLabel) + '</label>'
            + '<input id="lvnote" maxlength="200" placeholder="' + esc(S.loveNotePh) + '">'
            + '<button type="button" class="btn primary block" id="lvoffer" style="margin-top:10px">🧵 ' + esc(S.loveOffer) + '</button>')
        + '</div>';
      const off = $('#lvoffer');
      if (off) off.addEventListener('click', async () => {
        off.disabled = true;
        try { await LOVEDB.offer(who.uid, $('#lvnote').value); st.className = 'hint ok'; st.textContent = S.loveOffered; }
        catch (e) { st.className = 'hint err'; st.textContent = S.publishFail; off.disabled = false; }
      });
    });
  };

  const drawBond = (bond) => {
    const me = LOVEDB.me(), you = LOVE.other(bond, me), mine = LOVE.mine(bond, me);
    const days = LOVE.days(bond), next = LOVE.nextMark(days);
    const nameOf = (p) => (p && (p.name || (p.handle ? '@' + p.handle : ''))) || S.loveSomeone;
    m.innerHTML = head()
      + '<div class="card lovecard tied">' + threadSVG(bond.state)
      + '<div class="pair"><span>' + esc(nameOf(mine)) + '</span><i>🧵</i><span>' + esc(nameOf(you)) + '</span></div>'
      + '<div class="daysbig"><b>' + days + '</b><span>' + esc(S.loveDaysWord) + '</span></div>'
      + '<p class="since">' + esc(S.loveSince(fmtDate(bond.since))) + '</p>'
      + (next ? '<p class="hint" style="text-align:center">' + esc(S.loveNextMark(next.at, next.inDays)) + '</p>' : '')
      + '</div>'
      + '<div class="card"><h3 style="margin-bottom:6px">' + esc(S.loveDayTitle) + '</h3>'
      + '<p class="hint" style="margin-bottom:8px">' + esc(S.loveDayHint) + '</p>'
      + '<input type="date" id="lvsince" max="' + esc(isoDate(new Date())) + '" value="' + esc(bond.since || '') + '">'
      + '<p class="hint" id="lvsincest"></p></div>'
      + '<div class="card"><h3 style="margin-bottom:6px">' + esc(S.loveNextTitle) + '</h3><p class="hint">' + esc(S.loveNextSoon) + '</p></div>'
      + '<button type="button" class="btn block" id="lvuntie">' + esc(S.loveUntie) + '</button>'
      + '<p class="hint">' + esc(S.loveUntieHint) + '</p>'
      + foot();
    $('#lvsince').addEventListener('change', async () => {
      const st = $('#lvsincest'), v = $('#lvsince').value;
      if (!v || v > isoDate(new Date())) { st.className = 'hint err'; st.textContent = S.loveDayBad; return; }
      st.className = 'hint'; st.textContent = S.loveSaving;
      try { await LOVEDB.setSince(bond.id, v); st.className = 'hint ok'; st.textContent = S.loveDaySaved; }
      catch (e) { st.className = 'hint err'; st.textContent = S.publishFail; }
    });
    $('#lvuntie').addEventListener('click', async () => {
      if (!confirm(S.loveUntieAsk)) return;
      try { await LOVEDB.untie(bond.id); toast(S.loveUntied); } catch (e) { toast(S.publishFail); }
    });
  };

  const draw = async () => {
    cleanup();
    if (!LOVEDB.ok()) { drawGuest(); return; }
    let person = null;
    try { person = await LOVEDB.myPerson(); } catch (e) { person = null; }
    if (person) LOVE.save({ handle: person.handle || '', name: person.name || '' });
    if (forceHandle || !LOVE.handle()) { drawHandle(); return; }
    /* Two listeners, one screen: the bond decides which half is drawn, and
       either of them arriving repaints it. */
    let reqs = [], bond = null, ready = false;
    const paint = () => { if (!ready) return; if (bond) drawBond(bond); else drawSingle(reqs); };
    stop.push(LOVEDB.watchMine((b) => {
      bond = b; ready = true;
      LOVE.save(b ? { bond: b.id, since: b.since, withName: (LOVE.other(b, LOVEDB.me()) || {}).name || '' } : { bond: '', since: '', withName: '' });
      paint();
    }));
    stop.push(LOVEDB.watchRequests((l) => { reqs = l; paint(); }));
  };
  draw();
}

/* ---- the other end of a link ----
   Whoever opens this may have no account at all, so it says who is asking
   before it asks anything of them, and it remembers the invitation while they
   go and sign up. */
function renderLoveJoin(token) {
  const S = T(), m = $('#main'), t = String(token || '');
  const shell = (inner) => {
    m.innerHTML = '<div class="eyebrow">' + esc(CONFIG.brand) + '</div>'
      + '<h1 style="margin-bottom:6px">💌 ' + esc(S.loveJoinTitle) + '</h1>' + inner
      + '<p class="hint" style="margin-top:16px">' + esc(S.loveNote) + '</p>';
  };
  const gone = () => {
    LOVE.save({ join: '' });
    shell('<div class="card lovecard">' + threadSVG('tied', true)
      + '<p class="lead">' + esc(S.loveJoinGone) + '</p>'
      + '<a class="btn block" href="#/love">' + esc(S.loveTitle) + '</a></div>');
  };
  (async () => {
    if (!t) { gone(); return; }
    LOVE.save({ join: t });
    shell('<div class="card lovecard">' + threadSVG('tied', true) + '<p class="lead">' + esc(S.loveLooking) + '</p></div>');
    if (!(BE && BE.enabled && BE.db)) { gone(); return; }
    let inv = null;
    try { inv = await LOVEDB.readInvite(t); } catch (e) { inv = null; }
    if (!inv) { gone(); return; }
    const who = inv.name || (inv.handle ? '@' + inv.handle : S.loveSomeone);
    const card = (body) => shell('<div class="card lovecard">' + threadSVG('tied', true)
      + '<div class="pair"><span>' + esc(who) + '</span><i>🧵</i><span>' + esc(S.loveYou) + '</span></div>'
      + '<p class="lead">' + esc(S.loveJoinFrom(who)) + '</p>' + body + '</div>');
    if (!BE.user) {
      card('<p class="hint">' + esc(S.loveJoinSignIn) + '</p><a class="btn primary block" href="#/me">' + esc(S.signIn) + '</a>');
      return;
    }
    if (inv.from === BE.user.uid) {
      card('<p class="hint">' + esc(S.loveJoinYours) + '</p><a class="btn block" href="#/love">' + esc(S.loveTitle) + '</a>');
      return;
    }
    if (!LOVE.handle()) {
      let p = null;
      try { p = await LOVEDB.myPerson(); } catch (e) { p = null; }
      if (p && p.handle) LOVE.save({ handle: p.handle, name: p.name || '' });
    }
    if (!LOVE.handle()) {
      card('<p class="hint">' + esc(S.loveJoinNeedName) + '</p><a class="btn primary block" href="#/love">' + esc(S.loveClaim) + '</a>');
      return;
    }
    card('<button type="button" class="btn primary block" id="lvtake">🧵 ' + esc(S.loveJoinTake) + '</button><p class="hint" id="lvtakest"></p>');
    $('#lvtake').addEventListener('click', async () => {
      const b = $('#lvtake'), st = $('#lvtakest');
      b.disabled = true; st.className = 'hint'; st.textContent = S.loveSaving;
      try { await LOVEDB.acceptInvite(inv); toast(S.loveTied); location.hash = '#/love'; }
      catch (e) {
        st.className = 'hint err';
        st.textContent = e.message === 'mine' ? S.loveAlreadyMine : e.message === 'taken' ? S.loveTheyTied : S.publishFail;
        b.disabled = false;
      }
    });
  })();
}

ROUTES.love = {
  nav: 'play',
  render: (args) => {
    const a = (args && args[0]) || '';
    if (a === 'join') return renderLoveJoin(args[1]);
    return renderLove(a === 'handle');
  }
};
