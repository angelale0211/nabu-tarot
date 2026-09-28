/* ============================ practice ============================
   Tập đọc bài: the learner reads, the app marks.

   Every other screen in this app deals a card and tells the visitor what it
   means. This one turns that around. The cards are dealt face up against a
   scenario, and the learner writes the reading themselves; the app then marks
   what they wrote. That inversion is the whole point of the screen, so nothing
   here ever volunteers an interpretation before the learner has committed to
   one - the model reading stays hidden until the answer is in.

   The marking is local, deterministic and offline. It needs no key, no
   network and no one on the other end, which is what makes it honest to call
   it automatic: the same answer always earns the same mark, and a learner who
   disagrees can go and look up the card and see for themselves.

   Almost none of the marking text is new. The keywords come from INSIGHT, the
   position teaching from SPREADS, and both are Nabu's own words, already
   written and already read by learners elsewhere in the app. What is new per
   exercise is only the scenario, the question and one short model paragraph. */

/* ---- the exercises ----
   `cards` are dealt in order; `rev` marks the ones that land reversed, which
   is what makes the keyword pool flip from pos to neg. `frames` says what each
   position is FOR, because a sentence that describes when it should advise is
   a wrong reading even when every keyword is right - and SPREADS says that in
   prose to a human but not in a way a marker can read. `traps` names the
   mistakes this particular exercise is built to catch. */
/* PRACTICE itself is declared beside its data file, which build.py splits out
   of the page; this file only reads it. */


/* The exercises arrive with the screen, not with the app. Nothing else in the
   app reads them, so a visitor who never opens this screen never pays for it.
   A failure is not remembered: somebody whose signal comes back gets another
   try the next time they open it. */
let PRACTICE_WANT = null;
function practiceReady() {
  if (PRACTICE_WANT) return PRACTICE_WANT;
  if (PRACTICE.length) return (PRACTICE_WANT = Promise.resolve(true));
  if (typeof PRACTICE_URL !== 'string' || !PRACTICE_URL) return (PRACTICE_WANT = Promise.resolve(false));
  PRACTICE_WANT = new Promise((done) => {
    const sc = document.createElement('script');
    sc.src = PRACTICE_URL;
    sc.async = true;
    sc.onload = () => done(true);
    sc.onerror = () => { PRACTICE_WANT = null; sc.remove(); done(false); };
    document.head.appendChild(sc);
  });
  return PRACTICE_WANT;
}

const practiceById = (id) => PRACTICE.filter((p) => p.id === id)[0];

/* ---- three decks, one screen ----
   An exercise says which deck it deals from (`deck`: tarot when absent, 'len'
   for Lenormand, 'pc' for playing cards). Everything the screen and the marker
   need from a card - its name, its face, the keywords that count as reading
   it, and the ones that belong to its other side - comes through here, so the
   rest of this file never asks which deck it is looking at.
   Lenormand keywords are the card's own kw.pos in each language; the system
   has no reversals, so nothing is on the wrong side. Playing cards read their
   traditional meanings (PC_TRAD), split into the phrases a reader would use. */
const P_PC_LANG = { vi: 0, en: 1, de: 2 };
function pCard(ex, i) {
  const cid = ex.cards[i];
  if (ex.deck === 'len') {
    const c = lenCard(cid);
    /* Both sides count. A hard card keeps its main meaning in kw.neg - the
       Mice are loss before they are "caught early" - and with no reversals
       nothing a reader says about either side is reading it upside down. */
    return { name: c.name, face: lenFace(cid), pos: ((c.kw && c.kw.pos) || []).concat((c.kw && c.kw.neg) || []), neg: [] };
  }
  if (ex.deck === 'pc') {
    const suit = String(cid)[0], rank = String(cid).slice(1), tr = PC_TRAD[cid] || [];
    const pos = String(tr[P_PC_LANG[lang]] || tr[1] || '').replace(/^[^:]*:\s*/, '').replace(/[.;]/g, ',')
      .split(/,\s*|\s+(?:hoặc|or|oder)\s+/).map((x) => x.trim()).filter((x) => x.length > 2);
    return { name: pcName(suit, rank), face: pcFaceSVG(suit, rank), pos: pos, neg: [] };
  }
  const card = cardById(cid), ins = insightOf(cid);
  return { name: card.name, face: faceSVG(card), pos: ins.pos, neg: ins.neg };
}
/* The spread an exercise is dealt into. Tarot and Lenormand spreads live in
   SPREADS with their positions; the playing-card course teaches its spreads
   as prose (PC_SPREADS), so their positions are named here. */
const P_PC_POS = {
  3: { vi: [['1 · Quá khứ', 'Điều đã xảy ra và còn ảnh hưởng tới chuyện bây giờ.'], ['2 · Hiện tại', 'Chuyện đang diễn ra lúc này.'], ['3 · Tương lai', 'Hướng sự việc đang đi tới nếu mọi thứ giữ nguyên.']],
       en: [['1 · Past', 'What has happened and still weighs on the present.'], ['2 · Present', 'What is going on right now.'], ['3 · Future', 'Where things are heading if nothing changes.']],
       de: [['1 · Vergangenheit', 'Was geschehen ist und noch nachwirkt.'], ['2 · Gegenwart', 'Was gerade geschieht.'], ['3 · Zukunft', 'Wohin es führt, wenn alles so bleibt.']] },
  5: { vi: [['1 · Quá khứ', 'Gốc rễ của chuyện này.'], ['2 · Hiện tại', 'Chuyện đang diễn ra lúc này.'], ['3 · Điều cản trở', 'Thứ đang chắn đường.'], ['4 · Lời khuyên', 'Việc nên làm.'], ['5 · Kết quả', 'Nơi sự việc dừng lại.']],
       en: [['1 · Past', 'Where this began.'], ['2 · Present', 'What is going on right now.'], ['3 · What blocks', 'What stands in the way.'], ['4 · Advice', 'What to do.'], ['5 · Outcome', 'Where it comes to rest.']],
       de: [['1 · Vergangenheit', 'Wo es angefangen hat.'], ['2 · Gegenwart', 'Was gerade geschieht.'], ['3 · Hindernis', 'Was im Weg steht.'], ['4 · Rat', 'Was zu tun ist.'], ['5 · Ergebnis', 'Wo es zur Ruhe kommt.']] }
};
function pSpread(ex) {
  if (ex.deck === 'pc') {
    const s = PC_SPREADS.filter((x) => x.n === ex.cards.length)[0];
    return { name: s ? s[lang][0] : '', pos: (P_PC_POS[ex.cards.length] || {})[lang] || [], read: s ? s[lang][1] : '', note: '' };
  }
  return SPREADS[lang].filter((x) => x.id === ex.spread)[0] || { name: ex.spread, pos: [], read: '', note: '' };
}

/* ---- what the learner has done ----
   Kept on the device, best mark only, exactly like the lesson quizzes: a worse
   retry never takes away a mark already earned. */
const PSCORE = {
  all() { return store.get('nabu-practice', {}) || {}; },
  best(id) { return Number(this.all()[id] || 0); },
  tried(id) { return this.all()[id] != null; },
  put(id, pct) {
    const a = this.all();
    if (!(id in a) || pct > a[id]) { a[id] = pct; store.set('nabu-practice', a); }
  },
  passed(id) { return this.best(id) >= 50; },
  done() { return PRACTICE.filter((p) => this.passed(p.id)).length; }
};

/* ---- marking ---- */
const P_BANDS = [[90, 'gold'], [75, 'silver'], [50, 'bronze'], [0, 'none']];
const pBand = (pct) => P_BANDS.filter((b) => pct >= b[0])[0][1];

/* Keywords are matched without accents, because a learner typing fast on a
   phone drops them and still knows the card. Grammar markers below are matched
   WITH accents, because folded Vietnamese collapses "đừng", "dùng" and "đúng"
   into one word and an advice check built on that would fire on anything. */
function pHit(folded, phrase) {
  /* Two letters still count: a Vietnamese keyword is syllables, and dropping
     the short ones leaves "bẽ mặt" as the single syllable "mat", which then
     matches mất, mặt and mát alike and marks a card as read that was not.
     For the same reason a one- or two-syllable keyword has to arrive whole;
     only a longer phrase is allowed to be half-recognised. */
  const words = fold(phrase).split(/[^a-z0-9]+/).filter((w) => w.length >= 2);
  if (!words.length) return false;
  const hit = words.filter((w) => folded.indexOf(' ' + w) > -1).length;
  const need = words.length <= 2 ? words.length : Math.ceil(words.length / 2);
  return hit >= need;
}

const P_MARK = {
  advice: { vi: ['nên', 'hãy', 'đừng', 'cần', 'tránh', 'thử'], en: ['should', 'try', 'avoid', 'focus', 'start', 'stop', 'need to', 'let '], de: ['sollt', 'versuch', 'vermeid', 'fang', 'muss', 'lass'] },
  outcome: { vi: ['sẽ', 'nếu', 'dẫn', 'kết quả', 'khả năng', 'cuối cùng'], en: ['will', 'if ', 'lead', 'end up', 'likely', 'result'], de: ['wird', 'wenn', 'führt', 'wahrscheinlich', 'ergebnis'] },
  state: { vi: ['đang', 'hiện', 'lúc này', 'bây giờ', 'là '], en: ['is ', 'are ', 'right now', 'currently', 'at the moment', 'has ', 'have '], de: ['ist ', 'sind ', 'gerade', 'momentan', 'hat '] }
};
const pMarked = (text, frame) => (P_MARK[frame] || {})[lang] ? (P_MARK[frame][lang] || []).some((m) => text.indexOf(m) > -1) : true;

/* A date where the cards gave a sequence, and a yes with nothing behind it:
   both are mistakes Nabu names in the spread notes, so both are marked. */
/* Matched against the folded text, because a learner typing fast drops the
   accents and "20 ngay" is the same mistake as "20 ngày". A bare month number
   is deliberately not here: on a four-month timing spread "tháng 2" names the
   second period, which is the spread working as intended, not a date. */
const P_DATE = /(\bngay\s*\d|\d{1,2}\s*\/\s*\d{1,2}|\b\d{1,3}\s*(ngay|tuan|days?|weeks?|tage|wochen)\b|\b\d{1,2}(st|nd|rd|th)\b)/;
const pTrapHit = (trap, joined) => trap === 'date' ? P_DATE.test(fold(joined))
  : trap === 'bare' ? joined.replace(/\s+/g, ' ').trim().length < 60
  : false;

/* The mark. Cards weigh most, because reading the card is the skill being
   taught; the frame and the synthesis are what turn three read cards into a
   reading. Traps come off the top, since each one is a thing the course
   explicitly told the learner not to do. */
function gradeReading(ex, answers, synth) {
  const perCard = [], notes = [];
  ex.cards.forEach((cid, i) => {
    const card = pCard(ex, i);
    const pool = (ex.rev[i] ? card.neg : card.pos), off = (ex.rev[i] ? card.pos : card.neg);
    const text = String(answers[i] || ''), folded = ' ' + fold(text) + ' ', low = text.toLowerCase();
    if (text.trim().length < 15) {
      perCard.push({ card: card, rev: !!ex.rev[i], score: 0, got: [], missed: pool, frame: false, thin: true });
      notes.push({ kind: 'thin', card: card.name });
      return;
    }
    const got = pool.filter((k) => pHit(folded, k)), wrongSide = off.filter((k) => pHit(folded, k));
    /* Two of the four keywords is a full mark. Asking for all four would be
       asking the learner to list the card rather than read it. */
    /* A card whose tradition gives it a single phrase (the wish card) counts
       as read when that one phrase is there. */
    const score = Math.min(1, got.length / Math.max(1, Math.min(2, pool.length)));
    const frame = pMarked(low, ex.frames[i]);
    perCard.push({ card: card, rev: !!ex.rev[i], score: score, got: got, missed: pool.filter((k) => got.indexOf(k) < 0), frame: frame, wrongSide: wrongSide });
    if (!frame) notes.push({ kind: 'frame', card: card.name, frame: ex.frames[i] });
    if (ex.rev[i] && !got.length && wrongSide.length >= 2) notes.push({ kind: 'reversal', card: card.name });
    /* Long enough to mark and not one keyword in it. Without this the worst
       answer on the page - a paragraph about some other card entirely - comes
       back with an empty "you caught" line and nothing said about it, which
       reads as approval. */
    else if (!got.length && !wrongSide.length) notes.push({ kind: 'missed', card: card.name });
  });

  const joined = ex.cards.map((c, i) => String(answers[i] || '')).join(' ') + ' ' + String(synth || '');
  ex.traps.forEach((t) => { if (pTrapHit(t, joined)) notes.push({ kind: t }); });

  /* The synthesis is marked on whether it joined the cards up and answered the
     question that was asked, not on length. */
  const sTxt = String(synth || ''), sFold = ' ' + fold(sTxt) + ' ';
  const named = ex.cards.filter((cid, i) => pHit(sFold, pCard(ex, i).name)).length;
  const linked = (P_MARK.outcome[lang] || []).concat(P_MARK.advice[lang] || []).some((m) => sTxt.toLowerCase().indexOf(m) > -1);
  const synthScore = sTxt.trim().length < 25 ? 0 : Math.min(1, (named >= 2 ? 0.6 : named ? 0.3 : 0) + (linked ? 0.4 : 0));
  if (!synthScore) notes.push({ kind: 'synth' });

  const cardAvg = perCard.reduce((a, c) => a + c.score, 0) / (perCard.length || 1);
  const frameAvg = perCard.filter((c) => c.frame).length / (perCard.length || 1);
  const trapCount = notes.filter((n) => n.kind === 'date' || n.kind === 'bare' || n.kind === 'reversal').length;
  const pct = Math.max(0, Math.min(100, Math.round(100 * (0.6 * cardAvg + 0.15 * frameAvg + 0.25 * synthScore)) - 6 * trapCount));
  return { pct: pct, band: pBand(pct), perCard: perCard, notes: notes, synthScore: synthScore };
}

/* ---- screens ---- */
/* The row carries the question, not only the spread, because three of the six
   exercises use the same three-card spread and a list of three identical names
   is a list nobody can choose from. */
function practiceRow(p) {
  const best = PSCORE.best(p.id), locked = !p.free && !ACCESS.has(p.course);
  const sp = pSpread(p);
  const n = p.cards.length + (lang === 'vi' ? ' lá' : (lang === 'de' ? ' Karten' : ' cards'));
  return '<a class="prow" href="#/practice/' + p.id + '">'
    + '<div class="prowin"><b>' + (locked ? '🔒 ' : '') + esc(sp.name || p.spread)
    + ' <span class="faint">· ' + n + '</span></b><span>' + esc(L(p.q)) + '</span></div>'
    + (PSCORE.tried(p.id) ? '<span class="pmark ' + pBand(best) + '">' + best + '%</span>' : '') + '</a>';
}

async function renderPractice() {
  const S = T(), m = $('#main');
  if (!(await practiceReady())) { m.innerHTML = backLink('#/learn', S.learnTitle) + '<p class="muted">' + esc(S.practiceOffline) + '</p>'; return; }
  if (parseHash().route !== 'practice') return;
  const done = PSCORE.done();
  m.innerHTML = backLink('#/learn', S.learnTitle) + '<h1 style="margin-bottom:6px">' + esc(S.practiceTitle) + '</h1>'
    + '<p class="muted">' + esc(S.practiceIntro) + '</p>'
    + '<div class="pprog"><span style="width:' + Math.round(done / PRACTICE.length * 100) + '%"></span></div>'
    + '<p class="faint" style="margin-top:4px">' + esc(S.practiceDone(done, PRACTICE.length)) + '</p>'
    /* Grouped by course, each under its own name, so a Lenormand learner does
       not scroll through Tarot to find what is theirs. */
    + ['tarot', 'lenormand', 'playing'].map((c) => {
      const list = PRACTICE.filter((p) => (p.course || 'tarot') === c);
      return list.length ? '<h2 class="pcourse">' + esc(S.cats[c]) + '</h2>' + list.map(practiceRow).join('') : '';
    }).join('');
}

async function renderExercise(id) {
  const S = T(), m = $('#main');
  if (!(await practiceReady())) { m.innerHTML = backLink('#/practice', S.practiceTitle) + '<p class="muted">' + esc(S.practiceOffline) + '</p>'; return; }
  if (parseHash().route !== 'practice') return;
  const ex = practiceById(id);
  if (!ex) { redirect('#/practice'); return; }
  if (!ex.free && gate(ex.course, '#/practice')) return;
  const sp = pSpread(ex);
  const perPos = sp.pos && sp.pos.length === ex.cards.length;

  const box = (cid, i) => {
    const card = pCard(ex, i), label = perPos ? sp.pos[i][0] : (lang === 'vi' ? 'L\u00e1 ' : (lang === 'de' ? 'Karte ' : 'Card ')) + (i + 1);
    return '<div class="prcard"><div class="pface' + (ex.rev[i] ? ' rev' : '') + '">'
      + '<button class="pturn" data-turn="' + i + '" aria-label="' + esc(S.practiceTurn) + '">' + backNow() + '</button></div>'
      + '<div class="pask shut"><b>' + esc(label) + '</b>'
      + '<div class="faint">' + esc(card.name) + (ex.rev[i] ? ' \u00b7 ' + esc(S.pRev) : '') + '</div>'
      + '<textarea data-pos="' + i + '" rows="4" placeholder="' + esc(S.practicePlaceholder) + '"></textarea></div></div>';
  };

  m.innerHTML = backLink('#/practice', S.practiceTitle) + '<div class="guide"><h1>' + esc(sp.name) + '</h1>'
    + '<div class="ins pscene"><div class="eyebrow">' + esc(S.practiceWho) + '</div>'
    + '<p>' + esc(L(ex.who)) + ' <b>' + esc(S.practiceAsks) + '</b> <span class="pq">\u201c' + esc(L(ex.q)) + '\u201d</span></p></div>'
    + '<p class="muted">' + esc(S.practiceHow) + '</p>'
    + ex.cards.map(box).join('')
    + '<div class="prcard psynth"><div class="pask" style="width:100%"><b>' + esc(S.practiceSynth) + '</b>'
    + '<div class="faint">' + esc(S.practiceSynthHint) + '</div>'
    + '<textarea data-synth="1" rows="4" placeholder="' + esc(S.practicePlaceholder) + '"></textarea></div></div>'
    + '<button class="btn primary block" id="pmark">' + esc(S.practiceMark) + '</button>'
    + '<div id="presult"></div></div>';

  /* The cards are dealt face down and turned one at a time, the way the daily
     draw does it. A learner who can see all three at once reads the spread
     backwards from the last card; turning them in order is how the reading is
     actually built. The box for a card only appears once its card is up. */
  $$('[data-turn]', m).forEach((b) => b.addEventListener('click', () => {
    const i = Number(b.getAttribute('data-turn')), card = pCard(ex, i);
    const slot = b.parentNode;
    slot.innerHTML = '<div class="flip"><div class="inner"><span class="face fr">' + card.face
      + '</span><span class="face bk">' + backNow() + '</span></div></div>';
    const ask = $('.pask', slot.parentNode);
    ask.classList.remove('shut');
    const ta = $('textarea', ask);
    if (ta) setTimeout(() => ta.focus({ preventScroll: true }), 420);
  }));

  $('#pmark').addEventListener('click', () => {
    const answers = ex.cards.map((c, i) => ($('[data-pos="' + i + '"]') || {}).value || '');
    const synth = ($('[data-synth="1"]') || {}).value || '';
    const r = gradeReading(ex, answers, synth);
    PSCORE.put(ex.id, r.pct);
    $('#presult').innerHTML = resultHTML(ex, sp, r, perPos);
    $('#pmark').textContent = S.practiceAgain;
    $('#presult').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

/* The mark, then why, then - last, and only now - how Nabu reads it. The order
   matters: showing the model answer beside the boxes would turn the exercise
   into a copying exercise. */
function resultHTML(ex, sp, r, perPos) {
  const S = T();
  const kw = (list) => list.map((k) => '<span class="pkw">' + esc(k) + '</span>').join('');
  const noteLine = (n) => n.kind === 'thin' ? S.practiceThin(n.card)
    : n.kind === 'frame' ? S.practiceFrame[n.frame](n.card)
    : n.kind === 'reversal' ? S.practiceRev(n.card)
    : n.kind === 'missed' ? S.practiceMiss(n.card)
    : n.kind === 'date' ? S.practiceDate
    : n.kind === 'bare' ? S.practiceBare
    : n.kind === 'synth' ? S.practiceNoSynth : '';

  return '<div class="presult ' + r.band + '">'
    + '<div class="pscore">' + r.pct + '%<span>' + esc(S.practiceBand[r.band]) + '</span></div>'
    + (r.notes.length ? '<ul class="pnotes">' + r.notes.map((n) => '<li>' + esc(noteLine(n)) + '</li>').join('') + '</ul>' : '')
    + '<h3>' + esc(S.practiceByCard) + '</h3>'
    + r.perCard.map((c, i) => '<div class="pline"><b>' + esc(c.card.name) + (c.rev ? ' · ' + esc(S.pRev) : '') + '</b>'
      + (c.got.length ? '<div class="pgot">' + esc(S.practiceGot) + ' ' + kw(c.got) + '</div>' : '')
      + (c.missed.length ? '<div class="pmiss">' + esc(S.practiceMissed) + ' ' + kw(c.missed) + '</div>' : '')
      + (perPos ? '<p class="faint">' + esc(sp.pos[i][1]) + '</p>' : '') + '</div>').join('')
    + '<h3>' + esc(S.practiceModel) + '</h3><p>' + esc(L(ex.model)) + '</p>'
    + (sp.read ? '<p class="faint">' + esc(sp.read) + '</p>' : '')
    + '</div>';
}

ROUTES.practice = { nav: 'learn', render: (a) => a[0] ? renderExercise(a[0]) : renderPractice() };
