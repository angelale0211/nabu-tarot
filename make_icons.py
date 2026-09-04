# -*- coding: utf-8 -*-
"""App icons from Nabu's avatar (logo.png, the real round logo). Pillow only.
Run once (python make_icons.py); the PNGs are committed."""
import os
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
BG = (251, 242, 247)  # the avatar's own pale-pink disc colour
src = Image.open(os.path.join(HERE, 'logo.png')).convert('RGBA')
for name, size, pad in [('icon-180.png', 180, 0.0), ('icon-512.png', 512, 0.0), ('icon-512-maskable.png', 512, 0.1)]:
    big = 1024
    canvas = Image.new('RGBA', (big, big), BG + (255,))
    inner = int(big * (1 - 2 * pad))
    layer = src.resize((inner, inner), Image.LANCZOS)
    canvas.alpha_composite(layer, ((big - inner) // 2, (big - inner) // 2))
    p = os.path.join(HERE, name)
    canvas.convert('RGB').resize((size, size), Image.LANCZOS).save(p, optimize=True)
    print(name, os.path.getsize(p))
