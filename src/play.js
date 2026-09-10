/* ============================ activities (#/play) ============================
   Small things to take part in: "pick a pile" readings that Nabu posts a few
   days ahead and answers later (the chosen pile flips over to show its
   message), weekly polls, and a wish jar. Nabu creates them in the dashboard
   (content/activities, public read, admin write); votes and pile choices of
   signed-in people go to votes/{activityId_uid} so results can be counted;
   guests keep their choice on the device. */
const ACTS = { items: null, loaded: false, votes: {} };
/* Two sources: what Nabu publishes from the dashboard (cloud, or the mirrored
   activities.json) and the stock that ships with the app (activities-stock.json:
   polls and wish jars written in advance). A stock item shows unless the cloud
   has an item with the same id (edited copy wins) or lists it under hidden
   (deleted in the dashboard). */
async function loadActs() {
  if (ACTS.loaded && ACTS.items) return ACTS.items;
  const [r, s] = await Promise.all([loadContent('activities', 'activities.json', 'nabu-acts'), loadJSON('activities-stock.json', 'nabu-acts-stock')]);
  const items = ((r.data && r.data.items) || []).slice();
  const hidden = (r.data && r.data.hidden) || [];
  const have = {}; items.forEach((a) => { have[a.id] = true; });
  ACTS.stock = {};
  ((s.data && s.data.items) || []).forEach((a) => { ACTS.stock[a.id] = true; if (!have[a.id] && hidden.indexOf(a.id) < 0) items.push(a); });
  ACTS.hidden = hidden.slice();
  /* An activity saved before a language existed has no text in it. Fill those
     gaps from the files that ship with the app, so switching language is all a
     visitor has to do. A failure here is never worth an empty screen. */
  if (actsNeedDe(items)) {
    try { fillActsDe(items, await germanFromFiles()); } catch (e) { /* the files can wait */ }
  }
  ACTS.items = items; ACTS.loaded = true;
  return ACTS.items;
}
/* True when any piece of text on any activity is missing its German. Cheap,
   and it keeps the file fetch to the loads that can actually use it. */
function actsNeedDe(items) {
  let need = false;
  const walk = (o) => {
    if (need || !o || typeof o !== 'object') return;
    if (Array.isArray(o)) { o.forEach(walk); return; }
    if (typeof o.vi === 'string' && typeof o.en === 'string') { if (!o.de) need = true; return; }
    Object.keys(o).forEach((k) => walk(o[k]));
  };
  walk(items);
  return need;
}
const actsDoc = (items) => { const doc = { items: items }; if (ACTS.hidden && ACTS.hidden.length) doc.hidden = ACTS.hidden; return doc; };
/* The slips inside the jar: one per wish, stacked from the bottom up in a
   fixed pattern so they stay put when the screen redraws. Twelve is as many as
   fit; past that the jar simply reads as full. */
const JAR_SLOTS = [[50, 3, -8], [28, 4, 7], [72, 5, 11], [38, 12, -13], [62, 13, 8], [50, 21, -4],
                   [30, 22, 14], [70, 23, -11], [44, 30, 6], [58, 31, -9], [36, 38, -6], [64, 39, 10]];
function jarPapersHTML(n) {
  const k = Math.max(0, Math.min(n, JAR_SLOTS.length));
  let out = '';
  for (let i = 0; i < k; i++) {
    const s = JAR_SLOTS[i];
    out += '<i style="left:' + s[0] + '%;bottom:' + s[1] + 'px;transform:translateX(-50%) rotate(' + s[2] + 'deg)"' + (i === k - 1 ? ' class="fresh"' : '') + '></i>';
  }
  return out;
}
const myChoices = () => store.get('nabu-act-choices', {}) || {};
function setChoice(aid, choice) { const c = myChoices(); c[aid] = choice; store.set('nabu-act-choices', c); }
async function sendVote(a, choice) {
  if (!(BE.enabled && BE.user)) return false;
  try { await BE.db.collection('votes').doc(a.id + '_' + BE.user.uid).set({ aid: a.id, uid: BE.user.uid, choice: String(choice), at: firebase.firestore.FieldValue.serverTimestamp() }); return true; }
  catch (e) { return false; }
}
async function countVotes(aid) {
  if (!(BE.enabled && BE.db)) return null;
  try {
    const s = await Promise.race([BE.db.collection('votes').where('aid', '==', aid).get(), new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 4000))]);
    const out = { total: 0 }; s.forEach((d) => { const c = String(d.data().choice); out[c] = (out[c] || 0) + 1; out.total++; }); ACTS.votes[aid] = out; return out;
  } catch (e) { return ACTS.votes[aid] || null; }
}
/* A pile reading is answered when Nabu switches it on, or by itself on the results date once the messages are written. */
const actAnswered = (a) => !!(a.results || (a.type === 'pile' && a.resultsDate && a.resultsDate <= isoDate(new Date()) && (a.piles || []).some((p) => L(p.msg))));
const actOpen = (a) => !a.closed && !actAnswered(a);
function actDateLine(a) { const S = T(); return '<div class="date"><span>' + fmtDate(a.date) + '</span>' + (actAnswered(a) ? '<span class="pin">✓ ' + esc(S.actHasResults) + '</span>' : a.closed ? '<span class="pin">' + esc(S.actClosed) + '</span>' : '<span class="pin">' + esc(S.actOpen) + '</span>') + '</div>'; }

/* ---- pile pictures: eight drawn motifs, each pile gets a different one ---- */
const pileSeed = (id) => { let h = 0; for (let i = 0; i < String(id).length; i++) h = (h * 31 + String(id).charCodeAt(i)) >>> 0; return h % 8; };
/* ---- the faces of the piles ----
   One language for all of them: a lit ground, a glow behind the symbol, the
   symbol built from three tones and a highlight rather than one flat fill, and
   a gold frame that is drawn once for every card rather than inside each. */
const pileGlow = (x, y, r, c) => '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + c + '" opacity=".14"/>'
  + '<circle cx="' + x + '" cy="' + y + '" r="' + (r * 0.6).toFixed(1) + '" fill="' + c + '" opacity=".16"/>';
const pileStars = (pts) => '<g fill="#FFF7EE">' + pts.map((p) => '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (p[2] || 1.3) + '" opacity="' + (p[3] || 0.9) + '"/>').join('') + '</g>';
/* A five-petal blossom with a lit side and a shaded side. */
const pileBloom = (x, y, sc, c1, c2) => '<g transform="translate(' + x + ',' + y + ') scale(' + sc + ')">'
  + [0, 72, 144, 216, 288].map((a) => '<ellipse cx="0" cy="-7" rx="5.2" ry="7.4" fill="' + c1 + '" transform="rotate(' + a + ')"/>').join('')
  + [0, 72, 144, 216, 288].map((a) => '<ellipse cx="-1" cy="-7.4" rx="2.6" ry="4.4" fill="' + c2 + '" opacity=".75" transform="rotate(' + a + ')"/>').join('')
  + '<circle r="3" fill="#FFE07A"/>'
  + [20, 92, 164, 236, 308].map((a) => '<line x1="0" y1="0" x2="0" y2="-4.6" stroke="#E8A83C" stroke-width="0.8" transform="rotate(' + a + ')"/>').join('')
  + '</g>';
/* A six-sided crystal standing on its base, two faces lit differently. */
const pileCrystal = (x, base, w, h, tip, c1, c2, c3) => '<g>'
  + '<path d="M' + (x - w) + ' ' + base + ' L' + (x - w) + ' ' + (base - h) + ' L' + x + ' ' + (base - h - tip) + ' L' + x + ' ' + base + ' Z" fill="' + c1 + '"/>'
  + '<path d="M' + x + ' ' + base + ' L' + x + ' ' + (base - h - tip) + ' L' + (x + w) + ' ' + (base - h) + ' L' + (x + w) + ' ' + base + ' Z" fill="' + c2 + '"/>'
  + '<path d="M' + (x - w + 1.6) + ' ' + (base - 6) + ' L' + (x - w + 1.6) + ' ' + (base - h + 2) + ' L' + (x - 1.6) + ' ' + (base - h - tip + 5) + ' L' + (x - 1.6) + ' ' + (base - 6) + ' Z" fill="' + c3 + '" opacity=".45"/>'
  + '</g>';

const PILE_ARTS = [
  /* A taper in a dish: wax with a lit side, drips, a wick, and a flame in
     three layers with a white heart. */
  { bg: ['#2A1B46', '#4E2E72'], fan: '#E9C784', draw: pileGlow(50, 56, 32, '#FFC46B')
    + pileStars([[24, 26, 1.2, 0.7], [78, 30, 1, 0.6], [22, 96, 1, 0.55]])
    + '<ellipse cx="50" cy="119" rx="21" ry="5.4" fill="#B98C46"/>'
    + '<path d="M31 117 q19 7 38 0 q-3 6 -19 6 q-16 0 -19 -6 Z" fill="#E5BE5E"/>'
    + '<rect x="41" y="70" width="18" height="48" rx="3" fill="#FBEFD8"/>'
    + '<rect x="52" y="70" width="7" height="48" fill="#E3CDA8" opacity=".85"/>'
    + '<ellipse cx="50" cy="70" rx="9" ry="3.2" fill="#FFF9EC"/>'
    + '<path d="M41.5 76 q-3.4 8 -0.4 15 q4.2 -6.4 3.2 -15 Z" fill="#FFF9EC"/>'
    + '<path d="M57 82 q3.2 7 0.6 13 q-4 -5.6 -3 -13 Z" fill="#FFF9EC" opacity=".8"/>'
    + '<path d="M50 68 v-5" stroke="#5E4A2E" stroke-width="1.8" stroke-linecap="round"/>'
    + '<path d="M50 66 C 41 57, 43 44, 50 33 C 57 44, 59 57, 50 66 Z" fill="#FF9F2E"/>'
    + '<path d="M50 64 C 44.5 56, 45.5 46, 50 38 C 54.5 46, 55.5 56, 50 64 Z" fill="#FFDC7A"/>'
    + '<path d="M50 61 C 47.4 56, 47.8 50, 50 45 C 52.2 50, 52.6 56, 50 61 Z" fill="#FFFBEC"/>'
    + '<g fill="#FFD98A" opacity=".8"><circle cx="42" cy="28" r="1.5"/><circle cx="58" cy="22" r="1.2"/><circle cx="53" cy="15" r="1"/></g>' },

  /* A peach branch: blossoms at four sizes, buds, leaves, and petals falling. */
  { bg: ['#FCE3EC', '#F5BDD2'], fan: '#F6BBCB', draw: '<circle cx="70" cy="40" r="21" fill="#FFF6FA" opacity=".6"/>'
    + '<path d="M12 128 C 28 108, 38 94, 50 72 C 58 57, 70 44, 88 32" stroke="#7A4E36" stroke-width="3.2" fill="none" stroke-linecap="round"/>'
    + '<path d="M38 96 q11 -7 15 -18" stroke="#7A4E36" stroke-width="2.1" fill="none" stroke-linecap="round"/>'
    + '<path d="M62 60 q-13 -1 -19 -9" stroke="#7A4E36" stroke-width="2" fill="none" stroke-linecap="round"/>'
    + '<g fill="#8FBF7F"><ellipse cx="34" cy="80" rx="7" ry="3.4" transform="rotate(-28 34 80)"/><ellipse cx="66" cy="82" rx="6.4" ry="3.2" transform="rotate(24 66 82)"/></g>'
    + pileBloom(28, 106, 1.05, '#FF9EBB', '#FFD1E0') + pileBloom(50, 78, 1.25, '#FF8FB0', '#FFCADB')
    + pileBloom(70, 52, 0.95, '#FF9EBB', '#FFD1E0') + pileBloom(86, 34, 0.7, '#FFAFC8', '#FFE0EA')
    + '<g fill="#FFB6CE"><circle cx="53" cy="60" r="3.4"/><circle cx="40" cy="88" r="2.8"/><circle cx="78" cy="44" r="2.4"/></g>'
    + '<g fill="#FFC9DC" opacity=".85"><ellipse cx="22" cy="60" rx="4" ry="2.4" transform="rotate(-30 22 60)"/><ellipse cx="80" cy="100" rx="3.6" ry="2.2" transform="rotate(20 80 100)"/><ellipse cx="34" cy="122" rx="3.2" ry="2" transform="rotate(-14 34 122)"/></g>' },

  /* A true crescent, cut as one path from two circles, with its own light. */
  { bg: ['#1A2452', '#37478C'], fan: '#AFC8F0', draw: pileGlow(52, 62, 34, '#FFF3C4')
    + pileStars([[24, 30, 1.4], [78, 24, 1.1], [20, 92, 1.2], [82, 104, 1.5], [36, 116, 1], [66, 118, 1.2, 0.7], [88, 66, 1]])
    + '<path fill-rule="evenodd" fill="#FFF3C4" d="M52 62 m-25 0 a25 25 0 1 0 50 0 a25 25 0 1 0 -50 0 M65 51 m-23 0 a23 23 0 1 0 46 0 a23 23 0 1 0 -46 0"/>'
    + '<g fill="#F0DFA0" opacity=".55"><circle cx="36" cy="60" r="3.4"/><circle cx="42" cy="76" r="2.2"/><circle cx="34" cy="48" r="1.8"/></g>'
    + '<path d="M72 86 l1.8 3.8 3.8 1.8 -3.8 1.8 -1.8 3.8 -1.8 -3.8 -3.8 -1.8 3.8 -1.8 Z" fill="#FFF3C4"/>' },

  /* A cluster of six-sided crystals on a base, not three triangles. */
  { bg: ['#33235C', '#6B4BA6'], fan: '#C7B6F3', draw: pileGlow(50, 96, 26, '#D9B8FF')
    + pileStars([[26, 28, 1.2, 0.6], [76, 26, 1, 0.6]])
    + '<path d="M20 122 L80 122 L74 111 L26 111 Z" fill="#3E2E70"/>'
    + pileCrystal(28, 119, 8, 26, 11, '#A87FDD', '#7E58B8', '#E4D2F8')
    + pileCrystal(72, 119, 9, 32, 13, '#9B6FD0', '#744FAC', '#DCC8F5')
    + pileCrystal(49, 121, 11, 44, 18, '#C9A6F2', '#9767DC', '#F1E6FF')
    + '<g fill="#FFF7EE"><path d="M70 60 l1.8 3.8 3.8 1.8 -3.8 1.8 -1.8 3.8 -1.8 -3.8 -3.8 -1.8 3.8 -1.8 Z"/>'
    + '<path d="M28 74 l1.4 3 3 1.4 -3 1.4 -1.4 3 -1.4 -3 -3 -1.4 3 -1.4 Z" opacity=".85"/></g>' },

  /* Long and short rays, tapered, around a disc lit from its centre. */
  { bg: ['#F9DE96', '#EDA93E'], fan: '#E5BE5E', draw: pileGlow(50, 66, 34, '#FFF6D2')
    + [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((r) => '<path d="M47 40 L50 18 L53 40 Z" fill="#FFF6D2" transform="rotate(' + r + ' 50 66)"/>').join('')
    + [15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345].map((r) => '<path d="M48 42 L50 29 L52 42 Z" fill="#FFF0B8" opacity=".9" transform="rotate(' + r + ' 50 66)"/>').join('')
    + '<circle cx="50" cy="66" r="21" fill="#FFF1B8"/><circle cx="50" cy="66" r="15" fill="#FFD24A"/>'
    + '<circle cx="46" cy="61" r="6" fill="#FFF6D2" opacity=".55"/>' },

  /* An ornate key: a heart in its bow, a collar on the shaft, real wards. */
  { bg: ['#1E3A66', '#456FAC'], fan: '#AFC8F0', draw: pileGlow(50, 48, 28, '#FFE9A8')
    + pileStars([[24, 100, 1.2, 0.6], [80, 92, 1, 0.6], [26, 26, 1.1, 0.7]])
    + '<circle cx="50" cy="44" r="15" fill="none" stroke="#C79A2E" stroke-width="7"/>'
    + '<circle cx="50" cy="44" r="15" fill="none" stroke="#E5BE5E" stroke-width="4.4"/>'
    + '<path d="M50 40 q-4.6 -5 -7.4 -1 q-2.6 3.6 7.4 9.6 q10 -6 7.4 -9.6 q-2.8 -4 -7.4 1 Z" fill="#E5BE5E"/>'
    + '<path d="M36 34 q-7 -3 -10 3 q7 2 10 -3 Z M64 34 q7 -3 10 3 q-7 2 -10 -3 Z" fill="#E5BE5E" opacity=".9"/>'
    + '<rect x="46.6" y="58" width="6.8" height="52" rx="2.4" fill="#C79A2E"/>'
    + '<rect x="46.6" y="58" width="3.6" height="52" rx="1.8" fill="#E5BE5E"/>'
    + '<rect x="42" y="74" width="16" height="4.6" rx="2.3" fill="#E5BE5E"/>'
    + '<path d="M50 84 l3.6 4.6 -3.6 4.6 -3.6 -4.6 Z" fill="#FFF3C4"/>'
    + '<rect x="53.4" y="96" width="13" height="5.4" rx="1.6" fill="#E5BE5E"/>'
    + '<rect x="53.4" y="105" width="9" height="5.4" rx="1.6" fill="#E5BE5E"/>' },

  /* A quill: two vanes of different weight, barbs combed over them, and a
     split near the tip where a real feather always parts. */
  { bg: ['#EDE4FB', '#C2AAEC'], fan: '#D9CDF3', draw: pileGlow(52, 70, 30, '#FFFFFF')
    + '<path d="M80 24 C 58 40, 40 72, 30 118 C 30 82, 48 42, 80 24 Z" fill="#9C86D6"/>'
    + '<path d="M80 24 C 86 48, 70 88, 30 118 C 54 82, 70 50, 80 24 Z" fill="#BAA5E8"/>'
    + '<g stroke="#F6F1FE" stroke-width="1.15" opacity=".95">'
    + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((k) => { var t = k / 11; var x = 80 - 50 * t, y = 24 + 94 * t * t * 0.55 + 30 * t; return '<path d="M' + x.toFixed(1) + ' ' + y.toFixed(1) + ' L' + (x - 16 + k * 0.7).toFixed(1) + ' ' + (y + 5 + k * 0.5).toFixed(1) + '"/>'; }).join('')
    + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => { var t = k / 9; var x = 80 - 50 * t, y = 24 + 94 * t * t * 0.55 + 30 * t; return '<path d="M' + x.toFixed(1) + ' ' + y.toFixed(1) + ' L' + (x + 9 - k * 0.4).toFixed(1) + ' ' + (y + 9 + k * 0.6).toFixed(1) + '"/>'; }).join('')
    + '</g>'
    + '<path d="M80 24 C 58 42, 40 74, 30 118" stroke="#6E56A8" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
    + '<g stroke="#BAA5E8" stroke-width="1.2" fill="none" opacity=".9"><path d="M22 66 q6 4 4 10"/><path d="M84 92 q-6 3 -5 9"/></g>' },

  /* Water in three layers, each crest curling into foam, under a small moon. */
  { bg: ['#24406E', '#4B7BC0'], fan: '#AFC8F0', draw: pileStars([[24, 26, 1.2], [70, 20, 1], [86, 40, 1.3, 0.7]])
    + '<path fill-rule="evenodd" fill="#FFF3C4" d="M74 34 m-13 0 a13 13 0 1 0 26 0 a13 13 0 1 0 -26 0 M81 28 m-11.5 0 a11.5 11.5 0 1 0 23 0 a11.5 11.5 0 1 0 -23 0"/>'
    + '<path d="M0 66 C 16 48, 34 48, 46 64 C 58 80, 78 78, 100 58 L100 140 L0 140 Z" fill="#2F568F"/>'
    + '<path d="M46 64 C 40 52, 26 52, 22 64 C 28 56, 40 58, 43 68 Z" fill="#EAF3FF" opacity=".9"/>'
    + '<path d="M0 88 C 18 70, 38 72, 52 88 C 66 104, 84 100, 100 80 L100 140 L0 140 Z" fill="#4B7BC0"/>'
    + '<path d="M52 88 C 46 76, 32 76, 28 88 C 34 80, 46 82, 49 92 Z" fill="#EAF3FF" opacity=".85"/>'
    + '<path d="M0 110 C 20 94, 42 98, 58 112 C 72 124, 88 122, 100 108 L100 140 L0 140 Z" fill="#6FA0DC"/>'
    + '<path d="M58 112 C 52 102, 40 102, 36 112 C 42 105, 52 107, 55 115 Z" fill="#EAF3FF" opacity=".8"/>'
    + '<g fill="#EAF3FF" opacity=".8"><circle cx="16" cy="74" r="2.4"/><circle cx="68" cy="70" r="1.9"/><circle cx="84" cy="94" r="2.1"/><circle cx="30" cy="98" r="1.7"/><circle cx="72" cy="118" r="1.8"/></g>' },

  /* A lotus on still water, and its own reflection under it. */
  { bg: ['#FFE6E4', '#FFC9B0'], fan: '#F7C6B4', draw: '<circle cx="50" cy="46" r="26" fill="#FFF3E4" opacity=".7"/>'
    + '<rect x="0" y="96" width="100" height="44" fill="#CFE0E8" opacity=".8"/>'
    + '<g fill="#FFFFFF" opacity=".45"><rect x="10" y="106" width="80" height="2"/><rect x="20" y="116" width="62" height="1.8"/><rect x="14" y="126" width="70" height="1.6"/></g>'
    + '<g fill="#8FBF7F"><ellipse cx="24" cy="102" rx="15" ry="4.6"/><ellipse cx="76" cy="108" rx="12" ry="4"/></g>'
    + '<g opacity=".28"><path d="M50 100 q-17 5 -19 17 q13 0 19 -11 Z" fill="#F2789F"/><path d="M50 100 q17 5 19 17 q-13 0 -19 -11 Z" fill="#F2789F"/></g>'
    + '<path d="M50 96 q-19 -5 -21 -18 q14 0 21 13 Z" fill="#F2789F"/><path d="M50 96 q19 -5 21 -18 q-14 0 -21 13 Z" fill="#F2789F"/>'
    + '<path d="M50 94 q-13 -10 -10 -26 q11 8 10 24 Z" fill="#FBA9C6"/><path d="M50 94 q13 -10 10 -26 q-11 8 -10 24 Z" fill="#FBA9C6"/>'
    + '<path d="M50 92 q-6 -15 0 -28 q6 13 0 28 Z" fill="#FFF0F5"/>'
    + '<circle cx="50" cy="80" r="4.4" fill="#E5BE5E"/><circle cx="50" cy="79" r="2" fill="#FFF3C4"/>' },

  /* A brilliant cut: table, crown facets, pavilion, and three sparks. */
  { bg: ['#1F2A4D', '#46578F'], fan: '#AFC8F0', draw: pileGlow(50, 68, 30, '#CFE9FF')
    + pileStars([[24, 30, 1.2], [80, 34, 1], [26, 108, 1.1, 0.7]])
    + '<path d="M40 48 L60 48 L72 62 L50 106 L28 62 Z" fill="#BFE0F5"/>'
    + '<path d="M50 106 L28 62 L40 62 Z" fill="#9CCBEA"/>'
    + '<path d="M50 106 L72 62 L60 62 Z" fill="#D8EEFF"/>'
    + '<path d="M50 106 L40 62 L50 62 Z" fill="#E7F5FF" opacity=".85"/>'
    + '<path d="M40 48 L60 48 L64 62 L36 62 Z" fill="#EAF6FF"/>'
    + '<path d="M40 48 L36 62 L28 62 Z" fill="#A9D4F0"/><path d="M60 48 L64 62 L72 62 Z" fill="#C7E5FA"/>'
    + '<g fill="none" stroke="#FFFFFF" stroke-width="0.9" opacity=".7"><path d="M40 48 L36 62 M60 48 L64 62 M28 62 H72 M50 62 V106 M40 62 L50 106 M60 62 L50 106"/></g>'
    + '<path d="M40 48 L60 48 L72 62 L50 106 L28 62 Z" fill="none" stroke="#FFFFFF" stroke-width="1.4" opacity=".85"/>'
    + '<g fill="#FFFFFF"><path d="M76 78 l1.8 3.8 3.8 1.8 -3.8 1.8 -1.8 3.8 -1.8 -3.8 -3.8 -1.8 3.8 -1.8 Z"/>'
    + '<path d="M22 76 l1.4 3 3 1.4 -3 1.4 -1.4 3 -1.4 -3 -3 -1.4 3 -1.4 Z" opacity=".85"/>'
    + '<path d="M50 116 l1.6 3.4 3.4 1.6 -3.4 1.6 -1.6 3.4 -1.6 -3.4 -3.4 -1.6 3.4 -1.6 Z" opacity=".9"/></g>' }
];
function pileArtSVG(k) {
  const a = PILE_ARTS[((k % PILE_ARTS.length) + PILE_ARTS.length) % PILE_ARTS.length], g = 'pg' + k;
  /* Drawn once for every face: the frame that makes it the back of a deck
     rather than a picture on a rectangle. */
  const frame = '<rect x="17" y="15" width="66" height="110" rx="6" fill="none" stroke="#FFF7EE" stroke-width="0.9" opacity=".5"/>'
    + '<rect x="20" y="18" width="60" height="104" rx="4" fill="none" stroke="#E5BE5E" stroke-width="0.7" opacity=".55"/>'
    + '<g fill="#E5BE5E" opacity=".8"><circle cx="20" cy="18" r="1.6"/><circle cx="80" cy="18" r="1.6"/><circle cx="20" cy="122" r="1.6"/><circle cx="80" cy="122" r="1.6"/></g>';
  /* Clipped to the card itself, not to the edge of the drawing. An inset of
     nothing cuts at the viewport, which let the water run out past the card. */
  return '<svg viewBox="0 0 100 140" class="pileart" data-art="' + k + '"><defs>'
    + '<linearGradient id="' + g + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + a.bg[0] + '"/><stop offset="1" stop-color="' + a.bg[1] + '"/></linearGradient>'
    + '<clipPath id="pc' + k + '"><rect x="10" y="8" width="80" height="124" rx="10"/></clipPath></defs>'
    + '<rect x="14" y="10" width="72" height="104" rx="8" fill="' + a.fan + '" opacity=".55" transform="rotate(-9 50 62)"/><rect x="14" y="10" width="72" height="104" rx="8" fill="' + a.fan + '" opacity=".75" transform="rotate(7 50 62)"/>'
    + '<rect x="10" y="8" width="80" height="124" rx="10" fill="url(#' + g + ')" stroke="#FFF7EE" stroke-width="2"/>'
    + '<g clip-path="url(#pc' + k + ')">' + a.draw + frame + '</g></svg>';
}
/* ---- one activity card ---- */
function actHTML(a, compact) {
  const S = T(), mine = myChoices()[a.id];
  let body = '';
  if (a.type === 'pile') {
    const piles = a.piles || [];
    const openIdx = mine != null && actAnswered(a) ? Number(mine) : -1;
    body = '<div class="piles n' + Math.max(2, Math.min(5, piles.length)) + '">' + piles.map((p, i) => { const chosen = String(mine) === String(i), open = i === openIdx; const art = p.art != null ? Number(p.art) : (pileSeed(a.id) + i) % PILE_ARTS.length; return '<div class="pile' + (chosen ? ' chosen' : '') + (open ? ' open' : '') + '" data-pile="' + i + '"><div class="pile-inner"><div class="pf">' + pileArtSVG(art) + '<div class="pfl"><b>' + (i + 1) + '</b>' + (p.label ? '<span>' + esc(p.label) + '</span>' : '') + '</div></div><div class="pb"><b>' + (i + 1) + '</b><span>✓</span></div></div></div>'; }).join('') + '</div>'
      + '<div class="pmsg"' + (openIdx > -1 ? '' : ' hidden') + '>' + (openIdx > -1 ? '<div class="eyebrow">' + esc(S.actPileMsgOf(openIdx + 1)) + '</div>' + richHTML(L(piles[openIdx].msg)) : '') + '</div>'
      + (actAnswered(a) ? (mine == null ? '<p class="hint">' + esc(S.actPickToSee) + '</p>' : '<p class="hint">' + esc(S.actTapOthers) + '</p>') : (mine == null ? '<p class="hint">' + esc(S.actPickHint) + '</p>' : '<p class="hint ok">' + esc(S.actPicked(Number(mine) + 1)) + ' ' + esc(S.actComeBack(fmtDate(a.resultsDate || a.date))) + '</p>'));
  } else if (a.type === 'poll') {
    const opts = a.options || [], voted = mine != null, show = voted || a.closed;
    body = '<div class="pollopts" data-poll="' + a.id + '">' + opts.map((o, i) => '<button type="button" class="pollopt' + (String(mine) === String(i) ? ' on' : '') + '" data-opt="' + i + '"' + (show ? ' disabled' : '') + '><span class="bar"></span><span class="lbl">' + esc(L(o)) + '</span><span class="pct"></span></button>').join('') + '</div>'
      + '<p class="hint pollnote">' + esc(voted ? S.actVoted : a.closed ? S.actClosedNote : (BE.enabled && BE.user ? S.actVoteHint : S.actVoteLogin)) + '</p><p class="hint pollstat">' + esc(S.actResultsPublic) + ': …</p>';
  } else if (a.type === 'wish') {
    const wishes = (store.get('nabu-wishes', []) || []).filter((w) => w.aid === a.id);
    body = '<div class="wishjar" data-wish="' + a.id + '"><div class="jar"><span class="star s1">✦</span><span class="star s2">✧</span><span class="star s3">✦</span><div class="note" hidden></div>🫙<span class="papers">' + jarPapersHTML(wishes.length) + '</span></div>'
      + '<textarea class="wishtext" placeholder="' + esc(S.actWishPh) + '"></textarea><button type="button" class="btn primary block" data-wishsend>🌠 ' + esc(S.actWishSend) + '</button>'
      + '<p class="hint wishcount">' + esc(wishes.length ? S.actWishCount(wishes.length) : S.actWishHint) + '</p>'
      + (wishes.length ? '<button type="button" class="linkbtn" data-wishlist>' + esc(S.wishHistory(wishes.length)) + '</button><ul class="wishlist" hidden>' + wishes.slice().reverse().map((w) => '<li><span class="d">' + esc(fmtDate(String(w.at).slice(0, 10))) + '</span>' + esc(w.text) + '</li>').join('') + '</ul> · <button type="button" class="linkbtn" data-wishclear>' + esc(S.actWishClear) + '</button>' : '') + '</div>';
  }
  return '<article class="post act act-' + esc(a.type) + '" data-act="' + esc(a.id) + '">' + actDateLine(a) + '<h2>' + titleHTML(L(a.title)) + '</h2>' + (a.intro ? '<div class="body">' + richHTML(L(a.intro)) + '</div>' : '') + body
    + (compact ? '<div class="foot"><a class="btn sm primary" href="#/play/' + esc(a.id) + '">' + esc(S.actJoin) + ' →</a><a class="btn sm" href="#/play">' + esc(S.actAll) + '</a></div>' : '') + '</article>';
}
function bindActs(root, list) {
  const S = T();
  $$('.act', root).forEach((card) => {
    const a = list.filter((x) => x.id === card.getAttribute('data-act'))[0]; if (!a) return;
    if (a.type === 'pile') {
      $$('[data-pile]', card).forEach((el) => el.addEventListener('click', async () => {
        const i = Number(el.getAttribute('data-pile')), mine = myChoices()[a.id];
        if (actAnswered(a)) {  // after the answer: the chosen pile is open; any pile can be peeked at
          if (mine == null) { setChoice(a.id, i); sendVote(a, i); }
          const pm = $('.pmsg', card), was = el.classList.contains('open');
          $$('[data-pile]', card).forEach((x) => x.classList.remove('open'));
          if (was) { pm.hidden = true; pm.innerHTML = ''; return; }
          el.classList.add('open'); pm.hidden = false; pm.innerHTML = '<div class="eyebrow">' + esc(S.actPileMsgOf(i + 1)) + '</div>' + richHTML(L((a.piles[i] || {}).msg)); hydrateImages(pm);
          setTimeout(() => pm.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 350);
          return;
        }
        if (mine != null && String(mine) !== String(i) && !confirm(S.actChangePile)) return;
        setChoice(a.id, i); await sendVote(a, i);
        $$('[data-pile]', card).forEach((x) => x.classList.toggle('chosen', x === el));
        const h = $('.hint', card); if (h) { h.className = 'hint ok'; h.textContent = S.actPicked(i + 1) + ' ' + S.actComeBack(fmtDate(a.resultsDate || a.date)); }
        toast(T().saved);
      }));
    } else if (a.type === 'poll') {
      const draw = (counts) => { const total = counts && counts.total || 0; $$('[data-opt]', card).forEach((b) => { const n = counts ? (counts[b.getAttribute('data-opt')] || 0) : 0, pct = total ? Math.round(n * 100 / total) : 0; $('.bar', b).style.width = pct + '%'; $('.pct', b).textContent = total ? pct + '%' : ''; }); const st = $('.pollstat', card); if (st) st.textContent = S.actResultsPublic + ': ' + (total ? S.actVotes(total) : S.actNoVotes); };
      countVotes(a.id).then(draw);
      $$('[data-opt]', card).forEach((b) => b.addEventListener('click', async () => {
        if (!(BE.enabled && BE.user)) { toast(S.actVoteLogin); location.hash = signinHref(); return; }
        const i = Number(b.getAttribute('data-opt')); setChoice(a.id, i); await sendVote(a, i);
        $$('[data-opt]', card).forEach((x) => { x.classList.toggle('on', x === b); x.disabled = true; });
        $('.pollnote', card).textContent = S.actVoted; countVotes(a.id).then(draw);
      }));
    } else if (a.type === 'wish') {
      const ta = $('.wishtext', card), note = $('.note', card), jar = $('.jar', card);
      $('[data-wishsend]', card).addEventListener('click', async () => {
        const text = (ta.value || '').trim(); if (!text) { toast(S.actWishEmpty); ta.focus(); return; }
        note.textContent = text.slice(0, 60); note.hidden = false; jar.classList.remove('fly'); void jar.offsetWidth; jar.classList.add('fly');
        const list = store.get('nabu-wishes', []) || []; list.push({ aid: a.id, text: text, at: new Date().toISOString() }); store.set('nabu-wishes', list.slice(-100));
        const papers = $('.papers', card);
        if (papers) papers.innerHTML = jarPapersHTML(list.filter((w) => w.aid === a.id).length);
        ta.value = ''; sendVote(a, 'wish');
        const mine = list.filter((w) => w.aid === a.id).length; $('.wishcount', card).textContent = S.actWishCount(mine); toast(S.actWishSent);
        setTimeout(() => { note.hidden = true; }, 2600);
      });
      const wl = $('[data-wishlist]', card); if (wl) wl.addEventListener('click', () => { const ul = $('.wishlist', card); ul.hidden = !ul.hidden; wl.textContent = ul.hidden ? S.wishHistory(ul.children.length) : S.wishHide; });
      const cl = $('[data-wishclear]', card); if (cl) cl.addEventListener('click', () => { if (!confirm(S.actWishClearConfirm)) return; store.set('nabu-wishes', (store.get('nabu-wishes', []) || []).filter((w) => w.aid !== a.id)); $('.wishcount', card).textContent = S.actWishHint; cl.remove(); });
    }
  });
  hydrateImages(root);
}
function actStatus(a) { const S = T(); return actAnswered(a) ? '✓ ' + S.actHasResults : a.closed ? S.actClosed : S.actOpen; }
/* The list grows: one labelled group per kind, the newest five shown, the rest behind "see more", plus filter chips. */
const ACT_GROUPS = [['pile', PILE_ICON, 'piles'], ['poll', '📊', 'polls'], ['wish', '🌠', 'wishes']];
function actGroupsHTML(list) {
  const S = T(), SHOW = 5;
  const chips = '<div class="chips actfilter"><button type="button" class="chip on" data-filter="all">' + esc(S.actFilterAll) + '</button>' + ACT_GROUPS.map((g) => { const n = list.filter((a) => a.type === g[0]).length; return n ? '<button type="button" class="chip" data-filter="' + g[0] + '">' + g[1] + ' ' + esc(S.actTypes[g[0]]) + ' <span class="cnt">' + n + '</span></button>' : ''; }).join('') + '</div>';
  return chips + ACT_GROUPS.map((g) => {
    const gl = list.filter((a) => a.type === g[0]); if (!gl.length) return '';
    return '<div class="actgroup" data-group="' + g[0] + '"><div class="eyebrow">' + g[1] + ' ' + esc(S.actTypes[g[0]]) + ' <span class="cnt">' + gl.length + '</span></div>' + gl.slice(0, SHOW).map(actButtonHTML).join('')
      + (gl.length > SHOW ? '<div class="more" hidden>' + gl.slice(SHOW).map(actButtonHTML).join('') + '</div><button type="button" class="btn sm block" data-more>' + esc(S.actMore(gl.length - SHOW)) + '</button>' : '') + '</div>';
  }).join('');
}
function bindActGroups(root) {
  const S = T();
  $$('[data-filter]', root).forEach((b) => b.addEventListener('click', () => { const f = b.getAttribute('data-filter'); $$('[data-filter]', root).forEach((x) => x.classList.toggle('on', x === b)); $$('.actgroup', root).forEach((g) => { g.hidden = f !== 'all' && g.getAttribute('data-group') !== f; }); }));
  $$('[data-more]', root).forEach((b) => b.addEventListener('click', () => { const more = b.previousElementSibling; more.hidden = !more.hidden; b.textContent = more.hidden ? S.actMore(more.children.length) : S.actLess; }));
}
function actButtonHTML(a) {
  const S = T(), mine = myChoices()[a.id];
  return '<a class="actbtn act-' + esc(a.type) + (actOpen(a) ? ' live' : '') + '" href="#/play/' + esc(a.id) + '"><span class="ic">' + (S.actTypeIcon[a.type] || '🎲') + '</span><span class="body"><b>' + esc(L(a.title)) + '</b><span class="meta">' + esc(fmtDate(a.date)) + ' · ' + esc(S.actTypes[a.type] || a.type) + ' · ' + esc(actStatus(a)) + (a.type === 'pile' && mine != null ? ' · ' + esc(S.actPicked(Number(mine) + 1)) : '') + '</span></span><span class="chev">›</span></a>';
}
/* The row in the activities list carries whichever companions are kept, and
   says which of them still needs feeding today. */
function petRowHTML(S) {
  const pets = PETS.all(), hungry = pets.filter((p) => !PETS.fedToday(p));
  const title = pets.length === 1 ? (pets[0].name || L(PET_NAMES[pets[0].kind])) : (pets.length ? S.petLuckTotal(pets.length) : S.petTitle);
  const meta = !pets.length ? S.petSub : (hungry.length ? S.petFeedWith(L(PETS.food(hungry[0]).name)) : S.petFedToday);
  return '<a class="actbtn act-pet live" href="#/play/pet"><span class="ic">🐾</span><span class="body"><b>' + esc(title) + '</b><span class="meta">' + esc(meta) + '</span></span><span class="go">›</span></a>';
}
async function renderPlay(args) {
  const S = T(), m = $('#main');
  /* The four built-in screens are answered before the cloud list is fetched, so
     a slow or failed connection never leaves one of them blank. */
  if (args && args[0] === 'diary') { renderDiary(); return; }
  if (args && args[0] === 'coin') { renderCoin(); return; }
  if (args && args[0] === 'tree') { renderTree(); return; }
  if (args && args[0] === 'pet') { renderPet(args[1]); return; }
  const list = (await loadActs()).slice().sort((a, b) => String(b.date).localeCompare(String(a.date)));
  /* One page per kind, reached from the row of buttons on the main screen. */
  const GROUP_OF = { piles: 'pile', polls: 'poll', wishes: 'wish' };
  if (args && GROUP_OF[args[0]]) {
    const kind = GROUP_OF[args[0]], gl = list.filter((x) => x.type === kind);
    m.innerHTML = '<div class="eyebrow">' + esc(S.actTitle) + '</div><h1 style="margin-bottom:6px">' + S.actTypeIcon[kind] + ' ' + esc(S.actTypes[kind]) + '</h1>'
      + '<p class="muted">' + esc(S.actGroupIntro[kind]) + '</p>'
      + '<div id="acts" class="actlist">' + (gl.length ? gl.map(actButtonHTML).join('') : '<p class="empty">' + esc(S.actEmpty) + '</p>') + '</div>'
      + '<p style="margin-top:14px"><a href="#/play" class="backlink">← ' + esc(S.actTitle) + '</a></p>';
    return;
  }
  if (args && args[0]) {
    const a = list.filter((x) => x.id === args[0])[0];
    if (!a) { redirect('#/play'); return; }
    m.innerHTML = '<div class="eyebrow">' + esc(S.actTitle) + '</div><div id="acts">' + actHTML(a, false) + '</div><p style="margin-top:12px"><a href="#/play" class="backlink">← ' + esc(S.actBack) + '</a></p>';
    bindActs($('#acts'), list);
    return;
  }
  const diaryN = Object.keys(store.get('nabu-diary', {}) || {}).length;
  m.innerHTML = '<div class="eyebrow">' + esc(CONFIG.brand) + '</div><h1 style="margin-bottom:6px">' + esc(S.actTitle) + '</h1><p class="muted">' + esc(S.actIntro) + '</p><div id="acts" class="actlist">'
    + petRowHTML(S)
    + '<a class="actbtn act-love live" href="#/love"><span class="ic">' + loveKnotSVG() + '</span><span class="body"><b>' + esc(S.loveTitle) + '</b><span class="meta">' + esc(S.loveSub) + '</span></span><span class="go">›</span></a>'
    + '<a class="actbtn act-tree live" href="#/play/tree"><span class="ic">🌸</span><span class="body"><b>' + esc(S.treeTitle) + '</b><span class="meta">' + esc(S.treeSub) + '</span></span><span class="go">›</span></a>'
    + '<a class="actbtn act-coin live" href="#/play/coin"><span class="ic">🪙</span><span class="body"><b>' + esc(S.coinTitle) + '</b><span class="meta">' + esc(S.coinSub) + '</span></span><span class="go">›</span></a>'
    + '<a class="actbtn act-diary live" href="#/play/diary"><span class="ic">📔</span><span class="body"><b>' + esc(S.diaryTitle) + '</b><span class="meta">' + esc(S.diarySub) + (diaryN ? ' · ' + esc(S.diaryCount(diaryN)) : '') + '</span></span><span class="chev">›</span></a>'
    + '</div>'
    + '<div class="actquick three">' + ACT_GROUPS.map((g) => {
      const n = list.filter((a2) => a2.type === g[0]).length;
      return '<a class="aq" href="#/play/' + esc(g[2]) + '"><span class="ic">' + g[1] + '</span><b>' + esc(S.actTypes[g[0]]) + '</b>' + (n ? '<span class="cnt">' + n + '</span>' : '') + '</a>';
    }).join('') + '</div>';
}
/* ---- the free turn, or a code for unlimited ----
   Shown under the coin and under the tree: where the visitor stands today,
   and, when the free turn is gone, what unlimited costs and where the code goes. */
function luckPanelHTML(kind) {
  const S = T();
  if (luckUnlimited(kind)) return '<p class="hint">✓ ' + esc(S.luckOpen) + '</p>';
  if (!luckSpent(kind)) return '<p class="hint">' + esc(luckDays(kind) === 1 ? S.luckFreeDay : S.luckFree) + '</p>';
  return '<div class="card luckbox"><p class="lead">' + esc(S.luckSpent(fmtDate(luckNext(kind)))) + '</p>'
    + '<p class="hint" style="margin-bottom:10px">' + esc(isTWA() ? S.stPlusPitch : S.luckOffer) + '</p>'
    + (isTWA()
      ? (BILL.can() ? buyButtonHTML('plus', S.stSubscribe) + '<p class="hint st" data-st="plus"></p>' : storeNotReadyHTML())
      : '<div class="row nw"><input id="luckcode" placeholder="' + esc(S.luckCodePh) + '" autocapitalize="characters"><button class="btn" id="luckgo">' + esc(S.unlock) + '</button></div><p class="hint" id="luckstatus"></p>')
    + '</div>';
}
function bindLuck(root, redraw) {
  const S = T();
  bindStore(root, redraw);
  const go = $('#luckgo', root);
  if (!go) return;
  go.addEventListener('click', async () => {
    const st = $('#luckstatus', root);
    st.textContent = S.codeChecking; st.className = 'hint'; go.disabled = true;
    const r = await redeemCode($('#luckcode', root).value).catch((e) => e);
    go.disabled = false;
    if (!r || r instanceof Error) { st.textContent = redeemWhy(r); st.className = 'hint err'; return; }
    toast(S.unlocked); redraw();
  });
}

/* ---- the message tree ----
   A blossom tree you shake for one of sixty-one blessings, in Vietnamese, English and German. The messages are written
   for this app, not taken from a published oracle deck. */
const TREE_MSGS = [
  { vi: 'Điều bạn đang chờ vẫn đang trên đường đến với bạn, chỉ chậm hơn một chút so với mong đợi. Hãy giữ lòng mình rộng mở và đừng vội từ bỏ.', en: 'What you are waiting for is still making its way to you. It may simply be arriving a little later than you hoped. Keep your heart open and do not give up too soon.', de: 'Das, worauf du wartest, ist noch auf dem Weg zu dir. Es kommt vielleicht nur etwas später, als du gehofft hast. Halte dein Herz offen und gib nicht zu früh auf.' },
  { vi: 'Bạn không hề đi chậm. Con đường của bạn chỉ dài hơn một chút, và những gì bạn học được trên đó rồi sẽ có lúc trở nên vô cùng đáng giá.', en: 'You are not falling behind. Your path is simply a little longer, and one day everything you have learned along the way will prove its worth.', de: 'Du bist nicht zu langsam. Dein Weg ist vielleicht nur etwas länger, und eines Tages wird sich zeigen, wie wertvoll all das war, was du unterwegs gelernt hast.' },
  { vi: 'Một cánh cửa khép lại không phải để giữ bạn ở ngoài, mà để bạn kịp nhận ra một cánh cửa khác đang mở ngay bên cạnh.', en: 'A door closing in front of you is not always meant to keep you out. Sometimes it is there so you can notice another one opening beside you.', de: 'Eine Tür, die sich vor dir schließt, soll dich nicht immer draußen halten. Manchmal hilft sie dir nur, die andere Tür zu sehen, die sich gerade neben dir öffnet.' },
  { vi: 'Hôm nay, bạn được phép nghỉ ngơi mà không cần thấy có lỗi. Nghỉ ngơi cũng là một phần của hành trình đi tới nơi bạn muốn đến.', en: 'You are allowed to rest today without feeling guilty. Rest is part of the journey too.', de: 'Du darfst dich heute ausruhen, ohne dich dafür schuldig zu fühlen. Auch Pausen gehören zu deinem Weg.' },
  { vi: 'Bạn được yêu thương nhiều hơn mình nghĩ. Có những người vẫn luôn giữ bạn trong lòng theo một cách rất lặng lẽ.', en: 'You are more loved than you realize. Some people carry you quietly in their hearts without ever saying much about it.', de: 'Du wirst mehr geliebt, als du vielleicht denkst. Manche Menschen tragen dich ganz still in ihrem Herzen.' },
  { vi: 'Điều bạn đang lo sẽ không xảy ra đáng sợ như trong tưởng tượng. Khi nó thật sự đến, bạn sẽ bình tĩnh hơn mình nghĩ.', en: 'What you are worried about will not unfold as terribly as you imagine. When the moment comes, you will handle it more calmly than you expect.', de: 'Das, worüber du dir Sorgen machst, wird wahrscheinlich nicht so schlimm werden, wie du es dir ausmalst. Wenn der Moment kommt, wirst du ruhiger damit umgehen, als du glaubst.' },
  { vi: 'Bạn của hôm nay đã đi xa hơn bạn của một năm trước rất nhiều. Chỉ là đôi khi bạn quên nhìn lại quãng đường mình đã vượt qua.', en: 'The person you are today has come much further than the person you were a year ago. Sometimes you simply forget to look back.', de: 'Dein heutiges Ich ist viel weiter gekommen als dein Ich vor einem Jahr. Manchmal vergisst du nur, zurückzublicken.' },
  { vi: 'Vũ trụ đã nghe thấy điều bạn cầu mong. Có những lời nguyện cần thêm thời gian, bởi câu trả lời cũng cần được lớn lên.', en: 'The universe has heard what you asked for. Some wishes take longer because their answers need time to grow.', de: 'Das Universum hat deinen Wunsch gehört. Manche Wünsche brauchen etwas länger, weil auch ihre Antworten Zeit zum Wachsen brauchen.' },
  { vi: 'Một điều tốt đẹp đang được chuẩn bị cho bạn ở nơi bạn chưa nhìn tới, vào lúc bạn gần như đã thôi chờ đợi.', en: 'Something good is being prepared for you somewhere you are not looking, perhaps just when you are about to stop expecting it.', de: 'Etwas Schönes wird gerade für dich vorbereitet, an einem Ort, an den du noch gar nicht schaust — vielleicht genau dann, wenn du kaum noch damit rechnest.' },
  { vi: 'Bạn không cần hoàn hảo mới xứng đáng được yêu thương. Người thật lòng sẽ yêu cả những phần bạn vẫn còn vụng về.', en: 'You do not need to be perfect to deserve love. The right person will love the parts of you that are still learning too.', de: 'Du musst nicht perfekt sein, um Liebe zu verdienen. Der richtige Mensch wird auch die Seiten an dir lieben, die noch lernen und wachsen.' },
  { vi: 'Điều bạn đang làm có ý nghĩa, ngay cả khi chưa ai nói điều đó với bạn. Những điều tử tế đôi khi chỉ được nhìn thấy muộn hơn một chút.', en: 'What you are doing matters, even if no one has told you yet. Kind things are sometimes recognized later than we hope.', de: 'Was du tust, hat Bedeutung, auch wenn dir das noch niemand gesagt hat. Gutes wird manchmal später gesehen, als wir es uns wünschen.' },
  { vi: 'Tuần này, hãy tin vào cảm giác đầu tiên của mình. Đôi khi trực giác đã hiểu điều mà lý trí vẫn còn đang tìm lời giải thích.', en: 'This week, trust your first instinct. Sometimes your intuition already understands what your mind is still trying to explain.', de: 'Vertraue diese Woche deinem ersten Gefühl. Manchmal weiß deine Intuition längst, was dein Verstand noch zu erklären versucht.' },
  { vi: 'Có một người vẫn nhớ đến bạn với lòng biết ơn vì một điều bạn từng làm, dù có thể chính bạn đã quên từ lâu.', en: 'Someone still thinks of you with gratitude for something you once did, even if you have long forgotten it yourself.', de: 'Jemand denkt noch immer mit Dankbarkeit an dich, wegen etwas, das du einmal getan hast und vielleicht selbst längst vergessen hast.' },
  { vi: 'Bạn không cần phải gánh mọi chuyện một mình. Chỉ cần bạn mở lời, sẽ có người sẵn lòng đứng cạnh bạn.', en: 'You do not have to carry everything alone. If you reach out, someone will be willing to stand beside you.', de: 'Du musst das nicht alles allein tragen. Wenn du dich öffnest, wird jemand bereit sein, an deiner Seite zu stehen.' },
  { vi: 'Điều bạn buông xuống hôm nay sẽ để lại một khoảng trống — và có thể chính khoảng trống ấy đang chờ một điều tốt đẹp hơn bước vào.', en: 'What you release today may leave an empty space — and that space could be exactly where something better is meant to arrive.', de: 'Was du heute loslässt, hinterlässt vielleicht eine Lücke — und genau diese Lücke könnte der Platz sein, an den etwas Besseres kommen darf.' },
  { vi: 'Đi chậm lúc này không có nghĩa là lùi lại. Đó là cách bạn giữ gìn mình để còn đủ sức đi thật xa.', en: 'Moving slowly right now does not mean moving backward. It may simply be how you protect yourself for the road ahead.', de: 'Langsam zu gehen bedeutet nicht, rückwärtszugehen. Vielleicht schützt du dich gerade einfach für den langen Weg, der noch vor dir liegt.' },
  { vi: 'Một cơ hội đang đến gần hơn bạn tưởng. Hãy để ý cả những cuộc trò chuyện tưởng chừng rất bình thường.', en: 'An opportunity may be closer than you think. Pay attention even to conversations that seem completely ordinary.', de: 'Eine Chance ist möglicherweise näher, als du denkst. Achte auch auf Gespräche, die zunächst völlig gewöhnlich wirken.' },
  { vi: 'Bạn đã không sai khi chọn giữ lại sự tử tế của mình, ngay cả ở nơi nó chưa từng được đáp lại.', en: 'You were not wrong for choosing kindness, even in places where that kindness was never returned.', de: 'Es war nicht falsch, freundlich zu bleiben, selbst dort, wo deine Freundlichkeit nicht erwidert wurde.' },
  { vi: 'Hãy nói ra điều bạn thật sự muốn. Lần này, người nghe có thể hiểu bạn hơn, và mọi chuyện sẽ nhẹ nhàng hơn bạn nghĩ.', en: 'Say what you truly want. This time, you may be understood better than you expect, and the conversation may feel much lighter.', de: 'Sag, was du wirklich möchtest. Diesmal könnte man dich besser verstehen, als du erwartest, und vieles wird leichter sein.' },
  { vi: 'Nỗi buồn này cũng có ngày kết thúc. Nó sẽ không ở lại trong bạn lâu như bạn đang lo.', en: 'This sadness has an ending too. It will not stay inside you as long as you fear.', de: 'Auch diese Traurigkeit hat ein Ende. Sie wird nicht so lange bei dir bleiben, wie du gerade befürchtest.' },
  { vi: 'Bạn đang ở gần câu trả lời hơn mình nghĩ. Có khi chỉ cần yên lại một chút, nó sẽ tự hiện ra.', en: 'You are closer to the answer than you think. Sometimes you only need a little quiet for it to reveal itself.', de: 'Du bist der Antwort näher, als du denkst. Manchmal braucht es nur ein wenig Ruhe, damit sie sich zeigen kann.' },
  { vi: 'Hãy tự hào về những lần bạn tự mình đứng dậy mà chẳng ai hay biết. Đó thường mới là những lần khó khăn nhất.', en: 'Be proud of every time you got back up when no one was watching. Those are often the hardest victories of all.', de: 'Sei stolz auf all die Male, in denen du wieder aufgestanden bist, ohne dass es jemand gesehen hat. Genau das waren oft deine größten Siege.' },
  { vi: 'Một tin vui nhỏ có thể đến trong những ngày tới. Không quá ồn ào, nhưng đủ để khiến lòng bạn nhẹ đi.', en: 'A small piece of good news may reach you in the coming days. It may not be dramatic, but it will be enough to make your heart feel lighter.', de: 'In den nächsten Tagen könnte dich eine kleine gute Nachricht erreichen. Nichts Großes — aber genug, um dein Herz etwas leichter zu machen.' },
  { vi: 'Điều từng khiến bạn nghĩ mình đã mất đi một thứ gì đó, sau này có thể lại hóa ra là cách cuộc đời giữ bạn khỏi một con đường không dành cho mình.', en: 'Something you once saw as a loss may later turn out to have protected you from a path that was never meant for you.', de: 'Was sich einmal wie ein Verlust angefühlt hat, könnte sich später als Schutz vor einem Weg herausstellen, der nie für dich bestimmt war.' },
  { vi: 'Bạn được phép bắt đầu lại, dù đây là lần thứ bao nhiêu. Không ai cần đếm những lần bắt đầu của bạn cả.', en: 'You are allowed to begin again, no matter how many times you have already done so. No one is counting.', de: 'Du darfst neu anfangen, ganz egal, wie oft du es schon getan hast. Niemand zählt deine Neuanfänge.' },
  { vi: 'Sẽ có người chọn ở lại, không phải vì bạn hoàn hảo, mà bởi họ cảm thấy bình yên khi được ở cạnh bạn.', en: 'Someone will choose to stay, not because you are perfect, but because being beside you feels like peace.', de: 'Jemand wird bleiben, nicht weil du perfekt bist, sondern weil es sich friedlich anfühlt, bei dir zu sein.' },
  { vi: 'Bạn không cần chứng minh giá trị của mình với tất cả mọi người. Những người thật sự hiểu bạn đã nhìn thấy nó từ lâu.', en: 'You do not have to prove your worth to everyone. The people who truly understand you have seen it for a long time.', de: 'Du musst deinen Wert nicht jedem beweisen. Die Menschen, die dich wirklich verstehen, haben ihn längst gesehen.' },
  { vi: 'Tuần này, hãy dịu dàng hơn với cơ thể mình. Nó đã cố gắng rất nhiều và vẫn luôn âm thầm đồng hành cùng bạn.', en: 'Be gentler with your body this week. It has carried you through more than you realize.', de: 'Sei diese Woche etwas liebevoller zu deinem Körper. Er hat dich durch mehr getragen, als dir manchmal bewusst ist.' },
  { vi: 'Một mối quan hệ cũ có thể dịu lại theo cách bạn không ngờ, khi cả hai đều không còn quá cần phải chứng minh ai đúng ai sai.', en: 'An old relationship may soften in an unexpected way once neither of you feels the need to prove who was right.', de: 'Eine alte Beziehung könnte auf unerwartete Weise weicher werden, sobald keiner von euch mehr beweisen muss, wer recht hatte.' },
  { vi: 'Sự bình yên bạn tìm kiếm đôi khi không ở đâu xa. Nó nằm trong chính những buổi tối rất bình thường của bạn.', en: 'The peace you are searching for may not be far away at all. Sometimes it lives in your most ordinary evenings.', de: 'Der Frieden, nach dem du suchst, ist vielleicht gar nicht weit weg. Manchmal liegt er in deinen ganz gewöhnlichen Abenden.' },
  { vi: 'Bạn được phép đổi ý. Trưởng thành đôi khi chỉ đơn giản là dám thừa nhận rằng điều mình từng muốn đã không còn phù hợp nữa.', en: 'You are allowed to change your mind. Growing up sometimes means admitting that what you once wanted no longer fits you.', de: 'Du darfst deine Meinung ändern. Erwachsenwerden bedeutet manchmal auch zuzugeben, dass etwas, das man früher wollte, heute nicht mehr zu einem passt.' },
  { vi: 'Điều tốt bạn từng trao cho người khác đang tìm đường quay lại với bạn, đôi khi qua một người bạn chưa từng quen.', en: 'The kindness you once gave away is finding its way back to you, perhaps through someone you have never even met.', de: 'Das Gute, das du anderen gegeben hast, findet seinen Weg zurück zu dir — vielleicht sogar durch jemanden, den du noch gar nicht kennst.' },
  { vi: 'Đừng vội. Thứ thật sự thuộc về bạn sẽ không biến mất chỉ vì bạn đến chậm hơn người khác vài bước.', en: 'Do not rush. What is truly meant for you will not disappear simply because you arrive a few steps later than someone else.', de: 'Beeil dich nicht. Was wirklich zu dir gehört, verschwindet nicht nur deshalb, weil du ein paar Schritte später ankommst als andere.' },
  { vi: 'Hãy nhìn lại cả quãng đường mình đã đi, thay vì chỉ nhìn vào phần còn lại phía trước. Bạn đã đi xa hơn mình vẫn tưởng.', en: 'Look back at how far you have already come, not only at how much remains. You have travelled further than you remember.', de: 'Schau auch darauf zurück, wie weit du schon gekommen bist, statt nur auf den Weg, der noch vor dir liegt. Du bist weiter gekommen, als du glaubst.' },
  { vi: 'Sẽ có người vô tình nói đúng câu bạn đang cần nghe, vào một thời điểm bạn hoàn toàn không ngờ tới.', en: 'Someone may unexpectedly say exactly what you needed to hear at exactly the right moment.', de: 'Jemand könnte ganz unerwartet genau die Worte sagen, die du gerade hören musst.' },
  { vi: 'Bạn có quyền giữ khoảng cách với những điều khiến mình kiệt sức. Đó không phải ích kỷ, mà là biết bảo vệ chính mình.', en: 'You are allowed to distance yourself from what drains you. That is not selfishness; it is knowing how to protect yourself.', de: 'Du darfst Abstand zu Dingen und Menschen halten, die dich erschöpfen. Das ist nicht egoistisch, sondern Selbstschutz.' },
  { vi: 'Chuyện tiền bạc sẽ dần dễ thở hơn sau giai đoạn này. Hãy giữ vững những thói quen nhỏ đang giúp bạn ổn định hơn.', en: 'Money will begin to feel a little easier after this period. Keep the small habits that are helping you build stability.', de: 'Finanziell wird es nach dieser Phase langsam wieder leichter. Halte an den kleinen Gewohnheiten fest, die dir Stabilität geben.' },
  { vi: 'Sự thay đổi bạn đang sợ có thể chính là điều bạn cần. Vài tháng nữa, bạn sẽ hiểu rõ hơn vì sao nó phải xảy ra.', en: 'The change you are afraid of may turn out to be exactly what you needed. A few months from now, you may understand why.', de: 'Die Veränderung, vor der du Angst hast, könnte genau das sein, was du brauchst. In ein paar Monaten wirst du vielleicht verstehen, warum sie notwendig war.' },
  { vi: 'Hôm nay, hãy làm một điều nhỏ chỉ vì nó khiến bạn vui — không phải vì nó hữu ích hay làm hài lòng bất kỳ ai.', en: 'Do one small thing today simply because it makes you happy — not because it is useful or because anyone else expects it.', de: 'Tu heute etwas Kleines nur deshalb, weil es dir Freude macht — nicht weil es nützlich ist oder jemand anderes etwas davon hat.' },
  { vi: 'Bạn không hề muộn. Bạn đang đi theo nhịp riêng của mình, và nhịp ấy không cần giống bất kỳ ai.', en: 'You are not late. You are moving at your own pace, and your rhythm does not need to match anyone else\'s.', de: 'Du bist nicht zu spät. Du gehst in deinem eigenen Tempo, und dein Rhythmus muss nicht dem eines anderen entsprechen.' },
  { vi: 'Một người bạn cũ có thể xuất hiện trở lại, mang theo cảm giác thân quen mà bạn đã lâu không còn cảm nhận.', en: 'An old friend may return to your life, bringing back a familiar feeling you have not experienced in a long time.', de: 'Ein alter Freund könnte wieder in dein Leben treten und ein vertrautes Gefühl mitbringen, das du lange vermisst hast.' },
  { vi: 'Điều bạn học được từ lần vấp ngã ấy sẽ bảo vệ bạn vào một ngày khác, đúng lúc bạn cần đến nó nhất.', en: 'What you learned from that mistake will protect you another day, exactly when you need the lesson most.', de: 'Was du aus diesem Fehler gelernt hast, wird dich eines Tages schützen — genau dann, wenn du diese Erfahrung am meisten brauchst.' },
  { vi: 'Hãy cho phép người khác giúp mình. Có những người thật lòng muốn ở bên bạn, và đôi khi biết nhận cũng là một cách trao đi.', en: 'Let people help you. Some truly want to be there for you, and learning to receive can be a form of giving too.', de: 'Erlaube anderen, dir zu helfen. Manche Menschen möchten wirklich für dich da sein, und auch Annehmen kann eine Form des Gebens sein.' },
  { vi: 'Có một điều đẹp đẽ đang âm thầm lớn lên ở nơi mà hiện tại bạn vẫn chưa nhìn thấy gì.', en: 'Something beautiful is quietly growing somewhere you cannot see yet.', de: 'Etwas Schönes wächst gerade ganz still an einem Ort, an dem du im Moment noch nichts erkennen kannst.' },
  { vi: 'Bạn vẫn đang được dẫn đường, kể cả trong những ngày chẳng nhìn thấy lối đi. Chỉ cần bước thêm một bước nữa thôi.', en: 'You are still being guided, even on the days when you cannot see the road. Just take one more step.', de: 'Du wirst weiterhin geführt, selbst an Tagen, an denen du den Weg nicht sehen kannst. Geh einfach noch einen Schritt weiter.' },
  { vi: 'Hãy tha thứ cho chính mình trước. Bạn đã mang câu chuyện ấy theo bên mình đủ lâu rồi.', en: 'Forgive yourself first. You have carried that story for long enough.', de: 'Vergib zuerst dir selbst. Du hast diese Geschichte lange genug mit dir getragen.' },
  { vi: 'Câu trả lời có thể đến khi bạn thôi cố ép mình phải tìm ra nó. Hãy để lòng yên một chút, rồi bạn sẽ nghe thấy điều mình cần.', en: 'The answer may come when you stop forcing yourself to find it. Give your heart some quiet, and you may finally hear what you need.', de: 'Die Antwort könnte kommen, sobald du aufhörst, sie mit aller Kraft finden zu wollen. Lass es in dir etwas stiller werden.' },
  { vi: 'Một chuyện bạn tưởng đã khép lại vẫn còn một chương nữa — và lần này, chương ấy có thể dịu dàng hơn.', en: 'Something you thought was finished may still have another chapter — and this one could be gentler than the last.', de: 'Etwas, das du für beendet gehalten hast, könnte noch ein weiteres Kapitel haben — und dieses Kapitel könnte sanfter werden als das letzte.' },
  { vi: 'Bạn xứng đáng với một tình cảm không khiến mình phải liên tục đoán. Sự rõ ràng cũng là một cách yêu thương.', en: 'You deserve a love that does not leave you constantly guessing. Clarity is a form of kindness too.', de: 'Du verdienst eine Liebe, bei der du nicht ständig rätseln musst. Klarheit ist ebenfalls eine Form von Zuneigung.' },
  { vi: 'Tuần này, hãy cho cơ thể mình được ngủ đủ và nghỉ đủ. Đôi khi bạn hồi phục nhanh hơn rất nhiều chỉ nhờ những điều đơn giản như vậy.', en: 'Give your body enough sleep and rest this week. Sometimes healing begins with something that simple.', de: 'Gib deinem Körper diese Woche genug Schlaf und Ruhe. Manchmal beginnt Erholung mit etwas ganz Einfachem.' },
  { vi: 'Hãy giữ lấy ước mơ đó thêm một chút nữa. Có những giấc mơ chỉ nở khi đến đúng mùa của chúng.', en: 'Hold on to that dream a little longer. Some dreams only bloom when their season finally arrives.', de: 'Halte diesen Traum noch ein wenig länger fest. Manche Träume blühen erst, wenn ihre richtige Jahreszeit gekommen ist.' },
  { vi: 'Người thật lòng với bạn sẽ không để bạn chờ trong vô định mãi. Đôi khi, một sự chờ đợi quá lâu cũng đã là câu trả lời.', en: 'Someone who truly wants you will not leave you waiting in uncertainty forever. Sometimes a very long wait is already an answer.', de: 'Wer es wirklich ernst mit dir meint, lässt dich nicht für immer in Ungewissheit warten. Manchmal ist langes Warten bereits eine Antwort.' },
  { vi: 'Bạn đã đủ, ngay trong khoảnh khắc này, đúng với con người bạn đang là — không phải sau khi bạn sửa xong một điều gì đó.', en: 'You are already enough, right now, exactly as you are — not only after you have fixed something about yourself.', de: 'Du bist jetzt schon genug, genau so, wie du gerade bist — nicht erst dann, wenn du etwas an dir verändert hast.' },
  { vi: 'Một lời xin lỗi bạn đã chờ rất lâu có thể sẽ đến. Và đến lúc ấy, có lẽ bạn sẽ nhận ra mình không còn cần nó nhiều như trước nữa.', en: 'An apology you have waited a long time for may finally arrive. By then, you may realize you no longer need it as much as you once did.', de: 'Eine Entschuldigung, auf die du lange gewartet hast, könnte endlich kommen. Vielleicht merkst du dann, dass du sie inzwischen gar nicht mehr so sehr brauchst.' },
  { vi: 'Hãy tin rằng bạn có thể xây lại từ đầu. Bạn đã từng làm được một lần, và bạn vẫn có thể làm được thêm lần nữa.', en: 'Believe that you can rebuild. You have done it before, and you can do it again.', de: 'Vertraue darauf, dass du neu aufbauen kannst. Du hast es schon einmal geschafft, und du kannst es wieder schaffen.' },
  { vi: 'Những nỗ lực trong công việc của bạn sắp được nhìn thấy. Điều bạn âm thầm làm bấy lâu rồi sẽ có người ghi nhận đúng với giá trị của nó.', en: 'Your work is about to be noticed. What you have quietly been doing for so long will finally be recognized for what it is worth.', de: 'Deine Arbeit wird bald gesehen werden. Was du so lange still im Hintergrund getan hast, wird endlich die Anerkennung bekommen, die es verdient.' },
  { vi: 'Đừng khép lòng chỉ vì một người từng làm bạn thất vọng. Ngoài kia vẫn còn rất nhiều người dịu dàng đang trên đường bước vào cuộc đời bạn.', en: 'Do not close your heart because one person disappointed you. There are still gentle people making their way into your life.', de: 'Verschließe dein Herz nicht nur wegen eines Menschen, der dich enttäuscht hat. Es gibt noch viele liebevolle Menschen, die ihren Weg zu dir finden werden.' },
  { vi: 'Một khoảng thời gian nhẹ nhàng hơn đang đợi bạn ở phía trước, ngay sau đoạn đường gập ghềnh này.', en: 'A softer season is waiting for you ahead, just beyond this difficult stretch of road.', de: 'Eine sanftere Zeit wartet vor dir, gleich hinter diesem schwierigen Abschnitt.' },
  { vi: 'Điều bạn cầu mong không bị lãng quên. Có lẽ nó chỉ đang chờ đúng thời điểm để đến với bạn theo cách trọn vẹn hơn.', en: 'What you wished for has not been forgotten. It may simply be waiting for the right moment to reach you in a more complete way.', de: 'Dein Wunsch wurde nicht vergessen. Vielleicht wartet er nur auf den richtigen Moment, um auf eine vollständigere Weise zu dir zu kommen.' },
  { vi: 'Tối nay, hãy cho mình được nghỉ sớm một chút. Ngày mai có thể mang một sắc màu khác, và bạn cũng sẽ nhìn mọi chuyện rõ hơn.', en: 'Let yourself go to bed a little earlier tonight. Tomorrow may carry a different light, and you may see everything more clearly.', de: 'Erlaube dir heute Abend, etwas früher schlafen zu gehen. Morgen kann alles schon in einem anderen Licht erscheinen.' },
  { vi: 'Bạn đã vượt qua những ngày khó khăn hơn thế này rất nhiều — và bạn vẫn ở đây. Chỉ vậy thôi cũng đủ nói lên bạn mạnh mẽ đến nhường nào.', en: 'You have already survived days far harder than this one — and you are still here. That alone says so much about how strong you are.', de: 'Du hast bereits Tage überstanden, die viel schwerer waren als dieser — und du bist immer noch hier. Allein das zeigt, wie stark du wirklich bist.' }
];
/* Four trees. The free one is the cherry in daylight; the others come with
   Plus and are the reason to want it, so each has something the first has not:
   fireflies that drift, stars that breathe, butterflies that circle. */
function treeSVGFor(id, still) {
  const look = id || LOOKS.get('tree');
  if (look === 'night') return treeNightSVG(still);
  if (look === 'galaxy') return treeGalaxySVG(still);
  if (look === 'butterfly') return treeButterflySVG(still);
  return treeSakuraSVG();
}
function treeCanopy(puffs, blooms, petalColour) {
  const petal5 = (x, y, r) => [0, 72, 144, 216, 288].map((a) => '<ellipse cx="' + x + '" cy="' + (y - r * 0.66) + '" rx="' + (r * 0.44).toFixed(1) + '" ry="' + (r * 0.66).toFixed(1) + '" fill="' + petalColour + '" transform="rotate(' + a + ' ' + x + ' ' + y + ')"/>').join('') + '<circle cx="' + x + '" cy="' + y + '" r="' + (r * 0.3).toFixed(1) + '" fill="#FFE9A8"/>';
  return puffs.map((p) => '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + p[2] + '" fill="' + p[3] + '" opacity="' + p[4] + '"/>').join('')
    + blooms.map((b) => '<g>' + petal5(b[0], b[1], b[2]) + '</g>').join('');
}
const TREE_TRUNK = '<path d="M126 238 C124 210 122 190 116 172 C110 154 100 140 88 128 L96 120 C110 132 122 146 130 162 C132 150 133 140 134 130 L146 130 C147 142 149 154 152 166 C160 148 174 132 190 120 L197 128 C182 141 170 156 162 174 C155 192 154 214 154 238 Z" fill="#7A5539"/>'
  + '<path d="M134 130 C133 150 132 176 133 200 C134 216 135 228 136 238 L146 238 C145 226 144 212 144 196 C144 172 145 150 146 130 Z" fill="#6B4A32"/>'
  + '<path d="M136 168 C142 156 152 146 164 138" stroke="#7A5539" stroke-width="4" fill="none" stroke-linecap="round"/>'
  + '<path d="M133 152 C126 143 116 136 106 131" stroke="#7A5539" stroke-width="3.6" fill="none" stroke-linecap="round"/>';
const TREE_PUFFS = [[86, 92, 40], [136, 68, 46], [190, 88, 42], [60, 122, 32], [110, 116, 40], [168, 120, 38], [216, 118, 30], [140, 104, 48], [98, 60, 30], [178, 58, 28], [240, 96, 22], [40, 96, 22]];
const TREE_BLOOMS = [[70, 66, 9], [112, 44, 10], [156, 40, 9], [198, 60, 9], [232, 86, 8], [46, 100, 8], [92, 92, 10], [136, 78, 10], [180, 92, 9], [218, 112, 8], [66, 132, 8], [110, 130, 9], [152, 122, 10], [196, 132, 8], [128, 106, 8], [172, 66, 8], [88, 118, 7], [244, 118, 7]];
function treeShell(inner, glowFrom) {
  return '<svg viewBox="-6 -30 292 290" role="img" aria-hidden="true">'
    + '<defs><radialGradient id="tglow" cx="50%" cy="36%" r="62%"><stop offset="0%" stop-color="' + glowFrom + '" stop-opacity=".7"/><stop offset="100%" stop-color="' + glowFrom + '" stop-opacity="0"/></radialGradient></defs>'
    + '<circle cx="140" cy="94" r="118" fill="url(#tglow)"/>'
    + '<ellipse cx="140" cy="238" rx="76" ry="9" fill="#C9A5D8" opacity=".3"/>'
    + TREE_TRUNK + inner + '</svg>';
}
function treeSakuraSVG() {
  const tones = ['#F3BFD4', '#F7CBDD', '#F3BFD4', '#EFB3CB', '#F7CBDD', '#EFB3CB', '#F3BFD4', '#FAD8E6', '#FAD8E6', '#FAD8E6', '#F3BFD4', '#F3BFD4'];
  const op = [.55, .6, .55, .5, .55, .5, .5, .55, .5, .5, .45, .45];
  const puffs = TREE_PUFFS.map((p, i) => [p[0], p[1], p[2], tones[i], op[i]]);
  return treeShell(treeCanopy(puffs, TREE_BLOOMS, '#F7A9C6')
    + '<g fill="#FFF3C4"><circle cx="34" cy="58" r="2.2"/><circle cx="252" cy="70" r="2.4"/><circle cx="246" cy="34" r="1.6"/><circle cx="26" cy="140" r="1.8"/><circle cx="258" cy="150" r="1.6"/></g>', '#FFF3C4');
}
function treeNightSVG(still) {
  const puffs = TREE_PUFFS.map((p, i) => [p[0], p[1], p[2], i % 2 ? '#3B3168' : '#4A3E80', .72]);
  let flies = '';
  [[62, 78], [104, 58], [158, 74], [206, 96], [86, 128], [178, 132], [126, 96], [232, 70], [40, 108], [148, 44]].forEach((f, i) => {
    // Each firefly drifts on its own small loop as well as breathing, so the
    // swarm never pulses in time with itself.
    flies += '<g class="drift' + (still ? ' still' : '') + '" style="animation-delay:' + (i * 470) + 'ms;animation-duration:' + (6 + i % 4) + 's">'
      + '<circle class="fly' + (still ? '' : ' lit') + '" cx="' + f[0] + '" cy="' + f[1] + '" r="3.4" fill="#FFE9A8" style="animation-delay:' + (i * 320) + 'ms"/></g>';
  });
  let shafts = '';
  [[70, -8], [150, 4], [220, -6]].forEach((p, i) => {
    shafts += '<path class="shaft' + (still ? ' still' : '') + '" d="M' + p[0] + ' -30 l' + (26 + p[1]) + ' 0 l-46 268 l-26 0 Z" fill="#FFF3C4" opacity=".07" style="animation-delay:' + (i * 1700) + 'ms"/>';
  });
  let rising = '';
  if (!still) {
    [[70, 150], [118, 168], [166, 156], [206, 172], [94, 176]].forEach((p, i) => {
      rising += '<circle class="rise" cx="' + p[0] + '" cy="' + p[1] + '" r="2.6" fill="#FFF3C4" style="animation-delay:' + (i * 1700) + 'ms;animation-duration:' + (7 + i) + 's"/>';
    });
  }
  return treeShell(treeCanopy(puffs, TREE_BLOOMS.slice(0, 10), '#8E7FD6')
    + '<circle cx="238" cy="14" r="20" fill="#FFE9A8" opacity=".9"/>'
    + '<circle cx="238" cy="14" r="28" fill="#FFE9A8" opacity=".16"/>'
    + shafts
    + '<g fill="#FFF3C4" opacity=".9"><circle class="twinkle" cx="30" cy="44" r="1.8"/><circle class="twinkle" style="animation-delay:600ms" cx="250" cy="52" r="2"/><circle class="twinkle" style="animation-delay:1200ms" cx="210" cy="24" r="1.4"/><circle class="twinkle" style="animation-delay:1800ms" cx="60" cy="20" r="1.6"/></g>' + flies + rising, '#2E2756');
}
function treeGalaxySVG(still) {
  const puffs = TREE_PUFFS.map((p, i) => [p[0], p[1], p[2], i % 3 === 0 ? '#4B3A8F' : (i % 3 === 1 ? '#6C4FB8' : '#8A5FD0'), .6]);
  let stars = '';
  for (let i = 0; i < 34; i++) {
    const x = 24 + (i * 37) % 232, y = 20 + (i * 53) % 132, r = 1 + (i % 3) * 0.7;
    stars += '<circle class="twinkle' + (still ? ' still' : '') + '" cx="' + x + '" cy="' + y + '" r="' + r + '" fill="#FFF3C4" style="animation-delay:' + (i * 170) + 'ms"/>';
  }
  const shine = (x, y, r) => '<path d="M' + x + ' ' + (y - r) + ' Q' + x + ' ' + y + ' ' + (x + r) + ' ' + y + ' Q' + x + ' ' + y + ' ' + x + ' ' + (y + r) + ' Q' + x + ' ' + y + ' ' + (x - r) + ' ' + y + ' Q' + x + ' ' + y + ' ' + x + ' ' + (y - r) + ' Z" fill="#FFF3C4"/>';
  // A band of nebula behind the crown, and a star that falls across it now and
  // then: the free tree has neither.
  const nebula = '<ellipse cx="120" cy="76" rx="128" ry="62" fill="#7A4FD0" opacity=".22"/>'
    + '<ellipse cx="176" cy="52" rx="76" ry="38" fill="#C86FC0" opacity=".16"/>'
    + '<ellipse cx="64" cy="104" rx="70" ry="34" fill="#4FA8D0" opacity=".14"/>';
  /* A ring of stars turning slowly around the crown, drawn as one group so a
     single rotation carries all of them. */
  let ring = '';
  for (let k = 0; k < 14; k++) {
    const t = (k / 14) * Math.PI * 2;
    ring += '<circle cx="' + (140 + Math.cos(t) * 118).toFixed(1) + '" cy="' + (94 + Math.sin(t) * 74).toFixed(1) + '" r="' + (k % 3 === 0 ? 2.6 : 1.6) + '" fill="#FFF3C4" opacity="' + (k % 3 === 0 ? '.95' : '.6') + '"/>';
  }
  const wheel = still ? '' : '<g class="starwheel">' + ring + '</g>';
  /* Three lines of a constellation, breathing in and out. */
  const lines = still ? '' : '<g class="conste" stroke="#FFF3C4" stroke-width="1" fill="none" opacity=".5">'
    + '<path d="M74 66 L118 44 L162 62 L196 40"/><path d="M118 44 L134 88 L182 96"/><path d="M62 118 L104 104 L134 88"/></g>'
    + '<g fill="#FFF3C4" class="conste"><circle cx="74" cy="66" r="2.2"/><circle cx="118" cy="44" r="2.6"/><circle cx="162" cy="62" r="2.2"/><circle cx="196" cy="40" r="2"/><circle cx="134" cy="88" r="2.4"/><circle cx="182" cy="96" r="2"/><circle cx="62" cy="118" r="2"/><circle cx="104" cy="104" r="2.2"/></g>';
  const shooter = still ? '' : '<g class="shoot"><path d="M0 0 l30 16" stroke="#FFF3C4" stroke-width="2.2" stroke-linecap="round" opacity=".85"/><circle cx="31" cy="16.5" r="2.6" fill="#FFF3C4"/></g>';
  return treeShell(nebula + wheel + treeCanopy(puffs, [], '#B79BF0') + stars + lines + shine(140, 70, 15) + shine(96, 108, 9) + shine(196, 96, 8) + shooter, '#3A2A72');
}
function treeButterflySVG(still) {
  const puffs = TREE_PUFFS.map((p, i) => [p[0], p[1], p[2], i % 2 ? '#CFE7C4' : '#B9DCAC', .6]);
  /* The outer group holds the place, the middle one travels, the inner one
     beats its wings. Putting the animation on the group that carries the
     translate would throw the whole swarm back to the origin. */
  const wing = (x, y, c, i) => '<g transform="translate(' + x + ',' + y + ')">'
    + '<g class="wing w' + (i % 5) + (still ? ' still' : '') + '" style="animation-delay:' + (i * 900) + 'ms;animation-duration:' + (11 + i * 1.6) + 's">'
    + '<g class="flit' + (still ? ' still' : '') + '" style="animation-delay:' + (i * 430) + 'ms">'
    + '<ellipse cx="-5" cy="0" rx="6" ry="8" fill="' + c + '" opacity=".95"/><ellipse cx="5" cy="0" rx="6" ry="8" fill="' + c + '" opacity=".95"/>'
    + '<ellipse cx="-4" cy="6" rx="4" ry="5" fill="' + c + '" opacity=".8"/><ellipse cx="4" cy="6" rx="4" ry="5" fill="' + c + '" opacity=".8"/>'
    + '<rect x="-1" y="-7" width="2" height="15" rx="1" fill="#6B4A32"/></g></g></g>';
  let leaves = '';
  if (!still) {
    [[48, 0], [86, 1], [124, 2], [162, 3], [200, 4], [232, 5], [66, 6], [144, 7]].forEach((p, i) => {
      const c = ['#F5A6C9', '#F7D488', '#FFFFFF', '#EFA6E0'][i % 4];
      leaves += '<ellipse class="leaffall" cx="' + p[0] + '" cy="26" rx="5" ry="3.2" fill="' + c + '" style="animation-delay:' + (i * 1100) + 'ms;animation-duration:' + (7 + (i % 4)) + 's"/>';
    });
  }
  return treeShell(treeCanopy(puffs, TREE_BLOOMS.slice(0, 12), '#F4D06F')
    + '<circle cx="140" cy="80" r="104" fill="#FFF3C4" opacity=".13"/>'
    + leaves
    + wing(70, 84, '#F5A6C9', 0) + wing(186, 72, '#F7D488', 1) + wing(128, 50, '#A8CFF5', 2) + wing(212, 132, '#EFA6E0', 3) + wing(60, 140, '#F7D488', 4)
    + wing(150, 108, '#A8E6C9', 5) + wing(96, 66, '#F5A6C9', 6), '#FFF6DA');
}
function treeSVG() { return treeSVGFor(); }
/* The companions stand at the foot of the tree, so the two screens read as one
   garden. Tapping one opens its own page. */
/* Kept on the phone, on unless it is turned off: some people want the tree
   by itself. */
const TREE_PETS_KEY = 'nabu-tree-pets';
const treePetsOn = () => store.get(TREE_PETS_KEY, true) !== false;
function treePetHTML() {
  const pets = PETS.all();
  if (!pets.length || !treePetsOn()) return '';
  /* Each one strolls at its own pace, so a row of them never marches in step. */
  return '<span class="treepets">' + pets.map((p, i) => '<a class="treepet" href="#/play/pet" style="animation-delay:' + (i * 1300) + 'ms" aria-label="' + esc(p.name || L(PET_NAMES[p.kind])) + '">'
    + petSVG(p.kind, PETS.coat(p), PETS.fedToday(p) ? 'happy' : '', PETS.wear(p)) + '</a>').join('') + '</span>';
}
function renderTree() {
  const S = T(), m = $('#main');
  let msg = treeMsgOf(TODAY.last('tree')), busy = false;
  const draw = () => {
    m.innerHTML = '<div class="eyebrow">' + esc(S.actTitle) + '</div><h1 style="margin-bottom:6px">🌸 ' + esc(S.treeTitle) + '</h1><p class="muted">' + esc(S.treeIntro) + '</p>'
      + '<div class="card treewrap"><div class="treestage"><button type="button" class="tree" id="tree" aria-label="' + esc(S.treeShake) + '">' + treeSVG() + '<span class="petals" id="petals"></span></button>' + treePetHTML() + '</div>'
      + '<div class="treemsg" id="treemsg"' + (msg ? '' : ' hidden') + '><div class="eyebrow">' + esc(S.treeFor) + '</div><p id="treetext">' + (msg ? esc(L(msg)) : '') + '</p></div>'
      + (signedIn() ? (luckSpent('tree') ? '' : '<button class="btn primary block" id="shake">' + esc(msg ? S.treeAgain : S.treeShake) + '</button>') : needAccountHTML(S.needInLuck)) + '</div>'
      + todayHistoryHTML('tree')
      /* The designs come first, straight under the tree: somebody who never
         scrolls should still learn the tree can be changed. The switch for the
         companions goes to the foot of the screen, in a card of its own. */
      + lookStripHTML('tree')
      + '<div class="luckline">' + luckPanelHTML('tree') + '</div>'
      + (PETS.all().length
        ? '<div class="card setcard"><label class="remind"><input type="checkbox" id="treepets"' + (treePetsOn() ? ' checked' : '') + '><span>' + esc(S.treePets) + '</span></label>'
          + '<p class="hint">' + esc(S.treePetsHint) + '</p></div>'
        : '')
      + '<p style="margin-top:14px"><a class="btn block" href="#/unlock?from=app">💳 ' + esc(S.unlockLink) + '</a></p>'
      + '<p style="margin-top:14px"><a href="#/play" class="backlink">← ' + esc(S.actTitle) + '</a></p>';
    bindLookStrip(m, draw);
    { const tp = $('#treepets');
      if (tp) tp.addEventListener('change', () => { store.set(TREE_PETS_KEY, tp.checked); draw(); }); }
    const shake = () => {
      if (busy) return;
      busy = true;
      const tree = $('#tree'), pet = $('#petals'), btn = $('#shake'), box = $('#treemsg');
      const fid = document.activeElement === btn || document.activeElement === tree ? document.activeElement.id : '';   // read before the spin switches the button off
      luckSpend('tree');
      btn.disabled = true; box.hidden = true;
      tree.classList.remove('sway'); void tree.offsetWidth; tree.classList.add('sway');
      let html = '';
      for (let i = 0; i < 16; i++) {
        const left = 12 + Math.round(Math.random() * 76), dx = Math.round(Math.random() * 60 - 30);
        const delay = Math.round(Math.random() * 420), dur = 1100 + Math.round(Math.random() * 700);
        html += '<i style="left:' + left + '%;--dx:' + dx + 'px;animation-delay:' + delay + 'ms;animation-duration:' + dur + 'ms"></i>';
      }
      pet.innerHTML = html;
      let k = 0;
      try { const a = new Uint32Array(1); crypto.getRandomValues(a); k = a[0] % TREE_MSGS.length; }
      catch (e) { k = Math.floor(Math.random() * TREE_MSGS.length); }
      TODAY.add('tree', { k: k, fp: treeFp(TREE_MSGS[k]) });   // written the moment the turn is spent, beside the counter
      setTimeout(() => {
        msg = TREE_MSGS[k];
        $('#treetext').textContent = L(msg); box.hidden = false;
        tree.classList.remove('sway'); pet.innerHTML = '';
        busy = false;
        /* Redrawn either way: the free turn is now spent and the screen says so,
           and on Plus the day's list under the tree has a new line. draw() shows
           the message from msg and labels the button from it. An open list
           stays open and the focus stays where it was. */
        todayRedraw(draw, fid);
      }, 1400);
    };
    const sb = $('#shake'); if (sb) sb.addEventListener('click', shake);
    $('#tree').addEventListener('click', () => { if (sb) shake(); });
    bindLuck(m, draw);
  };
  draw();
}

/* ---- a coin for questions that only need yes or no ----
   The coin decides nothing. It puts one of the two answers in front of you so
   your own reaction to it becomes visible. */
/* One type size for both faces, worked out by measuring the two words rather
   than counting their letters: how wide a word draws depends on the letters and
   the font, not on how many there are. Measured once per language. */
const COIN_SIZE = {
  cache: {},
  get() {
    const S = T(), key = lang + '|' + S.coinYes + '|' + S.coinNo;
    if (this.cache[key]) return this.cache[key];
    const BASE = 40, ROOM = 104, MAX = 46;
    let size = 24;
    try {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('style', 'position:absolute;width:0;height:0;overflow:hidden');
      const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      t.setAttribute('font-family', 'Georgia,serif'); t.setAttribute('font-weight', '700');
      t.setAttribute('letter-spacing', '1'); t.setAttribute('font-size', String(BASE));
      svg.appendChild(t); document.body.appendChild(svg);
      let widest = 0;
      [S.coinYes, S.coinNo].forEach((w) => { t.textContent = w; widest = Math.max(widest, t.getBBox().width); });
      document.body.removeChild(svg);
      if (widest > 0) size = Math.max(16, Math.min(MAX, Math.floor(BASE * ROOM / widest)));
    } catch (e) { /* no layout yet: the conservative default still fits */ }
    this.cache[key] = size;
    return size;
  }
};

/* Both faces are struck the same way: one ornament, one type size worked out
   from the longer of the two words, and the pair centred as a block. Turning
   the coin over changes the word and nothing else. */
function coinFaceSVG(side) { return coinFaceFor(coinMetal(), side); }
function coinFaceFor(metal, side) {
  const S = T(), mtl = metal || coinMetal();
  const size = COIN_SIZE.get();
  // The word sits on the middle of the coin; every face leaves that band clear.
  const cap = size * 0.72;
  const wordY = 80 + cap / 2;
  const word = side ? (side === 'yes' ? S.coinYes : S.coinNo) : '';
  return '<svg viewBox="0 0 160 160" aria-hidden="true">'
    + (COIN_ART[mtl.id] || COIN_ART.gold)(mtl)
    + (side
      ? '<text x="80" y="' + wordY.toFixed(1) + '" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="' + size + '" letter-spacing="1" fill="' + mtl.ink + '">' + esc(word) + '</text>'
      : '<text x="80" y="102" text-anchor="middle" font-family="Georgia,serif" font-size="62" fill="' + mtl.rim + '">?</text>')
    + '</svg>';
}

/* ---- the coin answers a question, so there has to be one ----
   A yes or a no means nothing on its own, and a turn spent on nothing is a
   turn wasted, and the free flip is only one a day. So the button is dead
   until something is written in the box, and .btn[disabled] already draws it
   at half strength and refuses the press. The box writes to the store on every
   keystroke, so the store is what the button is built from. */
const askedQ = () => String(store.get('nabu-coinq', '') || '').trim().length > 0;

function renderCoin() {
  const S = T(), m = $('#main');
  const lastC = TODAY.last('coin'); let side = lastC && (lastC.side === 'yes' || lastC.side === 'no') ? lastC.side : '';
  const draw = () => {
    m.innerHTML = '<div class="eyebrow">' + esc(S.actTitle) + '</div><h1 style="margin-bottom:6px">🪙 ' + esc(S.coinTitle) + '</h1><p class="muted">' + esc(S.coinIntro) + '</p>'
      + '<div class="card coinwrap"><label class="f" for="coinq">' + esc(S.coinQ) + '</label><input id="coinq" placeholder="' + esc(S.coinQPh) + '" value="' + esc(store.get('nabu-coinq', '') || '') + '">'
      + '<div class="coin" id="coin">' + coinFaceSVG(side) + '</div>'
      + '<div class="coinres" id="coinres" aria-live="polite">' + (side ? esc(side === 'yes' ? S.coinYes : S.coinNo) : '') + '</div>'
      + (signedIn() ? (luckSpent('coin') ? '' : '<button class="btn primary block" id="coinflip"' + (askedQ() ? '' : ' disabled') + '>' + esc(side ? S.coinAgain : S.coinFlip) + '</button>') : needAccountHTML(S.needInLuck)) + '</div>'
      + todayHistoryHTML('coin')
      + lookStripHTML('coin')
      + '<div class="luckline">' + luckPanelHTML('coin') + '</div>'
      + '<p class="hint">' + esc(S.coinNote) + '</p>'
      + '<p style="margin-top:14px"><a class="btn block" href="#/unlock?from=app">💳 ' + esc(S.unlockLink) + '</a></p>'
      + '<p style="margin-top:14px"><a href="#/play" class="backlink">← ' + esc(S.actTitle) + '</a></p>';
    bindLookStrip(m, draw);
    const q = $('#coinq');
    q.addEventListener('input', () => {
      store.set('nabu-coinq', q.value);
      /* Not while it is spinning: that press already happened. */
      const b = $('#coinflip'), c = $('#coin');
      if (b && !(c && c.classList.contains('spin'))) b.disabled = !q.value.trim();
    });
    bindLuck(m, draw);
    const fb = $('#coinflip'); if (!fb) return;
    fb.addEventListener('click', () => {
      const el = $('#coin'), btn = $('#coinflip');
      if (el.classList.contains('spin')) return;
      /* The press cannot normally arrive with an empty box, but a turn is too
         expensive to lose to a keyboard or a script that gets one through. */
      if (!askedQ()) { btn.disabled = true; return; }
      const fid = document.activeElement === btn ? btn.id : '';   // read before the spin switches the button off
      luckSpend('coin');
      btn.disabled = true; $('#coinres').textContent = '';
      el.classList.add('spin');
      let bits = 0;
      try { const a = new Uint8Array(1); crypto.getRandomValues(a); bits = a[0] & 1; }
      catch (e) { bits = Math.random() < 0.5 ? 0 : 1; }
      TODAY.add('coin', { q: String(store.get('nabu-coinq', '') || '').trim().slice(0, 120), side: bits ? 'yes' : 'no' });
      setTimeout(() => {
        side = bits ? 'yes' : 'no'; el.classList.remove('spin'); el.innerHTML = coinFaceSVG(side);
        $('#coinres').textContent = side === 'yes' ? S.coinYes : S.coinNo;
        /* Redrawn either way: the free turn is now spent and the screen says so,
           and on Plus the day's list under the coin has a new line. The face is
           drawn from side, so the answer stays where it landed. An open list
           stays open and the focus stays on the button. */
        todayRedraw(draw, fid);
      }, 1000);
    });
  };
  draw();
}

/* ---- the daily diary: one entry per day, on the device only ---- */
/* Twelve moods, laid out six and six so the two rows are always even. */
const MOODS = ['😄', '🙂', '😌', '🥰', '🤩', '😐', '😔', '😢', '😤', '😰', '😴', '🤒'];
function renderDiary() {
  const S = T(), m = $('#main'), today = isoDate(new Date());
  /* A diary kept only in a browser is a diary somebody loses. */
  if (!signedIn()) { m.innerHTML = '<div class="eyebrow">' + esc(S.actTitle) + '</div><h1 style="margin-bottom:6px">\uD83D\uDCD4 ' + esc(S.diaryTitle) + '</h1>' + needAccountHTML(S.needInDiary); return; }
  const all = () => store.get('nabu-diary', {}) || {};
  /* What is being typed, kept apart from what has been saved. Closing the tab
     mid-sentence loses nothing, and nothing counts as written until Save. */
  const draft = () => store.get('nabu-diary-draft', null);
  /* Cleared means gone, not the string "null" sitting in its place. */
  const setDraft = (o) => { if (o) store.set('nabu-diary-draft', o); else store.del('nabu-diary-draft'); };
  const same = (a, b) => (a || { m: '', t: '' }).m === (b || { m: '', t: '' }).m
    && String((a || {}).t || '') === String((b || {}).t || '');
  /* Two people who are tied may read each other's pages, if both say so. The
     bond and their pages arrive on their own time, so the screen redraws when
     they do rather than waiting for them. */
  let bond = null, theirs = [], stopBond = null, stopDiary = null;
  const stopAll = () => {
    if (stopBond) { stopBond(); stopBond = null; }
    if (stopDiary) { stopDiary(); stopDiary = null; }
  };
  NAV.cleanup = stopAll;

  /* One question at a time. Whose move it is decides what the card says and
     what button is on it - never two switches with nobody told to press one. */
  const shareHTML = () => {
    if (!bond) return '';
    const you = LOVE.other(bond, LOVEDB.me()), nm = (you && (you.name || (you.handle ? '@' + you.handle : ''))) || S.loveSomeone;
    const step = LOVEDB.diaryStep(bond);
    const head = '<div class="ghead"><span class="gk">\uD83E\uDDE7</span><h3>' + esc(S.diaryShareTitle) + '</h3></div>';
    const body = {
      off: '<p class="hint">' + esc(S.diaryShareHint) + '</p>'
        + '<button type="button" class="btn primary block" id="dask">' + esc(S.diaryAsk(nm)) + '</button>',
      asked: '<p class="hint">' + esc(S.diaryWait(nm)) + '</p>'
        + '<button type="button" class="btn block" id="dstop">' + esc(S.diaryTakeBack) + '</button>',
      invited: '<p class="lead">' + esc(S.diaryInvited(nm)) + '</p>'
        + '<p class="hint">' + esc(S.diaryInvitedHint) + '</p>'
        + '<div class="row"><button type="button" class="btn primary" id="dyes">' + esc(S.diaryApprove) + '</button>'
        + '<button type="button" class="btn" id="dno">' + esc(S.diaryDecline) + '</button></div>',
      on: '<p class="hint ok">' + esc(S.diaryShareBoth(nm)) + '</p>'
        + '<p class="hint">' + esc(S.diaryStopHint) + '</p>'
        + '<button type="button" class="btn block danger" id="dstop">' + esc(S.diaryStop) + '</button>'
    }[step];
    return '<div class="card sharecard step-' + step + (step === 'on' ? ' on' : '') + (step === 'invited' ? ' fresh' : '') + '">'
      + head + body + '<p class="hint" id="dsharest"></p></div>';
  };

  const theirHTML = () => {
    if (!bond || !LOVEDB.diaryBoth(bond)) return '';
    const you = LOVE.other(bond, LOVEDB.me()), nm = (you && (you.name || '')) || S.loveSomeone;
    return '<h3 style="margin:16px 0 8px">\uD83D\uDCD6 ' + esc(S.diaryTheirs(nm)) + '</h3>'
      + (theirs.length
        ? theirs.slice(0, 60).map((x) => '<div class="card diary past theirs ' + diaryPaperClass() + '">'
          + '<div class="date"><span>' + (x.m ? x.m + ' ' : '') + esc(fmtDate(x.day)) + '</span><span class="faint">' + esc(nm) + '</span></div>'
          + '<p>' + esc(x.t || '').replace(/\n/g, '<br>') + '</p></div>').join('')
        : '<p class="hint">' + esc(S.diaryTheirsNone(nm)) + '</p>');
  };

  const draw = () => {
    const d = all(), saved = d[today] || null;
    const dr = draft();
    /* The draft wins while there is one, so a redraw does not throw away
       half a sentence. */
    const cur = dr || saved || { m: '', t: '' };
    /* Today is on the shelf too, once it has been saved: seeing it arrive
       there is the whole point of pressing the button. */
    const days = Object.keys(d).sort().reverse();
    m.innerHTML = '<div class="eyebrow">' + esc(S.actTitle) + '</div><h1 style="margin-bottom:6px">📔 ' + esc(S.diaryTitle) + '</h1><p class="muted">' + esc(S.diaryIntro) + '</p>'
      + '<div class="card diary ' + diaryPaperClass() + '"><div class="date"><span>' + esc(S.diaryToday) + ' · ' + esc(fmtDate(today)) + '</span><span class="faint" id="dsaved"></span></div>'
      + '<p class="hint" style="margin:8px 0 6px">' + esc(S.diaryMood) + '</p><div class="moods">' + MOODS.map((x) => '<button type="button" class="mood' + (cur.m === x ? ' on' : '') + '" data-mood="' + x + '">' + x + '</button>').join('') + '</div>'
      + '<textarea id="dtext" placeholder="' + esc(S.diaryPh) + '">' + esc(cur.t || '') + '</textarea>'
      + '<button type="button" class="btn primary block" id="dsave" style="margin-top:10px">' + esc(S.diarySave) + '</button></div>'
      + '<h3 style="margin:16px 0 8px">' + esc(S.diaryPast) + (days.length ? ' <span class="faint">· ' + esc(S.diaryCount(days.length)) + '</span>' : '') + '</h3>'
      + (days.length ? days.map((k) => '<div class="card diary past' + (k === today ? ' istoday' : '') + ' ' + diaryPaperClass() + '" data-day="' + k + '"><div class="date"><span>' + (d[k].m ? d[k].m + ' ' : '') + (k === today ? esc(S.diaryToday) + ' · ' : '') + esc(fmtDate(k)) + '</span><button type="button" class="linkbtn" data-ddel="' + k + '">' + esc(S.diaryDel) + '</button></div><p>' + esc(d[k].t || '').replace(/\n/g, '<br>') + '</p></div>').join('') : '<p class="hint">' + esc(S.diaryEmpty) + '</p>')
      + theirHTML()
      + shareHTML()
      + lookStripHTML('diary')
      + '<p style="margin-top:12px"><a href="#/play" class="backlink">← ' + esc(S.actBack) + '</a></p>';
    bindLookStrip(m, draw);
    /* Saying yes - whether asking or approving - is the same write: my own
       consent. Two of them make it live, which is what the rule reads. */
    const answer = async (btn, on) => {
      const b = $(btn); if (!b) return;
      b.addEventListener('click', async () => {
        const st = $('#dsharest');
        b.disabled = true; st.className = 'hint'; st.textContent = S.loveSaving;
        try {
          await LOVEDB.setDiaryShare(bond.id, bond, on);
          /* Agreeing sends what is already written for today, so there is
             something to read at once. Stopping has already taken it back. */
          if (on) { const d3 = all()[today]; if (d3) await LOVEDB.putDiaryDay(bond.id, today, d3); }
          toast(on ? S.diaryAskSent : S.diaryStopped);
        } catch (e) { b.disabled = false; st.className = 'hint err'; st.textContent = loveWhy(e); }
      });
    };
    answer('#dask', true);
    answer('#dyes', true);
    answer('#dno', false);
    answer('#dstop', false);
    const onScreen = () => {
      const t = $('#dtext').value, on2 = $('.mood.on', m);
      return { m: on2 ? on2.getAttribute('data-mood') : '', t: t };
    };
    /* What the corner says: nothing when the page is empty and untouched,
       otherwise whether what is on screen is what was saved. */
    const mark = () => {
      const now = onScreen(), empty = !now.t.trim() && !now.m;
      const st = $('#dsaved');
      if (empty && !saved) { st.textContent = ''; st.className = 'faint'; return; }
      const clean = same(now, saved);
      st.textContent = clean ? S.diarySaved : S.diaryUnsaved;
      st.className = clean ? 'faint ok' : 'faint warn';
    };
    /* Typing keeps a draft so nothing is lost, and writes no page. */
    const keep = () => { setDraft(onScreen()); mark(); };
    $('#dtext').addEventListener('input', keep);
    $$('[data-mood]', m).forEach((b) => b.addEventListener('click', () => { const on = b.classList.contains('on'); $$('[data-mood]', m).forEach((x) => x.classList.remove('on')); if (!on) b.classList.add('on'); keep(); }));
    mark();

    $('#dsave').addEventListener('click', async () => {
      const now = onScreen(), d2 = all();
      if (!now.t.trim() && !now.m) { toast(S.diaryNothing); return; }
      d2[today] = { m: now.m || '', t: now.t };
      store.set('nabu-diary', d2);
      setDraft(null);
      /* Sent to a partner on save, not on every keystroke - which is both what
         anybody would expect and a great many fewer writes. */
      if (bond && LOVEDB.diaryMine(bond)) LOVEDB.putDiaryDay(bond.id, today, d2[today]).catch(() => {});
      toast(S.diarySavedToast);
      draw();
    });
    $$('[data-ddel]', m).forEach((b) => b.addEventListener('click', () => {
      if (!confirm(S.confirmDel)) return;
      const k = b.getAttribute('data-ddel'), d2 = all();
      delete d2[k]; store.set('nabu-diary', d2);
      /* Otherwise the draft would put today's page straight back. */
      if (k === today) setDraft(null);
      if (k === today && bond && LOVEDB.diaryMine(bond)) LOVEDB.putDiaryDay(bond.id, today, null).catch(() => {});
      draw();
    }));
  };
  draw();

  if (LOVEDB.ok() && LOVE.local().bond) {
    stopBond = LOVEDB.watchMine((b) => {
      bond = b;
      if (b && LOVEDB.diaryBoth(b)) {
        if (!stopDiary) stopDiary = LOVEDB.watchTheirDiary(b.id, (list) => { theirs = list; draw(); });
      } else if (stopDiary) { stopDiary(); stopDiary = null; theirs = []; }
      draw();
    });
  }
}
/* The newest open activity, shown on the home screen. */
async function homeActHTML(root) {
  const list = (await loadActs()).slice().sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const a = list.filter(actOpen)[0] || list[0];
  if (!a || !root) return;
  const S = T();
  const pets = PETS.all();
  const quick = [
    ['#/play/pet', '🐾', pets.length === 1 ? (pets[0].name || L(PET_NAMES[pets[0].kind])) : S.petTitle],
    ['#/play/tree', '🌸', S.treeTitle],
    ['#/play/coin', '🪙', S.coinTitle],
    ['#/play/diary', '📔', S.diaryTitle]
  ];
  root.innerHTML = '<div class="sec"><div class="eyebrow">🎲 ' + esc(S.actTitle) + '</div>'
    + '<div class="actquick">' + quick.map((q) => '<a class="aq" href="' + q[0] + '"><span class="ic">' + q[1] + '</span><b>' + esc(q[2]) + '</b></a>').join('') + '</div>'
    /* The three published kinds, and the thread beside them: four across, the
       same shape as the row of everyday things above. When the thread is tied
       it carries the days, so the count is on the first screen. */
    + '<div class="actquick next">' + ACT_GROUPS.map((g) => {
      const n = list.filter((a2) => a2.type === g[0]).length;
      return '<a class="aq" href="#/play/' + esc(g[2]) + '"><span class="ic">' + g[1] + '</span><b>' + esc(S.actTypes[g[0]]) + '</b>' + (n ? '<span class="cnt">' + n + '</span>' : '') + '</a>';
    }).join('')
    + '<a class="aq" href="#/love"><span class="ic">' + loveKnotSVG() + '</span><b>' + esc(S.loveTitle) + '</b>'
    + (LOVE.local().bond ? '<span class="cnt">' + LOVE.days({ since: LOVE.local().since }) + '</span>' : '') + '</a>'
    + '</div>'
    + '<p style="margin-top:10px"><a class="btn block" href="#/play">' + esc(S.actAll) + '</a></p></div>';
  hydrateImages(root);
}
ROUTES.play = { nav: 'play', render: renderPlay };

/* ---- German for activities that were published before German existed ----
   The list a visitor sees comes from the cloud whenever anything has been
   saved from the dashboard, and that copy can be older than a translation.
   The two JSON files ship with the app and do carry it, so loadActs() fills
   the gaps from them every time it loads, and nobody has to do anything for
   the polls to read German. Only a missing value is written; text already
   there is never touched. The dashboard button does the same fill and saves
   it back, so the work is stored rather than repeated on every load. */
async function germanFromFiles() {
  const map = {};
  /* Cached under their own keys: 'nabu-acts' belongs to the cloud copy and
     must not be overwritten with the file. */
  for (const [path, key] of [['activities.json', 'nabu-acts-src'], ['activities-stock.json', 'nabu-acts-stock']]) {
    const r = await loadJSON(path, key);
    const walk = (o) => {
      if (!o || typeof o !== 'object') return;
      if (Array.isArray(o)) { o.forEach(walk); return; }
      if (typeof o.de === 'string' && o.de) {
        if (typeof o.vi === 'string' && o.vi) map[o.vi] = o.de;
        if (typeof o.en === 'string' && o.en) map[o.en] = o.de;
        return;
      }
      Object.keys(o).forEach((k) => walk(o[k]));
    };
    walk((r.data && r.data.items) || []);
  }
  return map;
}

function fillActsDe(items, map) {
  let filled = 0;
  const missing = [];
  const walk = (o) => {
    if (!o || typeof o !== 'object') return;
    if (Array.isArray(o)) { o.forEach(walk); return; }
    if (typeof o.vi === 'string' && typeof o.en === 'string') {
      if (!o.de) {
        const de = map[o.vi] || map[o.en];
        if (de) { o.de = de; filled++; }
        else if (missing.indexOf(o.en) < 0) missing.push(o.en);
      }
      return;
    }
    Object.keys(o).forEach((k) => walk(o[k]));
  };
  walk(items);
  return { filled: filled, missing: missing };
}

/* ---- dashboard: create and answer activities ---- */
function adminActivities(p) {
  const S = T();
  let items = [], editing = null;
  const form = (a) => {
    a = a || { type: 'pile', date: isoDate(new Date()), title: { vi: '', en: '' }, intro: { vi: '', en: '' }, piles: [{ label: '', msg: { vi: '', en: '' } }, { label: '', msg: { vi: '', en: '' } }, { label: '', msg: { vi: '', en: '' } }], options: [], results: false, closed: false, resultsDate: '' };
    const pileRows = (a.piles || []).map((pl, i) => '<div class="card" style="padding:12px"><b>' + esc(S.actPileN(i + 1)) + '</b><input data-pl="' + i + '" placeholder="' + esc(S.actPileLabel) + '" value="' + esc(pl.label || '') + '" style="margin:6px 0"><label class="f" style="margin-top:6px">' + esc(S.actPileArt) + '</label><select data-part="' + i + '"><option value="">' + esc(S.actArtAuto) + '</option>' + S.actArts.map((n, k) => '<option value="' + k + '"' + (pl.art === k ? ' selected' : '') + '>' + esc(n) + '</option>').join('') + '</select><textarea data-pmsg="' + i + '" placeholder="' + esc(S.actPileMsg) + '">' + esc(L2(pl.msg, 'vi')) + '</textarea><textarea data-pmsgen="' + i + '" placeholder="' + esc(S.actPileMsgEn) + '" style="min-height:60px;margin-top:6px">' + esc(L2(pl.msg, 'en')) + '</textarea><textarea data-pmsgde="' + i + '" placeholder="' + esc(S.actPileMsgDe) + '" style="min-height:60px;margin-top:6px">' + esc(L2(pl.msg, 'de')) + '</textarea></div>').join('');
    return '<div class="card"><h3 id="ahead" style="margin-bottom:6px">' + esc(editing ? S.edit : S.actNew) + '</h3>'
      + '<label class="f">' + esc(S.actType) + '</label><div class="chips">' + ['pile', 'poll', 'wish'].map((t) => '<button type="button" class="chip' + (a.type === t ? ' on' : '') + '" data-atype="' + t + '">' + esc(S.actTypes[t]) + '</button>').join('') + '</div>'
      + '<div class="two"><div><label class="f" for="adate">' + esc(S.postDate) + '</label><input id="adate" type="date" value="' + esc(a.date) + '"></div><div><label class="f" for="ardate">' + esc(S.actResultsDate) + '</label><input id="ardate" type="date" value="' + esc(a.resultsDate || '') + '"></div></div>'
      + '<label class="f" for="atitle">' + esc(S.postTitle) + '</label><input id="atitle" value="' + esc(L2(a.title, 'vi')) + '"><label class="f" for="atitle_en">' + esc(S.postTitleEn) + '</label><input id="atitle_en" value="' + esc(L2(a.title, 'en')) + '"><label class="f" for="atitle_de">' + esc(S.postTitleDe) + '</label><input id="atitle_de" value="' + esc(L2(a.title, 'de')) + '">'
      + '<label class="f" for="aintro">' + esc(S.actIntroLabel) + '</label><textarea id="aintro">' + esc(L2(a.intro, 'vi')) + '</textarea>'
      + '<label class="f" for="aintro_de">' + esc(S.actIntroDe) + '</label><textarea id="aintro_de">' + esc(L2(a.intro, 'de')) + '</textarea>'
      + '<div id="apiles"' + (a.type === 'pile' ? '' : ' hidden') + '><p class="hint" style="margin:12px 0 8px">' + esc(S.actPilesHint) + '</p>' + pileRows + '<div class="row nw"><button type="button" class="btn sm" id="apadd">+ ' + esc(S.actPileAdd) + '</button><button type="button" class="btn sm" id="apdel">− ' + esc(S.actPileDel) + '</button></div>'
      + '<label class="f" style="display:flex;gap:8px;align-items:center;margin-top:14px"><input type="checkbox" id="aresults" style="width:auto"' + (actAnswered(a) ? ' checked' : '') + '>' + esc(S.actResultsOn) + '</label></div>'
      + '<div id="apoll"' + (a.type === 'poll' ? '' : ' hidden') + '><label class="f" for="aopts">' + esc(S.actOptions) + '</label><textarea id="aopts">' + esc((a.options || []).map((o) => L2(o, 'vi')).join('\n')) + '</textarea><label class="f" for="aopts_de">' + esc(S.actOptionsDe) + '</label><textarea id="aopts_de">' + esc((a.options || []).map((o) => L2(o, 'de')).join('\n')) + '</textarea><label class="f" style="display:flex;gap:8px;align-items:center;margin-top:10px"><input type="checkbox" id="aclosed" style="width:auto"' + (a.closed ? ' checked' : '') + '>' + esc(S.actCloseOn) + '</label></div>'
      + '<div class="btns" style="margin-top:16px"><button class="btn primary" id="apub">' + esc(S.publish) + '</button><button class="btn" id="anew">' + esc(S.actNew) + '</button></div>'
      + '<div class="btns" style="margin-top:8px"><button class="btn" id="adefill">' + esc(S.actFillDe) + '</button></div>'
      + '<p class="hint">' + esc(S.actFillDeHint) + '</p><p id="astatus" class="hint"></p></div>'
      + '<div class="card"><h3 style="margin-bottom:6px">' + esc(S.actExisting) + '</h3><div class="plist" id="alist">' + (items.length ? items.map((x) => '<div class="it"><div class="tt"><div>' + esc(S.actTypes[x.type] || x.type) + ' · ' + esc(L2(x.title, 'vi') || L2(x.title, 'en')) + '</div><div class="d">' + esc(x.date) + (x.results ? ' · ✓' : '') + '</div></div><button class="btn sm" data-aedit="' + esc(x.id) + '">' + esc(S.edit) + '</button><button class="btn sm" data-adel="' + esc(x.id) + '">' + esc(S.del) + '</button></div>').join('') : '<p class="hint">' + esc(S.actEmpty) + '</p>') + '</div></div>';
  };
  let cur = null;
  const draw = () => {
    p.innerHTML = form(cur);
    const status = (t, cls) => { const s = $('#astatus'); s.textContent = t; s.className = 'hint ' + (cls || ''); };
    $$('#aintro, [data-pmsg], [data-pmsgen]', p).forEach((ta) => attachToolbar(ta, status));
    const read = () => {
      const type = $('.chip.on[data-atype]') ? $('.chip.on[data-atype]').getAttribute('data-atype') : 'pile';
      const a = { id: (cur && cur.id) || ($('#adate').value || isoDate(new Date())) + '-' + Math.random().toString(36).slice(2, 6), type: type, date: $('#adate').value || isoDate(new Date()), resultsDate: $('#ardate').value || '',
        title: { vi: $('#atitle').value.trim(), en: $('#atitle_en').value.trim(), de: $('#atitle_de').value.trim() }, intro: { vi: $('#aintro').value.trim(), en: (cur && cur.intro && cur.intro.en) || '', de: $('#aintro_de').value.trim() }, results: !!$('#aresults').checked, closed: !!$('#aclosed').checked };
      if (type === 'pile') a.piles = $$('[data-pl]', p).map((inp, i) => { const art = $('[data-part="' + i + '"]', p).value; const o = { label: inp.value.trim(), msg: { vi: $('[data-pmsg="' + i + '"]', p).value.trim(), en: $('[data-pmsgen="' + i + '"]', p).value.trim(), de: $('[data-pmsgde="' + i + '"]', p).value.trim() } }; if (art !== '') o.art = Number(art); return o; });
      if (type === 'poll') {
        const de = $('#aopts_de').value.split('\n').map((x) => x.trim());
        a.options = $('#aopts').value.split('\n').map((x) => x.trim()).filter(Boolean).map((x, i) => {
          const old = ((cur && cur.options) || []).filter((o) => L2(o, 'vi') === x)[0], o = { vi: x };
          if (old && old.en) o.en = old.en;
          /* The German list is read line for line against the Vietnamese one; a
             line left blank keeps whatever that option already had. */
          if (de[i]) o.de = de[i]; else if (old && old.de) o.de = old.de;
          return o;
        });
      }
      if (!a.title.en) delete a.title.en;
      return a;
    };
    $$('[data-atype]', p).forEach((b) => b.addEventListener('click', () => { cur = read(); cur.type = b.getAttribute('data-atype'); if (cur.type === 'pile' && !(cur.piles || []).length) cur.piles = [{ label: '', msg: {} }, { label: '', msg: {} }, { label: '', msg: {} }]; draw(); }));
    $('#apadd').addEventListener('click', () => { cur = read(); if ((cur.piles || []).length < 5) cur.piles.push({ label: '', msg: {} }); draw(); });
    $('#apdel').addEventListener('click', () => { cur = read(); if ((cur.piles || []).length > 2) cur.piles.pop(); draw(); });
    $('#anew').addEventListener('click', () => { cur = null; editing = null; draw(); });
    $$('[data-aedit]', p).forEach((b) => b.addEventListener('click', () => { cur = JSON.parse(JSON.stringify(items.filter((x) => x.id === b.getAttribute('data-aedit'))[0])); editing = cur.id; draw(); $('#ahead').scrollIntoView({ behavior: 'smooth' }); }));
    $('#adefill').addEventListener('click', async () => {
      status(S.translating);
      try {
        const map = await germanFromFiles();
        const r = fillActsDe(items, map);
        if (!r.filled) { status(S.actFillDeNone, 'ok'); return; }
        await BE.setContent('activities', actsDoc(items));
        ACTS.items = items; ACTS.loaded = true;
        status(S.actFillDeDone(r.filled, r.missing.length), 'ok');
        draw();
      } catch (e) { status(S.publishFail + ': ' + e.message, 'err'); }
    });
    $$('[data-adel]', p).forEach((b) => b.addEventListener('click', async () => { if (!confirm(S.confirmDel)) return; const id = b.getAttribute('data-adel'); items = items.filter((x) => x.id !== id); if (ACTS.stock && ACTS.stock[id]) ACTS.hidden = (ACTS.hidden || []).concat(id); try { await BE.setContent('activities', actsDoc(items)); ACTS.items = items; toast(T().saved); draw(); } catch (e) { status(S.publishFail + ': ' + e.message, 'err'); } }));
    $('#apub').addEventListener('click', async () => {
      const a = read();
      if (!a.title.vi) { status(S.needBody, 'err'); return; }
      if (a.type === 'pile' && !(a.piles || []).some((x) => x.msg.vi || x.label)) { status(S.actNeedPiles, 'err'); return; }
      if (a.type === 'poll' && (a.options || []).length < 2) { status(S.actNeedOptions, 'err'); return; }
      if (!cloud()) { status(S.adminLogin, 'err'); return; }
      if (CONFIG.geminiKey) {
        status(S.translating);
        try { await fillEN(a.title); await fillEN(a.intro); for (const pl of (a.piles || [])) await fillEN(pl.msg); for (const o of (a.options || [])) await fillEN(o); toast(S.translated); }
        catch (e) { status(S.translateFail, 'err'); }
      }
      items = [a].concat(items.filter((x) => x.id !== a.id));
      try { await BE.setContent('activities', actsDoc(items)); ACTS.items = items; ACTS.loaded = true; status(S.published, 'ok'); cur = null; editing = null; draw(); }
      catch (e) { status(S.publishFail + ': ' + e.message, 'err'); }
    });
  };
  p.innerHTML = '<p class="hint">…</p>';
  loadActs().then((list) => { items = list.slice(); draw(); });
}
