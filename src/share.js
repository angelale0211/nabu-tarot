/* ======================== asking to pay for something ======================

   Every paid thing in Nabu is settled the same way: a transfer to Nabu's bank,
   and a code or a confirmation back. What was missing is the sentence in
   between - somebody had to work out for themselves what to say and where to
   say it.

   This writes it. What was asked for, the amount, and a short reference drawn
   from the order so Nabu can match the message to the thing. One press puts it
   in the chat, where Nabu can answer with the account details or a photograph
   of the QR code, and where the receipt comes back the same way.

   Deliberately no card processor: Google and Apple both want a cut of this. */

/* Short, spoken aloud without ambiguity, and stable for a given order. */
function payRef(seed) {
  const s = String(seed || '') + '|' + (BE.user ? BE.user.uid : '');
  let h = 0;
  for (let i = 0; i < s.length; i++) { h = ((h << 5) - h + s.charCodeAt(i)) | 0; }
  const abc = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let out = '';
  let n = Math.abs(h) || 7;
  for (let i = 0; i < 5; i++) { out += abc[n % abc.length]; n = Math.floor(n / abc.length) + 11; }
  return 'NB-' + out;
}

function payMessage(what, total, ref) {
  const S = T();
  return S.payMsg(what, fmtPrice(total), ref);
}

/* The panel. `what` is one line naming the thing, `total` the amount. */
function payPanelHTML(what, total, ref, id) {
  const S = T();
  const msg = payMessage(what, total, ref);
  return '<div class="card paypanel" id="' + esc(id || 'paypanel') + '">'
    + '<div class="ghead"><span class="gk">\uD83D\uDCB3</span><h3>' + esc(S.payTitle) + '</h3></div>'
    + '<p class="hint" style="margin-bottom:10px">' + esc(S.payHow) + '</p>'
    + '<p class="payref">' + esc(S.payRefIs) + ' <b>' + esc(ref) + '</b></p>'
    + '<textarea class="paymsg" readonly rows="4">' + esc(msg) + '</textarea>'
    + '<button type="button" class="btn primary block" data-paysend="1" style="margin-top:10px">' + esc(S.paySend) + '</button>'
    + '<button type="button" class="btn block" data-paycopy="1" style="margin-top:8px">' + esc(S.payCopy) + '</button>'
    + '<p class="hint" data-paystatus></p>'
    + '<p class="hint">' + esc(S.payThen) + '</p></div>';
}

function bindPayPanel(root, get) {
  const S = T();
  const say = (t, cls) => { const el = $('[data-paystatus]', root); if (el) { el.className = 'hint ' + (cls || ''); el.textContent = t || ''; } };
  $$('[data-paysend]', root).forEach((b) => b.addEventListener('click', async () => {
    const w = get();
    if (!(BE.enabled && BE.user)) { toast(S.unlockNeedIn); location.hash = '#/me'; return; }
    b.disabled = true; say(S.loveSaving);
    try {
      await BE.sendMessage(payMessage(w.what, w.total, w.ref), null, null);
      say(S.paySent, 'ok');
      toast(S.paySent);
    } catch (e) { b.disabled = false; say(S.publishFail + ': ' + (e && e.message ? e.message : ''), 'err'); }
  }));
  $$('[data-paycopy]', root).forEach((b) => b.addEventListener('click', async () => {
    const w = get();
    await copyText(payMessage(w.what, w.total, w.ref));
    toast(S.copied);
  }));
}

/* ============================ telling people ============================

   Somebody who has just been tied, or asked, or married inside Nabu wants to
   say so somewhere else, and every one of those messages carries a link back
   here. That is the cheapest way this app will ever find new people, so it is
   worth doing properly rather than with one grey "share" button.

   Eight places, each with its own mark drawn on the same rounded square as the
   booking icons, so the row reads as one set. Where a platform has a real web
   share endpoint it is used; where it has none - Instagram wants an image and
   a story, not a URL - the text is copied instead and the person is told so,
   which is honest and is what they were going to do anyway.

   Nothing here loads anything from those companies: every mark is drawn, and
   the links are plain anchors the phone opens. No pixel, no SDK, nobody
   watching who pressed what. */

const SHARE_ART = {
  fb: '<svg viewBox="0 0 24 24" class="shart" aria-hidden="true">'
    + '<rect x="1" y="1" width="22" height="22" rx="6.6" fill="#1877F2"/>'
    + '<path fill="#fff" d="M13.9 20.2v-7.4h2.5l.38-2.9H13.9V8.05c0-.84.23-1.41 1.43-1.41h1.53V4.05'
    + 'c-.27-.04-1.18-.12-2.24-.12-2.22 0-3.74 1.35-3.74 3.84v2.13H8.37v2.9h2.51v7.4Z"/></svg>',
  ig: '<svg viewBox="0 0 24 24" class="shart" aria-hidden="true">'
    + '<defs><linearGradient id="shig" x1="0" y1="1" x2="1" y2="0">'
    + '<stop offset="0" stop-color="#FEDA75"/><stop offset=".25" stop-color="#FA7E1E"/>'
    + '<stop offset=".5" stop-color="#D62976"/><stop offset=".75" stop-color="#962FBF"/>'
    + '<stop offset="1" stop-color="#4F5BD5"/></linearGradient></defs>'
    + '<rect x="1" y="1" width="22" height="22" rx="6.6" fill="url(#shig)"/>'
    + '<rect x="5.7" y="5.7" width="12.6" height="12.6" rx="4.1" fill="none" stroke="#fff" stroke-width="1.7"/>'
    + '<circle cx="12" cy="12" r="3.3" fill="none" stroke="#fff" stroke-width="1.7"/>'
    + '<circle cx="16.8" cy="7.2" r="1.15" fill="#fff"/></svg>',
  zalo: '<svg viewBox="0 0 24 24" class="shart" aria-hidden="true">'
    + '<rect x="1" y="1" width="22" height="22" rx="6.6" fill="#0068FF"/>'
    + '<path fill="#fff" d="M6.6 6.4h6.1v1.5l-3.9 5.1h4v1.6H6.2v-1.5l3.9-5.1H6.6Z"/>'
    + '<circle cx="16.6" cy="14.2" r="1.5" fill="#fff"/>'
    + '<path fill="#fff" d="M6.9 17.1h10.6v1.35H6.9Z" opacity=".55"/></svg>',
  wa: '<svg viewBox="0 0 24 24" class="shart" aria-hidden="true">'
    + '<rect x="1" y="1" width="22" height="22" rx="6.6" fill="#25D366"/>'
    + '<path fill="#fff" d="M12 5.4a6.5 6.5 0 0 0-5.6 9.8L5.5 18.9l3.8-.85A6.5 6.5 0 1 0 12 5.4Zm0 1.6a4.9 4.9 0 1 1-2.6 9.05l-.3-.19-1.9.42.43-1.83-.2-.31A4.9 4.9 0 0 1 12 7Z"/>'
    + '<path fill="#fff" d="M10.1 9.3c-.15-.34-.3-.35-.45-.35h-.38c-.13 0-.34.05-.52.25-.18.2-.68.66-.68 1.6s.7 1.86.8 1.99c.1.13 1.36 2.18 3.36 2.96 1.66.65 2 .52 2.36.49.36-.03 1.16-.47 1.32-.93.16-.46.16-.85.11-.93-.05-.08-.18-.13-.38-.23-.2-.1-1.16-.57-1.34-.64-.18-.06-.31-.1-.44.1-.13.2-.5.64-.62.77-.11.13-.23.15-.43.05-.2-.1-.84-.31-1.6-.99-.59-.52-.99-1.17-1.1-1.37-.12-.2-.02-.3.08-.4.09-.09.2-.23.3-.35.1-.12.13-.2.2-.34.06-.13.03-.25-.02-.35-.05-.1-.44-1.06-.6-1.45Z"/></svg>',
  tg: '<svg viewBox="0 0 24 24" class="shart" aria-hidden="true">'
    + '<rect x="1" y="1" width="22" height="22" rx="6.6" fill="#2AABEE"/>'
    + '<path fill="#fff" d="M18.3 7.1 16.1 17c-.16.72-.6.9-1.2.56l-3.3-2.44-1.6 1.54c-.18.18-.33.33-.67.33l.24-3.4 6.16-5.57c.27-.24-.06-.37-.41-.13l-7.62 4.8-3.28-1.03c-.71-.22-.72-.71.15-1.05l12.83-4.95c.6-.22 1.11.14.9 1Z"/></svg>',
  x: '<svg viewBox="0 0 24 24" class="shart" aria-hidden="true">'
    + '<rect x="1" y="1" width="22" height="22" rx="6.6" fill="#0F1419"/>'
    + '<path fill="#fff" d="M16.5 5.6h2.1l-4.6 5.26 5.4 7.14h-4.23l-3.31-4.33-3.79 4.33H5.97l4.92-5.63L5.7 5.6h4.34l2.99 3.96Zm-.74 11.15h1.16L9.5 6.79H8.25Z"/></svg>',
  threads: '<svg viewBox="0 0 24 24" class="shart" aria-hidden="true">'
    + '<rect x="1" y="1" width="22" height="22" rx="6.6" fill="#0F1419"/>'
    + '<path fill="#fff" d="M12.3 5.1c2.9 0 4.7 1.42 5.35 3.62l-1.6.47c-.5-1.6-1.68-2.5-3.76-2.5-2.63 0-4.2 1.72-4.2 5.28 0 3.6 1.66 5.34 4.28 5.34 2 0 3.35-.9 3.35-2.3 0-.9-.5-1.5-1.4-1.83-.28 1.72-1.35 2.76-3 2.76-1.6 0-2.75-.98-2.75-2.5 0-1.7 1.36-2.72 3.5-2.72.5 0 .98.05 1.4.14v-.36c0-1-.55-1.6-1.6-1.6-.83 0-1.4.34-1.72 1l-1.5-.68c.6-1.24 1.75-1.92 3.25-1.92 2.05 0 3.28 1.15 3.28 3.2v.72c1.6.62 2.5 1.83 2.5 3.5 0 2.42-2.05 4.02-5.06 4.02-3.66 0-6.1-2.4-6.1-6.9 0-4.5 2.4-6.94 5.78-6.94Zm.3 7.7c-1.2 0-1.86.44-1.86 1.2 0 .62.47 1 1.24 1 .95 0 1.55-.7 1.7-2.1a4.6 4.6 0 0 0-1.08-.1Z"/></svg>',
  copy: '<svg viewBox="0 0 24 24" class="shart" aria-hidden="true">'
    + '<rect x="1" y="1" width="22" height="22" rx="6.6" fill="#6C4CC4"/>'
    + '<rect x="6.2" y="4.9" width="8.6" height="11" rx="2" fill="none" stroke="#fff" stroke-width="1.6"/>'
    + '<path d="M9.2 18.9h6.6a2 2 0 0 0 2-2V8.6" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg>',
  more: '<svg viewBox="0 0 24 24" class="shart" aria-hidden="true">'
    + '<rect x="1" y="1" width="22" height="22" rx="6.6" fill="#B8A4E3"/>'
    + '<circle cx="8" cy="12" r="1.5" fill="#fff"/><circle cx="12" cy="12" r="1.5" fill="#fff"/>'
    + '<circle cx="16" cy="12" r="1.5" fill="#fff"/></svg>'
};

/* Where a platform has a real web share endpoint, it is used. Instagram has
   none - it wants an image in a story, not a link - so that one copies the
   words and says so. */
const SHARE_TO = [
  { id: 'fb', name: 'Facebook', url: (t, u) => 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(u) },
  { id: 'zalo', name: 'Zalo', url: (t, u) => 'https://sp.zalo.me/plugins/share?u=' + encodeURIComponent(u) },
  { id: 'wa', name: 'WhatsApp', url: (t, u) => 'https://wa.me/?text=' + encodeURIComponent(t + ' ' + u) },
  { id: 'tg', name: 'Telegram', url: (t, u) => 'https://t.me/share/url?url=' + encodeURIComponent(u) + '&text=' + encodeURIComponent(t) },
  { id: 'x', name: 'X', url: (t, u) => 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(t) + '&url=' + encodeURIComponent(u) },
  { id: 'threads', name: 'Threads', url: (t, u) => 'https://www.threads.net/intent/post?text=' + encodeURIComponent(t + ' ' + u) },
  { id: 'ig', name: 'Instagram', copy: true },
  { id: 'copy', name: '', copy: true }
];

/* The row itself. `more` only appears where the phone actually has a share
   sheet, because a button that does nothing on a desktop is worse than no
   button. */
function shareRowHTML(id, skip) {
  const S = T(), hide = skip || [];
  const one = (t) => {
    const label = t.id === 'copy' ? S.shareCopy : t.name;
    return '<button type="button" class="shbtn" data-share="' + esc(t.id) + '" title="' + esc(label) + '" aria-label="' + esc(label) + '">'
      + SHARE_ART[t.id] + '<span>' + esc(label) + '</span></button>';
  };
  return '<div class="sharerow" id="' + esc(id || 'sharerow') + '">'
    + SHARE_TO.filter((t) => hide.indexOf(t.id) < 0).map(one).join('')
    + (navigator.share ? one({ id: 'more', name: S.shareMore }) : '')
    + '</div>';
}

/* text and url are read when a button is pressed, not when the row is drawn,
   so a screen whose numbers keep changing - the day count on the thread, say -
   shares what is on it now. */
function bindShareRow(root, get) {
  $$('[data-share]', root || document).forEach((b) => b.addEventListener('click', async () => {
    const what = get(), id = b.getAttribute('data-share');
    const S = T(), text = what.text || '', url = what.url || appURL();
    if (id === 'more') {
      try { await navigator.share({ title: CONFIG.brand, text: text, url: url }); } catch (e) { /* they changed their mind */ }
      return;
    }
    const t = SHARE_TO.filter((x) => x.id === id)[0];
    if (!t || t.copy) {
      await copyText(text + ' ' + url);
      toast(id === 'ig' ? S.shareIgCopied : S.copied);
      return;
    }
    window.open(t.url(text, url), '_blank', 'noopener,noreferrer');
  }));
}

/* ============================ the share sheet ============================

   A post's Share button used to go straight to the phone's share sheet, or
   copy on a desk with nothing to show for it but a toast. This is the panel in
   between: the post's link in a box with a copy mark on its end that turns
   into a tick, a Copy link button and an Open button under it, and the row of
   places above. Same sheet the companion's shelf uses, so it rises from the
   bottom on a phone and sits in the middle of a desk. */

const SHARE_MARK = {
  copy: '<svg viewBox="0 0 24 24" class="shmk shmk-copy" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
    + '<rect x="9" y="9" width="12" height="12" rx="2.5"/><path d="M5 15H4.5A1.5 1.5 0 0 1 3 13.5v-9A1.5 1.5 0 0 1 4.5 3h9A1.5 1.5 0 0 1 15 4.5V5"/></svg>',
  check: '<svg viewBox="0 0 24 24" class="shmk shmk-check" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  link: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
    + '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg>',
  open: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
    + '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14 21 3"/></svg>'
};

function closeShareSheet() {
  const el = $('#sharesheet'); if (!el) return;
  const back = el._back; el.remove();
  document.removeEventListener('keydown', el._esc);
  window.removeEventListener('hashchange', el._go);
  if (back && back.focus && document.contains(back)) back.focus();
}

/* `what` is { title, text, url }: the title sits under the lead so the sheet
   says which post it is; text and url go to the row of places; url alone is
   what the box holds and the copy buttons copy. */
function openShareSheet(what) {
  closeShareSheet();
  const S = T(), w = what || {}, url = w.url || appURL(), back = document.activeElement;
  const el = document.createElement('div');
  el.className = 'sheet shdlg'; el.id = 'sharesheet';
  el.innerHTML = '<div class="sh-back" data-close-share="1"></div>'
    + '<div class="sh-body" role="dialog" aria-modal="true" aria-labelledby="shdlg-h">'
    + '<div class="sh-grip"></div>'
    + '<button type="button" class="shx" data-close-share="1" aria-label="' + esc(S.sheetClose) + '" title="' + esc(S.sheetClose) + '">×</button>'
    + '<h3 class="shdlg-h" id="shdlg-h">' + esc(S.shareDlgTitle) + '</h3>'
    + '<p class="shdlg-lead">' + esc(S.shareDlgLead) + '</p>'
    + (w.title ? '<p class="shdlg-what">' + esc(w.title) + '</p>' : '')
    + '<label class="sr" for="shlink">' + esc(S.shareLinkLabel) + '</label>'
    + '<div class="shlinkwrap">'
    + '<input class="shlink" id="shlink" type="text" readonly value="' + esc(url) + '">'
    + '<button type="button" class="shcopyic" data-share-copyic="1" data-tip="' + esc(S.shareCopyTip) + '" aria-label="' + esc(S.shareCopyTip) + '">' + SHARE_MARK.copy + SHARE_MARK.check + '</button>'
    + '</div>'
    + '<div class="shdlg-btns">'
    + '<button type="button" class="btn primary" data-share-copylink="1">' + SHARE_MARK.link + '<span>' + esc(S.shareCopyLink) + '</span></button>'
    + '<a class="btn" href="' + esc(url) + '" target="_blank" rel="noopener">' + SHARE_MARK.open + '<span>' + esc(S.shareOpen) + '</span></a>'
    + '</div>'
    + '<div class="eyebrow shdlg-to">' + esc(S.shareToLabel) + '</div>'
    + shareRowHTML('shdlgrow', ['copy'])
    + '</div>';
  document.body.appendChild(el);
  el._back = back;
  el._esc = (e) => { if (e.key === 'Escape') closeShareSheet(); };
  el._go = () => closeShareSheet();
  document.addEventListener('keydown', el._esc);
  window.addEventListener('hashchange', el._go);
  $$('[data-close-share]', el).forEach((b) => b.addEventListener('click', closeShareSheet));

  /* The mark on the box turns into a tick for a moment, the way a copy button
     should, and the tooltip says so; the big button says it in the toast. */
  const ic = $('[data-share-copyic]', el);
  let tick = null;
  const copied = () => {
    ic.classList.add('done'); ic.setAttribute('data-tip', S.shareCopiedBang); ic.setAttribute('aria-label', S.shareCopiedBang); ic.disabled = true;
    clearTimeout(tick);
    tick = setTimeout(() => { ic.classList.remove('done'); ic.setAttribute('data-tip', S.shareCopyTip); ic.setAttribute('aria-label', S.shareCopyTip); ic.disabled = false; }, 1500);
  };
  const copyLink = async () => { await copyText(url); copied(); toast(S.shareCopiedBang); };
  ic.addEventListener('click', copyLink);
  $('[data-share-copylink]', el).addEventListener('click', copyLink);
  $('#shlink', el).addEventListener('focus', function () { this.select(); });
  bindShareRow(el, () => ({ text: w.text || w.title || '', url: url }));
  const first = $('[data-share-copylink]', el); if (first) first.focus();
  return el;
}
