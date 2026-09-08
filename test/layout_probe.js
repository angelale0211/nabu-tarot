/* Measures one rendered screen and returns a list of layout problems.
   It measures; it does not judge. The caller decides what matters.
   Runs inside the page via Playwright's evaluate(), given { desk, width }. */
(opts) => {
  const desk = opts.desk, vw = document.documentElement.clientWidth, out = [];
  const seen = {};
  const add = (kind, el, n, note) => {
    const sel = (el.tagName || '?').toLowerCase()
      + (el.id ? '#' + el.id : '')
      + (typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/).join('.') : '');
    const k = kind + '|' + sel + '|' + (note || '');
    if (seen[k]) return; seen[k] = 1;
    out.push({ kind: kind, sel: sel, n: Math.round(n * 10) / 10, note: note || '',
      text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 48) });
  };
  /* Inside a sideways scroller, sitting past the window edge is the point. */
  const inScroller = (el) => {
    for (let n = el.parentElement; n && n !== document.body; n = n.parentElement) {
      const o = getComputedStyle(n).overflowX;
      if (o === 'auto' || o === 'scroll') return true;
    }
    return false;
  };
  const vis = (el) => { const s = getComputedStyle(el); return s.display !== 'none' && s.visibility !== 'hidden' && Number(s.opacity) > 0.05; };
  const main = document.getElementById('main');
  if (!main) return [{ kind: 'nomain', sel: '#main', n: 0, note: '', text: '' }];
  const all = Array.from(document.querySelectorAll('#main *, #backbar *, #homefoot *, .foot *'))
    .filter(vis).filter((el) => !(el.ownerSVGElement));

  /* ---- the page must not scroll sideways ---- */
  if (document.documentElement.scrollWidth > vw + 1) {
    out.push({ kind: 'pagescroll', sel: 'html', n: document.documentElement.scrollWidth - vw, note: 'vw ' + vw, text: '' });
  }
  all.forEach((el) => {
    const r = el.getBoundingClientRect();
    if (!r.width && !r.height) return;
    /* ---- overflow: anything sticking out of the window ---- */
    if ((r.right > vw + 1 || r.left < -1) && !inScroller(el)) add('overflow', el, r.right > vw + 1 ? r.right - vw : r.left, 'l=' + Math.round(r.left) + ' r=' + Math.round(r.right));
    /* ---- clipped: a box hiding its own content ---- */
    const s = getComputedStyle(el);
    if ((s.overflow === 'hidden' || s.overflowX === 'hidden' || s.overflowY === 'hidden')
      && (el.scrollWidth > el.clientWidth + 2 || el.scrollHeight > el.clientHeight + 2)
      && el.clientWidth > 0 && !el.matches('.tabs,.chips,.fan,.deck,.grid,.ai-chat,.chat,.rail,.clamp,[data-clip-ok]')
      && !(s.textOverflow === 'ellipsis' && s.whiteSpace === 'nowrap')) {
      add('clipped', el, Math.max(el.scrollWidth - el.clientWidth, el.scrollHeight - el.clientHeight), 'sw ' + el.scrollWidth + '/' + el.clientWidth);
    }
    /* ---- tap targets and tiny text, phones only ---- */
    if (!desk) {
      if (el.matches('button,a,input,select,[role=button]') && r.width > 0 && r.height > 0
        && !el.matches('.tabs button,.chips .chip,.kwl span,.foot a,.sico,a.back,#backbar a,.nav a,.sr,[hidden]') && !el.matches('p a,li a,.hint a,.muted a,.faint a,label input,label>*')
        && (r.height < 40 || r.width < 40)) add('tap', el, Math.min(r.width, r.height), Math.round(r.width) + 'x' + Math.round(r.height));
      const fs = parseFloat(s.fontSize);
      if (fs && fs < 12 && (el.textContent || '').trim().length > 12 && el.children.length === 0) add('tinytext', el, fs, '');
    }
  });

  /* ---- how long a line of text runs ---- */
  const lineChars = (el) => {
    const t = (el.textContent || '').trim();
    if (t.length < 60) return 0;
    const rng = document.createRange(); rng.selectNodeContents(el);
    const rects = Array.from(rng.getClientRects()).filter((r) => r.height > 2 && r.width > 2);
    if (!rects.length) return 0;
    /* client rects come one per line box, but inline children split them, so
       group by rounded top instead of counting rects. */
    const tops = {}; rects.forEach((r) => { tops[Math.round(r.top)] = 1; });
    const lines = Object.keys(tops).length;
    return lines ? t.length / lines : 0;
  };
  Array.from(document.querySelectorAll('#main p, #main li, #main .a, #main .scene, #main .lead, #main .muted, #main .hint, #main dd'))
    .filter(vis).forEach((el) => {
      const c = lineChars(el);
      /* A caption at 12px fits more characters in the same ribbon than body
         text does, and reads fine that way; only running text is measured. */
      if (parseFloat(getComputedStyle(el).fontSize) < 14) return;
      /* What counts as too long is what the screen can hold. A 390px phone
         fits about fifty characters and a tablet nearer eighty, so a tablet
         is measured against the same figure as a desk. */
      if (c > (opts.width >= 600 ? 85 : 52)) add('longline', el, c, '');
    });

  /* ---- a block far wider than the content inside it ---- */
  const spread = (el) => {
    let lo = Infinity, hi = -Infinity;
    Array.from(el.querySelectorAll('*')).filter(vis).forEach((k) => {
      if (k.children.length && !k.matches('img,svg,input,textarea,button,a')) return;
      const r = k.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return;
      lo = Math.min(lo, r.left); hi = Math.max(hi, r.right);
    });
    if (hi > lo) return hi - lo;
    /* No element children: the content is the text itself, so measure that. */
    const t = (el.textContent || '').trim();
    if (!t) return 0;
    const rng = document.createRange(); rng.selectNodeContents(el);
    const rects = Array.from(rng.getClientRects()).filter((r) => r.height > 2 && r.width > 2);
    rects.forEach((r) => { lo = Math.min(lo, r.left); hi = Math.max(hi, r.right); });
    return hi > lo ? hi - lo : 0;
  };
  if (desk) {
    Array.from(document.querySelectorAll('#main > *, #main .detail > *, #main .guide > *, #main .sec > *, #main .ins'))
      .filter(vis).forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width < 320 || r.height < 24) return;
        if (el.matches('p,h1,h2,h3,ul,ol,.eyebrow,.muted,.hint,.faint')) return;
        /* A row of chips or buttons is content that flows and stops; it is
           not meant to reach the far edge. */
        if (el.matches('.kwl,.chips,.row,.mini,.btns,.seen,.keys,.tags,.tabs,.block,.btn')) return;
        if (el.matches('.fan,.deck,.awheel,.ring,.ringwrap,.tree,.treestage,.petstage,.petwrap,.spread-d,.starwheel,.keypad,.coin,script,style')) return;
        const w = spread(el);
        if (w && w / r.width < 0.55) add('orphan', el, Math.round((w / r.width) * 100), 'content ' + Math.round(w) + ' of ' + Math.round(r.width));
      });
    /* ---- blocks that do not line up with each other ----
       A paragraph capped at a reading width above a card that runs the full
       row is what reads as the page being broken, even though neither block
       is wrong on its own. */
    {
      const tops = Array.from(main.children).filter(vis).filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 200 && r.height > 12 && !el.matches('aside,.side,script,style,.toast');
      });
      const w = tops.map((el) => Math.round(el.getBoundingClientRect().width));
      if (w.length > 1) {
        const lo = Math.min.apply(null, w), hi = Math.max.apply(null, w);
        if (hi - lo > 24) {
          /* A narrower block centred on the same axis reads as a subtitle,
             not as a line that stopped short. Only one pushed to a side is
             the thing this is looking for. */
          const mid = (el) => { const r = el.getBoundingClientRect(); return (r.left + r.right) / 2; };
          const axis = mid(tops[w.indexOf(hi)]);
          const off = tops.filter((el, i) => w[i] < hi - 24 && Math.abs(mid(el) - axis) > 8);
          if (off.length) {
            const odd = off[0];
            add('ragged', odd, Math.round(hi - odd.getBoundingClientRect().width),
              'narrowest ' + Math.round(odd.getBoundingClientRect().width) + ' of ' + hi + ', off axis');
          }
        }
      }
    }
    /* ---- a big empty gap between two blocks ---- */
    const kids = Array.from(main.children).filter(vis);
    for (let i = 1; i < kids.length; i++) {
      const a = kids[i - 1].getBoundingClientRect(), b = kids[i].getBoundingClientRect();
      if (b.top - a.bottom > 90) add('void', kids[i], b.top - a.bottom, 'after ' + kids[i - 1].className);
    }
  }

  /* ---- a multi-column grid holding one thing ---- */
  Array.from(document.querySelectorAll('#main .cardnav, #main .two, #main .row3, #main .tiles, #main .hgrid, #main .lookgrid, #main .themes'))
    .filter(vis).forEach((el) => {
      const cols = getComputedStyle(el).gridTemplateColumns.split(' ').filter((x) => x && x !== 'none').length;
      const kids = Array.from(el.children).filter(vis).filter((k) => (k.textContent || '').trim() || k.querySelector('svg,img'));
      if (cols > 1 && kids.length === 1) add('lonecell', el, cols, kids.length + ' of ' + cols);
    });

  /* ---- text you cannot read against what is behind it ---- */
  if (opts.contrast) {
    const lum = (c) => {
      const m = c.match(/[\d.]+/g); if (!m) return null;
      const f = m.slice(0, 3).map((v) => { v = v / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
      return 0.2126 * f[0] + 0.7152 * f[1] + 0.0722 * f[2];
    };
    const bgOf = (el) => {
      let n = el;
      while (n && n !== document.documentElement) {
        const b = getComputedStyle(n).backgroundColor;
        if (b && !/rgba\(0, 0, 0, 0\)|transparent/.test(b)) return b;
        n = n.parentElement;
      }
      return getComputedStyle(document.body).backgroundColor;
    };
    all.filter((el) => el.children.length === 0 && (el.textContent || '').trim().length > 3).forEach((el) => {
      const st = getComputedStyle(el), l1 = lum(st.color), l2 = lum(bgOf(el));
      if (l1 == null || l2 == null) return;
      const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      const fs = parseFloat(st.fontSize), big = fs >= 24 || (fs >= 18.66 && Number(st.fontWeight) >= 700);
      if (ratio < (big ? 3 : 4.5)) add('contrast', el, ratio, fs + 'px');
    });
  }
  return out;
}
