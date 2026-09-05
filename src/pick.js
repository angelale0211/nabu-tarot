/* ============================ pick a card ============================ */
const pick = { focus: store.get('nabu-focus', 'general'), hand: [], chosen: null };
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
/* All 78 cards, shuffled, face down: the visitor picks any one of them. */
function newHand() { pick.hand = shuffle(DECK.vi.map((c) => c.id)); pick.chosen = null; }

/* Everything in one language: keywords, energy, focus reading, advice. */
function insightHTML(id, focus) {
  const S = T(), c = cardById(id), I = insightOf(id);
  if (!I) return '';
  const focusText = focus === 'general' ? I.advice : I[focus === 'work' ? 'work' : focus];
  let h = '<div class="ins"><h3>' + esc(S.energyNow) + '</h3>'
    + '<p>' + esc(S.energyLine(I.pos.slice(0, 3).join(', '))) + '</p><p>' + esc(I.now) + '</p>'
    + '<p class="scene">' + esc(c.scene) + '</p></div>';
  h += '<div class="ins"><h3>' + esc(S.shadow) + '</h3><p>' + esc(S.shadowLine(I.neg.slice(0, 3).join(', '))) + '</p><p>' + esc(c.rev) + '</p></div>';
  if (focus === 'general') h = h.replace('<p class="scene">', '<p>' + esc(I.advice) + '</p><p class="scene">');
  else h += '<div class="ins"><h3>' + esc(S.focusHead(S.focus[focus])) + '</h3><p>' + esc(focusText) + '</p><p class="muted">' + esc(I.advice) + '</p></div>';
  return h;
}
function renderPick(args, params) {
  // A shared link (#/pick?card=…) opens straight on that card, in the focus it was drawn with.
  const want = params && params.card && cardById(params.card) ? params.card : '';
  if (want && pick.chosen !== want) {
    newHand(); pick.chosen = want;
    if (params.focus && T().focus[params.focus]) pick.focus = params.focus;
  }
  if (!pick.hand.length) newHand();
  const S = T(), m = $('#main');
  // Once a card is drawn the focus is fixed for that draw: the other chips stay visible but off until a redraw.
  const chips = Object.keys(S.focus).map((f) => '<button class="chip' + (pick.focus === f ? ' on' : '') + '" data-focus="' + f + '"' + (pick.chosen != null && pick.focus !== f ? ' disabled' : '') + '>' + esc(S.focus[f]) + '</button>').join('');
  const fan = pick.hand.map((id, i) => {
    const cls = pick.chosen == null ? '' : (pick.chosen === id ? ' chosen' : ' dim');
    return '<div class="slot' + cls + '"><button data-card="' + id + '" aria-label="' + (i + 1) + '">' + BACK + '</button></div>';
  }).join('');
  m.innerHTML = '<div class="pick-head"><div class="eyebrow">' + esc(S.nav.pick) + '</div><h1>' + esc(S.pickTitle) + '</h1><p>' + esc(S.pickIntro) + '</p></div>'
    + '<div class="faint" style="text-align:center">' + esc(S.focusLabel) + '</div><div class="chips focus">' + chips + '</div>'
    + '<div class="fan deck" id="fan">' + fan + '</div>'
    + '<div class="deckbar"><button type="button" class="btn sm" data-step="-1" aria-label="prev">‹</button><span id="deckpos" class="faint"></span><button type="button" class="btn sm" data-step="1" aria-label="next">›</button></div>'
    + '<div class="tap-hint">' + (pick.chosen == null ? esc(S.tapACard) : '') + '</div><div class="reveal" id="reveal"></div>';
  bindDeck(m);
  $$('[data-focus]', m).forEach((b) => b.addEventListener('click', () => {
    if (pick.chosen != null) return;
    pick.focus = b.getAttribute('data-focus'); store.set('nabu-focus', pick.focus);
    $$('[data-focus]', m).forEach((x) => x.classList.toggle('on', x === b));
  }));
  $$('[data-card]', m).forEach((b) => b.addEventListener('click', () => {
    if (pick.chosen != null) return;
    pick.chosen = b.getAttribute('data-card');
    $$('.slot', m).forEach((s) => s.classList.add($('button', s) === b ? 'chosen' : 'dim'));
    $$('[data-focus]', m).forEach((x) => { if (!x.classList.contains('on')) x.disabled = true; });
    $('.tap-hint', m).textContent = '';
    renderReveal(true);
    setTimeout(() => { const r = $('#reveal'); if (r) r.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 250);
  }));
  if (pick.chosen != null) renderReveal(false);
}
/* The deck as a carousel: the card nearest the middle grows, the rest shrink
   and fade, arrows step one card at a time. Tapping any card still picks it. */
function bindDeck(m) {
  const fan = $('#fan', m); if (!fan) return;
  const S = T(), slots = $$('.slot', fan), pos = $('#deckpos', m);
  let raf = 0;
  const update = () => {
    raf = 0;
    const fr = fan.getBoundingClientRect(), cx = fr.left + fr.width / 2, span = Math.max(120, fr.width * 0.55);
    let best = 0, bd = Infinity;
    slots.forEach((s, i) => {
      const r = s.getBoundingClientRect(), dx = r.left + r.width / 2 - cx, k = Math.max(0, 1 - Math.abs(dx) / span);
      s.style.transform = 'scale(' + (0.68 + 0.42 * k).toFixed(3) + ')'; s.style.opacity = (0.45 + 0.55 * k).toFixed(2); s.style.zIndex = String(Math.round(10 * k));
      if (Math.abs(dx) < bd) { bd = Math.abs(dx); best = i; }
    });
    slots.forEach((s, i) => s.classList.toggle('near', i === best));
    pick.center = best; if (pos) pos.textContent = S.deckPos(best + 1, slots.length);
  };
  fan.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
  // Smoothness comes from CSS scroll-behavior; the counter is refreshed right away and again once the glide ends.
  const to = (i) => {
    const idx = Math.max(0, Math.min(slots.length - 1, i)), s = slots[idx]; if (!s) return;
    pick.center = idx; slots.forEach((x, k) => x.classList.toggle('near', k === idx)); if (pos) pos.textContent = S.deckPos(idx + 1, slots.length);
    fan.scrollLeft = s.offsetLeft - (fan.clientWidth - s.offsetWidth) / 2; setTimeout(update, 450);
  };
  $$('[data-step]', m).forEach((b) => b.addEventListener('click', () => to((pick.center || 0) + Number(b.getAttribute('data-step')))));
  fan.style.scrollBehavior = 'auto'; to(pick.chosen != null ? Math.max(0, pick.hand.indexOf(pick.chosen)) : Math.floor(slots.length / 2)); fan.style.scrollBehavior = '';
  update(); requestAnimationFrame(update);
}
function renderReveal(animate) {
  const S = T(), id = pick.chosen, c = cardById(id), other = cardById(id, lang === 'vi' ? 'en' : 'vi'), I = insightOf(id);
  const kws = I ? I.pos.slice(0, 3).join(', ') : '';
  const r = $('#reveal');
  r.innerHTML = '<div class="reveal-top"><div class="eyebrow">' + esc(S.yourCard) + '</div><button class="btn sm" id="redrawTop">🔄 ' + esc(S.redraw) + '</button></div>'
    + '<div class="hero"><div class="flip"><div class="inner"' + (animate ? '' : ' style="animation:none"') + '><span class="face fr">' + faceSVG(c) + '</span><span class="face bk">' + BACK + '</span></div></div>'
    + '<div><div class="name">' + esc(c.name) + '</div><div class="en">' + esc(other.name) + '</div><div class="meta m-' + c.suit + '"><i>' + esc(c.meta) + '</i></div></div></div>'
    + insightHTML(id, pick.focus)
    + '<div class="ins" style="border-color:var(--gold)"><p class="muted" style="margin-bottom:12px">' + esc(S.quickNote) + '</p>'
    + '<div class="row"><a class="btn primary" href="#/book?card=' + id + '">' + esc(S.bookWithCard) + '</a><a class="btn" href="#/learn/card/' + id + '">' + esc(S.learnCard) + '</a>'
    + '<button class="btn" id="shareCard">' + esc(S.shareCard) + '</button></div></div>'
    + aiPanelHTML({ type: 'card', id: id, focus: pick.focus })
    + '<button class="btn block" id="redraw" style="margin-top:6px">' + esc(S.redraw) + '</button>';
  bindAI(r);
  $('#shareCard').addEventListener('click', () => shareOrCopy(S.shareText(c.name, kws), appURL() + '#/pick?card=' + encodeURIComponent(id) + '&focus=' + pick.focus));
  const again = () => { newHand(); if (/\?/.test(location.hash)) redirect('#/pick'); else renderPick(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  $('#redraw').addEventListener('click', again);
  $('#redrawTop').addEventListener('click', again);
}
ROUTES.pick = { nav: 'pick', render: renderPick };
