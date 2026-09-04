/* ============================ bug reports (#/report) ============================
   A short form plus what the app knows (screen, version, device, the last
   error it caught). Saved to Firestore when accounts are on and the visitor
   is signed in; otherwise copied and sent through Instagram. */
window.__lastError = '';
window.addEventListener('error', (e) => { window.__lastError = (e.message || '') + ' @ ' + (e.filename || '').split('/').pop() + ':' + (e.lineno || ''); });
window.addEventListener('unhandledrejection', (e) => { window.__lastError = 'promise: ' + ((e.reason && e.reason.message) || String(e.reason || '')); });

function reportInfo() {
  return [CONFIG.brand + ' ' + (window.APP_VERSION || ''), location.hash, navigator.userAgent.replace(/\).*$/, ')'), (window.innerWidth + 'x' + window.innerHeight), lang, window.__lastError ? 'error: ' + window.__lastError : ''].filter(Boolean).join(' · ');
}
function renderReport(args, params) {
  const S = T(), m = $('#main');
  m.innerHTML = '<div class="eyebrow">' + esc(CONFIG.brand) + '</div><h1 style="margin-bottom:6px">' + esc(S.reportTitle) + '</h1><p class="muted">' + esc(S.reportIntro) + '</p>'
    + '<div class="card"><label class="f" for="rwhat">' + esc(S.reportWhat) + '</label><textarea id="rwhat" placeholder="' + esc(S.reportPlaceholder) + '"></textarea>'
    + '<label class="f" for="rcontact">' + esc(S.reportContact) + '</label><input id="rcontact" value="' + esc(BE.user ? (BE.user.email || '') : '') + '">'
    + '<p class="hint" style="margin-top:12px">' + esc(S.reportAuto) + '</p><div class="msgbox" style="font-size:12.5px">' + esc(reportInfo()) + '</div>'
    + '<div class="row" style="flex-direction:column">'
    + (BE.enabled && BE.user ? '<button class="btn primary block" id="rsend">' + esc(S.reportSend) + '</button>' : '')
    + (CONFIG.instagram ? '<a class="btn block' + (BE.enabled && BE.user ? '' : ' primary') + '" id="rig" href="https://ig.me/m/' + esc(CONFIG.instagram) + '" target="_blank" rel="noopener">' + esc(S.reportViaIg) + '</a>' : '')
    + '<button class="btn block" id="rcopy">' + esc(S.copyMsg) + '</button></div><p class="hint" id="rstatus"></p></div>';
  const msg = () => S.reportMsgHead + '\n' + $('#rwhat').value.trim() + '\n' + ($('#rcontact').value.trim() ? S.reportContact + ': ' + $('#rcontact').value.trim() + '\n' : '') + '— ' + reportInfo();
  const need = () => { if (!$('#rwhat').value.trim()) { toast(S.reportNeed); return false; } return true; };
  $('#rcopy').addEventListener('click', () => { if (need()) copyText(msg()).then(() => toast(S.copied)); });
  const ig = $('#rig'); if (ig) ig.addEventListener('click', (e) => { if (!need()) { e.preventDefault(); return; } copyText(msg()); toast(S.copied); });
  const send = $('#rsend'); if (send) send.addEventListener('click', async () => {
    if (!need()) return; send.disabled = true;
    try { await BE.db.collection('reports').add({ uid: BE.user.uid, email: BE.user.email || '', text: $('#rwhat').value.trim(), contact: $('#rcontact').value.trim(), info: reportInfo(), at: firebase.firestore.FieldValue.serverTimestamp() }); $('#rstatus').textContent = S.reportSent; $('#rstatus').className = 'hint ok'; $('#rwhat').value = ''; }
    catch (e) { $('#rstatus').textContent = S.publishFail + ': ' + e.message; $('#rstatus').className = 'hint err'; }
    send.disabled = false;
  });
}
ROUTES.report = { nav: 'me', render: renderReport };
