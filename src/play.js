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
  ACTS.items = items; ACTS.loaded = true;
  return ACTS.items;
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
const PILE_ARTS = [
  { bg: ['#2B1D4A', '#4A2C6E'], fan: '#E9C784', draw: '<rect x="38" y="78" width="24" height="30" rx="4" fill="#F2D6A2"/><rect x="38" y="78" width="24" height="6" rx="3" fill="#FFF0C9"/><path d="M50 74 C 44 66, 46 58, 50 52 C 54 58, 56 66, 50 74 Z" fill="#FFB347"/><path d="M50 72 C 47 67, 48 62, 50 58 C 52 62, 53 67, 50 72 Z" fill="#FFF3B0"/><circle cx="50" cy="60" r="18" fill="#FFB347" opacity=".18"/>' },
  { bg: ['#F8D5E0', '#F3B4C8'], fan: '#F6BBCB', draw: '<path d="M20 110 C 40 90, 60 70, 84 40" stroke="#8A5A3C" stroke-width="3" fill="none" stroke-linecap="round"/>' + [[34, 92], [52, 74], [70, 56]].map((c) => [0, 72, 144, 216, 288].map((r) => '<ellipse cx="' + c[0] + '" cy="' + (c[1] - 8) + '" rx="5" ry="8" fill="#FF9EBB" transform="rotate(' + r + ' ' + c[0] + ' ' + c[1] + ')"/>').join('') + '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="3" fill="#FFE07A"/>').join('') },
  { bg: ['#1E2A57', '#3A4B8A'], fan: '#AFC8F0', draw: '<circle cx="54" cy="66" r="24" fill="#FFF3C4"/><circle cx="64" cy="60" r="22" fill="#2A3A72"/><circle cx="26" cy="36" r="1.6" fill="#fff"/><circle cx="76" cy="26" r="1.2" fill="#fff"/><circle cx="20" cy="96" r="1.4" fill="#fff"/><circle cx="82" cy="104" r="1.8" fill="#fff"/><path d="M40 108 h6 M43 105 v6" stroke="#fff" stroke-width="1"/>' },
  { bg: ['#3B2A5E', '#6E4FA8'], fan: '#C7B6F3', draw: '<path d="M18 118 L 30 70 L 42 118 Z" fill="#B48CE0"/><path d="M34 118 L 50 44 L 66 118 Z" fill="#CBA6F0"/><path d="M58 118 L 72 62 L 86 118 Z" fill="#A67BD8"/><path d="M50 44 L 58 118 L 42 118 Z" fill="#E4D2F8" opacity=".55"/><rect x="12" y="116" width="76" height="8" rx="3" fill="#8F86A8"/>' },
  { bg: ['#F7D98A', '#F0B24A'], fan: '#E5BE5E', draw: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((r) => '<line x1="50" y1="30" x2="50" y2="20" stroke="#FFF6D2" stroke-width="3" stroke-linecap="round" transform="rotate(' + r + ' 50 66)"/>').join('') + '<circle cx="50" cy="66" r="20" fill="#FFF1B8"/><circle cx="50" cy="66" r="14" fill="#FFD966"/>' },
  { bg: ['#1F5F63', '#3B8F8E'], fan: '#9BD3CF', draw: '<circle cx="42" cy="52" r="16" fill="none" stroke="#F2D6A2" stroke-width="6"/><rect x="52" y="54" width="34" height="7" rx="3" fill="#F2D6A2" transform="rotate(35 52 54)"/><rect x="70" y="72" width="7" height="12" rx="2" fill="#F2D6A2" transform="rotate(35 70 72)"/><rect x="78" y="82" width="7" height="9" rx="2" fill="#F2D6A2" transform="rotate(35 78 82)"/>' },
  { bg: ['#E7DDF7', '#C9B8EE'], fan: '#D9CDF3', draw: '<path d="M30 116 C 40 80, 56 52, 78 28 C 74 60, 62 92, 36 114 Z" fill="#8E7CC3"/><path d="M30 116 C 46 84, 60 60, 78 28" stroke="#F4EEFB" stroke-width="2" fill="none"/>' + [40, 52, 64, 76].map((y) => '<path d="M' + (86 - (y - 40) * 0.55) + ' ' + y + ' L ' + (58 - (y - 40) * 0.2) + ' ' + (y + 14) + '" stroke="#F4EEFB" stroke-width="1.2" opacity=".8"/>').join('') },
  { bg: ['#2F4E86', '#5A8FD0'], fan: '#AFC8F0', draw: [0, 1, 2, 3].map((k) => '<path d="M0 ' + (70 + k * 14) + ' C 15 ' + (60 + k * 14) + ', 25 ' + (80 + k * 14) + ', 40 ' + (70 + k * 14) + ' S 65 ' + (60 + k * 14) + ', 80 ' + (70 + k * 14) + ' S 100 ' + (76 + k * 14) + ', 110 ' + (70 + k * 14) + '" fill="none" stroke="#EAF3FF" stroke-width="3" opacity="' + (0.9 - k * 0.2) + '"/>').join('') + '<circle cx="74" cy="34" r="8" fill="#FFF3C4"/>' }
];
function pileArtSVG(k) {
  const a = PILE_ARTS[((k % PILE_ARTS.length) + PILE_ARTS.length) % PILE_ARTS.length], g = 'pg' + k;
  return '<svg viewBox="0 0 100 140" class="pileart" data-art="' + k + '"><defs><linearGradient id="' + g + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + a.bg[0] + '"/><stop offset="1" stop-color="' + a.bg[1] + '"/></linearGradient></defs>'
    + '<rect x="14" y="10" width="72" height="104" rx="8" fill="' + a.fan + '" opacity=".55" transform="rotate(-9 50 62)"/><rect x="14" y="10" width="72" height="104" rx="8" fill="' + a.fan + '" opacity=".75" transform="rotate(7 50 62)"/>'
    + '<rect x="10" y="8" width="80" height="124" rx="10" fill="url(#' + g + ')" stroke="#FFF7EE" stroke-width="2"/><g clip-path="inset(0 round 10px)">' + a.draw + '</g>'
    + '<path d="M80 18 l1.6 3.4 3.4 1.6 -3.4 1.6 -1.6 3.4 -1.6 -3.4 -3.4 -1.6 3.4 -1.6 Z" fill="#FFF7EE" opacity=".9"/><path d="M20 118 l1.2 2.6 2.6 1.2 -2.6 1.2 -1.2 2.6 -1.2 -2.6 -2.6 -1.2 2.6 -1.2 Z" fill="#FFF7EE" opacity=".8"/></svg>';
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
        toast('✓');
      }));
    } else if (a.type === 'poll') {
      const draw = (counts) => { const total = counts && counts.total || 0; $$('[data-opt]', card).forEach((b) => { const n = counts ? (counts[b.getAttribute('data-opt')] || 0) : 0, pct = total ? Math.round(n * 100 / total) : 0; $('.bar', b).style.width = pct + '%'; $('.pct', b).textContent = total ? pct + '%' : ''; }); const st = $('.pollstat', card); if (st) st.textContent = S.actResultsPublic + ': ' + (total ? S.actVotes(total) : S.actNoVotes); };
      countVotes(a.id).then(draw);
      $$('[data-opt]', card).forEach((b) => b.addEventListener('click', async () => {
        if (!(BE.enabled && BE.user)) { toast(S.actVoteLogin); location.hash = '#/me?next=play'; return; }
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
const ACT_GROUPS = [['pile', '🃏'], ['poll', '📊'], ['wish', '🌠']];
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
  if (args && args[0] === 'pet') { renderPet(); return; }
  const list = (await loadActs()).slice().sort((a, b) => String(b.date).localeCompare(String(a.date)));
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
    + '<a class="actbtn act-tree live" href="#/play/tree"><span class="ic">🌸</span><span class="body"><b>' + esc(S.treeTitle) + '</b><span class="meta">' + esc(S.treeSub) + '</span></span><span class="go">›</span></a>'
    + '<a class="actbtn act-coin live" href="#/play/coin"><span class="ic">🪙</span><span class="body"><b>' + esc(S.coinTitle) + '</b><span class="meta">' + esc(S.coinSub) + '</span></span><span class="go">›</span></a>'
    + '<a class="actbtn act-diary live" href="#/play/diary"><span class="ic">📔</span><span class="body"><b>' + esc(S.diaryTitle) + '</b><span class="meta">' + esc(S.diarySub) + (diaryN ? ' · ' + esc(S.diaryCount(diaryN)) : '') + '</span></span><span class="chev">›</span></a>'
    + (list.length ? actGroupsHTML(list) : '<p class="empty">' + esc(S.actEmpty) + '</p>') + '</div>';
  bindActGroups(m);
}
/* ---- one free turn a week, or a code for unlimited ----
   Shown under the coin and under the tree: where the visitor stands this week,
   and, when the free turn is gone, what unlimited costs and where the code goes. */
function luckPanelHTML(kind) {
  const S = T();
  if (luckUnlimited(kind)) return '<p class="hint">✓ ' + esc(S.luckOpen) + '</p>';
  if (!luckSpent(kind)) return '<p class="hint">' + esc(S.luckFree) + '</p>';
  return '<div class="card luckbox"><p class="lead">' + esc(S.luckSpent(fmtDate(weekNext()))) + '</p>'
    + '<p class="hint" style="margin-bottom:10px">' + esc(S.luckOffer) + '</p>'
    + '<div class="row nw"><input id="luckcode" placeholder="' + esc(S.luckCodePh) + '" autocapitalize="characters"><button class="btn" id="luckgo">' + esc(S.unlock) + '</button></div>'
    + '<p class="hint" id="luckstatus"></p>'
    + '</div>';
}
function bindLuck(root, redraw) {
  const S = T(), go = $('#luckgo', root);
  if (!go) return;
  go.addEventListener('click', () => {
    const r = parseCode($('#luckcode', root).value), st = $('#luckstatus', root);
    if (!r) { st.textContent = S.badCode; st.className = 'hint err'; return; }
    ACCESS.grant(r.courses || [r.course], r.until); toast(S.unlocked); redraw();
  });
}

/* ---- the message tree ----
   A blossom tree you shake for one of sixty blessings. The messages are written
   for this app, not taken from a published oracle deck. */
const TREE_MSGS = [
  { vi: 'Điều bạn đang chờ vẫn đang trên đường tới với bạn, chỉ là nó đi chậm hơn mong đợi của bạn một chút. Bạn hãy giữ lòng mình mềm và đừng vội khép lại.', en: 'What you are waiting for is still making its way to you, only a little slower than you hoped. Keep your heart soft and do not close it just yet.' },
  { vi: 'Bạn không hề đi chậm. Con đường của bạn dài hơn con đường của nhiều người khác, và những gì bạn học được trên đó rồi sẽ có lúc dùng đến.', en: 'You are not moving slowly. Your road is longer than the roads many other people walk, and everything you gather along it will be needed one day.' },
  { vi: 'Một cánh cửa vừa khép lại trước mặt bạn, không phải để giữ bạn ở bên ngoài, mà để bạn kịp nhìn thấy cánh cửa khác đang mở ngay bên cạnh.', en: 'A door has just closed in front of you, not to keep you outside, but so that you would notice the other one standing open beside it.' },
  { vi: 'Hôm nay bạn được phép nghỉ ngơi mà không cần thấy có lỗi với ai. Nghỉ ngơi cũng là một phần của việc đi tới nơi bạn muốn đến.', en: 'Today you are allowed to rest without feeling that you owe anyone an explanation. Rest is part of how you arrive where you are going.' },
  { vi: 'Bạn được thương nhiều hơn bạn vẫn nghĩ. Có những người giữ bạn trong lòng theo cách rất lặng lẽ mà bạn chưa nhận ra.', en: 'You are loved more than you have realised. Some people hold you in their thoughts quietly, in ways you have not noticed yet.' },
  { vi: 'Điều bạn đang lo lắng sẽ không diễn ra theo cách bạn sợ. Khi nó đến thật, bạn sẽ thấy mình đủ bình tĩnh để đi qua.', en: 'What worries you will not unfold the way you fear. When it truly arrives, you will find yourself calm enough to walk through it.' },
  { vi: 'Bạn của hôm nay đã đi xa hơn bạn của một năm trước rất nhiều. Bạn chỉ quên nhìn lại quãng đường mình vừa vượt qua.', en: 'You have come a long way from the person you were a year ago. You have simply forgotten to look back at the distance you crossed.' },
  { vi: 'Vũ trụ đã nghe thấy điều bạn cầu mong. Có những lời cầu được trả lời chậm, bởi vì câu trả lời cần thời gian để lớn lên.', en: 'The universe has heard what you asked for. Some wishes are answered slowly, because the answer needs time to grow.' },
  { vi: 'Một điều tốt lành đang được chuẩn bị sẵn cho bạn, ở nơi bạn chưa nhìn tới, vào lúc bạn gần như đã thôi trông đợi.', en: 'Something good is being prepared for you, somewhere you are not looking, at a moment when you have nearly stopped expecting it.' },
  { vi: 'Bạn không cần giỏi mọi thứ mới xứng đáng được yêu thương. Người thương bạn thật lòng sẽ thương cả những phần bạn còn vụng về.', en: 'You do not have to be good at everything to deserve love. Whoever loves you truly will love the clumsy parts of you as well.' },
  { vi: 'Việc bạn đang làm có ý nghĩa, kể cả khi chưa có ai nói ra điều đó. Những việc tử tế thường được ghi nhận muộn hơn ta mong.', en: 'What you are doing matters, even if nobody has said so yet. Kind work tends to be recognised later than we would like.' },
  { vi: 'Tuần này bạn hãy tin vào cảm giác đầu tiên của mình. Nó thường biết trước điều mà lý trí của bạn còn đang tìm cách giải thích.', en: 'Trust your first instinct this week. It usually knows before your reasoning has finished explaining itself.' },
  { vi: 'Có một người đang nghĩ về bạn với lòng biết ơn, vì một điều bạn đã làm từ lâu và nay chính bạn cũng quên mất.', en: 'Someone is thinking of you with gratitude, for something you did long ago and have since forgotten yourself.' },
  { vi: 'Bạn không phải gánh chuyện này một mình. Chỉ cần bạn mở lời, sẽ có người sẵn lòng đứng cạnh bạn.', en: 'You do not have to carry this alone. The moment you say it out loud, someone will be willing to stand beside you.' },
  { vi: 'Điều bạn buông bỏ hôm nay sẽ để lại một khoảng trống, và khoảng trống ấy chính là chỗ dành sẵn cho điều sắp đến.', en: 'What you release today will leave an empty space, and that space is exactly where the next thing will sit.' },
  { vi: 'Sự chậm rãi của bạn lúc này không phải là lùi lại. Đó là cách bạn giữ gìn chính mình để còn đi được đường dài.', en: 'Your slowness right now is not a retreat. It is how you keep enough of yourself for the long road ahead.' },
  { vi: 'Có một cơ hội đang tới gần hơn bạn tưởng. Bạn hãy để ý những cuộc trò chuyện tưởng chừng rất bình thường.', en: 'An opportunity is closer than you think. Pay attention to the conversations that look entirely ordinary.' },
  { vi: 'Bạn đã làm đúng khi chọn giữ lại sự tử tế của mình, ngay cả ở nơi mà sự tử tế ấy chưa được đáp lại.', en: 'You were right to keep your kindness, even in a place where that kindness was not returned.' },
  { vi: 'Bạn hãy nói ra điều mình muốn. Lần này người nghe sẽ hiểu bạn, và câu chuyện sẽ nhẹ nhàng hơn bạn nghĩ.', en: 'Say what you want. This time the person listening will understand you, and it will go more gently than you expect.' },
  { vi: 'Nỗi buồn này có thời hạn của riêng nó. Nó sẽ không ở lại trong bạn lâu như bạn đang lo sợ.', en: 'This sadness has a limit of its own. It will not stay in you as long as you are afraid it will.' },
  { vi: 'Bạn đang ở gần câu trả lời hơn bạn nghĩ. Có khi bạn chỉ cần ngồi yên thêm một chút là nó tự hiện ra.', en: 'You are nearer the answer than you think. Sometimes it appears on its own if you sit still a little longer.' },
  { vi: 'Bạn hãy tự hào về những lần mình đứng dậy mà không ai nhìn thấy. Đó mới là phần khó nhất, và bạn đã làm được.', en: 'Be proud of the times you got back up with nobody watching. That was the hardest part, and you managed it.' },
  { vi: 'Một tin vui nhỏ sẽ đến trong những ngày tới. Nó không ồn ào, nhưng đủ để bạn thấy nhẹ lòng.', en: 'A small piece of good news is coming in the days ahead. It will arrive quietly, but it will be enough to lift you.' },
  { vi: 'Điều bạn từng nghĩ là mất mát, sau này nhìn lại, hoá ra là một lần bạn được giữ lại khỏi con đường không dành cho mình.', en: 'What once felt like a loss turns out, when you look back, to have been the moment you were kept from a road that was never yours.' },
  { vi: 'Bạn được phép bắt đầu lại, dù đây là lần thứ mấy. Không ai đếm số lần bắt đầu của bạn ngoài chính bạn.', en: 'You are allowed to begin again, however many times this is. Nobody is counting your beginnings except you.' },
  { vi: 'Sẽ có người ở lại bên bạn, không phải vì bạn hoàn hảo, mà vì họ thấy bình yên khi ở cạnh bạn.', en: 'Someone will stay beside you, not because you are perfect, but because they feel at peace when they are near you.' },
  { vi: 'Bạn không cần chứng minh giá trị của mình với bất kỳ ai. Những người hiểu bạn đã nhìn thấy điều đó từ lâu.', en: 'You do not need to prove your worth to anyone. The people who understand you saw it a long time ago.' },
  { vi: 'Tuần này bạn hãy chăm cho cơ thể mình. Nó đã cố gắng rất nhiều và vẫn lặng lẽ đi cùng bạn mỗi ngày.', en: 'Look after your body this week. It has been trying hard, and it goes on walking with you quietly every day.' },
  { vi: 'Một mối quan hệ cũ sẽ dịu lại theo cách bạn không ngờ tới, vào lúc cả hai đều đã bớt cần phải đúng.', en: 'An old relationship will soften in a way you do not expect, once neither of you needs to be right any more.' },
  { vi: 'Sự bình yên mà bạn tìm kiếm không nằm ở nơi nào xa xôi. Nó ở ngay trong những buổi tối rất bình thường của bạn.', en: 'The peace you are looking for is not somewhere far away. It lives inside your most ordinary evenings.' },
  { vi: 'Bạn được phép đổi ý. Người trưởng thành là người dám nhận rằng điều mình từng muốn nay đã khác đi.', en: 'You are allowed to change your mind. Growing up includes admitting that what you once wanted has changed.' },
  { vi: 'Điều tốt bạn từng làm cho người khác đang tìm đường quay về với bạn, có thể qua một người hoàn toàn xa lạ.', en: 'The good you once did for other people is finding its way back to you, perhaps through a complete stranger.' },
  { vi: 'Bạn đừng vội. Thứ thuộc về bạn sẽ không đi mất chỉ vì bạn đến chậm hơn người khác vài bước.', en: 'Do not rush. What belongs to you will not disappear simply because you arrived a few steps later than others.' },
  { vi: 'Bạn hãy nhìn lại quãng đường mình đã đi, chứ không chỉ nhìn phần còn lại phía trước. Bạn đã đi xa hơn bạn nhớ.', en: 'Look back at how far you have come, not only at what remains ahead. You have travelled further than you remember.' },
  { vi: 'Sẽ có người nói với bạn đúng câu mà bạn đang cần nghe, vào một lúc rất tình cờ.', en: 'Someone will say the exact words you need to hear, at a moment that will feel entirely by chance.' },
  { vi: 'Bạn có quyền giữ khoảng cách với những gì làm mình mệt. Đó không phải là ích kỷ, đó là biết thương lấy mình.', en: 'You have every right to keep your distance from what wears you out. That is not selfishness, it is care for yourself.' },
  { vi: 'Chuyện tiền bạc sẽ dễ thở hơn sau giai đoạn này. Bạn hãy giữ vững một thói quen nhỏ và để thời gian làm nốt phần còn lại.', en: 'Money will feel easier after this stretch. Keep one small habit steady and let time do the rest.' },
  { vi: 'Sự thay đổi mà bạn đang sợ hoá ra lại chính là điều bạn cần. Bạn sẽ thấy điều đó rõ hơn sau vài tháng nữa.', en: 'The change you are afraid of turns out to be the very one you needed. You will see that more clearly in a few months.' },
  { vi: 'Hôm nay bạn hãy làm một việc nhỏ chỉ vì nó khiến bạn vui, chứ không vì nó có ích cho ai.', en: 'Today, do one small thing only because it makes you happy, and not because it is useful to anyone.' },
  { vi: 'Bạn không hề muộn. Bạn đang đi đúng nhịp của riêng mình, và nhịp ấy không cần giống nhịp của ai cả.', en: 'You are not late at all. You are keeping your own time, and it does not need to match anyone else.' },
  { vi: 'Một người bạn cũ sẽ xuất hiện trở lại trong đời bạn, mang theo cảm giác thân quen mà bạn đã lâu không có.', en: 'An old friend will come back into your life, bringing a familiar warmth you have not felt for a long time.' },
  { vi: 'Điều bạn học được từ lần vấp ngã đó sẽ cứu bạn ở lần sau, đúng vào lúc bạn cần nó nhất.', en: 'What you learned from that fall will save you the next time, exactly when you need it most.' },
  { vi: 'Bạn hãy để người khác giúp mình. Họ thật lòng muốn giúp, và việc nhận cũng là một cách cho đi.', en: 'Let other people help you. They genuinely want to, and accepting help is its own way of giving.' },
  { vi: 'Có một điều đẹp đẽ đang lớn lên trong im lặng, ở nơi mà bây giờ bạn còn chưa nhìn thấy gì cả.', en: 'Something beautiful is growing quietly, in a place where you can still see nothing at all.' },
  { vi: 'Bạn đang được dẫn đi, kể cả trong những ngày bạn không nhìn thấy đường. Bạn chỉ cần bước thêm một bước nữa.', en: 'You are being led, even on the days when you cannot see the path. You only need to take one more step.' },
  { vi: 'Bạn hãy tha thứ cho chính mình trước đã. Bạn đã mang câu chuyện đó đủ lâu rồi.', en: 'Forgive yourself first. You have carried that story long enough.' },
  { vi: 'Câu trả lời sẽ đến khi bạn thôi hỏi liên tục. Bạn hãy để lòng mình yên một chút, rồi nó sẽ tự lên tiếng.', en: 'The answer will come when you stop asking constantly. Let yourself be quiet for a while, and it will speak.' },
  { vi: 'Một chuyện bạn tưởng đã khép lại vẫn còn thêm một chương nữa, và chương ấy dịu dàng hơn chương trước.', en: 'Something you thought was finished still has one more chapter, and that chapter is gentler than the one before.' },
  { vi: 'Bạn xứng đáng với một tình cảm không khiến bạn phải đoán. Sự rõ ràng cũng là một dạng của tử tế.', en: 'You deserve a love that does not leave you guessing. Clarity is a form of kindness.' },
  { vi: 'Sức khoẻ của bạn sẽ khá lên nếu tuần này bạn ngủ đủ giấc. Cơ thể bạn hồi phục nhanh hơn bạn tưởng.', en: 'Your health will improve if you sleep enough this week. Your body recovers faster than you think.' },
  { vi: 'Bạn hãy giữ lấy ước mơ đó thêm một thời gian nữa. Có những giấc mơ cần đợi đúng mùa mới nở được.', en: 'Hold on to that dream a while longer. Some dreams only open when the right season comes.' },
  { vi: 'Người thật lòng với bạn sẽ không để bạn chờ mãi. Một sự chờ đợi quá dài thường đã là một câu trả lời.', en: 'Someone who truly means it will not keep you waiting forever. Waiting far too long is usually an answer in itself.' },
  { vi: 'Bạn đã đủ rồi, ngay lúc này, đúng như bạn đang là, chứ không phải sau khi bạn sửa xong điều gì đó.', en: 'You are enough right now, exactly as you are, and not once you have finished fixing something.' },
  { vi: 'Một lời xin lỗi mà bạn đã chờ rất lâu có thể sẽ đến, và bạn sẽ thấy lòng mình nhẹ đi rất nhiều.', en: 'An apology you have waited a long time for may arrive, and you will feel a great deal lighter for it.' },
  { vi: 'Bạn hãy tin rằng mình có thể xây lại, bởi vì bạn đã từng xây được một lần rồi.', en: 'Trust that you are able to rebuild, because you have already built it once before.' },
  { vi: 'Công việc của bạn sắp có người nhìn thấy. Những gì bạn làm lặng lẽ bấy lâu rồi sẽ được gọi đúng tên.', en: 'Your work is about to be seen. What you have been doing quietly for so long will finally be named.' },
  { vi: 'Bạn đừng đóng lòng mình lại chỉ vì một người. Thế giới còn rất nhiều người dịu dàng đang trên đường tới.', en: 'Do not close your heart because of one person. The world still holds many gentle people who are on their way.' },
  { vi: 'Có một mùa nhẹ nhàng đang đợi bạn ở phía trước, ngay sau đoạn đường gập ghềnh mà bạn đang đi.', en: 'A gentler season is waiting for you up ahead, just beyond the rough stretch you are walking now.' },
  { vi: 'Điều bạn cầu mong không hề bị bỏ quên. Nó chỉ đang đợi đúng lúc để đến mà không làm bạn vỡ vụn.', en: 'What you asked for has not been forgotten. It is waiting for the moment when it can arrive without breaking you.' },
  { vi: 'Tối nay bạn hãy đi ngủ sớm. Ngày mai sẽ mang một màu khác, và bạn sẽ nhìn mọi chuyện rõ ràng hơn.', en: 'Go to bed early tonight. Tomorrow will carry a different colour, and you will see everything more clearly.' },
  { vi: 'Bạn đã đi qua những ngày khó hơn ngày hôm nay rất nhiều, và bạn vẫn ở đây. Điều đó nói lên rất nhiều về bạn.', en: 'You have walked through days far harder than this one, and you are still here. That says a great deal about you.' }
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
  [[62, 78], [104, 58], [158, 74], [206, 96], [86, 128], [178, 132], [126, 96], [232, 70]].forEach((f, i) => {
    flies += '<circle class="fly' + (still ? '' : ' lit') + '" cx="' + f[0] + '" cy="' + f[1] + '" r="3.4" fill="#FFE9A8" style="animation-delay:' + (i * 320) + 'ms"/>';
  });
  return treeShell(treeCanopy(puffs, TREE_BLOOMS.slice(0, 10), '#8E7FD6')
    + '<g fill="#FFF3C4" opacity=".9"><circle cx="30" cy="44" r="1.8"/><circle cx="250" cy="52" r="2"/><circle cx="210" cy="24" r="1.4"/><circle cx="60" cy="20" r="1.6"/></g>' + flies, '#2E2756');
}
function treeGalaxySVG(still) {
  const puffs = TREE_PUFFS.map((p, i) => [p[0], p[1], p[2], i % 3 === 0 ? '#4B3A8F' : (i % 3 === 1 ? '#6C4FB8' : '#8A5FD0'), .6]);
  let stars = '';
  for (let i = 0; i < 26; i++) {
    const x = 24 + (i * 37) % 232, y = 26 + (i * 53) % 120, r = 1 + (i % 3) * 0.7;
    stars += '<circle class="twinkle' + (still ? ' still' : '') + '" cx="' + x + '" cy="' + y + '" r="' + r + '" fill="#FFF3C4" style="animation-delay:' + (i * 170) + 'ms"/>';
  }
  const shine = (x, y, r) => '<path d="M' + x + ' ' + (y - r) + ' Q' + x + ' ' + y + ' ' + (x + r) + ' ' + y + ' Q' + x + ' ' + y + ' ' + x + ' ' + (y + r) + ' Q' + x + ' ' + y + ' ' + (x - r) + ' ' + y + ' Q' + x + ' ' + y + ' ' + x + ' ' + (y - r) + ' Z" fill="#FFF3C4"/>';
  return treeShell(treeCanopy(puffs, [], '#B79BF0') + stars + shine(140, 70, 15) + shine(96, 108, 9) + shine(196, 96, 8), '#3A2A72');
}
function treeButterflySVG(still) {
  const puffs = TREE_PUFFS.map((p, i) => [p[0], p[1], p[2], i % 2 ? '#CFE7C4' : '#B9DCAC', .6]);
  const wing = (x, y, c, i) => '<g class="flit' + (still ? ' still' : '') + '" style="animation-delay:' + (i * 430) + 'ms" transform="translate(' + x + ',' + y + ')">'
    + '<ellipse cx="-5" cy="0" rx="6" ry="8" fill="' + c + '" opacity=".95"/><ellipse cx="5" cy="0" rx="6" ry="8" fill="' + c + '" opacity=".95"/>'
    + '<ellipse cx="-4" cy="6" rx="4" ry="5" fill="' + c + '" opacity=".8"/><ellipse cx="4" cy="6" rx="4" ry="5" fill="' + c + '" opacity=".8"/>'
    + '<rect x="-1" y="-7" width="2" height="15" rx="1" fill="#6B4A32"/></g>';
  return treeShell(treeCanopy(puffs, TREE_BLOOMS.slice(0, 12), '#F4D06F')
    + wing(76, 74, '#F5A6C9', 0) + wing(196, 66, '#F7D488', 1) + wing(132, 44, '#A8CFF5', 2) + wing(226, 118, '#F5A6C9', 3) + wing(58, 122, '#F7D488', 4), '#FFF6DA');
}
function treeSVG() { return treeSVGFor(); }
/* The companions stand at the foot of the tree, so the two screens read as one
   garden. Tapping one opens its own page. */
function treePetHTML() {
  const pets = PETS.all();
  if (!pets.length) return '';
  /* Each one strolls at its own pace, so a row of them never marches in step. */
  return '<span class="treepets">' + pets.map((p, i) => '<a class="treepet" href="#/play/pet" style="animation-delay:' + (i * 1300) + 'ms" aria-label="' + esc(p.name || L(PET_NAMES[p.kind])) + '">'
    + petSVG(p.kind, PETS.coat(p), PETS.fedToday(p) ? 'happy' : '', PETS.wear(p)) + '</a>').join('') + '</span>';
}
function renderTree() {
  const S = T(), m = $('#main');
  let msg = null, busy = false;
  const draw = () => {
    m.innerHTML = '<div class="eyebrow">' + esc(S.actTitle) + '</div><h1 style="margin-bottom:6px">🌸 ' + esc(S.treeTitle) + '</h1><p class="muted">' + esc(S.treeIntro) + '</p>'
      + '<div class="card treewrap"><div class="treestage"><button type="button" class="tree" id="tree" aria-label="' + esc(S.treeShake) + '">' + treeSVG() + '<span class="petals" id="petals"></span></button>' + treePetHTML() + '</div>'
      + '<div class="treemsg" id="treemsg"' + (msg ? '' : ' hidden') + '><div class="eyebrow">' + esc(S.treeFor) + '</div><p id="treetext">' + (msg ? esc(L(msg)) : '') + '</p></div>'
      + (luckSpent('tree') ? '' : '<button class="btn primary block" id="shake">' + esc(msg ? S.treeAgain : S.treeShake) + '</button>') + '</div>'
      + luckPanelHTML('tree')
      + lookStripHTML('tree')
      + '<p style="margin-top:14px"><a class="btn block" href="#/unlock">💳 ' + esc(S.unlockLink) + '</a></p>'
      + '<p style="margin-top:14px"><a href="#/play" class="backlink">← ' + esc(S.actTitle) + '</a></p>';
    bindLookStrip(m, draw);
    const shake = () => {
      if (busy) return;
      busy = true;
      const tree = $('#tree'), pet = $('#petals'), btn = $('#shake'), box = $('#treemsg');
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
      setTimeout(() => {
        msg = TREE_MSGS[k];
        $('#treetext').textContent = L(msg); box.hidden = false;
        tree.classList.remove('sway'); pet.innerHTML = '';
        busy = false;
        if (luckSpent('tree')) { draw(); $('#treemsg').hidden = false; $('#treetext').textContent = L(msg); return; }
        btn.disabled = false; btn.textContent = S.treeAgain;
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
  // The word itself sits on the middle of the coin. The crescent above it is
  // balanced by three dots the same distance below, so the face stays even
  // without pushing the word off centre.
  const cap = size * 0.72;
  const wordY = 80 + cap / 2;
  const band = (y) => '<path d="M80 ' + (y - 5) + ' l4.5 5 -4.5 5 -4.5 -5 Z"/>'
    + '<rect x="56" y="' + (y - 0.9) + '" width="16" height="1.8" rx=".9"/>'
    + '<rect x="88" y="' + (y - 0.9) + '" width="16" height="1.8" rx=".9"/>';
  const ornament = '<g fill="' + mtl.ink + '" opacity=".6">' + band(44) + band(116) + '</g>';
  const word = side ? (side === 'yes' ? S.coinYes : S.coinNo) : '';
  return '<svg viewBox="0 0 160 160" aria-hidden="true">'
    + '<circle cx="80" cy="80" r="74" fill="' + mtl.face + '" stroke="' + mtl.rim + '" stroke-width="5"/>'
    + '<circle cx="80" cy="80" r="60" fill="none" stroke="' + mtl.rim + '" stroke-width="2"/>'
    + (side
      ? ornament + '<text x="80" y="' + wordY.toFixed(1) + '" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="' + size + '" letter-spacing="1" fill="' + mtl.ink + '">' + esc(word) + '</text>'
      : '<text x="80" y="102" text-anchor="middle" font-family="Georgia,serif" font-size="62" fill="' + mtl.rim + '">?</text>')
    + '</svg>';
}
function renderCoin() {
  const S = T(), m = $('#main');
  let side = '';
  const draw = () => {
    m.innerHTML = '<div class="eyebrow">' + esc(S.actTitle) + '</div><h1 style="margin-bottom:6px">🪙 ' + esc(S.coinTitle) + '</h1><p class="muted">' + esc(S.coinIntro) + '</p>'
      + '<div class="card coinwrap"><label class="f" for="coinq">' + esc(S.coinQ) + '</label><input id="coinq" placeholder="' + esc(S.coinQPh) + '" value="' + esc(store.get('nabu-coinq', '') || '') + '">'
      + '<div class="coin" id="coin">' + coinFaceSVG(side) + '</div>'
      + '<div class="coinres" id="coinres" aria-live="polite">' + (side ? esc(side === 'yes' ? S.coinYes : S.coinNo) : '') + '</div>'
      + (luckSpent('coin') ? '' : '<button class="btn primary block" id="coinflip">' + esc(side ? S.coinAgain : S.coinFlip) + '</button>') + '</div>'
      + luckPanelHTML('coin')
      + lookStripHTML('coin')
      + '<p class="hint">' + esc(S.coinNote) + '</p>'
      + '<p style="margin-top:14px"><a class="btn block" href="#/unlock">💳 ' + esc(S.unlockLink) + '</a></p>'
      + '<p style="margin-top:14px"><a href="#/play" class="backlink">← ' + esc(S.actTitle) + '</a></p>';
    bindLookStrip(m, draw);
    const q = $('#coinq'); q.addEventListener('input', () => store.set('nabu-coinq', q.value));
    bindLuck(m, draw);
    const fb = $('#coinflip'); if (!fb) return;
    fb.addEventListener('click', () => {
      const el = $('#coin'), btn = $('#coinflip');
      if (el.classList.contains('spin')) return;
      luckSpend('coin');
      btn.disabled = true; $('#coinres').textContent = '';
      el.classList.add('spin');
      let bits = 0;
      try { const a = new Uint8Array(1); crypto.getRandomValues(a); bits = a[0] & 1; }
      catch (e) { bits = Math.random() < 0.5 ? 0 : 1; }
      setTimeout(() => {
        side = bits ? 'yes' : 'no'; el.classList.remove('spin'); el.innerHTML = coinFaceSVG(side);
        $('#coinres').textContent = side === 'yes' ? S.coinYes : S.coinNo;
        if (luckSpent('coin')) { draw(); return; }
        btn.disabled = false; btn.textContent = S.coinAgain;
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
  const all = () => store.get('nabu-diary', {}) || {};
  const draw = () => {
    const d = all(), cur = d[today] || { m: '', t: '' }, days = Object.keys(d).filter((k) => k !== today).sort().reverse();
    m.innerHTML = '<div class="eyebrow">' + esc(S.actTitle) + '</div><h1 style="margin-bottom:6px">📔 ' + esc(S.diaryTitle) + '</h1><p class="muted">' + esc(S.diaryIntro) + '</p>'
      + '<div class="card diary ' + diaryPaperClass() + '"><div class="date"><span>' + esc(S.diaryToday) + ' · ' + esc(fmtDate(today)) + '</span><span class="faint" id="dsaved">' + (cur.t || cur.m ? esc(S.diarySaved) : '') + '</span></div>'
      + '<p class="hint" style="margin:8px 0 6px">' + esc(S.diaryMood) + '</p><div class="moods">' + MOODS.map((x) => '<button type="button" class="mood' + (cur.m === x ? ' on' : '') + '" data-mood="' + x + '">' + x + '</button>').join('') + '</div>'
      + '<textarea id="dtext" placeholder="' + esc(S.diaryPh) + '">' + esc(cur.t || '') + '</textarea></div>'
      + '<h3 style="margin:16px 0 8px">' + esc(S.diaryPast) + (days.length ? ' <span class="faint">· ' + esc(S.diaryCount(days.length + (cur.t || cur.m ? 1 : 0))) + '</span>' : '') + '</h3>'
      + (days.length ? days.map((k) => '<div class="card diary past" data-day="' + k + '"><div class="date"><span>' + (d[k].m ? d[k].m + ' ' : '') + esc(fmtDate(k)) + '</span><button type="button" class="linkbtn" data-ddel="' + k + '">' + esc(S.diaryDel) + '</button></div><p>' + esc(d[k].t || '').replace(/\n/g, '<br>') + '</p></div>').join('') : '<p class="hint">' + esc(S.diaryEmpty) + '</p>')
      + lookStripHTML('diary')
      + '<p style="margin-top:12px"><a href="#/play" class="backlink">← ' + esc(S.actBack) + '</a></p>';
    bindLookStrip(m, draw);
    const save = () => { const d2 = all(); const t = $('#dtext').value, mo = ($('.mood.on', m) || {}).getAttribute ? $('.mood.on', m).getAttribute('data-mood') : ''; if (t.trim() || mo) d2[today] = { m: mo || '', t: t }; else delete d2[today]; store.set('nabu-diary', d2); $('#dsaved').textContent = t.trim() || mo ? S.diarySaved : ''; };
    $('#dtext').addEventListener('input', save);
    $$('[data-mood]', m).forEach((b) => b.addEventListener('click', () => { const on = b.classList.contains('on'); $$('[data-mood]', m).forEach((x) => x.classList.remove('on')); if (!on) b.classList.add('on'); save(); }));
    $$('[data-ddel]', m).forEach((b) => b.addEventListener('click', () => { if (!confirm(S.confirmDel)) return; const d2 = all(); delete d2[b.getAttribute('data-ddel')]; store.set('nabu-diary', d2); draw(); }));
  };
  draw();
}
/* The newest open activity, shown on the home screen. */
async function homeActHTML(root) {
  const list = (await loadActs()).slice().sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const a = list.filter(actOpen)[0] || list[0];
  if (!a || !root) return;
  const S = T();
  root.innerHTML = '<div class="sec"><div class="eyebrow">🎲 ' + esc(S.actTitle) + '</div><article class="post act act-' + esc(a.type) + '">' + actDateLine(a) + '<h2 class="tclamp">' + titleHTML(L(a.title)) + '</h2>' + (a.intro ? '<div class="body clamp">' + richHTML(L(a.intro)) + '</div>' : '') + '<div class="foot"><a class="btn sm primary" href="#/play/' + esc(a.id) + '">' + esc(S.actJoin) + ' →</a><a class="btn sm" href="#/play">' + esc(S.actAll) + '</a></div></article></div>';
  hydrateImages(root);
}
ROUTES.play = { nav: 'play', render: renderPlay };

/* ---- dashboard: create and answer activities ---- */
function adminActivities(p) {
  const S = T();
  let items = [], editing = null;
  const form = (a) => {
    a = a || { type: 'pile', date: isoDate(new Date()), title: { vi: '', en: '' }, intro: { vi: '', en: '' }, piles: [{ label: '', msg: { vi: '', en: '' } }, { label: '', msg: { vi: '', en: '' } }, { label: '', msg: { vi: '', en: '' } }], options: [], results: false, closed: false, resultsDate: '' };
    const pileRows = (a.piles || []).map((pl, i) => '<div class="card" style="padding:12px"><b>' + esc(S.actPileN(i + 1)) + '</b><input data-pl="' + i + '" placeholder="' + esc(S.actPileLabel) + '" value="' + esc(pl.label || '') + '" style="margin:6px 0"><label class="f" style="margin-top:6px">' + esc(S.actPileArt) + '</label><select data-part="' + i + '"><option value="">' + esc(S.actArtAuto) + '</option>' + S.actArts.map((n, k) => '<option value="' + k + '"' + (pl.art === k ? ' selected' : '') + '>' + esc(n) + '</option>').join('') + '</select><textarea data-pmsg="' + i + '" placeholder="' + esc(S.actPileMsg) + '">' + esc(L2(pl.msg, 'vi')) + '</textarea><textarea data-pmsgen="' + i + '" placeholder="' + esc(S.actPileMsgEn) + '" style="min-height:60px;margin-top:6px">' + esc(L2(pl.msg, 'en')) + '</textarea></div>').join('');
    return '<div class="card"><h3 id="ahead" style="margin-bottom:6px">' + esc(editing ? S.edit : S.actNew) + '</h3>'
      + '<label class="f">' + esc(S.actType) + '</label><div class="chips">' + ['pile', 'poll', 'wish'].map((t) => '<button type="button" class="chip' + (a.type === t ? ' on' : '') + '" data-atype="' + t + '">' + esc(S.actTypes[t]) + '</button>').join('') + '</div>'
      + '<div class="two"><div><label class="f" for="adate">' + esc(S.postDate) + '</label><input id="adate" type="date" value="' + esc(a.date) + '"></div><div><label class="f" for="ardate">' + esc(S.actResultsDate) + '</label><input id="ardate" type="date" value="' + esc(a.resultsDate || '') + '"></div></div>'
      + '<label class="f" for="atitle">' + esc(S.postTitle) + '</label><input id="atitle" value="' + esc(L2(a.title, 'vi')) + '"><label class="f" for="atitle_en">' + esc(S.postTitleEn) + '</label><input id="atitle_en" value="' + esc(L2(a.title, 'en')) + '">'
      + '<label class="f" for="aintro">' + esc(S.actIntroLabel) + '</label><textarea id="aintro">' + esc(L2(a.intro, 'vi')) + '</textarea>'
      + '<div id="apiles"' + (a.type === 'pile' ? '' : ' hidden') + '><p class="hint" style="margin:12px 0 8px">' + esc(S.actPilesHint) + '</p>' + pileRows + '<div class="row nw"><button type="button" class="btn sm" id="apadd">+ ' + esc(S.actPileAdd) + '</button><button type="button" class="btn sm" id="apdel">− ' + esc(S.actPileDel) + '</button></div>'
      + '<label class="f" style="display:flex;gap:8px;align-items:center;margin-top:14px"><input type="checkbox" id="aresults" style="width:auto"' + (actAnswered(a) ? ' checked' : '') + '>' + esc(S.actResultsOn) + '</label></div>'
      + '<div id="apoll"' + (a.type === 'poll' ? '' : ' hidden') + '><label class="f" for="aopts">' + esc(S.actOptions) + '</label><textarea id="aopts">' + esc((a.options || []).map((o) => L2(o, 'vi')).join('\n')) + '</textarea><label class="f" style="display:flex;gap:8px;align-items:center;margin-top:10px"><input type="checkbox" id="aclosed" style="width:auto"' + (a.closed ? ' checked' : '') + '>' + esc(S.actCloseOn) + '</label></div>'
      + '<div class="btns" style="margin-top:16px"><button class="btn primary" id="apub">' + esc(S.publish) + '</button><button class="btn" id="anew">' + esc(S.actNew) + '</button></div><p id="astatus" class="hint"></p></div>'
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
        title: { vi: $('#atitle').value.trim(), en: $('#atitle_en').value.trim() }, intro: { vi: $('#aintro').value.trim(), en: (cur && cur.intro && cur.intro.en) || '' }, results: !!$('#aresults').checked, closed: !!$('#aclosed').checked };
      if (type === 'pile') a.piles = $$('[data-pl]', p).map((inp, i) => { const art = $('[data-part="' + i + '"]', p).value; const o = { label: inp.value.trim(), msg: { vi: $('[data-pmsg="' + i + '"]', p).value.trim(), en: $('[data-pmsgen="' + i + '"]', p).value.trim() } }; if (art !== '') o.art = Number(art); return o; });
      if (type === 'poll') a.options = $('#aopts').value.split('\n').map((x) => x.trim()).filter(Boolean).map((x) => { const old = ((cur && cur.options) || []).filter((o) => L2(o, 'vi') === x)[0]; return old && old.en ? { vi: x, en: old.en } : { vi: x }; });
      if (!a.title.en) delete a.title.en;
      return a;
    };
    $$('[data-atype]', p).forEach((b) => b.addEventListener('click', () => { cur = read(); cur.type = b.getAttribute('data-atype'); if (cur.type === 'pile' && !(cur.piles || []).length) cur.piles = [{ label: '', msg: {} }, { label: '', msg: {} }, { label: '', msg: {} }]; draw(); }));
    $('#apadd').addEventListener('click', () => { cur = read(); if ((cur.piles || []).length < 5) cur.piles.push({ label: '', msg: {} }); draw(); });
    $('#apdel').addEventListener('click', () => { cur = read(); if ((cur.piles || []).length > 2) cur.piles.pop(); draw(); });
    $('#anew').addEventListener('click', () => { cur = null; editing = null; draw(); });
    $$('[data-aedit]', p).forEach((b) => b.addEventListener('click', () => { cur = JSON.parse(JSON.stringify(items.filter((x) => x.id === b.getAttribute('data-aedit'))[0])); editing = cur.id; draw(); $('#ahead').scrollIntoView({ behavior: 'smooth' }); }));
    $$('[data-adel]', p).forEach((b) => b.addEventListener('click', async () => { if (!confirm(S.confirmDel)) return; const id = b.getAttribute('data-adel'); items = items.filter((x) => x.id !== id); if (ACTS.stock && ACTS.stock[id]) ACTS.hidden = (ACTS.hidden || []).concat(id); try { await BE.setContent('activities', actsDoc(items)); ACTS.items = items; toast('✓'); draw(); } catch (e) { status(S.publishFail + ': ' + e.message, 'err'); } }));
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
