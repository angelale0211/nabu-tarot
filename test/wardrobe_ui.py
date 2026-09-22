# -*- coding: utf-8 -*-
"""Drive the wardrobe screen the way a person does, at each of the three tiers.

Opens the companion screen, opens the wardrobe, moves through the slot rail,
puts pieces on and takes them off, saves and restores a look, and screenshots
what a free visitor, a Plus subscriber and a Pro subscriber each see.

  python test/wardrobe_ui.py
"""
import os, sys, http.server, socketserver, threading, functools

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SHOTS = os.path.join(HERE, '_probe')
PORT = 8802

# A day far enough ahead that the entitlement reads as live.
SEED = """(tier) => {
  localStorage.setItem('nabu-pets', JSON.stringify([{ kind:'cat', coat:'cream', wear:'hat',
    home:'palace', food:'rice', name:'', streak:3, meals:9, xp:120, last:0, fed:'', pray:'' }]));
  const acc = {};
  if (tier === 'plus') acc.plus = '2099-01-01';
  if (tier === 'pro') { acc.pro = '2099-01-01'; acc.plus = '2099-01-01'; }
  localStorage.setItem('nabu-access', JSON.stringify(acc));
  localStorage.removeItem('nabu-pet-looks');
}"""


def serve():
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT)
    socketserver.TCPServer.allow_reuse_address = True
    httpd = socketserver.TCPServer(('127.0.0.1', PORT), handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd


def main():
    os.makedirs(SHOTS, exist_ok=True)
    httpd = serve()
    from playwright.sync_api import sync_playwright
    fails = []
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        for tier in ('free', 'plus', 'pro'):
            page = browser.new_page(viewport={'width': 412, 'height': 900})
            errs = []
            page.on('pageerror', lambda e: errs.append(str(e)))
            base = 'http://127.0.0.1:%d/index.html' % PORT
            page.goto(base + '#/home', wait_until='load')
            page.evaluate(SEED, tier)
            page.goto(base + '#/pet', wait_until='load')
            page.wait_for_timeout(1600)

            # The old single wear slot must survive the migration. Stored and
            # shown are different questions: the moon hat is a Plus piece, so a
            # free visitor keeps it on the record and is simply not wearing it -
            # which is the lapse behaviour, not a lost hat.
            stored = page.evaluate("() => (window.NABU.PETS.one('cat').fit || {}).head")
            if stored != 'hat':
                fails.append('%s: the old hat was not stored in the head slot (%s)' % (tier, stored))
            shown = page.evaluate("() => window.NABU.PETS.fit(window.NABU.PETS.one('cat')).head")
            want = 'none' if tier == 'free' else 'hat'
            if shown != want:
                fails.append('%s: head slot shows %s, expected %s' % (tier, shown, want))

            # ---- nothing on this screen is too small to put a thumb on ----
            # Forty pixels, measured on the control itself unless it sits in a
            # label, which is then the real target - a checkbox is meant to be
            # small and its words are what gets tapped. The companion screen
            # had six of these: the four buttons on the edge of the stage, the
            # coin, the pencil and the reminder row.
            SMALL = """() => {
              const out = [];
              document.querySelectorAll('#main button, #main a[href], #main input').forEach((el) => {
                if (el.closest('button, a[href]') !== el && el.closest('button, a[href]')) return;
                const lab = el.closest('label');
                const t = lab || el;
                const r = t.getBoundingClientRect();
                if (!r.width || !r.height) return;
                if (getComputedStyle(el).display === 'none') return;
                if (Math.min(r.width, r.height) < 40) {
                  out.push((el.id ? '#' + el.id : el.tagName.toLowerCase()
                    + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\\s+/)[0] : ''))
                    + ' ' + Math.round(r.width) + 'x' + Math.round(r.height));
                }
              });
              return out;
            }"""
            small = page.evaluate(SMALL)
            if small:
                fails.append('%s: too small to tap on the companion screen: %s'
                             % (tier, ', '.join(sorted(set(small))[:6])))

            btn = page.locator('#opendress')
            if not btn.count():
                fails.append('%s: no wardrobe button on the companion screen' % tier)
                page.close()
                continue
            btn.click()
            page.wait_for_timeout(700)
            page.screenshot(path=os.path.join(SHOTS, 'wardrobe-ui-%s-head.png' % tier))

            # Seven slots and nothing else. It was nine while the sky and the
            # effects were tabs on this rail; they live on the scene screen now.
            rail = page.locator('.dresssheet .wslot')
            if rail.count() != 7:
                fails.append('%s: slot rail has %d buttons, expected 7' % (tier, rail.count()))

            # put something on, and check the preview changed with it
            free_tile = page.locator('.dresssheet [data-wear]:not(.locked):not(.bare)').first
            if free_tile.count():
                free_tile.click()
                page.wait_for_timeout(350)
                if not page.locator('.dresssheet .wtile.on:not(.bare)').count():
                    fails.append('%s: a tile was tapped but nothing reads as worn' % tier)

            # a locked tile must explain itself in place, not navigate away
            locked = page.locator('.dresssheet .wtile.locked').first
            if locked.count():
                locked.click()
                page.wait_for_timeout(300)
                say = page.locator('#wsay')
                if say.count() and say.is_hidden():
                    fails.append('%s: a locked piece said nothing' % tier)
                if '#/unlock' in page.url:
                    fails.append('%s: a locked piece threw the visitor at the price list' % tier)

            # The sky and the effects are not in here any more: they went to
            # the scene screen with the home. Check they are gone, and shoot
            # them where they now live.
            for gone in ('sky', 'fx'):
                if page.locator('.dresssheet [data-tab="%s"]' % gone).count():
                    fails.append('%s: the wardrobe still has a %s tab' % (tier, gone))

            # surprise me, then save it, then strip, then bring it back
            page.locator('.dresssheet [data-tab="top"]').click()
            page.wait_for_timeout(300)
            page.locator('#wrandom').click()
            page.wait_for_timeout(450)
            dressed = page.evaluate("() => window.NABU.PETS.fit(window.NABU.PETS.one('cat'))")
            page.locator('[data-look-save="0"]').first.click()
            page.wait_for_timeout(400)
            page.locator('#wstrip').click()
            page.wait_for_timeout(400)
            bare = page.evaluate("() => Object.values(window.NABU.PETS.fit(window.NABU.PETS.one('cat'))).filter(v => v !== 'none').length")
            if bare != 0:
                fails.append('%s: take it all off left %d pieces on' % (tier, bare))
            page.locator('[data-look-on="0"]').first.click()
            page.wait_for_timeout(450)
            back = page.evaluate("() => window.NABU.PETS.fit(window.NABU.PETS.one('cat'))")
            if back != dressed:
                fails.append('%s: a saved look did not come back the same\n     saved %s\n     back  %s' % (tier, dressed, back))

            page.screenshot(path=os.path.join(SHOTS, 'wardrobe-ui-%s-dressed.png' % tier))

            # close, and the companion card must show what was put on
            page.locator('.dresssheet .wclose').click()
            page.wait_for_timeout(600)
            if page.locator('.dresssheet').count():
                fails.append('%s: the wardrobe would not close' % tier)
            page.screenshot(path=os.path.join(SHOTS, 'wardrobe-ui-%s-card.png' % tier))

            # ---- the scene screen: home, sky and effects, in one place ----
            if not page.locator('#openscene').count():
                fails.append('%s: no way to open the scene screen' % tier)
            else:
                page.locator('#openscene').click()
                page.wait_for_timeout(600)
                for tab in ('home', 'sky', 'fx'):
                    t = page.locator('.scenesheet [data-scene-tab="%s"]' % tab)
                    if not t.count():
                        fails.append('%s: the scene screen has no %s tab' % (tier, tab))
                        continue
                    t.click()
                    page.wait_for_timeout(450)
                    page.screenshot(path=os.path.join(SHOTS, 'scene-ui-%s-%s.png' % (tier, tab)))
                # Every scene in the grid is held still. One that moves is one
                # of ten or twenty moving at once, which is the fault this
                # screen was rebuilt to cure. The shimmer that marks a locked
                # tile is not one of them: it is a pseudo-element sweeping a
                # band with a transform, which the compositor takes off the
                # main thread entirely, and it is how a visitor without the
                # plan is told what they are looking at.
                moving = page.evaluate(
                    "() => document.getAnimations().filter(a => a.playState === 'running'"
                    " && a.effect && !a.effect.pseudoElement && a.effect.target"
                    " && a.effect.target.closest"
                    " && a.effect.target.closest('.scenesheet .wgrid')).length")
                if moving:
                    fails.append('%s: %d animations running inside the picker grid' % (tier, moving))
                # A free visitor must still be told why, in place.
                locked = page.locator('.scenesheet .wtile.locked').first
                if locked.count():
                    locked.click()
                    page.wait_for_timeout(300)
                    if '#/unlock' in page.url:
                        fails.append('%s: a locked scene threw the visitor at the price list' % tier)
                sheet_small = page.evaluate(
                    "() => Array.from(document.querySelectorAll('.scenesheet .whead button,"
                    " .scenesheet .wfoot button, .scenesheet .wrail button'))"
                    " .map(el => ({ el, r: el.getBoundingClientRect() }))"
                    " .filter(x => x.r.width && x.r.height && Math.min(x.r.width, x.r.height) < 40)"
                    " .map(x => (x.el.className || x.el.tagName) + ' ' + Math.round(x.r.width)"
                    " + 'x' + Math.round(x.r.height))")
                if sheet_small:
                    fails.append('%s: too small to tap on the scene screen: %s'
                                 % (tier, ', '.join(sorted(set(sheet_small))[:6])))
                page.locator('.scenesheet .wclose').click()
                page.wait_for_timeout(500)
                if page.locator('.scenesheet').count():
                    fails.append('%s: the scene screen would not close' % tier)

            real = [e for e in errs if 'firebase' not in e.lower() and 'network' not in e.lower()]
            if real:
                fails.append('%s: page errors: %s' % (tier, ' | '.join(real[:3])[:300]))
            print('%-5s done' % tier)
            page.close()
        browser.close()
    httpd.shutdown()
    if fails:
        print('\nFAILURES')
        for f in fails:
            print('  - ' + f)
        return 1
    print('\nwardrobe drives correctly at all three tiers')
    return 0


if __name__ == '__main__':
    sys.exit(main())
