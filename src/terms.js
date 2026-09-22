/* ============================ terms of service (#/terms) ============================
   The same text as terms.html (built from terms.json), shown inside the app in
   the visitor's language. It covers what Apple's and Google's own terms do not:
   the readings Nabu gives herself, which are booked in the app and paid outside
   it, and what happens to a purchase when an account is deleted. */
async function renderTerms() {
  const S = T(), m = $('#main');
  m.innerHTML = '<div class="eyebrow">' + esc(CONFIG.brand) + '</div><h1>' + esc(S.termsTitle) + '</h1><p class="muted">…</p>';
  const r = await loadJSON('terms.json', 'nabu-terms'), p = r.data;
  if (!p) { m.innerHTML += '<p class="hint">' + esc(S.feedOffline) + '</p>'; return; }
  m.innerHTML = '<div class="eyebrow">' + esc(CONFIG.brand) + '</div><div class="guide privacy"><h1 style="margin-bottom:6px">' + esc(L(p.title)) + '</h1><p class="faint">' + esc(S.horoUpdated) + ' ' + esc(p.updated) + '</p><p class="lead">' + esc(L(p.intro)) + '</p>'
    + p.sections.map((s, i) => '<div class="gsec"><span class="n">' + (i + 1) + '</span><div><h2>' + esc(L(s.h)) + '</h2><p>' + esc(L(s.p)) + '</p></div></div>').join('')
    + '<p class="hint" style="margin-top:14px"><a href="terms.html" target="_blank" rel="noopener">terms.html</a> · <a href="#/privacy">' + esc(S.privacyLink) + '</a></p></div>';
}
ROUTES.terms = { nav: 'me', render: renderTerms };
