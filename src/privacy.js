/* ============================ privacy policy (#/privacy) ============================
   The same text as privacy.html (built from privacy.json), shown inside the
   app in the visitor's language. Google Play and the App Store both ask for
   a policy reachable from inside the app and at a public address. */
async function renderPrivacy() {
  const S = T(), m = $('#main');
  m.innerHTML = '<div class="eyebrow">' + esc(CONFIG.brand) + '</div><h1>' + esc(S.privacyTitle) + '</h1><p class="muted">…</p>';
  const r = await loadJSON('privacy.json', 'nabu-privacy'), p = r.data;
  if (!p) { m.innerHTML += '<p class="hint">' + esc(S.feedOffline) + '</p>'; return; }
  m.innerHTML = '<div class="eyebrow">' + esc(CONFIG.brand) + '</div><div class="guide privacy"><h1 style="margin-bottom:6px">' + esc(L(p.title)) + '</h1><p class="faint">' + esc(S.horoUpdated) + ' ' + esc(p.updated) + '</p><p class="lead">' + esc(L(p.intro)) + '</p>'
    + p.sections.map((s, i) => '<div class="gsec"><span class="n">' + (i + 1) + '</span><div><h2>' + esc(L(s.h)) + '</h2><p>' + esc(L(s.p)) + '</p></div></div>').join('')
    + '<p class="hint" style="margin-top:14px"><a href="privacy.html" target="_blank" rel="noopener">privacy.html</a></p></div>';
}
ROUTES.privacy = { nav: 'me', render: renderPrivacy };
