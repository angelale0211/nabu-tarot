/* =========================== a wedding on Nabu ===========================

   Two people who are engaged on the red thread can hold a ceremony inside the
   app, at an hour they choose, with guests watching. Nabu Cupid asks them the
   questions, each of them answers in front of everybody, and at the end they
   are married - on the thread, in the data, not only in the story.

   How it holds together, and why:

   THE ROOM IS THE DOCUMENT. There is no server here and there never will be,
   so a shared moment has to be a shared document that everybody watches. The
   ceremony is a numbered script held in this file; the cloud stores only which
   step the room is on and what was answered. Everyone on that step sees the
   same thing, latecomers included, and nothing has to be replayed to them.

   ONLY THE COUPLE MOVE IT. A step advances when the person being asked
   answers, and the rules let nobody but those two write to it. Guests write to
   exactly two places - their own seat and their own gifts - and to nothing
   else, so a guest cannot marry anybody or answer for the bride.

   YES IS NOT AUTOMATIC. Cupid asks; the answer is a real choice, and No ends
   the ceremony gently and does not marry them. That is the whole reason for
   doing this in front of people, and pretending otherwise would make it a
   cutscene rather than a ceremony.

   THE DOOR OPENS FIFTEEN MINUTES BEFORE AND SHUTS AT THE END. A guest with the
   link sees a closed door before that and a thank-you after it. During the
   hour they may leave and come back as often as they like, because people do.

   THE MUSIC IS SYNTHESISED. Every note is generated here with oscillators, so
   nothing is fetched, nothing is licensed from anybody, and it works offline.
   It starts only on a press, because that is the rule browsers enforce and
   also the polite thing to do to somebody on a bus. */

const WED_PRICE = 30000;
const WED_OPEN_MS = 15 * 60 * 1000;   /* the door opens this long before */
const WED_END_MS = 5 * 60 * 1000;     /* and shuts this long after the vows */
const WED_SEEN_MS = 45 * 1000;        /* a seat still warm counts as present */

/* ---------------------------------------------------------------- the script

   One numbered line at a time. `who` is whose turn it is to answer - 'a', 'b',
   or nobody - and every client renders the same line for the same number, so
   the room stays together without anything being broadcast. */
const WED_STEPS = [
  { id: 'gather', who: '' },
  { id: 'thread', who: '' },
  { id: 'askA', who: 'a', vow: 'takeA' },
  { id: 'askB', who: 'b', vow: 'takeB' },
  { id: 'promiseA', who: 'a', vow: 'keepA' },
  { id: 'promiseB', who: 'b', vow: 'keepB' },
  { id: 'bind', who: '' },
  { id: 'declare', who: '' }
];
const wedStep = (n) => WED_STEPS[Math.max(0, Math.min(WED_STEPS.length - 1, n | 0))];

/* ------------------------------------------------------------------ the room */

const WED = {
  ok() { return typeof BE !== 'undefined' && BE.enabled && !!BE.user && !!BE.db; },
  me() { return BE.user.uid; },
  /* One wedding per thread, named after it, so a couple cannot end up with two
     and a guest's link never goes stale. */
  idFor(bond) { return bond ? bond.id : ''; },
  mine(w) { return !!(w && w.uids && w.uids.indexOf(this.me()) > -1); },
  /* Which of the pair I am, in the script's terms. */
  side(w) { return w && w.a === this.me() ? 'a' : w && w.b === this.me() ? 'b' : ''; },
  startMs(w) { return Number(w && w.startMs) || 0; },
  /* The door. Before it opens there is nothing to enter; once the vows are
     done the room stays warm for five minutes and then closes for good. */
  doorState(w, now) {
    const t = now || Date.now(), start = this.startMs(w);
    if (!w || !start) return 'none';
    if (w.state === 'ended' || w.state === 'called-off') return 'over';
    if (w.doneAt && t > w.doneAt + WED_END_MS) return 'over';
    if (w.doneAt) return 'open';
    if (t < start - WED_OPEN_MS) return 'early';
    return 'open';
  },
  /* Everyone whose seat was warm in the last minute or so. Used for the
     bouquet, which should only be able to land on somebody actually there. */
  present(guests) {
    const t = Date.now();
    return (guests || []).filter((g) => t - Number(g.seen || 0) < WED_SEEN_MS);
  },

  async create(bond, startMs) {
    const id = this.idFor(bond), me = this.me();
    const mine = LOVE.mine(bond, me), you = LOVE.other(bond, me);
    await BE.db.collection('weddings').doc(id).set({
      uids: bond.uids, a: bond.a, b: bond.b,
      aName: bond.aName || '', bName: bond.bName || '',
      startMs: Number(startMs) || 0,
      state: 'planned', step: 0, vows: {}, guestCount: 0,
      by: me, at: Date.now()
    });
    void mine; void you;
    return id;
  },
  watch(id, cb) {
    if (!this.ok() || !id) return () => {};
    return BE.db.collection('weddings').doc(id)
      .onSnapshot((d) => cb(d.exists ? Object.assign({ id: d.id }, d.data()) : null), () => cb(null));
  },
  async get(id) {
    const d = await BE.db.collection('weddings').doc(id).get();
    return d.exists ? Object.assign({ id: d.id }, d.data()) : null;
  },
  setTime(id, startMs) { return BE.db.collection('weddings').doc(id).update({ startMs: Number(startMs) || 0 }); },
  callOff(id) { return BE.db.collection('weddings').doc(id).update({ state: 'called-off' }); },
  drop(id) { return BE.db.collection('weddings').doc(id).delete(); },

  /* An answer and the step it moves. Written together so the room can never
     sit on a question that has already been answered. */
  async answer(id, w, vowKey, yes) {
    const patch = { step: (w.step | 0) + 1 };
    patch['vows.' + vowKey] = !!yes;
    if (!yes) { patch.state = 'called-off'; patch.doneAt = Date.now(); }
    await BE.db.collection('weddings').doc(id).update(patch);
  },
  /* Moving on where nothing was asked - Cupid's own lines. */
  async onward(id, w) {
    const next = (w.step | 0) + 1;
    const patch = { step: next };
    if (wedStep(next).id === 'declare') { patch.state = 'married'; patch.doneAt = Date.now(); }
    await BE.db.collection('weddings').doc(id).update(patch);
  },

  /* ---- seats ---- */
  seat(id) { return BE.db.collection('weddings').doc(id).collection('guests').doc(this.me()); },
  async sit(id, name) {
    await this.seat(id).set({ uid: this.me(), name: String(name || '').slice(0, 40), seen: Date.now() }, { merge: true });
    /* Kept under the guest's own account as well, so the invitation survives a
       new phone: this is the only place the app can look it up from. */
    const list = store.get('nabu-weddings', []) || [];
    if (list.indexOf(id) < 0) { list.push(id); store.set('nabu-weddings', list.slice(-12)); }
    try { await BE.db.collection('users').doc(this.me()).set({ weddings: list }, { merge: true }); } catch (e) { /* offline */ }
  },
  stillHere(id) { return this.seat(id).set({ seen: Date.now() }, { merge: true }).catch(() => {}); },
  watchGuests(id, cb) {
    if (!this.ok() || !id) return () => {};
    return BE.db.collection('weddings').doc(id).collection('guests')
      .onSnapshot((s) => cb(s.docs.map((d) => d.data())), () => cb([]));
  },

  /* ---- what the room throws ---- */
  giveGift(id, kind) {
    return BE.db.collection('weddings').doc(id).collection('gifts').doc(this.me() + '__' + Date.now()).set({
      from: this.me(), name: (PROFILE && PROFILE.name) || '', kind: kind, at: Date.now()
    });
  },
  watchGifts(id, cb) {
    if (!this.ok() || !id) return () => {};
    return BE.db.collection('weddings').doc(id).collection('gifts')
      .onSnapshot((s) => cb(s.docs.map((d) => d.data()).sort((x, y) => (y.at || 0) - (x.at || 0))), () => cb([]));
  },

  /* ---- the bouquet ----
     Thrown first, landed ten seconds later, in two writes. Everybody watching
     sees the throw at the same moment and waits the same wait; if the winner
     were chosen in one write the answer would already be in the room while the
     flowers were still in the air. */
  async throwBouquet(id, guests) {
    const here = this.present(guests).filter((g) => this.mine ? true : true);
    await BE.db.collection('weddings').doc(id).update({ bouquet: { at: Date.now(), by: this.me(), n: here.length } });
    return here;
  },
  async landBouquet(id, here) {
    const pool = here || [];
    if (!pool.length) { await BE.db.collection('weddings').doc(id).update({ 'bouquet.none': true }); return null; }
    const r = new Uint32Array(1);
    (window.crypto || window.msCrypto).getRandomValues(r);
    const won = pool[r[0] % pool.length];
    await BE.db.collection('weddings').doc(id).update({ 'bouquet.uid': won.uid, 'bouquet.name': won.name || '' });
    return won;
  }
};

/* -------------------------------------------------------------- the music

   Written here rather than fetched: a handful of oscillators and an envelope.
   Nothing is downloaded, nothing belongs to anybody else, and it works with
   the phone in flight mode. It only ever starts inside a press. */
const WEDMUSIC = {
  ctx: null, gain: null, timers: [], on: true,
  wake() {
    if (!this.on) return null;
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      this.ctx = new AC();
      this.gain = this.ctx.createGain();
      this.gain.gain.value = 0.16;
      this.gain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
    return this.ctx;
  },
  /* One note: a soft triangle with a slow attack, which is as close to a
     chapel organ as two lines of code get. */
  note(freq, at, dur, vol) {
    const c = this.ctx;
    if (!c) return;
    const o = c.createOscillator(), g = c.createGain();
    o.type = 'triangle'; o.frequency.value = freq;
    const t0 = c.currentTime + at;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol || 0.5, t0 + 0.06);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(this.gain);
    o.start(t0); o.stop(t0 + dur + 0.05);
  },
  /* The walk in: a slow rising figure, unhurried, in a major key. */
  processional() {
    if (!this.wake()) return;
    const n = [392, 523.25, 587.33, 659.25, 587.33, 523.25, 493.88, 523.25];
    n.forEach((f, i) => { this.note(f, i * 0.62, 1.5, 0.34); this.note(f / 2, i * 0.62, 1.6, 0.2); });
  },
  /* The moment itself: a fanfare, then a chord that hangs. */
  fanfare() {
    if (!this.wake()) return;
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => this.note(f, i * 0.13, 0.9, 0.5));
    [523.25, 659.25, 783.99, 1046.5].forEach((f) => this.note(f, 0.62, 2.6, 0.34));
    [261.63, 392].forEach((f) => this.note(f, 0.62, 2.8, 0.24));
  },
  /* A small bright ring for a gift, an answer, a bouquet caught. */
  chime(kind) {
    if (!this.wake()) return;
    const set = kind === 'no' ? [349.23, 293.66] : kind === 'win' ? [659.25, 880, 1174.7] : [880, 1174.7];
    set.forEach((f, i) => this.note(f, i * 0.1, 0.5, 0.34));
  },
  mute(off) {
    this.on = !off;
    store.set('nabu-wed-mute', !!off);
    if (off && this.gain) this.gain.gain.value = 0;
    else if (this.gain) this.gain.gain.value = 0.16;
  },
  muted() { return store.get('nabu-wed-mute', false) === true; }
};
