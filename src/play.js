/* ============================ activities (#/play) ============================
   Small things to take part in: "pick a pile" readings that Nabu posts a few
   days ahead and answers later (the chosen pile flips over to show its
   message), weekly polls, and a wish jar. Nabu creates them in the dashboard
   (content/activities, public read, admin write); votes and pile choices of
   signed-in people go to votes/{activityId_uid} so results can be counted;
   guests keep their choice on the device. */
const ACTS = { items: null, loaded: false, votes: {} };
async function loadActs() {
  if (ACTS.loaded && ACTS.items) return ACTS.items;
  const r = await loadContent('activities', 'activities.json', 'nabu-acts');
  ACTS.items = (r.data && r.data.items) || []; ACTS.loaded = true;
  return ACTS.items;
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
const actOpen = (a) => !a.closed && !a.results;
function actDateLine(a) { const S = T(); return '<div class="date"><span>' + fmtDate(a.date) + '</span>' + (a.results ? '<span class="pin">✓ ' + esc(S.actHasResults) + '</span>' : a.closed ? '<span class="pin">' + esc(S.actClosed) + '</span>' : '<span class="pin">' + esc(S.actOpen) + '</span>') + '</div>'; }

/* ---- one activity card ---- */
function actHTML(a, compact) {
  const S = T(), mine = myChoices()[a.id];
  let body = '';
  if (a.type === 'pile') {
    const piles = a.piles || [];
    body = '<div class="piles' + (piles.length === 2 ? ' n2' : '') + '">' + piles.map((p, i) => { const chosen = String(mine) === String(i), open = chosen && a.results; return '<div class="pile' + (chosen ? ' chosen' : '') + (open ? ' open' : '') + '" data-pile="' + i + '"><div class="pile-inner"><div class="pf">' + BACK + '<b>' + (i + 1) + '</b><span>' + esc(p.label || '') + '</span></div><div class="pb"><div class="pbs">' + richHTML(L(p.msg)) + '</div></div></div></div>'; }).join('') + '</div>'
      + (a.results ? (mine == null ? '<p class="hint">' + esc(S.actPickToSee) + '</p>' : '<p class="hint">' + esc(S.actTapOthers) + '</p>') : (mine == null ? '<p class="hint">' + esc(S.actPickHint) + '</p>' : '<p class="hint ok">' + esc(S.actPicked(Number(mine) + 1)) + ' ' + esc(S.actComeBack(fmtDate(a.resultsDate || a.date))) + '</p>'));
  } else if (a.type === 'poll') {
    const opts = a.options || [], voted = mine != null, show = voted || a.closed;
    body = '<div class="pollopts" data-poll="' + a.id + '">' + opts.map((o, i) => '<button type="button" class="pollopt' + (String(mine) === String(i) ? ' on' : '') + '" data-opt="' + i + '"' + (show ? ' disabled' : '') + '><span class="bar"></span><span class="lbl">' + esc(L(o)) + '</span><span class="pct"></span></button>').join('') + '</div>'
      + '<p class="hint pollnote">' + esc(voted ? S.actVoted : a.closed ? S.actClosedNote : (BE.enabled && BE.user ? S.actVoteHint : S.actVoteLogin)) + '</p>';
  } else if (a.type === 'wish') {
    const wishes = (store.get('nabu-wishes', []) || []).filter((w) => w.aid === a.id);
    body = '<div class="wishjar" data-wish="' + a.id + '"><div class="jar"><span class="star s1">✦</span><span class="star s2">✧</span><span class="star s3">✦</span><div class="note" hidden></div>🫙</div>'
      + '<textarea class="wishtext" placeholder="' + esc(S.actWishPh) + '"></textarea><button type="button" class="btn primary block" data-wishsend>🌠 ' + esc(S.actWishSend) + '</button>'
      + '<p class="hint wishcount">' + esc(wishes.length ? S.actWishCount(wishes.length) : S.actWishHint) + '</p>' + (wishes.length ? '<button type="button" class="linkbtn" data-wishclear>' + esc(S.actWishClear) + '</button>' : '') + '</div>';
  }
  return '<article class="post act act-' + esc(a.type) + '" data-act="' + esc(a.id) + '">' + actDateLine(a) + '<h2>' + esc(L(a.title)) + '</h2>' + (a.intro ? '<div class="body">' + richHTML(L(a.intro)) + '</div>' : '') + body
    + (compact ? '<div class="foot"><a class="btn sm" href="#/play">' + esc(S.actAll) + ' →</a></div>' : '') + '</article>';
}
function bindActs(root, list) {
  const S = T();
  $$('.act', root).forEach((card) => {
    const a = list.filter((x) => x.id === card.getAttribute('data-act'))[0]; if (!a) return;
    if (a.type === 'pile') {
      $$('[data-pile]', card).forEach((el) => el.addEventListener('click', async () => {
        const i = Number(el.getAttribute('data-pile')), mine = myChoices()[a.id];
        if (a.results) {  // after the answer: the chosen pile is open; any pile can be peeked at
          if (mine == null) { setChoice(a.id, i); sendVote(a, i); }
          el.classList.toggle('open'); if (el.classList.contains('open')) { hydrateImages(el); el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
          return;
        }
        if (mine != null && String(mine) !== String(i) && !confirm(S.actChangePile)) return;
        setChoice(a.id, i); await sendVote(a, i);
        $$('[data-pile]', card).forEach((x) => x.classList.toggle('chosen', x === el));
        const h = $('.hint', card); if (h) { h.className = 'hint ok'; h.textContent = S.actPicked(i + 1) + ' ' + S.actComeBack(fmtDate(a.resultsDate || a.date)); }
        toast('✓');
      }));
    } else if (a.type === 'poll') {
      const draw = (counts) => { const total = counts && counts.total || 0; $$('[data-opt]', card).forEach((b) => { const n = counts ? (counts[b.getAttribute('data-opt')] || 0) : 0, pct = total ? Math.round(n * 100 / total) : 0; $('.bar', b).style.width = pct + '%'; $('.pct', b).textContent = total ? pct + '%' : ''; }); const note = $('.pollnote', card); if (note && total) note.textContent += ' · ' + S.actVotes(total); };
      if (myChoices()[a.id] != null || a.closed) countVotes(a.id).then(draw);
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
        ta.value = ''; sendVote(a, 'wish');
        const mine = list.filter((w) => w.aid === a.id).length; $('.wishcount', card).textContent = S.actWishCount(mine); toast(S.actWishSent);
        setTimeout(() => { note.hidden = true; }, 2600);
      });
      const cl = $('[data-wishclear]', card); if (cl) cl.addEventListener('click', () => { if (!confirm(S.actWishClearConfirm)) return; store.set('nabu-wishes', (store.get('nabu-wishes', []) || []).filter((w) => w.aid !== a.id)); $('.wishcount', card).textContent = S.actWishHint; cl.remove(); });
    }
  });
  hydrateImages(root);
}
async function renderPlay() {
  const S = T(), m = $('#main');
  m.innerHTML = '<div class="eyebrow">' + esc(CONFIG.brand) + '</div><h1 style="margin-bottom:6px">' + esc(S.actTitle) + '</h1><p class="muted">' + esc(S.actIntro) + '</p><div id="acts"><p class="hint">…</p></div>';
  const list = (await loadActs()).slice().sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const box = $('#acts'); if (!box) return;
  box.innerHTML = list.length ? list.map((a) => actHTML(a, false)).join('') : '<p class="empty">' + esc(S.actEmpty) + '</p>';
  bindActs(box, list);
}
/* The newest open activity, shown on the home screen. */
async function homeActHTML(root) {
  const list = (await loadActs()).slice().sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const a = list.filter(actOpen)[0] || list[0];
  if (!a || !root) return;
  root.innerHTML = '<div class="sec"><div class="eyebrow">🎲 ' + esc(T().actTitle) + '</div>' + actHTML(a, true) + '</div>';
  bindActs(root, list);
}
ROUTES.play = { nav: 'home', render: renderPlay };

/* ---- dashboard: create and answer activities ---- */
function adminActivities(p) {
  const S = T();
  let items = [], editing = null;
  const form = (a) => {
    a = a || { type: 'pile', date: isoDate(new Date()), title: { vi: '', en: '' }, intro: { vi: '', en: '' }, piles: [{ label: '', msg: { vi: '', en: '' } }, { label: '', msg: { vi: '', en: '' } }, { label: '', msg: { vi: '', en: '' } }], options: [], results: false, closed: false, resultsDate: '' };
    const pileRows = (a.piles || []).map((pl, i) => '<div class="card" style="padding:12px"><b>' + esc(S.actPileN(i + 1)) + '</b><input data-pl="' + i + '" placeholder="' + esc(S.actPileLabel) + '" value="' + esc(pl.label || '') + '" style="margin:6px 0"><textarea data-pmsg="' + i + '" placeholder="' + esc(S.actPileMsg) + '">' + esc(L2(pl.msg, 'vi')) + '</textarea><textarea data-pmsgen="' + i + '" placeholder="' + esc(S.actPileMsgEn) + '" style="min-height:60px;margin-top:6px">' + esc(L2(pl.msg, 'en')) + '</textarea></div>').join('');
    return '<div class="card"><h3 id="ahead" style="margin-bottom:6px">' + esc(editing ? S.edit : S.actNew) + '</h3>'
      + '<label class="f">' + esc(S.actType) + '</label><div class="chips">' + ['pile', 'poll', 'wish'].map((t) => '<button type="button" class="chip' + (a.type === t ? ' on' : '') + '" data-atype="' + t + '">' + esc(S.actTypes[t]) + '</button>').join('') + '</div>'
      + '<div class="two"><div><label class="f" for="adate">' + esc(S.postDate) + '</label><input id="adate" type="date" value="' + esc(a.date) + '"></div><div><label class="f" for="ardate">' + esc(S.actResultsDate) + '</label><input id="ardate" type="date" value="' + esc(a.resultsDate || '') + '"></div></div>'
      + '<label class="f" for="atitle">' + esc(S.postTitle) + '</label><input id="atitle" value="' + esc(L2(a.title, 'vi')) + '"><label class="f" for="atitle_en">' + esc(S.postTitleEn) + '</label><input id="atitle_en" value="' + esc(L2(a.title, 'en')) + '">'
      + '<label class="f" for="aintro">' + esc(S.actIntroLabel) + '</label><textarea id="aintro">' + esc(L2(a.intro, 'vi')) + '</textarea>'
      + '<div id="apiles"' + (a.type === 'pile' ? '' : ' hidden') + '><p class="hint" style="margin:12px 0 8px">' + esc(S.actPilesHint) + '</p>' + pileRows + '<div class="row nw"><button type="button" class="btn sm" id="apadd">+ ' + esc(S.actPileAdd) + '</button><button type="button" class="btn sm" id="apdel">− ' + esc(S.actPileDel) + '</button></div>'
      + '<label class="f" style="display:flex;gap:8px;align-items:center;margin-top:14px"><input type="checkbox" id="aresults" style="width:auto"' + (a.results ? ' checked' : '') + '>' + esc(S.actResultsOn) + '</label></div>'
      + '<div id="apoll"' + (a.type === 'poll' ? '' : ' hidden') + '><label class="f" for="aopts">' + esc(S.actOptions) + '</label><textarea id="aopts">' + esc((a.options || []).map((o) => L2(o, 'vi')).join('\n')) + '</textarea><label class="f" style="display:flex;gap:8px;align-items:center;margin-top:10px"><input type="checkbox" id="aclosed" style="width:auto"' + (a.closed ? ' checked' : '') + '>' + esc(S.actCloseOn) + '</label></div>'
      + '<div class="btns" style="margin-top:16px"><button class="btn primary" id="apub">' + esc(S.publish) + '</button><button class="btn" id="anew">' + esc(S.actNew) + '</button></div><p id="astatus" class="hint"></p></div>'
      + '<div class="card"><h3 style="margin-bottom:6px">' + esc(S.actExisting) + '</h3><div class="plist" id="alist">' + (items.length ? items.map((x) => '<div class="it"><div class="tt"><div>' + esc(S.actTypes[x.type] || x.type) + ' · ' + esc(L2(x.title, 'vi') || L2(x.title, 'en')) + '</div><div class="d">' + esc(x.date) + (x.results ? ' · ✓' : '') + '</div></div><button class="btn sm" data-aedit="' + esc(x.id) + '">' + esc(S.edit) + '</button><button class="btn sm" data-adel="' + esc(x.id) + '">' + esc(S.del) + '</button></div>').join('') : '<p class="hint">' + esc(S.actEmpty) + '</p>') + '</div></div>';
  };
  let cur = null;
  const draw = () => {
    p.innerHTML = form(cur);
    const status = (t, cls) => { const s = $('#astatus'); s.textContent = t; s.className = 'hint ' + (cls || ''); };
    const read = () => {
      const type = $('.chip.on[data-atype]') ? $('.chip.on[data-atype]').getAttribute('data-atype') : 'pile';
      const a = { id: (cur && cur.id) || ($('#adate').value || isoDate(new Date())) + '-' + Math.random().toString(36).slice(2, 6), type: type, date: $('#adate').value || isoDate(new Date()), resultsDate: $('#ardate').value || '',
        title: { vi: $('#atitle').value.trim(), en: $('#atitle_en').value.trim() }, intro: { vi: $('#aintro').value.trim() }, results: !!$('#aresults').checked, closed: !!$('#aclosed').checked };
      if (type === 'pile') a.piles = $$('[data-pl]', p).map((inp, i) => ({ label: inp.value.trim(), msg: { vi: $('[data-pmsg="' + i + '"]', p).value.trim(), en: $('[data-pmsgen="' + i + '"]', p).value.trim() } }));
      if (type === 'poll') a.options = $('#aopts').value.split('\n').map((x) => x.trim()).filter(Boolean).map((x) => ({ vi: x }));
      if (!a.title.en) delete a.title.en;
      return a;
    };
    $$('[data-atype]', p).forEach((b) => b.addEventListener('click', () => { cur = read(); cur.type = b.getAttribute('data-atype'); if (cur.type === 'pile' && !(cur.piles || []).length) cur.piles = [{ label: '', msg: {} }, { label: '', msg: {} }, { label: '', msg: {} }]; draw(); }));
    $('#apadd').addEventListener('click', () => { cur = read(); if ((cur.piles || []).length < 5) cur.piles.push({ label: '', msg: {} }); draw(); });
    $('#apdel').addEventListener('click', () => { cur = read(); if ((cur.piles || []).length > 2) cur.piles.pop(); draw(); });
    $('#anew').addEventListener('click', () => { cur = null; editing = null; draw(); });
    $$('[data-aedit]', p).forEach((b) => b.addEventListener('click', () => { cur = JSON.parse(JSON.stringify(items.filter((x) => x.id === b.getAttribute('data-aedit'))[0])); editing = cur.id; draw(); $('#ahead').scrollIntoView({ behavior: 'smooth' }); }));
    $$('[data-adel]', p).forEach((b) => b.addEventListener('click', async () => { if (!confirm(S.confirmDel)) return; items = items.filter((x) => x.id !== b.getAttribute('data-adel')); try { await BE.setContent('activities', { items: items }); ACTS.items = items; toast('✓'); draw(); } catch (e) { status(S.publishFail + ': ' + e.message, 'err'); } }));
    $('#apub').addEventListener('click', async () => {
      const a = read();
      if (!a.title.vi) { status(S.needBody, 'err'); return; }
      if (a.type === 'pile' && !(a.piles || []).some((x) => x.msg.vi || x.label)) { status(S.actNeedPiles, 'err'); return; }
      if (a.type === 'poll' && (a.options || []).length < 2) { status(S.actNeedOptions, 'err'); return; }
      if (!cloud()) { status(S.adminLogin, 'err'); return; }
      items = [a].concat(items.filter((x) => x.id !== a.id));
      try { await BE.setContent('activities', { items: items }); ACTS.items = items; ACTS.loaded = true; status(S.published, 'ok'); cur = null; editing = null; draw(); }
      catch (e) { status(S.publishFail + ': ' + e.message, 'err'); }
    });
  };
  p.innerHTML = '<p class="hint">…</p>';
  loadActs().then((list) => { items = list.slice(); draw(); });
}
