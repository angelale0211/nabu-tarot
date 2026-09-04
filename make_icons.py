# -*- coding: utf-8 -*-
"""App icons: an eight-pointed gold star with a crescent on deep indigo.
Run once (python make_icons.py); the PNGs are committed."""
import math, os
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
BG, BG2, GOLD = (0x12, 0x0F, 0x24), (0x2B, 0x23, 0x60), (0xE9, 0xC4, 0x6A)


def star(cx, cy, ro, ri, n=8, rot=-90.0):
    pts = []
    for i in range(n * 2):
        r = ri if i % 2 else ro
        a = math.radians(rot + i * 180.0 / n)
        pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    return pts


def draw(size, pad):
    S = size * 4  # supersample
    im = Image.new('RGB', (S, S), BG)
    d = ImageDraw.Draw(im)
    # soft radial glow
    for i in range(40, 0, -1):
        t = i / 40.0
        r = S * 0.62 * t
        col = tuple(int(BG[k] + (BG2[k] - BG[k]) * (1 - t) * 0.9) for k in range(3))
        d.ellipse([S / 2 - r, S / 2 - r, S / 2 + r, S / 2 + r], fill=col)
    c = S / 2
    R = S * (0.5 - pad)
    # crescent: big circle minus offset circle
    d.ellipse([c - R * 0.78, c - R * 0.78, c + R * 0.78, c + R * 0.78], fill=GOLD)
    off = R * 0.28
    d.ellipse([c - R * 0.66 + off, c - R * 0.66 - off * 0.2, c + R * 0.66 + off, c + R * 0.66 - off * 0.2], fill=BG)
    # star in the crescent's hollow
    d.polygon(star(c + R * 0.22, c - R * 0.12, R * 0.34, R * 0.14), fill=GOLD)
    return im.resize((size, size), Image.LANCZOS)


for name, size, pad in [('icon-180.png', 180, 0.10), ('icon-512.png', 512, 0.10), ('icon-512-maskable.png', 512, 0.22)]:
    p = os.path.join(HERE, name)
    draw(size, pad).save(p, optimize=True)
    print(name, os.path.getsize(p))
