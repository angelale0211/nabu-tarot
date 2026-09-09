# -*- coding: utf-8 -*-
"""A layout pass that only applies when the page is in German.

The layout was measured against Vietnamese and English, which are both much
shorter than German. Nachrichtenbaum, Schmetterlingsgarten and Buddhistischer
Kalender (Thailand) do not fit where "cây" and "tree" did, so justified text
opens rivers of white space, compound nouns spill out of narrow tiles, and a
clamped label loses its ending.

Rather than loosen the layout for all three languages, this adds one block at
the end of the stylesheet that only bites under `html[lang="de"]`. core.js
already sets that attribute on every route, which is also what lets the
browser hyphenate German correctly.

Vietnamese and English render exactly as before: nothing outside the block is
touched, apart from the one table rule the block has to override, which is
left as it was for the other two languages.
"""
import io, sys

P = 'src/shell.html'
errors = []
s = io.open(P, encoding='utf-8').read()

if 'lang="de"' in s:
    print('shell.html: the German block is already there')
    sys.exit(0)

CSS = '''
/* ---- German ----------------------------------------------------------
   German words run far longer than the Vietnamese and English this layout
   was measured against, so three habits that read well in those two break
   in German. All three are relaxed here and nowhere else, which is why
   every rule is behind html[lang="de"] — core.js sets that on each route,
   and it is also what tells the browser how to hyphenate.

   1. Justified text needs short words. With long ones it opens rivers of
      white space down the middle of a paragraph, so German sets its own
      ragged right instead.
   2. Long words may hyphenate rather than overrun. The limits keep it to
      words long enough to need it: ordinary prose is not peppered with
      hyphens, and nothing shorter than ten letters is ever broken.
   3. A label in a narrow tile may break inside a word. Spilling into the
      next tile, or losing its ending to a line clamp, is worse than a
      word broken across two lines. */
html[lang="de"] #main p,html[lang="de"] #main li,
html[lang="de"] .note span,html[lang="de"] #foot .tagline{text-align:left}
html[lang="de"] #main p,html[lang="de"] #main li,html[lang="de"] .hint,
html[lang="de"] .muted,html[lang="de"] .lead,html[lang="de"] .tbl td,
html[lang="de"] .look b,html[lang="de"] .actquick .aq b,
html[lang="de"] .actbtn b,html[lang="de"] .actbtn .meta,
html[lang="de"] .freegrid .fg .s,html[lang="de"] .wherepick .wp .s,
html[lang="de"] .aq b,html[lang="de"] .chip,html[lang="de"] .btn{
  -webkit-hyphens:auto;hyphens:auto;
  -webkit-hyphenate-limit-before:4;-webkit-hyphenate-limit-after:3;
  hyphenate-limit-chars:10 4 3}
/* Tiles are narrow enough that a word can be wider than the tile itself,
   which hyphenation alone cannot fix. */
html[lang="de"] .look b,html[lang="de"] .actquick .aq b,
html[lang="de"] .actbtn b,html[lang="de"] .freegrid .fg .s{overflow-wrap:break-word}
/* One more line for a label that German needs two and a half of. */
html[lang="de"] .actquick .aq b{-webkit-line-clamp:3}
/* The label column of a data table is held on one line so it reads as a
   column. A German label can be wider than the card, so in German it wraps
   and the value keeps its half of the row. */
html[lang="de"] .tbl td:first-child{white-space:normal;overflow-wrap:break-word}
html[lang="de"] #today .tbl td:first-child{width:52%}
'''

MARK = '</style>'
if s.count(MARK) != 1:
    errors.append('shell.html: %d closing style tags' % s.count(MARK))
else:
    s = s.replace(MARK, CSS.strip() + '\n' + MARK, 1)
    io.open(P, 'w', encoding='utf-8', newline='').write(s)
    print('shell.html: German-only layout rules added')

if errors:
    sys.stderr.write('\n'.join(errors) + '\n')
    sys.exit(1)
