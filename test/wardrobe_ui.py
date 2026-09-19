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

            btn = page.locator('#opendress')
            if not btn.count():
                fails.append('%s: no wardrobe button on the companion screen' % tier)
                page.close()
                continue
            btn.click()
            page.wait_for_timeout(700)
            page.screenshot(path=os.path.join(SHOTS, 'wardrobe-ui-%s-head.png' % tier))

            rail = page.locator('.dresssheet .wslot')
            if rail.count() != 9:
                fails.append('%s: slot rail has %d buttons, expected 9' % (tier, rail.count()))

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

            # the sky tab, then the effects tab
            page.locator('.dresssheet [data-tab="sky"]').click()
            page.wait_for_timeout(500)
            page.screenshot(path=os.path.join(SHOTS, 'wardrobe-ui-%s-sky.png' % tier))
            page.locator('.dresssheet [data-tab="fx"]').click()
            page.wait_for_timeout(500)
            page.screenshot(path=os.path.join(SHOTS, 'wardrobe-ui-%s-fx.png' % tier))

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
