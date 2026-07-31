"""
trace.py — recover the centreline skeleton of the reference drawing, split it into
strokes at junctions, and fit smooth cubic Beziers to each.

Output: traced.json  (list of strokes, each a list of cubic segments in reference px)
        traced.svg   (monoline preview, so we can eyeball fidelity)
"""
import numpy as np, json
from skimage.morphology import skeletonize, remove_small_objects
from scipy.ndimage import convolve

mask = np.load("mask.npy")
mask = remove_small_objects(mask, 40)
skel = skeletonize(mask)
H, W = skel.shape

# --- neighbour counts -> classify endpoints / junctions ---
K = np.array([[1, 1, 1], [1, 0, 1], [1, 1, 1]], np.uint8)
nb = convolve(skel.astype(np.uint8), K, mode="constant")
nb = nb * skel
ends = (nb == 1) & skel
junc = (nb >= 3) & skel

# Remove junction pixels (and their 8-neighbourhood) to break the graph into arcs
brk = junc.copy()
ys, xs = np.nonzero(junc)
for y, x in zip(ys, xs):
    brk[max(0, y - 1):y + 2, max(0, x - 1):x + 2] |= skel[max(0, y - 1):y + 2, max(0, x - 1):x + 2]
arcs_mask = skel & ~brk

# --- walk each arc into an ordered polyline ---
from collections import deque
visited = np.zeros_like(arcs_mask)
NB8 = [(-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 0), (1, 1)]


def neighbours(y, x, m):
    for dy, dx in NB8:
        yy, xx = y + dy, x + dx
        if 0 <= yy < H and 0 <= xx < W and m[yy, xx]:
            yield yy, xx


def walk(sy, sx):
    """Walk from an endpoint following the arc."""
    path = [(sy, sx)]
    visited[sy, sx] = True
    cur = (sy, sx)
    while True:
        nxt = [p for p in neighbours(*cur, arcs_mask) if not visited[p]]
        if not nxt:
            break
        # prefer 4-connected to keep the path tight
        nxt.sort(key=lambda p: abs(p[0] - cur[0]) + abs(p[1] - cur[1]))
        cur = nxt[0]
        visited[cur] = True
        path.append(cur)
    return path


anb = convolve(arcs_mask.astype(np.uint8), K, mode="constant") * arcs_mask
polylines = []
# start from arc endpoints first
eys, exs = np.nonzero((anb == 1) & arcs_mask)
for y, x in zip(eys, exs):
    if not visited[y, x]:
        p = walk(y, x)
        if len(p) >= 8:
            polylines.append(p)
# then any leftover loops
lys, lxs = np.nonzero(arcs_mask & ~visited)
for y, x in zip(lys, lxs):
    if not visited[y, x]:
        p = walk(y, x)
        if len(p) >= 8:
            polylines.append(p)

polylines.sort(key=len, reverse=True)
print(f"{len(polylines)} arcs; lengths: {[len(p) for p in polylines[:30]]}")

# --- fit cubic Beziers (Schneider-style, simplified) ---
def fit_cubic(pts, err=1.4):
    """Recursive corner-splitting cubic fit. pts: Nx2 float (x,y)."""
    P = np.asarray(pts, float)
    if len(P) < 4:
        return [(P[0], P[0], P[-1], P[-1])]
    # chord-length parameterisation
    d = np.r_[0, np.cumsum(np.linalg.norm(np.diff(P, axis=0), axis=1))]
    if d[-1] == 0:
        return []
    u = d / d[-1]
    t1 = P[min(3, len(P) - 1)] - P[0]
    t2 = P[max(-4, -len(P))] - P[-1]
    n1, n2 = np.linalg.norm(t1), np.linalg.norm(t2)
    if n1 == 0 or n2 == 0:
        return [(P[0], P[0], P[-1], P[-1])]
    t1, t2 = t1 / n1, t2 / n2

    # least squares for the two tangent magnitudes
    A = np.zeros((len(P), 2, 2))
    A[:, 0] = np.outer(3 * (1 - u) ** 2 * u, t1)
    A[:, 1] = np.outer(3 * (1 - u) * u ** 2, t2)
    C = np.zeros((2, 2)); X = np.zeros(2)
    for i, ui in enumerate(u):
        tmp = P[i] - (P[0] * ((1 - ui) ** 3 + 3 * (1 - ui) ** 2 * ui)
                      + P[-1] * (3 * (1 - ui) * ui ** 2 + ui ** 3))
        C[0, 0] += A[i, 0] @ A[i, 0]; C[0, 1] += A[i, 0] @ A[i, 1]
        C[1, 0] = C[0, 1];            C[1, 1] += A[i, 1] @ A[i, 1]
        X[0] += A[i, 0] @ tmp;        X[1] += A[i, 1] @ tmp
    det = C[0, 0] * C[1, 1] - C[0, 1] * C[1, 0]
    if abs(det) < 1e-9:
        a1 = a2 = d[-1] / 3
    else:
        a1 = (X[0] * C[1, 1] - C[0, 1] * X[1]) / det
        a2 = (C[0, 0] * X[1] - X[0] * C[1, 0]) / det
    if a1 < 1e-6 or a2 < 1e-6:
        a1 = a2 = d[-1] / 3
    c1, c2 = P[0] + t1 * a1, P[-1] + t2 * a2

    # measure error
    def bez(t):
        return ((1 - t) ** 3 * P[0] + 3 * (1 - t) ** 2 * t * c1
                + 3 * (1 - t) * t ** 2 * c2 + t ** 3 * P[-1])
    e = np.linalg.norm(np.array([bez(ui) for ui in u]) - P, axis=1)
    imax = int(np.argmax(e))
    if e[imax] <= err or len(P) < 10:
        return [(P[0], c1, c2, P[-1])]
    imax = min(max(imax, 3), len(P) - 4)
    return fit_cubic(P[:imax + 1], err) + fit_cubic(P[imax:], err)


strokes = []
for p in polylines:
    pts = [(float(x), float(y)) for y, x in p]
    # light smoothing before fitting
    a = np.asarray(pts)
    if len(a) > 6:
        k = np.ones(5) / 5
        a[2:-2, 0] = np.convolve(a[:, 0], k, "valid")
        a[2:-2, 1] = np.convolve(a[:, 1], k, "valid")
    segs = fit_cubic(a, 1.4)
    strokes.append([[list(map(float, q)) for q in s] for s in segs])

json.dump(strokes, open("traced.json", "w"))

# preview
def d_of(segs):
    d = f"M{segs[0][0][0]:.1f},{segs[0][0][1]:.1f}"
    for p0, c1, c2, p3 in segs:
        d += f"C{c1[0]:.1f},{c1[1]:.1f} {c2[0]:.1f},{c2[1]:.1f} {p3[0]:.1f},{p3[1]:.1f}"
    return d

paths = "".join(
    f'<path d="{d_of(s)}" fill="none" stroke="#16324F" stroke-width="7" '
    f'stroke-linecap="round" stroke-linejoin="round"/>' for s in strokes)
svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="1254" height="1254" '
       f'viewBox="0 0 1254 1254"><rect width="1254" height="1254" fill="#FAF7EF"/>'
       f'{paths}</svg>')
open("traced.svg", "w").write(svg)
print("strokes:", len(strokes), "segments:", sum(len(s) for s in strokes))
