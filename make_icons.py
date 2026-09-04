# -*- coding: utf-8 -*-
"""App icons from logo.svg: headless Edge renders the SVG, Pillow resizes.
Run once (python make_icons.py); the PNGs are committed."""
import os, subprocess, tempfile
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
EDGE = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
SIZE = 1024
html = os.path.join(tempfile.mkdtemp(prefix='nabu-icon-'), 'icon.html')
svg = open(os.path.join(HERE, 'logo.svg'), encoding='utf-8').read()
open(html, 'w', encoding='utf-8').write('<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#B8A4E3}svg{display:block;width:%dpx;height:%dpx}</style></head><body>%s</body></html>' % (SIZE, SIZE, svg))
shot = os.path.join(os.path.dirname(html), 'icon.png')
subprocess.run([EDGE, '--headless=new', '--disable-gpu', '--no-first-run', '--hide-scrollbars', '--window-size=%d,%d' % (SIZE, SIZE),
                '--screenshot=' + shot, 'file:///' + html.replace('\\', '/')], capture_output=True, timeout=120)
im = Image.open(shot).convert('RGB')
for name, size, pad in [('icon-180.png', 180, 0.0), ('icon-512.png', 512, 0.0), ('icon-512-maskable.png', 512, 0.12)]:
    canvas = Image.new('RGB', (SIZE, SIZE), (0xB8, 0xA4, 0xE3))
    inner = int(SIZE * (1 - 2 * pad))
    canvas.paste(im.resize((inner, inner), Image.LANCZOS), ((SIZE - inner) // 2, (SIZE - inner) // 2))
    p = os.path.join(HERE, name)
    canvas.resize((size, size), Image.LANCZOS).save(p, optimize=True)
    print(name, os.path.getsize(p))
