# -*- coding: utf-8 -*-
"""Parse-check the built app's inline script in headless Edge.

Builds src/ into a scratch directory (never the repo's index.html, which a
parallel session may be using), pulls the single inline <script> out, and loads
it in a page that reports any error the browser raises while parsing or running
it. Prints OK or the first error.
"""
import io, os, re, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
EDGE = os.environ.get('NABU_BROWSER') or r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'

out = tempfile.mkdtemp(prefix='nabuchk')
env = dict(os.environ, NABU_OUT=out, PYTHONIOENCODING='utf-8')
r = subprocess.run([sys.executable, 'build.py'], cwd=ROOT, env=env,
                   capture_output=True, text=True, encoding='utf-8', errors='replace')
if r.returncode != 0:
    print('BUILD FAILED\n' + (r.stderr or '')[-3000:])
    sys.exit(1)

page = io.open(os.path.join(out, 'index.html'), encoding='utf-8').read()
m = re.search(r'<script>\n(.*?)\n</script>', page, re.S)
if not m:
    print('could not find the inline script'); sys.exit(1)
# Parse the app without running it. Running it needs shell.html's DOM and the
# Firebase SDK, so a plain <script> would report unrelated runtime errors;
# new Function(src) compiles the source and raises only on a syntax error.
io.open(os.path.join(out, 'harness.html'), 'w', encoding='utf-8').write(
    '<!doctype html><meta charset="utf-8"><title>PENDING</title>'
    '<script id="src" type="text/plain">\n' + m.group(1) + '\n</script>'
    '<script>try{new Function(document.getElementById("src").textContent);'
    'document.title="OK";}catch(e){document.title="FAIL "+(e&&e.message||e);}</script>')

if not os.path.exists(EDGE):
    print('Edge not found at %s - skipped the browser check (build itself succeeded)' % EDGE)
    sys.exit(0)

prof = tempfile.mkdtemp(prefix='nabuprof')
p = subprocess.run([EDGE, '--headless=new', '--disable-gpu', '--no-sandbox',
                    '--user-data-dir=' + prof, '--virtual-time-budget=4000',
                    '--dump-dom', 'file:///' + os.path.join(out, 'harness.html').replace('\\', '/')],
                   capture_output=True, text=True, encoding='utf-8', errors='replace', timeout=180)
dom = p.stdout or ''
t = re.search(r'<title>(.*?)</title>', dom, re.S)
title = (t.group(1) if t else 'no title').strip()
print(title[:600])
sys.exit(0 if title.startswith('OK') else 2)
