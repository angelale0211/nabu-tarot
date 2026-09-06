/* ============================ lesson quizzes ============================
   Five questions after every lesson of the three paid courses, and you pass at
   eighty per cent - which with five questions means four of them. There is no
   partial credit and no half mark, so the threshold is a real one.

   Three of the five check that the lesson was read. The last two are harder on
   purpose: they ask for something the lesson does not say in as many words, so
   that passing means having thought about the material rather than having
   scrolled past it. Those two are marked, so nobody mistakes a hard question
   for a badly written one.

   Every answer here is checkable against the app's own card data - the decan
   table in astro.js, the playing-card inserts in the Lenormand text, the suit
   correspondences in the cartomancy course - so a learner who disagrees with a
   mark can go and look it up rather than take our word for it.

   What is kept is the best score, on the device. Nothing about a quiz is sent
   anywhere: this is a way to test yourself, not a way to be graded by Nabu. */

const QUIZ_PASS = 80;
const QUIZ_LEN = 5;
/* Filled by quiz-tarot.js, quiz-len.js and quiz-play.js, which load after this. */
const QUIZ = { tarot: {}, lenormand: {}, playing: {} };

const QSCORE = {
  key: (c, n) => c + '-' + n,
  all() { return store.get('nabu-quiz', {}) || {}; },
  best(c, n) { return Number(this.all()[this.key(c, n)] || 0); },
  tried(c, n) { return this.all()[this.key(c, n)] != null; },
  passed(c, n) { return this.best(c, n) >= QUIZ_PASS; },
  /* Only ever upward: a worse retry does not take away a pass already earned. */
  put(c, n, pct) {
    const a = this.all(), k = this.key(c, n);
    if (!(k in a) || pct > a[k]) { a[k] = pct; store.set('nabu-quiz', a); }
  },
  done(c) { return Object.keys(QUIZ[c] || {}).filter((n) => this.passed(c, n)).length; },
  total(c) { return Object.keys(QUIZ[c] || {}).length; }
};

const quizOf = (c, n) => ((QUIZ[c] || {})[String(n)] || []);

/* A fresh order every attempt, from the machine's own randomness, so nobody
   passes by remembering that the answer was the third one. */
function quizShuffle(k) {
  const idx = [];
  for (let i = 0; i < k; i++) idx.push(i);
  let r;
  try { r = new Uint32Array(k); (window.crypto || window.msCrypto).getRandomValues(r); }
  catch (e) { r = null; }
  for (let i = k - 1; i > 0; i--) {
    const j = (r ? r[i] : Math.floor(Math.random() * 4294967296)) % (i + 1);
    const t = idx[i]; idx[i] = idx[j]; idx[j] = t;
  }
  return idx;
}

/* The line on a lesson page, and on the list of lessons. */
function quizLinkHTML(c, n) {
  const S = T();
  if (!quizOf(c, n).length) return '';
  const best = QSCORE.best(c, n), tried = QSCORE.tried(c, n), ok = QSCORE.passed(c, n);
  return '<a class="quizlink' + (ok ? ' passed' : tried ? ' tried' : '') + '" href="#/learn/quiz/' + esc(c) + '/' + n + '">'
    + '<span class="ic">' + (ok ? '✓' : '✎') + '</span>'
    + '<span class="b"><b>' + esc(S.quizTitle) + '</b><span>' + esc(tried ? S.quizBest(best) : S.quizIntro(QUIZ_LEN, QUIZ_PASS)) + '</span></span>'
    + '<span class="go">›</span></a>';
}
function quizBadge(c, n) {
  return QSCORE.passed(c, n) ? '<span class="qbadge" title="' + esc(T().quizTitle) + '">✓</span>' : '';
}

function renderQuiz(courseId, n) {
  const S = T(), m = $('#main');
  const lesson = (LESSONS[courseId] || []).filter((x) => x.n === Number(n))[0];
  const qs = quizOf(courseId, n);
  if (!lesson || !qs.length) { redirect('#/learn/' + courseId); return; }
  /* The first lesson of every course is open to everyone, and so is its quiz. */
  if (Number(n) !== 1 && gate(courseId, '#/learn/' + courseId)) return;

  let order = qs.map((q) => quizShuffle(q.a.length));   // how the options are laid out
  let pick = qs.map(() => -1);                          // what has been chosen
  let marked = false;

  const draw = () => {
    const right = qs.filter((q, i) => marked && order[i][pick[i]] === 0).length;
    const pct = Math.round(right / qs.length * 100);
    const passed = pct >= QUIZ_PASS;
    m.innerHTML = backLink('#/learn/lesson/' + courseId + '/' + n, S.lessonN(lesson.n))
      + '<div class="eyebrow">' + esc(S.cats[courseId]) + ' · ' + esc(S.lessonN(lesson.n)) + '</div>'
      + '<h1 style="margin-bottom:6px">' + esc(S.quizTitle) + '</h1>'
      + '<p class="muted">' + esc(L(lesson.title)) + '</p>'
      + (marked
        ? '<div class="quizresult ' + (passed ? 'pass' : 'fail') + '"><b>' + esc(S.quizScore(right, qs.length, pct)) + '</b>'
          + '<p>' + esc(passed ? S.quizPassed : S.quizFailed(QUIZ_PASS)) + '</p></div>'
        : '<p class="hint">' + esc(S.quizHow(qs.length, QUIZ_PASS)) + '</p>')
      + qs.map((q, i) => {
        const opts = order[i].map((oi, slot) => {
          const chosen = pick[i] === slot;
          const isRight = marked && oi === 0;
          const cls = 'qopt' + (chosen ? ' on' : '') + (marked && isRight ? ' right' : '') + (marked && chosen && !isRight ? ' wrong' : '');
          return '<button type="button" class="' + cls + '" data-q="' + i + '" data-o="' + slot + '"' + (marked ? ' disabled' : '')
            + '><span class="mk">' + (marked ? (isRight ? '✓' : (chosen ? '✕' : '')) : '') + '</span>' + esc(L(q.a[oi])) + '</button>';
        }).join('');
        return '<div class="quizq' + (marked ? (order[i][pick[i]] === 0 ? ' ok' : ' no') : '') + '">'
          + '<div class="qh"><span class="qn">' + (i + 1) + '</span><p>' + esc(L(q.q)) + '</p>'
          + (q.hard ? '<span class="qhard">' + esc(S.quizHard) + '</span>' : '') + '</div>'
          + '<div class="qopts">' + opts + '</div>'
          + (marked ? '<p class="qwhy">' + esc(L(q.why)) + '</p>' : '') + '</div>';
      }).join('')
      + (marked
        ? '<button type="button" class="btn primary block" id="qretry">' + esc(S.quizAgain) + '</button>'
          + '<a class="btn block" href="#/learn/lesson/' + courseId + '/' + n + '" style="margin-top:10px">' + esc(S.quizBackLesson) + '</a>'
        : '<button type="button" class="btn primary block" id="qsend">' + esc(S.quizSubmit) + '</button>')
      + '<p class="hint">' + esc(S.quizKept) + '</p>';

    $$('[data-q]', m).forEach((b) => b.addEventListener('click', () => {
      pick[Number(b.getAttribute('data-q'))] = Number(b.getAttribute('data-o'));
      draw();
    }));
    const send = $('#qsend');
    if (send) send.addEventListener('click', () => {
      if (pick.some((p) => p < 0)) { toast(S.quizNeedAll); return; }
      marked = true;
      const got = qs.filter((q, i) => order[i][pick[i]] === 0).length;
      QSCORE.put(courseId, n, Math.round(got / qs.length * 100));
      draw();
      window.scrollTo(0, 0);
    });
    const again = $('#qretry');
    if (again) again.addEventListener('click', () => {
      order = qs.map((q) => quizShuffle(q.a.length));
      pick = qs.map(() => -1); marked = false;
      draw(); window.scrollTo(0, 0);
    });
  };
  draw();
}
