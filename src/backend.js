/* ============================ backend ============================
   Accounts, profiles, messages and bookings live in Firebase (Auth +
   Firestore) when CONFIG.firebase is set. Without it, BE.enabled is false and
   every screen falls back to the device-only profile and to Instagram.
   The SDK is loaded on demand so the app shell stays offline-capable. */
const BE = {
  enabled: !!CONFIG.firebase,
  ready: false, user: null, db: null, auth: null,
  listeners: [],
  onAuth(cb) { this.listeners.push(cb); if (this.ready) cb(this.user); },
  isAdmin() { return !!(this.user && this.user.email && CONFIG.adminEmails.indexOf(this.user.email.toLowerCase()) > -1); },

  async init() {
    if (!this.enabled) return;
    const V = '10.14.1';
    for (const f of ['firebase-app-compat.js', 'firebase-auth-compat.js', 'firebase-firestore-compat.js']) {
      await new Promise((res, rej) => { const s = document.createElement('script'); s.src = 'https://www.gstatic.com/firebasejs/' + V + '/' + f; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
    }
    firebase.initializeApp(CONFIG.firebase);
    this.auth = firebase.auth(); this.db = firebase.firestore();
    try { await this.db.enablePersistence({ synchronizeTabs: true }); } catch (e) { /* fine without */ }
    this.auth.onAuthStateChanged(async (u) => {
      this.user = u; this.ready = true;
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
  async sendMessage(text, asAdminTo) {
    const uid = asAdminTo || this.user.uid, from = asAdminTo ? 'nabu' : 'user';
    const ref = this.db.collection('threads').doc(uid);
    await ref.collection('messages').add({ from: from, text: text, at: firebase.firestore.FieldValue.serverTimestamp() });
    const meta = { lastText: text, lastAt: firebase.firestore.FieldValue.serverTimestamp(), lastFrom: from };
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
      this._unsubUnread = this.db.collection('threads').where('adminUnread', '>', 0).onSnapshot((s) => { UNREAD = s.size; renderChrome(parseHash().route === 'post' ? 'home' : (ROUTES[parseHash().route] || {}).nav); });
    } else {
      this._unsubUnread = this.thread().onSnapshot((d) => { UNREAD = (d.exists && d.data().userUnread) || 0; renderChrome((ROUTES[parseHash().route] || {}).nav); });
    }
    void self;
  },
  stopUnread() { if (this._unsubUnread) { this._unsubUnread(); this._unsubUnread = null; } UNREAD = 0; },
  watchThreads(cb) { return this.db.collection('threads').orderBy('lastAt', 'desc').limit(100).onSnapshot((s) => cb(s.docs.map((d) => Object.assign({ id: d.id }, d.data())))); },

  /* ---- bookings ---- */
  async createBooking(b) {
    const doc = Object.assign({ uid: this.user.uid, email: this.user.email || '', status: 'requested', at: firebase.firestore.FieldValue.serverTimestamp() }, b);
    const ref = await this.db.collection('bookings').add(doc);
    await this.db.collection('taken').doc(b.slot.replace(/[^0-9T]/g, '')).set({ bookingId: ref.id, at: firebase.firestore.FieldValue.serverTimestamp() });
    return ref.id;
  },
  watchMyBookings(cb) { return this.db.collection('bookings').where('uid', '==', this.user.uid).onSnapshot((s) => cb(s.docs.map((d) => Object.assign({ id: d.id }, d.data())).sort((a, b) => String(b.slot).localeCompare(String(a.slot))))); },
  watchAllBookings(cb) { return this.db.collection('bookings').orderBy('slot', 'desc').limit(200).onSnapshot((s) => cb(s.docs.map((d) => Object.assign({ id: d.id }, d.data())))); },
  async setBookingStatus(b, status) {
    await this.db.collection('bookings').doc(b.id).set({ status: status }, { merge: true });
    const key = String(b.slot).replace(/[^0-9T]/g, '');
    if (status === 'declined' || status === 'cancelled') await this.db.collection('taken').doc(key).delete().catch(() => {});
    else await this.db.collection('taken').doc(key).set({ bookingId: b.id }, { merge: true });
  },
  async takenSlots() {
    const out = {};
    try { const s = await this.db.collection('taken').get(); s.forEach((d) => { out[d.id] = true; }); } catch (e) { /* offline or rules */ }
    return out;
  }
};
