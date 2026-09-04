# -*- coding: utf-8 -*-
"""Assemble index.html from src/. Run:  python build.py
Order matters: strings before app, art before tarot text (ART_CACHE needs
pipArt), tarot-en before tarot-vi (DECKTEXT refers to MAJORS/MINORS), and the
knowledge base before app.js."""
import io, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, 'src')
OUT = os.environ.get('NABU_OUT', HERE)
SCRIPTS = ['config.js', 'strings.js', 'art.js', 'tarot-en.js', 'tarot-vi.js', 'kb-thuanh.js', 'app.js']


def read(name):
    return io.open(os.path.join(SRC, name), encoding='utf-8').read()


shell = read('shell.html')
shell = shell.replace('/* __FONTS__ */', read('fonts.css').rstrip())
assert 'fonts.googleapis.com' not in shell

js = '\n\n'.join(read(s).rstrip() for s in SCRIPTS)
assert '</script' not in js.lower(), 'a script source contains a closing script tag'
page = shell.replace('<!-- __SCRIPTS__ -->', '<script>\n' + js + '\n</script>')

# The app must work with no network: nothing may be loaded from elsewhere.
ext = re.findall(r'<(?:script|link|img)[^>]+(?:src|href)="(https?:[^"]+)"', page)
assert not ext, 'external resources: %s' % ext

os.makedirs(OUT, exist_ok=True)
io.open(os.path.join(OUT, 'index.html'), 'w', encoding='utf-8', newline='\n').write(page)
print('index.html: %d bytes -> %s' % (len(page.encode('utf-8')), OUT))
