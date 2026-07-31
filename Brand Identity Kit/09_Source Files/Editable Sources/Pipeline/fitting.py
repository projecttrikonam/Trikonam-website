"""Curve utilities shared by the build scripts (no side effects on import)."""
import numpy as np
from geometry import r2m


def fit_cubic(P, err=1.4):
    P = np.asarray(P, float)
    if len(P) < 4:
        return [(P[0], P[0], P[-1], P[-1])]
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

    def bez(t):
        return ((1 - t) ** 3 * P[0] + 3 * (1 - t) ** 2 * t * c1
                + 3 * (1 - t) * t ** 2 * c2 + t ** 3 * P[-1])
    e = np.linalg.norm(np.array([bez(ui) for ui in u]) - P, axis=1)
    imax = int(np.argmax(e))
    if e[imax] <= err or len(P) < 10:
        return [(P[0], c1, c2, P[-1])]
    imax = min(max(imax, 3), len(P) - 4)
    return fit_cubic(P[:imax + 1], err) + fit_cubic(P[imax:], err)


def sample(segs, n=400):
    pts = []
    for p0, c1, c2, p3 in segs:
        p0, c1, c2, p3 = map(np.array, (p0, c1, c2, p3))
        for t in np.linspace(0, 1, 40, endpoint=False):
            pts.append((1 - t) ** 3 * p0 + 3 * (1 - t) ** 2 * t * c1
                       + 3 * (1 - t) * t ** 2 * c2 + t ** 3 * p3)
    pts.append(np.array(segs[-1][3]))
    P = np.array(pts)
    d = np.r_[0, np.cumsum(np.linalg.norm(np.diff(P, axis=0), axis=1))]
    if d[-1] < 1e-6:
        return P
    t = np.linspace(0, d[-1], n)
    return np.c_[np.interp(t, d, P[:, 0]), np.interp(t, d, P[:, 1])]


def smooth(P, sigma=9.0):
    P = np.asarray(P, float)
    if len(P) < 8 or sigma <= 0:
        return P
    r = max(1, int(sigma * 3))
    k = np.exp(-0.5 * (np.arange(-r, r + 1) / sigma) ** 2); k /= k.sum()
    pad = np.r_[np.repeat(P[:1], r, 0), P, np.repeat(P[-1:], r, 0)]
    out = np.c_[np.convolve(pad[:, 0], k, "valid"), np.convolve(pad[:, 1], k, "valid")]
    out[0], out[-1] = P[0], P[-1]
    for i in range(1, min(12, len(out) - 1)):
        w = i / 12
        out[i] = out[i] * w + P[i] * (1 - w)
        out[-1 - i] = out[-1 - i] * w + P[-1 - i] * (1 - w)
    return out


def to_master(P):
    return np.array([r2m(p) for p in P])


def polar_smooth(P, centre, sigma=6.0):
    """Regularise a near-circular stroke: smooth its radius as a function of angle.
    Removes tracing wobble but keeps genuine profile (nose, chin) exactly in place."""
    P = np.asarray(P, float)
    cx, cy = centre
    dx, dy = P[:, 0] - cx, P[:, 1] - cy
    r = np.hypot(dx, dy)
    th = np.unwrap(np.arctan2(dy, dx))
    k = max(1, int(sigma * 3))
    ker = np.exp(-0.5 * (np.arange(-k, k + 1) / sigma) ** 2); ker /= ker.sum()
    rp = np.r_[np.repeat(r[:1], k), r, np.repeat(r[-1:], k)]
    rs = np.convolve(rp, ker, "valid")
    return np.c_[cx + rs * np.cos(th), cy + rs * np.sin(th)]


def snap_ends(P, start=None, end=None, span=0.4):
    P = np.array(P, float)
    m = len(P)
    if start is not None:
        d = np.array(start) - P[0]
        s = max(2, int(m * span))
        P[:s] += d * np.linspace(1, 0, s)[:, None]
    if end is not None:
        d = np.array(end) - P[-1]
        s = max(2, int(m * span))
        P[-s:] += d * np.linspace(0, 1, s)[:, None]
    return P


def d_of(segs, close=False):
    d = f"M{segs[0][0][0]:.2f},{segs[0][0][1]:.2f}"
    for p0, c1, c2, p3 in segs:
        d += f"C{c1[0]:.2f},{c1[1]:.2f} {c2[0]:.2f},{c2[1]:.2f} {p3[0]:.2f},{p3[1]:.2f}"
    return d + ("Z" if close else "")
