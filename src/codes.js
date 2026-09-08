/* ======================= access codes =======================
   Nabu makes a code and sends it to somebody who paid outside the app. The app
   keeps no secret: it publishes only a fingerprint of the code - a SHA-256 of
   the salt and the code - together with what the code opens and when it runs
   out. The book of fingerprints is private: Nabu's dashboard and the worker
   can read it, nobody else can.

   Redeeming happens in the worker, not here. The phone sends the code with the
   person's sign-in; the worker looks it up, refuses one another account has
   already used, binds it to this account, and writes the access onto the
   account itself. The phone then reads the account back. Nothing typed on a
   phone can open anything on its own any more, which is the point.

   Why not a slow hash, as before. The old book was public and hashed with
   250,000 rounds of PBKDF2 so that it could not be tried offline. A private
   book cannot be tried offline at all, and the worker limits how often one
   account may try online. (Workers also refuse PBKDF2 above 100,000 rounds, so
   the old book could not have been checked there in any case.) Codes made
   before this change are keyed the old way and no longer match: the dashboard
   marks them, and pasting one into "codes handed out before" re-keys it. */

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I, O, 0, 1
const CODE_LEN = 6;

/* The book, as the dashboard sees it:
   { salt: hex, codes: { <sha256 hex>: { c: course, u: untilISO, at, v: 2, by?: uid, usedAt? } } }
   `loaded` says the book has been read from the cloud, even if it was empty;
   publishing before that would write a book of one code over everything. */
const CODEBOOK = {
  doc: null, loaded: false,
  set(doc) { this.doc = doc && typeof doc === 'object' && doc.codes ? doc : null; this.loaded = true; },
  all() { return (this.doc && this.doc.codes) || {}; },
  salt() { return (this.doc && this.doc.salt) || ''; },
  ready() { return this.loaded; }
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

/* The key an entry is filed under. The worker computes the same thing
   (codeKey in worker/src/codes.ts); the two must never drift apart. Returns ''
   where the browser has no SubtleCrypto, in which case nothing can be
   published there. */
async function codeDigest(code, salt) {
  const subtle = window.crypto && window.crypto.subtle;
  if (!subtle) return '';
  const bits = await subtle.digest('SHA-256', new TextEncoder().encode(salt + '\n' + tidyCode(code)));
  return Array.from(new Uint8Array(bits)).map((x) => x.toString(16).padStart(2, '0')).join('');
}

/* ---- redeeming ----
   Resolves with { courses, until } once the account holds them; throws an
   Error whose `why` names what went wrong, for redeemWhy() to put into words. */
const codeFail = (why) => { const e = new Error(why); e.why = why; return e; };

async function redeemCode(typed) {
  const clean = tidyCode(typed);
  if (clean.length < 8) throw codeFail('bad');
  const be = typeof BE !== 'undefined' ? BE : null;
  if (!be || !be.enabled || !CONFIG.aiEndpoint) throw codeFail('notready');
  if (!be.user) throw codeFail('signin');
  let r, j;
  try {
    const idTok = await be.token();
    r = await withTimeout(fetch(CONFIG.aiEndpoint.replace(/\/$/, '') + '/redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + idTok },
      body: JSON.stringify({ code: clean })
    }), 20000);
    j = await r.json().catch(() => ({}));
  } catch (e) { throw codeFail('offline'); }
  if (r.ok && j.ok) {
    const opened = j.opened || [], until = (j.access || {})[opened[0]] || '';
    /* The worker has written it on the account. Reading the account back is
       what makes it true on this phone; the grant is only for a phone that
       cannot reach the account right now. */
    try { await be.pullProfile(); } catch (e) { if (opened.length && until) ACCESS.grant(opened, until); }
    return { courses: opened, until: until };
  }
  const why = String(j.error || '');
  if (why === 'bad' || why === 'used' || why === 'expired' || why === 'signin') throw codeFail(why);
  if (why === 'not configured') throw codeFail('notready');
  throw codeFail('offline');
}

function redeemWhy(e) {
  const S = T(), w = e && e.why;
  return w === 'bad' ? S.badCode : w === 'used' ? S.codeUsed : w === 'expired' ? S.codeExpired
    : w === 'signin' ? S.codeSignIn : w === 'notready' ? S.codeNotReady : S.codeOffline;
}

/* ---- the dashboard's side ---- */
async function loadCodebook() {
  const d = await BE.getContent('codes');
  CODEBOOK.set(d);
  return CODEBOOK.all();
}

/* Publishing merges into the book rather than replacing it, so two dashboards
   open at once cannot wipe each other's codes. The salt is made once and kept:
   changing it would invalidate every code already handed out. */
async function publishCode(code, course, untilISO) {
  if (!CODEBOOK.loaded) throw new Error('book not loaded');
  const salt = CODEBOOK.salt() || randomHex(16);
  const h = await codeDigest(code, salt);
  if (!h) throw new Error('no crypto');
  const codes = Object.assign({}, CODEBOOK.all());
  codes[h] = { c: course, u: untilISO, at: isoDate(new Date()), v: 2 };
  const doc = { salt: salt, codes: codes };
  await BE.setContent('codes', doc);
  CODEBOOK.set(doc);
  return h;
}

/* Taking a code out of the book stops it being used again. It takes nothing
   back from whoever already used it - that is done on their thread. */
async function revokeCode(hash) {
  if (!CODEBOOK.loaded) throw new Error('book not loaded');
  const codes = Object.assign({}, CODEBOOK.all());
  delete codes[hash];
  const doc = { salt: CODEBOOK.salt(), codes: codes };
  await BE.setContent('codes', doc);
  CODEBOOK.set(doc);
}
