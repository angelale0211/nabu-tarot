# -*- coding: utf-8 -*-
"""A button in the activity dashboard that fills missing German from the files.

The published activity list is read from the cloud first (`loadContent`), and
the two JSON files in the repository are only the fallback. So translating the
files does not change what a visitor sees if anything has ever been saved from
the dashboard. This adds one button that reads both files, fills any `de` that
is missing on the activities currently loaded, and saves them back the same
way the publish button does.

It only ever adds a missing `de`. Existing German, Vietnamese, English, ids,
dates, options and vote counts are left alone, and it says how many strings it
could not find German for.
"""
import io, sys

errors = []
P = 'src/play.js'
s = io.open(P, encoding='utf-8').read()

if 'fillActsDe' in s:
    print('play.js: the German import is already there')
    sys.exit(0)

HELPER = '''
/* ---- German for activities that were published before German existed ----
   The list a visitor sees comes from the cloud when anything has been saved
   from the dashboard, so the German added to activities.json and
   activities-stock.json does not reach them on its own. This walks the loaded
   activities and fills in any missing `de` from those two files, matching on
   the English text, which is unique across both. Only missing values are
   written; nothing already there is touched. */
async function germanFromFiles() {
  const map = {};
  for (const path of ['activities.json', 'activities-stock.json']) {
    const r = await loadJSON(path, '');
    const walk = (o) => {
      if (!o || typeof o !== 'object') return;
      if (Array.isArray(o)) { o.forEach(walk); return; }
      if (typeof o.en === 'string' && typeof o.de === 'string' && o.de) { map[o.en] = o.de; return; }
      Object.keys(o).forEach((k) => walk(o[k]));
    };
    walk((r.data && r.data.items) || []);
  }
  return map;
}

function fillActsDe(items, map) {
  let filled = 0;
  const missing = [];
  const walk = (o) => {
    if (!o || typeof o !== 'object') return;
    if (Array.isArray(o)) { o.forEach(walk); return; }
    if (typeof o.vi === 'string' && typeof o.en === 'string') {
      if (!o.de) {
        if (map[o.en]) { o.de = map[o.en]; filled++; }
        else if (missing.indexOf(o.en) < 0) missing.push(o.en);
      }
      return;
    }
    Object.keys(o).forEach((k) => walk(o[k]));
  };
  walk(items);
  return { filled: filled, missing: missing };
}
'''

anchor = '/* ---- dashboard: create and answer activities ---- */'
if s.count(anchor) != 1:
    errors.append('play.js: the dashboard comment was not found')
else:
    s = s.replace(anchor, HELPER.strip() + '\n\n' + anchor, 1)

# the button, beside publish
old_btns = ("+ '<div class=\"btns\" style=\"margin-top:16px\"><button class=\"btn primary\" id=\"apub\">' + esc(S.publish) "
            "+ '</button><button class=\"btn\" id=\"anew\">' + esc(S.actNew) + '</button></div><p id=\"astatus\" class=\"hint\"></p></div>'")
new_btns = ("+ '<div class=\"btns\" style=\"margin-top:16px\"><button class=\"btn primary\" id=\"apub\">' + esc(S.publish) "
            "+ '</button><button class=\"btn\" id=\"anew\">' + esc(S.actNew) + '</button></div>'\n"
            "      + '<div class=\"btns\" style=\"margin-top:8px\"><button class=\"btn\" id=\"adefill\">' + esc(S.actFillDe) + '</button></div>'\n"
            "      + '<p class=\"hint\">' + esc(S.actFillDeHint) + '</p><p id=\"astatus\" class=\"hint\"></p></div>'")
if s.count(old_btns) != 1:
    errors.append('play.js: %d matches for the button row' % s.count(old_btns))
else:
    s = s.replace(old_btns, new_btns, 1)

# the handler, next to the publish handler
old_pub = "    $$('[data-adel]', p).forEach("
new_pub = '''    $('#adefill').addEventListener('click', async () => {
      status(S.translating);
      try {
        const map = await germanFromFiles();
        const r = fillActsDe(items, map);
        if (!r.filled) { status(S.actFillDeNone, 'ok'); return; }
        await BE.setContent('activities', actsDoc(items));
        ACTS.items = items; ACTS.loaded = true;
        status(S.actFillDeDone(r.filled, r.missing.length), 'ok');
        draw();
      } catch (e) { status(S.publishFail + ': ' + e.message, 'err'); }
    });
'''
if s.count(old_pub) != 1:
    errors.append('play.js: %d matches for the delete handler' % s.count(old_pub))
else:
    s = s.replace(old_pub, new_pub + old_pub, 1)

io.open(P, 'w', encoding='utf-8', newline='').write(s)

# the two result strings
LINES = {
    'vi': "actFillDeNone: 'Không có mục nào thiếu tiếng Đức.', actFillDeDone: (n, m) => 'Đã điền tiếng Đức cho ' + n + ' mục.' + (m ? ' Còn ' + m + ' câu chưa có bản dịch.' : ''), ",
    'en': "actFillDeNone: 'Nothing was missing German.', actFillDeDone: (n, m) => 'German filled in for ' + n + ' entries.' + (m ? ' ' + m + ' strings still have no German.' : ''), ",
    'de': "actFillDeNone: 'Es fehlte nirgends Deutsch.', actFillDeDone: (n, m) => 'Deutsch für ' + n + ' Einträge ergänzt.' + (m ? ' Für ' + m + ' Texte gibt es noch kein Deutsch.' : ''), ",
}
S = 'src/strings.js'
t = io.open(S, encoding='utf-8').read()
if 'actFillDeNone' in t:
    print('strings.js: the result strings are already there')
else:
    for lg, line in LINES.items():
        at = t.index('actFillDe: ', t.index('\n  %s: {' % lg))
        t = t[:at] + line + t[at:]
    io.open(S, 'w', encoding='utf-8', newline='').write(t)

if errors:
    sys.stderr.write('\n'.join(errors) + '\n')
    sys.exit(1)
print('play.js: the dashboard can fill German from the files and save it')
