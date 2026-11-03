"""Riso-ify a photo: levels -> Floyd-Steinberg dither to 1-bit -> single ink on transparent.
Usage: riso.py in.jpg out.png [dither_width] [contrast] [brightness]"""
import sys
from PIL import Image, ImageOps, ImageEnhance

src, dst = sys.argv[1], sys.argv[2]
dw      = int(sys.argv[3]) if len(sys.argv) > 3 else 900
contrast= float(sys.argv[4]) if len(sys.argv) > 4 else 1.35
bright  = float(sys.argv[5]) if len(sys.argv) > 5 else 1.12

im = Image.open(src).convert("L")
im = ImageOps.autocontrast(im, cutoff=1)
im = ImageEnhance.Contrast(im).enhance(contrast)
im = ImageEnhance.Brightness(im).enhance(bright)

# dither at a reduced size so the grain stays coarse when the poster scales it up
h = round(im.height * dw / im.width)
im = im.resize((dw, h), Image.LANCZOS).convert("1")   # Floyd-Steinberg

# ink where the dither put a dot, paper = transparent so the page colour shows through
INK = (29, 46, 160)
out = Image.new("RGBA", im.size, INK + (0,))
mask = im.point(lambda v: 255 if v == 0 else 0).convert("L")
out.putalpha(mask)
out.save(dst, optimize=True)
print(f"{dst}  {out.width}x{out.height}")
