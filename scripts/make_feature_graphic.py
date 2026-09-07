# -*- coding: utf-8 -*-
"""The 1024x500 banner Google Play shows above the listing.

Play insists on one and will not publish without it. It is also the first thing
anybody sees, so it is the logo on the app's own night-sky colours rather than
a stretched screenshot: the logo centred left, the name beside it, and a few
stars. Nothing near the edges - Play crops this differently on different
screens, and anything close to a border eventually gets cut.

Run:  python scripts/make_feature_graphic.py
Out:  feature_graphic_1024x500.png
"""
import os
import random
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
W, H = 1024, 500

# The app's own colours: the deep purple of the logo card, and its pinks.
NIGHT_TOP = (28, 18, 56)
NIGHT_BOTTOM = (61, 42, 110)
CREAM = (251, 243, 245)
PINK = (246, 187, 203)
BLUE = (175, 200, 240)


def gradient(w, h, top, bottom):
    img = Image.new('RGB', (w, h), top)
    d = ImageDraw.Draw(img)
    for y in range(h):
        t = y / float(h - 1)
        d.line([(0, y), (w, y)],
               fill=tuple(int(top[i] + (bottom[i] - top[i]) * t) for i in range(3)))
    return img


def stars(img, n=90):
    d = ImageDraw.Draw(img, 'RGBA')
    rnd = random.Random(11)          # same sky every run, so rebuilds do not churn
    for _ in range(n):
        x, y = rnd.randint(0, W), rnd.randint(0, H)
        r = rnd.choice([1, 1, 1, 2, 2, 3])
        a = rnd.randint(60, 210)
        colour = rnd.choice([CREAM, PINK, BLUE])
        d.ellipse([x - r, y - r, x + r, y + r], fill=colour + (a,))
    return img


def font(size):
    """Whatever this machine has. The name is short, so anything legible does."""
    for name in ('segoeuib.ttf', 'seguisb.ttf', 'arialbd.ttf', 'DejaVuSans-Bold.ttf'):
        for base in (r'C:\Windows\Fonts', '/usr/share/fonts/truetype/dejavu'):
            p = os.path.join(base, name)
            if os.path.exists(p):
                try:
                    return ImageFont.truetype(p, size)
                except Exception:
                    pass
    return ImageFont.load_default()


def main():
    img = stars(gradient(W, H, NIGHT_TOP, NIGHT_BOTTOM))

    logo_path = os.path.join(ROOT, 'icon-512.png')
    logo = Image.open(logo_path).convert('RGBA')
    side = 300
    logo = logo.resize((side, side), Image.LANCZOS)
    # Left of centre, well inside the safe area Play never crops.
    img.paste(logo, (108, (H - side) // 2), logo)

    d = ImageDraw.Draw(img)
    d.text((460, 196), 'Nabu Tarot', font=font(78), fill=CREAM)
    d.text((464, 292), 'Tarot · Lenormand · Chiêm tinh', font=font(30), fill=PINK)

    out = os.path.join(ROOT, 'feature_graphic_1024x500.png')
    img.save(out, 'PNG', optimize=True)
    print('%s  %dx%d  %d bytes' % (os.path.basename(out), W, H, os.path.getsize(out)))


if __name__ == '__main__':
    main()
