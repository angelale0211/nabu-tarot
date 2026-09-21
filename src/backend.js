/* ============================ backend ============================
   Accounts, profiles, messages and bookings live in Firebase (Auth +
   Firestore) when CONFIG.firebase is set. Without it, BE.enabled is false and
   every screen falls back to the device-only profile and to Instagram.
   The SDK is loaded on demand so the app shell stays offline-capable. */
/* Mail the booking to Nabu as a calendar invitation (through the worker). Best effort. */
function notifyBooking(b) {
  if (!CONFIG.bookingEndpoint) return Promise.resolve();
  return fetch(CONFIG.bookingEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ booking: b, tz: CONFIG.timezone, to: CONFIG.adminNotifyEmails, lang: lang }) }).catch(() => {});
}
const BE = {
  enabled: !!CONFIG.firebase,
  ready: false, user: null, db: null, auth: null,
  listeners: [],
  onAuth(cb) { this.listeners.push(cb); if (this.ready) cb(this.user); },
  isAdmin() { return !!(this.user && this.user.email && CONFIG.adminEmails.indexOf(this.user.email.toLowerCase()) > -1); },

  async init() {
    if (!this.enabled) return;
    const V = '10.14.1';
    for (const f of ['firebase-app-compat.js', 'firebase-auth-compat.js', 'firebase-firestore-compat.js'].concat(CONFIG.attachments ? ['firebase-storage-compat.js'] : [])) {
      await new Promise((res, rej) => { const s = document.createElement('script'); s.src = 'https://www.gstatic.com/firebasejs/' + V + '/' + f; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
    }
    firebase.initializeApp(CONFIG.firebase);
    this.auth = firebase.auth(); this.db = firebase.firestore(); this.storage = CONFIG.attachments ? firebase.storage() : null;
    try { await this.db.enablePersistence({ synchronizeTabs: true }); } catch (e) { /* fine without */ }
    this.auth.onAuthStateChanged(async (u) => {
      this.user = u; this.ready = true;
      store.set('nabu-admin', u && this.isAdmin() ? (u.email || 'admin') : '');
      if (u) { await this.pullProfile(); if (typeof BILL !== 'undefined') BILL.sync(); this.watchUnread(); } else { this.stopUnread(); }
      this.listeners.forEach((cb) => cb(u));
    });
  },

  /* ---- auth ---- */
  /* The proof of who this is, for the one place outside Firebase that needs it:
     the worker that answers questions. Firebase refreshes the token itself, so
     asking for it each time is cheap and always gives a fresh one. Empty string
     when nobody is signed in - the caller decides what that means. */
  async token() {
    try { return this.auth && this.auth.currentUser ? await this.auth.currentUser.getIdToken() : ''; }
    catch (e) { return ''; }
  },
  async signIn(provider) {
    if (isIOSApp()) return this.signInNative(provider);
    const P = provider === 'google' ? new firebase.auth.GoogleAuthProvider() : new firebase.auth.FacebookAuthProvider();
    try { await this.auth.signInWithPopup(P); } catch (e) { if (/popup/i.test(e.code || '')) await this.auth.signInWithRedirect(P); else throw e; }
  },
  /* The iPhone app. Google refuses to sign anybody in inside an app's own web
     view (403 disallowed_useragent), and Apple requires its own sign-in beside
     Google's, so both are asked of the phone itself: the shell's
     FirebaseAuthentication plugin shows Google's or Apple's native sheet and
     hands back the proof, and Firebase here signs in with it. The account is
     the same account the website and the Android app use. skipNativeAuth keeps
     the plugin from signing in a second, native Firebase session beside this
     one, which is also what lets Apple's nonce reach this page. */
  nativeAuth() {
    const C = window.Capacitor;
    if (!C) return null;
    if (C.Plugins && C.Plugins.FirebaseAuthentication) return C.Plugins.FirebaseAuthentication;
    return typeof C.isPluginAvailable === 'function' && C.isPluginAvailable('FirebaseAuthentication') && typeof C.registerPlugin === 'function'
      ? C.registerPlugin('FirebaseAuthentication') : null;
  },
  async signInNative(provider) {
    const FA = this.nativeAuth();
    if (!FA) throw Object.assign(new Error('native sign-in unavailable'), { code: 'auth/native-unavailable' });
    let cred;
    try {
      if (provider === 'apple') {
        const r = await FA.signInWithApple({ skipNativeAuth: true }), c = (r && r.credential) || {};
        cred = new firebase.auth.OAuthProvider('apple.com').credential({ idToken: c.idToken, rawNonce: c.nonce });
      } else if (provider === 'google') {
        const r = await FA.signInWithGoogle({ skipNativeAuth: true }), c = (r && r.credential) || {};
        cred = firebase.auth.GoogleAuthProvider.credential(c.idToken, c.accessToken);
      } else throw Object.assign(new Error('provider'), { code: 'auth/operation-not-allowed' });
    } catch (e) {
      /* The native sheets say a closed sheet in words, not in a Firebase
         code: Google's "canceled the sign-in flow", Apple's AuthorizationError
         1001. Said the way a closed popup already is. */
      if (e && !/^auth\//.test(e.code || '') && /cancel|error 1001/i.test(String(e.message || ''))) throw Object.assign(new Error('cancelled'), { code: 'auth/popup-closed-by-user' });
      throw e;
    }
    await this.auth.signInWithCredential(cred);
  },
  async signInEmail(email, pw, create) {
    this.speakTheirLanguage();
    if (create) await this.auth.createUserWithEmailAndPassword(email, pw); else await this.auth.signInWithEmailAndPassword(email, pw);
  },
  /* Firebase sends its own emails, and it will send them in the reader's own
     language if it is told which one that is - otherwise every message goes
     out in the project's default whatever the person is reading. It is one
     line, and it has never been set. */
  speakTheirLanguage() {
    try { this.auth.languageCode = (typeof lang !== 'undefined' && lang) ? lang : 'vi'; } catch (e) { /* older SDK */ }
  },
  resetPassword(email) {
    this.speakTheirLanguage();
    return this.auth.sendPasswordResetEmail(email);
  },
  /* Signing out has to take the account off the device with it.
     It used to sign out of Firebase and leave everything else where it was, so
     the next person - or the same person wanting a second account - opened a
     phone that still had the last one's name at the top of the profile, their
     birthday, and their courses still unlocked. Somebody who says "sign out"
     means all of it.

     What is not touched: the language, the theme, and whether the tour has been
     seen. Those belong to the phone, not to whoever was signed in on it. */
  async signOut() {
    try {
      this.profileRead = false;
      /* Everything, not a chosen few. Signing out used to clear the profile,
         the plans and today's card, and leave the rest where it was: the
         diary, the companions, the wishes, the coins, the course progress,
         the votes, the message tree. The next person to open the app on that
         phone - or the same person after deleting their account - was handed
         somebody else's inner life, and there was no way to get rid of it.
         The language and the theme stay, because they are how the phone is
         set up rather than who was using it. */
      if (typeof LIKES !== 'undefined') LIKES.forget();
      wipeDevice();
    } catch (e) { /* a full phone must not be able to trap somebody signed in */ }
    /* In the iPhone app Google's own SDK remembers who signed in, apart from
       Firebase. Forgotten too, so the next person on the phone is asked to
       choose an account rather than handed the last one. Never waited on. */
    if (isIOSApp()) { const FA = this.nativeAuth(); if (FA) Promise.resolve().then(() => FA.signOut()).catch(() => {}); }
    return this.auth.signOut();
  },
  /* Apple's rule for an app with Sign in with Apple: deleting the account also revokes the Apple sign-in.
     Inside the iPhone app, for an account that signs in with Apple, Apple is asked to sign the person in once
     more. That does two jobs. Firebase wants a recent sign-in before it deletes a login - without it the
     deletion used to stop half way with auth/requires-recent-login, the data already gone - and Apple's
     answer carries a one-time code the worker exchanges and revokes (/apple-revoke, worker/src/apple.ts).
     A failure to reach the worker does not stop the deletion: what the person asked for still happens, and
     the worker's log says what it could not do. Anywhere but the iPhone app this does nothing. */
  async appleBeforeDelete() {
    if (!isIOSApp() || !this.user) return;
    if (!(this.user.providerData || []).some((p) => p && p.providerId === 'apple.com')) return;
    const FA = this.nativeAuth();
    if (!FA) return;
    let r;
    try { r = await FA.signInWithApple({ skipNativeAuth: true }); }
    catch (e) {
      if (/cancel|error 1001/i.test(String((e && e.message) || ''))) throw Object.assign(new Error('cancelled'), { code: 'auth/popup-closed-by-user' });
      throw e;
    }
    const c = (r && r.credential) || {};
    await this.user.reauthenticateWithCredential(new firebase.auth.OAuthProvider('apple.com').credential({ idToken: c.idToken, rawNonce: c.nonce }));
    if (!c.authorizationCode || !CONFIG.aiEndpoint) return;
    try {
      const idTok = await this.token();
      await withTimeout(fetch(CONFIG.aiEndpoint.replace(/\/$/, '') + '/apple-revoke', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + idTok },
        body: JSON.stringify({ code: c.authorizationCode })
      }), 20000);
    } catch (e) { /* offline or not configured: the deletion goes on */ }
  },
  /* Account deletion (a store requirement): profile, thread and messages, bookings, then the login itself.
     Firebase asks for a recent sign-in before deleting a login; the caller handles that error. */
  async deleteAccount() {
    /* First, while nothing is gone yet: an account that signs in with Apple is confirmed with Apple and its
       Apple sign-in revoked. If the person closes Apple's sheet here, nothing at all has been deleted. */
    await this.appleBeforeDelete();
    const uid = this.user.uid, db = this.db;
    const wipe = async (q) => { const s = await q.get(); await Promise.all(s.docs.map((d) => d.ref.delete().catch(() => {}))); };
    try { await wipe(db.collection('threads').doc(uid).collection('messages')); } catch (e) { /* rules or offline */ }
    try { await db.collection('threads').doc(uid).delete(); } catch (e) { /* nothing there */ }
    try { await wipe(db.collection('bookings').where('uid', '==', uid)); } catch (e) { /* rules or offline */ }
    try { await wipe(db.collection('comments').where('uid', '==', uid)); } catch (e) { /* rules or offline */ }
    /* The hearts too. They carry the uid, so an account that is gone must not
       leave rows behind that still name it - and a post's number should not
       count somebody who no longer has an account. */
    try { await wipe(db.collection('likes').where('uid', '==', uid)); } catch (e) { /* rules or offline */ }
    /* The red thread, and the wedding held on it. A deleted account used to
       leave both standing: the other person kept a partner who no longer
       existed, and the shared diary, the gifts and the wedding room went on
       holding what this person had written. Their own rows go first - the
       rules let a member delete what they wrote - and then the room itself,
       which a member may also delete. */
    try {
      const bonds = await db.collection('bonds').where('uids', 'array-contains', uid).get();
      for (const b of bonds.docs) {
        await wipe(b.ref.collection('diary').where('from', '==', uid));
        await wipe(b.ref.collection('gifts').where('from', '==', uid));
        await b.ref.delete().catch(() => {});
      }
    } catch (e) { /* rules or offline */ }
    try {
      const weds = await db.collection('weddings').where('uids', 'array-contains', uid).get();
      for (const w of weds.docs) {
        await w.ref.collection('guests').doc(uid).delete().catch(() => {});
        await wipe(w.ref.collection('talk').where('from', '==', uid));
        await wipe(w.ref.collection('says').where('from', '==', uid));
        await wipe(w.ref.collection('gifts').where('from', '==', uid));
        await w.ref.delete().catch(() => {});
      }
    } catch (e) { /* rules or offline */ }
    /* Invitations: the ones waiting in this person's inbox, and the link they
       made for somebody to open. Both name them. */
    try { await wipe(db.collection('requests').doc(uid).collection('from')); } catch (e) { /* rules or offline */ }
    try { await wipe(db.collection('wedasks').doc(uid).collection('from')); } catch (e) { /* rules or offline */ }
    try { await wipe(db.collection('invites').where('from', '==', uid)); } catch (e) { /* rules or offline */ }
    /* How this person voted in the activities. The counts are public, but a
       vote carries the uid that cast it. */
    try { await wipe(db.collection('votes').where('uid', '==', uid)); } catch (e) { /* rules or offline */ }
    try { await db.collection('users').doc(uid).delete(); } catch (e) { /* nothing there */ }
    /* Every registered person now has a public card and a reserved username, so
       deletion has to take both with it: the card in 'people' and the row in
       'handles' that holds the name for them. Left behind, the card would go on
       showing somebody who has gone and the username would stay taken forever. */
    try { const h = PROFILE.handle; if (h) await db.collection('handles').doc(h).delete(); } catch (e) { /* rules or offline */ }
    try { await db.collection('people').doc(uid).delete(); } catch (e) { /* rules or offline */ }
    await this.user.delete();
    /* And the phone itself. Clearing a handful of keys left the profile, the
       diary, the companions and everything else where they were, which is not
       what a person is asking for when they ask to be deleted. The caller
       reloads, so nothing that was read into memory outlives this either. */
    wipeDevice(true);
  },

  /* ---- profile ---- */
  async pullProfile() {
    const snap = await this.db.collection('users').doc(this.user.uid).get();
    /* No profile in the cloud means this account has just been made. That is
       the one moment the tour is worth showing whatever this device has seen
       before: somebody who signed up is starting, even if the phone they did
       it on has been used by somebody else. */
    /* An account that has just been made has no username yet, whichever button
       made it - email, Google or Facebook - so it goes to the welcome screen from
       here, rather than relying on the sign-in page knowing which mode it was in. */
    if (!snap.exists) { store.set('nabu-onboard', 1); await this.pushProfile(); this.profileRead = true; if (typeof parseHash === 'function' && parseHash().route !== 'welcome') redirect('#/welcome'); return; }
    const d = snap.data();
    /* The account's copy of what is open is the truth, and this phone takes
       it as read - whatever was here before. It used to be a merge that kept
       the later date, which meant a phone could never be told to hold less:
       emptying the cloud copy achieved nothing, because the phone's copy won
       and was pushed back up. Now only Nabu and the worker write that field,
       so the phone has nothing to push and nothing to argue with. */
    const before = ACCESS.get();
    const cloud = d.access && typeof d.access === 'object' ? Object.assign({}, d.access) : {};
    store.set('nabu-access', cloud);
    store.set('nabu-subs', d.subs && typeof d.subs === 'object' ? d.subs : {});
    /* A withdrawal carries a reason, stamped with the moment it was given, and
       a device says it once. Said out loud, because access that disappears
       without a word reads as a broken app rather than a decision somebody
       made. */
    if (d.revoked && d.revoked.at && Number(d.revoked.at) > Number(store.get('nabu-revoked-at', 0))) {
      store.set('nabu-revoked-at', Number(d.revoked.at));
      if (Object.keys(before).length && !Object.keys(cloud).length && typeof alertSay === 'function') {
        alertSay({ id: 'revoked-' + d.revoked.at, k: 'app', t: T().accessGoneTitle,
          b: d.revoked.why || T().accessGoneBody, href: '#/me' }, true);
      }
    }
    /* Opened by Nabu or by a code, so nothing on this phone has said so yet.
       Somebody who has just paid should not have to go looking for what they
       bought. */
    const fresh = Object.keys(cloud).filter((k) => !before[k]);
    if (fresh.length && typeof ALERTS !== 'undefined') {
      ALERTS.add({ id: 'unlocked-' + fresh.join('+') + '-' + cloud[fresh[0]], k: 'app',
        t: T().accessOnTitle(fresh.map(accessName).join(', ')),
        b: T().accessOnBody(fmtDate(cloud[fresh[0]])), href: '#/me' });
    }
    /* The free turns are the person's, not the handset's. Later date wins, so
       this device can be told a turn is already spent but never given one
       back; if this device is the one that is ahead, the account is caught up.
       A write that fails leaves the device copy in charge, which is correct. */
    const merged = turnsMerge(d.turns);
    turnsApply(merged);
    const cl = (d.turns && d.turns.luck && typeof d.turns.luck === 'object') ? d.turns.luck : {};
    const cpd = (d.turns && d.turns.pick && d.turns.pick.d) ? String(d.turns.pick.d) : '';
    const ahead = (merged.pick ? String(merged.pick.d) : '') !== cpd
      || Object.keys(merged.luck).some((k) => String(merged.luck[k] || '') !== String(cl[k] || ''));
    if (ahead) this.pushTurns().catch(() => { /* offline; the device copy holds */ });
    delete d.turns;
    delete d.access; delete d.revoked; saveProfileLocal(d);
    this.profileRead = true;
    if (typeof applyAccountLang === 'function' && applyAccountLang() && typeof route === 'function') route();
  },
  /* Kept apart from pushProfile on purpose: saving a name must not overwrite
     what somebody has spent, and spending a turn must not rewrite the name. */
  async pushTurns() {
    if (!this.user || !this.db) return;
    const t = turnsLocal();
    await this.db.collection('users').doc(this.user.uid)
      .set({ turns: { pick: t.pick || null, luck: t.luck || {} } }, { merge: true });
  },
  async pushProfile() {
    if (!this.user) return;
    const p = { name: PROFILE.name || this.user.displayName || '', birthday: PROFILE.birthday || '', interests: PROFILE.interests || [],
      handle: PROFILE.handle || '', lang: PROFILE.lang || '',
      tourDone: !!PROFILE.tourDone, email: this.user.email || '', updatedAt: firebase.firestore.FieldValue.serverTimestamp() };
    await this.db.collection('users').doc(this.user.uid).set(p, { merge: true });
  },

  /* Paid for. Two presses rather than one, because agreeing to sell
     something and being paid for it are different days, and only the second
     one should open anything.

     What it opens is written onto the buyer's own account. A code is a string
     and travels: whatever one customer can paste, five friends can paste, and
     what was sold once gets used by a household. An account cannot be handed
     round the same way. */
  async markPaid(b) {
    await this.db.collection('bookings').doc(b.id).set(
      { paid: true, paidAt: Date.now(), status: b.status === 'requested' ? 'confirmed' : (b.status || 'confirmed') }, { merge: true });
    const ids = (b.items || []).map((it) => it.id)
      .filter((id) => COURSES.some((c) => c.id === id));
    if (ids.length && b.uid) await this.grantAccess(b.uid, ids);
    return ids;
  },
  /* Opened on the account, for as long as the thing is sold for. */
  async grantAccess(uid, ids) {
    const a = {}, today = isoDate(new Date());
    ids.forEach((id) => {
      const c = COURSES.filter((x) => x.id === id)[0];
      a[id] = addMonths(today, (c && c.months) || 12);
    });
    await this.db.collection('users').doc(uid).set({ access: a }, { merge: true });
    return a;
  },

  /* What somebody holds, so it can be looked at before anything is taken. */
  async accessOf(uid) {
    const d = await this.db.collection('users').doc(uid).get();
    return d.exists ? (d.data().access || {}) : {};
  },
  /* Taking it back. The time on it is what lets it beat the merge on the
     person's own phone; the reason is what they will read. */
  revokeAccess(uid, why) {
    return this.db.collection('users').doc(uid).set({
      access: {}, revoked: { at: Date.now(), why: String(why || '').slice(0, 300) }
    }, { merge: true });
  },

  /* ---- messages: one thread per user ---- */
  thread() { return this.db.collection('threads').doc(this.user.uid); },
  /* Upload a photo or a voice note for the thread; returns { url, kind }. */
  async uploadAttachment(file, uid, kind) {
    const path = 'threads/' + (uid || this.user.uid) + '/' + Date.now() + '-' + Math.random().toString(36).slice(2, 6) + (kind === 'audio' ? '.webm' : '.jpg');
    const ref = this.storage.ref(path);
    await ref.put(file, { contentType: file.type || (kind === 'audio' ? 'audio/webm' : 'image/jpeg') });
    return { url: await ref.getDownloadURL(), kind: kind, path: path };
  },
  async sendMessage(text, asAdminTo, attachment) {
    const uid = asAdminTo || this.user.uid, from = asAdminTo ? 'nabu' : 'user';
    const ref = this.db.collection('threads').doc(uid);
    const msg = { from: from, text: text || '', at: firebase.firestore.FieldValue.serverTimestamp(), name: from === 'nabu' ? 'Nabu' : (PROFILE.name || this.user.displayName || this.user.email || ''), email: this.user.email || '' };
    if (attachment) { msg.kind = attachment.kind; msg.url = attachment.url; }
    await ref.collection('messages').add(msg);
    const preview = text || (attachment ? (attachment.kind === 'audio' ? '🎤' : '📷') : '');
    const meta = { lastText: preview, lastAt: firebase.firestore.FieldValue.serverTimestamp(), lastFrom: from };
    if (from === 'user') { meta.name = PROFILE.name || this.user.displayName || ''; meta.email = this.user.email || ''; meta.adminUnread = firebase.firestore.FieldValue.increment(1); meta.userUnread = 0; }
    else { meta.userUnread = firebase.firestore.FieldValue.increment(1); meta.adminUnread = 0; }
    await ref.set(meta, { merge: true });
  },
  watchMessages(uid, cb) {
    return this.db.collection('threads').doc(uid).collection('messages').orderBy('at').limitToLast(200)
      .onSnapshot((s) => cb(s.docs.map((d) => Object.assign({ id: d.id }, d.data()))));
  },
  markRead(uid, side) { return this.db.collection('threads').doc(uid).set(side === 'admin' ? { adminUnread: 0 } : { userUnread: 0 }, { merge: true }).catch(() => {}); },
  _unsubUnread: null,
  watchUnread() {
    this.stopUnread();
    const self = this;
    if (this.isAdmin()) {
      const S = T(), nav = () => renderChrome(parseHash().route === 'post' ? 'home' : (ROUTES[parseHash().route] || {}).nav);
      let firstT = true, firstB = true;
      this._unsubUnread = this.db.collection('threads').where('adminUnread', '>', 0).onSnapshot((s) => {
        UNREAD = s.size; nav();
        if (!firstT) s.docChanges().forEach((c) => { if (c.type === 'added' || c.type === 'modified') { const t = c.doc.data(); if (t.lastFrom === 'user') notifyAdmin(S.notifNewMsg + (t.name || t.email || S.guestLabel), t.lastText || '', '#/admin?tab=inbox'); } });
        firstT = false;
      });
      this._unsubBk = this.db.collection('bookings').where('status', 'in', ['requested', 'change_requested', 'cancel_requested']).onSnapshot((s) => {
        NEWBK = s.size; nav();
        if (!firstB) s.docChanges().forEach((c) => { if (c.type === 'added') { const b = c.doc.data(); notifyAdmin(S.notifNewBooking + (b.name || b.email || S.guestLabel), (b.service || '') + (b.slot ? ' · ' + b.slot.replace('T', ' ') : ''), '#/admin?tab=bookings'); } });
        firstB = false;
      });
      this.watchComments();
    } else {
      this._unsubUnread = this.thread().onSnapshot((d) => { UNREAD = (d.exists && d.data().userUnread) || 0; renderChrome((ROUTES[parseHash().route] || {}).nav); });
    }
    void self;
  },
  _unsubBk: null,
  stopUnread() { if (this._unsubUnread) { this._unsubUnread(); this._unsubUnread = null; } if (this._unsubBk) { this._unsubBk(); this._unsubBk = null; } UNREAD = 0; NEWBK = 0; if (this._unsubCmt) { this._unsubCmt(); this._unsubCmt = null; } NEWC = 0; },
  /* ---- comments: Nabu hears about a new one without opening every post ----
     The newest twenty, live. What counts as new is anything a reader wrote
     after the last time the dashboard's comments tab was opened on this
     device. What is said out loud is only what is newer than every comment
     this watcher has already seen, by the server's clock. Not by id: deleting
     one of the twenty brings an old twenty-first into view with an id never
     seen before, and it was announced as new. Not by docChanges() either, so
     the same code runs against the suite's stand-in. A row the server has not
     stamped yet has no time to compare, and waits until it has one. */
  _unsubCmt: null,
  watchComments() {
    if (this._unsubCmt) { this._unsubCmt(); this._unsubCmt = null; }
    if (!this.db || !this.isAdmin()) return;
    const S = T(), pending = Number.MAX_SAFE_INTEGER; let first = true, top = 0;
    const nav = () => renderChrome(parseHash().route === 'post' ? 'home' : (ROUTES[parseHash().route] || {}).nav);
    this._unsubCmt = this.db.collection('comments').orderBy('at', 'desc').limit(20).onSnapshot((s) => {
      const since = Number(store.get('nabu-cmt-seen', 0)) || 0;
      const rows = (s.docs || []).map((d) => Object.assign({ id: d.id }, d.data()));
      NEWC = rows.filter((c) => !c.nabu && cmtMs(c) !== pending && cmtMs(c) > since).length;
      nav();
      let high = top;
      rows.forEach((c) => {
        const ms = cmtMs(c);
        if (ms === pending || ms <= top) return;
        if (!first && !c.nabu) notifyAdmin(S.notifNewComment + (c.name || S.cmtSomeone), c.text || '', '#/admin?tab=comments');
        if (ms > high) high = ms;
      });
      top = high; first = false;
    }, () => {});
  },
  /* Posts and availability live in content/{posts,schedule} once Nabu has
     saved them from the dashboard; until then the JSON files in the repo are used. */
  async getContent(name) { const d = await this.db.collection('content').doc(name).get(); return d.exists ? d.data() : null; },
  setContent(name, obj) { return this.db.collection('content').doc(name).set(Object.assign({}, obj, { updatedAt: firebase.firestore.FieldValue.serverTimestamp() })); },
  watchThreads(cb) { return this.db.collection('threads').orderBy('lastAt', 'desc').limit(100).onSnapshot((s) => cb(s.docs.map((d) => Object.assign({ id: d.id }, d.data())))); },

  /* ---- bookings ---- */
  /* An unlock order: same collection as bookings so one list, one set of
     statuses and one notification path serve both, but with no slot to take. */
  async createUnlockOrder(items, total) {
    const doc = {
      kind: 'unlock', uid: this.user.uid, email: this.user.email || '',
      name: (typeof PROFILE !== 'undefined' && PROFILE.name) || '',
      items: items, price: total, status: 'requested',
      at: firebase.firestore.FieldValue.serverTimestamp()
    };
    const ref = await this.db.collection('bookings').add(doc);
    return ref.id;
  },
  async createBooking(b) {
    const doc = Object.assign({ uid: this.user.uid, email: this.user.email || '', status: 'requested', at: firebase.firestore.FieldValue.serverTimestamp() }, b);
    const ref = await this.db.collection('bookings').add(doc);
    await this.db.collection('taken').doc(b.slot.replace(/[^0-9T]/g, '')).set({ bookingId: ref.id, at: firebase.firestore.FieldValue.serverTimestamp() });
    notifyBooking(Object.assign({ id: ref.id }, b));
    return ref.id;
  },
  watchMyBookings(cb) { return this.db.collection('bookings').where('uid', '==', this.user.uid).onSnapshot((s) => cb(s.docs.map((d) => Object.assign({ id: d.id }, d.data())).sort((a, b) => String(b.slot).localeCompare(String(a.slot))))); },
  watchAllBookings(cb) { return this.db.collection('bookings').limit(300).onSnapshot((s) => cb(s.docs.map((d) => Object.assign({ id: d.id }, d.data())).sort((a, b) => String(b.slot || b.id).localeCompare(String(a.slot || a.id))))); },
  async setBookingStatus(b, status) {
    const ref = this.db.collection('bookings').doc(b.id);
    /* An unlock order - a course, or a wedding - is a booking with no hour in
       it. String(undefined) is "undefined", which keeps none of its characters
       once everything but digits and T is stripped, so the key came out empty
       and Firestore refuses a document path of ''. There is nothing to hold in
       the calendar for an order without an hour, so nothing is held. */
    const key = b.slot ? String(b.slot).replace(/[^0-9T]/g, '') : '';
    const newKey = b.newSlot ? String(b.newSlot).replace(/[^0-9T]/g, '') : '';
    const taken = (k) => this.db.collection('taken').doc(k);
    if (status === 'keep') {  // the client asked for a change or a cancellation; Nabu keeps the booking as it was
      await ref.set({ status: b.prevStatus || 'confirmed', newSlot: firebase.firestore.FieldValue.delete(), prevStatus: firebase.firestore.FieldValue.delete() }, { merge: true });
      if (newKey) await taken(newKey).delete().catch(() => {});
      return;
    }
    if (status === 'confirmed' && b.status === 'change_requested' && b.newSlot) {  // the new time takes over
      await ref.set({ status: 'confirmed', slot: b.newSlot, newSlot: firebase.firestore.FieldValue.delete(), prevStatus: firebase.firestore.FieldValue.delete() }, { merge: true });
      if (key) await taken(key).delete().catch(() => {});
      await taken(newKey).set({ bookingId: b.id }, { merge: true });
      return;
    }
    await ref.set({ status: status }, { merge: true });
    if (status === 'declined' || status === 'cancelled') {
      if (key) await taken(key).delete().catch(() => {});
      if (newKey) await taken(newKey).delete().catch(() => {});
    } else if (key) await taken(key).set({ bookingId: b.id }, { merge: true });
  },
  /* The client asks to move the booking: the new slot is reserved at once, Nabu approves or keeps the old time. */
  async requestChange(b, newSlot) {
    await this.db.collection('bookings').doc(b.id).set({ status: 'change_requested', newSlot: newSlot, prevStatus: b.status === 'change_requested' || b.status === 'cancel_requested' ? (b.prevStatus || 'confirmed') : b.status }, { merge: true });
    await this.db.collection('taken').doc(String(newSlot).replace(/[^0-9T]/g, '')).set({ bookingId: b.id, pending: true }, { merge: true });
    notifyBooking(Object.assign({}, b, { newSlot: newSlot, status: 'change_requested' }));
  },
  async requestCancel(b) {
    await this.db.collection('bookings').doc(b.id).set({ status: 'cancel_requested', prevStatus: b.status === 'change_requested' || b.status === 'cancel_requested' ? (b.prevStatus || 'confirmed') : b.status }, { merge: true });
    notifyBooking(Object.assign({}, b, { status: 'cancel_requested' }));
  },
  async getBooking(id) { const d = await this.db.collection('bookings').doc(id).get(); return d.exists ? Object.assign({ id: d.id }, d.data()) : null; },
  /* null, not {}, when the answer could not be had. An empty object is a real
     answer - nobody has claimed an hour yet - and returning it for a timeout,
     a dropped connection or a rules refusal made every hour look free on a
     slow morning. Somebody then picks an hour that is already somebody
     else's. The write itself is still refused (firestore.rules requires the
     taken/ document not to exist), so nobody is double-booked; but they are
     told so only after choosing, which is a poor way to find out. The caller
     can now tell the two apart and say the calendar is not fully known. */
  async takenSlots() {
    const out = {};
    try {
      const s = await Promise.race([this.db.collection('taken').get(), new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 3000))]);
      s.forEach((d) => { out[d.id] = true; });
    } catch (e) { return null; }
    return out;
  }
};
