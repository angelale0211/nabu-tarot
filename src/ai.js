/* ============================ Nabu AI ============================
   A question box that knows what the visitor is looking at: the card they
   drew, the lesson they are reading, their sign, their numbers. Two engines:
   - online: CONFIG.aiEndpoint (the Cloudflare Worker in worker/) calls Claude
     with the same context and the visitor's question;
   - built-in: when no endpoint is set, answers are assembled here from the
     app's own knowledge base, so the feature works offline and costs nothing. */
const AI = { history: {}, busy: false };
const fold = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
const CATS = {
  love: ['yeu', 'tinh cam', 'nguoi ay', 'crush', 'nguoi cu', 'chia tay', 'hen ho', 'ket hon', 'cuoi', 'ban trai', 'ban gai', 'chong', 'vo', 'love', 'relationship', 'partner', 'boyfriend', 'girlfriend', 'ex ', 'marriage', 'date'],
  work: ['cong viec', 'viec lam', 'sep', 'nghe', 'su nghiep', 'thang chuc', 'dong nghiep', 'kinh doanh', 'du an', 'work', 'job', 'career', 'boss', 'promotion', 'business', 'colleague'],
  study: ['hoc', 'thi', 'truong', 'diem', 'bai vo', 'ky thi', 'study', 'exam', 'school', 'university', 'grade', 'test'],
  money: ['tien', 'luong', 'dau tu', 'no', 'tai chinh', 'mua nha', 'money', 'salary', 'invest', 'debt', 'finance', 'buy'],
  timing: ['khi nao', 'bao gio', 'bao lau', 'luc nao', 'when', 'how long', 'how soon'],
  yesno: ['co nen', 'co duoc', ' khong?', 'co ... khong', 'should i', 'will i', 'will he', 'will she', 'is he', 'is she', 'do they', 'does he', 'does she', 'can i']
};
function detectCat(q) {
  const f = ' ' + fold(q) + ' ';
  const hit = (list) => list.some((k) => f.indexOf(k) > -1);
  const cat = ['love', 'work', 'study', 'money'].filter((c) => hit(CATS[c]))[0] || null;
  return { cat: cat, timing: hit(CATS.timing), yesno: hit(CATS.yesno) || /\bco\b.*\bkhong\b/.test(f) };
}
function cardsMentioned(q) {
  const f = fold(q), out = [];
  DECK.vi.forEach((c, i) => { const en = DECK.en[i]; if (f.indexOf(fold(c.name)) > -1 || f.indexOf(fold(en.name)) > -1) out.push(c.id); });
  return out.slice(0, 3);
}
function signMentioned(q) { const f = fold(q); return ZKEYS.filter((k) => f.indexOf(fold(ZSIGN[k].vi)) > -1 || f.indexOf(fold(ZSIGN[k].en)) > -1); }
const SUIT_TIMING = {
  vi: { wands: 'Gậy đi nhanh: vài ngày đến vài tuần.', cups: 'Cốc đi theo cảm xúc: vài tuần, đôi khi một mùa.', swords: 'Kiếm đi rất nhanh, thường tính bằng ngày, nhưng hay đến bất ngờ.', pentacles: 'Tiền đi chậm: tính bằng tháng, có khi cả năm.', major: 'Ẩn Chính không tính theo lịch: chuyện xảy ra khi bài học đã đủ, không sớm hơn.' },
  en: { wands: 'Wands move fast: days to a few weeks.', cups: 'Cups move with feeling: weeks, sometimes a season.', swords: 'Swords move very fast, usually days, and often arrive unexpectedly.', pentacles: 'Pentacles are slow: months, sometimes a year.', major: 'A Major is not on the calendar: it happens when the lesson is complete, not before.' }
};
const YES = { 'major-0': 1, 'major-1': 1, 'major-3': 1, 'major-6': 1, 'major-7': 1, 'major-8': 1, 'major-10': 1, 'major-14': 1, 'major-17': 1, 'major-19': 1, 'major-20': 1, 'major-21': 1, 'major-2': 0, 'major-9': 0, 'major-12': 0, 'major-13': -1, 'major-15': -1, 'major-16': -1, 'major-18': 0, 'major-4': 1, 'major-5': 1, 'major-11': 0 };
function leanOf(id) {
  if (id in YES) return YES[id];
  const m = /^(\w+)-(c?)(\d+)$/.exec(id), suit = m[1], court = m[2] === 'c', n = Number(m[3]);
  if (court) return suit === 'swords' ? 0 : 1;
  if (suit === 'swords') return [1, 6].indexOf(n) > -1 ? 1 : ([2, 4, 7].indexOf(n) > -1 ? 0 : -1);
  if (suit === 'cups') return [4, 5, 7, 8].indexOf(n) > -1 ? ([4, 7].indexOf(n) > -1 ? 0 : -1) : 1;
  if (suit === 'wands') return [5, 7, 9, 10].indexOf(n) > -1 ? 0 : 1;
  return [4, 5, 7].indexOf(n) > -1 ? (n === 5 ? -1 : 0) : 1;
}

/* ---- context text (shared by both engines) ---- */
function contextText(ctx) {
  const S = T();
  if (ctx.type === 'card') {
    const c = cardById(ctx.id), I = insightOf(ctx.id);
    return [c.name + ' (' + cardById(ctx.id, lang === 'vi' ? 'en' : 'vi').name + ') · ' + c.meta, S.onTheCard + ': ' + c.scene, S.kwPos + ': ' + I.pos.join(', '), S.kwNeg + ': ' + I.neg.join(', '),
      S.upright + ': ' + c.up + ' ' + I.now, S.reversed + ': ' + c.rev, S.focus.love + ': ' + I.love, S.focus.work + ': ' + I.work, S.focus.study + ': ' + I.study, S.focus.money + ': ' + I.money, 'Advice: ' + I.advice].join('\n');
  }
  if (ctx.type === 'lesson') {
    const l = LESSONS[ctx.course].filter((x) => x.n === Number(ctx.n))[0], parts = [L(l.title)];
    if (l.intro) parts.push(L(l.intro));
    if (l.guide) { const g = GUIDES.filter((x) => x.id === l.guide)[0]; parts.push(L(g.intro)); g.sections.forEach((s) => parts.push(L(s.h) + ': ' + L(s.p))); }
    (l.cards || []).forEach((id) => { const c = cardById(id), I = insightOf(id); parts.push(c.name + ': ' + I.pos.join(', ') + '. ' + c.up); });
    (l.len || []).forEach((n) => { const d = lenCard(n); parts.push(n + '. ' + d.name + ' (' + S.lenTone[d.tone] + '): ' + d.core); });
    return parts.join('\n');
  }
  if (ctx.type === 'sign') {
    const z = ZSIGN[ctx.key], zp = ZODIAC[ctx.key][lang], dp = ZDEEP[ctx.key][lang];
    return [z[lang] + ' · ' + (lang === 'vi' ? z.dvi : z.den) + ' · ' + ZELEM[z.el][lang] + ' · ' + ZMODE[z.mod][lang] + ' · ' + S.ruler + ' ' + ZPLANET[ZRULER[ctx.key]][lang],
      S.signAbout + ': ' + zp.about, S.signLove + ': ' + zp.love, S.signWork + ': ' + zp.work, S.signTip + ': ' + zp.tip, S.strengths + ': ' + dp.strengths.join(', '), S.challenges + ': ' + dp.challenges.join(', '), dp.moon, dp.rising].join('\n');
  }
  if (ctx.type === 'numbers') {
    const n = numerologyOf(PROFILE.name, PROFILE.birthday), parts = [];
    if (n.lifePath) parts.push(S.lifePath + ' ' + n.lifePath + ': ' + LIFEPATH[n.lifePath][lang]);
    if (n.expression) parts.push(S.numExpr + ' ' + n.expression + ': ' + NUM[n.expression][lang].expr, S.numSoul + ' ' + n.soul + ': ' + NUM[n.soul][lang].soul, S.numPers + ' ' + n.personality + ': ' + NUM[n.personality][lang].pers);
    if (n.personalYear) parts.push(S.numYear + ' ' + n.personalYear + ': ' + PYEAR[n.personalYear][lang]);
    return parts.join('\n');
  }
  return '';
}

/* ---- built-in engine ---- */
function localAnswer(q, ctx) {
  const S = T(), d = detectCat(q), out = [];
  const mentioned = cardsMentioned(q).filter((id) => !(ctx.type === 'card' && id === ctx.id));
  const signs = signMentioned(q);
  if (ctx.type === 'card') {
    const c = cardById(ctx.id), I = insightOf(ctx.id);
    const cat = d.cat || 'general';
    if (cat === 'general') out.push(S.aiCardGeneral(c.name) + ' ' + I.now, I.advice);
    else out.push(S.aiCardFocus(c.name, S.focus[cat]) + ' ' + I[cat], S.aiCardWhy + ' ' + I.pos.slice(0, 3).join(', ') + '. ' + S.aiCardShadow + ' ' + I.neg.slice(0, 2).join(', ') + '.');
    if (d.yesno) { const lean = leanOf(ctx.id); out.push(lean > 0 ? S.aiYes(c.name) : lean < 0 ? S.aiNo(c.name) : S.aiMaybe(c.name)); }
    if (d.timing) out.push(S.aiTiming + ' ' + SUIT_TIMING[lang][c.suit]);
  } else if (ctx.type === 'lesson') {
    const hits = searchCourse(q, ctx.course);
    if (hits.length) out.push(S.aiFound); hits.forEach((h) => out.push('• ' + h));
    if (!hits.length && !mentioned.length) out.push(S.aiLessonNone);
  } else if (ctx.type === 'sign') {
    const zp = ZODIAC[ctx.key][lang], dp = ZDEEP[ctx.key][lang], z = ZSIGN[ctx.key];
    const other = signs.filter((k) => k !== ctx.key)[0];
    if (other) { const ch = signChemistry(ctx.key, other); out.push(S.aiChem(z[lang], ZSIGN[other][lang]) + ' ' + CHEM_TEXT[ch][lang] + '. ' + (ZDEEP[ctx.key].compat.indexOf(other) > -1 ? S.aiCompatYes : S.aiCompatWork)); }
    else if (d.cat === 'love') out.push(zp.love);
    else if (d.cat === 'work' || d.cat === 'study' || d.cat === 'money') out.push(zp.work);
    else if (/mat trang|moon/.test(fold(q))) out.push(dp.moon);
    else if (/moc|rising|ascendant/.test(fold(q))) out.push(dp.rising);
    else out.push(zp.about, S.strengths + ': ' + dp.strengths.join(', ') + '. ' + S.challenges + ': ' + dp.challenges.join(', ') + '.', zp.tip);
  } else if (ctx.type === 'numbers') {
    const n = numerologyOf(PROFILE.name, PROFILE.birthday), f = fold(q);
    if (!n.lifePath) out.push(S.enterBirthday);
    else if (/nam nay|personal year|year/.test(f)) out.push(S.numYear + ' ' + n.personalYear + ': ' + PYEAR[n.personalYear][lang]);
    else if (n.expression && /ten|name|van menh|expression|destiny/.test(f)) out.push(S.numExpr + ' ' + n.expression + ': ' + NUM[n.expression][lang].expr);
    else if (n.soul && /linh hon|soul|mong muon|desire/.test(f)) out.push(S.numSoul + ' ' + n.soul + ': ' + NUM[n.soul][lang].soul);
    else if (n.personality && /nhan cach|personality|nguoi khac thay/.test(f)) out.push(S.numPers + ' ' + n.personality + ': ' + NUM[n.personality][lang].pers);
    else if (d.cat === 'love') out.push(S.lifePathOf(n.lifePath) + ': ' + LIFEPATH[n.lifePath][lang], n.soul ? S.numSoul + ' ' + n.soul + ': ' + NUM[n.soul][lang].soul : '');
    else if (d.cat) out.push(S.lifePathOf(n.lifePath) + ': ' + LIFEPATH[n.lifePath][lang], n.expression ? S.numExpr + ' ' + n.expression + ': ' + NUM[n.expression][lang].expr : '');
    else out.push(S.lifePathOf(n.lifePath) + ': ' + LIFEPATH[n.lifePath][lang], n.personalYear ? S.numYear + ' ' + n.personalYear + ': ' + PYEAR[n.personalYear][lang] : '');
  } else {
    if (!mentioned.length && !signs.length) out.push(S.aiGeneralHelp);
  }
  mentioned.forEach((id) => { const c = cardById(id), I = insightOf(id); out.push(S.aiAbout(c.name) + ' ' + I.pos.slice(0, 3).join(', ') + '. ' + (d.cat && d.cat !== 'general' ? I[d.cat] : I.now)); });
  if (ctx.type !== 'sign') signs.slice(0, 2).forEach((k) => out.push(S.aiAbout(ZSIGN[k][lang]) + ' ' + (d.cat === 'love' ? ZODIAC[k][lang].love : d.cat === 'work' ? ZODIAC[k][lang].work : ZODIAC[k][lang].about)));
  return out.filter(Boolean).join('\n\n');
}
function searchCourse(q, course) {
  const words = fold(q).split(/[^a-z0-9]+/).filter((w) => w.length >= 3 && ['ban', 'nao', 'gi', 'la', 'the', 'what', 'does', 'mean', 'nghia', 'sao', 'thi', 'toi', 'minh'].indexOf(w) < 0);
  if (!words.length) return [];
  const docs = [];
  GUIDES.filter((g) => g.cat === course).forEach((g) => g.sections.forEach((s) => docs.push([L(g.title) + ' › ' + L(s.h), L(s.p)])));
  if (course === 'tarot') DECK[lang].forEach((c) => { const I = insightOf(c.id); docs.push([c.name, I.pos.join(', ') + '. ' + c.up]); });
  else for (let i = 1; i <= 36; i++) { const d = lenCard(i); docs.push([i + '. ' + d.name, (d.kw.pos || []).join(', ') + '. ' + d.core]); }
  return docs.map((doc) => { const f = fold(doc[0] + ' ' + doc[1]); let sc = 0; words.forEach((w) => { if (f.indexOf(w) > -1) sc += (fold(doc[0]).indexOf(w) > -1 ? 3 : 1); }); return [sc, doc]; })
    .filter((x) => x[0] > 0).sort((a, b) => b[0] - a[0]).slice(0, 2).map((x) => x[1][0] + ': ' + x[1][1]);
}

/* ---- online engine ---- */
async function remoteAnswer(q, ctx, history) {
  const r = await fetch(CONFIG.aiEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lang: lang, question: q, context: contextText(ctx), kind: ctx.type, history: history.slice(-6), profile: { name: PROFILE.name || '', sign: mySign() > -1 ? ZSIGN[ZKEYS[mySign()]].en : '' } }) });
  if (!r.ok) throw new Error('AI ' + r.status);
  const j = await r.json();
  if (!j.answer) throw new Error(j.error || 'AI');
  return j.answer;
}

/* ---- panel ---- */
function aiSuggestions(ctx) {
  const S = T();
  if (ctx.type === 'card') return S.aiSugCard;
  if (ctx.type === 'lesson') return S.aiSugLesson;
  if (ctx.type === 'sign') return S.aiSugSign;
  if (ctx.type === 'numbers') return S.aiSugNumbers;
  return S.aiSugGeneral;
}
function aiPanelHTML(ctx) {
  const S = T(), key = JSON.stringify(ctx), hist = AI.history[key] || [];
  return '<div class="ai" data-ai=\'' + esc(key) + '\'><div class="ai-h"><span class="ai-logo">✦</span><b>Nabu AI</b><span class="faint">' + esc(CONFIG.aiEndpoint ? S.aiOnline : S.aiBuiltin) + '</span></div>'
    + '<p class="hint">' + esc(ctx.type === 'lesson' ? S.aiIntroLesson : S.aiIntro) + '</p>'
    + '<div class="chips">' + aiSuggestions(ctx).map((s) => '<button class="chip" data-ai-sug>' + esc(s) + '</button>').join('') + '</div>'
    + '<div class="chat ai-chat">' + hist.map((m) => '<div class="msg ' + (m.role === 'user' ? 'me' : 'them') + '">' + esc(m.text).replace(/\n/g, '<br>') + '</div>').join('') + '</div>'
    + '<div class="chatbar"><textarea data-ai-q placeholder="' + esc(S.aiPlaceholder) + '"></textarea><button class="btn primary" data-ai-send>' + esc(S.aiAsk) + '</button></div>'
    + '<p class="faint" style="margin-top:8px">' + esc(S.aiNote) + '</p></div>';
}
function bindAI(root) {
  $$('.ai', root).forEach((panel) => {
    const ctx = JSON.parse(panel.getAttribute('data-ai')), key = panel.getAttribute('data-ai'), ta = $('[data-ai-q]', panel), chat = $('.ai-chat', panel);
    const push = (role, text) => { AI.history[key] = AI.history[key] || []; AI.history[key].push({ role: role, text: text }); chat.innerHTML += '<div class="msg ' + (role === 'user' ? 'me' : 'them') + '">' + esc(text).replace(/\n/g, '<br>') + '</div>'; chat.scrollTop = chat.scrollHeight; };
    const ask = async (q) => {
      q = (q || '').trim(); if (!q || AI.busy) return;
      AI.busy = true; ta.value = ''; push('user', q);
      const thinking = document.createElement('div'); thinking.className = 'msg them ai-wait'; thinking.textContent = '…'; chat.appendChild(thinking);
      let a;
      try { a = CONFIG.aiEndpoint ? await remoteAnswer(q, ctx, AI.history[key]) : localAnswer(q, ctx); }
      catch (e) { a = localAnswer(q, ctx) + '\n\n(' + T().aiFallback + ')'; }
      thinking.remove(); push('assistant', a); AI.busy = false;
    };
    $('[data-ai-send]', panel).addEventListener('click', () => ask(ta.value));
    ta.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(ta.value); } });
    $$('[data-ai-sug]', panel).forEach((b) => b.addEventListener('click', () => ask(b.textContent)));
  });
}
