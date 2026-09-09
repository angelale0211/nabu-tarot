# -*- coding: utf-8 -*-
"""Read a screen in German over HTTP.

activities.json is fetched at runtime, so file:// cannot see it. This serves
the project, drops a copy of the built page at the site root with the language
forced to German (the CSP is removed in that copy only, so the language can be
set before the app boots), reads the screen, and deletes the copy again.

  python _patch/smoke_acts.py '#/play'
"""
import io, json, os, re, subprocess, sys, threading, time
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EDGE = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
PORT = 8792
PROBE = os.path.join(ROOT, '_de_probe.html')
ROUTE = sys.argv[1] if len(sys.argv) > 1 else '#/play'

page = io.open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()
page = re.sub(r'<meta http-equiv="Content-Security-Policy"[^>]*>', '', page)
# The cloud copy of the activities wins over the file, so the file side is
# only visible with the backend switched off in this throwaway copy.
if '--nocloud' in sys.argv:
    page = page.replace('enabled: !!CONFIG.firebase,', 'enabled: false,', 1)
pre = ('<script>try{localStorage.setItem("nabu-lang",JSON.stringify("de"));'
       'localStorage.setItem("nabu-hello",JSON.stringify(1));'
       'localStorage.setItem("nabu-welcome",JSON.stringify(1));}catch(e){}</script>')
page = page.replace('<head>', '<head>' + pre, 1)
page = page.replace('</body>', '<script>'
                    'setTimeout(function(){location.hash=' + json.dumps(ROUTE) + ';},2500);'
                    'setTimeout(function(){'
                    'var el=document.getElementById("main")||document.body;'
                    'document.title="RESULT "+JSON.stringify(el.innerText.slice(0,6000));'
                    '},7000);</script></body>')
io.open(PROBE, 'w', encoding='utf-8').write(page)


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=ROOT, **k)

    def log_message(self, *a):
        pass


srv = ThreadingHTTPServer(('127.0.0.1', PORT), Handler)
threading.Thread(target=srv.serve_forever, daemon=True).start()
time.sleep(0.4)
try:
    r = subprocess.run([EDGE, '--headless=new', '--disable-gpu', '--no-sandbox',
                        '--virtual-time-budget=30000', '--dump-dom',
                        'http://127.0.0.1:%d/_de_probe.html' % PORT],
                       capture_output=True, text=True, encoding='utf-8', errors='replace')
finally:
    srv.shutdown()
    try:
        os.remove(PROBE)
    except OSError:
        pass

m = re.search(r'<title>RESULT (.*?)</title>', r.stdout or '', re.S)
if not m:
    print('no result; first 400 chars of DOM:')
    print((r.stdout or '')[:400])
    sys.exit(1)
raw = m.group(1).replace('&quot;', '"').replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>')
print(json.loads(raw))
