# -*- coding: utf-8 -*-
"""Layout probe: render screens at many widths in two engines and measure what
is wrong with the geometry. Companion to PLAN-LAYOUT-AUDIT.md.

It measures; it does not judge. Every flag names a route, a width, an engine,
an element and a number, and every render leaves a screenshot behind.

  python test/layout_probe.py --help
  python test/layout_probe.py --family A                  # one family, all widths
  python test/layout_probe.py --routes learn/card/major-0 --widths 1280
  python test/layout_probe.py --all --json test/_probe/run1.json

Kinds of flag:
  pagescroll  the window scrolls sideways
  overflow    an element sticks out of the window
  clipped     a box hides its own content
  longline    a line of text runs too long (chars per line)
  orphan      a block far wider than the content in it   (desk only)
  void        a big empty gap between two blocks         (desk only)
  lonecell    a multi-column grid holding one thing
  tap         a control under 40px                       (phone only)
  tinytext    text under 12px                            (phone only)
  contrast    text against its background, with --contrast
"""
import argparse, io, json, os, subprocess, sys, time, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SHOTS = os.path.join(HERE, '_probe')
PORT = 8799

PHONE = [360, 390, 430]
DESK = [1024, 1280, 1536]
ALL_W = PHONE + [768] + DESK

# Screen families, as in PLAN-LAYOUT-AUDIT.md section 2.1.
FAMILIES = {
    'A': ['learn/card/major-0', 'learn/card/major-13', 'learn/card/wands-7', 'learn/card/cups-c2',
          'learn/len/1', 'learn/len/16', 'learn/pc/hA', 'learn/sign/leo', 'learn/sign/pis',
          'learn/guide/tarot-start', 'learn/guide/mani-woop', 'learn/guide/tarot-overview',
          'learn/lesson/tarot/1', 'learn/lesson/lenormand/2',
          'learn/spread/tarot-3', 'learn/spread/tarot-celtic', 'learn/angel/111'],
    'B': ['learn', 'learn/tarot', 'learn/tarot?tab=spreads', 'learn/tarot?tab=guides',
          'learn/lenormand', 'learn/lenormand?tab=cards', 'learn/playing', 'learn/astro',
          'learn/fortune/animals', 'learn/fortune/palm', 'learn/fortune/numbers', 'learn/fortune/tea',
          'learn/manifest', 'learn/numbers', 'learn/quiz/tarot/1', 'unlock'],
    'G': ['learn/tarot', 'learn/lenormand', 'learn/playing', 'learn/card/major-0', 'learn/manifest'],
    'C': ['home', 'news', 'hello', 'install', 'alerts'],
    'D': ['pick', 'play', 'play/coin', 'play/tree', 'pet', 'love', 'wedding', 'looks', 'rewards'],
    'E': ['prices', 'book', 'contact', 'report', 'privacy', 'me'],
    'F': ['admin', 'admin?tab=inbox', 'admin?tab=bookings', 'admin?tab=codes'],
}

SEED = """try{
localStorage.setItem('nabu-profile', JSON.stringify({name:'Lan',birthday:'1998-08-05',interests:['love','astro','manifest'],tourDone:true}));
localStorage.setItem('nabu-access', JSON.stringify({tarot:'2099-01-01',lenormand:'2099-01-01',playing:'2099-01-01',manifest:'2099-01-01',coin:'2099-01-01',tree:'2099-01-01',luck:'2099-01-01'}));
localStorage.setItem('nabu-admin','1');
}catch(e){}"""


# The same seed without any course open, so the paywall and the free demo render.
SEED_LOCKED = SEED.split("localStorage.setItem('nabu-access'")[0] + "}catch(e){}"


def serve():
    try:
        urllib.request.urlopen('http://127.0.0.1:%d/' % PORT, timeout=3)
        return None
    except Exception:
        p = subprocess.Popen([sys.executable, '-m', 'http.server', str(PORT)], cwd=ROOT,
                             stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        time.sleep(2)
        return p


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--family', action='append', choices=sorted(FAMILIES), help='screen family, repeatable')
    ap.add_argument('--routes', nargs='*', help='routes without the leading #/')
    ap.add_argument('--all', action='store_true', help='every family')
    ap.add_argument('--widths', nargs='*', type=int, help='default: all seven')
    ap.add_argument('--engine', choices=['edge', 'webkit', 'both'], default='edge')
    ap.add_argument('--lang', default='vi')
    ap.add_argument('--theme', default='', help='light, dark or pink; blank = the app default')
    ap.add_argument('--locked', action='store_true', help='no course access, so the free demo is what renders')
    ap.add_argument('--contrast', action='store_true', help='also measure text contrast')
    ap.add_argument('--json', default=os.path.join(SHOTS, 'findings-raw.json'))
    ap.add_argument('--shots', default='flagged', choices=['all', 'flagged', 'none'])
    ap.add_argument('--quiet', action='store_true')
    a = ap.parse_args()

    routes = list(a.routes or [])
    for f in (sorted(FAMILIES) if a.all else (a.family or [])):
        routes += FAMILIES[f]
    if not routes:
        routes = FAMILIES['A']
    widths = a.widths or ALL_W
    engines = ['edge', 'webkit'] if a.engine == 'both' else [a.engine]

    from playwright.sync_api import sync_playwright
    os.makedirs(SHOTS, exist_ok=True)
    probe = io.open(os.path.join(HERE, 'layout_probe.js'), encoding='utf-8').read()
    proc = serve()
    rows, renders = [], 0
    try:
        with sync_playwright() as p:
            for eng in engines:
                b = p.chromium.launch(channel='msedge') if eng == 'edge' else p.webkit.launch()
                for w in widths:
                    desk = w >= 900
                    ctx = b.new_context(viewport={'width': w, 'height': 900}, device_scale_factor=1,
                                        is_mobile=not desk, has_touch=not desk)
                    ctx.add_init_script(SEED_LOCKED if a.locked else SEED)
                    ctx.add_init_script("try{localStorage.setItem('nabu-lang', JSON.stringify('%s'))}catch(e){}" % a.lang)
                    if a.theme:
                        ctx.add_init_script("try{localStorage.setItem('nabu-theme', JSON.stringify('%s'))}catch(e){}" % a.theme)
                    for r in routes:
                        pg = ctx.new_page()
                        try:
                            pg.goto('http://127.0.0.1:%d/index.html#/%s' % (PORT, r), wait_until='domcontentloaded')
                            pg.wait_for_selector('#main > *', timeout=9000)
                            pg.wait_for_timeout(1400)
                            found = pg.evaluate(probe, {'desk': desk, 'width': w, 'contrast': bool(a.contrast)})
                        except Exception as e:
                            found = [{'kind': 'error', 'sel': '', 'n': 0, 'note': str(e)[:120], 'text': ''}]
                        renders += 1
                        tag = '%s_%d_%s' % (eng, w, r.replace('/', '_').replace('?', '~').replace('=', '-'))
                        if a.shots == 'all' or (a.shots == 'flagged' and found):
                            try:
                                pg.screenshot(path=os.path.join(SHOTS, tag + '.png'), full_page=True)
                            except Exception:
                                pass
                        for f in found:
                            f.update({'route': r, 'width': w, 'engine': eng, 'shot': tag + '.png'})
                            rows.append(f)
                        if not a.quiet:
                            mark = '.' if not found else str(len(found))
                            sys.stdout.write(mark)
                            sys.stdout.flush()
                        pg.close()
                    ctx.close()
                b.close()
    finally:
        if proc:
            proc.terminate()

    io.open(a.json, 'w', encoding='utf-8').write(json.dumps(rows, ensure_ascii=False, indent=1))
    print('\n%d renders, %d flags -> %s' % (renders, len(rows), a.json))
    by_kind, by_route = {}, {}
    for f in rows:
        by_kind[f['kind']] = by_kind.get(f['kind'], 0) + 1
        by_route.setdefault(f['route'], set()).add(f['kind'])
    print('\nby kind:')
    for k in sorted(by_kind, key=lambda k: -by_kind[k]):
        print('  %-11s %4d' % (k, by_kind[k]))
    print('\nby route:')
    for r in sorted(by_route):
        print('  %-34s %s' % (r, ' '.join(sorted(by_route[r]))))


if __name__ == '__main__':
    main()
