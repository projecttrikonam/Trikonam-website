"""
build_docs.py — the documentation set, and the consolidated source folders.

The guides are not extracts of a marketing PDF: each is composed from the same
page engine as the manual, with its own title page, so any one of them can be
handed to a supplier on its own.
"""
import os, sys, io, shutil, glob, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import cairosvg
from pypdf import PdfWriter, PdfReader
import build_pdf_manual as M          # importing builds every manual page
import brand as B, lockups as L, diagrams as D, tokens as TK
import textlayout as T
from textlayout import FRAUNCES, FRAUNCES_L, KARLA, KARLA_M, WORDMARK
from brand import PALETTE as P

ROOT = sys.argv[1] if len(sys.argv) > 1 else "Brand Identity Kit"
PW, PH, MG = M.PW, M.PH, M.M
INK = P["forest"][0]; IVORY = P["ivory"][0]; MOSS = P["moss"][0]
MUTED = "#5F564B"; RULE = P["border"][0]; SAND = P["sand"][0]
TEXTC = P["espresso"][0]
made = []


def title_page(title, subtitle, tag):
    lock, _, _ = L.render("primary", ink=INK, pad=0.03)
    b = M.fit(lock, MG, 250, 250, 340)
    b += T.draw(FRAUNCES, title, 52, 470, 380, INK)[0]
    g, _ = T.paragraph(FRAUNCES_L, subtitle, 20, 470, 434, 560, 1.45, MUTED)
    b += g
    b += f'<line x1="470" y1="560" x2="{PW-MG}" y2="560" stroke="{RULE}" stroke-width="1"/>'
    b += T.draw(KARLA, "TRIKONAM BRAND IDENTITY V1.1", 11, 470, 592, MOSS, tracking=2.2)[0]
    b += T.draw(KARLA, tag.upper(), 11, 470, 616, MOSS, tracking=2.2)[0]
    return f'<rect width="{PW}" height="{PH}" fill="{IVORY}"/>{b}'


def spec_page():
    """A dense, technical single sheet: every number in the identity."""
    b = M.eyebrow("Brand specifications", MG + 10)
    b += M.head("Every number in the identity", MG + 78, 36)
    import geometry as G
    col1 = [
        ("CONSTRUCTION", [
            ("Master field", "880 x 1120 units = 11u x 14u, u = 80"),
            ("Field ratio", "11 : 14 = 0.785714"),
            ("Ascending axis", "x = 220 = 11u / 4 (the quarter line)"),
            ("Earth line", "y = 1108"),
            ("Triangle apex", "(498, 771.87)"),
            ("Triangle base", "880 units"),
            ("Triangle height", "336.13 = base x 0.381966 (phi to the -2)"),
            ("Skull", "true circle, centre (88, 602), r 70"),
            ("Hair knot", "true circle, centre (42, 660), r 30"),
            ("Lotus petals", "5, at 0, +/-35, +/-62 degrees from the axis"),
            ("Petal form", "vesica of two circular arcs, exact mirror"),
            ("Lotus height", "152 units = 0.1357 of symbol height"),
        ]),
        ("STROKE", [
            ("Display cut", "10 units = 0.89% of symbol height"),
            ("Compact cut", "16 units = 1.43% of symbol height"),
            ("Display used", "symbol height 140 px and above"),
            ("Compact used", "symbol height 60 to 140 px"),
            ("Caps and joins", "round"),
        ]),
    ]
    col2 = [
        ("LOCKUPS", [
            ("Primary", "wordmark set to exactly the symbol's width"),
            ("Primary gap", "0.075 x symbol height, earth line to cap line"),
            ("Primary cap", "0.08698 x symbol height"),
            ("Horizontal cap", "0.205 x symbol height"),
            ("Horizontal gap", "0.02116 x symbol height (23.7 units)  v1.1"),
            ("Horizontal drop", "0.03982 x symbol height (44.6 units)  v1.1"),
            ("Horizontal align", "wordmark on the symbol's OPTICAL centre"),
            ("Horizontal size", "2977.6 x 1120 units"),
        ]),
        ("WHAT CHANGED IN v1.1", [
            ("Scope", "the horizontal lockup only; symbol, wordmark,"),
            ("", "colour, type and every other lockup are unchanged"),
            ("Gap", "84 -> 23.7 units. The symbol is a wedge: beside the"),
            ("", "wordmark its ink stops at x=561 while the ground line"),
            ("", "reaches x=879, so a box-measured gap read as a 402-unit"),
            ("", "void. This closes that perceived void by 15%."),
            ("Drop", "0 -> 44.6 units. The ink centroid sits 105 units"),
            ("", "below the box centre, so box-centred type rode high."),
        ]),
        ("CLEAR SPACE AND SIZE", [
            ("X", "the lotus height = 0.136 x symbol height"),
            ("Wordmark alone", "X = its cap height"),
            ("Primary minimum", "32 mm / 120 px wide"),
            ("Horizontal minimum", "52 mm / 200 px wide"),
            ("Symbol minimum", "16 mm / 60 px wide"),
            ("Wordmark minimum", "24 mm / 90 px wide"),
            ("Reduced mark minimum", "6 mm / 16 px"),
        ]),
        ("WORDMARK", [
            ("Face", "Marcellus, refined"),
            ("Base tracking", "0.155 em"),
            ("Optical pairs", "TR -0.034  RI +0.001  IK +0.045  KO -0.035"),
            ("", "ON +0.045  NA -0.007  AM -0.030  (cap heights)"),
            ("Custom", "A and M apexes drawn to a point"),
            ("Width", "9.033 cap heights"),
            ("Supplied", "outlines only, never live type"),
        ]),
    ]
    for ci, colset in enumerate((col1, col2)):
        x = MG + ci * 540
        y = 240
        for title, rows in colset:
            b += T.draw(KARLA_M, title, 10.5, x, y, MOSS, tracking=2.0)[0]
            y += 24
            for k, v in rows:
                if k:
                    b += T.draw(KARLA, k, 11, x, y, INK)[0]
                b += T.draw(KARLA, v, 11, x + 168, y, MUTED)[0]
                y += 19
            y += 20
    return f'<rect width="{PW}" height="{PH}" fill="{IVORY}"/>{b}'


def colour_detail_page():
    b = M.eyebrow("Colour, in full", MG + 10)
    b += M.head("Every value, for every medium", MG + 78, 36)
    heads = ["NAME", "ROLE", "HEX", "RGB", "CMYK", "PANTONE"]
    xs = [MG, MG + 150, MG + 430, MG + 530, MG + 670, MG + 830]
    for h, x in zip(heads, xs):
        b += T.draw(KARLA_M, h, 10, x, 250, MOSS, tracking=1.8)[0]
    b += f'<line x1="{MG}" y1="264" x2="{PW-MG}" y2="264" stroke="{RULE}" stroke-width="1"/>'
    y = 296
    for k in TK.ORDER:
        hexs, name, role = P[k]
        r = " ".join(str(v) for v in TK.rgb(hexs))
        c = " ".join(str(v) for v in TK.cmyk(hexs))
        edge = f' stroke="{RULE}" stroke-width="1"' if k in ("ivory", "sand", "border", "white") else ""
        b += ('<rect x="%.0f" y="%.0f" width="26" height="26" fill="%s"%s/>'
              % (MG, y - 19, hexs, edge))
        b += T.draw(KARLA, name, 11.5, MG + 36, y, INK)[0]
        b += T.draw(KARLA, role, 11, xs[1], y, MUTED)[0]
        b += T.draw(KARLA, hexs, 11, xs[2], y, MUTED)[0]
        b += T.draw(KARLA, r, 11, xs[3], y, MUTED)[0]
        b += T.draw(KARLA, c, 11, xs[4], y, MUTED)[0]
        b += T.draw(KARLA, TK.PANTONE[k], 11, xs[5], y, MUTED)[0]
        y += 34
    g, _ = T.paragraph(KARLA, "CMYK values are unmanaged conversions from RGB and are a "
        "starting point only; always proof on the actual stock. Pantone references are "
        "visual approximations and must be confirmed against a current physical guide "
        "before any spot-colour or foil run. Trikonam holds no Pantone licence, and no "
        "certified proof is supplied with this kit.", 12, MG, y + 30, 900, 1.6, MUTED)
    b += g
    return f'<rect width="{PW}" height="{PH}" fill="{IVORY}"/>{b}'


def write_pdf(path, bodies, crop=False):
    w = PdfWriter()
    for body in bodies:
        svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="297mm" height="210mm" '
               f'viewBox="0 0 {PW} {PH}">{body}</svg>')
        buf = io.BytesIO()
        cairosvg.svg2pdf(bytestring=svg.encode(), write_to=buf)
        buf.seek(0)
        w.append(PdfReader(buf))
    w.add_metadata({"/Title": os.path.basename(path).replace(".pdf", ""),
                    "/Author": "Trikonam",
                    "/Subject": "Trikonam Brand Identity v1.1"})
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "wb") as f:
        w.write(f)
    made.append((os.path.relpath(path, ROOT), len(bodies)))
    return path


PG = M.pages          # 0-indexed: 0 cover,1 contents,2 mark,3 constr,4 lotus,5 system,
#                       6 clear,7 minsize,8 misuse,9 colour,10 type,11 grounds,12 prod,13 index

# ---- the manual, screen and print-ready
man = os.path.join(ROOT, "10_Brand Manual")
os.makedirs(man, exist_ok=True)
M.build(os.path.join(man, "Brand Identity Manual.pdf"))
made.append(("10_Brand Manual/Brand Identity Manual.pdf", len(PG)))
M.build(os.path.join(man, "Brand Identity Manual - Print Ready.pdf"), crop=True, bleed=26.0)
made.append(("10_Brand Manual/Brand Identity Manual - Print Ready.pdf", len(PG)))

# ---- brand specifications
write_pdf(os.path.join(man, "Brand Specifications.pdf"),
          [title_page("Brand Specifications", "Every measured value in the identity, on "
                      "one sheet.", "Technical specification"),
           spec_page(), colour_detail_page()])

# ---- guides
GUIDES = [
    ("Logo Usage Guide", "How to choose a lockup, and how to place it.",
     [PG[5], PG[6], PG[7], PG[11]], "09_Guides"),
    ("Clear Space Guide", "One rule, applied to every lockup.", [PG[6]], "09_Guides"),
    ("Minimum Size Guide", "How small the mark may go, and in which cut.",
     [PG[7], PG[4]], "09_Guides"),
    ("Dos and Donts Guide", "Eight things that undo the work.", [PG[8], PG[11]],
     "09_Guides"),
]
gd = os.path.join(ROOT, "10_Brand Manual", "Guides")
for name, sub, pages, _ in GUIDES:
    write_pdf(os.path.join(gd, f"{name}.pdf"),
              [title_page(name, sub, name)] + pages)

# ---- colour guide, into the colour folder
write_pdf(os.path.join(ROOT, "04_Colour Palette", "Colour Guide.pdf"),
          [title_page("Colour Guide", "Forest Ink, and the palette it belongs to.",
                      "Colour"), PG[9], colour_detail_page()])

print("documents:")
for p, n in made:
    print(f"   {n:>3} pp   {p}")
