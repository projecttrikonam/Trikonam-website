"""
brand.py — the Trikonam identity system: palette, wordmark, lockups.

Everything downstream (assets, manual) is generated from this one module.
"""
import json, os, sys, math, re
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from typeset import Face, typeset
import geometry as G

U, W, H = G.U, G.W, G.H          # 80, 880, 1120  (11u x 14u)

# ---------------------------------------------------------------- palette
PALETTE = {
    "forest":   ("#2F3A2A", "Forest Ink",  "primary logo ink"),
    "espresso": ("#2A2620", "Espresso",    "primary text"),
    "stone":    ("#5F564B", "Stone",       "secondary text, captions, meta"),
    "moss":     ("#5B6B4E", "Moss",        "accent, dividers, icons"),
    "mossdark": ("#46543C", "Moss Deep",   "accent hover"),
    "gold":     ("#8A6230", "Ochre Gold",  "call to action"),
    "goldleaf": ("#A87C3D", "Gold Leaf",   "foil and gilding reference"),
    "ivory":    ("#FAF7EF", "Ivory",       "primary ground"),
    "sand":     ("#EFE7D6", "Sand",        "alternate ground"),
    "border":   ("#E2D9C6", "Hairline",    "rules and card borders"),
    "white":    ("#FFFFFF", "White",       "paper, reverse ground"),
    "black":    ("#000000", "Black",       "single-colour print only"),
}
INK = PALETTE["forest"][0]
IVORY = PALETTE["ivory"][0]

# ---------------------------------------------------------------- wordmark
WORDMARK_FONT = "fonts/Trikonam-Wordmark.ttf"
BASE_TRACKING = 0.155            # em
OPTICAL = {                      # measured, damped 0.35, clamped +-0.045 cap
    "TR": -0.0341, "RI": 0.0009, "IK": 0.0450, "KO": -0.0352,
    "ON": 0.0450, "NA": -0.0069, "AM": -0.0300,
}
_face = None


def face():
    global _face
    if _face is None:
        _face = Face(os.path.join(os.path.dirname(os.path.abspath(__file__)), WORDMARK_FONT))
    return _face


def wordmark(cap=100.0, text="TRIKONAM"):
    """Outlined wordmark. Returns (path_d, width, height_above_baseline, bbox)."""
    f = face()
    trk = BASE_TRACKING * cap / (f.cap_height / f.upem)
    pa = {k: v * cap for k, v in OPTICAL.items()} if text == "TRIKONAM" else None
    d, adv, bb = typeset(f, text, cap, trk, pair_adjust=pa)
    return d, bb[2] - bb[0], bb, cap


def wordmark_g(cap, x, y, fill=INK, text="TRIKONAM"):
    """Place the wordmark with its ink-left at x and its BASELINE at y."""
    d, w, bb, _ = wordmark(cap, text)
    return f'<g transform="translate({x - bb[0]:.2f},{y:.2f})"><path d="{d}" fill="{fill}"/></g>', w


SYMBOL = open(os.path.join(os.path.dirname(os.path.abspath(__file__)),
                           "symbol_group.txt")).read()

# ---------------------------------------------------------------- weights
# The mark is a monoline, so it is issued in two optical weights. Below roughly
# 140 px of symbol height the Display stroke falls under one device pixel and the
# mark turns to grey mist; the Compact cut restores it without redrawing anything.
STROKE_DISPLAY = 10.0            # 0.89% of symbol height - 140 px and above
STROKE_COMPACT = 16.0            # 1.43% of symbol height - 60 to 140 px
LOTUS_H = 152.0                  # measured; the clear-space unit X
CLEAR_SPACE_RATIO = LOTUS_H / H  # 0.1357 of the symbol's height

_SW_RE = re.compile(r'stroke-width="[\d.]+"')


def symbol_g(x, y, height, colour=INK, weight=None):
    """Place the symbol. `weight` is the stroke in symbol units; None picks the
    correct optical cut for the size being drawn."""
    if weight is None:
        weight = STROKE_DISPLAY if height >= 140.0 else STROKE_COMPACT
    s = height / H
    body = _SW_RE.sub(f'stroke-width="{weight}"', SYMBOL, count=1)
    return (f'<g transform="translate({x:.2f},{y:.2f}) scale({s:.6f})" color="{colour}">'
            f'{body}</g>', height * W / H)

# ---------------------------------------------------------------- seal
def seal_path(cx, base_y, k):
    """The lotus as one filled path; petal overlaps knock out (even-odd)."""
    old = (G.AXIS, G.LOTUS_BASE, G.PETALS)
    G.AXIS = cx
    G.LOTUS_BASE = (cx, base_y)
    G.PETALS = [(0, 146 * k, 19 * k), (35, 150 * k, 23 * k), (62, 146 * k, 26 * k)]
    ds = G.lotus_paths()
    G.AXIS, G.LOTUS_BASE, G.PETALS = old
    return "".join(ds)


def lotus_outline(cx, base_y, k):
    old = (G.AXIS, G.LOTUS_BASE, G.PETALS)
    G.AXIS = cx
    G.LOTUS_BASE = (cx, base_y)
    G.PETALS = [(0, 146 * k, 19 * k), (35, 150 * k, 23 * k), (62, 146 * k, 26 * k)]
    ds = G.lotus_paths()
    G.AXIS, G.LOTUS_BASE, G.PETALS = old
    return ds


STROKE = 10.0            # master stroke, in symbol units
