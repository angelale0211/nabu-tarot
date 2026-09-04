# -*- coding: utf-8 -*-
"""Headless checks of the built app in Edge. Serves the project over HTTP so
fetch() and the service worker behave as on GitHub Pages, opens test.html
(which loads index.html in an iframe and drives it), and prints the results.
Run:  python test/run.py"""
import io, os, re, subprocess, sys, tempfile, threading, time
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
EDGE = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
PORT = 8765


class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


def serve():
    os.chdir(ROOT)
    httpd = ThreadingHTTPServer(('127.0.0.1', PORT), Quiet)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd


def run(url, extra=()):
    prof = tempfile.mkdtemp(prefix='nabu-edge-')
    out = subprocess.run([EDGE, '--headless=new', '--disable-gpu', '--no-first-run',
                          '--virtual-time-budget=20000', '--user-data-dir=' + prof,
                          '--window-size=430,900', '--dump-dom'] + list(extra) + [url],
                         capture_output=True, timeout=120)
    dom = out.stdout.decode('utf-8', 'replace')
    m = re.findall(r'<pre id="results">(.*?)</pre>', dom, re.S)
    return m[-1] if m else ('NO RESULTS\n' + dom[-3000:])


if __name__ == '__main__':
    httpd = serve()
    time.sleep(0.3)
    res = run('http://127.0.0.1:%d/test/test.html' % PORT)
    print(res)
    ok = 'FAIL' not in res and 'NO RESULTS' not in res
    httpd.shutdown()
    sys.exit(0 if ok else 1)
