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
    for old in glob.glob(os.path.join(tempfile.gettempdir(), 'nabu-edge-*')):
        shutil.rmtree(old, ignore_errors=True)
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


if __name__ == '__main__':
    httpd = serve()
    time.sleep(0.3)
    res = run('http://127.0.0.1:%d/test/test.html' % PORT)
    print(res)
    lines = [l for l in res.split('\n') if l.strip()]
    bad = [l for l in lines if l.startswith('FAIL')]
    print('\n%d checks, %d passed, %d failed' % (len(lines), len(lines) - len(bad), len(bad)))
    httpd.shutdown()
    sys.exit(1 if bad else 0)
