"""
lockups.py — every approved configuration of the Trikonam logo.

Construction rules (these are the manual's rules, expressed as code):
  PRIMARY     the wordmark is set to exactly the symbol's width; the gap between
              the earth line and the wordmark's cap-line is 0.075 of the symbol height.
  HORIZONTAL  wordmark cap height = 0.235 of the symbol height; the wordmark's
              cap-line aligns to the figure's shoulder, its baseline to the earth line.
  CLEAR SPACE X = the height of the lotus, 0.1357 of the symbol's height. One rule
              for every lockup, so the margin stays visually equal across the set.
  WEIGHT      the symbol carries the Display stroke at 140 px of symbol height and
              above, and the Compact stroke below it. `weight=` overrides.
"""
import math
import brand as B
from brand import U, W, H, INK

SYM_ASPECT = W / H                      # 0.7857
_d, _w, _bb, _ = B.wordmark(100.0)
WM_W_PER_CAP = _w / 100.0               # wordmark width in cap heights
WM_DESC = 0.0                           # all-caps: nothing below the baseline

PRIMARY_GAP = 0.075                     # of symbol height
PRIMARY_CAP = (H * SYM_ASPECT) / WM_W_PER_CAP / H    # cap as a fraction of sym height
HORIZ_CAP = 0.205
# v1.1 — the horizontal lockup was re-spaced optically. The symbol is a WEDGE: across
# the band the wordmark occupies its ink stops at x=561, while the ground line alone
# reaches x=879. A gap measured off the bounding box therefore reads as a 402-unit void
# beside the type, 4.8x its nominal size, and the two elements drifted apart. The gap
# below closes that PERCEIVED void by 15%, landing the T's left edge on the ground
# line's terminus. It stays positive, so the wordmark never overhangs the symbol's box
# and the clear-space rule is unaffected.
HORIZ_GAP = 23.7 / 1120                 # 0.02116 of symbol height (was 0.075)
# The symbol's ink centroid sits 105 units below its bounding-box centre - the legs and
# the earth line carry the mass - so a box-centred wordmark rides visually high. This
# takes back ~40% of that; the full centroid reads as a slump.
HORIZ_DROP = 44.6 / 1120                # 0.03982 of symbol height (was 0)


def _svg(vb, body, w=None, bg=None, extra=""):
    x, y, ww, hh = vb
    r = f'<rect x="{x}" y="{y}" width="{ww}" height="{hh}" fill="{bg}"/>' if bg else ""
    wa = f' width="{w}"' if w else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x} {y} {ww} {hh}"{wa}>'
            f'{r}{extra}{body}</svg>')


# ---------------------------------------------------------------- lockups
def primary(ink=INK, sh=H, weight=None):
    """Symbol above wordmark, both on the same vertical axis."""
    sw = sh * SYM_ASPECT
    cap = PRIMARY_CAP * sh
    gap = PRIMARY_GAP * sh
    g, _ = B.symbol_g(0, 0, sh, ink, weight)
    wg, ww = B.wordmark_g(cap, (sw - cap * WM_W_PER_CAP) / 2, sh + gap + cap, ink)
    total_h = sh + gap + cap
    return g + wg, (0, 0, sw, total_h), cap


def horizontal(ink=INK, sh=H, weight=None):
    """Symbol beside wordmark."""
    sw = sh * SYM_ASPECT
    cap = HORIZ_CAP * sh
    gap = HORIZ_GAP * sh
    g, _ = B.symbol_g(0, 0, sh, ink, weight)
    # the wordmark is centred on the symbol's full height: against a mark this
    # tall, hanging it off the earth line leaves the type stranded at the foot.
    # v1.1 lowers it by HORIZ_DROP to sit on the symbol's optical centre rather
    # than its bounding-box centre.
    baseline = sh / 2 + cap / 2 + HORIZ_DROP * sh
    wg, ww = B.wordmark_g(cap, sw + gap, baseline, ink)
    return g + wg, (0, 0, sw + gap + ww, sh), cap


def symbol_only(ink=INK, sh=H, weight=None):
    g, sw = B.symbol_g(0, 0, sh, ink, weight)
    return g, (0, 0, sw, sh), None


def wordmark_only(ink=INK, cap=200.0):
    wg, ww = B.wordmark_g(cap, 0, cap, ink)
    return wg, (0, 0, ww, cap), cap


def square(ink=INK, S=1000.0, ground=None, weight=None):
    """Symbol over wordmark, optically centred in a square."""
    inner = S * 0.66
    sh = inner
    sw = sh * SYM_ASPECT
    cap = PRIMARY_CAP * sh
    gap = PRIMARY_GAP * sh
    th = sh + gap + cap
    if th > S * 0.78:
        k = S * 0.78 / th
        sh *= k; sw *= k; cap *= k; gap *= k; th *= k
    x = (S - sw) / 2
    y = (S - th) / 2
    g, _ = B.symbol_g(x, y, sh, ink, weight)
    wg, _ = B.wordmark_g(cap, x + (sw - cap * WM_W_PER_CAP) / 2, y + sh + gap + cap, ink)
    return g + wg, (0, 0, S, S), cap


def circular(ink=INK, S=1000.0, rule=True, weight=None):
    """Roundel: the mark inside a hairline circle."""
    r = S / 2 - S * 0.010
    inner = S * 0.585
    sh = inner
    sw = sh * SYM_ASPECT
    cap = PRIMARY_CAP * sh
    gap = PRIMARY_GAP * sh
    th = sh + gap + cap
    x = (S - sw) / 2
    y = (S - th) / 2
    g, _ = B.symbol_g(x, y, sh, ink, weight)
    wg, _ = B.wordmark_g(cap, x + (sw - cap * WM_W_PER_CAP) / 2, y + sh + gap + cap, ink)
    ring = (f'<circle cx="{S/2}" cy="{S/2}" r="{r}" fill="none" stroke="{ink}" '
            f'stroke-width="{S*0.006}"/>') if rule else ""
    return ring + g + wg, (0, 0, S, S), cap


def seal(ink=INK, S=1000.0, solid=True, k=2.45):
    """The reduced mark: the five petals as one filled path (overlaps knock out)."""
    if solid:
        d = B.seal_path(S / 2, S * 0.78, k * S / 1000.0)
        return f'<path d="{d}" fill="{ink}" fill-rule="evenodd"/>', (0, 0, S, S), None
    ds = B.lotus_outline(S / 2, S * 0.78, k * S / 1000.0)
    body = "".join(f'<path d="{x}"/>' for x in ds)
    return (f'<g fill="none" stroke="{ink}" stroke-width="{S*0.040}" stroke-linecap="round" '
            f'stroke-linejoin="round">{body}</g>', (0, 0, S, S), None)


def app_icon(ink=INK, ground=None, S=1024.0, radius=0.2237):
    """Seal on a tile. radius 0.2237 = the iOS squircle corner ratio."""
    if ground is None:
        ground = B.PALETTE["ivory"][0]
    if ink == ground:                      # never emit an invisible tile
        ink = B.PALETTE["forest"][0]
    d = B.seal_path(S / 2, S * 0.735, 2.15 * S / 1000.0)
    bg = (f'<rect width="{S}" height="{S}" rx="{S*radius}" ry="{S*radius}" fill="{ground}"/>')
    return bg + f'<path d="{d}" fill="{ink}" fill-rule="evenodd"/>', (0, 0, S, S), None


def social_profile(ink=INK, ground=None, S=1000.0):
    """Circular avatar: seal centred, generous margin (platforms crop hard)."""
    if ground is None:
        ground = B.PALETTE["ivory"][0]
    if ink == ground:
        ink = B.PALETTE["forest"][0]
    d = B.seal_path(S / 2, S * 0.715, 1.85 * S / 1000.0)
    return (f'<circle cx="{S/2}" cy="{S/2}" r="{S/2}" fill="{ground}"/>'
            f'<path d="{d}" fill="{ink}" fill-rule="evenodd"/>', (0, 0, S, S), None)


def watermark(ink=INK, sh=H, opacity=0.10, weight=None):
    g, sw = B.symbol_g(0, 0, sh, ink, weight)
    return f'<g opacity="{opacity}">{g}</g>', (0, 0, sw, sh), None


def stamp(ink=INK, S=1000.0):
    """Seal / stamp: the solid lotus inside a double rule, for certificates."""
    r1 = S / 2 - S * 0.015
    r2 = r1 - S * 0.038
    d = B.seal_path(S / 2, S * 0.70, 1.55 * S / 1000.0)
    cap = S * 0.058
    wg, ww = B.wordmark_g(cap, 0, 0, ink)
    wm = (f'<g transform="translate({S/2 - ww/2},{S*0.845})">'
          f'{wg.split(">",1)[1].rsplit("</g>",1)[0]}</g>')
    return (f'<circle cx="{S/2}" cy="{S/2}" r="{r1}" fill="none" stroke="{ink}" stroke-width="{S*0.009}"/>'
            f'<circle cx="{S/2}" cy="{S/2}" r="{r2}" fill="none" stroke="{ink}" stroke-width="{S*0.0035}"/>'
            f'<path d="{d}" fill="{ink}" fill-rule="evenodd"/>{wm}',
            (0, 0, S, S), cap)


LOCKUPS = {
    "primary": primary,
    "horizontal": horizontal,
    "symbol": symbol_only,
    "wordmark": wordmark_only,
    "square": square,
    "circular": circular,
    "seal": seal,
    "app-icon": app_icon,
    "social-profile": social_profile,
    "watermark": watermark,
    "stamp": stamp,
}


def clear_space(name, **kw):
    """X for a given lockup, in that lockup's own units."""
    body, vb, cap = LOCKUPS[name](ink="#000", **kw)
    if name == "wordmark":
        return cap                      # no symbol present: X = the cap height
    if name in ("seal", "app-icon", "social-profile", "stamp"):
        return vb[3] * 0.10             # tile artwork: 10% of the tile
    sh = vb[3] if name in ("symbol", "watermark", "horizontal") else None
    if sh is None:                      # primary / square / circular
        sh = kw.get("S", vb[3])
        if name == "primary":
            sh = vb[3] / (1 + PRIMARY_GAP + PRIMARY_CAP)
        else:
            sh = vb[3] * (0.66 if name == "square" else 0.585)
    return sh * B.CLEAR_SPACE_RATIO


def render(name, ink=INK, bg=None, pad=0.0, **kw):
    body, vb, cap = LOCKUPS[name](ink=ink, **kw)
    x, y, w, h = vb
    if pad:
        p = pad * max(w, h)
        vb = (x - p, y - p, w + 2 * p, h + 2 * p)
    return _svg(vb, body, bg=bg), vb, cap
