"""
refine_font.py — the custom lettering refinement.

Marcellus draws A and M with BLUNT, FLAT apexes. The symbol's one distinctive
geometric event is the crisp point where two arcs meet at a lotus petal tip.
Sharpening those apexes to true points ties the wordmark to the symbol and makes
the lettering Trikonam's own rather than an unmodified font.

A pointed apex reads optically shorter than a flat one of the same height, so each
sharpened vertex is given a small overshoot.
"""
from fontTools.ttLib import TTFont
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.recordingPen import RecordingPen


def sharpen_apex(font, char, overshoot=22, which="max"):
    """Collapse a flat apex (two on-curve points at the same extreme y) to one point."""
    glyf = font["glyf"]
    gname = font.getBestCmap()[ord(char)]
    g = glyf[gname]
    coords, ends, flags = g.getCoordinates(glyf)
    coords = list(coords); flags = list(flags); ends = list(ends)

    ys = [p[1] for p in coords]
    target = max(ys) if which == "max" else min(ys)
    idxs = [i for i, p in enumerate(coords) if p[1] == target and (flags[i] & 1)]
    # group into runs of adjacent indices - each run is one flat apex
    runs, cur = [], [idxs[0]] if idxs else []
    for i in idxs[1:]:
        if i == cur[-1] + 1:
            cur.append(i)
        else:
            runs.append(cur); cur = [i]
    if cur:
        runs.append(cur)
    runs = [r for r in runs if len(r) >= 2]
    if not runs:
        return False, f"{char}: no flat apex at y={target}"

    my = int(round(target + (overshoot if which == "max" else -overshoot)))
    # collapse from the last run backwards so earlier indices stay valid
    for run in reversed(runs):
        a, b = run[0], run[-1]
        mx = int(round(sum(coords[i][0] for i in run) / len(run)))
        coords[a] = (mx, my)
        for j in range(b, a, -1):
            del coords[j]; del flags[j]
        n = b - a
        ends = [e - n if e >= b else e for e in ends]

    # rebuild the glyph through a pen so the contours stay well formed
    pen = TTGlyphPen(None)
    start = 0
    for e in ends:
        contour = [(coords[i], flags[i] & 1) for i in range(start, e + 1)]
        _emit_contour(pen, contour)
        start = e + 1
    newg = pen.glyph()
    newg.program = getattr(g, "program", newg.program)
    glyf[gname] = newg
    return True, f"{char}: apex sharpened at x={mx:.0f}, y={target}->{my:.0f}"


def _emit_contour(pen, contour):
    """Emit a quadratic contour of (pt, on_curve) pairs."""
    if not contour:
        return
    # rotate so we start on an on-curve point if one exists
    on = [i for i, (_, o) in enumerate(contour) if o]
    if on:
        k = on[0]
        contour = contour[k:] + contour[:k]
        pen.moveTo(contour[0][0])
        i = 1
        pending = []
        while i < len(contour):
            pt, oc = contour[i]
            if oc:
                if not pending:
                    pen.lineTo(pt)
                else:
                    pen.qCurveTo(*pending, pt)
                    pending = []
            else:
                pending.append(pt)
            i += 1
        if pending:
            pen.qCurveTo(*pending, contour[0][0])
        pen.closePath()
    else:
        pen.qCurveTo(*[p for p, _ in contour], None)
        pen.closePath()


def build(src="fonts/Marcellus.ttf", dst="fonts/Trikonam-Wordmark.ttf"):
    font = TTFont(src)
    log = []
    for ch, ov in (("A", 22), ("M", 16), ("N", 0)):
        if ov == 0:
            continue
        ok, msg = sharpen_apex(font, ch, ov)
        log.append(("ok  " if ok else "skip ") + msg)
    font.save(dst)
    return dst, log


if __name__ == "__main__":
    dst, log = build()
    print("wrote", dst)
    for l in log:
        print(" ", l)
