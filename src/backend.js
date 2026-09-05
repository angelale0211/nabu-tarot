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
      if (u) { await this.pullProfile(); this.watchUnread(); } else { this.stopUnread(); }
      this.listeners.forEach((cb) => cb(u));
    });
  },

  /* ---- auth ---- */
  async signIn(provider) {
    const P = provider === 'google' ? new firebase.auth.GoogleAuthProvider() : new firebase.auth.FacebookAuthProvider();
    try { await this.auth.signInWithPopup(P); } catch (e) { if (/popup/i.test(e.code || '')) await this.auth.signInWithRedirect(P); else throw e; }
  },
  async signInEmail(email, pw, create) {
    if (create) await this.auth.createUserWithEmailAndPassword(email, pw); else await this.auth.signInWithEmailAndPassword(email, pw);
  },
  resetPassword(email) { return this.auth.sendPasswordResetEmail(email); },
  signOut() { return this.auth.signOut(); },
  /* Account deletion (a store requirement): profile, thread and messages, bookings, then the login itself.
     Firebase asks for a recent sign-in before deleting a login; the caller handles that error. */
  async deleteAccount() {
    const uid = this.user.uid, db = this.db;
    const wipe = async (q) => { const s = await q.get(); await Promise.all(s.docs.map((d) => d.ref.delete().catch(() => {}))); };
    try { await wipe(db.collection('threads').doc(uid).collection('messages')); } catch (e) { /* rules or offline */ }
    try { await db.collection('threads').doc(uid).delete(); } catch (e) { /* nothing there */ }
    try { await wipe(db.collection('bookings').where('uid', '==', uid)); } catch (e) { /* rules or offline */ }
    try { await db.collection('users').doc(uid).delete(); } catch (e) { /* nothing there */ }
    await this.user.delete();
    store.set('nabu-access', {});
  },

  /* ---- profile ---- */
  async pullProfile() {
    const snap = await this.db.collection('users').doc(this.user.uid).get();
    if (snap.exists) { const d = snap.data(); if (d.access) { const a = ACCESS.get(); Object.keys(d.access).forEach((k) => { if (!a[k] || d.access[k] > a[k]) a[k] = d.access[k]; }); store.set('nabu-access', a); } delete d.access; saveProfileLocal(d); }
    else await this.pushProfile();
  },
  async pushProfile() {
    if (!this.user) return;
    const p = { name: PROFILE.name || this.user.displayName || '', birthday: PROFILE.birthday || '', interests: PROFILE.interests || [],
      tourDone: !!PROFILE.tourDone, email: this.user.email || '', access: ACCESS.get(), updatedAt: firebase.firestore.FieldValue.serverTimestamp() };
    await this.db.collection('users').doc(this.user.uid).set(p, { merge: true });
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
    } else {
      this._unsubUnread = this.thread().onSnapshot((d) => { UNREAD = (d.exists && d.data().userUnread) || 0; renderChrome((ROUTES[parseHash().route] || {}).nav); });
    }
    void self;
  },
  _unsubBk: null,
  stopUnread() { if (this._unsubUnread) { this._unsubUnread(); this._unsubUnread = null; } if (this._unsubBk) { this._unsubBk(); this._unsubBk = null; } UNREAD = 0; NEWBK = 0; },
  /* Posts and availability live in content/{posts,schedule} once Nabu has
     saved them from the dashboard; until then the JSON files in the repo are used. */
  async getContent(name) { const d = await this.db.collection('content').doc(name).get(); return d.exists ? d.data() : null; },
  setContent(name, obj) { return this.db.collection('content').doc(name).set(Object.assign({}, obj, { updatedAt: firebase.firestore.FieldValue.serverTimestamp() })); },
  watchThreads(cb) { return this.db.collection('threads').orderBy('lastAt', 'desc').limit(100).onSnapshot((s) => cb(s.docs.map((d) => Object.assign({ id: d.id }, d.data())))); },

  /* ---- bookings ---- */
  async createBooking(b) {
    const doc = Object.assign({ uid: this.user.uid, email: this.user.email || '', status: 'requested', at: firebase.firestore.FieldValue.serverTimestamp() }, b);
    const ref = await this.db.collection('bookings').add(doc);
    await this.db.collection('taken').doc(b.slot.replace(/[^0-9T]/g, '')).set({ bookingId: ref.id, at: firebase.firestore.FieldValue.serverTimestamp() });
    notifyBooking(Object.assign({ id: ref.id }, b));
    return ref.id;
  },
  watchMyBookings(cb) { return this.db.collection('bookings').where('uid', '==', this.user.uid).onSnapshot((s) => cb(s.docs.map((d) => Object.assign({ id: d.id }, d.data())).sort((a, b) => String(b.slot).localeCompare(String(a.slot))))); },
  watchAllBookings(cb) { return this.db.collection('bookings').orderBy('slot', 'desc').limit(200).onSnapshot((s) => cb(s.docs.map((d) => Object.assign({ id: d.id }, d.data())))); },
  async setBookingStatus(b, status) {
    const ref = this.db.collection('bookings').doc(b.id), key = String(b.slot).replace(/[^0-9T]/g, ''), newKey = b.newSlot ? String(b.newSlot).replace(/[^0-9T]/g, '') : '';
    if (status === 'keep') {  // the client asked for a change or a cancellation; Nabu keeps the booking as it was
      await ref.set({ status: b.prevStatus || 'confirmed', newSlot: firebase.firestore.FieldValue.delete(), prevStatus: firebase.firestore.FieldValue.delete() }, { merge: true });
      if (newKey) await this.db.collection('taken').doc(newKey).delete().catch(() => {});
      return;
    }
    if (status === 'confirmed' && b.status === 'change_requested' && b.newSlot) {  // the new time takes over
      await ref.set({ status: 'confirmed', slot: b.newSlot, newSlot: firebase.firestore.FieldValue.delete(), prevStatus: firebase.firestore.FieldValue.delete() }, { merge: true });
      await this.db.collection('taken').doc(key).delete().catch(() => {});
      await this.db.collection('taken').doc(newKey).set({ bookingId: b.id }, { merge: true });
      return;
    }
    await ref.set({ status: status }, { merge: true });
    if (status === 'declined' || status === 'cancelled') { await this.db.collection('taken').doc(key).delete().catch(() => {}); if (newKey) await this.db.collection('taken').doc(newKey).delete().catch(() => {}); }
    else await this.db.collection('taken').doc(key).set({ bookingId: b.id }, { merge: true });
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
  async takenSlots() {
    const out = {};
    try {
      const s = await Promise.race([this.db.collection('taken').get(), new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 3000))]);
      s.forEach((d) => { out[d.id] = true; });
    } catch (e) { /* offline, slow, or rules */ }
    return out;
  }
};
