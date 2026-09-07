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


/* ------------------------------------------------------------- Nabu Cupid

   Not a cherub with a bow. A small figure of light holding the two ends of the
   red thread, because that is what this app's marriage is made of and a stock
   cupid would belong to some other story. Drawn, so it costs nothing and works
   with the phone in flight mode. */
function cupidSVG(mood) {
  const glow = mood === 'joy' ? '.9' : '.5';
  const CREAM = '#FFFDF6', EDGE = '#D6BEF0';
  /* The thread hangs between the two hands and dips, the way a held cord does,
     with the knot at the bottom of the dip. Drawn dark first and red over it,
     so it reads as cord rather than as a line. */
  const CORD = 'M27 70 C 38 100, 82 100, 93 70';
  return '<svg viewBox="0 0 120 130" class="cupid ' + (mood || '') + '" role="img" aria-hidden="true">'
    + '<defs><radialGradient id="cupglow"><stop offset="0" stop-color="#FFF3C4" stop-opacity="' + glow + '"/>'
    + '<stop offset="1" stop-color="#FFF3C4" stop-opacity="0"/></radialGradient>'
    + '<linearGradient id="cupbody" x1="0" y1="0" x2="0" y2="1">'
    + '<stop offset="0" stop-color="' + CREAM + '"/><stop offset="1" stop-color="#EBDCF7"/></linearGradient></defs>'
    + '<circle cx="60" cy="56" r="54" fill="url(#cupglow)"/>'
    /* wings, behind everything and sweeping up */
    + '<path d="M46 52 C 26 30, 6 34, 8 52 C 10 70, 32 70, 46 62 Z" fill="#F3E8FF" stroke="' + EDGE + '" stroke-width="1.6" stroke-linejoin="round"/>'
    + '<path d="M74 52 C 94 30, 114 34, 112 52 C 110 70, 88 70, 74 62 Z" fill="#F3E8FF" stroke="' + EDGE + '" stroke-width="1.6" stroke-linejoin="round"/>'
    /* a robe rather than a blob */
    + '<path d="M60 42 C 68 42, 73 48, 75 58 L 80 92 C 74 96, 66 98, 60 98 C 54 98, 46 96, 40 92 L 45 58 C 47 48, 52 42, 60 42 Z" fill="url(#cupbody)" stroke="' + EDGE + '" stroke-width="1.6" stroke-linejoin="round"/>'
    /* arms out to the sides, ending where the cord begins */
    + '<path d="M47 58 C 39 60, 32 64, 28 69" stroke="' + EDGE + '" stroke-width="7.4" fill="none" stroke-linecap="round"/>'
    + '<path d="M47 58 C 39 60, 32 64, 28 69" stroke="' + CREAM + '" stroke-width="5" fill="none" stroke-linecap="round"/>'
    + '<path d="M73 58 C 81 60, 88 64, 92 69" stroke="' + EDGE + '" stroke-width="7.4" fill="none" stroke-linecap="round"/>'
    + '<path d="M73 58 C 81 60, 88 64, 92 69" stroke="' + CREAM + '" stroke-width="5" fill="none" stroke-linecap="round"/>'
    /* head, face, and the thread s own gold in the halo */
    + '<circle cx="60" cy="28" r="13" fill="' + CREAM + '" stroke="' + EDGE + '" stroke-width="1.6"/>'
    + '<circle cx="55.6" cy="27" r="1.5" fill="#5B3F9E"/><circle cx="64.4" cy="27" r="1.5" fill="#5B3F9E"/>'
    + '<path d="M56.4 31.6 q3.6 3.2, 7.2 0" stroke="#5B3F9E" stroke-width="1.5" fill="none" stroke-linecap="round"/>'
    + '<ellipse cx="60" cy="11.5" rx="10.5" ry="3.2" fill="none" stroke="#E5BE5E" stroke-width="1.8"/>'
    /* the thread itself, held */
    + '<path d="' + CORD + '" stroke="#8A0C20" stroke-width="6" fill="none" stroke-linecap="round"/>'
    + '<path d="' + CORD + '" stroke="#C4142F" stroke-width="3.6" fill="none" stroke-linecap="round"/>'
    + '<path d="' + CORD + '" stroke="#F0748C" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".5"/>'
    /* and its knot, a small heart at the bottom of the dip */
    + '<g transform="translate(60,90) scale(.135)">'
    + '<path d="M120 150 C 82 130, 60 102, 68 80 C 75 60, 102 58, 113 76 C 116 81, 118 86, 120 91'
    + ' C 122 86, 124 81, 127 76 C 138 58, 165 60, 172 80 C 180 102, 158 130, 120 150 Z"'
    + ' transform="translate(-120,-104)" fill="none" stroke="#8A0C20" stroke-width="26"/>'
    + '<path d="M120 150 C 82 130, 60 102, 68 80 C 75 60, 102 58, 113 76 C 116 81, 118 86, 120 91'
    + ' C 122 86, 124 81, 127 76 C 138 58, 165 60, 172 80 C 180 102, 158 130, 120 150 Z"'
    + ' transform="translate(-120,-104)" fill="none" stroke="#C4142F" stroke-width="15"/>'
    + '</g>'
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

  /* ------------------------------------------------------------- the room --- */
  let gifts = [], guests = [], bouquetShown = 0;
  const drawRoom = (w) => {
    const side = WED.side(w), mine = !!side, step = wedStep(w.step | 0);
    const names = esc(w.aName || S.loveSomeone) + ' \u2764 ' + esc(w.bName || S.loveSomeone);
    const askingMe = mine && step.who === side && !w.doneAt;
    const theirTurn = mine && step.who && step.who !== side && !w.doneAt;
    const line = S.wedSay[step.id](w.aName || S.loveSomeone, w.bName || S.loveSomeone);
    const here = WED.present(guests);
    const called = w.state === 'called-off';

    let act = '';
    if (called) {
      act = '<p class="hint err" style="text-align:center">' + esc(S.wedCalledOff) + '</p>';
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
    const wishes = gifts.slice(0, 14).map((g) => '<span class="wg" title="' + esc(g.name || '') + '">' + giftArt(g.kind) + '</span>').join('');
    const giftBox = w.doneAt || !mine
      ? '<div class="card"><h3 style="margin-bottom:4px">\uD83C\uDF89 ' + esc(S.wedWishTitle) + '</h3>'
        + '<p class="hint" style="margin-bottom:10px">' + esc(S.wedWishHint) + '</p>'
        + (wishes ? '<div class="wgrow">' + wishes + '</div>' : '')
        + (mine ? '' : '<div class="giftpick">' + GIFTS.slice(0, 8).map((g) => '<button type="button" class="gp" data-wgift="' + g.id + '" aria-label="' + esc(L(g.name)) + '">' + giftArt(g.id) + '<b>' + esc(L(g.name)) + '</b></button>').join('') + '</div>')
        + '</div>'
      : '';

    m.innerHTML = '<div class="wedroom">'
      + (w.doneAt && w.state === 'married' ? wedFallHTML(18) : '')
      + '<div class="card wedcard live">'
      + '<button type="button" class="mutebtn" id="wedmute" aria-label="' + esc(S.wedMute) + '">' + (WEDMUSIC.on ? '\uD83D\uDD0A' : '\uD83D\uDD07') + '</button>'
      + cupidSVG(w.doneAt && w.state === 'married' ? 'joy' : '')
      + '<p class="wedpair">' + names + '</p>'
      + '<p class="cupidname">' + esc(S.wedCupid) + '</p>'
      + '<p class="wedsay">' + esc(line) + '</p>'
      + act + '</div>'
      + bq
      + '<div class="card"><h3 style="margin-bottom:4px">\uD83D\uDC65 ' + esc(S.wedGuests(guests.length)) + '</h3>'
      + (guests.length ? '<p class="hint">' + esc(guests.slice(0, 24).map((g) => g.name || S.loveSomeone).join(' \u00b7 ')) + '</p>'
        : '<p class="hint">' + esc(S.wedNoGuests) + '</p>') + '</div>'
      + giftBox
      + (mine ? '<p class="hint" style="text-align:center">' + esc(S.wedLeaveOk) + '</p>' : '')
      + '</div>';

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
    const ms = Number(store.get('nabu-wed-want', 0)) || 0;
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
      + '<div class="card"><h3 style="margin-bottom:6px">' + esc(S.wedPayHow) + '</h3>'
      + '<ol class="steps">' + [S.unlockStep1, S.unlockStep2, S.unlockStep3].map((x) => '<li>' + esc(x) + '</li>').join('') + '</ol>'
      + '<p class="hint hold">' + esc(S.wedPayHold(wedWhen(ms))) + '</p>'
      + '<button type="button" class="btn primary block" id="wedpay">' + esc(S.wedPaySend) + '</button>'
      + '<p class="hint" id="wedpayst"></p>'
      + '<p style="margin-top:10px"><a class="backlink" href="#/wedding">\u2190 ' + esc(S.wedChangeTime) + '</a></p></div>';

    $('#wedpay').addEventListener('click', async () => {
      const b = $('#wedpay'), st = $('#wedpayst');
      if (!BE.enabled || !BE.user) { st.className = 'hint err'; st.textContent = S.unlockSendMsg; return; }
      b.disabled = true; st.className = 'hint'; st.textContent = S.loveSaving;
      try {
        await BE.createUnlockOrder([{ id: 'wedding', name: L(COURSES.filter((c) => c.id === 'wedding')[0].name)
          + ' \u00b7 ' + wedWhen(ms), price: price }], price);
        st.className = 'hint ok'; st.textContent = S.wedPaySent;
        toast(S.wedPaySent);
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
        try { await WED.create(bond, ms); toast(S.wedMade); }
        catch (e) { b.disabled = false; st.className = 'hint err'; st.textContent = loveWhy(e); }
      });
      return;
    }

    const door = WED.doorState(w);
    if (door === 'open') { drawRoom(w); return; }
    if (door === 'over') { drawDoor(w); return; }

    const link = appURL() + '#/wedding/' + encodeURIComponent(w.id);
    m.innerHTML = head()
      + '<div class="card wedcard">' + cupidSVG()
      + '<p class="wedpair">' + esc(w.aName || '') + ' \u2764 ' + esc(w.bName || '') + '</p>'
      + '<p class="wedwhen">' + esc(wedWhen(w.startMs)) + '</p>'
      + '<p class="wedcount" id="wedcd">' + esc(wedCountdown(w.startMs)) + '</p>'
      + '<p class="hint" style="text-align:center">' + esc(S.wedOpensSoon) + '</p></div>'
      + '<div class="card"><div class="ghead"><span class="gk">\uD83D\uDC8C</span><h3>' + esc(S.wedInviteTitle) + '</h3></div>'
      + '<p class="hint" style="margin-bottom:10px">' + esc(S.wedInviteHint) + '</p>'
      + '<input id="wedurl" readonly value="' + esc(link) + '">'
      + shareRowHTML('wedinv') + '</div>'
      + '<div class="card"><h3 style="margin-bottom:4px">\uD83D\uDC65 ' + esc(S.wedGuests(guests.length)) + '</h3>'
      + (guests.length ? '<p class="hint">' + esc(guests.map((g) => g.name || S.loveSomeone).join(' \u00b7 ')) + '</p>'
        : '<p class="hint">' + esc(S.wedNoGuestsYet) + '</p>') + '</div>'
      + '<div class="card"><h3 style="margin-bottom:6px">\uD83D\uDD52 ' + esc(S.wedMoveTitle) + '</h3>'
      + '<input type="datetime-local" id="wedat" value="' + esc(wedLocalValue(w.startMs)) + '">'
      + '<button type="button" class="btn block" id="wedmove" style="margin-top:8px">' + esc(S.wedMove) + '</button>'
      + '<p class="hint" id="wedst"></p></div>'
      + '<button type="button" class="btn block danger" id="weddrop">\uD83D\uDC94 ' + esc(S.wedDrop) + '</button>'
      + '<p class="hint">' + esc(S.wedDropHint) + '</p>';

    tick = setInterval(() => {
      const el = $('#wedcd');
      if (el) el.textContent = wedCountdown(w.startMs);
      if (Date.now() > w.startMs - WED_OPEN_MS) paint();
    }, 1000);
    bindShareRow(m, () => ({ text: S.wedInviteText(w.aName || '', w.bName || '', wedWhen(w.startMs)), url: link }));
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
  const guestLink = wanted && wanted !== 'pay';
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
