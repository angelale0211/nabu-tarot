# -*- coding: utf-8 -*-
"""Where does the companion actually sit, and is any of it cut off?

Two questions the contact sheets cannot answer, because they render the art on
its own rather than inside the box it has to live in:

  1. Is the drawing centred in its stage, or shoved into a corner?
  2. Does any worn piece reach outside the 120x120 the art is drawn in, so the
     viewBox clips it? A hat that loses its tip is only visible if you look for
     it, which is how it survives a contact sheet.

  python test/wardrobe_fit_probe.py
"""
import os, sys, http.server, socketserver, threading, functools

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
PORT = 8804

# Anything that reaches the very edge of the viewBox is a candidate for being
# clipped; the tall head pieces are the ones to watch.
BOUNDS = """
() => {
  const out = [];
  const holder = document.createElement('div');
  holder.style.cssText = 'position:fixed;left:-9999px;top:0;width:240px;height:240px';
  document.body.appendChild(holder);
  for (const item of window.NABU.PET_WARDROBE) {
    holder.innerHTML = '<svg viewBox="0 0 120 120" width="240" height="240">'
      + window.NABU.wearDraw(item.id, window.NABU.WEAR_DEF) + '</svg>';
    const svg = holder.firstChild;
    let box = null;
    try { box = svg.getBBox(); } catch (e) { box = null; }
    if (box) {
      out.push({ id: item.id, slot: item.slot,
        x: +box.x.toFixed(1), y: +box.y.toFixed(1),
        r: +(box.x + box.width).toFixed(1), b: +(box.y + box.height).toFixed(1) });
    }
  }
  holder.remove();
  return out;
}
"""

PLACE = """
() => {
  const pick = (sel) => document.querySelector(sel);
  const rect = (el) => { const r = el.getBoundingClientRect(); return {l:r.left, t:r.top, w:r.width, h:r.height}; };
  const stage = pick('#petstage') || pick('.petstage');
  if (!stage) return null;
  const art = stage.querySelector('.petart');
  if (!art) return null;
  const s = rect(stage), a = rect(art);
  return {
    stage: s, art: a,
    leftGap: +(a.l - s.l).toFixed(1),
    rightGap: +((s.l + s.w) - (a.l + a.w)).toFixed(1),
    topGap: +(a.t - s.t).toFixed(1),
    bottomGap: +((s.t + s.h) - (a.t + a.h)).toFixed(1)
  };
}
"""


def serve():
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT)
    socketserver.TCPServer.allow_reuse_address = True
    httpd = socketserver.TCPServer(('127.0.0.1', PORT), handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd


SEED = """() => {
  localStorage.setItem('nabu-pets', JSON.stringify([{ kind:'cat', coat:'cream',
    fit:{back:'mantle',bottom:'courtskirt',top:'starrobe',hem:'feathertrim',neck:'pearls',face:'starmask',head:'phoenixcrown'},
    sky:'starry', fx:'twinkle', home:'palace', food:'rice', name:'', streak:3, meals:9, xp:120, last:0, fed:'', pray:'' }]));
  localStorage.setItem('nabu-access', JSON.stringify({ pro:'2099-01-01', plus:'2099-01-01' }));
}"""


def main():
    httpd = serve()
    from playwright.sync_api import sync_playwright
    fails = []
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        page = browser.new_page(viewport={'width': 412, 'height': 900})
        base = 'http://127.0.0.1:%d/index.html' % PORT
        page.goto(base + '#/home', wait_until='load')
        page.evaluate(SEED)

        # --- 1. does any piece reach outside the 120x120 it is drawn in? ---
        page.goto(base + '#/pet', wait_until='load')
        page.wait_for_timeout(1500)
        bounds = page.evaluate(BOUNDS)
        out = [b for b in bounds if b['x'] < -0.5 or b['y'] < -0.5 or b['r'] > 120.5 or b['b'] > 120.5]
        print('\npieces drawn outside the 120x120 frame (these get clipped):')
        if not out:
            print('  none')
        for b in sorted(out, key=lambda z: z['slot']):
            over = []
            if b['y'] < -0.5: over.append('%.1f above the top' % -b['y'])
            if b['x'] < -0.5: over.append('%.1f past the left' % -b['x'])
            if b['r'] > 120.5: over.append('%.1f past the right' % (b['r'] - 120))
            if b['b'] > 120.5: over.append('%.1f below the bottom' % (b['b'] - 120))
            print('  %-8s %-16s %s' % (b['slot'], b['id'], ', '.join(over)))
            fails.append('%s is clipped (%s)' % (b['id'], ', '.join(over)))

        # --- 2. where does the companion sit on the game stage? ---
        game = page.evaluate(PLACE)
        print('\non the companion screen:')
        if game:
            print('  stage %.0fx%.0f, art %.0fx%.0f' % (game['stage']['w'], game['stage']['h'], game['art']['w'], game['art']['h']))
            print('  gaps  left %.0f  right %.0f  top %.0f  bottom %.0f' % (game['leftGap'], game['rightGap'], game['topGap'], game['bottomGap']))
            for side in ('leftGap', 'rightGap', 'topGap', 'bottomGap'):
                if game[side] < -1:
                    fails.append('companion screen: art hangs %.0fpx outside the %s' % (-game[side], side[:-3]))

        # --- 3. and in the wardrobe preview? ---
        page.locator('#opendress').click()
        page.wait_for_timeout(700)
        prev = page.evaluate("""() => {
          const stage = document.querySelector('#dressstage');
          const art = stage && stage.querySelector('.petart');
          if (!stage || !art) return null;
          const s = stage.getBoundingClientRect(), a = art.getBoundingClientRect();
          return { stage:{w:s.width,h:s.height}, art:{w:a.width,h:a.height},
            leftGap:+(a.left-s.left).toFixed(1), rightGap:+((s.right)-(a.right)).toFixed(1),
            topGap:+(a.top-s.top).toFixed(1), bottomGap:+((s.bottom)-(a.bottom)).toFixed(1) };
        }""")
        print('\nin the wardrobe preview:')
        if prev:
            print('  stage %.0fx%.0f, art %.0fx%.0f' % (prev['stage']['w'], prev['stage']['h'], prev['art']['w'], prev['art']['h']))
            print('  gaps  left %.0f  right %.0f  top %.0f  bottom %.0f' % (prev['leftGap'], prev['rightGap'], prev['topGap'], prev['bottomGap']))
            skew = abs(prev['leftGap'] - prev['rightGap'])
            if skew > 8:
                fails.append('wardrobe preview: art is %.0fpx off centre horizontally' % skew)
            for side in ('leftGap', 'rightGap', 'topGap', 'bottomGap'):
                if prev[side] < -1:
                    fails.append('wardrobe preview: art hangs %.0fpx outside the %s' % (-prev[side], side[:-3]))
        browser.close()
    httpd.shutdown()

    print('')
    if fails:
        print('FAIL')
        for f in fails:
            print('  - ' + f)
        return 1
    print('the companion sits inside its stage, and nothing is clipped')
    return 0


if __name__ == '__main__':
    sys.exit(main())
