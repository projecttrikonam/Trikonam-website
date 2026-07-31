"""
textlayout.py — set text as OUTLINES for the print-ready PDF.

The manual's PDF must not depend on a font being installed at the printer, so
every character in it is drawn as a filled path. This wraps the typeset engine
with word-measuring and greedy line breaking.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from typeset import Face, typeset

_CACHE = {}


def face(path, axes=None):
    key = (path, tuple(sorted((axes or {}).items())))
    if key not in _CACHE:
        _CACHE[key] = Face(os.path.join(os.path.dirname(os.path.abspath(__file__)), path), axes)
    return _CACHE[key]


FRAUNCES = ("fonts/Fraunces-VF.ttf", {"opsz": 144, "wght": 400, "SOFT": 0, "WONK": 0})
FRAUNCES_L = ("fonts/Fraunces-VF.ttf", {"opsz": 144, "wght": 300, "SOFT": 0, "WONK": 0})
KARLA = ("fonts/Karla-VF.ttf", {"wght": 400})
KARLA_M = ("fonts/Karla-VF.ttf", {"wght": 500})
WORDMARK = ("fonts/Trikonam-Wordmark.ttf", None)


def measure(f, text, size, tracking=0.0):
    """Advance width of `text` at cap-height-normalised `size`."""
    if not text:
        return 0.0
    fc = face(*f)
    d, adv, bb = typeset(fc, text, size, tracking)
    return adv


def draw(f, text, size, x, y, fill="#000", tracking=0.0, anchor="start", opacity=None):
    """One line of outlined text. `y` is the BASELINE."""
    if not text:
        return "", 0.0
    fc = face(*f)
    d, adv, bb = typeset(fc, text, size, tracking)
    dx = {"start": 0.0, "middle": -adv / 2, "end": -adv}[anchor]
    op = f' opacity="{opacity}"' if opacity is not None else ""
    return (f'<g transform="translate({x+dx:.2f},{y:.2f})">'
            f'<path d="{d}" fill="{fill}"{op}/></g>'), adv


def wrap(f, text, size, width, tracking=0.0):
    """Greedy line breaking. Returns a list of lines."""
    words = text.split()
    lines, cur = [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if measure(f, trial, size, tracking) <= width or not cur:
            cur = trial
        else:
            lines.append(cur); cur = w
    if cur:
        lines.append(cur)
    return lines


def paragraph(f, text, size, x, y, width, leading=1.55, fill="#000",
              tracking=0.0, gap_after=0.0):
    """Wrapped, outlined paragraph. Returns (svg, y_after_last_baseline)."""
    out = []
    lines = wrap(f, text, size, width, tracking)
    yy = y
    for ln in lines:
        g, _ = draw(f, ln, size, x, yy, fill, tracking)
        out.append(g)
        yy += size * leading
    return "".join(out), yy - size * leading + gap_after


def bullets(f, items, size, x, y, width, leading=1.55, fill="#000",
            marker_fill=None, indent=None):
    indent = indent if indent is not None else size * 1.15
    out, yy = [], y
    for it in items:
        g, _ = draw(KARLA, "-", size, x, yy, marker_fill or fill)
        out.append(g)
        g2, yy2 = paragraph(f, it, size, x + indent, yy, width - indent, leading, fill)
        out.append(g2)
        yy = yy2 + size * leading
    return "".join(out), yy
