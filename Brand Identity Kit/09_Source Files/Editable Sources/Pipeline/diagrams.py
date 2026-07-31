"""diagrams.py — the manual's technical plates, generated from the construction."""
import math, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import brand as B
import lockups as L
import geometry as G
from brand import U, W, H, PALETTE as P

INK = P["forest"][0]; MOSS = P["moss"][0]; GOLD = P["gold"][0]
BORDER = P["border"][0]; SAND = P["sand"][0]; IVORY = P["ivory"][0]
ESP = P["espresso"][0]

LBL = ('font-family="Karla,sans-serif" font-size="26" fill="%s" '
       'letter-spacing="1.6"' % MOSS)


def construction():
    """The 11 x 14 field, the quarter-line axis, and the phi-squared triangle."""
    pad = 130
    vb = (-pad - 60, -pad, W + 2 * pad + 200, H + 2 * pad + 60)
    g = []
    # module grid
    for i in range(12):
        g.append(f'<line x1="{i*U}" y1="0" x2="{i*U}" y2="{H}" stroke="{BORDER}" stroke-width="1.6"/>')
    for j in range(15):
        g.append(f'<line x1="0" y1="{j*U}" x2="{W}" y2="{j*U}" stroke="{BORDER}" stroke-width="1.6"/>')
    g.append(f'<rect x="0" y="0" width="{W}" height="{H}" fill="none" stroke="{MOSS}" '
             f'stroke-width="3" opacity="0.55"/>')
    # earth triangle
    ax, ay = G.APEX
    g.append(f'<path d="M0,{G.GROUND_Y} L{ax},{ay} L{W},{G.GROUND_Y} Z" fill="{GOLD}" '
             f'fill-opacity="0.07" stroke="{GOLD}" stroke-width="3.4" stroke-dasharray="14 10"/>')
    # ascending axis
    g.append(f'<line x1="{G.AXIS}" y1="{-pad+30}" x2="{G.AXIS}" y2="{H}" stroke="{GOLD}" '
             f'stroke-width="3.4" stroke-dasharray="14 10"/>')
    # the mark
    sym, _ = B.symbol_g(0, 0, H, INK)
    g.append(sym)
    # annotation
    g.append(f'<text x="{G.AXIS+18}" y="{-pad+64}" {LBL}>axis  11u / 4</text>')
    g.append(f'<text x="{W+16}" y="{G.GROUND_Y+8}" {LBL}>earth line</text>')
    g.append(f'<text x="{ax+18}" y="{ay-16}" {LBL}>apex</text>')
    g.append(f'<text x="{-pad+10}" y="{H+70}" {LBL}>base 11u</text>')
    g.append(f'<text x="{W*0.34}" y="{G.GROUND_Y-14}" font-family="Karla,sans-serif" '
             f'font-size="26" fill="{GOLD}" letter-spacing="1.6">height = base x 0.382</text>')
    body = "".join(g)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb[0]} {vb[1]} {vb[2]} {vb[3]}" '
            f'role="img" aria-label="Construction grid: the mark on an 11 by 14 module field">'
            f'{body}</svg>')


def lotus_construction():
    cx, by = G.AXIS, G.LOTUS_BASE[1]
    g = []
    R = 210
    for ang in (0, 35, 62, -35, -62):
        a = math.radians(ang)
        x2 = cx + math.sin(a) * R
        y2 = by - math.cos(a) * R
        g.append(f'<line x1="{cx}" y1="{by}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{GOLD}" '
                 f'stroke-width="2.6" stroke-dasharray="10 8"/>')
    g.append(f'<path d="M {cx} {by-150} A 150 150 0 0 1 {cx+150*math.sin(math.radians(62)):.1f} '
             f'{by-150*math.cos(math.radians(62)):.1f}" fill="none" stroke="{GOLD}" '
             f'stroke-width="2.2" opacity="0.6"/>')
    ds = B.lotus_outline(cx, by, 1.0)
    body = "".join(f'<path d="{d}"/>' for d in ds)
    g.append(f'<g fill="none" stroke="{INK}" stroke-width="10" stroke-linecap="round" '
             f'stroke-linejoin="round">{body}</g>')
    g.append(f'<circle cx="{cx}" cy="{by}" r="7" fill="{GOLD}"/>')
    for ang, dx in ((0, 0), (35, 8), (62, 14)):
        a = math.radians(ang)
        g.append(f'<text x="{cx+math.sin(a)*(R+16)+dx}" y="{by-math.cos(a)*(R+16)}" '
                 f'font-family="Karla,sans-serif" font-size="22" fill="{GOLD}">{ang}°</text>')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="40 -110 360 300" role="img" '
            f'aria-label="Lotus construction: five petals at 0, 35 and 62 degrees">'
            f'{"".join(g)}</svg>')


def clear_space():
    sh = H
    body, vb, cap = L.primary(INK, sh)
    _, _, lw, lh = vb
    X = cap
    g = [f'<rect x="{-X}" y="{-X}" width="{lw+2*X}" height="{lh+2*X}" fill="{GOLD}" '
         f'fill-opacity="0.06" stroke="{GOLD}" stroke-width="3" stroke-dasharray="12 9"/>',
         f'<rect x="0" y="0" width="{lw}" height="{lh}" fill="none" stroke="{MOSS}" '
         f'stroke-width="2" opacity="0.4"/>', body]
    for (x, y) in ((-X / 2, lh / 2), (lw + X / 2, lh / 2), (lw / 2, -X / 2), (lw / 2, lh + X / 2)):
        g.append(f'<text x="{x}" y="{y}" text-anchor="middle" dominant-baseline="middle" '
                 f'font-family="Fraunces,serif" font-size="{X*0.62}" fill="{GOLD}">X</text>')
    p = X * 1.5
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{-p} {-p} {lw+2*p} {lh+2*p}" '
            f'role="img" aria-label="Clear space equals X on all sides">{"".join(g)}</svg>')


def min_size():
    items = [("Primary lockup", "primary", 32, "32 mm / 120 px wide"),
             ("Horizontal", "horizontal", 52, "52 mm / 200 px wide"),
             ("Symbol", "symbol", 16, "16 mm / 60 px wide"),
             ("Wordmark", "wordmark", 24, "24 mm / 90 px wide"),
             ("Reduced mark", "seal", 6, "6 mm / 16 px")]
    cells = []
    x = 0
    for label, name, mm, note in items:
        # draw each at its own minimum, in the optical cut it is approved in
        body, vb, cap = L.LOCKUPS[name](ink=INK)
        _, _, w, h = vb
        target_w = mm * 6.0
        s = target_w / w
        cells.append(f'<g transform="translate({x},{200 - h*s}) scale({s})">{body}</g>'
                     f'<text x="{x}" y="230" font-family="Karla,sans-serif" font-size="15" '
                     f'fill="{ESP}">{label}</text>'
                     f'<text x="{x}" y="252" font-family="Karla,sans-serif" font-size="13" '
                     f'fill="{MOSS}">{note}</text>')
        x += target_w + 60
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 -10 {x+10} 280" role="img" '
            f'aria-label="Minimum sizes">{"".join(cells)}</svg>')


MISUSE = [
    ("Do not stretch or condense", "stretch"),
    ("Do not rotate", "rotate"),
    ("Do not recolour outside the palette", "recolour"),
    ("Do not add shadow, glow or bevel", "shadow"),
    ("Do not place on a busy image", "busy"),
    ("Do not rearrange the lockup", "rearrange"),
    ("Do not outline or stroke the mark", "outline"),
    ("Do not alter the spacing of the wordmark", "respace"),
]


def misuse_tile(kind, S=300):
    body, vb, cap = L.primary(INK, H)
    _, _, w, h = vb
    s = S * 0.62 / h
    tx, ty = (S - w * s) / 2, (S - h * s) / 2
    inner = f'<g transform="translate({tx},{ty}) scale({s})">{body}</g>'
    defs = ""
    if kind == "stretch":
        inner = f'<g transform="translate({tx-46},{ty+18}) scale({s*1.62},{s*0.74})">{body}</g>'
    elif kind == "rotate":
        inner = (f'<g transform="rotate(-13 {S/2} {S/2}) translate({tx},{ty}) scale({s})">'
                 f'{body}</g>')
    elif kind == "recolour":
        b2, _, _ = L.primary("#C2185B", H)
        inner = f'<g transform="translate({tx},{ty}) scale({s})">{b2}</g>'
    elif kind == "shadow":
        # a literal offset copy, not a filter: renders identically everywhere
        sb, _, _ = L.primary("#9a9a92", H)
        inner = (f'<g transform="translate({tx+9},{ty+12}) scale({s})" opacity="0.75">{sb}</g>'
                 f'<g transform="translate({tx},{ty}) scale({s})">{body}</g>')
    elif kind == "busy":
        defs = ('<pattern id="bz" width="26" height="26" patternUnits="userSpaceOnUse">'
                f'<rect width="26" height="26" fill="#8b7f66"/>'
                f'<circle cx="7" cy="7" r="7" fill="#c8b18a"/>'
                f'<circle cx="19" cy="19" r="9" fill="#5c5240"/></pattern>')
        inner = f'<rect width="{S}" height="{S}" fill="url(#bz)"/>' + inner
    elif kind == "rearrange":
        hb, hv, hc = L.horizontal(INK, H)
        _, _, hw, hh = hv
        s2 = S * 0.72 / hw
        inner = (f'<g transform="translate({(S-hw*s2)/2},{(S-hh*s2)/2}) scale({s2}) '
                 f'scale(-1,1) translate({-hw},0)">{hb}</g>')
    elif kind == "outline":
        sym, _ = B.symbol_g(0, 0, H, "none")
        inner = (f'<g transform="translate({tx},{ty}) scale({s})" >'
                 f'<g stroke="{INK}" stroke-width="26" fill="none" opacity="0.35">{body}</g>'
                 f'{body}</g>')
    elif kind == "respace":
        d, ww, bb, _ = B.wordmark(120.0)
        from typeset import typeset as ts
        f = B.face()
        d2, _, bb2 = ts(f, "TRIKONAM", 120.0, 120.0 * 0.42)
        inner = (f'<g transform="translate({S*0.06},{S*0.58})">'
                 f'<path d="{d2}" fill="{INK}" transform="translate({-bb2[0]},0) '
                 f'scale({S*0.88/(bb2[2]-bb2[0])})"/></g>')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {S} {S}" role="img" '
            f'aria-hidden="true"><defs>{defs}</defs>'
            f'<rect width="{S}" height="{S}" fill="{IVORY}"/>{inner}</svg>')


def plate(name, ink=INK, bg=None, **kw):
    svg, vb, cap = L.render(name, ink=ink, bg=bg, pad=0.07 if name != "seal" else 0.04, **kw)
    return svg


def weights():
    """Display against Compact, each shown at the size it is meant for."""
    import brand as BB
    cells = []
    x = 0
    for label, w, px, note in (("Display  stroke 10", BB.STROKE_DISPLAY, 300,
                                "140 px of symbol height and above"),
                               ("Compact  stroke 16", BB.STROKE_COMPACT, 300,
                                "60 to 140 px")):
        g, sw = BB.symbol_g(x, 0, px, INK, w)
        cells.append(g)
        cells.append(f'<text x="{x}" y="{px+34}" font-family="Karla,sans-serif" '
                     f'font-size="15" fill="{ESP}">{label}</text>')
        cells.append(f'<text x="{x}" y="{px+56}" font-family="Karla,sans-serif" '
                     f'font-size="13" fill="{MOSS}">{note}</text>')
        x += sw + 70
    # the same two at 78 px, where the difference is the whole point
    for label, w in (("Display at 78 px", 10.0), ("Compact at 78 px", 16.0)):
        g, sw = B.symbol_g(x, px - 78, 78, INK, w)
        cells.append(g)
        cells.append(f'<text x="{x}" y="{px+34}" font-family="Karla,sans-serif" '
                     f'font-size="13" fill="{MOSS}">{label}</text>')
        x += sw + 46
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 -8 {x+8} {px+80}" '
            f'role="img" aria-label="Display and Compact optical cuts">{"".join(cells)}</svg>')
