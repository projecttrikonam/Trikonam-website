"""finish_kit.py — source folders, font guide, README, and the verification pass."""
import os, sys, io, shutil, glob, json, subprocess
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import cairosvg
from PIL import Image
from pypdf import PdfReader
import build_pdf_manual as M
import build_docs as BD
import brand as B, lockups as L, tokens as TK
import textlayout as T
from textlayout import FRAUNCES, FRAUNCES_L, KARLA, KARLA_M, WORDMARK
from brand import PALETTE as P

ROOT = sys.argv[1] if len(sys.argv) > 1 else "Brand Identity Kit"
PW, PH, MG = M.PW, M.PH, M.M
INK = P["forest"][0]; IVORY = P["ivory"][0]; MOSS = P["moss"][0]
MUTED = "#5F564B"; RULE = P["border"][0]


# ------------------------------------------------------------------ font guide
def font_guide_page():
    b = M.eyebrow("Typography", MG + 10)
    b += M.head("Fonts, hierarchy and spacing", MG + 78, 36)
    y = 250
    b += T.draw(KARLA_M, "THE WORDMARK", 10.5, MG, y, MOSS, tracking=2.0)[0]
    b += T.draw(WORDMARK, "TRIKONAM", 40, MG, y + 60, INK, tracking=40 * 0.155)[0]
    g, y2 = T.paragraph(KARLA, "Marcellus, refined. Supplied as outlines and as "
        "Trikonam-Wordmark.ttf. Base tracking 0.155 em, then optical corrections per pair: "
        "TR -0.034, RI +0.001, IK +0.045, KO -0.035, ON +0.045, NA -0.007, AM -0.030, in cap "
        "heights. The apexes of the A and M are drawn to a point. Never re-set the wordmark "
        "from the font without applying these values; use the supplied artwork.",
        12, MG, y + 96, 460, 1.58, MUTED)
    b += g
    b += f'<line x1="600" y1="240" x2="600" y2="{PH-MG}" stroke="{RULE}" stroke-width="1"/>'
    x = 650
    rows = [("PRIMARY  FRAUNCES", "Regular 400 and Light 300 only. Never bold, never all-caps. "
             "Headings, titles and pull quotes."),
            ("SECONDARY  KARLA", "Regular 400 and Medium 500. All running text, captions, "
             "navigation, small print."),
            ("ACCENT", "None. No third typeface is required or permitted."),
            ("LICENSING", "Fraunces, Karla and Marcellus are all SIL Open Font Licence 1.1: "
             "free to use, embed, modify and redistribute, for web and desktop, "
             "commercially. No purchase is required."),
            ("WEB", "Use the supplied subset woff2 files with font-display: swap, "
             "self-hosted. Do not link a font CDN."),
            ("DESKTOP", "Install the full TTFs from 09_Source Files / Editable Sources / "
             "Fonts for Office, Keynote and Adobe applications.")]
    yy = 250
    for k, v in rows:
        b += T.draw(KARLA_M, k, 10.5, x, yy, MOSS, tracking=1.8)[0]
        g, yy = T.paragraph(KARLA, v, 12, x, yy + 22, 460, 1.55, MUTED)
        b += g
        yy += 30
    scale = [("Display / H1", "Fraunces Reg.", "clamp 2.25-4rem", "1.05", "-0.01em"),
             ("H2", "Fraunces Reg.", "clamp 1.4-1.8rem", "1.2", "0"),
             ("H3", "Fraunces Reg.", "clamp 1.19-1.375rem", "1.3", "0"),
             ("Body", "Karla Reg.", "1rem", "1.7", "0"),
             ("Caption", "Karla Reg.", "0.85rem", "1.6", "0"),
             ("Label", "Karla Med.", "0.78rem", "1.4", "0.16em")]
    yy = max(yy, 560)
    b += T.draw(KARLA_M, "HIERARCHY", 10.5, MG, 600, MOSS, tracking=2.0)[0]
    hx = [MG, MG + 130, MG + 250, MG + 390, MG + 450]
    for j, h in enumerate(["ROLE", "FACE", "SIZE", "LEADING", "TRACKING"]):
        b += T.draw(KARLA, h, 9.5, hx[j], 624, MOSS)[0]
    yy = 648
    for r in scale:
        for j, v in enumerate(r):
            b += T.draw(KARLA, v, 10.5, hx[j], yy, INK if j == 0 else MUTED)[0]
        yy += 20
    return f'<rect width="{PW}" height="{PH}" fill="{IVORY}"/>{b}'


BD.write_pdf(os.path.join(ROOT, "05_Typography", "Font Guide", "Font Guide.pdf"),
             [BD.title_page("Font Guide", "The wordmark, the two system faces, and how to "
                            "set them.", "Typography"), font_guide_page()])

# ------------------------------------------------------------------ 09 sources
SRC = os.path.join(ROOT, "09_Source Files")
for sub in ("SVG", "PDF", "EPS", "PNG", "Editable Sources"):
    os.makedirs(os.path.join(SRC, sub), exist_ok=True)

# consolidate the master lockups by format
for folder, lock, stem in [("Primary", "primary", "trikonam-primary"),
                           ("Horizontal", "horizontal", "trikonam-horizontal"),
                           ("Stacked", "primary", "trikonam-stacked"),
                           ("Symbol", "symbol", "trikonam-symbol"),
                           ("Wordmark", "wordmark", "trikonam-wordmark"),
                           ("Roundel", "circular", "trikonam-roundel"),
                           ("Seal", "stamp", "trikonam-seal"),
                           ("Reduced Mark", "seal", "trikonam-reduced-mark"),
                           ("Watermark", "watermark", "trikonam-watermark")]:
    base = os.path.join(ROOT, "01_Master Logos", folder, stem + "-forest-ink")
    for ext, dest in (("svg", "SVG"), ("pdf", "PDF"), ("eps", "EPS")):
        s = base + "." + ext
        if os.path.exists(s):
            shutil.copy(s, os.path.join(SRC, dest, os.path.basename(s)))
    for px in (1200, 2400, 4000):
        s = f"{base}-{px}px.png"
        if os.path.exists(s):
            shutil.copy(s, os.path.join(SRC, "PNG", os.path.basename(s)))

ED = os.path.join(SRC, "Editable Sources")
for sub in ("Pipeline", "Fonts", "Reference"):
    os.makedirs(os.path.join(ED, sub), exist_ok=True)
for f in ("geometry.py", "fitting.py", "trace.py", "build_symbol.py", "typeset.py",
          "optical.py", "refine_font.py", "brand.py", "lockups.py", "diagrams.py",
          "tokens.py", "applied.py", "textlayout.py", "build_kit.py", "build_docs.py",
          "build_manual.py", "build_pdf_manual.py", "finish_kit.py", "audit.py",
          "traced.json", "symbol_group.txt", "symbol_parts.json", "symbol.svg"):
    if os.path.exists(f):
        shutil.copy(f, os.path.join(ED, "Pipeline", f))
for src, dst in (("fonts/Trikonam-Wordmark.ttf", "Trikonam-Wordmark.ttf"),
                 ("fonts/Marcellus.ttf", "Marcellus-Regular-UPSTREAM.ttf"),
                 ("fonts/Fraunces-VF.ttf", "Fraunces-Variable.ttf"),
                 ("fonts/Karla-VF.ttf", "Karla-Variable.ttf")):
    if os.path.exists(src):
        shutil.copy(src, os.path.join(ED, "Fonts", dst))
for src, dst in (("/Users/apple/Desktop/Trikonam webiste/Logo New.PNG",
                  "Logo-New-founding-artwork.png"),
                 ("compare_v3.png", "reconstruction-vs-reference.png"),
                 ("overlay.png", "construction-overlay.png"),
                 ("head_overlay.png", "head-overlay-verification.png"),
                 ("colour_study.png", "study-ink-colour.png"),
                 ("ink_context.png", "study-ink-in-context.png"),
                 ("finalists.png", "study-typeface-finalists.png"),
                 ("optical_cmp.png", "study-optical-spacing.png"),
                 ("apex.png", "study-apex-refinement.png"),
                 ("sizes.png", "study-scale-test.png"),
                 ("compact_test.png", "study-compact-weight.png"),
                 ("centring.png", "study-optical-centring.png")):
    if os.path.exists(src):
        shutil.copy(src, os.path.join(ED, "Reference", dst))

# the HTML manual
shutil.copy("trikonam-brand-manual.html",
            os.path.join(ROOT, "10_Brand Manual", "Brand Identity Manual.html"))
print("sources + font guide done")
