"""
geometry.py — the Trikonam master symbol, constructed.

MASTER FIELD
  880 x 1120 units  = 11u x 14u  where u = 80
  (the reference art measured 651 x 827 px -> 0.7872; 11:14 = 0.7857)

CONSTRUCTION LINES
  axis        x = 220 = 11u/4          the ascending axis (lotus + raised arm)
  ground      y = 1108                 the earth line
  apex        (498, 772)               hip / apex of the earth triangle
  earth triangle: base 880, height 336 = 880 x PHI^-2  (0.381966)
  lotus:      5 petals at 0, +-35, +-70 degrees from the axis
"""
import math, json
import numpy as np

U = 80.0
W = 11 * U          # 880
H = 14 * U          # 1120
AXIS = W / 4.0      # 220
GROUND_Y = 1108.0
PHI = (1 + 5 ** 0.5) / 2
TRI_H = W * PHI ** -2          # 336.13
APEX = (498.0, GROUND_Y - TRI_H)   # (498, 771.87)

# reference-space -> master-space transform (fitted from the ink bbox)
REF_X0, REF_Y0 = 335.0, 204.0
REF_W, REF_H = 651.0, 827.0
S = H / REF_H                                  # 1.354293
DX = (W - REF_W * S) / 2.0                     # centring nudge


def r2m(p):
    """reference px -> master units"""
    return ((p[0] - REF_X0) * S + DX, (p[1] - REF_Y0) * S)


# ---------------------------------------------------------------- lotus
# Five petals on the ascending axis at 0, +-35 and +-62 degrees. Each petal is a
# true vesica: two circular arcs struck between the base point and the tip, and the
# left half is an exact mirror of the right. Angles are the reference's own,
# regularised to whole degrees; the petals were narrowed so the flower stays open
# at small sizes.
LOTUS_BASE = (AXIS, 145.0)
PETALS = [   # (angle from axis in degrees, length, half-width)
    (0.0,  146.0, 19.0),
    (35.0, 150.0, 23.0),
    (62.0, 146.0, 26.0),
]


def arc_through(p0, p1, pm):
    """Circle through 3 points -> (r, large_arc, sweep) for an SVG A command p0->p1."""
    (x1, y1), (x2, y2), (x3, y3) = p0, pm, p1
    d = 2 * (x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2))
    if abs(d) < 1e-9:
        return None
    ux = ((x1 ** 2 + y1 ** 2) * (y2 - y3) + (x2 ** 2 + y2 ** 2) * (y3 - y1)
          + (x3 ** 2 + y3 ** 2) * (y1 - y2)) / d
    uy = ((x1 ** 2 + y1 ** 2) * (x3 - x2) + (x2 ** 2 + y2 ** 2) * (x1 - x3)
          + (x3 ** 2 + y3 ** 2) * (x2 - x1)) / d
    r = math.hypot(x1 - ux, y1 - uy)
    # sweep: cross product of (p1-p0) x (pm-p0)
    cross = (x3 - x1) * (y2 - y1) - (y3 - y1) * (x2 - x1)
    sweep = 0 if cross > 0 else 1
    return r, 0, sweep


def petal_path(angle_deg, length, halfw, mirror=False):
    """One lotus petal: a vesica of two circular arcs from base to tip."""
    a = math.radians(angle_deg if not mirror else -angle_deg)
    bx, by = LOTUS_BASE
    # tip
    tx = bx + math.sin(a) * length
    ty = by - math.cos(a) * length
    # midpoint of the chord, offset perpendicular by halfw
    mx, my = (bx + tx) / 2, (by + ty) / 2
    px, py = math.cos(a), math.sin(a)      # unit perpendicular to the petal axis
    l = (mx + px * halfw, my + py * halfw)
    r = (mx - px * halfw, my - py * halfw)
    a1 = arc_through((bx, by), (tx, ty), l)
    a2 = arc_through((tx, ty), (bx, by), r)
    d = f"M{bx:.2f},{by:.2f}"
    d += f"A{a1[0]:.2f},{a1[0]:.2f} 0 {a1[1]} {a1[2]} {tx:.2f},{ty:.2f}"
    d += f"A{a2[0]:.2f},{a2[0]:.2f} 0 {a2[1]} {a2[2]} {bx:.2f},{by:.2f}"
    return d


def lotus_paths():
    out = [petal_path(*PETALS[0])]
    for ang, ln, hw in PETALS[1:]:
        out.append(petal_path(ang, ln, hw, mirror=False))
        out.append(petal_path(ang, ln, hw, mirror=True))
    return out


if __name__ == "__main__":
    print("field", W, "x", H, " axis", AXIS, " apex", APEX)
    print("earth triangle height", TRI_H, "= base *", TRI_H / W)
    for p in lotus_paths():
        print(p[:70], "...")


# ---------------------------------------------------------------- head
# The skull is a true circle; the face is drawn through measured landmarks.
# Reference landmarks were read off the source at 4x and mapped into master units.
SKULL_C, SKULL_R = (88.0, 602.0), 70.0
KNOT_C, KNOT_R = (42.0, 660.0), 30.0

# The whole head is one polar curve r(theta) about the skull centre: the skull is
# essentially constant radius, and the face is a small, deliberate modulation of it.
# theta runs from the jaw (-7.5 deg) anticlockwise over the face and skull to the
# nape (-202.7 deg). Radii were measured off the source at 4x.
HEAD_POLAR = [
    (  -14.5, 63.75),
    (  -17.5, 65.42),
    (  -20.5, 67.61),
    (  -23.5, 69.91),
    (  -26.5, 71.89),
    (  -29.5, 73.18),
    (  -32.5, 73.61),
    (  -35.5, 73.28),
    (  -38.5, 72.43),
    (  -41.5, 71.32),
    (  -44.5, 70.14),
    (  -47.5, 69.05),
    (  -50.5, 67.35),
    (  -53.5, 66.53),
    (  -56.5, 67.26),
    (  -59.5, 68.92),
    (  -62.5, 69.46),
    (  -65.5, 68.91),
    (  -68.5, 67.41),
    (  -71.5, 65.41),
    (  -74.5, 63.23),
    (  -77.5, 62.86),
    (  -80.5, 62.20),
    (  -83.5, 62.14),
    (  -86.5, 62.58),
    (  -89.5, 63.36),
    (  -92.5, 64.32),
    (  -95.5, 65.35),
    (  -98.5, 66.34),
    ( -101.5, 67.21),
    ( -104.5, 67.92),
    ( -107.5, 68.47),
    ( -110.5, 68.90),
    ( -113.5, 69.28),
    ( -116.5, 69.62),
    ( -119.5, 69.93),
    ( -122.5, 70.23),
    ( -125.5, 70.49),
    ( -128.5, 70.71),
    ( -131.5, 70.90),
    ( -134.5, 71.05),
    ( -137.5, 71.15),
    ( -140.5, 71.20),
    ( -143.5, 71.22),
    ( -146.5, 71.20),
    ( -149.5, 71.14),
    ( -152.5, 71.05),
    ( -155.5, 70.93),
    ( -158.5, 70.77),
    ( -161.5, 70.57),
    ( -164.5, 70.30),
    ( -167.5, 69.97),
    ( -170.5, 69.60),
    ( -173.5, 69.19),
    ( -176.5, 68.76),
    ( -179.5, 68.31),
    ( -182.5, 67.87),
    ( -185.5, 67.46),
    ( -188.5, 67.12),
    ( -191.5, 66.87),
    ( -194.5, 66.73),
    ( -197.5, 66.69),
    ( -200.5, 66.71),
]



def _pchip(x, y, xi):
    """Monotone cubic interpolation - no overshoot, so the nose stays a nose."""
    x, y = np.asarray(x, float), np.asarray(y, float)
    h = np.diff(x); d = np.diff(y) / h
    m = np.zeros_like(y)
    m[1:-1] = np.where(d[:-1] * d[1:] > 0,
                       2 / (1 / np.where(d[:-1] == 0, 1e-9, d[:-1])
                            + 1 / np.where(d[1:] == 0, 1e-9, d[1:])), 0.0)
    m[0], m[-1] = d[0], d[-1]
    out = np.empty_like(np.asarray(xi, float))
    idx = np.clip(np.searchsorted(x, xi) - 1, 0, len(h) - 1)
    for k, (t, i) in enumerate(zip(np.asarray(xi, float), idx)):
        s = (t - x[i]) / h[i]
        h00 = 2 * s ** 3 - 3 * s ** 2 + 1; h10 = s ** 3 - 2 * s ** 2 + s
        h01 = -2 * s ** 3 + 3 * s ** 2;    h11 = s ** 3 - s ** 2
        out[k] = (h00 * y[i] + h10 * h[i] * m[i]
                  + h01 * y[i + 1] + h11 * h[i] * m[i + 1])
    return out


def head_outline(n=420):
    th = np.array([t for t, _ in HEAD_POLAR])[::-1]     # increasing
    rr = np.array([r for _, r in HEAD_POLAR])[::-1]
    t = np.linspace(th[0], th[-1], n)
    r = _pchip(th, rr, t)
    # a whisper of smoothing so the landmarks join without corners
    k = np.exp(-0.5 * (np.arange(-9, 10) / 3.0) ** 2); k /= k.sum()
    r = np.convolve(np.r_[np.repeat(r[:1], 9), r, np.repeat(r[-1:], 9)], k, "valid")
    a = np.radians(t)
    return np.c_[SKULL_C[0] + r * np.cos(a), SKULL_C[1] + r * np.sin(a)]


def knot_arc():
    """The hair knot: a 240 degree arc, its top-right tucked behind the skull."""
    t = np.radians(np.linspace(-3.8, 235.8, 180))
    return np.c_[KNOT_C[0] + KNOT_R * np.cos(t), KNOT_C[1] + KNOT_R * np.sin(t)]
