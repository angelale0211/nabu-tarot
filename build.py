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
           'core.js', 'backend.js', 'ai.js', 'home.js', 'pick.js', 'learn.js', 'lessons.js', 'fortune.js', 'playing.js', 'guide-visuals.js', 'book.js', 'me.js', 'contact.js', 'privacy.js', 'install.js', 'report.js', 'play.js', 'admin.js', 'main.js']


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

# privacy.html: the same policy as #/privacy, at a public address for the store listings.
import json, html as htmlmod
P = json.load(io.open(os.path.join(HERE, 'privacy.json'), encoding='utf-8'))
def block(lg):
    return '<h1>' + htmlmod.escape(P['title'][lg]) + '</h1><p class="d">' + htmlmod.escape(P['updated']) + '</p><p class="lead">' + htmlmod.escape(P['intro'][lg]) + '</p>' + ''.join('<h2>' + htmlmod.escape(s['h'][lg]) + '</h2><p>' + htmlmod.escape(s['p'][lg]) + '</p>' for s in P['sections'])
priv = ('<!DOCTYPE html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Nabu Tarot: ' + htmlmod.escape(P['title']['vi']) + ' / ' + htmlmod.escape(P['title']['en']) + '</title>'
        '<style>body{margin:0;background:#EFE9FA;color:#3B2A5E;font-family:"Be Vietnam Pro","Segoe UI",Roboto,Arial,sans-serif;font-size:16px;line-height:1.6}main{max-width:680px;margin:0 auto;padding:28px 20px 48px}h1{font-family:Georgia,serif;font-weight:500;font-size:28px;margin:0 0 4px}h2{font-size:18px;margin:22px 0 6px}p{margin:0 0 10px}.d{color:#9C90B6;font-size:13px}.lead{color:#6B5C8A}hr{border:0;border-top:1px solid #DCD2EE;margin:36px 0}a{color:#3D2A6E}</style></head><body><main>'
        '<p><a href="./">← Nabu Tarot</a></p>' + block('vi') + '<hr>' + block('en') + '</main></body></html>')
io.open(os.path.join(OUT, 'privacy.html'), 'w', encoding='utf-8', newline='\n').write(priv)
print('privacy.html: %d bytes' % len(priv.encode('utf-8')))
