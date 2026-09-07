# -*- coding: utf-8 -*-
"""Headless checks of the built app in Edge. Serves the project over HTTP so
fetch() and the service worker behave as on GitHub Pages, opens test.html
(which loads index.html in an iframe and drives it), and prints the results.
Run:  python test/run.py"""
import io, os, re, subprocess, sys, tempfile, threading, time
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
# Any Chromium will do: Edge here, Chrome on the build machine.
BROWSERS = [os.environ.get('NABU_BROWSER'),
            r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
            '/usr/bin/google-chrome', '/usr/bin/chromium-browser', '/usr/bin/chromium']
EDGE = next((b for b in BROWSERS if b and os.path.exists(b)), BROWSERS[1])
PORT = 8765


class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


def serve():
    os.chdir(ROOT)
    httpd = ThreadingHTTPServer(('127.0.0.1', PORT), Quiet)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd


TIMEOUT = 420


def run_once(url, extra=()):
    prof = tempfile.mkdtemp(prefix='nabu-edge-')
    out = subprocess.run([EDGE, '--headless=new', '--disable-gpu', '--no-first-run',
                          '--virtual-time-budget=600000', '--user-data-dir=' + prof,
                          '--window-size=430,900', '--dump-dom'] + list(extra) + [url],
                         capture_output=True, timeout=TIMEOUT)
    dom = out.stdout.decode('utf-8', 'replace')
    m = re.findall(r'<pre id="results">(.*?)</pre>', dom, re.S)
    return m[-1] if m else ('NO RESULTS\n' + dom[-3000:])


def run(url, extra=()):
    """A browser that hangs is not a failed check, and should not be reported as
    one. The page fetches a few files as it starts and reaches out to the app
    cloud; once in a while, on a shared machine, one of those never settles and
    the browser waits until it is killed. That arrives as a red build for a
    reason that has nothing to do with the code, which is the fastest way to
    teach somebody to ignore red builds.

    One retry tells the two apart: a real failure fails twice, a stall almost
    never does. The timeout used to escape from here as a traceback; it now says
    plainly what happened."""
    for attempt in (1, 2):
        try:
            return run_once(url, extra)
        except subprocess.TimeoutExpired:
            print('the browser did not settle within %d seconds (attempt %d of 2)' % (TIMEOUT, attempt), file=sys.stderr)
    return ('FAIL the browser never settled, twice over, so nothing was checked. '
            'That is a stalled browser rather than a broken check: run it again, '
            'and look at the network if it keeps happening.')


if __name__ == '__main__':
    httpd = serve()
    time.sleep(0.3)
    res = run('http://127.0.0.1:%d/test/test.html' % PORT)
    print(res)
    ok = 'FAIL' not in res and 'NO RESULTS' not in res
    httpd.shutdown()
    sys.exit(0 if ok else 1)
