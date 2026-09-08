# -*- coding: utf-8 -*-
"""Turn phone screenshots into Play store screenshots.

Three things are done to each one:

  1. The status bar at the top is cropped away - the clock, the signal bars and
     the battery. It says nothing about the app, and on a phone screenshot it is
     the part that identifies which phone took it.
  2. The strip at the very bottom goes with it, for the same reason, while
     leaving the app's own row of tabs alone.
  3. It is written out as PNG, which drops the metadata a JPEG carries. That
     metadata names the camera or the device model, and survives any amount of
     cropping - so this matters more than the cropping does.

Play also refuses a phone screenshot taller than twice its width. A full-height
modern phone screenshot is taller than that, so the crop is what makes these
usable at all.

Run:  python scripts/make_store_screenshots.py "<folder of screenshots>"
Out:  <folder>/play/*.png
"""
import os
import sys
from PIL import Image

TOP = 170      # status bar
BOTTOM = 66    # home indicator
MAX_RATIO = 2.0


def one(path, outdir):
    im = Image.open(path).convert('RGB')
    w, h = im.size
    top, bottom = TOP, BOTTOM
    if h - top - bottom < h * 0.5:      # a small screenshot: do not gut it
        top = bottom = 0
    box = im.crop((0, top, w, h - bottom))

    # Still too tall for Play? Take the rest off the top, where there is only
    # chrome, rather than off the bottom, where the content usually ends.
    bw, bh = box.size
    if bh > bw * MAX_RATIO:
        box = box.crop((0, bh - int(bw * MAX_RATIO), bw, bh))

    name = os.path.splitext(os.path.basename(path))[0] + '.png'
    out = os.path.join(outdir, name)
    box.save(out, 'PNG', optimize=True)          # PNG carries no EXIF
    print('%-18s %sx%s -> %sx%s  ratio %.3f  %d KB'
          % (os.path.basename(path), w, h, box.size[0], box.size[1],
             box.size[1] / float(box.size[0]), os.path.getsize(out) // 1024))


def main():
    src = sys.argv[1] if len(sys.argv) > 1 else '.'
    outdir = os.path.join(src, 'play')
    if not os.path.isdir(outdir):
        os.makedirs(outdir)
    shots = [f for f in sorted(os.listdir(src))
             if f.lower().endswith(('.jpg', '.jpeg', '.png'))
             and os.path.isfile(os.path.join(src, f))]
    if not shots:
        print('no screenshots found in', src)
        return
    for f in shots:
        one(os.path.join(src, f), outdir)
    print('\n%d written to %s' % (len(shots), outdir))


if __name__ == '__main__':
    main()
