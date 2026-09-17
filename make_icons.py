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
  icon-1024.png         the App Store and iPhone app icon: the same full pale
                        square as the Android launcher icon below, for the
                        same reason - the device's mask is the only edge.
  icon-512-maskable.png the Android launcher icon. Android masks it to the
                        device's own shape and needs the artwork to reach the
                        edges, so this one is a full pale square with the
                        badge's contents in its safe middle - and WITHOUT the
                        badge's thin outline ring. The launcher's own round
                        mask is the edge; a second ring drawn just inside it
                        read as a purple border around the app.
"""
import os
from PIL import Image, ImageChops, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
PALE = (251, 242, 247)      # the avatar's own pale-pink disc colour
PURPLE = (184, 164, 227)    # #B8A4E3, the manifest background_color
BIG = 2048                  # supersample once, then a single LANCZOS step down
RING_CUT = 230              # px from the centre of the 512px avatar where the ring's band
                            # begins (the ring itself runs 231-236)

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

def ringless():
    """The avatar with its outline ring lifted off, and nothing else.

    The ring runs 231-236px from the centre, but the two flowers sit ON it, so
    a round cut would clip their petals. Instead every pixel in the ring's band
    is cleared unless it lies within a few pixels of a petal - the flowers keep
    their own outlines, and the ring between them is gone. Outside the band the
    thin rim of the disc is dropped too; the launcher's mask is the edge."""
    from PIL import ImageFilter
    import math
    w, h = src.size
    px = src.load()
    c = (w - 1) / 2
    # Petals: coloured, neither the pale disc nor the dark outline purple.
    petal = Image.new('L', (w, h), 0)
    pp = petal.load()
    for y in range(h):
        for x in range(w):
            r_, g_, b_, a_ = px[x, y]
            if a_ < 200:
                continue
            pale = max(abs(r_ - PALE[0]), abs(g_ - PALE[1]), abs(b_ - PALE[2])) <= 40
            dark = r_ + g_ + b_ < 330
            if not pale and not dark and max(r_, g_, b_) - min(r_, g_, b_) > 45:
                pp[x, y] = 255
    keep = petal.filter(ImageFilter.MaxFilter(7))          # a petal and 3px round it: its outline
    kp = keep.load()
    out = src.copy()
    op = out.load()
    for y in range(h):
        for x in range(w):
            r = math.hypot(x - c, y - c)
            # Painted the disc's own pale, not cleared: a see-through band
            # leaves a faint ghost of the ring once the picture is resampled.
            if r >= RING_CUT - 4 and not kp[x, y]:
                op[x, y] = PALE + (255,)
    return out


# The launcher icon: the badge's contents on a full pale square, at the size
# they always had (the whole avatar at four fifths of the canvas), so Android's
# mask - circle, squircle or rounded square - is the only edge there is.
pad = 0.1
canvas = Image.new('RGBA', (BIG, BIG), PALE + (255,))
inner = int(BIG * (1 - 2 * pad))
canvas.alpha_composite(ringless().resize((inner, inner), Image.LANCZOS), ((BIG - inner) // 2, (BIG - inner) // 2))
save(canvas, 'icon-512-maskable.png', 512, flatten=PALE)
# The App Store icon and the iPhone app's home-screen icon, at the 1024px Apple
# asks for: the launcher picture, not the round badge. The badge on a purple
# square is what the owner saw on the home screen as a circle stuck inside a
# tile - iOS's own rounded square is the edge, exactly as Android's mask is.
# No alpha: iOS paints transparency black.
save(canvas, 'icon-1024.png', 1024, flatten=PALE)


# ---- the iPhone app's launch screen ----
# Only when asked for, with NABU_IOS pointing at the Capacitor shell: the file
# belongs to that project, not to the website. The storyboard shows it scaled
# to fill the screen, so a 2732px square is cropped to a phone-shaped strip of
# its middle: the badge is drawn at about 14% of the square, which comes out
# near 120pt tall on a phone. The ground is the app's own pale pink (#FBEEF2),
# the same as the Android splash and the loading screen that follows it.
IOS = os.environ.get('NABU_IOS', '')
if IOS:
    GROUND = (251, 238, 242)
    SPLASH, MARK = 2732, 380
    sheet = Image.new('RGBA', (SPLASH, SPLASH), GROUND + (255,))
    sheet.alpha_composite(round_badge.resize((MARK, MARK), Image.LANCZOS), ((SPLASH - MARK) // 2, (SPLASH - MARK) // 2))
    sheet = sheet.convert('RGB')
    dst = os.path.join(IOS, 'ios', 'App', 'App', 'Assets.xcassets')
    for name in ('splash-2732x2732.png', 'splash-2732x2732-1.png', 'splash-2732x2732-2.png'):
        sheet.save(os.path.join(dst, 'Splash.imageset', name), optimize=True)
    Image.open(os.path.join(HERE, 'icon-1024.png')).convert('RGB').save(os.path.join(dst, 'AppIcon.appiconset', 'AppIcon-512@2x.png'), optimize=True)
    print('iOS shell assets ->', dst)
