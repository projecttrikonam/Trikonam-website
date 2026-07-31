"""audit.py — Creative Director sign-off. Measure everything; assert nothing."""
import sys, os, re, glob, io, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np, cairosvg
from PIL import Image
import brand as B, lockups as L, geometry as G
from brand import PALETTE as P

def ink_mask(svg, w=1400):
    png = cairosvg.svg2png(bytestring=svg.encode(), output_width=w)
    im = Image.open(io.BytesIO(png)).convert("RGBA")
    return np.array(im.split()[-1]) > 40


def centroid(mask):
    ys, xs = np.nonzero(mask)
    return xs.mean(), ys.mean(), xs.min(), xs.max(), ys.min(), ys.max()


print("=" * 78)
print("PHASE 1 — FINAL OPTICAL REVIEW")
print("=" * 78)

# ---- 1. optical centring of the symbol -------------------------------------
sym_svg, vb, _ = L.render("symbol", pad=0.0)
m = ink_mask(sym_svg, 1200)
cx, cy, x0, x1, y0, y1 = centroid(m)
box_cx = (x0 + x1) / 2
w_px = x1 - x0
print("\n[1] OPTICAL CENTRING OF THE SYMBOL")
print(f"    ink bbox      x {x0}..{x1}   (width {w_px} px)")
print(f"    bbox centre   {box_cx:.1f}")
print(f"    ink centroid  {cx:.1f}")
print(f"    offset        {cx-box_cx:+.1f} px  = {(cx-box_cx)/w_px*100:+.2f}% of width")

# weight the centroid by row to see where the mass sits vertically
upper = m[: int(m.shape[0] * 0.55)]
lower = m[int(m.shape[0] * 0.55):]
for tag, mm in (("upper 55%", upper), ("lower 45%", lower)):
    if mm.sum():
        c2, _, a, b, _, _ = centroid(mm)
        print(f"    {tag}: centroid {c2:.1f}  bbox centre {(a+b)/2:.1f}  "
              f"offset {c2-(a+b)/2:+.1f}")

# ---- 2. horizontal lockup spacing ------------------------------------------
print("\n[2] HORIZONTAL LOCKUP SPACING")
sh = G.H
sw = sh * L.SYM_ASPECT
cap = L.HORIZ_CAP * sh
gap = L.HORIZ_GAP * sh
print(f"    symbol width {sw:.0f}   gap {gap:.0f}   gap/cap {gap/cap:.3f}")
print(f"    gap as a multiple of the wordmark cap height: {gap/cap:.2f}x")
# how much white actually sits between the symbol's right edge and the T
hsvg, hvb, hcap = L.render("horizontal", pad=0.0)
hm = ink_mask(hsvg, 2200)
cols = hm.any(axis=0)
runs = []
inrun = False
for i, v in enumerate(cols):
    if not v and not inrun:
        s = i; inrun = True
    elif v and inrun:
        runs.append((s, i - 1)); inrun = False
gaps = [(a, b, b - a + 1) for a, b in runs if b - a + 1 > 4]
print(f"    measured white columns between elements: "
      f"{[(g[2]) for g in gaps][:6]} px (render width 2200)")

# ---- 3. wordmark tracking / kerning ----------------------------------------
print("\n[3] WORDMARK TRACKING AND KERNING")
d, ww, bb, _ = B.wordmark(200.0)
print(f"    base tracking {B.BASE_TRACKING:.3f} em")
print(f"    width {ww/200.0:.3f} cap heights")
for k, v in B.OPTICAL.items():
    print(f"      {k}  {v:+.4f} cap")
mx = max(abs(v) for v in B.OPTICAL.values())
print(f"    largest optical correction {mx:.4f} cap  "
      f"({'within' if mx < 0.06 else 'ABOVE'} the 0.06 clamp)")

# ---- 4. stroke consistency --------------------------------------------------
print("\n[4] STROKE CONSISTENCY")
sw_found = set()
for f in glob.glob("dist/**/*.svg", recursive=True):
    for v in re.findall(r'stroke-width="([\d.]+)"', open(f).read()):
        sw_found.add(round(float(v), 4))
print(f"    distinct stroke-width values across every exported SVG: {sorted(sw_found)}")
sym_only = re.findall(r'stroke-width="([\d.]+)"', sym_svg)
print(f"    symbol artwork: {set(sym_only)}  (single value = monoline holds)")

# ---- 5. optical balance of the lotus ---------------------------------------
print("\n[5] OPTICAL BALANCE OF THE LOTUS")
lot = B.lotus_outline(G.AXIS, G.LOTUS_BASE[1], 1.0)
lsvg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="60 -20 320 200">'
        '<g fill="none" stroke="#000" stroke-width="10" stroke-linecap="round">'
        + "".join(f'<path d="{x}"/>' for x in lot) + "</g></svg>")
lm = ink_mask(lsvg, 1600)
lc, _, lx0, lx1, _, _ = centroid(lm)
print(f"    lotus ink bbox x {lx0}..{lx1}  centre {(lx0+lx1)/2:.1f}  centroid {lc:.1f}")
print(f"    asymmetry {abs(lc-(lx0+lx1)/2):.2f} px of {lx1-lx0} px "
      f"= {abs(lc-(lx0+lx1)/2)/(lx1-lx0)*100:.3f}%")
# mirror test
half = lm[:, : lm.shape[1] // 2]
other = np.fliplr(lm[:, lm.shape[1] - half.shape[1]:])
print(f"    mirror match: {100*(half==other).mean():.2f}% of pixels identical")

# ---- 6. small-size legibility ----------------------------------------------
print("\n[6] SMALL-SIZE LEGIBILITY")
for name, px in (("seal", 16), ("seal", 32), ("symbol", 70), ("primary", 180),
                 ("horizontal", 200)):
    s, v, _ = L.render(name, pad=0.0)
    _, _, vw, vh = v
    png = cairosvg.svg2png(bytestring=s.encode(), output_width=px)
    a = np.array(Image.open(io.BytesIO(png)).convert("RGBA").split()[-1])
    cov = (a > 40).mean()
    solid = (a > 200).mean()
    print(f"    {name:11s} @ {px:3d}px wide : ink coverage {cov*100:5.1f}%  "
          f"fully-opaque {solid*100:5.1f}%")

# ---- 7. clear space ---------------------------------------------------------
print("\n[7] CLEAR SPACE")
for n in ("primary", "horizontal", "symbol", "square", "circular", "wordmark"):
    _, v, c = L.LOCKUPS[n](ink="#000")
    X = L.clear_space(n)
    print(f"    {n:11s} X = {X:6.1f} units = {X/v[3]*100:5.2f}% of lockup height")

# ---- 8. construction accuracy ----------------------------------------------
print("\n[8] CONSTRUCTION ACCURACY")
phi_inv2 = G.PHI ** -2
print(f"    field {G.W:.0f} x {G.H:.0f} = 11:14 -> {G.W/G.H:.6f}  (11/14 = {11/14:.6f})")
print(f"    axis  {G.AXIS:.1f} = W/4 -> {G.AXIS/G.W:.6f}  (0.25)")
print(f"    triangle height/base {G.TRI_H/G.W:.6f}   phi^-2 {phi_inv2:.6f}   "
      f"delta {abs(G.TRI_H/G.W-phi_inv2):.2e}")
print(f"    apex {tuple(round(v,2) for v in G.APEX)}   ground y {G.GROUND_Y}")

# ---- 9. colour consistency --------------------------------------------------
print("\n[9] COLOUR CONSISTENCY")
allowed = {v[0].upper() for v in P.values()} | {"NONE", "CURRENTCOLOR"}
found = {}
for f in glob.glob("dist/**/*.svg", recursive=True):
    for h in re.findall(r'(?:fill|stroke|color)="(#[0-9A-Fa-f]{3,6})"', open(f).read()):
        found.setdefault(h.upper(), []).append(f)
stray = {h: v for h, v in found.items() if h not in allowed}
print(f"    palette hexes in use : {sorted(h for h in found if h in allowed)}")
if stray:
    for h, v in stray.items():
        print(f"    !! OFF-PALETTE {h} in {len(v)} file(s), e.g. {v[0]}")
else:
    print("    no off-palette colour found in any exported SVG")
navy = [f for f in glob.glob("dist/**/*.svg", recursive=True)
        if "16324F" in open(f).read().upper()]
print(f"    residual reference navy #16324F: {len(navy)} file(s)")

# ---- 10. cross-lockup consistency ------------------------------------------
print("\n[10] CONSISTENCY ACROSS LOCKUPS")
base = None
for n in ("primary", "horizontal", "symbol", "square", "circular", "watermark"):
    s, v, _ = L.render(n, pad=0.0)
    paths = len(re.findall(r"<path", s))
    print(f"    {n:11s} paths {paths:3d}   viewBox {tuple(round(q,1) for q in v)}")
print("=" * 78)
