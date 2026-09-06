/* ============================ bug reports (#/report) ============================
   A short form plus what the app knows (screen, version, device, the last
   error it caught). Saved to Firestore when accounts are on and the visitor
   is signed in; otherwise copied and sent through Instagram. */
window.__lastError = '';
window.addEventListener('error', (e) => { window.__lastError = (e.message || '') + ' @ ' + (e.filename || '').split('/').pop() + ':' + (e.lineno || ''); });
window.addEventListener('unhandledrejection', (e) => { window.__lastError = 'promise: ' + ((e.reason && e.reason.message) || String(e.reason || '')); });

function reportInfo() {
  return [CONFIG.brand + ' ' + (window.APP_VERSION || ''), location.hash, navigator.userAgent.replace(/\).*$/, ')'), (window.innerWidth + 'x' + window.innerHeight), lang, OOPS.length ? 'errors: ' + OOPS.join(' | ') : (window.__lastError ? 'error: ' + window.__lastError : '')].filter(Boolean).join(' · ');
}
function renderReport(args, params) {
  const S = T(), m = $('#main');
  m.innerHTML = '<div class="eyebrow">' + esc(CONFIG.brand) + '</div><h1 style="margin-bottom:6px">' + esc(S.reportTitle) + '</h1><p class="muted">' + esc(S.reportIntro) + '</p>'
    + '<div class="card"><label class="f" for="rwhat">' + esc(S.reportWhat) + '</label><textarea id="rwhat" placeholder="' + esc(S.reportPlaceholder) + '"></textarea>'
    + '<label class="f" for="rcontact">' + esc(S.reportContact) + '</label><input id="rcontact" value="' + esc(BE.user ? (BE.user.email || '') : '') + '">'
    + '<p class="hint" style="margin-top:12px">' + esc(S.reportAuto) + '</p><div class="msgbox" style="font-size:12.5px">' + esc(reportInfo()) + '</div>'
    + '<div class="row" style="flex-direction:column">'
    + '<button class="btn primary block" id="rsend">' + esc(S.reportSend) + '</button>'
    + '<a class="btn block" href="#/contact">💬 ' + esc(S.contactTitle) + '</a></div><p class="hint" id="rstatus"></p></div>';
  const need = () => { if (!$('#rwhat').value.trim()) { toast(S.reportNeed); return false; } return true; };
  const send = $('#rsend'); if (send) send.addEventListener('click', async () => {
    if (!need()) return;
    const text = $('#rwhat').value.trim(), contact = $('#rcontact').value.trim(), st = $('#rstatus');
    send.disabled = true; st.textContent = S.sending; st.className = 'hint';
    try {
      let delivered = false;
      if (CONFIG.reportEndpoint) {
        const r = await fetch(CONFIG.reportEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: text, contact: contact, info: reportInfo(), to: CONFIG.adminNotifyEmails, lang: lang }) });
        delivered = r.ok;
      }
      if (BE.enabled && BE.user) { await BE.db.collection('reports').add({ uid: BE.user.uid, email: BE.user.email || '', text: text, contact: contact, info: reportInfo(), at: firebase.firestore.FieldValue.serverTimestamp() }); delivered = true; }
      if (delivered) { st.textContent = S.reportSent; st.className = 'hint ok'; $('#rwhat').value = ''; }
      else { st.textContent = S.reportNoChannel; st.className = 'hint err'; }
    } catch (e) { st.textContent = S.publishFail + ': ' + e.message; st.className = 'hint err'; }
    send.disabled = false;
  });
}
ROUTES.report = { nav: 'me', render: renderReport };
