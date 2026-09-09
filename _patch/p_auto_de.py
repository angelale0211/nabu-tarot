# -*- coding: utf-8 -*-
"""Fill the German on activities automatically, at load.

A visitor should not have to wait for the owner to press a button before the
polls read German. The published list comes from the cloud, which can predate
a translation, while the two JSON files ship with the app and carry it. So
loadActs() now fills any missing locale text from the files itself, in memory,
every time the activities are loaded.

The dashboard button stays, but it is no longer what makes German appear: it
writes the same fill back to the cloud so it is stored once and for all.
"""
import io, sys

P = 'src/play.js'
errors = []
s = io.open(P, encoding='utf-8').read()


def sub1(old, new, note):
    global s
    if s.count(old) != 1:
        errors.append('%d matches for %s' % (s.count(old), note))
        return
    s = s.replace(old, new, 1)


# ---- the map is keyed by both languages, so a changed English line still hits ----
sub1("""      if (typeof o.en === 'string' && typeof o.de === 'string' && o.de) { map[o.en] = o.de; return; }""",
     """      if (typeof o.de === 'string' && o.de) {
        if (typeof o.vi === 'string' && o.vi) map[o.vi] = o.de;
        if (typeof o.en === 'string' && o.en) map[o.en] = o.de;
        return;
      }""",
     'the map builder')

sub1("""    if (typeof o.vi === 'string' && typeof o.en === 'string') {
      if (!o.de) {
        if (map[o.en]) { o.de = map[o.en]; filled++; }
        else if (missing.indexOf(o.en) < 0) missing.push(o.en);
      }
      return;
    }""",
     """    if (typeof o.vi === 'string' && typeof o.en === 'string') {
      if (!o.de) {
        const de = map[o.vi] || map[o.en];
        if (de) { o.de = de; filled++; }
        else if (missing.indexOf(o.en) < 0) missing.push(o.en);
      }
      return;
    }""",
     'the filler')

# ---- and the whole thing runs on its own, at load ----
sub1("""/* ---- German for activities that were published before German existed ----
   The list a visitor sees comes from the cloud when anything has been saved
   from the dashboard, so the German added to activities.json and
   activities-stock.json does not reach them on its own. This walks the loaded
   activities and fills in any missing `de` from those two files, matching on
   the English text, which is unique across both. Only missing values are
   written; nothing already there is touched. */""",
     """/* ---- German for activities that were published before German existed ----
   The list a visitor sees comes from the cloud whenever anything has been
   saved from the dashboard, and that copy can be older than a translation.
   The two JSON files ship with the app and do carry it, so loadActs() fills
   the gaps from them every time it loads, and nobody has to do anything for
   the polls to read German. Only a missing value is written; text already
   there is never touched. The dashboard button does the same fill and saves
   it back, so the work is stored rather than repeated on every load. */""",
     'the helper comment')

sub1("""  ACTS.hidden = hidden.slice();
  ACTS.items = items; ACTS.loaded = true;
  return ACTS.items;""",
     """  ACTS.hidden = hidden.slice();
  /* An activity saved before a language existed has no text in it. Fill those
     gaps from the files that ship with the app, so switching language is all a
     visitor has to do. A failure here is never worth an empty screen. */
  if (actsNeedDe(items)) {
    try { fillActsDe(items, await germanFromFiles()); } catch (e) { /* the files can wait */ }
  }
  ACTS.items = items; ACTS.loaded = true;
  return ACTS.items;""",
     'loadActs')

# the cheap check that decides whether the files are worth fetching at all
sub1("""const actsDoc = (items) => {""",
     """/* True when any piece of text on any activity is missing its German. Cheap,
   and it keeps the file fetch to the loads that can actually use it. */
function actsNeedDe(items) {
  let need = false;
  const walk = (o) => {
    if (need || !o || typeof o !== 'object') return;
    if (Array.isArray(o)) { o.forEach(walk); return; }
    if (typeof o.vi === 'string' && typeof o.en === 'string') { if (!o.de) need = true; return; }
    Object.keys(o).forEach((k) => walk(o[k]));
  };
  walk(items);
  return need;
}
const actsDoc = (items) => {""",
     'actsNeedDe')

io.open(P, 'w', encoding='utf-8', newline='').write(s)

# the dashboard hint now describes what the button is actually for
LINES = {
    'vi': "Bản tiếng Đức đã tự hiển thị khi đọc. Nút này lưu luôn phần tiếng Đức vào hoạt động đã đăng, lấy từ activities.json và activities-stock.json.",
    'en': "German already shows on its own when reading. This button saves it into the published activities as well, from activities.json and activities-stock.json.",
    'de': "Deutsch erscheint beim Lesen schon von selbst. Dieser Button speichert es zusätzlich in den veröffentlichten Aktivitäten, aus activities.json und activities-stock.json.",
}
T = 'src/strings.js'
t = io.open(T, encoding='utf-8').read()
OLD = {
    'vi': "Điền phần tiếng Đức còn thiếu cho các hoạt động đã đăng, lấy từ activities.json và activities-stock.json.",
    'en': "Fills any missing German on the published activities from activities.json and activities-stock.json.",
    'de': "Ergänzt fehlendes Deutsch bei den veröffentlichten Aktivitäten aus activities.json und activities-stock.json.",
}
for lg, old in OLD.items():
    if t.count(old) != 1:
        errors.append('strings.js: %d matches for the %s hint' % (t.count(old), lg))
        continue
    t = t.replace(old, LINES[lg], 1)
io.open(T, 'w', encoding='utf-8', newline='').write(t)

if errors:
    sys.stderr.write('\n'.join(errors) + '\n')
    sys.exit(1)
print('play.js: activities fill their own German at load; the button now only stores it')
