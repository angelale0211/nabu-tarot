/* ============================ contact (#/contact) ============================
   One text box, then the channel: a message inside the app (needs a sign-in),
   Instagram, Facebook or email. The text is copied before an outside app opens. */
function renderContact() {
  const S = T(), m = $('#main');
  const fb = CONFIG.facebookPage ? 'https://m.me/' + CONFIG.facebookPage : CONFIG.facebookUrl;
  m.innerHTML = '<div class="eyebrow">' + esc(CONFIG.brand) + '</div><h1 style="margin-bottom:6px">' + esc(S.contactTitle) + '</h1><p class="muted">' + esc(S.contactIntro) + '</p>'
    + '<div class="card"><label class="f" for="ctext">' + esc(S.contactWhat) + '</label><textarea id="ctext" placeholder="' + esc(S.contactPlaceholder) + '"></textarea>'
    + '<p class="hint" style="margin:12px 0 8px">' + esc(S.contactChoose) + '</p><div class="row" style="flex-direction:column">'
    + (BE.enabled ? '<button class="btn primary block" data-ch="app">💬 ' + esc(S.contactApp) + '</button>' : '')
    + (CONFIG.instagram ? '<button class="btn block" data-ch="ig">📸 Instagram</button>' : '')
    + (fb ? '<button class="btn block" data-ch="fb">📘 Facebook</button>' : '')
    + (CONFIG.email ? '<button class="btn block" data-ch="mail">✉️ Email</button>' : '')
    + '</div><p class="hint" id="cstatus"></p></div>';
  const text = () => $('#ctext').value.trim();
  const st = (t, cls) => { $('#cstatus').textContent = t; $('#cstatus').className = 'hint ' + (cls || ''); };
  const need = () => { if (!text()) { toast(S.contactNeed); $('#ctext').focus(); return false; } return true; };
  $$('[data-ch]', m).forEach((b) => b.addEventListener('click', async () => {
    if (!need()) return;
    const ch = b.getAttribute('data-ch');
    if (ch === 'app') {
      if (!BE.user) { st(S.needLogin); location.hash = '#/me?next=contact'; return; }
      b.disabled = true;
      try { await BE.sendMessage(text(), null); st(S.contactSent, 'ok'); $('#ctext').value = ''; } catch (e) { st(S.publishFail + ': ' + e.message, 'err'); }
      b.disabled = false; return;
    }
    if (ch === 'mail') { location.href = 'mailto:' + CONFIG.email + '?subject=' + encodeURIComponent(CONFIG.brand) + '&body=' + encodeURIComponent(text()); return; }
    copyText(text()); st(S.contactCopied, 'ok');
    window.open(ch === 'ig' ? 'https://ig.me/m/' + CONFIG.instagram : fb, '_blank', 'noopener');
  }));
}
ROUTES.contact = { nav: 'me', render: renderContact };
