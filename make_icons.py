# -*- coding: utf-8 -*-
"""App icons from Nabu's avatar (logo.png, the real round logo). Pillow only.
Run once (python make_icons.py); the PNGs are committed.

logo.png is already the round badge with nothing outside the circle, so these
keep it that way. The pale square this script used to paint behind it is what
showed up as a white box floating on the purple splash of the Android app, and
as a pale tile on an iPhone home screen.

Where each file goes, and why it looks the way it does:

  icon-512.png          the browser's install icon, and the picture Android
                        bakes into the native splash. Round, nothing outside
                        the circle, so it sits directly on the purple.
  icon-192.png          the manifest's small install icon and the browser tab.
                        Same treatment.
  icon-180.png          the iPhone home screen (apple-touch-icon) and the
                        notification badge. iOS paints transparent pixels
                        BLACK and applies its own rounded mask, so this one
                        keeps the brand purple behind the circle instead of a
                        hole. Saved without alpha for the same reason.
  icon-512-maskable.png the Android launcher icon. Android masks it to the
                        device's own shape and needs the artwork to reach the
                        edges, so this one keeps its pale square and its safe
                        margin. Deliberately not round here: the system rounds
                        it.
"""
import os
from PIL import Image, ImageChops, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
PALE = (251, 242, 247)      # the avatar's own pale-pink disc colour
PURPLE = (184, 164, 227)    # #B8A4E3, the manifest background_color
BIG = 2048                  # supersample once, then a single LANCZOS step down

src = Image.open(os.path.join(HERE, 'logo.png')).convert('RGBA')


def badge():
    """The round badge, grown until the circle touches all four edges, with
    everything outside it cut away. logo.png carries a small clear margin
    around the disc; left in, that margin is the thing that reads as a box of
    empty space around the logo once anything is drawn behind it."""
    # A few stray pixels of almost-nothing sit outside the disc in the
    # avatar; measuring the extent from those would leave the circle a
    # hair short of the edge, so anything under a tenth of a percent of
    # opacity is not part of the picture.
    solid = src.getchannel('A').point(lambda v: 255 if v > 8 else 0)
    box = solid.getbbox()                        # the disc's own extent
    core = src.crop(box)
    w, h = core.size
    side = max(w, h)
    square = Image.new('RGBA', (side, side), (0, 0, 0, 0))
    square.alpha_composite(core, ((side - w) // 2, (side - h) // 2))
    layer = square.resize((BIG, BIG), Image.LANCZOS)
    # The mask is drawn four times over and shrunk back down, so the rim is
    # smooth rather than stepped.
    mask = Image.new('L', (BIG * 4, BIG * 4), 0)
    # A shade wider than the canvas, so the rim is solid right to the edge
    # rather than half-covered by the last row of pixels.
    ImageDraw.Draw(mask).ellipse((-2, -2, BIG * 4 + 1, BIG * 4 + 1), fill=255)
    mask = mask.resize((BIG, BIG), Image.LANCZOS)
    out = Image.new('RGBA', (BIG, BIG), (0, 0, 0, 0))
    out.paste(layer, (0, 0), mask)
    out.putalpha(ImageChops.multiply(out.getchannel('A'), mask))
    return out


def save(img, name, size, flatten=None):
    if flatten:
        base = Image.new('RGBA', img.size, flatten + (255,))
        base.alpha_composite(img)
        img = base.convert('RGB')
    p = os.path.join(HERE, name)
    img.resize((size, size), Image.LANCZOS).save(p, optimize=True)
    print(name, os.path.getsize(p))


round_badge = badge()
save(round_badge, 'icon-512.png', 512)
save(round_badge, 'icon-192.png', 192)
save(round_badge, 'icon-180.png', 180, flatten=PURPLE)

# The launcher icon: the badge inside its pale square, with a tenth of the
# canvas left clear all round so Android's mask never bites into the art.
pad = 0.1
canvas = Image.new('RGBA', (BIG, BIG), PALE + (255,))
inner = int(BIG * (1 - 2 * pad))
canvas.alpha_composite(src.resize((inner, inner), Image.LANCZOS), ((BIG - inner) // 2, (BIG - inner) // 2))
save(canvas, 'icon-512-maskable.png', 512, flatten=PALE)
