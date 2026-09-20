/* ---- the wardrobe screen ----
   The four things you could give a companion used to share one bottom sheet
   with a flat grid of small buttons. Seven slots, nine collections, ten skies
   and ten effects do not fit in that, so clothes moved out into a screen of
   their own.

   It is still a sheet rather than a route: the close button, the tap on the
   backdrop and the phone's own back gesture already work on a sheet, and the
   router does not need to learn anything.

   The preview at the top is the point of the whole screen. Equipping redraws
   only the preview and the two tiles whose state changed - never the screen -
   so trying things on feels like trying things on rather than like navigating. */

/* Three saved looks per companion. Free at every tier: a look can only hold
   pieces its owner already owns, so saving one grants nothing. */
const PET_LOOK_KEY = 'nabu-pet-looks';
const PET_LOOK_N = 3;
function looksAll() { const a = store.get(PET_LOOK_KEY, {}); return (a && typeof a === 'object') ? a : {}; }
function looksGet(kind) {
  const a = looksAll()[kind];
  const out = Array.isArray(a) ? a.slice(0, PET_LOOK_N) : [];
  while (out.length < PET_LOOK_N) out.push(null);
  return out;
}
function looksPut(kind, i, val) {
  const all = looksAll(), list = looksGet(kind);
  list[i] = val; all[kind] = list; store.set(PET_LOOK_KEY, all);
}

function petDressOpen(kind, after) {
  const p0 = PETS.one(kind);
  if (!p0) return;
  const host = document.createElement('div');
  document.body.appendChild(host);
  /* 'head', 'top', ... for a slot, or 'sky' / 'fx' for the two scene tabs. */
  let tab = 'head';

  const close = () => {
    document.removeEventListener('keydown', onKey);
    host.remove();
    if (after) after();
  };
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  document.addEventListener('keydown', onKey);

  const pet = () => PETS.one(kind) || p0;

  /* ---- the live preview ---- */
  const previewHTML = () => {
    const p = pet();
    return petHomeSVG(PETS.home(p).id) + petSkySVG(PETS.sky(p).id) + petAuraHTML(p.kind)
      + petSVG(p.kind, PETS.coat(p), 'happy', PETS.fit(p), PETS.fx(p));
  };
  const repaint = () => {
    const S = T(), p = pet(), box = $('#dressstage', host);
    if (box) box.innerHTML = previewHTML();
    const n = fitCount(PETS.fit(p));
    const cnt = $('#dresscount', host);
    if (cnt) {
      cnt.textContent = n ? S.wardrobeWorn(n) : S.wardrobeBare;
      cnt.className = 'wcount' + (n >= FIT_FULL_AT ? ' full' : '');
    }
    const bonus = $('#dressbonus', host);
    if (bonus) bonus.textContent = '+' + PETS.gain(p).total;
  };

  /* ---- one tile ---- */
  const tile = (x, on) => {
    const locked = !wearOn(x), col = petCol(x.col);
    return '<button type="button" class="wtile' + (on ? ' on' : '') + (locked ? ' locked' : '') + '"'
      + ' data-wear="' + x.slot + ':' + x.id + '" aria-pressed="' + (on ? 'true' : 'false') + '">'
      + '<span class="wart" style="--soft:' + col.soft + ';--accent:' + col.accent + '">' + wearTile(x.id) + '</span>'
      + '<b>' + esc(L(x.name)) + '</b>'
      + (locked ? '<span class="wbadge ' + x.tier + '">' + (x.tier === 'pro' ? '👑' : '✨') + '</span>' : '')
      + (on ? '<span class="won">✓</span>' : '')
      + '</button>';
  };
  /* The tile that takes the piece off again, first in every slot so it is where
     the hand already is rather than at the end of nine collections. */
  const bareTile = (slot, on) => {
    const S = T();
    return '<button type="button" class="wtile bare' + (on ? ' on' : '') + '" data-wear="' + slot + ':none" aria-pressed="' + (on ? 'true' : 'false') + '">'
      + '<span class="wart"><svg viewBox="0 0 60 60" class="wearart" aria-hidden="true">'
      + '<circle cx="30" cy="30" r="15" fill="none" stroke="#C9BFE0" stroke-width="2" stroke-dasharray="4 4"/></svg></span>'
      + '<b>' + esc(S.wearNone) + '</b>' + (on ? '<span class="won">✓</span>' : '') + '</button>';
  };

  /* ---- a slot, as its collections ---- */
  const slotHTML = (slot) => {
    const S = T(), p = pet(), now = PETS.fit(p)[slot];
    let out = '<div class="wgrid">' + bareTile(slot, !now || now === 'none') + '</div>';
    PET_COLS.forEach((c) => {
      const items = wearIn(slot).filter((x) => x.col === c.id);
      if (!items.length) return;
      const owned = items.filter(wearOn).length;
      out += '<div class="wrib" style="--accent:' + c.accent + ';--soft:' + c.soft + '">'
        + '<b>' + esc(L(S.colNames[c.id]) || c.id) + '</b>'
        /* The count is there to show what is still locked. Once the whole
           collection is owned it has nothing left to say, so it says nothing -
           a badge congratulating somebody on every ribbon is just noise. */
        + (owned === items.length ? '' : '<span>' + owned + '/' + items.length + '</span>') + '</div>'
        + '<div class="wgrid">' + items.map((x) => tile(x, x.id === now)).join('') + '</div>';
    });
    return out;
  };

  /* ---- the sky tab: each tile is the real home under the real sky ---- */
  const skyHTML = () => {
    const S = T(), p = pet(), home = PETS.home(p).id, now = PETS.sky(p).id;
    return '<div class="wgrid sky">' + PET_SKIES.map((s) => {
      const locked = !tierOn(s.tier), on = s.id === now;
      return '<button type="button" class="wtile' + (on ? ' on' : '') + (locked ? ' locked' : '') + '"'
        + ' data-sky="' + s.id + '" aria-pressed="' + (on ? 'true' : 'false') + '">'
        + '<span class="wscene">' + petHomeSVG(home) + petSkySVG(s.id) + '</span>'
        + '<b>' + esc(L(S.skyNames[s.id]) || s.id) + '</b>'
        + (locked ? '<span class="wbadge ' + s.tier + '">' + (s.tier === 'pro' ? '👑' : '✨') + '</span>' : '')
        + (on ? '<span class="won">✓</span>' : '') + '</button>';
    }).join('') + '</div>';
  };

  /* ---- the effects tab, which is the one place reserved for Pro ---- */
  const fxHTML = () => {
    const S = T(), p = pet(), now = PETS.fx(p).id, pro = proOn();
    return '<div class="wgrid fx">' + PET_FX.map((f) => {
        const locked = !tierOn(f.tier), on = f.id === now, art = petFxSVG(f.id);
        return '<button type="button" class="wtile fxtile' + (on ? ' on' : '') + (locked ? ' locked' : '') + '"'
          + ' data-fx="' + f.id + '" aria-pressed="' + (on ? 'true' : 'false') + '">'
          + '<span class="wart fxbox"><svg viewBox="0 0 120 120" class="wearart" aria-hidden="true">'
          + art.back + art.front + '</svg></span>'
          + '<b>' + esc(L(S.fxNames[f.id]) || f.id) + '</b>'
          + (locked ? '<span class="wbadge pro">👑</span>' : '')
          + (on ? '<span class="won">✓</span>' : '') + '</button>';
      }).join('') + '</div>'
      + (pro ? '' : '<a class="salebar" href="#/unlock?from=app"><span class="tag">✨ ' + esc(S.proName) + '</span>'
        + '<span class="txt">' + esc(S.wardrobeFxPitch) + '</span><span class="go">' + esc(S.unlockLink) + ' ›</span></a>');
  };

  /* ---- the saved looks ---- */
  const looksHTML = () => {
    const S = T(), saved = looksGet(kind);
    return '<div class="wlooks"><span class="lbl">' + esc(S.wardrobeLooks) + '</span>'
      + saved.map((l, i) => '<span class="wlook' + (l ? ' has' : '') + '">'
        + '<button type="button" class="btn small" data-look-on="' + i + '"' + (l ? '' : ' disabled') + '>'
        + (l ? esc(S.wardrobeLookN(i + 1)) : '—') + '</button>'
        + '<button type="button" class="linkbtn" data-look-save="' + i + '">' + esc(S.wardrobeSave) + '</button></span>').join('')
      + '</div>';
  };

  const draw = () => {
    const S = T(), p = pet();
    const isSlot = PET_SLOT_IDS.indexOf(tab) > -1;
    const rail = PET_SLOT_RAIL.map((s) => {
      const id = PETS.fit(p)[s.id], worn = id && id !== 'none';
      return '<button type="button" class="wslot' + (tab === s.id ? ' on' : '') + (worn ? ' worn' : '') + '"'
        + ' data-tab="' + s.id + '" aria-label="' + esc(L(S.slotNames[s.id]) || s.id) + '" title="' + esc(L(S.slotNames[s.id]) || s.id) + '">'
        + '<span class="wthumb">' + (worn ? wearTile(id) : '<i>' + s.ic + '</i>') + '</span>'
        + '<u>' + esc(L(S.slotNames[s.id]) || s.id) + '</u></button>';
    }).join('');
    const scenes = '<button type="button" class="wslot scene' + (tab === 'sky' ? ' on' : '') + '" data-tab="sky">'
      + '<span class="wthumb"><i>🌤️</i></span><u>' + esc(S.wardrobeSky) + '</u></button>'
      + '<button type="button" class="wslot scene' + (tab === 'fx' ? ' on' : '') + '" data-tab="fx">'
      + '<span class="wthumb"><i>✨</i></span><u>' + esc(S.wardrobeFx) + '</u></button>';

    const n = fitCount(PETS.fit(p));
    host.innerHTML = '<div class="sheet dresssheet"><div class="sh-back" data-dclose="1"></div>'
      + '<div class="sh-body" role="dialog" aria-modal="true" aria-label="' + esc(S.wardrobeTitle) + '">'
      + '<div class="whead">'
      + '<div class="wtitle"><b>👑 ' + esc(S.wardrobeTitle) + '</b>'
      + '<button type="button" class="wclose" data-dclose="1" aria-label="' + esc(S.sheetClose) + '">✕</button></div>'
      + '<div class="wpreview"><div class="petstage" id="dressstage">' + previewHTML() + '</div>'
      + '<div class="wmeta">'
      + '<span class="wname">' + esc(p.name || L(PET_NAMES[p.kind])) + '</span>'
      + '<span class="wcount' + (n >= FIT_FULL_AT ? ' full' : '') + '" id="dresscount">' + esc(n ? S.wardrobeWorn(n) : S.wardrobeBare) + '</span>'
      + '<span class="wpay">' + esc(S.petMealWorth) + ' <b id="dressbonus">+' + PETS.gain(p).total + '</b></span>'
      + '<span class="wtip">' + esc(S.wardrobeFullTip(FIT_FULL_AT, FIT_FULL_BONUS)) + '</span>'
      + '</div></div>'
      + '<div class="wrail">' + rail + '<span class="wsep"></span>' + scenes + '</div>'
      + '</div>'
      + '<div class="wbody">'
      + (isSlot ? slotHTML(tab) : (tab === 'sky' ? skyHTML() : fxHTML()))
      + '<p class="hint shelfsay" id="wsay" hidden></p>'
      + '</div>'
      + '<div class="wfoot">'
      + looksHTML()
      + '<div class="row3 wacts">'
      + '<button type="button" class="btn" id="wstrip">🧺 ' + esc(S.wardrobeStrip) + '</button>'
      + '<button type="button" class="btn" id="wrandom">🎲 ' + esc(S.wardrobeRandom) + '</button>'
      + '<button type="button" class="btn primary" data-dclose="1">' + esc(S.sheetClose) + '</button>'
      + '</div></div>'
      + '</div></div>';
    wire();
  };

  /* Says why, where the tap happened, instead of throwing the visitor at the
     price list and losing the screen they were looking at. */
  const sayLocked = (name, tier) => {
    const S = T(), say = $('#wsay', host);
    if (!say) { toast(tier === 'pro' ? S.wardrobeNeedPro : S.wardrobeNeedPlus); return; }
    say.hidden = false;
    say.innerHTML = esc((tier === 'pro' ? S.wardrobeProItem : S.wardrobePlusItem)(name))
      + ' <a href="#/unlock?from=app">' + esc(S.unlockLink) + ' →</a>';
  };

  function wire() {
    const S = T();
    $$('[data-dclose]', host).forEach((b) => b.addEventListener('click', close));
    $$('[data-tab]', host).forEach((b) => b.addEventListener('click', () => { tab = b.getAttribute('data-tab'); draw(); }));

    $$('[data-wear]', host).forEach((b) => b.addEventListener('click', () => {
      const parts = b.getAttribute('data-wear').split(':'), slot = parts[0], id = parts[1];
      if (id !== 'none') {
        const x = wearOf(id);
        if (!x) return;
        if (!wearOn(x)) { sayLocked(L(x.name), x.tier); return; }
      }
      const p = pet();
      /* A second tap on the piece already on takes it off, which is what a
         person expects of a thing that is drawn as pressed. */
      const already = PETS.fit(p)[slot] === id && id !== 'none';
      PETS.dress(p, slot, already ? 'none' : id);
      sparkle();
      /* Only the two tiles whose state changed, and the preview. */
      $$('[data-wear^="' + slot + ':"]', host).forEach((o) => {
        const oid = o.getAttribute('data-wear').split(':')[1];
        const on = PETS.fit(pet())[slot] === oid || (oid === 'none' && PETS.fit(pet())[slot] === 'none');
        o.classList.toggle('on', on);
        o.setAttribute('aria-pressed', on ? 'true' : 'false');
        const mark = $('.won', o);
        if (on && !mark) { const t = document.createElement('span'); t.className = 'won'; t.textContent = '✓'; o.appendChild(t); }
        if (!on && mark) mark.remove();
      });
      const railBtn = $('[data-tab="' + slot + '"]', host);
      if (railBtn) {
        const wid = PETS.fit(pet())[slot], worn = wid && wid !== 'none';
        railBtn.classList.toggle('worn', !!worn);
        const th = $('.wthumb', railBtn);
        if (th) th.innerHTML = worn ? wearTile(wid) : '<i>' + petSlot(slot).ic + '</i>';
      }
      repaint();
    }));

    $$('[data-sky]', host).forEach((b) => b.addEventListener('click', () => {
      const id = b.getAttribute('data-sky'), s = skyOf(id);
      if (!tierOn(s.tier)) { sayLocked(L(T().skyNames[id]) || id, s.tier); return; }
      PETS.setSky(pet(), id); draw(); repaint();
    }));
    $$('[data-fx]', host).forEach((b) => b.addEventListener('click', () => {
      const id = b.getAttribute('data-fx'), f = fxOf(id);
      if (!tierOn(f.tier)) { sayLocked(L(T().fxNames[id]) || id, 'pro'); return; }
      PETS.setFx(pet(), id); draw(); repaint();
    }));

    { const sb = $('#wstrip', host); if (sb) sb.addEventListener('click', () => { PETS.strip(pet()); draw(); }); }
    { const rb = $('#wrandom', host); if (rb) rb.addEventListener('click', () => { surprise(); draw(); sparkle(); }); }

    $$('[data-look-on]', host).forEach((b) => b.addEventListener('click', () => {
      const l = looksGet(kind)[Number(b.getAttribute('data-look-on'))];
      if (!l) return;
      const p = pet();
      PET_SLOT_IDS.forEach((s) => { PETS.dress(p, s, (l.fit && l.fit[s]) || 'none'); });
      if (l.sky) PETS.setSky(pet(), l.sky);
      if (l.fx) PETS.setFx(pet(), l.fx);
      draw(); sparkle();
    }));
    $$('[data-look-save]', host).forEach((b) => b.addEventListener('click', () => {
      const p = pet();
      looksPut(kind, Number(b.getAttribute('data-look-save')), { fit: PETS.fit(p), sky: PETS.sky(p).id, fx: PETS.fx(p).id });
      toast(S.wardrobeSaved); draw();
    }));
  }

  /* A complete look, out of what this visitor actually owns - so the free
     visitor gets the two free pieces rather than a locked fantasy. */
  const surprise = () => {
    const p = pet();
    PET_SLOT_IDS.forEach((slot) => {
      const mine = wearIn(slot).filter(wearOn);
      if (!mine.length) { PETS.dress(p, slot, 'none'); return; }
      PETS.dress(p, slot, mine[Math.floor(Math.random() * mine.length)].id);
    });
    const skies = PET_SKIES.filter((s) => tierOn(s.tier));
    PETS.setSky(pet(), skies[Math.floor(Math.random() * skies.length)].id);
    const fx = PET_FX.filter((f) => tierOn(f.tier));
    if (fx.length > 1) PETS.setFx(pet(), fx[Math.floor(Math.random() * fx.length)].id);
  };

  /* A short burst over the preview when something goes on. Nodes are removed
     when they finish, so nothing accumulates over a long session of dressing. */
  const sparkle = () => {
    const box = $('#dressstage', host);
    if (!box) return;
    const wrap = document.createElement('span');
    wrap.className = 'wsparks';
    let html = '';
    for (let i = 0; i < 7; i++) {
      html += '<i style="left:' + (14 + Math.round(Math.random() * 72)) + '%;top:' + (16 + Math.round(Math.random() * 60))
        + '%;animation-delay:' + (i * 70) + 'ms">' + ['✨', '⭐', '💫'][i % 3] + '</i>';
    }
    wrap.innerHTML = html;
    box.appendChild(wrap);
    setTimeout(() => wrap.remove(), 1100);
  };

  draw();
}
