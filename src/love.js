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
  /* Which of the four stages this is, from the bond and the question on it. */
  stage(bond) {
    if (!bond) return 'none';
    if (bond.state === 'married') return 'married';
    if (bond.state === 'engaged') return 'engaged';
    return bond.ask && bond.ask.by ? 'proposed' : 'tied';
  },
  role(bond, uid) { return bond && (bond.a === uid ? bond.aRole : bond.bRole) || ''; },
  giftsToday(gifts, uid) {
    const day = isoDate(new Date());
    return (gifts || []).filter((g) => g.from === uid && isoDate(new Date(g.at || 0)) === day).length;
  },
  /* Round numbers worth noticing, and the next one coming. */
  marks: [7, 30, 100, 200, 365, 500, 730, 1000, 1461, 3650],
  nextMark(days) {
    const m = this.marks.filter((n) => n > days)[0];
    return m ? { at: m, inDays: m - days } : null;
  }
};



/* ---- what can be given ----
   Flowers mostly, because flowers are what people give. Each is drawn, so they
   sit together as one set rather than as whatever the phone's emoji font
   happens to do that year. */
const GIFTS = [
  { id: 'rose', name: { vi: 'H\u1ed3ng nhung', en: 'A red rose' } },
  { id: 'lotus', name: { vi: 'Sen h\u1ed3ng', en: 'A lotus' } },
  { id: 'daisy', name: { vi: 'C\u00fac tr\u1eafng', en: 'A daisy' } },
  { id: 'tulip', name: { vi: 'Tulip v\u00e0ng', en: 'A tulip' } },
  { id: 'letter', name: { vi: 'Th\u01b0 tay', en: 'A letter' } },
  { id: 'cake', name: { vi: 'B\u00e1nh ng\u1ecdt', en: 'Something sweet' } },
  { id: 'star', name: { vi: 'M\u1ed9t v\u00ec sao', en: 'A star' } },
  { id: 'moon', name: { vi: 'M\u1ea3nh tr\u0103ng', en: 'A piece of the moon' } }
];
const GIFT_PER_DAY = 3;
function giftName(id) { const g = GIFTS.filter((x) => x.id === id)[0]; return g ? L(g.name) : ''; }
function giftArt(id, cls) {
  const open = '<svg viewBox="0 0 48 48" class="giftart ' + (cls || '') + '" aria-hidden="true">';
  const stem = '<path d="M24 44 q-1 -12 0 -18" stroke="#5E9E76" stroke-width="2.6" fill="none" stroke-linecap="round"/>'
    + '<path d="M24 36 q-9 -3 -11 -10 q9 0 11 8 Z" fill="#8FD1A6"/>'
    + '<path d="M24 32 q9 -3 11 -10 q-9 0 -11 8 Z" fill="#7FBF95"/>';
  if (id === 'rose') return open + stem
    + '<circle cx="24" cy="17" r="11" fill="#C6485C"/>'
    + '<path d="M24 8 q11 4 9 14 q-3 8 -12 8 q6 -4 6 -11 q0 -8 -3 -11 Z" fill="#DF6076"/>'
    + '<path d="M24 12 a5.5 5.5 0 1 1 -.1 0 M20 17 q4 -5 8 -1" stroke="#8E2438" stroke-width="1.6" fill="none"/></svg>';
  if (id === 'lotus') return open
    + '<ellipse cx="24" cy="38" rx="17" ry="4.5" fill="#8FD1A6"/>'
    + '<path d="M24 34 q-15 -4 -17 -14 q11 0 17 10 Z" fill="#F7A9C6"/>'
    + '<path d="M24 34 q15 -4 17 -14 q-11 0 -17 10 Z" fill="#F7A9C6"/>'
    + '<path d="M24 32 q-9 -8 -7 -20 q8 6 7 18 Z" fill="#FBC7DA"/>'
    + '<path d="M24 32 q9 -8 7 -20 q-8 6 -7 18 Z" fill="#FBC7DA"/>'
    + '<path d="M24 30 q-4 -12 0 -22 q4 10 0 22 Z" fill="#FFF0F5"/><circle cx="24" cy="24" r="3" fill="#E5BE5E"/></svg>';
  if (id === 'daisy') return open + stem
    + [0, 45, 90, 135, 180, 225, 270, 315].map((a) => '<ellipse cx="24" cy="10.5" rx="3.6" ry="7.5" fill="#FFFDF8" stroke="#E6DCC8" stroke-width="1" transform="rotate(' + a + ' 24 18)"/>').join('')
    + '<circle cx="24" cy="18" r="5" fill="#E5BE5E"/></svg>';
  if (id === 'tulip') return open + stem
    + '<path d="M14 16 q0 14 10 16 q10 -2 10 -16 q-4 5 -6 1 q-3 6 -8 0 q-2 4 -6 -1 Z" fill="#E5BE5E"/>'
    + '<path d="M24 32 q-6 -4 -8 -14 q4 3 8 3 Z" fill="#F0D08A"/></svg>';
  if (id === 'letter') return open
    + '<rect x="7" y="13" width="34" height="24" rx="3" fill="#FFF9F2" stroke="#D9C7A8" stroke-width="1.6"/>'
    + '<path d="M7 15 L24 27 L41 15" fill="none" stroke="#D9C7A8" stroke-width="1.8"/>'
    + '<path d="M24 24 a4 4 0 1 1 4 4 q-4 3 -8 0 a4 4 0 1 1 4 -4 Z" fill="#D6314B"/></svg>';
  if (id === 'cake') return open
    + '<rect x="10" y="24" width="28" height="15" rx="3" fill="#F6DCC6"/>'
    + '<path d="M10 26 q7 5 14 0 q7 5 14 0 v-4 q-7 -5 -14 0 q-7 5 -14 0 Z" fill="#FBC7DA"/>'
    + '<circle cx="17" cy="33" r="1.8" fill="#C6485C"/><circle cx="24" cy="35" r="1.8" fill="#E5BE5E"/><circle cx="31" cy="33" r="1.8" fill="#C6485C"/>'
    + '<path d="M24 22 v-6" stroke="#E5BE5E" stroke-width="2"/><ellipse cx="24" cy="13" rx="2.4" ry="3.4" fill="#FFE9A8"/></svg>';
  if (id === 'moon') return open
    + '<path fill-rule="evenodd" fill="#FFE9A8" d="M24 24 m-15 0 a15 15 0 1 0 30 0 a15 15 0 1 0 -30 0 M31 18 m-13 0 a13 13 0 1 0 26 0 a13 13 0 1 0 -26 0"/>'
    + '<circle cx="14" cy="26" r="2" fill="#F0D08A"/><circle cx="19" cy="33" r="1.4" fill="#F0D08A"/></svg>';
  return open
    + '<path d="M24 5 l5.4 11.6 12.6 1.8 -9.2 8.8 2.3 12.6 -11.1 -6.1 -11.1 6.1 2.3 -12.6 -9.2 -8.8 12.6 -1.8 Z" fill="#FFE9A8" stroke="#E5BE5E" stroke-width="1.4"/>'
    + '<path d="M24 12 l3 6.6 7 1 -5 4.8 1.2 7 -6.2 -3.4 Z" fill="#FFF7EE" opacity=".7"/></svg>';
}

/* ---- rings ----
   A band seen a little from above: a dark inner edge, gold over it, one lit arc
   along the top left, and a cut stone standing on the crown. */
const RING_GOLD = '#E5BE5E', RING_DEEP = '#A87A21', RING_LIT = '#FFF3C4';
function ringArt(cx, cy, r, tilt, stone) {
  const ry = r * 0.94;
  const gem = stone === false ? '' : '<g transform="translate(0,' + (-ry - 6).toFixed(1) + ')">'
    + '<path d="M-7.4 0 L-4 -6.4 L4 -6.4 L7.4 0 L0 8.8 Z" fill="#FBD3E1"/>'
    + '<path d="M-7.4 0 L7.4 0 L0 8.8 Z" fill="#F2A9C4"/>'
    + '<path d="M-4 -6.4 L4 -6.4 L2 0 L-2 0 Z" fill="#FFF9FB"/>'
    + '<path d="M-7.4 0 L-4 -6.4 L-2 0 Z" fill="#FFEAF1"/>'
    + '<path d="M7.4 0 L4 -6.4 L2 0 Z" fill="#FFEAF1"/></g>';
  return '<g transform="translate(' + cx + ',' + cy + ')' + (tilt ? ' rotate(' + tilt + ')' : '') + '">'
    + '<ellipse rx="' + r + '" ry="' + ry.toFixed(1) + '" fill="none" stroke="' + RING_DEEP + '" stroke-width="7"/>'
    + '<ellipse rx="' + r + '" ry="' + ry.toFixed(1) + '" fill="none" stroke="' + RING_GOLD + '" stroke-width="4.6"/>'
    + '<path d="M' + (-r * 0.72).toFixed(1) + ' ' + (-ry * 0.6).toFixed(1) + ' A ' + r + ' ' + ry.toFixed(1)
    + ' 0 0 1 ' + (r * 0.24).toFixed(1) + ' ' + (-ry * 0.98).toFixed(1) + '" fill="none" stroke="' + RING_LIT
    + '" stroke-width="1.8" stroke-linecap="round" opacity=".9"/>'
    + gem + '</g>';
}
/* Two of them hooked through one another. The near ring is drawn, then the far
   one, then the near one's right side again on top - which is what makes them
   look linked rather than laid side by side. */
function ringPairArt(cx, cy, r) {
  const ry = r * 0.94, gap = r * 0.78;
  const lx = cx - gap, rx2 = cx + gap;
  const ax = lx + r * 0.766, ay1 = cy - ry * 0.643, ay2 = cy + ry * 0.643;
  const front = 'M' + ax.toFixed(1) + ' ' + ay1.toFixed(1) + ' A ' + r + ' ' + ry.toFixed(1)
    + ' 0 0 1 ' + ax.toFixed(1) + ' ' + ay2.toFixed(1);
  return ringArt(lx, cy, r, -8, false) + ringArt(rx2, cy, r, 8, true)
    + '<path d="' + front + '" fill="none" stroke="' + RING_DEEP + '" stroke-width="7" stroke-linecap="round"/>'
    + '<path d="' + front + '" fill="none" stroke="' + RING_GOLD + '" stroke-width="4.6" stroke-linecap="round"/>';
}
/* An arch of small blossoms over the top, for the one stage that earns it. */
function wreathArt(cx, cy, span) {
  const bud = (x, y, c, s) => '<g transform="translate(' + x.toFixed(1) + ',' + y.toFixed(1) + ') scale(' + s + ')">'
    + [0, 72, 144, 216, 288].map((a) => '<ellipse cx="0" cy="-3.6" rx="2.4" ry="3.6" fill="' + c + '" transform="rotate(' + a + ')"/>').join('')
    + '<circle r="1.7" fill="' + RING_LIT + '"/></g>';
  const cols = ['#F7A9C6', '#FFF3C4', '#C9B0EA', '#FBD3E1', '#F7A9C6'];
  const sc = Math.max(0.5, Math.min(1, span / 60));
  /* How far the arch dips at its ends and lifts in the middle follows its
     width, so the same drawing works at 48 across and at 240. */
  const drop = span * 0.42, rise = span * 0.28;
  let out = '<path d="M' + (cx - span) + ' ' + (cy + drop).toFixed(1) + ' Q' + cx + ' ' + (cy - rise).toFixed(1)
    + ' ' + (cx + span) + ' ' + (cy + drop).toFixed(1)
    + '" fill="none" stroke="#8FBF7F" stroke-width="' + (span > 30 ? 2.4 : 1.8) + '" stroke-linecap="round"/>';
  for (let i = 0; i <= 8; i++) {
    const t = i / 8, mt = 1 - t;
    const x = mt * mt * (cx - span) + 2 * mt * t * cx + t * t * (cx + span);
    const y = mt * mt * (cy + drop) + 2 * mt * t * (cy - rise) + t * t * (cy + drop);
    out += (i % 2)
      ? '<ellipse cx="' + x.toFixed(1) + '" cy="' + (y + sc * 5).toFixed(1) + '" rx="' + (4.6 * sc).toFixed(1) + '" ry="' + (2.6 * sc).toFixed(1) + '" fill="#8FD1A6" transform="rotate(' + (t * 60 - 30).toFixed(0) + ' ' + x.toFixed(1) + ' ' + (y + sc * 5).toFixed(1) + ')"/>'
      : bud(x, y, cols[(i / 2) % cols.length], sc);
  }
  return out;
}
/* The same four marks, small, for the tag on a profile and the tile on the home
   screen. Whatever says where somebody stands should say it the same way
   everywhere it appears. */
function loveMarkSVG(state, cls) {
  const st = state || 'tied';
  const open = '<svg viewBox="0 0 48 48" class="lovemark ' + (cls || '') + '" aria-hidden="true">';
  if (st === 'proposed') return open + ringArt(24, 28, 12, -8, true) + '</svg>';
  if (st === 'engaged') return open + ringPairArt(24, 27, 11) + '</svg>';
  if (st === 'married') return open + ringPairArt(24, 33, 10) + wreathArt(24, 11, 18) + '</svg>';
  return open
    + '<path d="M8 34 q10 -6 14 -12 M40 34 q-10 -6 -14 -12" stroke="#D6314B" stroke-width="3" fill="none" stroke-linecap="round"/>'
    + '<circle cx="24" cy="20" r="8" fill="#D6314B"/><circle cx="24" cy="20" r="3.4" fill="#F2789F"/>'
    + '<path d="M16 12 q8 -7 16 0 M16 28 q8 7 16 0" stroke="#D6314B" stroke-width="3" fill="none" stroke-linecap="round"/>'
    + '</svg>';
}

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
  /* What floats above the knot says which stage this is. Nothing while it is
     only a thread; one ring while the question is out; two hooked together
     once it has been answered; and an arch of flowers over them at the end. */
  const st = state || 'tied';
  const above = st === 'proposed' ? ringArt(120, 44, 24, -8, true)
    : st === 'engaged' ? ringPairArt(120, 46, 22)
      : st === 'married' ? ringPairArt(120, 52, 21) + wreathArt(120, 20, 62)
        : '';
  /* The thread reaches up to whatever is waiting there. */
  const reach = above
    ? '<path class="reach" d="M120 100 q-7 -22 0 -34" stroke="' + RED + '" stroke-width="2" fill="none" stroke-linecap="round" opacity=".5"/>'
    : '';
  const spark = st === 'proposed' && !still
    ? '<g fill="#FFF3C4" class="sparks"><path class="twinkle" d="M86 30 l2.4 5 5 2.4 -5 2.4 -2.4 5 -2.4 -5 -5 -2.4 5 -2.4 Z"/>'
      + '<path class="twinkle" style="animation-delay:900ms" d="M156 26 l2 4.2 4.2 2 -4.2 2 -2 4.2 -2 -4.2 -4.2 -2 4.2 -2 Z"/>'
      + '<path class="twinkle" style="animation-delay:1700ms" d="M150 74 l1.8 3.8 3.8 1.8 -3.8 1.8 -1.8 3.8 -1.8 -3.8 -3.8 -1.8 3.8 -1.8 Z"/></g>'
    : '';
  return '<svg viewBox="0 0 240 178" class="threadart" role="img" aria-hidden="true">'
    + '<ellipse cx="120" cy="168" rx="80" ry="7" fill="#C9A5D8" opacity=".2"/>'
    + hand(false) + hand(true)
    + '<path d="M120 114 q-26 22 -58 26" stroke="' + RED + '" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".55"/>'
    + '<path d="M120 114 q26 22 58 26" stroke="' + RED + '" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".55"/>'
    + reach + knot + above + spark
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
  /* A question, written as who is asking. The server will not take an ask
     that names anybody but the person writing it, so nobody can record that
     they were asked and then agree with themselves. */
  async propose(id, note) {
    await BE.db.collection('bonds').doc(id).update({
      ask: { by: this.me(), at: Date.now(), note: String(note || '').slice(0, 200) }
    });
  },
  async unask(id) { await BE.db.collection('bonds').doc(id).update({ ask: null }); },
  /* Yes moves the stage on. Not yet clears the question and changes nothing
     else, which is the whole point of it being a question. */
  async sayYes(id) {
    await BE.db.collection('bonds').doc(id).update({ state: 'engaged', ask: null, engagedOn: isoDate(new Date()) });
  },
  async marry(id) {
    await BE.db.collection('bonds').doc(id).update({ state: 'married', ask: null, marriedOn: isoDate(new Date()) });
  },
  /* How each of them is named on the other's companion page, once they are
     married. Each writes only their own. */
  async setRole(id, bond, role) {
    const k = bond.a === this.me() ? 'aRole' : 'bRole';
    const patch = {}; patch[k] = role;
    await BE.db.collection('bonds').doc(id).update(patch);
  },
  async giveGift(id, kind, note) {
    await BE.db.collection('bonds').doc(id).collection('gifts').doc(loveToken()).set({
      from: this.me(), kind: kind, note: String(note || '').slice(0, 200), at: Date.now()
    });
  },
  watchGifts(id, cb) {
    if (!this.ok() || !id) return () => {};
    return BE.db.collection('bonds').doc(id).collection('gifts')
      .onSnapshot((s) => cb(s.docs.map((d) => Object.assign({ id: d.id }, d.data())).sort((x, y) => (y.at || 0) - (x.at || 0))), () => cb([]));
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
  const st = l.stage || 'tied';
  return '<a class="lovetag st-' + esc(st) + '" href="#/love">' + loveMarkSVG(st, 'tag')
    + '<b>' + esc(S.loveTagOf[st] || S.loveTagTied) + '</b>'
    + (l.withName ? '<span class="w">' + esc(l.withName) + '</span>' : '')
    + '<span class="d">' + esc(S.loveDaysN(LOVE.days({ since: l.since }))) + '</span></a>';
}

/* The four stages laid out in order, so the whole of it is visible from the
   first screen instead of only after there is somebody to share it with. The
   one reached so far is lit; the rest wait. */
function loveRoadHTML(at) {
  const S = T(), steps = ['tied', 'proposed', 'engaged', 'married'];
  const here = steps.indexOf(at || '');
  return '<div class="card roadcard"><div class="eyebrow">' + esc(S.loveRoadTitle) + '</div>'
    + '<div class="road">' + steps.map((s, i) => '<span class="rs' + (i <= here ? ' on' : '') + '">'
      + loveMarkSVG(s) + '<b>' + esc(S.loveRoadOf[s]) + '</b></span>').join('') + '</div>'
    + '<p class="hint">' + esc(S.loveRoadHint) + '</p></div>';
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
      + loveRoadHTML('')
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

  const drawBond = (bond, gifts) => {
    const me = LOVEDB.me(), you = LOVE.other(bond, me), mine = LOVE.mine(bond, me);
    const days = LOVE.days(bond), next = LOVE.nextMark(days);
    const nameOf = (p) => (p && (p.name || (p.handle ? '@' + p.handle : ''))) || S.loveSomeone;
    const stage = LOVE.stage(bond), asked = bond.ask && bond.ask.by;
    const mineAsked = asked === me, theyAsked = asked && asked !== me;
    const given = gifts || [], last = given[0];
    const leftToday = Math.max(0, GIFT_PER_DAY - LOVE.giftsToday(given, me));

    /* What the couple is offered next depends only on where they stand. */
    let ask = '';
    if (stage === 'tied') {
      ask = '<div class="card askcard"><h3>' + esc(S.loveAskTitle) + '</h3>'
        + '<p class="hint" style="margin-bottom:10px">' + esc(S.loveAskHint) + '</p>'
        + '<input id="lvasknote" maxlength="200" placeholder="' + esc(S.loveAskNotePh) + '">'
        + '<button type="button" class="btn primary block" id="lvask" style="margin-top:10px">' + esc(S.loveAskDo) + '</button>'
        + '<p class="hint" id="lvaskst"></p></div>';
    } else if (stage === 'proposed' && mineAsked) {
      ask = '<div class="card askcard waiting">' + loveMarkSVG('proposed', 'big')
        + '<b>' + esc(S.loveAskSent) + '</b>'
        + (bond.ask.note ? '<p class="note">' + esc(bond.ask.note) + '</p>' : '')
        + '<p class="hint">' + esc(S.loveAskSentHint(nameOf(you))) + '</p>'
        + '<button type="button" class="btn block" id="lvunask">' + esc(S.loveAskTakeBack) + '</button></div>';
    } else if (stage === 'proposed' && theyAsked) {
      ask = '<div class="card askcard theirs">' + loveMarkSVG('proposed', 'big')
        + '<b>' + esc(S.loveAskGot(nameOf(you))) + '</b>'
        + (bond.ask.note ? '<p class="note">' + esc(bond.ask.note) + '</p>' : '')
        + '<div class="row2"><button type="button" class="btn primary" id="lvyes">' + esc(S.loveAskYes) + '</button>'
        + '<button type="button" class="btn" id="lvnotyet">' + esc(S.loveAskNotYet) + '</button></div>'
        + '<p class="hint">' + esc(S.loveAskNotYetHint) + '</p></div>';
    } else if (stage === 'engaged') {
      ask = '<div class="card askcard done">' + loveMarkSVG('engaged', 'big')
        + '<b>' + esc(S.loveEngaged) + '</b>'
        + (bond.engagedOn ? '<p class="hint">' + esc(S.loveEngagedOn(fmtDate(bond.engagedOn))) + '</p>' : '')
        + '<button type="button" class="btn primary block" id="lvmarry" style="margin-top:10px">' + esc(S.loveMarryDo) + '</button>'
        + '<p class="hint">' + esc(S.loveMarryHint) + '</p></div>';
    } else if (stage === 'married') {
      const myRole = LOVE.role(bond, me);
      ask = '<div class="card askcard done">' + loveMarkSVG('married', 'big')
        + '<b>' + esc(S.loveMarried) + '</b>'
        + (bond.marriedOn ? '<p class="hint">' + esc(S.loveMarriedOn(fmtDate(bond.marriedOn))) + '</p>' : '')
        + '<p class="hint" style="margin-top:10px">' + esc(S.loveRoleAsk) + '</p>'
        + '<div class="rolepick">'
        + [['mother', '\u2640', S.loveRoleMother], ['father', '\u2642', S.loveRoleFather], ['none', '\u2022', S.loveRoleNone]]
          .map((r) => '<button type="button" class="rp' + (myRole === r[0] || (!myRole && r[0] === 'none') ? ' on' : '') + '" data-role="' + r[0] + '"><i>' + r[1] + '</i>' + esc(r[2]) + '</button>').join('')
        + '</div>'
        + '<label class="remind"><input type="checkbox" id="lvshowpar"' + (LOVE.local().parents ? ' checked' : '') + '><span>' + esc(S.loveShowParents) + '</span></label>'
        + '<p class="hint">' + esc(S.loveShowParentsHint) + '</p></div>';
    }

    /* Gifts: the newest large, the rest as a shelf underneath. */
    const shelf = '<div class="card giftcard"><h3 style="margin-bottom:4px">\uD83C\uDF3F ' + esc(S.loveGiftTitle) + '</h3>'
      + '<p class="hint" style="margin-bottom:10px">' + esc(S.loveGiftHint) + '</p>'
      + (last
        ? '<div class="lastgift">' + giftArt(last.kind, 'big')
          + '<div><b>' + esc(last.from === me ? S.loveGiftYouGave(giftName(last.kind)) : S.loveGiftTheyGave(nameOf(you), giftName(last.kind))) + '</b>'
          + (last.note ? '<p class="note">' + esc(last.note) + '</p>' : '')
          + '<span class="faint">' + esc(fmtDate(isoDate(new Date(last.at || Date.now())))) + '</span></div></div>'
        : '<p class="hint">' + esc(S.loveGiftNone) + '</p>')
      + (given.length > 1
        ? '<div class="giftrow">' + given.slice(1, 13).map((g) => '<span class="gi' + (g.from === me ? ' mine' : '') + '" title="' + esc(giftName(g.kind)) + '">' + giftArt(g.kind) + '</span>').join('') + '</div>'
        : '')
      + '<div class="giftpick">' + GIFTS.map((g) => '<button type="button" class="gp" data-gift="' + g.id + '" aria-label="' + esc(L(g.name)) + '">' + giftArt(g.id) + '<b>' + esc(L(g.name)) + '</b></button>').join('') + '</div>'
      + '<input id="lvgnote" maxlength="200" placeholder="' + esc(S.loveGiftNotePh) + '" style="margin-top:10px">'
      + '<p class="hint" id="lvgst">' + esc(leftToday ? S.loveGiftLeft(leftToday) : S.loveGiftDone) + '</p></div>';

    m.innerHTML = head()
      + '<div class="card lovecard tied st-' + esc(stage) + '">' + threadSVG(stage)
      + '<div class="pair"><span>' + esc(nameOf(mine)) + '</span><i>' + loveMarkSVG(stage, 'inline') + '</i><span>' + esc(nameOf(you)) + '</span></div>'
      + '<p class="stagename">' + esc(S.loveStage[stage]) + '</p>'
      + '<div class="daysbig"><b>' + days + '</b><span>' + esc(S.loveDaysWord) + '</span></div>'
      + '<p class="since">' + esc(S.loveSince(fmtDate(bond.since))) + '</p>'
      + (next ? '<p class="hint" style="text-align:center">' + esc(S.loveNextMark(next.at, next.inDays)) + '</p>' : '')
      + '</div>'
      + loveRoadHTML(stage) + ask + shelf
      + '<div class="card"><h3 style="margin-bottom:6px">' + esc(S.loveDayTitle) + '</h3>'
      + '<p class="hint" style="margin-bottom:8px">' + esc(S.loveDayHint) + '</p>'
      + '<input type="date" id="lvsince" max="' + esc(isoDate(new Date())) + '" value="' + esc(bond.since || '') + '">'
      + '<p class="hint" id="lvsincest"></p></div>'
      + '<button type="button" class="btn block" id="lvuntie">' + esc(S.loveUntie) + '</button>'
      + '<p class="hint">' + esc(S.loveUntieHint) + '</p>'
      + foot();

    const run = async (btn, statusEl, job, okMsg) => {
      const b = $(btn), st = statusEl ? $(statusEl) : null;
      if (!b) return;
      b.addEventListener('click', async () => {
        b.disabled = true;
        if (st) { st.className = 'hint'; st.textContent = S.loveSaving; }
        try { await job(); if (okMsg) toast(okMsg); }
        catch (e) { b.disabled = false; if (st) { st.className = 'hint err'; st.textContent = S.publishFail; } else toast(S.publishFail); }
      });
    };
    run('#lvask', '#lvaskst', () => LOVEDB.propose(bond.id, $('#lvasknote').value), S.loveAskDone);
    run('#lvunask', null, () => LOVEDB.unask(bond.id));
    run('#lvyes', null, () => LOVEDB.sayYes(bond.id), S.loveAskYesDone);
    run('#lvnotyet', null, () => LOVEDB.unask(bond.id));
    run('#lvmarry', null, () => LOVEDB.marry(bond.id), S.loveMarriedDone);

    $$('[data-role]', m).forEach((b) => b.addEventListener('click', async () => {
      try { await LOVEDB.setRole(bond.id, bond, b.getAttribute('data-role')); } catch (e) { toast(S.publishFail); }
    }));
    { const sp = $('#lvshowpar');
      if (sp) sp.addEventListener('change', () => { LOVE.save({ parents: sp.checked }); toast(sp.checked ? S.loveShowParentsOn : S.loveShowParentsOff); }); }

    $$('[data-gift]', m).forEach((b) => b.addEventListener('click', async () => {
      const st = $('#lvgst');
      if (!leftToday) { st.className = 'hint err'; st.textContent = S.loveGiftDone; return; }
      b.disabled = true; st.className = 'hint'; st.textContent = S.loveSaving;
      try { await LOVEDB.giveGift(bond.id, b.getAttribute('data-gift'), $('#lvgnote').value); toast(S.loveGiftSent); }
      catch (e) { b.disabled = false; st.className = 'hint err'; st.textContent = S.publishFail; }
    }));

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
    let reqs = [], bond = null, ready = false, gifts = [], giftStop = null;
    const paint = () => { if (!ready) return; if (bond) drawBond(bond, gifts); else drawSingle(reqs); };
    stop.push(LOVEDB.watchMine((b) => {
      bond = b; ready = true;
      LOVE.save(b
        ? { bond: b.id, since: b.since, stage: LOVE.stage(b), withName: (LOVE.other(b, LOVEDB.me()) || {}).name || '',
            role: LOVE.role(b, LOVEDB.me()), otherRole: LOVE.role(b, (LOVE.other(b, LOVEDB.me()) || {}).uid) }
        : { bond: '', since: '', stage: '', withName: '', role: '', otherRole: '' });
      /* The gifts live under the bond, so they can only be watched once there
         is one to watch. */
      if (b && !giftStop) { giftStop = LOVEDB.watchGifts(b.id, (g) => { gifts = g; paint(); }); stop.push(giftStop); }
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
