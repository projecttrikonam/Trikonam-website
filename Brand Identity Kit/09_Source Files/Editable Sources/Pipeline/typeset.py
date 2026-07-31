"""
typeset.py — text -> outlined SVG path, with variable-axis instancing,
uniform tracking and per-pair optical spacing overrides.

This is the wordmark engine: everything it emits is real outlines, so the
final logo never depends on a font being installed.
"""
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.recordingPen import RecordingPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.misc.transform import Transform
import uharfbuzz as hb
import os, io


class Face:
    def __init__(self, path, axes=None):
        self.path = path
        font = TTFont(path)
        if axes and "fvar" in font:
            font = instancer.instantiateVariableFont(font, axes, inplace=False,
                                                     updateFontNames=False)
        self.font = font
        self.upem = font["head"].unitsPerEm
        self.gs = font.getGlyphSet()
        # a harfbuzz face over the (possibly instanced) binary
        buf = io.BytesIO()
        font.save(buf)
        self.blob_bytes = buf.getvalue()
        self.hbface = hb.Face(self.blob_bytes)
        self.hbfont = hb.Font(self.hbface)
        os_2 = font["OS/2"]
        self.cap_height = getattr(os_2, "sCapHeight", None) or int(0.7 * self.upem)

    def shape(self, text, features=None):
        buf = hb.Buffer()
        buf.add_str(text)
        buf.guess_segment_properties()
        hb.shape(self.hbfont, buf, features or {})
        names = self.font.getGlyphOrder()
        out = []
        for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
            out.append((names[info.codepoint], pos.x_advance, pos.x_offset))
        return out


def typeset(face: Face, text, cap_height_units=700.0,
            tracking=0.0, pair_adjust=None, glyph_scale=None):
    """
    Returns (svg_path_d, advance_width, ink_bbox) in a coordinate space where
    the cap height equals `cap_height_units` and y grows DOWNWARD, baseline y=0.

    tracking      : uniform letterspacing, in the same units as cap_height_units
                    (i.e. already in output units, not font units).
    pair_adjust   : {"KO": -12, ...} extra space after the pair's first glyph,
                    in output units. This is the optical-spacing layer.
    glyph_scale   : {index: (sx, sy)} per-glyph scaling, for custom refinements.
    """
    pair_adjust = pair_adjust or {}
    glyph_scale = glyph_scale or {}
    # scale so that cap height maps to cap_height_units
    s = cap_height_units / face.cap_height
    shaped = face.shape(text)

    pen_out = SVGPathPen(face.gs, ntos=lambda v: f"{v:.2f}")
    x = 0.0
    for i, (gname, adv, xoff) in enumerate(shaped):
        gsx, gsy = glyph_scale.get(i, (1.0, 1.0))
        # y-flip (font y-up -> svg y-down), scale to output units
        t = Transform(s * gsx, 0, 0, -s * gsy, x + xoff * s, 0)
        tp = TransformPen(pen_out, t)
        face.gs[gname].draw(tp)
        x += adv * s * gsx + tracking
        if i + 1 < len(shaped):
            key = text[i] + text[i + 1]
            x += pair_adjust.get(key, 0.0)
    total = x - tracking  # trailing tracking is not part of the word

    # ink bounds
    bp = BoundsPen(face.gs)
    x2 = 0.0
    for i, (gname, adv, xoff) in enumerate(shaped):
        gsx, gsy = glyph_scale.get(i, (1.0, 1.0))
        t = Transform(s * gsx, 0, 0, -s * gsy, x2 + xoff * s, 0)
        face.gs[gname].draw(TransformPen(bp, t))
        x2 += adv * s * gsx + tracking
        if i + 1 < len(shaped):
            bp_key = text[i] + text[i + 1]
            x2 += pair_adjust.get(bp_key, 0.0)
    return pen_out.getCommands(), total, bp.bounds


def path_bounds(d):
    """Crude bbox of an SVG path 'd' by sampling its numbers is unreliable;
    callers should use the bbox typeset() returns."""
    raise NotImplementedError
