# -*- coding: utf-8 -*-
"""German smoke test.

Builds the page into a scratch directory (never touching the shared
index.html), forces the language to German, walks a list of routes in headless
Edge and reports any script error plus any English marker left on screen.

The CSP meta is dropped in the scratch copy only, so the harness may add its
own inline script; nothing here is written back into the repository.
"""
import io, json, os, re, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EDGE = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
ROUTES = ['#/home', '#/pick', '#/learn', '#/learn/tarot', '#/learn/astro', '#/learn/manifest',
          '#/play', '#/book', '#/me', '#/fortune', '#/privacy', '#/prices']

out = tempfile.mkdtemp(prefix='nabude')
env = dict(os.environ, NABU_OUT=out, PYTHONIOENCODING='utf-8')
r = subprocess.run([sys.executable, 'build.py'], cwd=ROOT, env=env,
                   capture_output=True, text=True)
if r.returncode:
    sys.stderr.write(r.stdout + r.stderr)
    sys.exit(1)

page = io.open(os.path.join(out, 'index.html'), encoding='utf-8').read()
page = re.sub(r'<meta http-equiv="Content-Security-Policy"[^>]*>', '', page)
pre = ('<script>try{localStorage.setItem("nabu-lang","de");'
       'localStorage.setItem("nabu-hello","1");localStorage.setItem("nabu-welcome","1");}catch(e){}'
       'window.__errs=[];window.addEventListener("error",function(e){'
       'window.__errs.push(String(e.message)+" @ "+(e.filename||"")+":"+e.lineno);});'
       'window.addEventListener("unhandledrejection",function(e){'
       'window.__errs.push("promise: "+String(e.reason));});</script>')
page = page.replace('<head>', '<head>' + pre, 1)
tail = ('<script>setTimeout(function(){var seen=[];var i=0;var routes=' + json.dumps(ROUTES) + ';'
        '(function step(){ if(i>=routes.length){'
        'document.title="RESULT "+JSON.stringify({errors:window.__errs,text:seen.join("\\u0001")}).slice(0,60000);return;}'
        'location.hash=routes[i++];setTimeout(function(){'
        'seen.push(routes[i-1]+"::"+(document.getElementById("main")||document.body).innerText.slice(0,1200));'
        'step();},420);})();},900);</script>')
page = page.replace('</body>', tail + '</body>')
io.open(os.path.join(out, 'de.html'), 'w', encoding='utf-8').write(page)

r = subprocess.run([EDGE, '--headless=new', '--disable-gpu', '--no-sandbox',
                    '--virtual-time-budget=25000', '--dump-dom',
                    'file:///' + os.path.join(out, 'de.html').replace('\\', '/')],
                   capture_output=True, text=True, encoding='utf-8', errors='replace')
dom = r.stdout or ''
m = re.search(r'<title>RESULT (.*?)</title>', dom, re.S)
if not m:
    print('no result title; the page did not finish. First 400 chars of DOM:')
    print(dom[:400])
    sys.exit(1)
data = json.loads(m.group(1).replace('&quot;', '"').replace('&amp;', '&')
                  .replace('&lt;', '<').replace('&gt;', '>'))
print('script errors: %d' % len(data['errors']))
for e in data['errors']:
    print('  ' + e)
EN = re.compile(r'\b(Draw a card|Home|Settings|Bookings|Sign in|Reading|cards|questions|'
                r'Loading|Not yet|Choose|Search|Today|undefined|NaN)\b')
for chunk in data['text'].split('\u0001'):
    route, _, text = chunk.partition('::')
    hits = sorted(set(EN.findall(text)))
    print('%-18s %4d chars  %s' % (route, len(text), ('English/undefined markers: ' + ', '.join(hits)) if hits else 'ok'))
