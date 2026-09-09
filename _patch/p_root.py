# -*- coding: utf-8 -*-
"""Review sections 31 and 36: the user-facing files outside src/.

  * privacy.json gains a German locale (title, intro and all 12 sections),
    taken verbatim from the review file, and build.py renders a German block
    into the static privacy.html the store listings link to;
  * the manifest and the shell's meta description get the approved copy;
  * the three static aria-labels in shell.html become localized.
"""
import io, json, os, re, sys

SPEC = os.path.expanduser('~/Downloads/NABU_TEXT_REVIEW_100_PERCENT_COMPLETE.md')
errors = []
spec = io.open(SPEC, encoding='utf-8').read()

# ------------------------------------------------------ privacy.json ----
sec = spec[spec.index('## 31.2 `privacy.json`'):spec.index('## 31.3 Root content')]
DE = json.loads(re.search(r'```json\n(.*?)\n```', sec, re.S).group(1))

P = 'privacy.json'
p = json.load(io.open(P, encoding='utf-8'))
if len(p['sections']) != len(DE['sections']):
    errors.append('privacy.json has %d sections, the German pack has %d'
                  % (len(p['sections']), len(DE['sections'])))
else:
    p['title']['de'] = DE['title']
    p['intro']['de'] = DE['intro']
    for rec, (h, body) in zip(p['sections'], DE['sections']):
        rec['h']['de'] = h
        rec['p']['de'] = body
    io.open(P, 'w', encoding='utf-8', newline='\n').write(
        json.dumps(p, ensure_ascii=False, indent=1) + '\n')
    print('privacy.json: German title, intro and %d sections added' % len(DE['sections']))

# --------------------------------------- privacy.html, built by build.py ----
b = io.open('build.py', encoding='utf-8').read()
old = "block('vi') + '<hr>' + block('en') +"
if "block('de')" in b:
    print('build.py: the German privacy block is already rendered')
elif b.count(old) != 1:
    errors.append('build.py: privacy page assembly not found')
else:
    b = b.replace(old, "block('vi') + '<hr>' + block('en') + '<hr>' + block('de') +")
    io.open('build.py', 'w', encoding='utf-8', newline='\n').write(b)
    print('build.py: privacy.html now carries the German block too')

# ------------------------------------------------------- descriptions ----
VI_DESC = 'Rút Tarot, xem dự đoán, khám phá chiêm tinh, nuôi linh thú, viết nhật ký, manifestation và đặt lịch với Nabu.'
m = io.open('manifest.webmanifest', encoding='utf-8').read()
mm = re.search(r'"description":"(.*?)","start_url"', m)
if not mm:
    errors.append('manifest.webmanifest: description not found')
else:
    m = m[:mm.start(1)] + VI_DESC + m[mm.end(1):]
    io.open('manifest.webmanifest', 'w', encoding='utf-8', newline='\n').write(m)
    print('manifest.webmanifest: description replaced')

# --------------------------------------------------------- shell.html ----
S = 'src/shell.html'
s = io.open(S, encoding='utf-8').read()
old_desc = re.search(r'<meta name="description" content="([^"]*)">', s)
if not old_desc:
    errors.append('shell.html: meta description not found')
else:
    s = s[:old_desc.start(1)] + VI_DESC + s[old_desc.end(1):]

for eid, old in [('bell', 'aria-label="notifications"'), ('theme', 'aria-label="theme"'),
                 ('totop', 'aria-label="Top"')]:
    if s.count(old) != 1:
        errors.append('shell.html: %s label appears %d times' % (eid, s.count(old)))
io.open(S, 'w', encoding='utf-8', newline='').write(s)
print('shell.html: meta description synced')

# The labels themselves are set from the string table so they follow the
# language switch, which the static markup cannot do.
STR = 'src/strings.js'
t = io.open(STR, encoding='utf-8').read()
LABELS = {'vi': ('Thông báo', 'Giao diện', 'Lên đầu trang'),
          'en': ('Notifications', 'Theme', 'Back to top'),
          'de': ('Benachrichtigungen', 'Design', 'Nach oben')}
if 'a11yBell' in t:
    print('strings.js: the chrome labels are already there')
else:
    for lg, (bell, theme, top) in LABELS.items():
        anchor = "\n  %s: {\n    lang: '" % lg
        i = t.index(anchor)
        j = t.index('\n', t.index("lang: '", i)) + 1
        t = t[:j] + ("    a11yBell: '%s', a11yTheme: '%s', a11yTop: '%s',\n" % (bell, theme, top)) + t[j:]
    io.open(STR, 'w', encoding='utf-8', newline='').write(t)
    print('strings.js: a11yBell / a11yTheme / a11yTop added in all three languages')

CORE = 'src/core.js'
c = io.open(CORE, encoding='utf-8').read()
if 'a11yBell' in c:
    print('core.js: the labels are already applied')
else:
    marker = 'function route() {\n  const r = parseHash();'
    if c.count(marker) != 1:
        errors.append('core.js: route() not found')
    else:
        c = c.replace(marker, (
            '/* The three chrome buttons live in the shell, outside any screen, so\n'
            '   their labels are set here rather than in the markup: this way they\n'
            '   follow the language switch like everything else. */\n'
            'function chromeLabels() {\n'
            '  const S = T();\n'
            '  const set = (id, text) => { const el = $(id); if (el) el.setAttribute(\'aria-label\', text); };\n'
            '  set(\'#bell\', S.a11yBell); set(\'#theme\', S.a11yTheme); set(\'#totop\', S.a11yTop);\n'
            '}\n\n'
            'function route() {\n  chromeLabels();\n  const r = parseHash();'), 1)
        io.open(CORE, 'w', encoding='utf-8', newline='').write(c)
        print('core.js: chromeLabels() applies the three labels on every route')

if errors:
    sys.stderr.write('\n'.join(errors) + '\n')
    sys.exit(1)
