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
const WED_CALL_MS = 2 * 60 * 1000;    /* and this long before, the room is called to order */
const WED_GRACE_MS = 15 * 60 * 1000;  /* how late a couple may be before the room gives up */
const WED_SHUT_MS = 3 * 60 * 1000;    /* and how long it stays open to say so */

/* Three, not eight. A wedding gift is chosen in a second, in front of a room -
   the long shelf belongs to the thread, where one person gives another
   something quietly. */
const WED_GIFTS = [
  { id: 'flowers', sym: '\uD83D\uDC90', name: { vi: 'Bó hoa', en: 'Flowers' } },
  { id: 'cake', sym: '\uD83C\uDF70', name: { vi: 'Bánh cưới', en: 'A cake' } },
  { id: 'choc', sym: '\uD83C\uDF6B', name: { vi: 'Sô-cô-la', en: 'Chocolates' } }
];
const wedGiftOf = (id) => WED_GIFTS.filter((g) => g.id === id)[0] || WED_GIFTS[0];

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
    /* Nobody came. The room stays open a few minutes to say so, and to let the
       people who did come read it, then closes. */
    if (this.noShow(w, t)) return t > start + WED_GRACE_MS + WED_SHUT_MS ? 'over' : 'open';
    return 'open';
  },
  /* A ceremony that never began, a quarter of an hour after its hour. */
  noShow(w, now) {
    if (!w || w.doneAt || (w.step | 0) > 0) return false;
    return (now || Date.now()) > this.startMs(w) + WED_GRACE_MS;
  },
  /* How long the room has left before it closes itself. */
  shutsIn(w) { return this.startMs(w) + WED_GRACE_MS + WED_SHUT_MS - Date.now(); },
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
  /* Asking somebody who is already here. It lands under them, so only they
     can read it, and it says enough to be answered without opening anything. */
  async invite(w, handle) {
    const who = await LOVEDB.findByHandle(handle);
    if (!who) throw new Error('nobody');
    if (w.uids.indexOf(who.uid) > -1) throw new Error('yourself');
    await BE.db.collection('wedasks').doc(who.uid).collection('from').doc(this.me()).set({
      from: this.me(), wid: w.id, names: (w.aName || '') + ' & ' + (w.bName || ''),
      by: (PROFILE && PROFILE.name) || '', startMs: Number(w.startMs) || 0, at: Date.now()
    });
    return who;
  },
  watchAsks(cb) {
    if (!this.ok()) return () => {};
    return BE.db.collection('wedasks').doc(this.me()).collection('from')
      .onSnapshot((s) => cb(s.docs.map((d) => d.data())), () => cb([]));
  },
  clearAsk(from) { return BE.db.collection('wedasks').doc(this.me()).collection('from').doc(from).delete().catch(() => {}); },

  /* What the room says. Short, signed, and in the order it was said. */
  say(id, text) {
    const t = String(text || '').trim().slice(0, 300);
    if (!t) return Promise.resolve();
    return BE.db.collection('weddings').doc(id).collection('says').doc(this.me() + '__' + Date.now()).set({
      from: this.me(), name: (PROFILE && PROFILE.name) || '', text: t, at: Date.now()
    });
  },
  watchSays(id, cb) {
    if (!this.ok() || !id) return () => {};
    return BE.db.collection('weddings').doc(id).collection('says')
      .onSnapshot((s) => cb(s.docs.map((d) => d.data()).sort((x, y) => (x.at || 0) - (y.at || 0))), () => cb([]));
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
  async throwBouquet(id, w, guests) {
    const pair = (w && w.uids) || [];
    const here = this.present(guests).filter((g) => pair.indexOf(g.uid) < 0);
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
  ctx: null, gain: null, timers: [], on: true, dead: false,
  wake() {
    if (!this.on || this.dead) return null;
    /* A machine with no sound device throws here, and this is called from
       inside a timer - where a throw takes the timer, and the ceremony, with
       it. Nothing about a wedding should depend on the speakers working. */
    try {
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) { this.dead = true; return null; }
        this.ctx = new AC();
        this.gain = this.ctx.createGain();
        this.gain.gain.value = 0.16;
        this.gain.connect(this.ctx.destination);
      }
      if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
      return this.ctx;
    } catch (e) { this.dead = true; return null; }
  },
  /* One note: a soft triangle with a slow attack, which is as close to a
     chapel organ as two lines of code get. */
  note(freq, at, dur, vol) {
    const c = this.ctx;
    if (!c) return;
    try {
    const o = c.createOscillator(), g = c.createGain();
    o.type = 'triangle'; o.frequency.value = freq;
    const t0 = c.currentTime + at;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol || 0.5, t0 + 0.06);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(this.gain);
    o.start(t0); o.stop(t0 + dur + 0.05);
    } catch (e) { this.dead = true; }
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


/* ------------------------------------------------------------- Nabu Cupid

   Not a cherub with a bow. A small figure of light holding the two ends of the
   red thread, because that is what this app's marriage is made of and a stock
   cupid would belong to some other story. Drawn, so it costs nothing and works
   with the phone in flight mode. */
function cupidSVG(mood) {
  const joy = mood === 'joy';
  const glow = joy ? '.95' : '.55';
  const CREAM = '#FFFDF6', EDGE = '#D6BEF0', SKIN = '#FFF6EC', SKIN_E = '#E7CDBA';
  const HAIR = '#F2D9A6', HAIR_D = '#E0BE7E', EYE = '#4B2E86', BLUSH = '#F7B7C4';
  /* Held between the two hands and dipping, with the knot at the bottom of the
     dip - the one part of the first drawing that already said the right thing. */
  const CORD = 'M25 78 C 38 106, 82 106, 95 78';
  const heart = (x, y, sc, fill, op) => '<g transform="translate(' + x + ',' + y + ') scale(' + sc + ')" opacity="' + op + '">'
    + '<path d="M0 6 C -7 1, -10 -4, -7 -8 C -4.5 -11, -1 -9.5, 0 -6.5'
    + ' C 1 -9.5, 4.5 -11, 7 -8 C 10 -4, 7 1, 0 6 Z" fill="' + fill + '"/></g>';

  return '<svg viewBox="0 0 120 132" class="cupid ' + (mood || '') + '" role="img" aria-hidden="true">'
    + '<defs>'
    + '<radialGradient id="cupglow"><stop offset="0" stop-color="#FFF3C4" stop-opacity="' + glow + '"/>'
    + '<stop offset="1" stop-color="#FFF3C4" stop-opacity="0"/></radialGradient>'
    + '<linearGradient id="cuprobe" x1="0" y1="0" x2="0" y2="1">'
    + '<stop offset="0" stop-color="' + CREAM + '"/><stop offset="1" stop-color="#E9DAF8"/></linearGradient>'
    + '<linearGradient id="cupwing" x1="0" y1="0" x2="0" y2="1">'
    + '<stop offset="0" stop-color="#FBF6FF"/><stop offset="1" stop-color="#E6D8F7"/></linearGradient>'
    + '</defs>'
    + '<circle cx="60" cy="52" r="54" fill="url(#cupglow)"/>'

    /* wings: a soft curve up, and a scalloped edge underneath so they read as
       feathers rather than as two leaves */
    + '<g stroke="' + EDGE + '" stroke-width="1.5" stroke-linejoin="round">'
    + '<path d="M44 58 C 26 40, 8 40, 6 54 C 4 66, 14 72, 24 70'
    + ' q 3 4, 7 -1 q 3 4, 7 -1 q 3 4, 6 -2 Z" fill="url(#cupwing)"/>'
    + '<path d="M76 58 C 94 40, 112 40, 114 54 C 116 66, 106 72, 96 70'
    + ' q -3 4, -7 -1 q -3 4, -7 -1 q -3 4, -6 -2 Z" fill="url(#cupwing)"/>'
    + '</g>'

    /* a robe that falls in a bell, with a hem */
    + '<path d="M60 52 C 69 52, 74 58, 76 68 L 82 96 C 75 101, 66 103, 60 103'
    + ' C 54 103, 45 101, 38 96 L 44 68 C 46 58, 51 52, 60 52 Z"'
    + ' fill="url(#cuprobe)" stroke="' + EDGE + '" stroke-width="1.6" stroke-linejoin="round"/>'
    + '<path d="M39 95 C 47 100, 73 100, 81 95" fill="none" stroke="' + EDGE + '" stroke-width="1.4" opacity=".8"/>'

    /* sleeves widening to the wrists, and small hands at the ends */
    + '<path d="M46 62 C 38 65, 31 70, 26 76 l 6 5 C 38 74, 44 70, 49 68 Z"'
    + ' fill="url(#cuprobe)" stroke="' + EDGE + '" stroke-width="1.4" stroke-linejoin="round"/>'
    + '<path d="M74 62 C 82 65, 89 70, 94 76 l -6 5 C 82 74, 76 70, 71 68 Z"'
    + ' fill="url(#cuprobe)" stroke="' + EDGE + '" stroke-width="1.4" stroke-linejoin="round"/>'
    + '<circle cx="27.5" cy="79" r="4.6" fill="' + SKIN + '" stroke="' + SKIN_E + '" stroke-width="1.2"/>'
    + '<circle cx="92.5" cy="79" r="4.6" fill="' + SKIN + '" stroke="' + SKIN_E + '" stroke-width="1.2"/>'

    /* a big head on a small body, which is what makes anything look sweet */
    + '<circle cx="60" cy="33" r="19.5" fill="' + SKIN + '" stroke="' + SKIN_E + '" stroke-width="1.4"/>'
    /* hair, with a soft fringe following the curve of the head */
    + '<path d="M41 30 C 41 16, 50 11, 60 11 C 70 11, 79 16, 79 30'
    + ' C 76 25, 72 22, 66 23 C 62 19, 56 19, 52 23 C 46 22, 43 25, 41 30 Z"'
    + ' fill="' + HAIR + '" stroke="' + HAIR_D + '" stroke-width="1.2" stroke-linejoin="round"/>'
    /* eyes with light in them, a small smile, and cheeks */
    + '<ellipse cx="53" cy="34.5" rx="2.9" ry="3.4" fill="' + EYE + '"/>'
    + '<ellipse cx="67" cy="34.5" rx="2.9" ry="3.4" fill="' + EYE + '"/>'
    + '<circle cx="54.1" cy="33.2" r="1.05" fill="#fff"/>'
    + '<circle cx="68.1" cy="33.2" r="1.05" fill="#fff"/>'
    + '<ellipse cx="46.5" cy="39.5" rx="3.6" ry="2.4" fill="' + BLUSH + '" opacity=".62"/>'
    + '<ellipse cx="73.5" cy="39.5" rx="3.6" ry="2.4" fill="' + BLUSH + '" opacity=".62"/>'
    + '<path d="M55.6 41.4 q4.4 3.6, 8.8 0" stroke="' + EYE + '" stroke-width="1.7" fill="none" stroke-linecap="round"/>'
    /* the halo, in the thread's own gold */
    + '<ellipse cx="60" cy="9.5" rx="11" ry="3.4" fill="none" stroke="#E5BE5E" stroke-width="2"/>'

    /* the thread, held */
    + '<path d="' + CORD + '" stroke="#8A0C20" stroke-width="6.4" fill="none" stroke-linecap="round"/>'
    + '<path d="' + CORD + '" stroke="#C4142F" stroke-width="4" fill="none" stroke-linecap="round"/>'
    + '<path d="' + CORD + '" stroke="#F0748C" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".5"/>'
    /* and its knot, a small heart at the bottom of the dip */
    + '<g transform="translate(60,99) scale(.14)">'
    + '<path d="M120 150 C 82 130, 60 102, 68 80 C 75 60, 102 58, 113 76 C 116 81, 118 86, 120 91'
    + ' C 122 86, 124 81, 127 76 C 138 58, 165 60, 172 80 C 180 102, 158 130, 120 150 Z"'
    + ' transform="translate(-120,-104)" fill="none" stroke="#8A0C20" stroke-width="27"/>'
    + '<path d="M120 150 C 82 130, 60 102, 68 80 C 75 60, 102 58, 113 76 C 116 81, 118 86, 120 91'
    + ' C 122 86, 124 81, 127 76 C 138 58, 165 60, 172 80 C 180 102, 158 130, 120 150 Z"'
    + ' transform="translate(-120,-104)" fill="none" stroke="#C4142F" stroke-width="15"/>'
    + '</g>'

    /* small hearts near the hands, more of them when there is something to be
       happy about */
    + heart(23, 26, 0.62, '#F2789F', joy ? '.95' : '.55')
    + heart(97, 30, 0.5, '#F2789F', joy ? '.9' : '.45')
    + (joy ? heart(12, 44, 0.44, '#E5BE5E', '.9') + heart(108, 48, 0.4, '#E5BE5E', '.85') : '')
    + '</svg>';
}

/* Petals and confetti for the moment itself. Twenty spans, each given its own
   drift, which is cheaper than any library and stops when the class goes. */
function wedFallHTML(n) {
  const bits = ['\uD83C\uDF38', '\uD83E\uDD0D', '\u2728', '\uD83C\uDF3A', '\uD83D\uDC96'];
  let out = '<div class="wedfall" aria-hidden="true">';
  for (let i = 0; i < (n || 18); i++) {
    out += '<i style="left:' + Math.round((i * 5.6 + (i % 3) * 4) % 100) + '%;'
      + 'animation-delay:' + (i * 240) + 'ms;animation-duration:' + (4200 + (i % 5) * 900) + 'ms">'
      + bits[i % bits.length] + '</i>';
  }
  return out + '</div>';
}

const wedWhen = (ms) => {
  const d = new Date(Number(ms) || 0);
  if (isNaN(d)) return '';
  return T().dateFmt(d) + ' \u00b7 ' + pad2(d.getHours()) + ':' + pad2(d.getMinutes());
};
/* Local time as the value an <input type=datetime-local> wants. */
const wedLocalValue = (ms) => {
  const d = new Date(Number(ms) || Date.now());
  return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate())
    + 'T' + pad2(d.getHours()) + ':' + pad2(d.getMinutes());
};
/* The doors, not the ceremony. Under a locked door the useful number is when
   it unlocks, and the two are a quarter of an hour apart. */
const wedDoorAt = (w) => WED.startMs(w) - WED_OPEN_MS;
const wedCountdown = (ms) => {
  const left = Math.max(0, Number(ms) - Date.now());
  const h = Math.floor(left / 3600000), m = Math.floor((left % 3600000) / 60000), s2 = Math.floor((left % 60000) / 1000);
  const d = Math.floor(h / 24);
  const S = T();
  if (d > 0) return S.wedInDays(d, h % 24);
  if (h > 0) return h + 'h ' + pad2(m) + 'm';
  return pad2(m) + ':' + pad2(s2);
};

/* ================================ the screen ============================== */

/* What has been answered so far, for the whole room. Each line is one promise
   and the word that answered it - which is the part a guest came to see. */
function vowsHTML(w) {
  const S = T(), v = (w && w.vows) || {};
  const rows = [
    ['takeA', w.aName || ''], ['takeB', w.bName || ''],
    ['keepA', w.aName || ''], ['keepB', w.bName || '']
  ].filter((r) => v[r[0]] !== undefined);
  if (!rows.length) return '';
  return '<div class="vowsaid">' + rows.map((r) =>
    '<span class="vs' + (v[r[0]] ? ' yes' : ' no') + '"><i>' + (v[r[0]] ? '\u2713' : '\u2014') + '</i>'
    + esc(r[1]) + '<b>' + esc(v[r[0]] ? S.wedIDo : S.wedNotYet) + '</b></span>').join('') + '</div>';
}

/* Sounds that must happen once per visit, not once per repaint. */
const PLAYED = { call: false };

function renderWedding(args) {
  const S = T(), m = $('#main');
  const wanted = (args && args[0]) || '';
  let stop = [], tick = null, beat = null;
  const cleanup = () => {
    stop.forEach((f) => { try { f(); } catch (e) { /* already gone */ } });
    stop = [];
    if (tick) { clearInterval(tick); tick = null; }
    if (beat) { clearInterval(beat); beat = null; }
  };
  NAV.cleanup = cleanup;

  const head = (sub) => '<div class="eyebrow">' + esc(CONFIG.brand) + '</div>'
    + '<h1 style="margin-bottom:6px">\uD83D\uDC92 ' + esc(S.wedTitle) + '</h1>'
    + '<p class="muted">' + esc(sub || S.wedIntro) + '</p>';

  const shut = (why) => {
    m.innerHTML = head(why)
      + '<div class="card wedcard"><p style="text-align:center;margin:0">' + cupidSVG() + '</p>'
      + '<p class="lead" style="text-align:center">' + esc(why) + '</p>'
      + '<a class="btn block" href="#/love">' + esc(S.loveTitle) + '</a></div>';
  };

  /* ---------------------------------------------------------- the guest door */
  const drawDoor = (w, guests) => {
    const door = WED.doorState(w);
    const names = esc(w.aName || S.loveSomeone) + ' \u2764 ' + esc(w.bName || S.loveSomeone);
    if (door === 'early') {
      m.innerHTML = head(S.wedGuestIntro)
        + '<div class="card wedcard">' + cupidSVG()
        + '<p class="wedpair">' + names + '</p>'
        + '<p class="wedwhen">' + esc(wedWhen(w.startMs)) + '</p>'
        + '<p class="wedcount" id="wedcd">' + esc(wedCountdown(w.startMs)) + '</p>'
        + '<p class="hint" style="text-align:center">' + esc(S.wedDoorEarly) + '</p></div>'
        + '<div class="card"><h3 style="margin-bottom:6px">\uD83D\uDCC5 ' + esc(S.wedRemember) + '</h3>'
        + '<p class="hint" style="margin-bottom:10px">' + esc(S.wedRememberHint) + '</p>'
        + '<button type="button" class="btn block" id="wedics">' + esc(S.wedAddCal) + '</button></div>';
      tick = setInterval(() => { const el = $('#wedcd'); if (el) el.textContent = wedCountdown(w.startMs); if (Date.now() > w.startMs - WED_OPEN_MS) paint(); }, 1000);
      const ics = $('#wedics');
      if (ics) ics.addEventListener('click', () => wedSaveIcs(w));
      return;
    }
    if (door === 'over') {
      const won = w.bouquet && w.bouquet.name;
      m.innerHTML = head(S.wedGuestIntro)
        + '<div class="card wedcard done">' + cupidSVG('joy')
        + '<p class="wedpair">' + names + '</p>'
        + '<p class="lead" style="text-align:center">' + esc(w.state === 'married' ? S.wedOverMarried : S.wedOverCalled) + '</p>'
        + (w.state === 'married' && w.doneAt ? '<p class="wedwhen">' + esc(wedWhen(w.doneAt)) + '</p>' : '')
        + (won ? '<p class="hint" style="text-align:center">\uD83D\uDC90 ' + esc(S.wedCaught(won)) + '</p>' : '')
        + '</div>'
        + (w.state === 'married' ? '<div class="card tellcard">'
          + '<div class="ghead"><span class="gk">\uD83D\uDCE3</span><h3>' + esc(S.wedTellTitle) + '</h3></div>'
          + '<p class="tellline">\u201C' + esc(S.wedShareGuest(w.aName || '', w.bName || '')) + '\u201D</p>'
          + shareRowHTML('wedshare') + '</div>' : '');
      bindShareRow(m, () => ({ text: S.wedShareGuest(w.aName || '', w.bName || ''), url: appURL() + '#/home' }));
      return;
    }
    drawRoom(w, guests);
  };


  /* Both ways of asking somebody: a link for whoever is elsewhere, a name for
     whoever is already here. Available the whole time, including from inside
     the room - which is when a wedding actually needs it. */
  const inviteHTML = (w) => {
    const link = appURL() + '#/wedding/' + encodeURIComponent(w.id);
    const asked = (store.get('nabu-wed-asked', {}) || {})[w.id] || [];
    return '<div class="card invitecard">'
      + '<div class="ghead"><span class="gk">\uD83D\uDC8C</span><h3>' + esc(S.wedInviteTitle) + '</h3></div>'
      + '<p class="hint" style="margin-bottom:10px">' + esc(S.wedAskInApp) + '</p>'
      + '<div class="row nw athandle"><span class="at">@</span>'
      + '<input id="wedwho" maxlength="20" autocapitalize="none" spellcheck="false" placeholder="' + esc(S.loveHandlePh) + '">'
      + '<button type="button" class="btn" id="wedaskgo">' + esc(S.wedAskSend) + '</button></div>'
      + '<p class="hint" id="wedaskst"></p>'
      + (asked.length ? '<p class="hint">' + esc(S.wedAsked(asked.length)) + ' ' + esc(asked.join(', ')) + '</p>' : '')
      + '<p class="hint" style="margin-top:14px">' + esc(S.wedInviteHint) + '</p>'
      + '<input id="wedurl" readonly value="' + esc(link) + '">'
      + shareRowHTML('wedinv') + '</div>';
  };

  /* Both halves of it are bound together, wherever the card was drawn. */
  const bindInvite = (w) => {
    const link = appURL() + '#/wedding/' + encodeURIComponent(w.id);
    if (!$('#wedwho')) return;
    bindShareRow(m, () => ({ text: S.wedInviteText(w.aName || '', w.bName || '', wedWhen(w.startMs)), url: link }));
    const box = $('#wedwho'), go = $('#wedaskgo'), st = $('#wedaskst');
    const send = async () => {
      const h = String(box.value || '').trim().replace(/^@/, '');
      if (!h) return;
      go.disabled = true; st.className = 'hint'; st.textContent = S.loveLooking;
      try {
        const who = await WED.invite(w, h);
        const all = store.get('nabu-wed-asked', {}) || {};
        const list = all[w.id] || [];
        const nm = who.name || ('@' + (who.handle || h));
        if (list.indexOf(nm) < 0) list.push(nm);
        all[w.id] = list; store.set('nabu-wed-asked', all);
        /* Emptied at once, so the next name goes straight in. */
        box.value = '';
        st.className = 'hint ok'; st.textContent = S.wedAskDone(nm);
        toast(S.wedAskDone(nm));
        paint();
      } catch (e) {
        st.className = 'hint err';
        st.textContent = e.message === 'nobody' ? S.loveNoOne
          : e.message === 'yourself' ? S.wedAskSelf : loveWhy(e);
      }
      go.disabled = false;
      if ($('#wedwho')) $('#wedwho').focus();
    };
    go.addEventListener('click', send);
    box.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); send(); } });
  };

  /* ------------------------------------------------------------- the room --- */
  let gifts = [], guests = [], says = [], bouquetShown = 0;
  const drawRoom = (w) => {
    const side = WED.side(w), mine = !!side, step = wedStep(w.step | 0);
    const names = esc(w.aName || S.loveSomeone) + ' \u2764 ' + esc(w.bName || S.loveSomeone);
    /* The doors open early so people can gather; the ceremony still begins at
       the hour it was booked for. */
    const startMs = WED.startMs(w);
    const waiting = !w.doneAt && (w.step | 0) === 0 && Date.now() < startMs;
    const nearly = waiting && startMs - Date.now() <= WED_CALL_MS;
    const askingMe = mine && step.who === side && !w.doneAt;
    const theirTurn = mine && step.who && step.who !== side && !w.doneAt;
    const line = S.wedSay[step.id](w.aName || S.loveSomeone, w.bName || S.loveSomeone);
    const here = WED.present(guests);
    const called = w.state === 'called-off';

    const gone = WED.noShow(w);
    let act = '';
    if (called) {
      act = '<p class="hint err" style="text-align:center">' + esc(S.wedCalledOff) + '</p>';
    } else if (gone) {
      /* Said to whoever came, which is the point of saying it at all. */
      act = '<p class="lead">' + esc(S.wedNoShow) + '</p>'
        + '<p class="hint">' + esc(S.wedNoShowSorry) + '</p>'
        + '<p class="wedcount" id="wedshut">' + esc(wedCountdown(Date.now() + Math.max(0, WED.shutsIn(w)))) + '</p>'
        + '<p class="hint">' + esc(S.wedNoShowShut) + '</p>'
        + (mine ? '<a class="btn block" href="#/wedding" style="margin-top:10px">' + esc(S.wedMoveTitle) + '</a>' : '');
    } else if (waiting) {
      /* Everybody in the room is reading the same clock, so nobody has to be
         told when it is about to happen. */
      act = '<p class="wedcount" id="wedgo">' + esc(wedCountdown(startMs)) + '</p>'
        + (nearly ? '<p class="lead attention">\uD83D\uDD14 ' + esc(S.wedAttention) + '</p>' : '')
        + (mine
          ? '<button type="button" class="btn primary block" disabled>' + esc(S.wedStart) + '</button>'
            + '<p class="hint">' + esc(S.wedStartsAt(wedWhen(startMs))) + '</p>'
          : '<p class="hint">' + esc(S.wedGuestWait(wedWhen(startMs))) + '</p>');
    } else if (mine && !w.doneAt && (w.step | 0) === 0) {
      act = '<button type="button" class="btn primary block" id="wedon">' + esc(S.wedStart) + '</button>'
        + '<p class="hint">' + esc(S.wedStartNow) + '</p>';
    } else if (askingMe) {
      act = '<div class="vowrow"><button type="button" class="btn primary" id="wedyes">' + esc(S.wedIDo) + '</button>'
        + '<button type="button" class="btn" id="wedno">' + esc(S.wedNotYet) + '</button></div>'
        + '<p class="hint" style="text-align:center">' + esc(S.wedAnswerHint) + '</p>';
    } else if (theirTurn) {
      act = '<p class="hint" style="text-align:center">' + esc(S.wedWaitingFor(step.who === 'a' ? (w.aName || '') : (w.bName || ''))) + '</p>';
    } else if (mine && !step.who && !w.doneAt) {
      act = '<button type="button" class="btn primary block" id="wedon">' + esc(S.wedGoOn) + '</button>';
    } else if (!mine && !w.doneAt) {
      act = '<p class="hint" style="text-align:center">' + esc(S.wedWatching) + '</p>';
    }

    /* the bouquet, after the vows */
    let bq = '';
    if (w.doneAt && w.state === 'married') {
      const b2 = w.bouquet || null;
      if (!b2 && mine) {
        bq = '<div class="card bqcard"><div class="ghead"><span class="gk">\uD83D\uDC90</span><h3>' + esc(S.wedBqTitle) + '</h3></div>'
          + '<p class="hint">' + esc(S.wedBqHint) + '</p>'
          + '<button type="button" class="btn primary block" id="wedbq"' + (here.length ? '' : ' disabled') + '>' + esc(S.wedBqThrow) + '</button>'
          + '<p class="hint">' + esc(here.length ? S.wedBqReady(here.length) : S.wedBqNobody) + '</p></div>';
      } else if (b2 && !b2.uid && !b2.none) {
        bq = '<div class="card bqcard flying">' + wedFallHTML(10)
          + '<p class="bqair">\uD83D\uDC90</p>'
          + '<p class="lead" style="text-align:center">' + esc(S.wedBqAir) + '</p></div>';
      } else if (b2 && b2.uid) {
        bq = '<div class="card bqcard won">' + wedFallHTML(12)
          + '<p class="bqair still">\uD83D\uDC90</p>'
          + '<p class="lead" style="text-align:center">' + esc(S.wedCaught(b2.name || S.loveSomeone)) + '</p></div>';
      } else if (b2 && b2.none) {
        bq = '<div class="card bqcard"><p class="hint" style="text-align:center">' + esc(S.wedBqNobody) + '</p></div>';
      }
    }

    /* what the room is throwing */
    /* What the room has brought: a tally the couple can read at a glance, and
       the arrivals themselves, newest first, each naming who sent it. */
    const tally = WED_GIFTS.map((g) => ({ g: g, n: gifts.filter((x) => x.kind === g.id).length }))
      .filter((t) => t.n > 0);
    const feed = gifts.slice(0, 20).map((x) => '<li><span class="wgs">' + wedGiftOf(x.kind).sym + '</span>'
      + '<b>' + esc(x.name || S.loveSomeone) + '</b>'
      + '<span class="wgw">' + esc(S.wedGave(L(wedGiftOf(x.kind).name))) + '</span></li>').join('');
    const giftBox = '<div class="card wishcard">'
      + (gifts.length ? wedFallHTML(6) : '')
      + '<div class="ghead"><span class="gk">\uD83C\uDF89</span><h3>' + esc(S.wedWishTitle) + '</h3></div>'
      + '<p class="hint" style="margin-bottom:10px">' + esc(S.wedWishHint) + '</p>'
      + (tally.length
        ? '<div class="wgtally">' + tally.map((t) => '<span><i>' + t.g.sym + '</i>' + t.n + '</span>').join('')
          + '<span class="all">' + esc(S.wedGiftsTotal(gifts.length)) + '</span></div>'
        : '')
      /* Guests bring things; the couple are the ones being brought them. */
      + (mine ? '' : '<div class="wgpick">' + WED_GIFTS.map((g) =>
        '<button type="button" class="wgp" data-wgift="' + g.id + '"><i>' + g.sym + '</i><b>' + esc(L(g.name)) + '</b></button>').join('') + '</div>')
      + (feed ? '<ul class="wgfeed">' + feed + '</ul>'
        : '<p class="hint">' + esc(S.wedNoWishes) + '</p>')
      + '</div>';

    m.innerHTML = '<div class="wedroom">'
      + (w.doneAt && w.state === 'married' ? wedFallHTML(18) : '')
      + '<div class="card wedcard live">'
      + '<button type="button" class="mutebtn" id="wedmute" aria-label="' + esc(S.wedMute) + '">' + (WEDMUSIC.on ? '\uD83D\uDD0A' : '\uD83D\uDD07') + '</button>'
      + cupidSVG(w.doneAt && w.state === 'married' ? 'joy' : '')
      + '<p class="wedpair">' + names + '</p>'
      + '<p class="cupidname">' + esc(S.wedCupid) + '</p>'
      + '<p class="wedsay">' + esc(line) + '</p>'
      /* Cupid asks in front of everybody; the point of that is that everybody
         hears the reply. */
      + vowsHTML(w)
      + act + '</div>'
      + bq
      + '<div class="card"><h3 style="margin-bottom:4px">\uD83D\uDC65 ' + esc(S.wedGuests(guests.length)) + '</h3>'
      + (guests.length ? '<p class="hint">' + esc(guests.slice(0, 24).map((g) => g.name || S.loveSomeone).join(' \u00b7 ')) + '</p>'
        : '<p class="hint">' + esc(S.wedNoGuests) + '</p>') + '</div>'
      /* The couple can go on inviting people from inside the room, which is
         when somebody is usually asking for the link. */
      + (mine ? inviteHTML(w) : '')
      + giftBox
      /* A wedding you can speak at. Everyone in the room, the couple included. */
      + '<div class="card saycard"><div class="ghead"><span class="gk">\uD83D\uDCAC</span><h3>' + esc(S.wedSayTitle) + '</h3></div>'
      + (says.length
        ? '<ul class="saylist" id="saylist">' + says.slice(-60).map((x) =>
          '<li' + (x.from === (BE.user ? BE.user.uid : '') ? ' class="me"' : '') + '>'
          + '<b>' + esc(x.name || S.loveSomeone) + '</b><span>' + esc(x.text) + '</span></li>').join('') + '</ul>'
        : '<p class="hint">' + esc(S.wedSayNone) + '</p>')
      + '<div class="row nw saybar"><input id="wedsayin" maxlength="300" placeholder="' + esc(S.wedSayPh) + '">'
      + '<button type="button" class="btn primary" id="wedsaygo">' + esc(S.wedSayGo) + '</button></div>'
      + '</div>'
      + (mine ? '<p class="hint" style="text-align:center">' + esc(S.wedLeaveOk) + '</p>' : '')
      + '</div>';

    if (gone) {
      if (tick) { clearInterval(tick); tick = null; }
      tick = setInterval(() => {
        const el = $('#wedshut');
        const left = Math.max(0, WED.shutsIn(w));
        if (el) el.textContent = wedCountdown(Date.now() + left);
        if (left <= 0) {
          /* Whoever is the couple closes it for good; a guest simply sees the
             door shut on the next repaint. */
          if (mine && w.state !== 'ended') BE.db.collection('weddings').doc(w.id).update({ state: 'ended' }).catch(() => {});
          paint();
        }
      }, 1000);
    }
    /* While the room waits, it counts - and two minutes out it calls itself to
       order and the processional plays, once, for anybody with the sound on. */
    if (waiting) {
      if (tick) { clearInterval(tick); tick = null; }
      tick = setInterval(() => {
        const el = $('#wedgo');
        if (el) el.textContent = wedCountdown(startMs);
        const left = startMs - Date.now();
        if (left <= WED_CALL_MS && !PLAYED.call) { PLAYED.call = true; WEDMUSIC.processional(); paint(); }
        if (left <= 0) paint();
      }, 1000);
    }
    /* Browsers only allow sound that a person started, so the first touch
       anywhere in the room is what wakes it. */
    m.addEventListener('click', () => { WEDMUSIC.wake(); }, { once: true });

    /* answering */
    const ans = async (yes) => {
      try {
        WEDMUSIC.chime(yes ? '' : 'no');
        await WED.answer(w.id, w, step.vow, yes);
      } catch (e) { toast(loveWhy(e)); }
    };
    { const y = $('#wedyes'); if (y) y.addEventListener('click', () => { y.disabled = true; ans(true); }); }
    { const n = $('#wedno'); if (n) n.addEventListener('click', () => { if (!confirm(S.wedNoSure)) return; ans(false); }); }
    { const o = $('#wedon');
      if (o) o.addEventListener('click', async () => {
        o.disabled = true;
        try {
          await WED.onward(w.id, w);
          /* Reaching the declaration is the moment the thread itself changes:
             the marriage is recorded on the bond, not only in the story. */
          if (wedStep((w.step | 0) + 1).id === 'declare') {
            WEDMUSIC.fanfare();
            try { await LOVEDB.marry(w.id); } catch (e) { /* already married */ }
          } else { WEDMUSIC.chime(); }
        } catch (e) { o.disabled = false; toast(loveWhy(e)); }
      }); }
    bindInvite(w);
    { /* Said once, and shown to everybody. */
      const box = $('#wedsayin'), go = $('#wedsaygo');
      const send = async () => {
        const t = box.value.trim();
        if (!t) return;
        box.value = ''; go.disabled = true;
        try { await WED.say(w.id, t); } catch (e) { toast(loveWhy(e)); }
        go.disabled = false; box.focus();
      };
      if (go) go.addEventListener('click', send);
      if (box) box.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); send(); } });
      const list = $('#saylist');
      if (list) list.scrollTop = list.scrollHeight; }
    { const mu = $('#wedmute');
      if (mu) mu.addEventListener('click', () => { WEDMUSIC.mute(WEDMUSIC.on); paint(); }); }

    $$('[data-wgift]', m).forEach((b) => b.addEventListener('click', async () => {
      b.disabled = true;
      try { WEDMUSIC.chime(); await WED.giveGift(w.id, b.getAttribute('data-wgift')); toast(S.loveGiftSent); }
      catch (e) { b.disabled = false; toast(loveWhy(e)); }
    }));

    { const t = $('#wedbq');
      if (t) t.addEventListener('click', async () => {
        t.disabled = true;
        try {
          const pool = await WED.throwBouquet(w.id, w, guests);
          /* Ten seconds in the air, the same ten seconds for everyone, because
             the winner is not written until they land. */
          setTimeout(async () => {
            try { const won = await WED.landBouquet(w.id, pool); if (won) WEDMUSIC.chime('win'); }
            catch (e) { /* somebody else landed it */ }
          }, 10000);
        } catch (e) { t.disabled = false; toast(loveWhy(e)); }
      }); }

    /* The room closes itself five minutes after the vows. */
    if (w.doneAt && mine && Date.now() > w.doneAt + WED_END_MS && w.state !== 'ended' && w.state === 'married') {
      BE.db.collection('weddings').doc(w.id).update({ state: 'ended' }).catch(() => {});
    }
    void bouquetShown;
  };


  /* One page about this wedding: when it is, what it costs, what happens, and
     one button that tells Nabu. Not a price list - they have already chosen. */
  const drawPay = (bond) => {
    const me = WED.me(), you = LOVE.other(bond, me);
    const nm = (you && (you.name || (you.handle ? '@' + you.handle : ''))) || S.loveSomeone;
    /* The hour they are paying for: the one waiting to be booked, or - once
       the room exists - the room's own. It used to look only at the first, so
       "how to pay" from an existing room bounced straight back out. */
    const ms = Number(store.get('nabu-wed-want', 0)) || WED.startMs(wedding) || 0;
    if (!ms) { location.hash = '#/wedding'; return; }
    const price = salePrice(WED_PRICE, 'unlock', 'wedding');
    m.innerHTML = head(S.wedPayIntro)
      + '<div class="card wedcard">' + cupidSVG()
      + '<p class="wedpair">' + esc((PROFILE && PROFILE.name) || S.loveYou) + ' \u2764 ' + esc(nm) + '</p>'
      + '<p class="wedwhen">' + esc(wedWhen(ms)) + '</p>'
      + '<p class="wedprice">' + esc(fmtPrice(price)) + '</p>'
      + '<p class="hint" style="text-align:center">' + esc(S.wedPayOnce) + '</p></div>'
      + '<div class="card"><h3 style="margin-bottom:6px">' + esc(S.wedPayWhat) + '</h3>'
      + '<ul class="carelist">' + S.wedPayList.map((x) => '<li><span>' + esc(x) + '</span><b>\u2713</b></li>').join('') + '</ul></div>'
      + '<p class="hint hold">' + esc(S.wedPayHold(wedWhen(ms))) + '</p>'
      + (wedding
        ? payPanelHTML(S.wedPayWhat2(wedWhen(ms)), price, payRef('wedding|' + wedding.id), 'wedpanel')
        : '<div class="card"><h3 style="margin-bottom:6px">' + esc(S.wedPayHow) + '</h3>'
          + '<button type="button" class="btn primary block" id="wedpay">' + esc(S.wedPaySend) + '</button>'
          + '<p class="hint" id="wedpayst"></p></div>')
      + '<p style="margin-top:10px"><a class="backlink" href="#/wedding">\u2190 ' + esc(S.wedChangeTime) + '</a></p>';

    if (wedding) {
      bindPayPanel(m, () => ({ what: S.wedPayWhat2(wedWhen(ms)), total: price, ref: payRef('wedding|' + wedding.id) }));
      return;
    }
    $('#wedpay').addEventListener('click', async () => {
      const b = $('#wedpay'), st = $('#wedpayst');
      if (!BE.enabled || !BE.user) { st.className = 'hint err'; st.textContent = S.unlockSendMsg; return; }
      b.disabled = true; st.className = 'hint'; st.textContent = S.loveSaving;
      try {
        await BE.createUnlockOrder([{ id: 'wedding', name: L(COURSES.filter((c) => c.id === 'wedding')[0].name)
          + ' \u00b7 ' + wedWhen(ms), price: price }], price);
        /* And the room itself, because the hour is what is being held and an
           hour cannot be held by a room that does not exist. */
        if (!wedding) await WED.create(bond, ms);
        ALERTS.add({ id: 'wed-made-' + WED.idFor(bond) + '-' + ms, k: 'love',
          t: S.wedMadeTitle, b: S.wedMadeBody(wedWhen(ms)), href: '#/wedding' });
        st.className = 'hint ok'; st.textContent = S.wedPaySent;
        toast(S.wedPaySent);
        /* Only if they are still standing here. A delayed jump that fires
           after somebody has walked away drags them back from wherever they
           went, which is worse than not moving them at all. */
        setTimeout(() => { if (location.hash.indexOf('/wedding/pay') > -1) location.hash = '#/wedding'; }, 1200);
      } catch (e) { b.disabled = false; st.className = 'hint err'; st.textContent = loveWhy(e); }
    });
  };

  /* ------------------------------------------------- the couple's own screen */
  const drawPlan = (bond, w) => {
    const me = WED.me(), you = LOVE.other(bond, me);
    const nm = (you && (you.name || (you.handle ? '@' + you.handle : ''))) || S.loveSomeone;
    if (!w) {
      /* The hour they chose before paying, if they chose one. */
      const wanted2 = Number(store.get('nabu-wed-want', 0)) || 0;
      const soon = new Date(wanted2 > Date.now() ? wanted2 : Date.now() + 3 * 86400000);
      if (!wanted2) soon.setHours(19, 0, 0, 0);
      m.innerHTML = head()
        + '<div class="card wedcard">' + cupidSVG()
        + '<p class="lead" style="text-align:center">' + esc(S.wedPlanLead(nm)) + '</p>'
        + '<p class="hint" style="text-align:center">' + esc(ACCESS.has('wedding') ? S.wedPlanHint : S.wedPlanPay(fmtPrice(salePrice(WED_PRICE, 'unlock', 'wedding')))) + '</p></div>'
        + '<div class="card"><h3 style="margin-bottom:6px">\uD83D\uDD52 ' + esc(S.wedWhen) + '</h3>'
        + '<p class="hint" style="margin-bottom:10px">' + esc(S.wedWhenHint) + '</p>'
        + '<p class="hint hold">' + esc(S.wedBeThere) + '</p>'
        + '<input type="datetime-local" id="wedat" value="' + esc(wedLocalValue(soon.getTime())) + '">'
        + '<button type="button" class="btn primary block" id="wedmake" style="margin-top:10px">' + esc(S.wedMake) + '</button>'
        + '<p class="hint" id="wedst"></p></div>';
      $('#wedmake').addEventListener('click', async () => {
        const b = $('#wedmake'), st = $('#wedst'), v = $('#wedat').value;
        const ms = new Date(v).getTime();
        if (!v || isNaN(ms) || ms < Date.now() + 10 * 60000) { st.className = 'hint err'; st.textContent = S.wedWhenBad; return; }
        /* The hour is kept whatever happens next, so that coming back with a
           code does not mean choosing it all over again. */
        store.set('nabu-wed-want', ms);
        if (!ACCESS.has('wedding')) { location.hash = '#/wedding/pay'; return; }
        b.disabled = true; st.className = 'hint'; st.textContent = S.loveSaving;
        try { await WED.create(bond, ms); store.set('nabu-wed-want', 0); toast(S.wedMade); }
        catch (e) { b.disabled = false; st.className = 'hint err'; st.textContent = loveWhy(e); }
      });
      return;
    }

    /* The couple are no longer thrown into the room the moment it opens: that
       took the invitation link off the screen at exactly the quarter of an hour
       when the late ones are asking for it. */
    const door = WED.doorState(w);
    if (door === 'over') { drawDoor(w); return; }
    const openNow = door === 'open';
    const paidFor = ACCESS.has('wedding');

    const link = appURL() + '#/wedding/' + encodeURIComponent(w.id);
    const asked = (store.get('nabu-wed-asked', {}) || {})[w.id] || [];
    m.innerHTML = head()
      + '<div class="card wedcard">' + cupidSVG()
      + '<p class="wedready">' + esc(S.wedReady) + '</p>'
      + '<p class="wedpair">' + esc(w.aName || '') + ' \u2764 ' + esc(w.bName || '') + '</p>'
      + '<p class="wedwhen">' + esc(wedWhen(w.startMs)) + '</p>'
      + '<p class="wedcount" id="wedcd">' + esc(openNow ? S.wedDoorsOpen : wedCountdown(wedDoorAt(w))) + '</p>'
      /* The way in, first, because it is what the screen is for. Locked until
         a quarter of an hour before, and saying how long that is. */
      /* Asking holds the hour; paying opens the door. The button says which
         of those has happened rather than letting somebody through and finding
         out later. */
      + (openNow && paidFor
        ? '<a class="btn primary block" href="#/wedding/room">' + esc(S.wedEnter) + '</a>'
        : '<button type="button" class="btn primary block" disabled>' + esc(paidFor ? S.wedEnterLater : S.wedEnterUnpaid) + '</button>')
      + '<p class="hint">' + esc(!paidFor ? S.wedWaitPay : openNow ? S.wedEnterNow : S.wedShutFor) + '</p>'
      + '<p class="hint">' + esc(S.wedBeThere) + '</p>'
      /* Unpaid, said once, softly, with the way to settle it. */
      + (ACCESS.has('wedding') ? ''
        : '<p class="hint hold">' + esc(S.wedUnpaid) + ' <a href="#/wedding/pay">' + esc(S.wedPayNow) + ' \u2192</a></p>')
      /* And moving it, immediately beneath, folded until it is wanted. */
      + '<details class="sect movewhen"><summary><span class="si">\uD83D\uDD52</span><b>' + esc(S.wedMoveTitle) + '</b><span class="sx">\u203A</span></summary>'
      + '<div class="sbody"><input type="datetime-local" id="wedat" value="' + esc(wedLocalValue(w.startMs)) + '">'
      + '<button type="button" class="btn block" id="wedmove" style="margin-top:8px">' + esc(S.wedMove) + '</button>'
      + '<p class="hint" id="wedst"></p></div></details>'
      + '</div>'
      + inviteHTML(w)
      + '<div class="card"><h3 style="margin-bottom:4px">\uD83D\uDC65 ' + esc(S.wedGuests(guests.length)) + '</h3>'
      + (guests.length ? '<p class="hint">' + esc(guests.map((g) => g.name || S.loveSomeone).join(' \u00b7 ')) + '</p>'
        : '<p class="hint">' + esc(S.wedNoGuestsYet) + '</p>') + '</div>'
      + '<button type="button" class="btn block danger" id="weddrop">\uD83D\uDC94 ' + esc(S.wedDrop) + '</button>'
      + '<p class="hint">' + esc(S.wedDropHint) + '</p>';

    /* When the doors open the screen changes itself, so nobody is left
       wondering whether to keep waiting or keep pressing. */
    if (!openNow) {
      tick = setInterval(() => {
        const el = $('#wedcd');
        if (el) el.textContent = wedCountdown(wedDoorAt(w));
        if (Date.now() > wedDoorAt(w)) paint();
      }, 1000);
    }
    bindInvite(w);
    $('#wedmove').addEventListener('click', async () => {
      const st = $('#wedst'), v = $('#wedat').value, ms = new Date(v).getTime();
      if (!v || isNaN(ms) || ms < Date.now() + 10 * 60000) { st.className = 'hint err'; st.textContent = S.wedWhenBad; return; }
      st.className = 'hint'; st.textContent = S.loveSaving;
      try { await WED.setTime(w.id, ms); st.className = 'hint ok'; st.textContent = S.wedMoved; }
      catch (e) { st.className = 'hint err'; st.textContent = loveWhy(e); }
    });
    $('#weddrop').addEventListener('click', async () => {
      if (!confirm(S.wedDropAsk)) return;
      try { await WED.drop(w.id); toast(S.wedDropped); } catch (e) { toast(loveWhy(e)); }
    });
  };

  /* ------------------------------------------------------------ what to draw */
  let bond = null, wedding = null, ready = false, seated = false;
  const paint = () => {
    if (!ready) return;
    if (tick) { clearInterval(tick); tick = null; }
    if (wanted === 'room') {
      if (!wedding) { shut(S.wedNoRoom); return; }
      drawDoor(wedding, guests);
      return;
    }
    if (wanted === 'pay') {
      if (!bond) { shut(S.wedNeedThread); return; }
      drawPay(bond);
      return;
    }
    if (wanted && (!bond || WED.idFor(bond) !== wanted)) {
      /* Somebody else's wedding: a guest, arriving by link. */
      if (!wedding) { shut(S.wedNoRoom); return; }
      drawDoor(wedding, guests);
      return;
    }
    if (!bond) { shut(S.wedNeedThread); return; }
    if (LOVE.stage(bond) !== 'engaged' && LOVE.stage(bond) !== 'married') { shut(S.wedNeedEngaged); return; }
    /* One of them pays and both are married. Buying is what lets a room be
       made; once it exists it belongs to the couple, so the partner who did
       not pay walks in exactly as the one who did. */
    /* The hour comes first. What it costs is the next screen, not a gate in
       front of the only screen that lets somebody choose anything. */
    drawPlan(bond, wedding);
  };

  const drawOffer = () => {
    const item = COURSES.filter((c) => c.id === 'wedding')[0];
    m.innerHTML = head()
      + '<div class="card wedcard">' + cupidSVG()
      + '<p class="lead" style="text-align:center">' + esc(S.wedOfferLead) + '</p>'
      + '<p class="hint">' + esc(L(item.blurb)) + '</p>'
      + '<ul class="carelist">' + L(item.includes).map((x) => '<li><span>' + esc(x) + '</span><b>\u2713</b></li>').join('') + '</ul>'
      + (isTWA() ? '' : '<p class="wedprice">' + esc(fmtPrice(salePrice(item.price, 'unlock', 'wedding'))) + '</p>')
      + '<a class="btn primary block" href="#/unlock?item=wedding&from=wedding">' + esc(S.wedBuy) + '</a>'
      + '<p class="hint">' + esc(S.wedBuyHint) + '</p></div>';
  };

  if (!WED.ok()) {
    /* Somebody following an invitation who has no account yet. Where they were
       going is remembered, so making an account puts them back at the door
       rather than on the home screen. */
    if (wanted) store.set('nabu-wed-next', wanted);
    m.innerHTML = head(S.wedGuestIntro)
      + '<div class="card wedcard">' + cupidSVG()
      + '<p class="lead">' + esc(S.wedNeedAccount) + '</p>'
      + '<a class="btn primary block" href="#/me?next=wedding">' + esc(S.signIn) + '</a>'
      + '<p class="hint">' + esc(S.wedJoinHint) + '</p></div>';
    return;
  }

  /* The room, whichever one this is. */
  /* The paying step is the couple's own screen under another name, so it needs
     the thread; only a guest's link stands on its own. */
  const guestLink = wanted && wanted !== 'pay' && wanted !== 'room';
  const id = guestLink ? wanted : (LOVE.local().bond || '');
  if (id) {
    stop.push(WED.watch(id, (w) => {
      wedding = w; ready = true;
      /* Enough to draw the line on the profile before the cloud answers. */
      if (w) {
        if (WED.mine(w)) {
          store.set('nabu-wed-mine', { startMs: w.startMs, other: WED.side(w) === 'a' ? (w.bName || '') : (w.aName || '') });
        } else {
          const seen = store.get('nabu-wed-seen', {}) || {};
          seen[w.id] = { startMs: w.startMs, pair: (w.aName || '') + ' & ' + (w.bName || '') };
          store.set('nabu-wed-seen', seen);
        }
      }
      if (w && guestLink && !WED.mine(w)) {
        /* A guest takes a seat once, and then keeps it warm while they watch,
           because the bouquet may only land on somebody actually here. */
        if (!seated) { seated = true; WED.sit(w.id, (PROFILE && PROFILE.name) || '').catch(() => {}); }
        if (!beat) beat = setInterval(() => WED.stillHere(w.id), 20000);
      }
      paint();
    }));
    stop.push(WED.watchGuests(id, (g) => { guests = g; paint(); }));
    stop.push(WED.watchGifts(id, (g) => { gifts = g; paint(); }));
    stop.push(WED.watchSays(id, (l) => { says = l; paint(); }));
  }
  if (!guestLink) {
    stop.push(LOVEDB.watchMine((b) => { bond = b; ready = true; paint(); }));
  } else { ready = true; paint(); }
}

/* A wedding in the phone's own calendar, so it is not forgotten. The same
   trick the bookings use: a file the phone knows how to open. */
function wedSaveIcs(w) {
  const d = new Date(Number(w.startMs) || 0), end = new Date(d.getTime() + 3600000);
  const z = (x) => x.getUTCFullYear() + pad2(x.getUTCMonth() + 1) + pad2(x.getUTCDate())
    + 'T' + pad2(x.getUTCHours()) + pad2(x.getUTCMinutes()) + '00Z';
  const title = T().wedCalTitle(w.aName || '', w.bName || '');
  const body = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Nabu Tarot//wedding//EN', 'BEGIN:VEVENT',
    'UID:' + w.id + '@nabutarot', 'DTSTAMP:' + z(new Date()), 'DTSTART:' + z(d), 'DTEND:' + z(end),
    'SUMMARY:' + title, 'DESCRIPTION:' + appURL() + '#/wedding/' + w.id,
    'URL:' + appURL() + '#/wedding/' + w.id, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  const blob = new Blob([body], { type: 'text/calendar' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'nabu-wedding.ics';
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
}

/* What is coming, on the profile, beside the bookings - because a wedding you
   said you would go to is an appointment like any other. Drawn from what this
   device already knows, so it costs nothing and shows before the cloud
   answers. */
function wedComingHTML() {
  const S = T(), ids = store.get('nabu-weddings', []) || [];
  const mine = store.get('nabu-wed-mine', null);
  const rows = [];
  if (mine && mine.startMs > Date.now() - 3600000) {
    rows.push(['#/wedding', S.wedMineComing(mine.other || ''), wedWhen(mine.startMs)]);
  }
  ids.slice(-4).forEach((id) => {
    const seen = (store.get('nabu-wed-seen', {}) || {})[id];
    if (!seen || !seen.startMs || seen.startMs < Date.now() - 3600000) return;
    rows.push(['#/wedding/' + id, S.wedGuestComing(seen.pair || ''), wedWhen(seen.startMs)]);
  });
  if (!rows.length) return '';
  return '<div class="card"><h3 style="margin-bottom:8px">\uD83D\uDC92 ' + esc(S.wedComing) + '</h3>'
    + rows.map((r) => '<a class="wedrow" href="' + esc(r[0]) + '"><b>' + esc(r[1]) + '</b>'
      + '<span class="faint">' + esc(r[2]) + '</span></a>').join('') + '</div>';
}

ROUTES.wedding = { nav: '', render: renderWedding };
