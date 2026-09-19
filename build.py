# -*- coding: utf-8 -*-
"""Assemble index.html from src/. Run:  python build.py
Order matters: settings and strings first, artwork before the card text
(ART_CACHE needs pipArt), tarot-en before tarot-vi (DECKTEXT refers to
MAJORS/MINORS), tarot-de after tarot-vi (it adds LEX.de and DECKTEXT.de to
tables tarot-vi declares), every data file before core.js, screens before
main.js."""
import base64, glob, hashlib, io, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, 'src')
OUT = os.environ.get('NABU_OUT', HERE)
SCRIPTS = ['config.js', 'logo-data.js', 'services.js', 'play-catalog.js', 'strings.js', 'art.js', 'tarot-en.js', 'tarot-vi.js', 'tarot-de.js', 'kb-questions.js',
           'insight-en.js', 'insight-vi.js', 'insight-majors.js', 'insight-minors.js', 'insight-de.js', 'len-art.js', 'len-en.js', 'len-vi.js', 'len-de.js', 'astro.js',
           'zodiac.js', 'astro-kb.js', 'astro-deep.js', 'numerology.js', 'lunar.js', 'spreads.js', 'kb-guides.js',
           'core.js', 'today.js', 'backend.js', 'comments.js', 'likes.js', 'share.js', 'ai.js', 'home.js', 'pick.js', 'learn.js', 'lessons.js', 'fortune.js', 'playing.js', 'guide-visuals.js', 'codes.js', 'billing.js', 'store.js', 'angel.js', 'love.js', 'welcome.js', 'quiz.js', 'quiz-tarot.js', 'quiz-tarot-de.js', 'quiz-len.js', 'quiz-play.js', 'looks.js', 'luck.js', 'pet-wardrobe.js', 'pet.js', 'pet-dress.js', 'book.js', 'me.js', 'signin.js', 'contact.js', 'privacy.js', 'install.js', 'hello.js', 'report.js', 'play.js', 'wedding.js', 'alerts.js', 'admin.js', 'main.js']


# Data files transcribed from outside sources carry working notes in block
# comments; the shipped page mentions no sources, so those comments are
# dropped at build time (string literals in these files never contain '/*').
STRIP = {'kb-questions.js', 'len-en.js', 'len-vi.js', 'len-art.js', 'astro.js', 'spreads.js', 'art.js', 'tarot-en.js', 'tarot-vi.js'}


def read(name):
    s = io.open(os.path.join(SRC, name), encoding='utf-8').read()
    if name in STRIP:
        s = re.sub(r'/\*.*?\*/', '', s, flags=re.S)
    return s


shell = read('shell.html')
shell = shell.replace('/* __FONTS__ */', read('fonts.css').rstrip())
assert 'fonts.googleapis.com' not in shell

# ---- the course answers are fetched, not inlined ----
# kb-questions.js is the biggest file in the app by a wide margin - the
# question-and-answer table for every tarot card - and exactly one line reads
# it (cardBodyHTML in learn.js). Inlined, every visitor parsed it on every cold
# open, including the ones who only ever look at the feed. It is split here
# instead: the two `const` declarations everything else refers to stay in the
# page, and the batches that fill them become their own script, fetched the
# first time somebody opens a card and cached by the service worker after
# that. The file is named after a hash of its own contents, so a new release
# is a new name and no cache anywhere can serve yesterday's answers.
KB_FILE = 'kb-questions.js'
_kb = read(KB_FILE)
_cut = _kb.index('Object.assign(')
KB_HEAD, KB_BODY = _kb[:_cut].rstrip(), _kb[_cut:].strip()
assert 'const ASK' in KB_HEAD and 'const KW' in KB_HEAD, 'the kb head lost its declarations'
assert 'Object.assign' not in KB_HEAD, 'the kb head kept some of the data'
KB_NAME = 'kb-%s.js' % hashlib.sha256(KB_BODY.encode('utf-8')).hexdigest()[:12]
KB_HEAD += "\n/* Where the rest of this table lives; learn.js fetches it on demand. */\nconst KB_URL = './" + KB_NAME + "';"

js = '\n\n'.join((KB_HEAD if s == KB_FILE else read(s)).rstrip() for s in SCRIPTS)
assert '</script' not in js.lower(), 'a script source contains a closing script tag'

# Does the page's one script actually parse? A stray apostrophe inside a
# Vietnamese or German string - 'the app's own' - is a syntax error in the
# whole bundle, and the browser then runs none of it: no router, no NABU, a
# blank page. Every source file on its own is valid, so nothing catches it
# until something opens the built page. Node is not required to build; when it
# is here, this costs a second and names the line.
try:
    import subprocess, tempfile
    with tempfile.NamedTemporaryFile('w', suffix='.js', encoding='utf-8', delete=False, newline='\n') as _f:
        _f.write(js)
        _probe = _f.name
    try:
        _r = subprocess.run(['node', '--check', _probe], capture_output=True, text=True)
        if _r.returncode:
            raise AssertionError('the built script does not parse:\n' + (_r.stderr or '')[:2000])
    finally:
        os.unlink(_probe)
except (OSError, FileNotFoundError):
    print('note: node not found, skipping the syntax check of the built script')
page = shell.replace('<!-- __SCRIPTS__ -->', '<script>\n' + js + '\n</script>')

# ---- content security policy ----
# The page runs exactly one inline script, so the policy names it by hash
# instead of allowing inline script at large: anything injected into the DOM
# later has a different hash and will not execute. Everything the app talks
# to at runtime is listed by host.
inline = '\n' + js + '\n'
digest = base64.b64encode(hashlib.sha256(inline.encode('utf-8')).digest()).decode('ascii')
CSP = '; '.join([
    "default-src 'self'",
    "base-uri 'none'",
    "object-src 'none'",
    "form-action 'self'",
    # the Firebase SDK comes from gstatic at runtime; apis.google.com is the sign-in popup
    "script-src 'self' 'sha256-" + digest + "' https://www.gstatic.com https://apis.google.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "media-src 'self' data: blob:",
    "worker-src 'self'",
    # Firestore, Auth, Storage, Gemini and the Cloudflare worker
    "connect-src 'self' https://*.googleapis.com https://*.google.com https://*.firebaseio.com https://*.cloudfunctions.net https://*.workers.dev https://generativelanguage.googleapis.com",
    # the sign-in popup lives on the Firebase auth domain
    "frame-src https://*.firebaseapp.com https://accounts.google.com https://*.facebook.com",
])
page = page.replace('<!-- __CSP__ -->', '<meta http-equiv="Content-Security-Policy" content="' + CSP + '">')
assert 'Content-Security-Policy' in page, 'the shell lost its CSP placeholder'
# An inline handler would be blocked by that policy, so the build refuses one.
assert not re.search(r'\\son(click|load|error|change|input|submit)\\s*=', page), 'inline event handler in the page'

# The shell must work with no network: nothing static may load from elsewhere
# (the Firebase SDK is fetched at runtime only when accounts are turned on).
ext = re.findall(r'<(?:script|link|img)[^>]+(?:src|href)="(https?:[^"]+)"', page)
assert not ext, 'external resources: %s' % ext

os.makedirs(OUT, exist_ok=True)
io.open(os.path.join(OUT, 'index.html'), 'w', encoding='utf-8', newline='\n').write(page)
print('index.html: %d bytes -> %s' % (len(page.encode('utf-8')), OUT))

# The course answers, beside the page. Any kb-*.js an earlier build left is
# removed: its name is its old contents' hash, nothing links to it any more,
# and Cloudflare Pages publishes whatever sits in this folder.
for _stale in glob.glob(os.path.join(OUT, 'kb-*.js')):
    if os.path.basename(_stale) != KB_NAME:
        os.remove(_stale)
        print('removed stale %s' % os.path.basename(_stale))
io.open(os.path.join(OUT, KB_NAME), 'w', encoding='utf-8', newline='\n').write(KB_BODY + '\n')
print('%s: %d bytes (fetched when a card is opened)' % (KB_NAME, len(KB_BODY.encode('utf-8'))))

# privacy.html: the same policy as #/privacy, at a public address for the store listings.
import json, html as htmlmod
P = json.load(io.open(os.path.join(HERE, 'privacy.json'), encoding='utf-8'))
def block(lg):
    return '<h1>' + htmlmod.escape(P['title'][lg]) + '</h1><p class="d">' + htmlmod.escape(P['updated']) + '</p><p class="lead">' + htmlmod.escape(P['intro'][lg]) + '</p>' + ''.join('<h2>' + htmlmod.escape(s['h'][lg]) + '</h2><p>' + htmlmod.escape(s['p'][lg]) + '</p>' for s in P['sections'])
priv = ('<!DOCTYPE html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Nabu Tarot: ' + htmlmod.escape(P['title']['vi']) + ' / ' + htmlmod.escape(P['title']['en']) + '</title>'
        '<style>body{margin:0;background:#EFE9FA;color:#3B2A5E;font-family:"Be Vietnam Pro","Segoe UI",Roboto,Arial,sans-serif;font-size:16px;line-height:1.6}main{max-width:680px;margin:0 auto;padding:28px 20px 48px}h1{font-family:Georgia,serif;font-weight:500;font-size:28px;margin:0 0 4px}h2{font-size:18px;margin:22px 0 6px}p{margin:0 0 10px}.d{color:#9C90B6;font-size:13px}.lead{color:#6B5C8A}hr{border:0;border-top:1px solid #DCD2EE;margin:36px 0}a{color:#3D2A6E}</style></head><body><main>'
        '<p><a href="./">← Nabu Tarot</a></p>' + block('vi') + '<hr>' + block('en') + '<hr>' + block('de') + '</main></body></html>')
io.open(os.path.join(OUT, 'privacy.html'), 'w', encoding='utf-8', newline='\n').write(priv)
print('privacy.html: %d bytes' % len(priv.encode('utf-8')))
