"""
optical.py — measured optical letterspacing.

Uniform tracking is not spacing. This rasterises each glyph, measures the real
white area between every adjacent pair (capped so distant parts of a letter do
not dominate), and solves for the per-pair gaps that make the perceived space
equal across the whole word. That is what makes a logotype look drawn rather
than typed.
"""
import numpy as np
from PIL import Image
import cairosvg
from typeset import Face, typeset

RES = 220.0          # raster cap height


def glyph_raster(face, ch, cap=RES, pad=40):
    d, adv, bb = typeset(face, ch, cap, 0.0)
    if bb is None:
        return None, 0.0
    w = int(bb[2] - bb[0] + 2 * pad)
    h = int(cap * 2.2)
    base = cap * 1.5
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" '
           f'viewBox="0 0 {w} {h}"><path d="{d}" fill="#000" '
           f'transform="translate({pad - bb[0]},{base})"/></svg>')
    png = cairosvg.svg2png(bytestring=svg.encode())
    import io
    # cairosvg returns RGBA on a transparent ground - read the ALPHA channel,
    # not luminance, or every transparent pixel counts as ink.
    im = Image.open(io.BytesIO(png)).convert("RGBA")
    ink = np.array(im.split()[-1]) > 128
    return ink, pad


def pair_area(face, a, b, gap, cap=RES, maxd=None):
    """White area between glyph a and glyph b when their ink boxes are `gap` apart."""
    maxd = maxd or cap * 0.62
    ia, _ = glyph_raster(face, a, cap)
    ib, _ = glyph_raster(face, b, cap)
    h = min(ia.shape[0], ib.shape[0])
    ia, ib = ia[:h], ib[:h]
    # right edge of a, left edge of b, per scanline
    ra = np.full(h, np.nan); lb = np.full(h, np.nan)
    for y in range(h):
        xs = np.nonzero(ia[y])[0]
        if len(xs): ra[y] = xs.max()
        xs = np.nonzero(ib[y])[0]
        if len(xs): lb[y] = xs.min()
    ra_max = np.nanmax(ra); lb_min = np.nanmin(lb)
    # distance from a's right edge to b's left edge on rows where both have ink
    both = ~np.isnan(ra) & ~np.isnan(lb)
    d = (ra_max - ra[both]) + gap + (lb[both] - lb_min)
    d = np.clip(d, 0, maxd)
    return float(np.sum(maxd - d))          # bigger = tighter


def solve_gaps(face, word, target_gap, cap=RES, iters=44):
    """Find per-pair gaps so every pair encloses the same perceived white."""
    pairs = [(word[i], word[i + 1]) for i in range(len(word) - 1)]
    areas_at = {}

    def area(p, g):
        key = (p, round(g, 1))
        if key not in areas_at:
            areas_at[key] = pair_area(face, p[0], p[1], g, cap)
        return areas_at[key]

    # reference: the average area at the nominal gap
    ref = np.mean([area(p, target_gap) for p in pairs])
    out = []
    for p in pairs:
        lo, hi = target_gap * 0.35, target_gap * 2.4
        for _ in range(iters):
            mid = (lo + hi) / 2
            if area(p, mid) > ref:      # too tight -> open up
                lo = mid
            else:
                hi = mid
        out.append((p, (lo + hi) / 2))
    return out, ref
