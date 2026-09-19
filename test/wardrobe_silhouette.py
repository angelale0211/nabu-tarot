# -*- coding: utf-8 -*-
"""Are any two pieces the same shape?

The node checks compare markup, and markup comparison has no teeth here: run
against the first catalogue, whose four back pieces were one cape outline in
four colours, it passed all four - their numbers differed enough to read as
different geometry while the silhouette was identical.

Shape is a pixel question, so this answers it in pixels. Every piece is drawn
alone, rasterised, and reduced to two edge profiles - where the ink starts and
where it stops down each column. Colour is discarded before the comparison, so
a recolour cannot hide.

  python test/wardrobe_silhouette.py             # report, fail over the limit
  python test/wardrobe_silhouette.py --top 20    # just show the closest pairs
"""
import argparse, os, sys, http.server, socketserver, threading, functools, json

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
PORT = 8803
COLS = 60          # sample columns across the 120-wide drawing
LIMIT = 0.97       # see the calibration note below

# Calibrated against cases known to be wrong rather than picked to pass. When
# this probe was first run the four back pieces really were one cape outline in
# four colours and the robes shared a body path exactly: those scored 0.98 to
# 1.00. Two garments that merely occupy the same part of the body - any two
# skirts, a jumper and a hoodie - sit at 0.93 to 0.96 and look nothing alike on
# the contact sheet. So 0.97 is where copying starts, and the band below it is
# what wearing the same region costs you.

# Overlap of area is the wrong question: every skirt in the bottom slot covers
# the same part of the body, so any two of them share ~85% of their pixels no
# matter how different they look. What tells a scalloped hem from a pointed one
# is the OUTLINE - where the ink starts and stops down each column. So each
# piece is reduced to two profiles, its top edge and its bottom edge, and those
# are what get compared.

MEASURE = """
(grid) => {
  const out = {};
  const cv = document.createElement('canvas');
  cv.width = 120; cv.height = 120;
  const ctx = cv.getContext('2d', { willReadFrequently: true });
  const load = (svg) => new Promise((res) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = () => res(null);
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">' + svg + '</svg>');
  });
  return (async () => {
    for (const item of window.NABU.PET_WARDROBE) {
      const svg = window.NABU.wearDrawRaw(item.id);
      const img = await load(svg);
      ctx.clearRect(0, 0, 120, 120);
      if (img) ctx.drawImage(img, 0, 0, 120, 120);
      const px = ctx.getImageData(0, 0, 120, 120).data;
      /* Colour is thrown away here - only whether a pixel was painted. For each
         sampled column, the first and last painted row: the top edge and the
         bottom edge of the piece. -1 where the column is empty. */
      const step = 120 / grid, top = [], bot = [];
      let ink = 0;
      for (let c = 0; c < grid; c++) {
        let hi = -1, lo = -1;
        for (let x = Math.floor(c * step); x < Math.floor((c + 1) * step); x++) {
          for (let y = 0; y < 120; y++) {
            if (px[(y * 120 + x) * 4 + 3] > 40) {
              ink++;
              if (hi < 0 || y < hi) hi = y;
              if (y > lo) lo = y;
            }
          }
        }
        top.push(hi < 0 ? -1 : hi / 120);
        bot.push(lo < 0 ? -1 : lo / 120);
      }
      out[item.id] = { top: top, bot: bot, ink: ink / (120 * 120) };
    }
    return out;
  })();
}
"""


def serve():
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT)
    socketserver.TCPServer.allow_reuse_address = True
    httpd = socketserver.TCPServer(('127.0.0.1', PORT), handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd


def outline_match(a, b):
    """1.0 means the two pieces begin and end at the same height in every
    column - the same outline. A column filled in one and empty in the other
    counts as a full disagreement."""
    diffs = []
    for key in ('top', 'bot'):
        pa, pb = a[key], b[key]
        for i in range(len(pa)):
            x, y = pa[i], pb[i]
            if x < 0 and y < 0:
                continue
            diffs.append(1.0 if (x < 0) != (y < 0) else abs(x - y))
    if not diffs:
        return 0.0
    shape = 1.0 - (sum(diffs) / len(diffs))
    # two pieces of very different weight are not the same design even if their
    # edges agree, so bulk pulls the score down
    bulk = 1.0 - abs(a['ink'] - b['ink']) / max(a['ink'], b['ink'], 1e-6)
    return shape * 0.8 + bulk * 0.2


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--top', type=int, default=0, help='print the N closest pairs and exit 0')
    ap.add_argument('--limit', type=float, default=LIMIT)
    args = ap.parse_args()

    httpd = serve()
    from playwright.sync_api import sync_playwright
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        page = browser.new_page(viewport={'width': 500, 'height': 700})
        page.goto('http://127.0.0.1:%d/index.html#/home' % PORT, wait_until='load')
        page.wait_for_timeout(1500)
        # the art functions want the anchors a companion publishes; give them the defaults
        page.evaluate("() => { window.NABU.wearDrawRaw = (id) => window.NABU.wearDraw(id, window.NABU.WEAR_DEF); }")
        masks = page.evaluate(MEASURE, COLS)
        catalogue = page.evaluate("() => window.NABU.PET_WARDROBE.map(x => ({id:x.id, slot:x.slot, col:x.col}))")
        browser.close()
    httpd.shutdown()

    empty = [i for i, m in masks.items() if m['ink'] == 0]
    by_slot = {}
    for it in catalogue:
        by_slot.setdefault(it['slot'], []).append(it)

    pairs = []
    for slot, items in by_slot.items():
        for i in range(len(items)):
            for j in range(i + 1, len(items)):
                a, b = items[i]['id'], items[j]['id']
                if a not in masks or b not in masks:
                    continue
                pairs.append((outline_match(masks[a], masks[b]), slot, a, b))
    pairs.sort(reverse=True)

    print('\n%d pieces measured over %d columns\n' % (len(masks), COLS))
    if empty:
        print('EMPTY (drew nothing at all): ' + ', '.join(empty) + '\n')

    show = args.top if args.top else 12
    print('closest %d pairs (1.00 would be the same outline):' % show)
    for score, slot, a, b in pairs[:show]:
        flag = '  <-- too close' if score >= args.limit else ''
        print('  %.2f  %-7s %-16s %s%s' % (score, slot, a, b, flag))

    if args.top:
        return 0
    # The hem slot cannot be judged this way and saying otherwise would be a
    # lie dressed as a check: every hem is a strip along the same bottom edge,
    # so their top and bottom profiles agree by construction whatever is drawn
    # in between - pom-poms, tassels, bells and feathers all score ~0.97
    # against each other while looking nothing alike. Those pairs are printed
    # for the eye and settled on the contact sheet, not failed here.
    over = [p for p in pairs if p[0] >= args.limit and p[1] != 'hem']
    hem_close = [p for p in pairs if p[0] >= args.limit and p[1] == 'hem']
    print('')
    if empty:
        print('FAIL: %d piece(s) drew nothing' % len(empty))
    if over:
        print('FAIL: %d pair(s) at or over %.2f share an outline' % (len(over), args.limit))
        for score, slot, a, b in over:
            print('   %s: %s / %s  (%.2f)' % (slot, a, b, score))
    if hem_close:
        print('%d hem pair(s) score high; the hem slot is a strip by construction,' % len(hem_close))
        print('so judge those on test/_probe/wardrobe-chromium.png rather than here.')
    if not over and not empty:
        best = max([p[0] for p in pairs if p[1] != 'hem'] or [0])
        print('no two pieces share an outline outside the hem slot (highest %.2f, limit %.2f)'
              % (best, args.limit))
        return 0
    return 1


if __name__ == '__main__':
    sys.exit(main())
