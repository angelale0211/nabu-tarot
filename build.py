# -*- coding: utf-8 -*-
"""Assemble index.html from src/. Run:  python build.py
Order matters: settings and strings first, artwork before the card text
(ART_CACHE needs pipArt), tarot-en before tarot-vi (DECKTEXT refers to
MAJORS/MINORS), every data file before core.js, screens before main.js."""
import io, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, 'src')
OUT = os.environ.get('NABU_OUT', HERE)
SCRIPTS = ['config.js', 'logo-data.js', 'services.js', 'strings.js', 'art.js', 'tarot-en.js', 'tarot-vi.js', 'kb-thuanh.js',
           'insight-en.js', 'insight-vi.js', 'insight-majors.js', 'insight-minors.js', 'len-art.js', 'len-en.js', 'len-vi.js', 'astro.js',
           'zodiac.js', 'astro-kb.js', 'astro-deep.js', 'numerology.js', 'lunar.js', 'spreads.js', 'kb-guides.js',
           'core.js', 'backend.js', 'ai.js', 'home.js', 'pick.js', 'learn.js', 'lessons.js', 'fortune.js', 'guide-visuals.js', 'book.js', 'me.js', 'contact.js', 'report.js', 'admin.js', 'main.js']


# Data files transcribed from outside sources carry working notes in block
# comments; the shipped page mentions no sources, so those comments are
# dropped at build time (string literals in these files never contain '/*').
STRIP = {'kb-thuanh.js', 'len-en.js', 'len-vi.js', 'len-art.js', 'astro.js', 'spreads.js', 'art.js', 'tarot-en.js', 'tarot-vi.js'}


def read(name):
    s = io.open(os.path.join(SRC, name), encoding='utf-8').read()
    if name in STRIP:
        s = re.sub(r'/\*.*?\*/', '', s, flags=re.S)
    return s


shell = read('shell.html')
shell = shell.replace('/* __FONTS__ */', read('fonts.css').rstrip())
assert 'fonts.googleapis.com' not in shell

js = '\n\n'.join(read(s).rstrip() for s in SCRIPTS)
assert '</script' not in js.lower(), 'a script source contains a closing script tag'
page = shell.replace('<!-- __SCRIPTS__ -->', '<script>\n' + js + '\n</script>')

# The shell must work with no network: nothing static may load from elsewhere
# (the Firebase SDK is fetched at runtime only when accounts are turned on).
ext = re.findall(r'<(?:script|link|img)[^>]+(?:src|href)="(https?:[^"]+)"', page)
assert not ext, 'external resources: %s' % ext

os.makedirs(OUT, exist_ok=True)
io.open(os.path.join(OUT, 'index.html'), 'w', encoding='utf-8', newline='\n').write(page)
print('index.html: %d bytes -> %s' % (len(page.encode('utf-8')), OUT))
