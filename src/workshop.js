/* Loaded only for practice/notebook/workshop. No server or AI judges a
   learner's reasoning here: automatic signals and self-review stay separate. */
const WORKSHOP_TEXT = {
  vi: {
    title: 'Lộ trình luyện đọc', intro: 'Tình huống → lời đọc và lý do → đối chiếu → sửa → luyện tiếp.',
    note: 'Đây là hồ sơ luyện tập, không phải chứng nhận năng lực. Phản hồi tự động chỉ gợi ý điều cần xem lại; phần tự đối chiếu do bạn đánh giá.',
    start: 'Bắt đầu một tình huống', all: 'Tất cả bài luyện', reason: 'Vì sao bạn đọc như vậy?',
    reasonHint: 'Nêu một chi tiết hoặc ý nghĩa của lá bài, nối nó với vị trí và câu hỏi. Có cách hiểu khác nào cũng phù hợp?',
    optional: 'Ghi lý do (không bắt buộc)', review: 'Tự đối chiếu và lập kế hoạch sửa',
    role: 'Vị trí này hỏi', observed: 'Điều máy dò được', revise: 'Điều bạn sẽ sửa',
    reviewIntro: 'Đọc lại bài của mình cùng bài tham khảo. Chỉ đánh dấu khi bạn có thể chỉ ra bằng chứng trong lời đọc; không cần viết giống đáp án.',
    checks: ['Tôi nối ý nghĩa lá bài với chi tiết của tình huống.', 'Tôi trả lời đúng vai trò từng vị trí.', 'Tôi giải thích cách các lá nối với câu hỏi, thay vì liệt kê.', 'Tôi nêu giới hạn hoặc một cách hiểu khác.'],
    saveReview: 'Lưu phần tự đối chiếu', reviewRequired: 'Viết điều bạn sẽ sửa hoặc lý do giữ cách đọc hiện tại.',
    self: 'Tự đối chiếu của bạn', reviewed: 'Bài đã tự đối chiếu', recorded: 'Bài đã làm', next: 'Bài luyện tiếp theo',
    nextHint: 'Bài phù hợp với kỹ năng bạn chọn và khóa học của bạn. Ưu tiên bài chưa thử, rồi đến bài đã lâu chưa luyện.',
    noNext: 'Chưa có bài khác phù hợp đang mở. Bạn có thể sửa lại bài vừa làm.',
    skills: ['Ý nghĩa và dẫn chứng', 'Vai trò từng vị trí', 'Lá ngược', 'Kết nối thành lời đọc', 'Giới hạn diễn giải'],
    lessons: 'Đọc lại bài học', attempt: 'Làm bài', mentor: 'Chuẩn bị câu hỏi cho Nabu',
    mentorIntro: 'Chọn phần cần nhận xét. Bạn xem và sửa bản nháp trước khi mở tin nhắn. Nội dung chưa được gửi. Đây là yêu cầu trao đổi, không cam kết thời gian trả lời hay dịch vụ chấm bài miễn phí.',
    mentorConsent: 'Tôi muốn đưa nội dung này vào bản nháp tin nhắn riêng với Nabu.',
    compose: 'Mở bản nháp tin nhắn', consentRequired: 'Hãy xác nhận nội dung bạn muốn chia sẻ.',
    login: 'Đăng nhập để mở tin nhắn. Sao chép bản nháp trước nếu cần.', tooLong: 'Rút gọn bản nháp xuống dưới 3.900 ký tự.',
    mentorQuestion: 'Nhờ Nabu nhận xét cách đọc và lý do của mình:',
    restore: 'Khôi phục từ bản sao', restoreIntro: 'Dán JSON đã xuất từ sổ học. Chỉ nhập tệp của bạn. Bản sao có thể chứa thông tin riêng tư. Nội dung được thêm vào sổ hiện tại; mục trùng hệt được bỏ qua, bài đang có không bị xóa.',
    importText: 'Nội dung bản sao JSON', importDo: 'Kiểm tra và khôi phục', invalid: 'Bản sao không đúng định dạng hoặc vượt giới hạn. Sổ hiện tại chưa thay đổi.',
    imported: 'Đã khôi phục trên thiết bị. Các mục trùng hệt được bỏ qua.', capacity: 'Nhập bản sao sẽ vượt 100 lần làm hoặc 100 ghi chép. Xuất và xóa bớt mục trước.',
    evidence: 'Lý do đã ghi', book: 'Sổ học', missing: 'Chưa ghi lý do cho lá này.', open: 'Mở bài đã làm',
    focus: 'Chọn kỹ năng để luyện', seen: 'bài đã luyện', flagged: 'cần ôn theo máy',
    empty: 'Chưa có dữ liệu. Bắt đầu một bài mẫu miễn phí bên dưới.',
    modelHint: 'Bài tham khảo là một cách diễn giải, không phải lời tiên đoán đã được kiểm chứng.',
    roles: {
      state: 'Mô tả điều đang diễn ra. Thử đổi một câu “hãy làm…” thành “hiện tại…”, rồi kiểm tra xem có đúng câu hỏi không.',
      advice: 'Nêu một hành động có thể thực hiện và lý do lá bài gợi ý hành động đó. Phân biệt lời khuyên với lời khẳng định điều chắc chắn sẽ xảy ra.',
      outcome: 'Nối kết quả với điều kiện hoặc hành động trong tình huống. Chỉ rõ điều gì có thể làm cách diễn giải thay đổi.'
    }
  },
  en: {
    title: 'Reading workshop', intro: 'Scenario → interpretation and reasoning → self-review → revision → next exercise.',
    note: 'This records practice, not certified ability. Automatic feedback only suggests what to revisit; you assess your own reasoning separately.',
    start: 'Start a scenario', all: 'All exercises', reason: 'Why did you read it this way?',
    reasonHint: 'Name a detail or meaning in the card and connect it to the position and question. Could another interpretation also fit?',
    optional: 'Record your reasoning (optional)', review: 'Self-review and revision plan',
    role: 'This position asks', observed: 'What the checker noticed', revise: 'What you will revise',
    reviewIntro: 'Read your response beside the reference. Check a criterion only when you can point to evidence in your writing; your wording need not match the reference.',
    checks: ['I connect a card meaning to a detail in the scenario.', 'I answer the role of each position.', 'I connect the cards to the question instead of listing meanings.', 'I state a limitation or an alternative interpretation.'],
    saveReview: 'Save self-review', reviewRequired: 'Write what you will revise, or why you stand by your current reading.',
    self: 'Your self-review', reviewed: 'Exercises self-reviewed', recorded: 'Exercises attempted', next: 'Next exercise',
    nextHint: 'Exercises match your chosen skill and courses. Try an unseen exercise first, then revisit the one you last practised longest ago.',
    noNext: 'No other matching exercise is currently available. You can revise the current one.',
    skills: ['Meaning and evidence', 'Position roles', 'Reversals', 'Connecting the reading', 'Limits of interpretation'],
    lessons: 'Revisit the lesson', attempt: 'Practise', mentor: 'Prepare a question for Nabu',
    mentorIntro: 'Choose what you want feedback on. Review and edit this draft before opening messages. Nothing has been sent. This is a request to discuss your work, not a promise of a response time or free marking.',
    mentorConsent: 'I want to include this content in a private message draft to Nabu.',
    compose: 'Open message draft', consentRequired: 'Confirm the content you want to share.',
    login: 'Sign in to open messages. Copy the draft first if needed.', tooLong: 'Shorten the draft to fewer than 3,900 characters.',
    mentorQuestion: 'Could Nabu comment on my interpretation and reasoning?',
    restore: 'Restore a backup', restoreIntro: 'Paste JSON exported from the notebook. Import only your own file; it may contain private writing. Entries are added to this notebook, exact duplicates are skipped and existing writing is not deleted.',
    importText: 'Backup JSON', importDo: 'Validate and restore', invalid: 'Invalid or oversized backup. Your existing notebook has not changed.',
    imported: 'Restored on this device. Exact duplicates were skipped.', capacity: 'Import would exceed 100 attempts or 100 reflections. Export and remove some entries first.',
    evidence: 'Recorded reasoning', book: 'Study notebook', missing: 'No reasoning recorded for this card.', open: 'Open saved exercise',
    focus: 'Choose a skill to practise', seen: 'exercises tried', flagged: 'automatic review hints',
    empty: 'No practice recorded yet. Start with a free sample below.',
    modelHint: 'The reference is one interpretation, not a verified prediction.',
    roles: {
      state: 'Describe what is happening. Try changing a sentence beginning “you should…” into “currently…”, then check whether it answers the question.',
      advice: 'Name a practical action and explain why the card suggests it. Distinguish a recommendation from a claim about what will definitely happen.',
      outcome: 'Connect the outcome to a condition or action in the scenario. Explain what might change your interpretation.'
    }
  },
  de: {
    title: 'Deutungswerkstatt', intro: 'Situation → Deutung und Begründung → Selbstprüfung → Überarbeitung → nächste Übung.',
    note: 'Hier wird Übung dokumentiert, keine Fähigkeit zertifiziert. Automatisches Feedback gibt Hinweise; deine Begründung beurteilst du separat selbst.',
    start: 'Mit einer Situation beginnen', all: 'Alle Übungen', reason: 'Warum deutest du es so?',
    reasonHint: 'Nenne ein Detail oder eine Bedeutung der Karte und verbinde es mit Position und Frage. Könnte auch eine andere Deutung passen?',
    optional: 'Begründung notieren (optional)', review: 'Selbstprüfung und Überarbeitungsplan',
    role: 'Diese Position fragt', observed: 'Was die automatische Prüfung bemerkt hat', revise: 'Was du überarbeiten möchtest',
    reviewIntro: 'Lies deinen Text neben der Beispieldeutung. Markiere ein Kriterium nur, wenn du einen Beleg in deinem Text findest. Deine Formulierung muss nicht der Vorlage entsprechen.',
    checks: ['Ich verbinde eine Kartenbedeutung mit einem Detail der Situation.', 'Ich beantworte die Rolle jeder Position.', 'Ich verbinde die Karten mit der Frage, statt Bedeutungen aufzulisten.', 'Ich nenne eine Grenze oder eine alternative Deutung.'],
    saveReview: 'Selbstprüfung speichern', reviewRequired: 'Schreibe, was du ändern möchtest oder warum du bei deiner Deutung bleibst.',
    self: 'Deine Selbstprüfung', reviewed: 'Selbst geprüfte Übungen', recorded: 'Bearbeitete Übungen', next: 'Nächste Übung',
    nextHint: 'Übungen passend zu deinem Lernziel und deinen Kursen. Neue Übungen kommen zuerst, danach die am längsten nicht geübten.',
    noNext: 'Keine weitere passende Übung ist derzeit freigeschaltet. Du kannst die aktuelle überarbeiten.',
    skills: ['Bedeutung und Belege', 'Rollen der Positionen', 'Umgekehrte Karten', 'Zusammenhängende Deutung', 'Grenzen der Deutung'],
    lessons: 'Lektion nachlesen', attempt: 'Üben', mentor: 'Frage an Nabu vorbereiten',
    mentorIntro: 'Wähle aus, wozu du Feedback möchtest. Prüfe und bearbeite den Entwurf, bevor du die Nachrichten öffnest. Noch wurde nichts gesendet. Dies ist eine Gesprächsanfrage, keine Zusage für Antwortzeit oder kostenlose Bewertung.',
    mentorConsent: 'Ich möchte diesen Inhalt in einen privaten Nachrichtenentwurf an Nabu übernehmen.',
    compose: 'Nachrichtenentwurf öffnen', consentRequired: 'Bestätige den Inhalt, den du teilen möchtest.',
    login: 'Melde dich an, um Nachrichten zu öffnen. Kopiere bei Bedarf vorher den Entwurf.', tooLong: 'Kürze den Entwurf auf weniger als 3.900 Zeichen.',
    mentorQuestion: 'Kann Nabu meine Deutung und Begründung kommentieren?',
    restore: 'Sicherung wiederherstellen', restoreIntro: 'Füge aus dem Lernheft exportiertes JSON ein. Importiere nur deine eigene Datei; sie kann private Texte enthalten. Einträge werden ergänzt, identische Duplikate übersprungen und vorhandene Texte nicht gelöscht.',
    importText: 'JSON-Sicherung', importDo: 'Prüfen und wiederherstellen', invalid: 'Ungültige oder zu große Sicherung. Dein vorhandenes Heft bleibt unverändert.',
    imported: 'Auf diesem Gerät wiederhergestellt. Identische Duplikate wurden übersprungen.', capacity: 'Der Import würde 100 Versuche oder 100 Notizen überschreiten. Exportiere und entferne vorher einige Einträge.',
    evidence: 'Gespeicherte Begründung', book: 'Lernheft', missing: 'Noch keine Begründung für diese Karte.', open: 'Gespeicherte Übung öffnen',
    focus: 'Lernziel auswählen', seen: 'Übungen bearbeitet', flagged: 'automatische Hinweise',
    empty: 'Noch keine Übung gespeichert. Beginne unten mit einem kostenlosen Beispiel.',
    modelHint: 'Die Beispieldeutung ist eine mögliche Interpretation, keine überprüfte Vorhersage.',
    roles: {
      state: 'Beschreibe, was gerade geschieht. Ändere probeweise „du solltest…“ zu „momentan…“ und prüfe, ob der Satz die Frage beantwortet.',
      advice: 'Nenne eine umsetzbare Handlung und begründe sie mit der Karte. Unterscheide einen Rat von der Behauptung, etwas werde sicher geschehen.',
      outcome: 'Verbinde das Ergebnis mit einer Bedingung oder Handlung in der Situation. Erkläre, was deine Deutung ändern könnte.'
    }
  }
};
const WS_SKILLS = ['words', 'position', 'reversal', 'synth', 'limits'];
const workshopT = () => WORKSHOP_TEXT[lang] || WORKSHOP_TEXT.en;
function workshopReasonHTML(ex, sp, i) {
  const S = workshopT();
  return '<details class="ws-reason"><summary>' + esc(S.optional) + '</summary><label for="reason-' + i + '">' + esc(S.reason)
    + '</label><p class="hint">' + esc(S.reasonHint) + '</p><textarea id="reason-' + i + '" data-reason="' + i + '" rows="3" maxlength="1500"></textarea></details>';
}
function workshopSavedHTML(a) {
  const S = workshopT();
  return (Array.isArray(a.reasoning) && a.reasoning.some(Boolean) ? '<details><summary>' + esc(S.evidence) + '</summary>'
    + a.reasoning.map((r, i) => '<h4>' + esc((a.cards[i] || {}).name || '') + '</h4>' + studyTextHTML(r || S.missing)).join('') + '</details>' : '')
    + (a.selfReview ? '<details><summary>' + esc(S.self) + '</summary><p>' + esc(studyDate(a.selfReview.at)) + '</p>'
      + '<ul>' + S.checks.map((s, i) => '<li>' + (a.selfReview.checks[i] ? '✓ ' : '○ ') + esc(s) + '</li>').join('')
      + '</ul>' + studyTextHTML(a.selfReview.plan) + '</details>' : '');
}
function workshopFeedbackHTML(ex, sp, result, id) {
  const S = workshopT();
  return '<section class="card ws-feedback"><h2>' + esc(S.review) + '</h2><p>' + esc(S.reviewIntro) + '</p><p class="hint">' + esc(S.note) + '</p>'
    + result.perCard.map((c, i) => '<details><summary>' + esc(c.card.name) + ' · ' + esc((sp.pos[i] || [String(i + 1)])[0]) + '</summary>'
      + '<p><b>' + esc(S.role) + ':</b> ' + esc((sp.pos[i] || ['', ''])[1]) + '</p>'
      + '<p>' + esc(S.roles[ex.frames[i]] || S.reasonHint) + '</p>'
      + '<p><b>' + esc(S.observed) + ':</b> ' + esc(T().practiceGot) + ' ' + esc(c.got.join(', ') || '—')
      + '<br>' + esc(T().practiceMissed) + ' ' + esc(c.missed.join(', ') || '—') + '</p></details>').join('')
    + '<p class="hint">' + esc(S.modelHint) + '</p><a class="btn primary block" href="#/workshop/review/' + encodeURIComponent(id) + '">' + esc(S.review) + ' →</a></section>';
}
function workshopHasSkill(ex, skill) {
  if (skill === 'reversal') return ex.rev.some(Boolean);
  if (skill === 'synth') return ex.cards.length > 1;
  if (skill === 'limits') return ex.traps.length > 0 || ex.frames.includes('outcome');
  return true;
}
function workshopLatest(book) {
  const map = new Map();
  book.attempts.filter(studyCanRead).forEach((a) => { if (!map.has(a.exercise) || map.get(a.exercise).at < a.at) map.set(a.exercise, a); });
  return [...map.values()];
}
function workshopNext(book, skill, exclude) {
  const latest = workshopLatest(book), tried = new Map(latest.map((a) => [a.exercise, a.at]));
  return PRACTICE.filter((ex) => ex.id !== exclude && (ex.free || ACCESS.has(ex.course)) && workshopHasSkill(ex, skill))
    .sort((a, b) => (tried.get(a.id) || 0) - (tried.get(b.id) || 0)).slice(0, 3);
}
function workshopNextHTML(book, skill, exclude) {
  const S = workshopT(), list = workshopNext(book, skill, exclude);
  return '<h2>' + esc(S.next) + '</h2><p class="hint">' + esc(S.nextHint) + '</p>'
    + (list.length ? list.map((ex) => '<a class="prow" href="#/practice/' + ex.id + '"><span><b>' + esc(pSpread(ex).name)
      + '</b><br>' + esc(L(ex.q)) + '</span><span>→</span></a>').join('') : '<p>' + esc(S.noNext) + '</p>');
}
async function renderWorkshop(args, params) {
  const owner = studyOwner(), hash = location.hash, S = workshopT(), m = $('#main');
  if (owner == null) { m.innerHTML = '<p role="status">' + esc(studyT().waiting) + '</p>'; return; }
  if (!(await practiceReady())) { if (hash === location.hash) m.innerHTML = '<p>' + esc(T().practiceOffline) + '</p>'; return; }
  if (hash !== location.hash || owner !== studyOwner()) return;
  const book = STUDY.read(owner);
  if (args[0] === 'import') { workshopImportScreen(owner); return; }
  if (args[0] === 'review' || args[0] === 'mentor') {
    const a = book.attempts.find((x) => x.id === args[1]);
    if (!a || !practiceById(a.exercise)) { redirect('#/study'); return; }
    const ex = practiceById(a.exercise);
    if (!ex.free && gate(ex.course, '#/study')) return;
    if (args[0] === 'mentor') workshopMentorScreen(owner, a);
    else workshopReviewScreen(owner, a);
    return;
  }
  const skill = WS_SKILLS.includes(params.skill) ? params.skill : 'words', latest = workshopLatest(book);
  m.innerHTML = backLink('#/learn', T().learnTitle) + '<h1>' + esc(S.title) + '</h1><p class="lead">' + esc(S.intro) + '</p>'
    + studyOfflineHTML() + '<p class="hint">' + esc(S.note) + '</p>'
    + '<div class="ws-totals"><p><b>' + latest.length + '</b> ' + esc(S.recorded) + '</p><p><b>' + latest.filter((a) => a.selfReview).length
    + '</b> ' + esc(S.reviewed) + '</p></div>'
    + '<p><a class="btn" href="#/study">' + esc(S.book) + '</a> <a class="btn" href="#/practice">' + esc(S.all) + '</a></p>'
    + '<h2>' + esc(S.focus) + '</h2><div class="ws-skills">'
    + WS_SKILLS.map((k, i) => {
      const relevant = latest.filter((a) => workshopHasSkill(practiceById(a.exercise), k));
      const flagged = relevant.filter((a) => k === 'limits' ? a.needs.some((n) => ['date', 'bare'].includes(n)) : a.needs.includes(k)).length;
      return '<a class="card ws-skill' + (k === skill ? ' selected' : '') + '" href="#/workshop?skill=' + k + '"'
        + (k === skill ? ' aria-current="true"' : '') + '><b>' + esc(S.skills[i]) + '</b><p class="hint">' + relevant.length + ' ' + esc(S.seen)
        + ' · ' + flagged + ' ' + esc(S.flagged) + '</p></a>';
    }).join('') + '</div>' + (!latest.length ? '<p>' + esc(S.empty) + '</p>' : '')
    + workshopNextHTML(book, skill)
    + '<h2>' + esc(S.lessons) + '</h2>' + ['tarot', 'lenormand', 'playing'].map((course) => '<a class="btn" href="#/learn/'
      + course + '">' + esc(T().cats[course]) + '</a> ').join('');
}
function workshopReviewScreen(owner, a) {
  const S = workshopT(), key = 'self-review:' + a.id;
  const saved = STUDY.read(owner).drafts[key] || a.selfReview || { checks: [], plan: '' };
  $('#main').innerHTML = backLink('#/study/exercise/' + a.exercise, S.book) + '<h1>' + esc(S.review) + '</h1><p>' + esc(S.reviewIntro) + '</p>'
    + studyAttemptHTML(a, false) + '<form id="ws-review"><fieldset><legend>' + esc(S.self) + '</legend>'
    + S.checks.map((s, i) => '<label class="ws-check"><input type="checkbox" data-ws-check="' + i + '"> <span>' + esc(s) + '</span></label>').join('')
    + '</fieldset><label for="ws-plan">' + esc(S.revise) + '</label><textarea id="ws-plan" rows="4" maxlength="2000"></textarea>'
    + '<p role="status" id="ws-status"></p><button class="btn primary" type="submit">' + esc(S.saveReview) + '</button></form>'
    + '<p><a class="btn" href="#/practice/' + a.exercise + '?revise=' + encodeURIComponent(a.id) + '">' + esc(studyT().revise) + '</a></p>'
    + workshopNextHTML(STUDY.read(owner), a.needs.find((k) => WS_SKILLS.includes(k)) || 'synth', a.exercise);
  $('#ws-plan').value = saved.plan || '';
  $$('[data-ws-check]').forEach((el, i) => { el.checked = !!saved.checks[i]; });
  const values = () => ({ checks: $$('[data-ws-check]').map((el) => el.checked), plan: $('#ws-plan').value, at: Date.now() });
  $('#ws-review').oninput = () => studyStatus($('#ws-status'), STUDY.draft(owner, key, values()), 'draft');
  $('#ws-review').onsubmit = (event) => {
    event.preventDefault();
    const value = values(), b = STUDY.read(owner);
    if (!value.plan.trim()) { $('#ws-status').textContent = S.reviewRequired; return; }
    const target = b.attempts.find((x) => x.id === a.id);
    if (!target || owner !== studyOwner()) { studyStatus($('#ws-status'), 'changed'); return; }
    target.selfReview = value; delete b.drafts[key];
    studyStatus($('#ws-status'), STUDY.write(owner, b));
  };
}
function workshopMentorScreen(owner, a) {
  const S = workshopT();
  $('#main').innerHTML = backLink('#/study/exercise/' + a.exercise, S.book) + '<h1>' + esc(S.mentor) + '</h1><p>' + esc(S.mentorIntro) + '</p>'
    + '<label for="ws-message">' + esc(S.mentorQuestion) + '</label><textarea id="ws-message" rows="12"></textarea>'
    + '<label class="ws-check"><input type="checkbox" id="ws-consent"><span>' + esc(S.mentorConsent) + '</span></label>'
    + '<p role="status" id="ws-status"></p><button id="ws-compose" class="btn primary">' + esc(S.compose) + '</button>';
  $('#ws-message').value = S.mentorQuestion + '\n' + a.title + '\n' + a.question + '\n\n'
    + a.cards.map((c, i) => c.position + ' · ' + c.name + '\n' + a.answers[i] + ((a.reasoning || [])[i] ? '\n' + S.evidence + ': ' + a.reasoning[i] : '')).join('\n\n')
    + '\n\n' + a.synth + (a.selfReview ? '\n\n' + S.revise + ': ' + a.selfReview.plan : '');
  $('#ws-compose').onclick = () => {
    const text = $('#ws-message').value.trim(), status = $('#ws-status');
    if (owner !== studyOwner()) { studyStatus(status, 'changed'); return; }
    if (!BE.user) { status.textContent = S.login; return; }
    if (!$('#ws-consent').checked) { status.textContent = S.consentRequired; return; }
    if (!text || text.length >= 3900) { status.textContent = S.tooLong; return; }
    try { sessionStorage.setItem('nabu-mentor-draft', JSON.stringify({ owner, text })); }
    catch (e) { studyStatus(status, 'failed'); return; }
    redirect('#/me?tab=talk');
  };
}
/* Normalize every imported field. Never spread untrusted objects into app
   state; imported backups cannot add courses, account IDs or permissions. */
function workshopParseBackup(text) {
  if (typeof text !== 'string' || text.length > 2000000) throw Error('invalid');
  const b = JSON.parse(text);
  const str = (v, n) => { if (typeof v !== 'string' || v.length > n) throw Error('invalid'); return v; };
  const num = (v, lo, hi) => { if (!Number.isFinite(v) || v < lo || v > hi) throw Error('invalid'); return v; };
  const arr = (v, n) => { if (!Array.isArray(v) || v.length > n) throw Error('invalid'); return v; };
  const id = (v) => { if (typeof v !== 'string' || !/^[a-zA-Z0-9_-]{1,100}$/.test(v)) throw Error('invalid'); return v; };
  const base = (a) => {
    if (!a || !['vi','en','de'].includes(a.lang)) throw Error('invalid');
    return { id: id(a.id), at: num(a.at, 0, 8640000000000000), lang: a.lang };
  };
  if (!b || b.version !== 1) throw Error('invalid');
  return { version: 1, drafts: {}, attempts: arr(b.attempts, 100).map((a) => {
    const x = Object.assign(base(a), { exercise: id(a.exercise), title: str(a.title, 500), question: str(a.question, 4000),
      synth: str(a.synth, 4000), rubric: str(a.rubric, 100), pct: num(a.pct, 0, 100), model: str(a.model, 12000),
      needs: arr(a.needs, 10).map((s) => { if (!['words','position','reversal','short','date','bare','synth'].includes(s)) throw Error('invalid'); return s; }),
      feedback: arr(a.feedback, 40).map((s) => str(s, 4000)),
      answers: arr(a.answers, 15).map((s) => str(s, 4000)),
      cards: arr(a.cards, 15).map((c) => ({ name: str(c.name, 300), position: str(c.position, 500), reversed: !!c.reversed,
        got: arr(c.got, 30).map((s) => str(s, 400)), missed: arr(c.missed, 30).map((s) => str(s, 400)) })) });
    if (!x.cards.length || x.cards.length !== x.answers.length) throw Error('invalid');
    if (a.reasoning) x.reasoning = arr(a.reasoning, x.cards.length).map((s) => str(s, 1500));
    if (a.selfReview) x.selfReview = { at: num(a.selfReview.at, 0, 8640000000000000),
      checks: arr(a.selfReview.checks, 4).map((v) => v === true), plan: str(a.selfReview.plan, 2000) };
    return x;
  }), reflections: arr(b.reflections, 100).map((a) => Object.assign(base(a), {
    card: str(a.card, 100), name: str(a.name, 300), date: str(a.date, 10), focus: str(a.focus, 100),
    focusLabel: str(a.focusLabel, 300), text: str(a.text, 4000)
  })) };
}
function workshopRestore(owner, text) {
  if (owner !== studyOwner() || owner == null) return 'changed';
  let incoming;
  try { incoming = workshopParseBackup(text); } catch (e) { return 'invalid'; }
  const book = STUDY.read(owner);
  for (const type of ['attempts', 'reflections']) {
    for (const entry of incoming[type]) {
      const same = book[type].find((x) => x.id === entry.id);
      // Re-normalize the existing record for stable comparison across field order.
      let identical = false;
      if (same) {
        try {
          const normalized = workshopParseBackup(JSON.stringify({ version: 1, attempts: [], reflections: [], [type]: [same] }))[type][0];
          identical = JSON.stringify(normalized) === JSON.stringify(entry);
        } catch (e) { /* preserve both */ }
      }
      if (identical) continue;
      if (same) entry.id = studyId();
      book[type].push(entry);
    }
    if (book[type].length > 100) return 'capacity';
  }
  return STUDY.write(owner, book);
}
function workshopImportScreen(owner) {
  const S = workshopT();
  $('#main').innerHTML = backLink('#/study', S.book) + '<h1>' + esc(S.restore) + '</h1><p>' + esc(S.restoreIntro) + '</p>'
    + '<p class="hint">' + esc(HT('Bản nháp chưa nộp không được nhập; chỉ khôi phục bài và ghi chép đã lưu.', 'Unsubmitted drafts are not imported; only saved attempts and reflections are restored.', 'Nicht abgegebene Entwürfe werden nicht importiert, nur gespeicherte Versuche und Notizen.')) + '</p>'
    + '<label for="ws-import">' + esc(S.importText) + '</label><textarea id="ws-import" rows="10" maxlength="2000000"></textarea>'
    + '<p role="status" id="ws-status"></p><button id="ws-restore" class="btn primary">' + esc(S.importDo) + '</button>';
  $('#ws-restore').onclick = () => {
    const error = workshopRestore(owner, $('#ws-import').value);
    $('#ws-status').textContent = error ? (S[error] || studyT()[error]) : S.imported;
    if (!error) $('#ws-import').value = '';
  };
}
