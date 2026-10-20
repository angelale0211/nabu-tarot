/* A device-local notebook. Entries are scoped to the resolved account (or
   guest); a form opened by one person must never write into another's book.
   The app's existing nabu-* wipe removes these on sign-out/account deletion.
   No timers keep private text alive after leaving a screen. */
const STUDY_RUBRIC = 'keywords-positions-v1';
const STUDY_TEXT = {
  vi: {
    title: 'Sổ học của bạn', intro: 'Giữ lại lời đọc của mình, sửa lại và nhìn thấy điều đã học được.',
    local: 'Sổ chỉ lưu trên thiết bị này, chưa đồng bộ. Đăng xuất, xóa tài khoản hoặc xóa dữ liệu ứng dụng sẽ xóa sổ. Hãy xuất bản sao trước.',
    waiting: 'Đang xác định tài khoản. Sổ sẽ mở khi tài khoản tải xong.',
    offlineGuest: 'Không tải được đăng nhập. Bạn đang dùng sổ khách trên thiết bị; hãy kết nối lại và mở lại app để xem sổ của tài khoản.',
    rules: 'Phản hồi tự động dựa trên từ khóa và vai trò từng vị trí, có thể bỏ sót cách diễn đạt khác. Điểm không đo khả năng dự đoán tương lai.',
    saved: 'Đã lưu trên thiết bị', draft: 'Đã lưu bản nháp', failed: 'Chưa lưu được. Giữ trang này mở và sao chép bài viết trước khi rời đi.',
    changed: 'Tài khoản đã thay đổi. Mở lại sổ trước khi viết tiếp.', empty: 'Chưa có bài nào được lưu.',
    history: 'Xem các lần làm', revise: 'Sửa lại bài này', attempts: 'Các lần làm bài', notes: 'Ghi chép từ lá bài',
    submit: 'Chấm và lưu bài', required: 'Hãy lật tất cả lá bài, viết ít nhất 15 ký tự cho mỗi lá và 25 ký tự cho phần tổng hợp.',
    feedback: 'Phản hồi đã lưu', response: 'Lời đọc của bạn', synthesis: 'Phần tổng hợp', model: 'Bài đọc tham khảo',
    compare: 'So sánh hai lần làm', first: 'Lần trước', second: 'Lần sau', choose: 'Chọn hai lần làm khác nhau để so sánh.',
    different: 'Hai lần dùng ngôn ngữ hoặc tiêu chí khác nhau; không so sánh điểm trực tiếp.',
    improved: 'Tiêu chí không còn bị nhắc ở lần sau', remaining: 'Tiêu chí cần xem lại ở lần sau', none: 'Không có.',
    review: 'Ôn từ lần làm gần nhất', reviewHint: 'Gợi ý từ phản hồi gần nhất của từng bài, chỉ gồm bài bạn đang được mở.',
    retry: 'Luyện lại', export: 'Xuất bản sao JSON', remove: 'Xóa mục này', confirm: 'Xóa mục này khỏi sổ trên thiết bị? Không thể khôi phục nếu chưa xuất bản sao.',
    full: 'Sổ đã đầy (100 lần làm hoặc 100 ghi chép). Xuất bản sao rồi xóa bớt mục trước khi lưu thêm.',
    saveCard: 'Ghi vào sổ học', reflection: 'Điều bạn nhận ra từ lá bài', reflectionHint: 'Viết cách bạn hiểu lá bài và điều muốn ghi nhớ. Lời luận giải hiện tại vẫn giữ nguyên.',
    save: 'Lưu ghi chép', noteRequired: 'Viết ít nhất một dòng trước khi lưu.', fromDraw: 'Lá bài đã chọn',
    words: 'Ý nghĩa và từ khóa', position: 'Vai trò của vị trí', reversal: 'Nghĩa lá ngược', short: 'Diễn giải còn ngắn',
    date: 'Thời điểm quá cụ thể', bare: 'Câu trả lời thiếu giải thích', synth: 'Kết nối các lá và câu hỏi',
    draftRestored: 'Bản nháp đã được khôi phục.', originalLanguage: 'Đổi về ngôn ngữ của bài đã lưu để sửa; bản gốc được giữ nguyên.',
    newAttempt: 'Lần làm mới sẽ được lưu riêng, không ghi đè bài cũ.', result: 'Điểm', rubric: 'Tiêu chí',
    studyLink: 'Mở sổ học', dateLabel: 'Ngày rút', focusLabel: 'Chủ đề',
    exportHint: 'Bản sao chứa bài viết riêng tư của bạn. Bạn có thể chọn và sao chép toàn bộ văn bản bên dưới, hoặc lưu tệp.',
    exportFile: 'Lưu hoặc chia sẻ tệp JSON'
  },
  en: {
    title: 'Your study notebook', intro: 'Keep your interpretation, revise it and see what you have learned.',
    local: 'This notebook is stored only on this device, without sync. Signing out, deleting your account or clearing app data removes it. Export a copy first.',
    waiting: 'Resolving your account. Your notebook will open when it is ready.',
    offlineGuest: 'Sign-in could not load. You are using the guest notebook on this device; reconnect and reopen the app to access your account notebook.',
    rules: 'Automatic feedback checks keywords and card-position roles and may miss other valid wording. Scores do not measure the ability to predict the future.',
    saved: 'Saved on this device', draft: 'Draft saved', failed: 'Not saved. Keep this page open and copy your writing before leaving.',
    changed: 'Your account changed. Reopen the notebook before continuing.', empty: 'Nothing saved yet.',
    history: 'View attempts', revise: 'Revise this attempt', attempts: 'Practice attempts', notes: 'Card reflections',
    submit: 'Mark and save', required: 'Turn every card and write at least 15 characters per card and 25 for the combined response.',
    feedback: 'Saved feedback', response: 'Your interpretation', synthesis: 'Combined response', model: 'Reference interpretation',
    compare: 'Compare two attempts', first: 'Earlier attempt', second: 'Later attempt', choose: 'Choose two different attempts.',
    different: 'These attempts use different languages or criteria; do not compare their scores directly.',
    improved: 'Criteria no longer flagged in the later attempt', remaining: 'Criteria to revisit in the later attempt', none: 'None.',
    review: 'Review your latest work', reviewHint: 'Suggestions use the latest feedback for each exercise you currently have access to.',
    retry: 'Practise again', export: 'Export a JSON copy', remove: 'Delete this entry', confirm: 'Delete this entry from this device? It cannot be restored without an exported copy.',
    full: 'Notebook full (100 attempts or 100 reflections). Export a copy and remove some entries before saving more.',
    saveCard: 'Write in study notebook', reflection: 'What you noticed in this card', reflectionHint: 'Write your interpretation and what you want to remember. Your current reading stays unchanged.',
    save: 'Save reflection', noteRequired: 'Write a line before saving.', fromDraw: 'Selected card',
    words: 'Meanings and keywords', position: 'Card-position role', reversal: 'Reversed meaning', short: 'Interpretation too brief',
    date: 'Overly specific timing', bare: 'Answer needs explanation', synth: 'Connecting cards and question',
    draftRestored: 'Your draft has been restored.', originalLanguage: 'Switch to the saved attempt’s language to revise it; the original is kept.',
    newAttempt: 'A new attempt is saved separately without overwriting the original.', result: 'Score', rubric: 'Criteria',
    studyLink: 'Open study notebook', dateLabel: 'Draw date', focusLabel: 'Focus',
    exportHint: 'This copy contains your private writing. Select and copy all the text below, or save the file.',
    exportFile: 'Save or share JSON file'
  },
  de: {
    title: 'Dein Lernheft', intro: 'Bewahre deine Deutung auf, überarbeite sie und erkenne, was du gelernt hast.',
    local: 'Dieses Heft wird nur auf diesem Gerät gespeichert, ohne Synchronisierung. Abmelden, Kontolöschung oder Löschen der App-Daten entfernt es. Exportiere vorher eine Kopie.',
    waiting: 'Dein Konto wird geladen. Danach öffnet sich dein Lernheft.',
    offlineGuest: 'Die Anmeldung konnte nicht geladen werden. Du nutzt das Gästeheft auf diesem Gerät. Verbinde dich erneut und öffne die App wieder, um dein Kontoheft zu sehen.',
    rules: 'Das automatische Feedback prüft Stichworte und Kartenpositionen und kann andere passende Formulierungen übersehen. Die Punktzahl misst keine Fähigkeit, die Zukunft vorherzusagen.',
    saved: 'Auf diesem Gerät gespeichert', draft: 'Entwurf gespeichert', failed: 'Nicht gespeichert. Lass die Seite offen und kopiere deinen Text, bevor du sie verlässt.',
    changed: 'Dein Konto hat sich geändert. Öffne das Heft erneut.', empty: 'Noch keine Einträge.',
    history: 'Versuche ansehen', revise: 'Diesen Versuch überarbeiten', attempts: 'Übungsversuche', notes: 'Gedanken zu Karten',
    submit: 'Bewerten und speichern', required: 'Decke alle Karten auf. Schreibe mindestens 15 Zeichen pro Karte und 25 für die Zusammenfassung.',
    feedback: 'Gespeichertes Feedback', response: 'Deine Deutung', synthesis: 'Zusammenfassung', model: 'Beispieldeutung',
    compare: 'Zwei Versuche vergleichen', first: 'Früherer Versuch', second: 'Späterer Versuch', choose: 'Wähle zwei verschiedene Versuche.',
    different: 'Sprache oder Kriterien unterscheiden sich; vergleiche diese Punktzahlen nicht direkt.',
    improved: 'Im späteren Versuch nicht mehr beanstandete Kriterien', remaining: 'Im späteren Versuch noch zu üben', none: 'Keine.',
    review: 'Deine letzte Arbeit wiederholen', reviewHint: 'Vorschläge aus dem neuesten Feedback je Übung, auf die du aktuell Zugriff hast.',
    retry: 'Erneut üben', export: 'JSON-Kopie exportieren', remove: 'Eintrag löschen', confirm: 'Diesen Eintrag auf dem Gerät löschen? Ohne exportierte Kopie ist er nicht wiederherstellbar.',
    full: 'Das Heft ist voll (100 Versuche oder 100 Notizen). Exportiere eine Kopie und lösche einige Einträge, bevor du weitere speicherst.',
    saveCard: 'Ins Lernheft schreiben', reflection: 'Was dir bei dieser Karte aufgefallen ist', reflectionHint: 'Schreibe deine Deutung und was du dir merken möchtest. Deine aktuelle Legung bleibt unverändert.',
    save: 'Notiz speichern', noteRequired: 'Schreibe vor dem Speichern eine Zeile.', fromDraw: 'Gewählte Karte',
    words: 'Bedeutungen und Stichworte', position: 'Rolle der Kartenposition', reversal: 'Umgekehrte Bedeutung', short: 'Deutung zu kurz',
    date: 'Zu genaue Zeitangabe', bare: 'Antwort braucht eine Erklärung', synth: 'Karten und Frage verbinden',
    draftRestored: 'Dein Entwurf wurde wiederhergestellt.', originalLanguage: 'Wechsle zur Sprache des gespeicherten Versuchs, um ihn zu überarbeiten. Das Original bleibt erhalten.',
    newAttempt: 'Der neue Versuch wird separat gespeichert und überschreibt das Original nicht.', result: 'Punktzahl', rubric: 'Kriterien',
    studyLink: 'Lernheft öffnen', dateLabel: 'Datum der Ziehung', focusLabel: 'Thema',
    exportHint: 'Diese Kopie enthält deine privaten Texte. Wähle und kopiere den gesamten Text unten oder speichere die Datei.',
    exportFile: 'JSON-Datei speichern oder teilen'
  }
};
const studyT = () => STUDY_TEXT[lang] || STUDY_TEXT.en;
function studyOwner() {
  if (typeof WIPED !== 'undefined' && WIPED) return null;
  if (typeof BE !== 'undefined' && BE.enabled && !BE.ready) return BE.initFailed ? 'guest' : null;
  return typeof BE !== 'undefined' && BE.user ? 'user:' + BE.user.uid : 'guest';
}
const STUDY = {
  key(owner) { return 'nabu-study-v1:' + encodeURIComponent(owner); },
  read(owner) {
    const empty = () => ({ version: 1, attempts: [], reflections: [], drafts: {} });
    if (owner == null || owner !== studyOwner()) return empty();
    const b = store.get(this.key(owner), null);
    return b && b.version === 1 && Array.isArray(b.attempts) && Array.isArray(b.reflections)
      && b.drafts && typeof b.drafts === 'object' ? b : empty();
  },
  write(owner, b) {
    if (owner == null || owner !== studyOwner()) return 'changed';
    return store.set(this.key(owner), b) ? '' : 'failed';
  },
  draft(owner, key, value) {
    const b = this.read(owner); b.drafts[key] = value;
    return this.write(owner, b);
  },
  add(owner, type, entry, draftKey) {
    const b = this.read(owner);
    if (b[type].length >= 100) return 'full'; // never silently discard writing
    b[type].push(entry);
    delete b.drafts[draftKey];
    return this.write(owner, b);
  },
  remove(owner, type, id) {
    const b = this.read(owner); b[type] = b[type].filter((x) => x.id !== id);
    return this.write(owner, b);
  }
};
const studyId = () => Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
const studyDraftKey = (id) => 'exercise:' + id + ':' + lang;
const studyTextHTML = (text) => '<p class="study-writing">' + esc(text) + '</p>';
const studyDate = (at) => new Date(at).toLocaleString({ vi: 'vi-VN', en: 'en-GB', de: 'de-DE' }[lang] || 'en-GB');
const studyCanRead = (a) => { const ex = practiceById(a.exercise); return !!ex && (ex.free || ACCESS.has(ex.course)); };
const studyNeeds = (r) => Array.from(new Set(r.notes.map((n) => ({
  thin: 'short', frame: 'position', reversal: 'reversal', missed: 'words',
  date: 'date', bare: 'bare', synth: 'synth'
})[n.kind]).filter(Boolean).concat(r.perCard.some((c) => c.score < 1) ? ['words'] : [])));
function studyAttempt(ex, sp, answers, synth, r) {
  return { id: studyId(), exercise: ex.id, at: Date.now(), lang, rubric: STUDY_RUBRIC,
    title: sp.name, question: L(ex.q), answers, synth, pct: r.pct, needs: studyNeeds(r),
    cards: r.perCard.map((c, i) => ({ name: c.card.name, reversed: c.rev,
      position: sp.pos && sp.pos[i] ? sp.pos[i][0] : String(i + 1),
      got: c.got, missed: c.missed })),
    feedback: r.notes.map(practiceNoteText), model: L(ex.model) };
}
function studyStatus(el, error, success) {
  if (!el) return;
  el.textContent = studyT()[error || success || 'saved'];
  el.className = 'hint' + (error ? ' err' : '');
}
function studyLinkHTML() {
  return '<a class="btn block" href="#/study">' + esc(studyT().studyLink) + ' →</a>';
}
function studyOfflineHTML() {
  return typeof BE !== 'undefined' && BE.enabled && !BE.ready && BE.initFailed
    ? '<p class="hint">' + esc(studyT().offlineGuest) + '</p>' : '';
}
function studyAttemptHTML(a, controls) {
  const S = studyT();
  return '<article class="card study-entry"><h3>' + esc(a.title) + '</h3>'
    + '<p class="faint">' + esc(studyDate(a.at)) + ' · ' + esc(a.lang.toUpperCase()) + ' · ' + esc(S.result) + ': ' + a.pct + '%</p>'
    + studyTextHTML(a.question)
    + a.cards.map((c, i) => '<h4>' + esc(c.position) + ' · ' + esc(c.name) + (c.reversed ? ' ↶' : '') + '</h4>'
      + studyTextHTML(a.answers[i]) + '<p class="hint">' + esc(T().practiceGot) + ' ' + esc(c.got.join(', ') || '—')
      + '<br>' + esc(T().practiceMissed) + ' ' + esc(c.missed.join(', ') || '—') + '</p>').join('')
    + '<h4>' + esc(S.synthesis) + '</h4>' + studyTextHTML(a.synth)
    + '<h4>' + esc(S.feedback) + '</h4>' + (a.feedback.length
      ? '<ul>' + a.feedback.map((n) => '<li>' + esc(n) + '</li>').join('') + '</ul>' : '<p>' + esc(S.none) + '</p>')
    + '<details><summary>' + esc(S.model) + '</summary>' + studyTextHTML(a.model) + '</details>'
    + (controls ? '<div class="row"><a class="btn" href="#/practice/' + encodeURIComponent(a.exercise) + '?revise=' + encodeURIComponent(a.id) + '">' + esc(S.revise) + '</a>'
      + '<button class="btn" data-study-delete="' + esc(a.id) + '" data-study-type="attempts">' + esc(S.remove) + '</button></div>' : '')
    + '</article>';
}
function studySuggestions(book) {
  const latest = {};
  book.attempts.forEach((a) => { latest[a.exercise] = a; });
  return Object.values(latest).filter((a) => studyCanRead(a) && a.needs.length).sort((a, b) => b.at - a.at).slice(0, 3);
}
async function renderStudy(args, params) {
  const m = $('#main'), S = studyT(), owner = studyOwner(), hash = location.hash;
  if (owner == null) { m.innerHTML = '<p role="status">' + esc(S.waiting) + '</p>'; return; }
  if (args[0] === 'card') { renderStudyCard(params); return; }
  const ready = await practiceReady();
  if (location.hash !== hash || studyOwner() !== owner) return;
  if (!ready) { m.innerHTML = backLink('#/learn', T().learnTitle) + '<p>' + esc(T().practiceOffline) + '</p>'; return; }
  const book = STUDY.read(owner);
  const exercise = args[0] === 'exercise' ? practiceById(args[1]) : null;
  if (args[0] === 'exercise' && !exercise) { redirect('#/study'); return; }
  if (exercise && !exercise.free && gate(exercise.course, '#/study')) return;
  const attempts = book.attempts.filter((a) => studyCanRead(a) && (!exercise || a.exercise === exercise.id));
  const suggestions = exercise ? [] : studySuggestions(book);
  m.innerHTML = backLink(exercise ? '#/study' : '#/practice', S.title)
    + '<h1>' + esc(S.title) + '</h1><p>' + esc(S.intro) + '</p>' + studyOfflineHTML() + '<p class="hint">' + esc(S.local) + '</p>'
    + '<p class="hint">' + esc(S.rules) + '</p><button class="btn" id="study-export">' + esc(S.export) + '</button>'
    + '<p id="study-status" role="status" aria-live="polite"></p><div id="study-export-panel"></div>'
    + (suggestions.length ? '<section class="card"><h2>' + esc(S.review) + '</h2><p class="hint">' + esc(S.reviewHint) + '</p>'
      + suggestions.map((a) => '<p><a href="#/practice/' + a.exercise + '?revise=' + a.id + '">' + esc(a.title) + ' — ' + esc(S.retry) + '</a><br>'
        + esc(a.needs.map((k) => S[k]).join(' · ')) + '</p>').join('') + '</section>' : '')
    + (exercise && attempts.length > 1 ? '<section class="card"><h2>' + esc(S.compare) + '</h2>'
      + '<div class="study-compare"><label>' + esc(S.first) + '<select id="study-first"></select></label><label>' + esc(S.second)
      + '<select id="study-second"></select></label></div><div id="study-comparison"></div></section>' : '')
    + '<h2>' + esc(S.attempts) + '</h2>'
    + (attempts.length ? (exercise ? attempts.slice().reverse().map((a) => studyAttemptHTML(a, true)).join('')
      : Array.from(new Set(attempts.map((a) => a.exercise))).map((id) => {
        const list = attempts.filter((a) => a.exercise === id), a = list[list.length - 1];
        return '<a class="prow" href="#/study/exercise/' + id + '"><span>' + esc(a.title) + '<br><small>' + esc(a.question)
          + '</small></span><span>' + list.length + ' · ' + a.pct + '%</span></a>';
      }).join('')) : '<p>' + esc(S.empty) + '</p>')
    + (exercise ? '' : '<h2>' + esc(S.notes) + '</h2>' + (book.reflections.length ? book.reflections.slice().reverse().map((a) =>
      '<article class="card"><h3>' + esc(a.name) + '</h3><p class="hint">' + esc(a.date) + ' · ' + esc(a.focusLabel) + '</p>'
      + studyTextHTML(a.text) + '<button class="btn" data-study-delete="' + esc(a.id) + '" data-study-type="reflections">' + esc(S.remove) + '</button></article>').join('') : '<p>' + esc(S.empty) + '</p>'));
  $('#study-export').onclick = () => {
    if (studyOwner() !== owner) { studyStatus($('#study-status'), 'changed'); return; }
    const text = JSON.stringify(STUDY.read(owner), null, 2);
    const panel = $('#study-export-panel');
    panel.innerHTML = '<label for="study-export-text">' + esc(S.exportHint) + '</label>'
      + '<textarea id="study-export-text" readonly rows="8"></textarea><button class="btn" id="study-export-file">' + esc(S.exportFile) + '</button>';
    $('#study-export-text').value = text;
    $('#study-export-file').onclick = async () => {
      if (studyOwner() !== owner) { route(); return; }
      const name = 'nabu-study-' + isoDate(new Date()) + '.json';
      const shared = await shareFile(text, name, 'application/json');
      if (shared !== false || studyOwner() !== owner || location.hash !== hash) return;
      // The text remains selectable even in WebViews without file downloads.
      if (inStoreApp()) { $('#study-export-text').focus(); $('#study-export-text').select(); return; }
      const url = URL.createObjectURL(new Blob([text], { type: 'application/json' })), a = document.createElement('a');
      a.href = url; a.download = name; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 30000);
    };
  };
  $$('[data-study-delete]', m).forEach((b) => { b.onclick = () => {
    if (studyOwner() !== owner) { studyStatus($('#study-status'), 'changed'); return; }
    if (!confirm(S.confirm)) return;
    const error = STUDY.remove(owner, b.dataset.studyType, b.dataset.studyDelete);
    if (error) studyStatus($('#study-status'), error); else renderStudy(args, params);
  }; });
  if (exercise && attempts.length > 1) {
    const options = attempts.map((a, i) => '<option value="' + a.id + '">' + (i + 1) + ' · ' + esc(studyDate(a.at)) + ' · ' + a.pct + '% · ' + esc(a.lang) + '</option>').join('');
    $('#study-first').innerHTML = $('#study-second').innerHTML = options;
    $('#study-first').value = attempts[attempts.length - 2].id;
    $('#study-second').value = attempts[attempts.length - 1].id;
    const compare = () => {
      if (studyOwner() !== owner) { route(); return; }
      const a = attempts.find((x) => x.id === $('#study-first').value), b = attempts.find((x) => x.id === $('#study-second').value);
      const el = $('#study-comparison');
      if (a.id === b.id) { el.innerHTML = '<p>' + esc(S.choose) + '</p>'; return; }
      const pair = [a, b].sort((x, y) => x.at - y.at), old = pair[0], next = pair[1];
      const list = (ks) => esc(ks.map((k) => S[k]).join(' · ') || S.none);
      el.innerHTML = (old.lang !== next.lang || old.rubric !== next.rubric ? '<p>' + esc(S.different) + '</p>'
        : '<p><b>' + esc(S.result) + ': ' + old.pct + '% → ' + next.pct + '%</b></p><p>' + esc(S.improved) + ': '
          + list(old.needs.filter((k) => !next.needs.includes(k))) + '</p><p>' + esc(S.remaining) + ': ' + list(next.needs) + '</p>')
        + '<div class="study-compare">' + pair.map((x) => studyAttemptHTML(x, false)).join('') + '</div>';
    };
    $('#study-first').onchange = $('#study-second').onchange = compare; compare();
  }
}
function renderStudyCard(params) {
  const S = studyT(), owner = studyOwner(), m = $('#main'), card = cardById(params.card);
  if (!card) { redirect('#/study'); return; }
  const date = /^\d{4}-\d{2}-\d{2}$/.test(params.date || '') ? params.date : isoDate(new Date());
  const focus = T().focus[params.focus] ? params.focus : 'general';
  const key = 'card:' + date + ':' + card.id + ':' + focus + ':' + lang;
  const draft = STUDY.read(owner).drafts[key];
  m.innerHTML = backLink('#/study', S.title) + '<h1>' + esc(S.saveCard) + '</h1><h2>' + esc(card.name) + '</h2>'
    + '<p>' + esc(S.dateLabel) + ': ' + esc(date) + ' · ' + esc(T().focus[focus]) + '</p>'
    + studyOfflineHTML() + '<p class="hint">' + esc(S.local) + '</p><label for="study-reflection">' + esc(S.reflection) + '</label>'
    + '<p class="hint">' + esc(S.reflectionHint) + '</p><textarea id="study-reflection" rows="7" maxlength="4000"></textarea>'
    + '<p id="study-status" role="status" aria-live="polite"></p><button id="study-save-note" class="btn primary block">' + esc(S.save) + '</button>';
  const input = $('#study-reflection'), status = $('#study-status');
  input.value = draft && draft.text || '';
  input.oninput = () => studyStatus(status, STUDY.draft(owner, key, { text: input.value }), 'draft');
  $('#study-save-note').onclick = () => {
    if (!input.value.trim()) { studyStatus(status, 'noteRequired'); return; }
    const error = STUDY.add(owner, 'reflections', { id: studyId(), at: Date.now(), lang, card: card.id,
      name: card.name, date, focus, focusLabel: T().focus[focus], text: input.value }, key);
    if (error) studyStatus(status, error); else { toast(S.saved); redirect('#/study'); }
  };
}
ROUTES.study = { nav: 'learn', render: renderStudy };
