# -*- coding: utf-8 -*-
"""Wardrobe probe: draw every piece on every kind that matters, and look.

The pure checks in wardrobe_check.js prove a piece draws *something* balanced.
They cannot tell you a sleeve is on backwards or a hem has slid off the body.
The pet art comments record exactly that class of fault - feathers that came out
twice their intended length and left the frame - so this renders contact sheets
and leaves them for a person to scan.

  python test/wardrobe_probe.py              # three kinds, every piece
  python test/wardrobe_probe.py --all-kinds  # all eighteen, worst case only
"""
import argparse, os, sys, http.server, socketserver, threading, functools

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SHOTS = os.path.join(HERE, '_probe')
PORT = 8801

# One footed, one footless, one spirit beast: the three shapes a piece has to
# survive. The hem exists because eleven kinds look like the middle one.
KINDS = ['cat', 'crane', 'phoenix']

PAGE = """
(async () => {
  const kinds = %s;
  const out = document.createElement('div');
  out.id = 'probe';
  /* normal flow, not fixed: a fixed box screenshots only as far as the
     viewport reaches, which hid five of the six kinds the first time. */
  out.style.cssText = 'position:relative;background:#FBEEF2;padding:12px;font:12px system-ui';
  const cell = (label, svg) =>
    '<div style="width:112px;text-align:center;margin:0 0 8px">'
    + '<div class="petstage" style="width:104px;height:104px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;position:relative">' + svg + '</div>'
    + '<div style="font-size:9.5px;line-height:1.25;margin-top:2px;color:#5B4632">' + label + '</div></div>';
  let html = '';
  for (const kind of kinds) {
    html += '<h3 style="margin:10px 0 6px;font-size:13px">' + kind + '</h3>';
    html += '<div style="display:flex;flex-wrap:wrap;gap:6px">';
    for (const slot of window.NABU.PET_SLOTS) {
      for (const item of window.NABU.PET_WARDROBE.filter(x => x.slot === slot.id)) {
        const fit = {}; window.NABU.PET_SLOTS.forEach(s => { fit[s.id] = 'none'; });
        fit[slot.id] = item.id;
        html += cell(slot.id + ' / ' + item.id,
          window.NABU.petSVG(kind, window.NABU.PET_COATS[0], 'happy', fit, 'none'));
      }
    }
    html += '</div>';
    /* and the worst case: every slot filled at once, which is where pieces
       collide if they are going to */
    const full = {};
    window.NABU.PET_SLOTS.forEach(s => {
      const mine = window.NABU.PET_WARDROBE.filter(x => x.slot === s.id);
      full[s.id] = mine.length ? mine[0].id : 'none';
    });
    const fullPro = {};
    window.NABU.PET_SLOTS.forEach(s => {
      const mine = window.NABU.PET_WARDROBE.filter(x => x.slot === s.id && x.tier === 'pro');
      fullPro[s.id] = mine.length ? mine[0].id : 'none';
    });
    html += '<div style="display:flex;gap:6px;flex-wrap:wrap">'
      + cell('ALL SLOTS (first)', window.NABU.petSVG(kind, window.NABU.PET_COATS[0], 'happy', full, 'none'))
      + cell('ALL SLOTS (pro)', window.NABU.petSVG(kind, window.NABU.PET_COATS[0], 'happy', fullPro, 'none'))
      + window.NABU.PET_FX.map(f => cell('fx / ' + f.id,
          window.NABU.petSVG(kind, window.NABU.PET_COATS[0], 'happy', fullPro, f.id))).join('')
      + '</div>';
  }
  /* the skies, each over one home, which is what the sky tiles show */
  html += '<h3 style="margin:12px 0 6px;font-size:13px">skies over the palace</h3><div style="display:flex;flex-wrap:wrap;gap:6px">';
  for (const s of window.NABU.PET_SKIES) {
    html += cell('sky / ' + s.id,
      window.NABU.petHomeSVG('palace') + window.NABU.petSkySVG(s.id)
      + window.NABU.petSVG('cat', window.NABU.PET_COATS[0], 'happy', {}, 'none'));
  }
  html += '</div>';
  out.innerHTML = html;
  document.body.innerHTML = '';
  document.body.style.cssText = 'margin:0;background:#FBEEF2';
  document.body.appendChild(out);
  return out.scrollHeight;
})()
"""


def serve():
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT)
    socketserver.TCPServer.allow_reuse_address = True
    httpd = socketserver.TCPServer(('127.0.0.1', PORT), handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--all-kinds', action='store_true', help='all eighteen kinds')
    args = ap.parse_args()
    kinds = None
    if args.all_kinds:
        kinds = 'window.NABU.PET_KINDS'
    else:
        kinds = repr(KINDS).replace("'", '"')

    os.makedirs(SHOTS, exist_ok=True)
    httpd = serve()
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print('playwright is not installed:  pip install playwright && playwright install chromium')
        return 2
    with sync_playwright() as pw:
        for engine_name in ('chromium', 'firefox'):
            try:
                browser = getattr(pw, engine_name).launch()
            except Exception as e:
                print('%-9s skipped (%s)' % (engine_name, str(e).split('\n')[0][:60]))
                continue
            page = browser.new_page(viewport={'width': 900, 'height': 1200})
            errors = []
            page.on('pageerror', lambda e: errors.append(str(e)))
            page.goto('http://127.0.0.1:%d/index.html#/home' % PORT, wait_until='load')
            page.wait_for_timeout(1800)
            page.evaluate(PAGE % kinds)
            page.wait_for_timeout(900)
            shot = os.path.join(SHOTS, 'wardrobe-%s.png' % engine_name)
            page.screenshot(path=shot, full_page=True)
            print('%-9s %s' % (engine_name, shot))
            if errors:
                print('  page errors:')
                for e in errors[:8]:
                    print('   ', e[:160])
            browser.close()
    httpd.shutdown()
    return 0


if __name__ == '__main__':
    sys.exit(main())
