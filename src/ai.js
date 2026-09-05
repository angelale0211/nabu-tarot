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
/* Compatibility verdict for two signs: verdict key + why. */
function compatVerdict(a, b) {
  const ia = ZKEYS.indexOf(a), ib = ZKEYS.indexOf(b), diff = Math.abs(ia - ib) % 12, d = Math.min(diff, 12 - diff);
  const chem = signChemistry(a, b), listed = ZDEEP[a].compat.indexOf(b) > -1 || ZDEEP[b].compat.indexOf(a) > -1;
  if (a === b) return 'same';
  if (d === 6) return 'opposite';
  if (chem === 'same' || listed) return 'good';
  if (chem === 'support') return 'ok';
  if (d === 3) return 'work';
  return 'neutral';
}
function compatAnswer(a, b) {
  const S = T(), v = compatVerdict(a, b), na = ZSIGN[a][lang], nb = ZSIGN[b][lang], za = ZODIAC[a][lang], zb = ZODIAC[b][lang];
  const head = S.compatHead[v](na, nb), why = S.compatWhy[v] + ' ' + CHEM_TEXT[signChemistry(a, b)][lang] + '.';
  const bring = S.compatBring(na, za.kw.slice(0, 2).join(', '), nb, zb.kw.slice(0, 2).join(', '));
  const tip = v === 'good' || v === 'same' ? S.compatTipGood : v === 'opposite' ? S.compatTipOpp : S.compatTipWork;
  return head + '\n\n' + why + ' ' + bring + '\n\n' + tip;
}
function signMentioned(q) { const f = fold(q); return ZKEYS.filter((k) => f.indexOf(fold(ZSIGN[k].vi)) > -1 || f.indexOf(fold(ZSIGN[k].en)) > -1); }
function lenMentioned(q) { const f = fold(q), out = []; for (let i = 1; i <= 36; i++) { if (f.indexOf(fold(LEN.vi[i].name)) > -1 || f.indexOf(fold(LEN.en[i].name)) > -1) out.push(i); } return out.slice(0, 2); }
function planetMentioned(q) { const f = fold(q); return PLANETS.filter((p) => f.indexOf(fold(p.name.vi)) > -1 || f.indexOf(fold(p.name.en)) > -1).slice(0, 2); }
function houseMentioned(q) { const m = /(?:nha|house)\s*(\d{1,2})/.exec(fold(q)); const n = m ? Number(m[1]) : 0; return n >= 1 && n <= 12 ? n : 0; }
function animalMentioned(q) { const f = fold(q); return ANIMALS.map((a, i) => (f.indexOf(fold(a.vi.split(' ')[0])) > -1 || f.indexOf(fold(a.en)) > -1) ? i : -1).filter((i) => i > -1).slice(0, 2); }
function numberMentioned(q) { const m = /(?:so|number|duong doi|life path)\s*(\d{1,2})/.exec(fold(q)); const n = m ? Number(m[1]) : 0; return LIFEPATH[n] ? n : 0; }
function topicHelp(q) {
  const f = fold(q), S = T();
  if (/tarot la gi|what is tarot|hoc tarot|learn tarot|bat dau/.test(f)) { const g = GUIDES.filter((x) => x.id === 'tarot-start')[0]; return L(g.intro) + ' ' + L(g.sections[0].p); }
  if (/lenormand/.test(f)) { const g = GUIDES.filter((x) => x.id === 'len-vs-tarot')[0]; return L(g.intro) + ' ' + L(g.sections[0].p); }
  if (/manifest|khang dinh|affirmation|369|scripting|kich ban/.test(f)) { const id = /369/.test(f) ? 'mani-369' : /script|kich ban/.test(f) ? 'mani-script' : /khang dinh|affirmation|biet on|gratitude/.test(f) ? 'mani-gratitude' : 'mani-what'; const g = GUIDES.filter((x) => x.id === id)[0]; return L(g.intro) + ' ' + L(g.sections[0].p); }
  if (/la nguoc|reversed/.test(f)) { const g = GUIDES.filter((x) => x.id === 'tarot-reversed')[0]; return L(g.intro) + ' ' + L(g.sections[0].p); }
  if (/hoang gia|court/.test(f)) { const g = GUIDES.filter((x) => x.id === 'tarot-court')[0]; return L(g.intro) + ' ' + L(g.sections[0].p); }
  if (/mat trang|moon|trang non|trang tron|full moon|new moon|\btrang\b|\btrăng\b/.test(f)) { const g = GUIDES.filter((x) => x.id === 'astro-moon')[0]; const mp = moonPhase(new Date()); return (lang === 'vi' ? 'Hôm nay là ' : 'Today is ') + MOON_NAMES[lang][mp.idx] + '. ' + L(g.intro); }
  if (/nghich hanh|retrograde/.test(f)) { const g = GUIDES.filter((x) => x.id === 'astro-retro')[0]; return L(g.intro) + ' ' + L(g.sections[1].p); }
  if (/cung moc|rising|ascendant|cung mat trang|moon sign|big three|ba cung/.test(f)) { const g = GUIDES.filter((x) => x.id === 'astro-big3')[0]; return L(g.intro) + ' ' + L(g.sections[2].p); }
  if (/chi tay|palm/.test(f)) { const g = GUIDES.filter((x) => x.id === 'fort-palm')[0]; return L(g.intro); }
  if (/la tra|tea/.test(f)) { const g = GUIDES.filter((x) => x.id === 'fort-tea')[0]; return L(g.intro); }
  if (/con giap|zodiac animal|tu vi/.test(f)) { const g = GUIDES.filter((x) => x.id === 'fort-animals')[0]; return L(g.intro) + ' ' + L(g.sections[2].p); }
  if (/than so|numerology|duong doi|life path/.test(f)) { const g = GUIDES.filter((x) => x.id === 'fort-numerology')[0]; return L(g.intro); }
  if (/dat lich|book|gia|price|bao nhieu tien|how much/.test(f)) return S.aiBooking;
  return '';
}
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
/* A sum typed into the box gets a sum back, even offline. Only digits and operators reach the evaluator. */
function calcAnswer(f) {
  const t = String(f || '').replace(/[=?:\s]+$/, '').trim();
  if (!/\d/.test(t) || !/^[\d\s+\-*/().,xX×÷^%]+$/.test(t) || !/[+\-*/xX×÷^%]/.test(t)) return '';
  const expr = t.replace(/[xX×]/g, '*').replace(/÷/g, '/').replace(/\^/g, '**').replace(/,/g, '.').replace(/\s+/g, '');
  try { const v = Function('"use strict"; return (' + expr + ')')(); if (typeof v !== 'number' || !isFinite(v)) return ''; return t.replace(/\s+/g, ' ') + ' = ' + String(Math.round(v * 1e6) / 1e6); } catch (e) { return ''; }
}
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
    if (other) out.push(compatAnswer(ctx.key, other));
    else if (/hop|compat|match|get along|suit/.test(fold(q))) out.push(S.compatWhich(z[lang]) + ' ' + ZDEEP[ctx.key].compat.map((k) => ZSIGN[k][lang]).join(', ') + '. ' + S.compatAsk);
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
    const f = fold(q).trim(), specific = mentioned.length || signs.length || lenMentioned(q).length || planetMentioned(q).length || houseMentioned(q) || numberMentioned(q);
    const help = topicHelp(q);
    const si = mySign(), myKey = si > -1 ? ZKEYS[si] : '';
    const drawOne = () => {
      const id = DECK.vi[Math.floor(Math.random() * DECK.vi.length)].id, c = cardById(id), I = insightOf(id);
      out.push(S.aiDrew(c.name) + ' ' + (d.cat ? I[d.cat] : I.now));
      if (d.yesno) { const lean = leanOf(id); out.push(lean > 0 ? S.aiYes(c.name) : lean < 0 ? S.aiNo(c.name) : S.aiMaybe(c.name)); }
      if (d.timing) out.push(S.aiTiming + ' ' + SUIT_TIMING[lang][c.suit]);
      out.push(I.advice, S.aiDrawHint);
    };
    const sum = calcAnswer(f);
    if (sum) out.push(sum);
    else if (/^(chao|hi|hello|xin chao|alo|hey|yo)\b/.test(f) || f.length < 3) out.push(S.aiGreet);
    else if (/cam on|thank/.test(f)) out.push(S.aiThanks);
    else if (help) out.push(help);
    else if (!specific && /rut (cho minh |giup minh |giup |cho )?(mot |1 )?la|rut bai|draw (me )?(a |one )?card|pick a card|la bai (cua |cho )?hom nay|card (of the day|for today)/.test(f)) drawOne();
    else if (!specific && /(hom nay|today).*(trang|moon)|(trang|moon).*(hom nay|today)/.test(f)) { const mp = moonPhase(new Date()); out.push(S.aiTodayMoon(MOON_NAMES[lang][mp.idx])); }
    else if (!specific && (d.yesno || d.timing || d.cat)) {
      if (myKey && d.cat) out.push(S.aiSignOf(ZSIGN[myKey][lang]) + ' ' + (d.cat === 'love' ? ZODIAC[myKey][lang].love : ZODIAC[myKey][lang].work));
      drawOne();
    }
  }
  lenMentioned(q).forEach((n) => { const d = lenCard(n); out.push(S.aiAbout(d.name) + ' ' + (d.kw.pos || []).slice(0, 3).join(', ') + '. ' + (d.cat === 'love' && d.love ? d.love : d.core)); });
  planetMentioned(q).forEach((p) => out.push(S.aiAbout(p.name[lang]) + ' ' + p[lang]));
  { const h = houseMentioned(q); if (h) out.push(S.aiAbout((lang === 'vi' ? 'nhà ' : 'house ') + h) + ' ' + HOUSES[h - 1][lang][0] + '. ' + HOUSES[h - 1][lang][1]); }
  animalMentioned(q).forEach((i) => out.push(S.aiAbout(ANIMALS[i][lang]) + ' ' + ANIMAL_INFO[lang][i][3]));
  { const n = numberMentioned(q); if (n && ctx.type !== 'numbers') out.push(S.lifePathOf(n) + ': ' + LIFEPATH[n][lang]); }
  if (ctx.type !== 'card' && ctx.type !== 'lesson' && ctx.type !== 'numbers' && !mentioned.length && !signs.length && !out.length) {
    const hits = searchAll(q);
    if (hits.length) { out.push(S.aiFound); hits.forEach((h) => out.push('• ' + h)); }
    else out.push(S.aiGeneralHelp, S.aiOfflineHint);
  }
  mentioned.forEach((id) => { const c = cardById(id), I = insightOf(id); out.push(S.aiAbout(c.name) + ' ' + I.pos.slice(0, 3).join(', ') + '. ' + (d.cat && d.cat !== 'general' ? I[d.cat] : I.now)); });
  if (ctx.type !== 'sign' && signs.length >= 2 && /hop|compat|match|get along|suit|with/.test(fold(q))) out.unshift(compatAnswer(signs[0], signs[1]));
  else if (ctx.type !== 'sign') signs.slice(0, 2).forEach((k) => out.push(S.aiAbout(ZSIGN[k][lang]) + ' ' + (d.cat === 'love' ? ZODIAC[k][lang].love : d.cat === 'work' ? ZODIAC[k][lang].work : ZODIAC[k][lang].about)));
  return out.filter(Boolean).join('\n\n');
}
function searchAll(q) {
  const words = fold(q).split(/[^a-z0-9]+/).filter((w) => w.length >= 3 && ['ban', 'nao', 'gi', 'la', 'the', 'what', 'does', 'mean', 'nghia', 'sao', 'thi', 'toi', 'minh', 'cua', 'nhu', 'co', 'khong', 'the', 'nao', 'and', 'for', 'with'].indexOf(w) < 0);
  if (!words.length) return [];
  const docs = [];
  GUIDES.forEach((g) => g.sections.forEach((s) => docs.push([L(g.title) + ' › ' + L(s.h), L(s.p)])));
  return docs.map((doc) => { const f = fold(doc[0] + ' ' + doc[1]); let sc = 0; words.forEach((w) => { if (f.indexOf(w) > -1) sc += (fold(doc[0]).indexOf(w) > -1 ? 3 : 1); }); return [sc, doc]; })
    .filter((x) => x[0] > 1).sort((a, b) => b[0] - a[0]).slice(0, 2).map((x) => x[1][0] + ': ' + x[1][1]);
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

/* ---- Gemini (browser-side, free tier, web grounding) ---- */
function aiSystemPrompt() {
  return lang === 'vi'
    ? 'Bạn là Nabu AI, trợ lý trong app Nabu Tarot (một reader tarot người Việt). Bạn trả lời MỌI câu hỏi như một trợ lý AI thông thường: toán, kiến thức chung, tin tức, dịch thuật, viết lách, và tất nhiên là tarot, Lenormand, chiêm tinh, thần số học. Câu hỏi đơn giản thì trả lời thẳng và chính xác (ví dụ "1 + 1 = 2"); câu hỏi cần thông tin mới thì tìm kiếm khi có thể. Trả lời bằng tiếng Việt đời thường, ấm áp, ngắn gọn (2 đến 8 câu ngắn), xưng "mình", gọi người dùng là "bạn". Khi câu hỏi liên quan tới thứ người dùng đang xem, ưu tiên KIẾN THỨC được cung cấp. Không chẩn đoán bệnh, không tư vấn pháp lý hay đầu tư cụ thể, không hứa điều gì chắc chắn xảy ra. Chuyện riêng quan trọng, gợi ý đặt lịch xem bài với Nabu.'
    : 'You are Nabu AI, the assistant inside the Nabu Tarot app (a Vietnamese tarot reader). You answer ANY question like a general assistant: maths, general knowledge, news, translation, writing, and of course tarot, Lenormand, astrology and numerology. Answer simple questions directly and precisely (for example "1 + 1 = 2"); search when a question needs current information. Answer in plain, warm English, 2 to 8 short sentences. When the question is about what the user is looking at, prefer the KNOWLEDGE provided. No medical diagnosis, no specific legal or investment advice, no promises. For important personal matters, suggest booking a reading with Nabu.';
}
const withTimeout = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);
async function geminiAnswer(q, ctx, history) {
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(CONFIG.geminiModel || 'gemini-2.5-flash') + ':generateContent?key=' + encodeURIComponent(CONFIG.geminiKey);
  const contents = history.slice(-6).map((h) => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.text }] }));
  if (contents.length && contents[contents.length - 1].role === 'user') contents.pop();
  contents.push({ role: 'user', parts: [{ text: 'KNOWLEDGE (' + ctx.type + '):\n' + contextText(ctx).slice(0, 12000) + '\n\nQUESTION: ' + q }] });
  const base = { system_instruction: { parts: [{ text: aiSystemPrompt() }] }, contents: contents, generationConfig: { temperature: 0.7, maxOutputTokens: 900 } };
  const call = (search) => withTimeout(fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(search ? Object.assign({ tools: [{ google_search: {} }] }, base) : base) }), 25000);
  // Web search has its own small free quota: when it is used up, answer from the model alone.
  let r = await call(true);
  if (!r.ok && [400, 403, 429].indexOf(r.status) > -1) r = await call(false);
  if (!r.ok) throw new Error('Gemini ' + r.status);
  const j = await r.json(), cand = (j.candidates || [])[0];
  const text = ((cand && cand.content && cand.content.parts) || []).map((p) => p.text || '').join('').trim();
  if (!text) throw new Error('Gemini empty');
  const chunks = ((cand.groundingMetadata || {}).groundingChunks || []).map((c) => c.web).filter(Boolean).slice(0, 3);
  return text + (chunks.length ? '\n\n' + (lang === 'vi' ? 'Tham khảo: ' : 'Sources: ') + chunks.map((c) => c.title || c.uri).join(' · ') : '');
}

/* ---- online engine ---- */
async function remoteAnswer(q, ctx, history) {
  const r = await withTimeout(fetch(CONFIG.aiEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lang: lang, question: q, context: contextText(ctx), kind: ctx.type, history: history.slice(-6), profile: { name: PROFILE.name || '', sign: mySign() > -1 ? ZSIGN[ZKEYS[mySign()]].en : '' } }) }), 25000);
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
  return '<div class="ai" data-ai=\'' + esc(key) + '\'><div class="ai-h"><span class="ai-logo">✦</span><b>Nabu AI</b><span class="faint">' + esc(CONFIG.geminiKey || CONFIG.aiEndpoint ? S.aiOnline : S.aiBuiltin) + '</span></div>'
    + '<p class="hint">' + esc(ctx.type === 'lesson' ? S.aiIntroLesson : S.aiIntro) + '</p>'
    + '<div class="chips sugs">' + aiSuggestions(ctx).map((s) => '<button class="chip" data-ai-sug>' + esc(s) + '</button>').join('') + '</div>'
    + '<div class="chat ai-chat">' + hist.map((m) => aiMsgHTML(m.role, m.text)).join('') + '</div>'
    + '<div class="chatbar"><textarea data-ai-q placeholder="' + esc(S.aiPlaceholder) + '"></textarea><button class="btn primary" data-ai-send>' + esc(S.aiAsk) + '</button></div>'
    + '<p class="faint" style="margin-top:8px">' + esc(S.aiNote) + '</p></div>';
}
const aiMsgHTML = (role, text) => '<div class="msg ' + (role === 'user' ? 'me' : 'them') + '">' + paras(text) + '</div>';
function bindAI(root) {
  $$('.ai', root).forEach((panel) => {
    const ctx = JSON.parse(panel.getAttribute('data-ai')), key = panel.getAttribute('data-ai'), ta = $('[data-ai-q]', panel), chat = $('.ai-chat', panel), send = $('[data-ai-send]', panel);
    let busy = false;  // per box, and always released, so a slow answer can never lock typing
    const push = (role, text) => { AI.history[key] = AI.history[key] || []; AI.history[key].push({ role: role, text: text }); chat.insertAdjacentHTML('beforeend', aiMsgHTML(role, text)); chat.scrollTop = chat.scrollHeight; };
    const ask = async (q) => {
      q = (q || '').trim(); if (!q || busy) return;
      busy = true; send.disabled = true; ta.value = ''; push('user', q);
      const thinking = document.createElement('div'); thinking.className = 'msg them ai-wait'; thinking.textContent = '…'; chat.appendChild(thinking); chat.scrollTop = chat.scrollHeight;
      let a;
      try { a = CONFIG.geminiKey ? await geminiAnswer(q, ctx, AI.history[key]) : CONFIG.aiEndpoint ? await remoteAnswer(q, ctx, AI.history[key]) : localAnswer(q, ctx); }
      catch (e) { try { a = localAnswer(q, ctx) + '\n\n(' + T().aiFallback + ')'; } catch (e2) { a = T().aiGeneralHelp; } }
      finally { thinking.remove(); busy = false; send.disabled = false; }
      push('assistant', a); ta.focus();
    };
    $('[data-ai-send]', panel).addEventListener('click', () => ask(ta.value));
    ta.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(ta.value); } });
    $$('[data-ai-sug]', panel).forEach((b) => b.addEventListener('click', () => ask(b.textContent)));
  });
}
