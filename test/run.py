# -*- coding: utf-8 -*-
"""Headless checks of the built app in Edge. Serves the project over HTTP so
fetch() and the service worker behave as on GitHub Pages, opens test.html
(which loads index.html in an iframe and drives it), and prints the results.
Run:  python test/run.py

The page posts its results back here as it goes. It used to be given a budget
of pretend time instead, and read once that ran out - but pretend time stands
still while the browser is waiting on the real network, so a single slow
request could hold the whole run open until it was killed, reporting nothing
at all. Now the run ends when the suite says it has ended, and a run that dies
half way still prints the checks it managed."""
import glob, os, re, shutil, subprocess, sys, tempfile, threading, time
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
# Any Chromium will do: Edge here, Chrome on the build machine.
BROWSERS = [os.environ.get('NABU_BROWSER'),
            r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
            '/usr/bin/google-chrome', '/usr/bin/chromium-browser', '/usr/bin/chromium']
EDGE = next((b for b in BROWSERS if b and os.path.exists(b)), BROWSERS[1])
# One run per port. Two windows working in this repo at once both want the
# suite, and on Windows the second one binds anyway and then talks to the first
# one's server, which reports nothing at all. NABU_PORT lets the second run
# stand aside: NABU_PORT=8766 python test/run.py
PORT = int(os.environ.get('NABU_PORT') or 8765)

# What the page has told us so far, and whether it says it is finished.
RESULTS = {'text': '', 'done': False, 'at': 0.0}
LOCK = threading.Lock()


class Runner(SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def do_POST(self):
        if self.path.split('?')[0] != '/__results':
            self.send_error(404)
            return
        n = int(self.headers.get('Content-Length') or 0)
        body = self.rfile.read(n).decode('utf-8', 'replace')
        with LOCK:
            # The mark saying the suite has finished arrives on its own and
            # carries nothing, so an empty body means "keep what you have".
            if body:
                RESULTS['text'] = body
            RESULTS['at'] = time.time()
            if 'done=1' in self.path:
                RESULTS['done'] = True
        self.send_response(204)
        self.send_header('Content-Length', '0')
        self.end_headers()


def serve():
    os.chdir(ROOT)
    httpd = ThreadingHTTPServer(('127.0.0.1', PORT), Runner)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd


TIMEOUT = int(os.environ.get('NABU_TIMEOUT') or 900)   # the whole suite, wall clock
# ... or this long with the page saying nothing new. Two suites running at once
# on one machine starve each other, and a run that is merely slow then looks
# like a run that has died; NABU_QUIET buys it more rope.
QUIET = int(os.environ.get('NABU_QUIET') or 90)


def run(url, extra=()):
    # Every run used to leave its browser profile behind. Six hundred of them
    # later the temp folder is slow enough to stall the run that made them, and
    # a suite that fails because of its own litter is worse than no suite.
    # Only OLD ones, though: another window's suite may be running right now
    # with its own profile, and deleting that from under its browser stalls or
    # breaks that run (on 2026-09-10 three runs lost checks this way while two
    # branches were tested side by side). A run takes minutes and Edge keeps
    # touching a profile it is using, so anything untouched for half an hour
    # is litter.
    cutoff = time.time() - 30 * 60
    for old in glob.glob(os.path.join(tempfile.gettempdir(), 'nabu-edge-*')):
        try:
            if os.path.getmtime(old) < cutoff:
                shutil.rmtree(old, ignore_errors=True)
        except OSError:
            pass
    prof = tempfile.mkdtemp(prefix='nabu-edge-')
    # The suite is written against a fast-forwarded clock: it waits 30ms for a
    # screen to redraw, which is true when the clock is pretend and often false
    # when it is real. So the budget stays - it is what makes the checks mean
    # what they say - but it is no longer what ends the run.
    #
    # It is set far higher than the suite needs. Pretend time is spent at
    # whatever rate the page can run, not at the rate a person would, and a
    # screen holding a one-second timer burns through it fast: the wedding
    # ceremony alone ate a fifteen-minute budget and the page then froze
    # mid-check, which read as a stall. Nothing is waited for in real time by
    # making this bigger; it only stops the clock running out first.
    proc = subprocess.Popen([EDGE, '--headless=new', '--disable-gpu', '--no-first-run',
                             '--no-default-browser-check', '--disable-extensions',
                             '--virtual-time-budget=20000000',
                             '--user-data-dir=' + prof, '--window-size=430,900']
                            + list(extra) + [url],
                            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    started = time.time()
    try:
        while True:
            with LOCK:
                done, last = RESULTS['done'], RESULTS['at']
            if done:
                break
            if proc.poll() is not None and time.time() - started > 5:
                break                       # the browser gave up before the suite did
            now = time.time()
            if now - started > TIMEOUT:
                print('the suite ran past %d seconds and was stopped' % TIMEOUT, file=sys.stderr)
                break
            if last and now - last > QUIET:
                print('the suite said nothing for %d seconds and was stopped' % QUIET, file=sys.stderr)
                break
            if not last and now - started > QUIET:
                print('the suite never started; the page said nothing for %d seconds' % QUIET, file=sys.stderr)
                break
            time.sleep(0.25)
    finally:
        proc.terminate()
        try:
            proc.wait(timeout=10)
        except subprocess.TimeoutExpired:
            proc.kill()
        shutil.rmtree(prof, ignore_errors=True)

    with LOCK:
        text, done = RESULTS['text'], RESULTS['done']
    if not text:
        return ('FAIL nothing was checked: the page never reported a single result. '
                'Open test/test.html in a browser and look at the console.')
    if not done:
        text += ('\nFAIL the suite stopped part way, after %d checks. '
                 'The check after the last one above is where to look.' % len(text.split('\n')))
    return text


# ---- money written into copy, instead of formatted for the reader ----
# Prices are kept in dong and converted per language, so a dong amount typed
# into an English or German sentence shows the wrong money beside a converted
# price. No browser check can catch that: the text renders perfectly, it is
# simply the wrong currency. It reached customers three times - 8876fe1,
# 4cf39b9 and 4bf2839, one of them the very commit that added dollar and euro
# prices - and was found on a phone rather than here.
#
# Only the thousands form is flagged, because that is what a price looks like;
# a bare digit before a Vietnamese word is not one. A string counts as
# Vietnamese when what is left after removing the amount still carries
# Vietnamese marks, and in Vietnamese copy a dong figure is correct.
PRICE_IN_TEXT = re.compile(u"[0-9]{1,3}(?:[.][0-9]{3})+ *đ")
VI_MARKS = re.compile(u"[ăâđêôơưĂÂĐÊÔƠƯ"
                      u"àáảãạằắẳẵặầấẩẫậ"
                      u"èéẻẽẹềếểễệìíỉĩị"
                      u"òóỏõọồốổỗộờớởỡợ"
                      u"ùúủũụừứửữựỳýỷỹỵ]")
JS_STRING = re.compile(u"'([^']*)'")
# The source writes some non-ascii as escapes, and the English wedding terms
# hid a dong sign that way - the first scan of this walked straight past it.
JS_ESCAPE = re.compile(chr(92) + chr(92) + u"u([0-9a-fA-F]{4})")


def money_in_copy():
    """Every string that names a dong price outside Vietnamese copy."""
    bad = []
    for path in sorted(glob.glob(os.path.join(ROOT, 'src', '*.js'))):
        with open(path, encoding='utf-8') as fh:
            body = fh.read()
        for ln, line in enumerate(body.split(chr(10)), 1):
            # A line may say, in so many words, that its dong figure is meant:
            # the dashboard shows the owner the base price they typed, beside
            # what it converts to. Say why at the line, or it counts.
            if 'dong on purpose' in line:
                continue
            line = JS_ESCAPE.sub(lambda m: chr(int(m.group(1), 16)), line)
            for m in JS_STRING.finditer(line):
                s = m.group(1)
                if not PRICE_IN_TEXT.search(s):
                    continue
                if VI_MARKS.search(PRICE_IN_TEXT.sub(' ', s)):
                    continue
                bad.append('%s:%d %s' % (os.path.basename(path), ln, s[:64]))
    if bad:
        return ['FAIL a price is written in dong inside copy that is not Vietnamese, so a reader '
                'paying in dollars or euros is shown the wrong money: ' + '; '.join(bad[:4])]
    return ['PASS no price is written in dong inside English or German copy']


SUM_RENDER = re.compile(r"L\(\s*[A-Za-z_$][\w$]*\.sum\b")


def money_token_rendered():
    """A description that names an amount must go through priceText().

    The amount is carried as a token ({save}, {wedfee}) because a saving is a
    different number in every currency. `L(c.sum)` on its own puts the token
    itself on the screen: the in-app store showed "{save} less than two half
    years" to a real phone, because it was the one screen that printed a
    description without the substitution every other screen already did.
    """
    bad = []
    for path in sorted(glob.glob(os.path.join(ROOT, 'src', '*.js'))):
        with open(path, encoding='utf-8') as fh:
            body = fh.read()
        for ln, line in enumerate(body.split(chr(10)), 1):
            if SUM_RENDER.search(line) and 'priceText' not in line:
                bad.append('%s:%d' % (os.path.basename(path), ln))
    if bad:
        return ['FAIL a description naming an amount is printed without priceText, so the '
                'reader is shown the token instead of the money: ' + '; '.join(bad[:4])]
    return ['PASS every description naming an amount goes through priceText']


def payment_policy():
    """Whether the installed app is allowed to sell anything at all.

    The Digital Goods API is gated on the `payment` Permissions-Policy. With
    `payment=()` the browser refuses it before any Play code runs, so
    getDigitalGoodsService() throws "Payment permissions policy not granted",
    BILL.can() stays false, and the store can only say it had no answer from
    Google Play. Nothing in the app, the bundle or the Play Console looks
    wrong. That is exactly what happened between 2026-09-07 and 2026-09-09,
    and it cost a day to find, so it is checked here rather than trusted.
    """
    path = os.path.join(ROOT, '_headers')
    if not os.path.exists(path):
        return ['FAIL _headers is missing, so no security header is served at all']
    with open(path, encoding='utf-8') as fh:
        said = [l for l in fh.read().split(chr(10))
                if l.strip().startswith('Permissions-Policy:')]
    if not said:
        return ['FAIL _headers names no Permissions-Policy']
    pol = said[0].strip()
    if 'payment=(self)' in pol:
        return ['PASS _headers grants payment=(self), so the app can reach Play billing']
    return ['FAIL _headers does not grant payment=(self), so the Digital Goods API is '
            'refused and nothing can be bought inside the Android app: ' + pol]


def icons_round():
    """The app icons, checked as pixels rather than as good intentions.

    make_icons.py used to paint the round avatar onto a pale square, and that
    square is what showed up as a white box on the purple Android splash and as
    a pale tile on an iPhone home screen. Two rules keep it away:

      the badge is round and see-through where the corners used to be, for the
      splash, the browser tab and the install icon;

      except icon-180.png, which iOS paints black wherever a PNG is
      transparent, so that one keeps the brand purple behind the circle - and
      icon-512-maskable.png, which Android masks itself and therefore needs
      artwork all the way to the edge.
    """
    try:
        from PIL import Image
    except ImportError:
        return ['PASS icon shapes not checked: Pillow is not installed here']
    out = []
    for name in ('icon-512.png', 'icon-192.png'):
        im = Image.open(os.path.join(ROOT, name)).convert('RGBA')
        if im.getpixel((2, 2))[3] == 0:
            out.append('PASS %s is the round badge with nothing in its corners' % name)
        else:
            out.append('FAIL %s has opaque corners again: that square is what floats on '
                       'the purple splash and the browser tab' % name)
    im = Image.open(os.path.join(ROOT, 'icon-180.png'))
    corner = im.convert('RGBA').getpixel((2, 2))
    if im.mode == 'RGB' and corner[:3] == (184, 164, 227):
        out.append('PASS icon-180.png keeps the brand purple behind the circle, which is what '
                   'an iPhone home screen needs instead of transparency')
    else:
        out.append('FAIL icon-180.png must be opaque on #B8A4E3 for iOS, which paints '
                   'transparent pixels black; found mode %s corner %s' % (im.mode, corner))
    mask = Image.open(os.path.join(ROOT, 'icon-512-maskable.png')).convert('RGBA')
    if mask.getpixel((2, 2))[3] == 255:
        out.append('PASS icon-512-maskable.png still reaches its own edges, which is what '
                   'Android needs before it applies its own mask')
    else:
        out.append('FAIL icon-512-maskable.png has transparent corners: Android would mask '
                   'a hole into the launcher icon')
    # The avatar's thin outline ring, drawn just inside the launcher's own round
    # mask, read as a purple border around the app. Where it used to run (four
    # fifths of the canvas holds the avatar; the ring sits at 233.5/256 of its
    # radius) the launcher icon must now be the plain pale disc.
    r = 256 * 0.8 * (233.5 / 256)
    spots = [(round(256 - r), 256), (round(256 + r), 256), (256, round(256 - r)), (256, round(256 + r))]
    dark = [p for p in spots if sum(mask.getpixel(p)[:3]) < 600]
    if not dark:
        out.append('PASS the launcher icon has no outline ring inside its round edge')
    else:
        out.append('FAIL the launcher icon still draws the outline ring at %s: it shows as a '
                   'purple border inside the round mask of the phone' % dark)
    return out


if __name__ == '__main__':
    httpd = serve()
    time.sleep(0.3)
    res = run('http://127.0.0.1:%d/test/test.html' % PORT)
    print(res)
    # Read from the source, not from the page: this one is about what is
    # written down, and it renders perfectly while being the wrong money.
    source = money_in_copy() + payment_policy() + money_token_rendered() + icons_round()
    for line in source:
        print(line)
    lines = [l for l in res.split('\n') if l.strip()] + source
    bad = [l for l in lines if l.startswith('FAIL')]
    print('\n%d checks, %d passed, %d failed' % (len(lines), len(lines) - len(bad), len(bad)))
    httpd.shutdown()
    sys.exit(1 if bad else 0)
