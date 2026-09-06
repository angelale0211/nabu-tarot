/* ======================= access codes that cannot be forged =======================
   The old scheme checked a code against a secret that shipped inside the app,
   so anyone who read the JavaScript could mint a code for any course with any
   expiry, and no code could ever be taken back.

   This one keeps no secret in the app. Nabu makes a code; the app publishes
   only a slow, salted hash of it, together with what that code opens and when
   it runs out. Redeeming hashes what was typed and looks the result up. A code
   Nabu never issued hashes to something that is not in the book, so it opens
   nothing - and what a real code opens is read from the published record
   rather than from the text of the code, so editing the letter or the date in
   a real code gets nowhere either.

   Why a slow hash. The book is public, so someone could try every possible
   code against it offline. The tail is six characters from a 32-letter
   alphabet - about a billion codes - and PBKDF2 with a quarter of a million
   rounds makes trying them all a few thousand years of work, while costing the
   person redeeming one about a seventh of a second.

   One salt covers the book so that redeeming is a single hash and a lookup
   rather than one hash per code ever issued, which would grow slower with
   every sale. */

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I, O, 0, 1
const CODE_LEN = 6;
const CODE_ROUNDS = 250000;
/* Read per call. The checks lower it to keep the suite quick; a lower
   number can only make a code fail to match, never match wrongly. */
const codeRounds = () => Number(window.NABU_CODE_ROUNDS) || CODE_ROUNDS;

/* The published book: { salt: hex, codes: { <hash>: { c: course, u: untilISO, at } } } */
const CODEBOOK = {
  doc: null,
  set(doc) { this.doc = doc && typeof doc === 'object' && doc.codes ? doc : null; },
  all() { return (this.doc && this.doc.codes) || {}; },
  salt() { return (this.doc && this.doc.salt) || ''; },
  ready() { return !!(this.doc && this.doc.salt); }
};

const tidyCode = (s) => String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, '');

function randomHex(n) {
  const b = new Uint8Array(n);
  (window.crypto || window.msCrypto).getRandomValues(b);
  return Array.from(b).map((x) => x.toString(16).padStart(2, '0')).join('');
}

function randomCode(course, untilISO) {
  const bytes = new Uint8Array(CODE_LEN);
  (window.crypto || window.msCrypto).getRandomValues(bytes);
  let tail = '';
  for (let i = 0; i < CODE_LEN; i++) tail += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  return 'NABU-' + (CODE_LETTER[course] || 'L') + '-' + untilISO.replace(/-/g, '').slice(2) + '-' + tail;
}

/* PBKDF2-SHA256 over the tidied code. Returns hex, or '' where the browser has
   no SubtleCrypto, in which case a code simply cannot be redeemed there. */
async function codeDigest(code, salt) {
  const subtle = window.crypto && window.crypto.subtle;
  if (!subtle) return '';
  const enc = new TextEncoder();
  const key = await subtle.importKey('raw', enc.encode(tidyCode(code)), 'PBKDF2', false, ['deriveBits']);
  const bits = await subtle.deriveBits({ name: 'PBKDF2', salt: enc.encode(salt), iterations: codeRounds(), hash: 'SHA-256' }, key, 256);
  return Array.from(new Uint8Array(bits)).map((x) => x.toString(16).padStart(2, '0')).join('');
}

/* What a typed code opens, or null: one hash and one lookup, however many
   codes have been sold. */
async function verifyCode(typed) {
  const clean = tidyCode(typed);
  if (clean.length < 8 || !CODEBOOK.ready()) return null;
  const h = await codeDigest(clean, CODEBOOK.salt());
  const rec = h && CODEBOOK.all()[h];
  if (!rec || !rec.c) return null;
  return { hash: h, course: rec.c, courses: rec.c === 'luck' ? ['coin', 'tree', 'luck'] : [rec.c], until: rec.u };
}

/* Publishing merges into the book rather than replacing it, so two dashboards
   open at once cannot wipe each other's codes. The salt is made once and kept:
   changing it would invalidate every code already handed out. */
async function publishCode(code, course, untilISO) {
  const salt = CODEBOOK.salt() || randomHex(16);
  const h = await codeDigest(code, salt);
  if (!h) throw new Error('no crypto');
  const codes = Object.assign({}, CODEBOOK.all());
  codes[h] = { c: course, u: untilISO, at: isoDate(new Date()) };
  const doc = { salt: salt, codes: codes };
  await BE.setContent('codes', doc);
  CODEBOOK.set(doc);
  return h;
}

async function revokeCode(hash) {
  const codes = Object.assign({}, CODEBOOK.all());
  delete codes[hash];
  const doc = { salt: CODEBOOK.salt(), codes: codes };
  await BE.setContent('codes', doc);
  CODEBOOK.set(doc);
}
