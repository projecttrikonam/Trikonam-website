"""
build_kit.py — assemble the complete Trikonam Brand Identity Kit v1.0.

Everything is generated from the master construction. No file in the output is a
placeholder: if something cannot be produced natively it is not written, and the
reason is recorded in the kit README.
"""
import os, sys, io, shutil, json, glob
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import cairosvg
from PIL import Image
import brand as B, lockups as L, diagrams as D, tokens as TK, applied as A
import textlayout as T
from brand import PALETTE as P

ROOT = sys.argv[1] if len(sys.argv) > 1 else "Brand Identity Kit"
VER = "Trikonam Brand Identity v1.0"
INK = P["forest"][0]; IVORY = P["ivory"][0]; SAND = P["sand"][0]
TEXT = P["espresso"][0]; WHITE = P["white"][0]; BLACK = P["black"][0]
GOLD = P["gold"][0]; GOLDLEAF = P["goldleaf"][0]; MOSS = P["moss"][0]

PNG_SIZES = (1200, 2400, 4000)
made = {"svg": 0, "pdf": 0, "eps": 0, "png": 0, "ico": 0, "other": 0}
manifest = []


def d(*parts):
    p = os.path.join(ROOT, *parts)
    os.makedirs(p, exist_ok=True)
    return p


def emit(svg, folder, stem, png=PNG_SIZES, pdf=True, eps=True, square=False):
    """Write one artwork in every requested format."""
    path = os.path.join(folder, stem)
    open(path + ".svg", "w").write(svg)
    made["svg"] += 1
    if pdf:
        cairosvg.svg2pdf(bytestring=svg.encode(), write_to=path + ".pdf")
        made["pdf"] += 1
    if eps:
        cairosvg.svg2eps(bytestring=svg.encode(), write_to=path + ".eps")
        made["eps"] += 1
    for px in png:
        kw = {"output_width": px}
        if square:
            kw["output_height"] = px
        cairosvg.svg2png(bytestring=svg.encode(), write_to=f"{path}-{px}px.png", **kw)
        made["png"] += 1
    manifest.append(os.path.relpath(path, ROOT))
    return path


def png_only(svg, folder, stem, sizes, square=False, height=None):
    path = os.path.join(folder, stem)
    open(path + ".svg", "w").write(svg)
    made["svg"] += 1
    for px in sizes:
        kw = {"output_width": px}
        if square:
            kw["output_height"] = px
        elif height:
            kw["output_height"] = int(px * height)
        cairosvg.svg2png(bytestring=svg.encode(), write_to=f"{path}-{px}px.png", **kw)
        made["png"] += 1
    manifest.append(os.path.relpath(path, ROOT))
    return path


# ==================================================================== 01 masters
MASTERS = [
    ("Primary",      "primary",        "trikonam-primary"),
    ("Horizontal",   "horizontal",     "trikonam-horizontal"),
    ("Stacked",      "primary",        "trikonam-stacked"),
    ("Symbol",       "symbol",         "trikonam-symbol"),
    ("Wordmark",     "wordmark",       "trikonam-wordmark"),
    ("Roundel",      "circular",       "trikonam-roundel"),
    ("Seal",         "stamp",          "trikonam-seal"),
    ("Reduced Mark", "seal",           "trikonam-reduced-mark"),
    ("Watermark",    "watermark",      "trikonam-watermark"),
]
for folder, lock, stem in MASTERS:
    f = d("01_Master Logos", folder)
    pad = 0.0 if lock == "seal" else (0.12 if lock == "wordmark" else 0.06)
    sq = lock in ("seal", "stamp", "circular", "square")
    svg, _, _ = L.render(lock, ink=INK, pad=pad)
    emit(svg, f, stem + "-forest-ink", square=sq)
    # the Compact optical cut, where the lockup carries the drawn symbol
    if lock in ("primary", "horizontal", "symbol", "circular", "watermark"):
        svg_c, _, _ = L.render(lock, ink=INK, pad=pad, weight=B.STROKE_COMPACT)
        emit(svg_c, f, stem + "-forest-ink-compact", png=(1200, 2400), square=sq)

# ==================================================================== 02 icons
f = d("02_Icons", "Favicons")
seal_svg, _, _ = L.render("seal", ink=INK, pad=0.0)
open(os.path.join(f, "favicon.svg"), "w").write(seal_svg)
made["svg"] += 1
for px in (16, 32, 48, 64, 128, 256, 512):
    p = cairosvg.svg2png(bytestring=seal_svg.encode(), output_width=px, output_height=px)
    open(os.path.join(f, f"favicon-{px}.png"), "wb").write(p)
    made["png"] += 1
# a real multi-resolution .ico: PIL writes every size from one high-res master
_ico = Image.open(io.BytesIO(cairosvg.svg2png(
    bytestring=seal_svg.encode(), output_width=256, output_height=256))).convert("RGBA")
_ico.save(os.path.join(f, "favicon.ico"), format="ICO",
          sizes=[(s2, s2) for s2 in (16, 24, 32, 48, 64, 128, 256)])
made["ico"] += 1

f = d("02_Icons", "App Icons")
for tag, ink, ground in (("light", INK, IVORY), ("dark", IVORY, INK), ("sand", INK, SAND)):
    svg, _, _ = L.render("app-icon", ink=ink, ground=ground, pad=0.0)
    png_only(svg, f, f"trikonam-app-icon-{tag}", (1024, 512, 256, 192), square=True)

f = d("02_Icons", "Apple Touch")
for px in (180, 167, 152, 120):
    svg, _, _ = L.render("app-icon", ink=INK, ground=IVORY, pad=0.0, radius=0.0)
    cairosvg.svg2png(bytestring=svg.encode(),
                     write_to=os.path.join(f, f"apple-touch-icon-{px}.png"),
                     output_width=px, output_height=px)
    made["png"] += 1
open(os.path.join(f, "apple-touch-icon.svg"), "w").write(
    L.render("app-icon", ink=INK, ground=IVORY, pad=0.0, radius=0.0)[0])
made["svg"] += 1

f = d("02_Icons", "Android")
# adaptive icon: the safe zone is the centre 66%, so the seal is drawn smaller
for tag, ink, ground in (("light", INK, IVORY), ("dark", IVORY, INK)):
    dd = B.seal_path(512, 512 * 0.70, 1.55)
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" '
           f'viewBox="0 0 1024 1024"><rect width="1024" height="1024" fill="{ground}"/>'
           f'<path d="{dd}" fill="{ink}" fill-rule="evenodd"/></svg>')
    png_only(svg, f, f"android-adaptive-foreground-{tag}", (1024, 512, 192), square=True)
for px in (512, 192, 144, 96):
    svg, _, _ = L.render("app-icon", ink=INK, ground=IVORY, pad=0.0, radius=0.0)
    cairosvg.svg2png(bytestring=svg.encode(),
                     write_to=os.path.join(f, f"android-icon-{px}.png"),
                     output_width=px, output_height=px)
    made["png"] += 1

f = d("02_Icons", "Social Avatars")
for tag, ink, ground, circ in (("circular-light", INK, IVORY, True),
                               ("circular-dark", IVORY, INK, True),
                               ("square-light", INK, IVORY, False),
                               ("square-dark", IVORY, INK, False)):
    png_only(A.avatar(1000, ground, ink, circ), f, f"trikonam-avatar-{tag}",
             (1000, 500, 200), square=True)

# ==================================================================== 03 print
PRINT = [
    ("Black",     BLACK,    None,  "100% K. The production master for any one-colour process."),
    ("White",     WHITE,    None,  "For dark grounds and photography. Knockout artwork."),
    ("Reverse",   IVORY,    INK,   "Ivory on Forest Ink, supplied with the ground."),
    ("Foil",      GOLDLEAF, None,  "Supply the BLACK master to the finisher as the foil die; "
                                   "this gold file is an on-screen match reference only."),
    ("Emboss",    BLACK,    None,  "Blind emboss. Single-colour vector, Compact cut, no fill."),
    ("Deboss",    BLACK,    None,  "Blind deboss. Same artwork as emboss; the die is inverted."),
    ("Engraving", BLACK,    None,  "Single-colour vector, Compact cut. Minimum stroke 0.15 mm "
                                   "at final size."),
]
for folder, ink, ground, note in PRINT:
    f = d("03_Print Assets", folder)
    heavy = folder in ("Emboss", "Deboss", "Engraving")
    for lock, stem in (("primary", "primary"), ("horizontal", "horizontal"),
                       ("symbol", "symbol"), ("stamp", "seal"), ("seal", "reduced-mark")):
        pad = 0.0 if lock == "seal" else 0.06
        sq = lock in ("seal", "stamp")
        kw = {"weight": B.STROKE_COMPACT} if (heavy and lock not in ("seal", "stamp")) else {}
        svg, _, _ = L.render(lock, ink=ink, bg=ground, pad=pad, **kw)
        emit(svg, f, f"trikonam-{stem}-{folder.lower()}", png=(1200, 2400), square=sq)
    open(os.path.join(f, "PRODUCTION NOTES.txt"), "w").write(
        f"{VER}\n{folder} artwork\n\n{note}\n\n"
        "Always supply the vector (PDF or EPS). Never send a PNG to a printer.\n")
    made["other"] += 1
# Forest Ink is the standard positive artwork; mirror it into Print for completeness
f = d("03_Print Assets", "Forest Ink")
for lock, stem in (("primary", "primary"), ("horizontal", "horizontal"),
                   ("symbol", "symbol"), ("stamp", "seal"), ("seal", "reduced-mark")):
    pad = 0.0 if lock == "seal" else 0.06
    svg, _, _ = L.render(lock, ink=INK, pad=pad)
    emit(svg, f, f"trikonam-{stem}-forest-ink", png=(1200, 2400),
         square=lock in ("seal", "stamp"))

# ==================================================================== 04 colour
f = d("04_Colour Palette", "ASE")
n = TK.write_ase(os.path.join(f, "Trikonam Brand Palette v1.0.ase"))
made["other"] += 1
TK.write_json(os.path.join(d("04_Colour Palette", "JSON"), "trikonam-palette.json"))
TK.write_css(os.path.join(d("04_Colour Palette", "CSS"), "trikonam-palette.css"))
TK.write_scss(os.path.join(d("04_Colour Palette", "SCSS"), "_trikonam-palette.scss"))
TK.write_tailwind(os.path.join(d("04_Colour Palette", "Tailwind"), "trikonam.colors.js"))
TK.write_txt(os.path.join(ROOT, "04_Colour Palette", "Colour Reference.txt"))
made["other"] += 5

# ==================================================================== 05 type
f = d("05_Typography", "Wordmark")
svg, _, _ = L.render("wordmark", ink=INK, pad=0.12)
emit(svg, f, "trikonam-wordmark-forest-ink")
shutil.copy("fonts/Trikonam-Wordmark.ttf", os.path.join(f, "Trikonam-Wordmark.ttf"))
made["other"] += 1
f = d("05_Typography", "Web Typography")
for src, dst in (("webfonts/fraunces.woff2", "Fraunces-Regular-subset.woff2"),
                 ("webfonts/fraunces-l.woff2", "Fraunces-Light-subset.woff2"),
                 ("webfonts/karla.woff2", "Karla-Regular-subset.woff2"),
                 ("webfonts/karla5.woff2", "Karla-Medium-subset.woff2"),
                 ("webfonts/wordmark.woff2", "Trikonam-Wordmark-subset.woff2")):
    shutil.copy(src, os.path.join(f, dst))
    made["other"] += 1

# ==================================================================== 06 web
f = d("06_Web Assets", "Header")
png_only(A.web_header(bg=IVORY, ink=INK), f, "header-light", (1440, 2880), height=96 / 1440)
png_only(A.web_header(bg=INK, ink=IVORY), f, "header-dark", (1440, 2880), height=96 / 1440)
png_only(A.web_nav_compact(), f, "nav-compact-light", (420, 840), height=72 / 420)
png_only(A.web_nav_compact(bg=INK, ink=IVORY), f, "nav-compact-dark", (420, 840),
         height=72 / 420)
f = d("06_Web Assets", "Footer")
png_only(A.web_footer(), f, "footer-dark", (1440, 2880), height=220 / 1440)
png_only(A.web_footer(bg=IVORY, ink=INK), f, "footer-light", (1440, 2880), height=220 / 1440)
f = d("06_Web Assets", "Loading")
png_only(A.loading(), f, "loading-light", (800, 400), square=True)
png_only(A.loading(bg=INK, ink=IVORY), f, "loading-dark", (800, 400), square=True)
f = d("06_Web Assets", "OpenGraph")
png_only(A.open_graph(), f, "og-image-light", (1200,), height=630 / 1200)
png_only(A.open_graph(bg=INK, ink=IVORY), f, "og-image-dark", (1200,), height=630 / 1200)
f = d("06_Web Assets", "Twitter")
png_only(A.twitter_card(), f, "twitter-card-light", (1200,), height=628 / 1200)
png_only(A.twitter_card(bg=INK, ink=IVORY), f, "twitter-card-dark", (1200,),
         height=628 / 1200)
f = d("06_Web Assets", "Social Preview")
png_only(A.open_graph(1200, 630, SAND, INK), f, "social-preview-sand", (1200,),
         height=630 / 1200)
png_only(A.open_graph(1600, 900, IVORY, INK), f, "social-preview-wide", (1600,),
         height=900 / 1600)

# ==================================================================== 07 social
SOCIAL = {
    "Instagram": [("profile", A.avatar(1000, IVORY, INK, True), (1000, 320), True),
                  ("profile-dark", A.avatar(1000, INK, IVORY, True), (1000, 320), True),
                  ("post", A.open_graph(1080, 1080, IVORY, INK), (1080,), True),
                  ("story", A.banner(1080, 1920, INK, IVORY), (1080,), False)],
    "Facebook":  [("profile", A.avatar(1000, IVORY, INK, True), (1000, 400), True),
                  ("cover", A.banner(1640, 856, INK, IVORY), (1640,), False)],
    "LinkedIn":  [("company-logo", A.avatar(400, IVORY, INK, False), (400, 300), True),
                  ("banner", A.banner(1128, 191, INK, IVORY), (1128,), False)],
    "YouTube":   [("channel-icon", A.avatar(800, IVORY, INK, True), (800,), True),
                  ("channel-art", A.banner(2560, 1440, INK, IVORY), (2560,), False)],
    "WhatsApp":  [("profile", A.avatar(640, IVORY, INK, True), (640,), True),
                  ("profile-dark", A.avatar(640, INK, IVORY, True), (640,), True)],
    "Google Business": [("logo", A.avatar(720, IVORY, INK, False), (720,), True),
                        ("cover", A.banner(1024, 576, INK, IVORY), (1024,), False)],
}
for plat, items in SOCIAL.items():
    f = d("07_Social Media", plat)
    for stem, svg, sizes, sq in items:
        import re as _re
        m = _re.search(r'width="(\d+)" height="(\d+)"', svg)
        ratio = int(m.group(2)) / int(m.group(1))
        png_only(svg, f, f"trikonam-{plat.lower().replace(' ','-')}-{stem}", sizes,
                 square=sq, height=None if sq else ratio)

# ==================================================================== 08 stationery
f = d("08_Stationery", "Letterhead")
emit(A.letterhead(), f, "trikonam-letterhead-a4", png=(1240, 2480), eps=False)
f = d("08_Stationery", "Invoice")
emit(A.invoice(), f, "trikonam-invoice-a4", png=(1240, 2480), eps=False)
f = d("08_Stationery", "Email Signature")
png_only(A.email_signature(), f, "trikonam-email-signature", (560, 1120),
         height=150 / 560)
png_only(A.email_signature(400, 110), f, "trikonam-email-signature-compact",
         (400, 800), height=110 / 400)
f = d("08_Stationery", "Certificate")
emit(A.certificate(), f, "trikonam-certificate-a4-landscape", png=(1754,), eps=False)
f = d("08_Stationery", "Presentation")
png_only(A.presentation_cover(), f, "trikonam-presentation-cover-dark", (1920,),
         height=1080 / 1920)
png_only(A.presentation_cover(bg=IVORY, ink=INK), f, "trikonam-presentation-cover-light",
         (1920,), height=1080 / 1920)
png_only(A.presentation_divider(), f, "trikonam-presentation-divider", (1920,),
         height=1080 / 1920)

print("core assets built:", made)
json.dump(manifest, open("kit_manifest.json", "w"), indent=1)
