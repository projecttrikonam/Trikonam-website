"""
build_pdf_manual.py — the brand manual as a print-ready PDF.

Every character is drawn as an outline, so the file carries no font dependency
to the printer. Pages are A4 landscape.
"""
import os, sys, io, glob
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import cairosvg
from pypdf import PdfWriter, PdfReader
import brand as B, lockups as L, diagrams as D, geometry as G
import textlayout as T
from brand import PALETTE as P
from textlayout import FRAUNCES, FRAUNCES_L, KARLA, KARLA_M, WORDMARK

PW, PH = 1200.0, 848.0          # units; page is emitted at 297 x 210 mm
M = 88.0                        # margin
CW = PW - 2 * M                 # content width

INK = P["forest"][0]; TEXT = P["espresso"][0]; SOFT = P["moss"][0]
MUTED = "#5F564B"; RULE = P["border"][0]; SAND = P["sand"][0]; IVORY = P["ivory"][0]
GOLD = P["gold"][0]

pages = []
CROP = False                    # set by build(); adds crop marks + bleed


def page(body, ground=IVORY, number=None, title=None):
    hdr = ""
    if number is not None:
        g, _ = T.draw(KARLA, "TRIKONAM  BRAND IDENTITY  V1.1", 10, M, M - 26,
                      SOFT, tracking=1.9)
        hdr += g
        g, _ = T.draw(KARLA, f"{number:02d}", 10, PW - M, M - 26, SOFT, anchor="end")
        hdr += g
        hdr += (f'<line x1="{M}" y1="{M-16}" x2="{PW-M}" y2="{M-16}" '
                f'stroke="{RULE}" stroke-width="1"/>')
    pages.append(f'<rect width="{PW}" height="{PH}" fill="{ground}"/>{hdr}{body}')


def head(text, y, size=44, fill=INK, f=FRAUNCES):
    return T.draw(f, text, size, M, y, fill)[0]


def eyebrow(text, y, fill=SOFT):
    g, adv = T.draw(KARLA_M, text.upper(), 11, M + 42, y, fill, tracking=2.2)
    return (f'<line x1="{M}" y1="{y-4}" x2="{M+30}" y2="{y-4}" stroke="{fill}" '
            f'stroke-width="1" opacity="0.55"/>') + g


def fit(svg_markup, x, y, w, h):
    """Drop a generated SVG into the page, scaled to fit a box."""
    import re
    m = re.search(r'viewBox="([-\d. ]+)"', svg_markup)
    vx, vy, vw, vh = [float(v) for v in m.group(1).split()]
    s = min(w / vw, h / vh)
    inner = svg_markup.split(">", 1)[1].rsplit("</svg>", 1)[0]
    tx = x + (w - vw * s) / 2 - vx * s
    ty = y + (h - vh * s) / 2 - vy * s
    return f'<g transform="translate({tx:.2f},{ty:.2f}) scale({s:.5f})">{inner}</g>'


# ---------------------------------------------------------------- 1 cover
cov, cvb, _ = L.render("primary", ink=INK, pad=0.03)
b = fit(cov, M, 200, 300, 420)
b += head("Brand Identity Manual", 300, 62)
g, y = T.paragraph(FRAUNCES_L, "The master logo system for Trikonam, a school of "
                   "classical Hatha Yoga.", 22, 520, 356, 560, 1.45, MUTED)
b += g
b += f'<line x1="520" y1="640" x2="{PW-M}" y2="640" stroke="{RULE}" stroke-width="1"/>'
b += T.draw(KARLA, "VERSION 1.1", 11, 520, 672, SOFT, tracking=2.2)[0]
b += T.draw(KARLA, "MASTER LOGO SYSTEM", 11, 700, 672, SOFT, tracking=2.2)[0]
page(b)

# ---------------------------------------------------------------- 2 contents
b = eyebrow("Contents", M + 10) + head("What is in this document", M + 78, 38)
items = [("01", "The mark", "Philosophy and intent"),
         ("02", "Construction", "The field, the axis, the triangle, the lotus"),
         ("03", "The logo system", "Eleven approved configurations, two optical cuts"),
         ("04", "Clear space and minimum size", "How much air, and how small"),
         ("05", "Incorrect usage", "Eight things that undo the work"),
         ("06", "Colour", "Forest Ink and the palette it belongs to"),
         ("07", "Typography", "The wordmark, and the two system faces"),
         ("08", "Backgrounds and photography", "Where the mark may stand"),
         ("09", "Accessibility", "Measured contrast, and what it permits"),
         ("10", "Production", "Print and digital"),
         ("11", "Asset library", "What is supplied")]
y = 300
for num, name, desc in items:
    b += T.draw(KARLA_M, num, 13, M, y, SOFT, tracking=1.4)[0]
    b += T.draw(FRAUNCES, name, 19, M + 56, y, INK)[0]
    b += T.draw(KARLA, desc, 13, 560, y, MUTED)[0]
    b += f'<line x1="{M}" y1="{y+14}" x2="{PW-M}" y2="{y+14}" stroke="{RULE}" stroke-width="1"/>'
    y += 44
page(b, number=2)

# ---------------------------------------------------------------- 3 the mark
b = eyebrow("01  The mark", M + 10)
b += head("A figure, a triangle, and a flower", M + 78, 40)
b += head("opening at the top of a breath", M + 128, 40)
col = 470
g, yy = T.paragraph(KARLA, "The symbol is a single practitioner in Trikonasana, the "
    "triangle posture the school is named for, with a lotus opening from the raised hand.",
    16, M, 300, col, 1.6, TEXT)
b += g
g, yy = T.paragraph(KARLA, "Everything the brand believes is already in the drawing. The "
    "two legs and the ground make a triangle, sthira, steadiness, the part of the practice "
    "that does not move. Rising from it, on a single vertical, is the extended arm and the "
    "lotus, sukha, ease, the part that opens. The mark is that relationship: nothing rises "
    "without a base.", 14, M, yy + 52, col, 1.62, TEXT)
b += g
g, _ = T.paragraph(KARLA, "It is drawn as one continuous weight of line, the way a posture "
    "is held at one continuous effort. No ornament, no shading, no flourish. At large sizes "
    "a delicate profile and a hair knot appear; at small sizes they quietly withdraw and "
    "the silhouette carries.", 14, M, yy + 46, col, 1.62, MUTED)
b += g
sym, _, _ = L.render("symbol", ink=INK, pad=0.04)
b += fit(sym, 660, 250, 440, 480)
page(b, number=3)

# ---------------------------------------------------------------- 4 construction
b = eyebrow("02  Construction", M + 10)
b += head("The geometry was already in the drawing", M + 78, 36)
b += fit(D.construction(), M, 210, 470, 560)
x2 = 620
g, _ = T.paragraph(KARLA, "The mark stands on an 11 by 14 module field. Three relationships "
    "govern it, and all three were measured from the founding artwork rather than imposed "
    "on it.", 15, x2, 250, CW - (x2 - M), 1.6, TEXT)
b += g
rows = [("The field", "11 wide by 14 high, one module = u. Every element is positioned "
                      "against this grid, never by eye."),
        ("The axis", "The lotus and the raised arm share one vertical, standing on the "
                     "field's quarter line, 11u divided by 4."),
        ("The triangle", "The legs and the earth line form the base. Its height is its "
                         "width multiplied by 0.382, the golden section squared. Measured "
                         "0.38182 against a true 0.381966.")]
y = 360
for k, v in rows:
    b += T.draw(KARLA_M, k.upper(), 11, x2, y, SOFT, tracking=1.8)[0]
    g, y = T.paragraph(KARLA, v, 14, x2, y + 26, CW - (x2 - M), 1.58, TEXT)
    b += g
    y += 44
g, _ = T.paragraph(KARLA, "Stroke weight is uniform. The skull and the hair knot are true "
    "circles. Nothing in the mark is approximate.", 13, x2, y + 6, CW - (x2 - M), 1.55, MUTED)
b += g
page(b, number=4)

# ---------------------------------------------------------------- 5 lotus + weights
b = eyebrow("02  Construction, continued", M + 10)
b += head("The lotus, and the two optical cuts", M + 78, 36)
b += fit(D.lotus_construction(), M, 210, 420, 300)
g, _ = T.paragraph(KARLA, "Five petals on the ascending axis at 0, 35 and 62 degrees. Each "
    "is a true vesica, two circular arcs struck between the base point and the tip, and the "
    "left half is an exact mirror of the right.", 14, M, 560, 420, 1.58, TEXT)
b += g
b += fit(D.weights(), 560, 230, 540, 300)
g, _ = T.paragraph(KARLA, "One drawing, issued in two weights. The Display stroke is 0.89 "
    "per cent of the symbol's height; the Compact stroke is 1.43 per cent. The geometry, "
    "the proportions and the curves are identical. Below 140 px of symbol height the Display "
    "stroke falls under one device pixel and the mark greys out; the Compact cut is drawn "
    "for exactly that range. Below 60 px, use the reduced mark.", 14, 560, 570, 540, 1.58, TEXT)
b += g
page(b, number=5)

# ---------------------------------------------------------------- 6 the system
b = eyebrow("03  The logo system", M + 10)
b += head("Eleven approved configurations", M + 78, 36)
g, _ = T.paragraph(KARLA, "Choose by the space available, never by preference. If a lockup "
    "is not shown here, it does not exist.", 14, M, 250, 760, 1.55, MUTED)
b += g
specs = [("primary", "Primary / stacked"), ("horizontal", "Horizontal"),
         ("symbol", "Symbol"), ("wordmark", "Wordmark"), ("square", "Square"),
         ("circular", "Roundel"), ("stamp", "Seal"), ("seal", "Reduced mark")]
cw, ch = 250.0, 200.0
x0, y0 = M, 300.0
for i, (n, lab) in enumerate(specs):
    cx = x0 + (i % 4) * (cw + 12)
    cy = y0 + (i // 4) * (ch + 56)
    s, _, _ = L.render(n, ink=INK, pad=0.0 if n == "seal" else 0.05)
    b += f'<rect x="{cx}" y="{cy}" width="{cw}" height="{ch}" fill="{SAND}"/>'
    b += fit(s, cx + 26, cy + 22, cw - 52, ch - 44)
    b += T.draw(KARLA_M, lab.upper(), 10, cx, cy + ch + 22, INK, tracking=1.6)[0]
page(b, number=6)

# ---------------------------------------------------------------- 7 clear space
b = eyebrow("04  Clear space", M + 10)
b += head("The mark needs air, and it needs a floor", M + 78, 36)
b += fit(D.clear_space(), M, 230, 480, 490)
x2 = 640
g, y = T.paragraph(KARLA, "X is the height of the lotus, 0.136 of the symbol's height at "
    "whatever size the mark is used. One rule for every lockup, so the margin reads as equal "
    "across the whole set. For the wordmark alone, X is its cap height.", 15, x2, 270,
    CW - (x2 - M), 1.6, TEXT)
b += g
g, y = T.paragraph(KARLA, "Nothing may enter this zone: no type, image, rule, or edge of "
    "page. Clear space is a minimum, not a target. Where the layout allows, give the mark "
    "more.", 14, x2, y + 40, CW - (x2 - M), 1.6, TEXT)
b += g
g, _ = T.paragraph(KARLA, "Never place the logo in a coloured box purely to separate it "
    "from a background. Change the colourway instead.", 13, x2, y + 44,
    CW - (x2 - M), 1.55, MUTED)
b += g
page(b, number=7)

# ---------------------------------------------------------------- 8 minimum size
b = eyebrow("04  Minimum size", M + 10)
b += head("How small the mark may go", M + 78, 36)
b += fit(D.min_size(), M, 250, CW, 300)
g, _ = T.paragraph(KARLA, "Each is shown at its own minimum, in the optical cut it is "
    "approved in. Below these, step down to the next lockup: the primary gives way to the "
    "horizontal, the horizontal to the symbol, the symbol to the reduced mark.",
    14, M, 620, 780, 1.58, TEXT)
b += g
g, _ = T.paragraph(KARLA, "On uncoated and recycled stock, expect dot gain to close fine "
    "apertures. Step up one lockup from the minimum, and proof before committing to a run.",
    13, M, 706, 780, 1.55, MUTED)
b += g
page(b, number=8)

# ---------------------------------------------------------------- 9 misuse
b = eyebrow("05  Incorrect usage", M + 10)
b += head("Eight things that undo the work", M + 78, 36)
cw2 = 204.0
for i, (label, kind) in enumerate(D.MISUSE):
    cx = M + (i % 4) * (cw2 + 12)
    cy = 272 + (i // 4) * (cw2 + 68)
    b += fit(D.misuse_tile(kind), cx, cy, cw2, cw2)
    b += (f'<line x1="{cx}" y1="{cy+cw2}" x2="{cx+cw2}" y2="{cy}" stroke="#B23A3A" '
          f'stroke-width="1.4" opacity="0.62"/>')
    lines = T.wrap(KARLA, label, 11, cw2)
    for j, ln in enumerate(lines[:2]):
        b += T.draw(KARLA, ln, 11, cx, cy + cw2 + 22 + j * 15, MUTED)[0]
page(b, number=9)

# ---------------------------------------------------------------- 10 colour
b = eyebrow("06  Colour", M + 10)
b += head("Forest Ink, and the palette it belongs to", M + 78, 36)
g, _ = T.paragraph(KARLA, "The logo's ink is Forest Ink, the school's moss accent taken to "
    "its darkest value. It reads as near-black, carries a trace of green, and is at home on "
    "warm ivory in a way a true navy never is.", 14, M, 250, 900, 1.55, TEXT)
b += g


def _cmyk(h):
    r, gg, bb = (int(h[i:i + 2], 16) / 255 for i in (1, 3, 5))
    k = 1 - max(r, gg, bb)
    if k >= 1:
        return (0, 0, 0, 100)
    return tuple(round(v * 100) for v in
                 ((1 - r - k) / (1 - k), (1 - gg - k) / (1 - k), (1 - bb - k) / (1 - k), k))


PANT = {"forest": "5605 C", "espresso": "Neutral Black C", "stone": "Warm Gray 11 C",
        "moss": "5757 C",
        "mossdark": "5605 C", "gold": "730 C", "goldleaf": "872 C", "sand": "9224 C",
        "ivory": "9184 C", "border": "9225 C"}
order = ["forest", "espresso", "stone", "moss", "mossdark", "gold", "goldleaf",
         "sand", "ivory", "border"]
GAPX = 8.0
cwd = (CW - GAPX * (len(order) - 1)) / len(order)
x, y = M, 340.0
for i, k in enumerate(order):
    hexs, name, role = P[k]
    cx = M + i * (cwd + GAPX)
    edge = ' stroke="' + RULE + '" stroke-width="1"' if k in ("ivory", "sand", "border") else ""
    b += ('<rect x="%.1f" y="%.1f" width="%.1f" height="118" fill="%s"%s/>'
          % (cx, y, cwd, hexs, edge))
    b += T.draw(KARLA_M, name, 10, cx, y + 146, INK)[0]
    r, gg, bb = (int(hexs[j:j + 2], 16) for j in (1, 3, 5))
    c, m2, yy2, kk = _cmyk(hexs)
    short = PANT[k].replace("Neutral Black", "Neutral Blk").replace(" (metallic)", "")
    for j, ln in enumerate([hexs, f"{r} {gg} {bb}",
                            f"{c} {m2} {yy2} {kk}", short]):
        b += T.draw(KARLA, ln, 8.2, cx, y + 166 + j * 13, MUTED)[0]
if True:
    b += T.draw(KARLA_M, "EACH SWATCH READS   HEX / RGB / CMYK / PANTONE", 9,
                M, y + 232, SOFT, tracking=1.5)[0]
g, _ = T.paragraph(KARLA, "CMYK values are unmanaged conversions and a starting point only: "
    "always proof on the actual stock. Pantone references are approximations and must be "
    "confirmed against a current physical guide before any spot-colour run. Moss is a "
    "supporting colour, approved for the logo only in secondary applications. Ochre Gold is "
    "a fill colour, never text on ivory.", 12.5, M, 640, 900, 1.6, MUTED)
b += g
page(b, number=10)

# ---------------------------------------------------------------- 11 typography
b = eyebrow("07  Typography", M + 10)
b += head("A carved wordmark, a warm serif, a quiet sans", M + 78, 36)
y = 270
b += T.draw(KARLA_M, "THE WORDMARK   MARCELLUS, REFINED", 10.5, M, y, SOFT, tracking=1.8)[0]
b += T.draw(WORDMARK, "TRIKONAM", 46, M, y + 62, INK, tracking=46 * 0.155)[0]
g, y2 = T.paragraph(KARLA, "A Roman inscriptional capital: near-uniform stroke weight, so it "
    "shares the symbol's monoline rhythm rather than fighting it. Two refinements make it "
    "the brand's own. The letterspacing is optically measured pair by pair, not uniformly "
    "tracked. And the apexes of the A and M are drawn to a point, echoing the tips of the "
    "lotus petals. Always used as outlines, never set as live type.",
    13, M, y + 96, 460, 1.58, TEXT)
b += g
b += f'<line x1="600" y1="250" x2="600" y2="{PH-M}" stroke="{RULE}" stroke-width="1"/>'
x2 = 650
b += T.draw(KARLA_M, "PRIMARY   FRAUNCES", 10.5, x2, 270, SOFT, tracking=1.8)[0]
b += T.draw(FRAUNCES, "Steadiness and ease", 34, x2, 322, INK)[0]
g, _ = T.paragraph(KARLA, "Headings, titles, pull quotes. Regular and Light only, never "
    "bold. Already the voice of the website.", 13, x2, 356, 450, 1.55, TEXT)
b += g
b += T.draw(KARLA_M, "SECONDARY   KARLA", 10.5, x2, 452, SOFT, tracking=1.8)[0]
b += T.draw(KARLA, "Body text and interface", 28, x2, 500, INK)[0]
g, _ = T.paragraph(KARLA, "All running text, captions, navigation and small print. No "
    "accent typeface is required or permitted.", 13, x2, 534, 450, 1.55, TEXT)
b += g
rows2 = [("Display / H1", "Fraunces Reg.", "-0.01em tracking"),
         ("Headings", "Fraunces Reg.", "Sentence case"),
         ("Body", "Karla Reg.", "16-18px, 1.7 lead"),
         ("Labels", "Karla Med.", "Caps, 0.16em, moss"),
         ("Quotations", "Fraunces Light It.", "Indent, no quotes")]
yy = 610
for a, c, d2 in rows2:
    b += T.draw(KARLA, a, 10.5, x2, yy, INK)[0]
    b += T.draw(KARLA, c, 10.5, x2 + 132, yy, MUTED)[0]
    b += T.draw(KARLA, d2, 10.5, x2 + 288, yy, MUTED)[0]
    yy += 24
page(b, number=11)

# ---------------------------------------------------------------- 12 grounds
b = eyebrow("08  Backgrounds and photography", M + 10)
b += head("Where the mark may stand", M + 78, 36)
grounds = [(IVORY, INK, "Ivory"), (SAND, INK, "Sand"),
           (INK, IVORY, "Forest Ink"), (TEXT, IVORY, "Espresso")]
bw = (CW - 3 * 14) / 4
for i, (bg, ik, lab) in enumerate(grounds):
    cx = M + i * (bw + 14)
    b += f'<rect x="{cx}" y="260" width="{bw}" height="230" fill="{bg}" stroke="{RULE}" stroke-width="1"/>'
    s, _, _ = L.render("primary", ink=ik, pad=0.06)
    b += fit(s, cx + 26, 282, bw - 52, 186)
    b += T.draw(KARLA_M, lab.upper(), 10, cx, 512, INK, tracking=1.6)[0]
g, y = T.paragraph(KARLA, "These four are the whole of it. Ivory and Sand take the mark in "
    "Forest Ink; Forest Ink and Espresso take it in Ivory.", 14, M, 570, 900, 1.55, TEXT)
b += g
g, _ = T.paragraph(KARLA, "Over photography, use the white colourway, and only where the "
    "image is quiet: an even, unbusy area with no detail running through the mark. If the "
    "mark is not clearly legible at a glance, move it, or place it on a plain panel beside "
    "the image. Never place it over faces, hands, or the focal point of a posture. Do not "
    "add coloured overlays to force the logo to work.", 13, M, y + 40, 900, 1.58, MUTED)
b += g
page(b, number=12)

# ---------------------------------------------------------------- 13 access + production
b = eyebrow("09  Accessibility    10  Production", M + 10)
b += head("Legibility, paper, and screens", M + 78, 36)
g, y = T.paragraph(KARLA, "Every approved pairing clears WCAG AA comfortably. Forest Ink on "
    "Ivory measures 11.15:1, and Ivory on Forest Ink the same. Espresso on Ivory is 14.05:1. "
    "Moss on Ivory is 5.36:1, sufficient for the logo and large text but not for small body "
    "copy. Ochre Gold is a fill colour, approved with ivory text on it, never as text on "
    "ivory.", 13.5, M, 260, 460, 1.6, TEXT)
b += g
g, _ = T.paragraph(KARLA, "Wherever the logo carries meaning, give it a text alternative. "
    "The mark's meaning survives in one colour, so the identity is fully legible to viewers "
    "with any form of colour vision deficiency.", 13, M, y + 40, 460, 1.58, MUTED)
b += g
b += f'<line x1="600" y1="240" x2="600" y2="{PH-M}" stroke="{RULE}" stroke-width="1"/>'
x2 = 650
prod = [("Always supply vector", "PDF, SVG or EPS from the master library. Never a PNG, "
         "never artwork lifted from the website."),
        ("Foil and gilding", "Supply the single-colour master as 100% K. The gold is the "
         "foil, not the artwork."),
        ("Emboss, deboss, engraving", "The Display stroke is too fine for a die. Use the "
         "Compact cut, the reduced mark, or the symbol at no less than 16 mm. Minimum "
         "engraved stroke 0.15 mm at final size."),
        ("Single-colour print", "100% K or one spot. Do not screen the ink back to make a "
         "lighter logo; use the watermark artwork, which is drawn for it."),
        ("Digital", "Use SVG wherever the platform allows. The master carries its ink as "
         "currentColor, so a colourway is one declaration.")]
yy = 260
for k, v in prod:
    b += T.draw(KARLA_M, k.upper(), 10.5, x2, yy, SOFT, tracking=1.6)[0]
    g, yy = T.paragraph(KARLA, v, 12.5, x2, yy + 22, 460, 1.55, TEXT)
    b += g
    yy += 34
page(b, number=13)

# ---------------------------------------------------------------- 14 index
b = eyebrow("11  Asset library", M + 10)
b += head("What is supplied", M + 78, 36)
idx = [("01_Master Logos", "Ten lockups, Display and Compact cuts", "SVG PDF EPS PNG"),
       ("02_Variations", "Eleven colourways of the core lockups", "SVG PDF PNG"),
       ("03_Icons", "favicon.ico, 16 to 512, app and avatar icons", "ICO SVG PNG"),
       ("04_Print", "Single-colour, reverse, foil, emboss, deboss, engraving", "SVG PDF EPS"),
       ("05_Colours", "Palette in ASE, CSS, SCSS, Tailwind, JSON", "ASE CSS SCSS JS JSON"),
       ("06_Typography", "Wordmark font, web fonts, specimen, guidance", "TTF WOFF2 PDF"),
       ("07_Web", "Header, footer, nav, dark and light, OG and Twitter", "SVG PNG"),
       ("08_Social", "Instagram, Facebook, LinkedIn, YouTube, WhatsApp, Google", "PNG SVG"),
       ("09_Office", "Signature, letterhead, invoice, certificate, deck", "SVG PDF PNG"),
       ("10_Brand Manual", "This document", "HTML PDF"),
       ("11_Source", "Construction pipeline, fonts, reference artwork", "PY TTF PNG")]
y = 280
for a, c, d2 in idx:
    b += T.draw(KARLA_M, a, 12.5, M, y, INK)[0]
    b += T.draw(KARLA, c, 12.5, M + 250, y, MUTED)[0]
    b += T.draw(KARLA, d2, 11, PW - M, y, SOFT, anchor="end", tracking=1.1)[0]
    b += f'<line x1="{M}" y1="{y+13}" x2="{PW-M}" y2="{y+13}" stroke="{RULE}" stroke-width="1"/>'
    y += 38
g, _ = T.paragraph(KARLA, "The master artwork is the single source of truth; this document "
    "describes it. Where the two disagree, the artwork is right.", 12.5, M, y + 34, 700,
    1.55, MUTED)
b += g
page(b, number=14)


# ---------------------------------------------------------------- emit
def build(out, crop=False, bleed=0.0):
    w = PdfWriter()
    for i, body in enumerate(pages):
        extra = ""
        vb = f"0 0 {PW} {PH}"
        wmm, hmm = 297.0, 210.0
        if crop:
            bl = bleed
            vb = f"{-bl} {-bl} {PW+2*bl} {PH+2*bl}"
            wmm, hmm = 297.0 + 2 * bl / PW * 297.0, 210.0 + 2 * bl / PH * 210.0
            t = 22.0
            marks = []
            for (mx, my, dx, dy) in ((0, 0, -1, 0), (0, 0, 0, -1),
                                     (PW, 0, 1, 0), (PW, 0, 0, -1),
                                     (0, PH, -1, 0), (0, PH, 0, 1),
                                     (PW, PH, 1, 0), (PW, PH, 0, 1)):
                x1 = mx + dx * (bl * 0.35); y1 = my + dy * (bl * 0.35)
                x2 = mx + dx * (bl * 0.35 + t); y2 = my + dy * (bl * 0.35 + t)
                marks.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" '
                             f'stroke="#000" stroke-width="0.6"/>')
            extra = "".join(marks)
        svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{wmm}mm" height="{hmm}mm" '
               f'viewBox="{vb}">{body}{extra}</svg>')
        buf = io.BytesIO()
        cairosvg.svg2pdf(bytestring=svg.encode(), write_to=buf)
        buf.seek(0)
        w.append(PdfReader(buf))
    w.add_metadata({"/Title": "Trikonam Brand Identity Manual v1.1",
                    "/Author": "Trikonam", "/Subject": "Master logo system"})
    with open(out, "wb") as f:
        w.write(f)
    return out


if __name__ == "__main__":
    a = build(sys.argv[1] if len(sys.argv) > 1 else "trikonam-brand-manual.pdf")
    print("wrote", a, os.path.getsize(a) // 1024, "KB,", len(pages), "pages")
