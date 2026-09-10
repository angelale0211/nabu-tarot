/* ======================= what today brought =======================
   The card drawn, the coin's answer and the tree's message are kept on the
   phone for the rest of the day, so coming back to the screen shows the
   result again instead of a fresh fan, a blank coin or a bare tree. One
   record for all three, stamped with the day it belongs to; a record from
   another day is simply not read, so the reset at midnight costs nothing and
   needs no timer.

   This is a memory, not an entitlement. The free-turn counters (nabu-pick-day,
   nabu-luck, and their copy on the account) decide whether a turn may be
   taken, and are never read or written here: a phone that loses this record
   loses a picture of the day, nothing more. That is also why it stays on the
   device. Syncing it would mean a write on every Plus turn and a merge rule
   for two phones' lists, to protect something that resets at midnight on the
   phone's own clock. Newest first, thirty a kind, so a long day cannot fill
   the storage. */
const TODAY_KEY = 'nabu-today', TODAY_MAX = 30;
const TODAY = {
  /* Today's record, or an empty one when what is stored belongs to another day. */
  rec() {
    const d = isoDate(new Date()), r = store.get(TODAY_KEY, null);
    return (r && typeof r === 'object' && r.d === d) ? r : { d: d, pick: [], coin: [], tree: [] };
  },
  list(kind) { const a = this.rec()[kind]; return Array.isArray(a) ? a : []; },
  last(kind) { return this.list(kind)[0] || null; },
  add(kind, entry) {
    const r = this.rec(), a = Array.isArray(r[kind]) ? r[kind] : [];
    a.unshift(Object.assign({ at: Date.now() }, entry));
    r[kind] = a.slice(0, TODAY_MAX);
    store.set(TODAY_KEY, r);
  }
};

/* A message from the tree is written down as its place in the list and the
   first words of its Vietnamese. An update that adds or moves a message still
   finds the right one by the words; one that is gone is dropped rather than
   replaced by a stranger. TREE_MSGS lives in play.js, which loads later, so it
   is read when asked for rather than captured now. */
const treeFp = (m) => String((m && m.vi) || '').slice(0, 24);
function treeMsgOf(e) {
  if (!e) return null;
  const at = TREE_MSGS[Number(e.k)];
  if (at && treeFp(at) === e.fp) return at;
  return TREE_MSGS.filter((m) => treeFp(m) === e.fp)[0] || null;
}

/* ---- the day's turns, folded under the result ----
   Only on Nabu Plus: a free turn is one a day, so the result on the screen is
   the whole story. Two or more, or nothing at all: one turn is what the screen
   already shows. Shut to begin with, newest first, each line with its time,
   and under the fold a line saying the list goes at midnight. The fold is the
   profile's .sect, so it opens and looks the way the profile's groups do. */
const todayTime = (at) => { const d = new Date(Number(at) || 0); return pad2(d.getHours()) + ':' + pad2(d.getMinutes()); };
function todayRowHTML(kind, e) {
  const S = T(); let r = '';
  if (kind === 'pick') {
    const c = cardById(e.id); if (!c) return '';
    const f = S.focus[e.focus] ? e.focus : 'general';
    /* The shared-link route opens that exact card in that focus, and is not a draw. */
    r = '<a href="#/pick?card=' + encodeURIComponent(e.id) + '&focus=' + f + '"><b>' + esc(c.name) + '</b></a> \u00b7 ' + esc(S.focus[f]);
  } else if (kind === 'coin') {
    r = esc(e.q || '') + ' \u2192 <b>' + esc(e.side === 'yes' ? S.coinYes : S.coinNo) + '</b>';
  } else if (kind === 'tree') {
    const m = treeMsgOf(e); if (!m) return '';
    r = esc(L(m));
  } else return '';
  return '<li><span class="t">' + todayTime(e.at) + '</span><span class="r">' + r + '</span></li>';
}
function todayHistoryHTML(kind) {
  if (!plusOn()) return '';
  const S = T(), rows = TODAY.list(kind).map((e) => todayRowHTML(kind, e)).filter(Boolean);
  if (rows.length < 2) return '';
  return '<details class="sect turns" data-turns="' + kind + '"><summary><span class="si">\uD83D\uDD52</span><b>' + esc(S.todayTurns) + '</b><span class="cnt">' + rows.length + '</span><span class="sx" aria-hidden="true">\u203A</span></summary>'
    + '<div class="sbody"><ul class="turnlist">' + rows.join('') + '</ul></div></details>'
    + '<p class="hint turnsnote">' + esc(S.todayReset) + '</p>';
}

/* The coin and the tree redraw their whole screen after a turn, so the day's
   list gets its new line. The redraw must not undo what the person did: a list
   they opened stays open, and the button they pressed keeps the keyboard's
   focus. Which button had it is read when the turn begins, because the button
   is switched off for the spin and a switched-off button loses the focus. */
function todayRedraw(draw, focusId) {
  const was = $('#main details.turns'), open = !!(was && was.open);
  draw();
  if (open) { const now = $('#main details.turns'); if (now) now.open = true; }
  if (focusId) { const b = document.getElementById(focusId); if (b) b.focus({ preventScroll: true }); }
}
