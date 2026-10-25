"""Generate original, clearly labeled placeholder art for the store mockup.

Run:  python3 tools/make_placeholders.py
Replace any file in assets/ with a real capture of the same name and size.
"""
import math
import random
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets"
FONT_B = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_M = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"

PALETTES = {
    "ghetto":  ((20, 70, 106), (8, 25, 42)),
    "combat":  ((27, 63, 107), (10, 20, 36)),
    "sort":    ((29, 77, 92), (10, 26, 34)),
    "hideout": ((44, 58, 90), (14, 18, 34)),
    "coop":    ((26, 90, 122), (9, 32, 48)),
    "trailer": ((18, 58, 92), (6, 15, 24)),
    "boss":    ((60, 40, 70), (14, 10, 22)),
}


def gradient(w, h, top, bot):
    img = Image.new("RGB", (w, h))
    d = ImageDraw.Draw(img)
    for y in range(h):
        t = y / h
        d.line([(0, y), (w, y)], fill=tuple(int(top[i] + (bot[i] - top[i]) * t) for i in range(3)))
    return img


def fish(d, x, y, s, col, flip=False):
    k = -1 if flip else 1
    d.ellipse([x - 22 * s, y - 13 * s, x + 22 * s, y + 13 * s], fill=col)
    d.polygon([(x + k * 18 * s, y), (x + k * 38 * s, y - 12 * s), (x + k * 38 * s, y + 12 * s)], fill=col)
    ex = x - k * 11 * s
    d.ellipse([ex - 3 * s, y - 6 * s, ex + 3 * s, y], fill=(11, 19, 28))


def crab(d, x, y, s):
    c = (212, 100, 79)
    d.pieslice([x - 28 * s, y - 18 * s, x + 28 * s, y + 18 * s], 180, 360, fill=c)
    d.ellipse([x - 46 * s, y - 22 * s, x - 26 * s, y - 2 * s], fill=c)
    d.ellipse([x + 26 * s, y - 22 * s, x + 46 * s, y - 2 * s], fill=c)
    for ox in (-9, 9):
        d.ellipse([x + ox * s - 3 * s, y - 22 * s, x + ox * s + 3 * s, y - 16 * s], fill=(11, 19, 28))


def scene(w, h, kind, seed, label=None, tag="PLACEHOLDER"):
    r = random.Random(seed)
    top, bot = PALETTES[kind]
    img = gradient(w, h, top, bot)
    over = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    od = ImageDraw.Draw(over)
    for _ in range(6):  # light shafts
        x = r.random() * w
        od.polygon([(x, 0), (x + w * .07, 0), (x + w * .2, h), (x + w * .05, h)],
                   fill=(150, 215, 245, int(12 + r.random() * 18)))
    for i in range(30):  # trash-built prison walls
        bx = r.random() * w
        bh = h * (.15 + r.random() * .45)
        bw = w * (.02 + r.random() * .05)
        col = [(42, 91, 79), (59, 79, 106), (90, 107, 58), (76, 63, 94), (47, 74, 92)][i % 5]
        od.rectangle([bx, h * .78 - bh, bx + bw, h * .78], fill=col + (150,))
        od.rectangle([bx + bw * .2, h * .78 - bh + 6, bx + bw * .34, h * .78 - bh * .4], fill=(210, 240, 240, 60))
    over = over.filter(ImageFilter.GaussianBlur(w / 900))
    img.paste(over, (0, 0), over)
    d = ImageDraw.Draw(img)
    pts = [(0, h)] + [(w * i / 8, h * (.76 + r.random() * .06)) for i in range(9)] + [(w, h)]
    d.polygon(pts, fill=(190, 162, 108))
    for _ in range(28):
        bx, by, br = r.random() * w, r.random() * h * .7, (2 + r.random() * 7) * w / 1280
        d.ellipse([bx - br, by - br, bx + br, by + br], outline=(220, 240, 255), width=max(1, int(w / 700)))
    s = w / 1280 * 2.2
    sand = (227, 199, 141)
    if kind in ("combat", "trailer"):
        fish(d, w * .3, h * .5, s, sand)
        crab(d, w * .7, h * .74, s * 1.1)
        for i in range(14):
            px, py = w * .36 + i * w * .022, h * .5 + (r.random() - .5) * h * .06
            pr = (2 + r.random() * 3) * s
            d.ellipse([px - pr, py - pr, px + pr, py + pr], fill=sand)
    elif kind == "sort":
        for i, c in enumerate([(98, 182, 220), (127, 209, 168), (201, 184, 160)]):
            x0 = w * (.28 + i * .17)
            d.rectangle([x0, h * .5, x0 + w * .11, h * .76], fill=c)
            d.rectangle([x0, h * .5, x0 + w * .11, h * .54], fill=tuple(int(v * .7) for v in c))
        fish(d, w * .15, h * .4, s, sand)
    elif kind == "hideout":
        d.rectangle([w * .55, h * .28, w * .71, h * .78], fill=(58, 76, 110))
        d.rectangle([w * .57, h * .32, w * .69, h * .5], fill=(98, 182, 220))
        fish(d, w * .35, h * .55, s, sand, flip=True)
    elif kind == "coop":
        fish(d, w * .42, h * .42, s, sand)
        fish(d, w * .58, h * .52, s, (143, 208, 238))
        fish(d, w * .5, h * .3, s * .8, (240, 160, 168))
    elif kind == "ghetto":
        crab(d, w * .2, h * .76, s * .9)
        crab(d, w * .82, h * .75, s * .8)
        fish(d, w * .5, h * .45, s, sand)
    elif kind == "boss":
        crab(d, w * .55, h * .72, s * 2.4)
        fish(d, w * .2, h * .45, s, sand)
        fish(d, w * .27, h * .58, s, (143, 208, 238))

    if kind == "trailer":  # play glyph
        cx, cy, rr = w / 2, h / 2, h * .1
        d.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], outline=(230, 238, 245), width=max(2, int(h / 150)), fill=(10, 18, 28))
        d.polygon([(cx - rr * .35, cy - rr * .5), (cx - rr * .35, cy + rr * .5), (cx + rr * .55, cy)], fill=(230, 238, 245))

    if tag:
        fs = max(10, int(h * .028))
        f = ImageFont.truetype(FONT_M, fs)
        pad = fs // 2
        tw = d.textlength(tag, font=f)
        d.rectangle([pad, pad, pad + tw + pad * 2, pad + fs + pad * 1.4], fill=sand)
        d.text((pad * 2, pad * 1.6), tag, font=f, fill=(27, 20, 8))
    if label:
        fs = max(10, int(h * .024))
        f = ImageFont.truetype(FONT_M, fs)
        d.rectangle([0, h - fs * 2.2, w, h], fill=(5, 10, 16))
        d.text((fs * .7, h - fs * 1.65), label, font=f, fill=(200, 214, 224))
    return img


def capsule(w, h, path, seed):
    img = scene(w, h, "coop", seed, tag=None)
    d = ImageDraw.Draw(img)
    f = ImageFont.truetype(FONT_B, int(h * .26))
    for i, (txt, col) in enumerate((("SPLIT IT", (230, 238, 245)), ("OUT", (227, 199, 141)))):
        tw = d.textlength(txt, font=f)
        y = h * .2 + i * h * .28
        d.text(((w - tw) / 2 + 3, y + 4), txt, font=f, fill=(0, 0, 0))
        d.text(((w - tw) / 2, y), txt, font=f, fill=col)
    ft = ImageFont.truetype(FONT_M, max(9, int(h * .06)))
    d.rectangle([6, 6, 6 + d.textlength("PLACEHOLDER LOGO", font=ft) + 10, 10 + h * .08], fill=(227, 199, 141))
    d.text((11, 8), "PLACEHOLDER LOGO", font=ft, fill=(27, 20, 8))
    img.save(path, quality=90)


def main():
    (OUT / "screenshots").mkdir(parents=True, exist_ok=True)
    shots = [
        ("trailer_poster.jpg", "trailer", "Trailer poster - replace with assets/screenshots/trailer_poster.jpg"),
        ("ss_01.jpg", "ghetto", "Screenshot 01 - The Coral Ghetto - assets/screenshots/ss_01.jpg"),
        ("ss_02.jpg", "combat", "Screenshot 02 - Sand-spit combat - assets/screenshots/ss_02.jpg"),
        ("ss_03.jpg", "sort", "Screenshot 03 - Sorting station - assets/screenshots/ss_03.jpg"),
        ("ss_04.jpg", "hideout", "Screenshot 04 - Upgrade vending machine - assets/screenshots/ss_04.jpg"),
        ("ss_05.jpg", "coop", "Screenshot 05 - Co-op escape - assets/screenshots/ss_05.jpg"),
        ("ss_06.jpg", "boss", "Screenshot 06 - Don Hermit (concept) - assets/screenshots/ss_06.jpg"),
    ]
    for i, (name, kind, label) in enumerate(shots):
        scene(1920, 1080, kind, i + 3, label).save(OUT / "screenshots" / name, quality=88)
    capsule(460, 215, OUT / "header_capsule.jpg", 11)
    bg = scene(1438, 810, "ghetto", 42, tag=None).filter(ImageFilter.GaussianBlur(6))
    bg.save(OUT / "page_bg.jpg", quality=80)
    for i, kind in enumerate(("sort", "coop")):
        scene(1232, 400, kind, 60 + i, f"About section image {i + 1} - assets/about_{i + 1}.jpg").save(OUT / f"about_{i + 1}.jpg", quality=85)
    print("placeholders written to", OUT)


if __name__ == "__main__":
    main()
