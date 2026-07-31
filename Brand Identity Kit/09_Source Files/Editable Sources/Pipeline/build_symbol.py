"""
build_symbol.py — the Trikonam master symbol.

Refinements over the reference drawing, each a deliberate decision:
  1. normalised into the 11 x 14 master field, u = 80
  2. hip apex snapped to the earth triangle's apex (base x PHI^-2)
  3. drawing wobble removed (resample -> gaussian smooth -> refit)
  4. cranium and hair knot regularised in POLAR space around their fitted centres,
     so the wobble goes but the face profile stays exactly where it was drawn
  5. lotus rebuilt exactly: 5 vesica petals, true arcs, exact mirror symmetry
  6. raised arm closed into one path with a rounded tip at the lotus base
  7. ground reduced to a single calm arc; the near foot kept as its own stroke
  8. the stem/petal overlap accident at the lotus base dropped
  9. one uniform stroke weight, round caps and joins
"""
import json, numpy as np
from geometry import U, W, H, AXIS, GROUND_Y, APEX, TRI_H, lotus_paths, LOTUS_BASE
from fitting import (sample, smooth, to_master, fit_cubic, polar_smooth,
                     snap_ends, d_of)

TR = json.load(open("traced.json"))
STROKE = 10.0

CRANIUM_C = (87.9, 602.4)
BUN_C = (42.1, 659.6)


def prep(idx, n=400, trim=(0, 0)):
    P = to_master(sample(TR[idx], n))
    a, b = trim
    return P[a: len(P) - b if b else None]


parts = []          # (name, d)


def add(name, P, err=2.0):
    parts.append((name, d_of(fit_cubic(P, err))))


# ---- legs, torso, arms ------------------------------------------------------
add("back-rightleg", snap_ends(smooth(prep(0, 620), 7.0), end=APEX), 2.0)
add("leftleg-inner", snap_ends(smooth(prep(6, 380), 8.0), start=APEX), 2.0)
add("lowerarm-back", smooth(prep(2, 460), 8.0), 2.0)
add("lowerarm-front", smooth(prep(7, 380), 8.0), 2.0)
add("torso-front", smooth(prep(5, 380), 8.0), 2.0)
add("hip", smooth(prep(14, 200), 4.0), 1.4)
add("shoulder-notch", smooth(prep(28, 160), 2.0), 1.0)
add("heel", smooth(prep(29, 160), 2.0), 1.0)

# ---- the raised arm: one closed path with a rounded tip at the lotus base ----
TIPL, TIPR = (AXIS - 6.0, LOTUS_BASE[1] + 6.0), (AXIS + 6.0, LOTUS_BASE[1] + 10.0)
a3 = snap_ends(smooth(prep(3, 420, trim=(26, 0)), 7.0), start=TIPL)   # lotus -> shoulder
a4 = snap_ends(smooth(prep(4, 420, trim=(14, 0)), 7.0), start=TIPR)   # lotus -> shoulder
arm = np.vstack([a3[::-1], a4])                                       # up one side, down the other
parts.append(("raised-arm", d_of(fit_cubic(a3[::-1], 1.8)) +
                            d_of(fit_cubic(a4, 1.8)).replace("M", "L", 1)))

# ---- head: drawn, not traced ------------------------------------------------
# The skeleton trace of the head was unusable at this scale, so the skull is an
# exact circle and the face profile is authored through measured landmarks.
from geometry import head_outline, knot_arc
add("head", head_outline(), 0.55)
add("hair-knot", knot_arc(), 0.4)
add("jaw", smooth(prep(15, 220), 3.0), 1.0)
add("neck", smooth(prep(10, 240), 3.0), 1.0)

# ---- ground + near foot -----------------------------------------------------
add("ground", smooth(prep(1, 600), 26.0), 1.0)
toe = smooth(prep(11, 220), 6.0)
toe = snap_ends(toe, start=parts and None)          # keep as drawn
add("near-foot", toe, 1.2)

# ---- assemble ---------------------------------------------------------------
body = "".join(f'<path d="{d}"/>' for _, d in parts)
lotus = "".join(f'<path d="{d}"/>' for d in lotus_paths())
GROUP = (f'<g fill="none" stroke="currentColor" stroke-width="{STROKE}" '
         f'stroke-linecap="round" stroke-linejoin="round">{body}{lotus}</g>')

svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W:.0f} {H:.0f}" '
       f'color="#2F3A2A">{GROUP}</svg>')
open("symbol.svg", "w").write(svg)
open("symbol_group.txt", "w").write(GROUP)
json.dump({n: d for n, d in parts}, open("symbol_parts.json", "w"))

# ---- proofs -----------------------------------------------------------------
from geometry import r2m
ref = "".join(f'<path d="{d_of([[list(r2m(q)) for q in s] for s in st])}"/>' for st in TR)
overlay = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="-40 -40 {W+80:.0f} {H+80:.0f}" width="700" color="#2F3A2A">
<rect x="-40" y="-40" width="{W+80:.0f}" height="{H+80:.0f}" fill="#FAF7EF"/>
<g stroke="#C8102E" stroke-width="4" fill="none" opacity="0.28">{ref}</g>
{GROUP}
<g stroke="#8A6230" stroke-width="2" fill="none" opacity="0.8" stroke-dasharray="10 8">
<path d="M0,{GROUND_Y} L{W},{GROUND_Y}"/><path d="M{AXIS},-40 L{AXIS},{H}"/>
<path d="M0,{GROUND_Y} L{APEX[0]},{APEX[1]} L{W},{GROUND_Y}"/></g></svg>'''
open("overlay.svg", "w").write(overlay)

import cairosvg
cairosvg.svg2png(url="symbol.svg", write_to="symbol.png", output_width=560,
                 background_color="#FAF7EF")
cairosvg.svg2png(url="overlay.svg", write_to="overlay.png", output_width=760)
print("parts", len(parts), "+5 petals   apex", tuple(round(v, 1) for v in APEX),
      " tri h", round(TRI_H, 2))
