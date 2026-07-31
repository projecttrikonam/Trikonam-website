"""
applied.py — real, laid-out artwork for web, social, and stationery.

Nothing here is a resized logo dropped on a rectangle: each piece is composed for
the frame it lives in, with the clear space the manual specifies.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import brand as B, lockups as L
import textlayout as T
from textlayout import FRAUNCES, FRAUNCES_L, KARLA, KARLA_M, WORDMARK
from brand import PALETTE as P

INK = P["forest"][0]; IVORY = P["ivory"][0]; SAND = P["sand"][0]
TEXT = P["espresso"][0]; MOSS = P["moss"][0]; GOLD = P["gold"][0]
RULE = P["border"][0]; MUTED = "#5F564B"; WHITE = P["white"][0]


def _fit(svg, x, y, w, h, align="center"):
    import re
    m = re.search(r'viewBox="([-\d. ]+)"', svg)
    vx, vy, vw, vh = [float(v) for v in m.group(1).split()]
    s = min(w / vw, h / vh)
    inner = svg.split(">", 1)[1].rsplit("</svg>", 1)[0]
    ox = 0.0 if align == "left" else (w - vw * s) / 2
    tx = x + ox - vx * s
    ty = y + (h - vh * s) / 2 - vy * s
    return f'<g transform="translate({tx:.2f},{ty:.2f}) scale({s:.5f})">{inner}</g>'


def canvas(w, h, body, bg=IVORY):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" '
            f'viewBox="0 0 {w} {h}"><rect width="{w}" height="{h}" fill="{bg}"/>'
            f'{body}</svg>')


# ---------------------------------------------------------------- web
def web_header(w=1440, h=96, bg=IVORY, ink=INK):
    lock, _, _ = L.render("horizontal", ink=ink, pad=0.0)
    b = _fit(lock, 48, 22, 300, 52, "left")
    nav = ["PRACTICES", "PROGRAMS", "TEACHERS", "JOURNAL"]
    x = w - 430
    for n in nav:
        g, adv = T.draw(KARLA_M, n, 11.5, x, h / 2 + 4, ink, tracking=1.7)
        b += g
        x += adv + 34
    b += f'<line x1="0" y1="{h-1}" x2="{w}" y2="{h-1}" stroke="{RULE}" stroke-width="1"/>'
    return canvas(w, h, b, bg)


def web_footer(w=1440, h=220, bg=INK, ink=IVORY):
    lock, _, _ = L.render("horizontal", ink=ink, pad=0.0)
    b = _fit(lock, 48, 46, 280, 50, "left")
    g, _ = T.paragraph(KARLA, "A school of classical Hatha Yoga.", 13, 48, 140, 300,
                       1.6, ink)
    b += g
    cols = [("PRACTICE", ["Asana", "Pranayama", "Kriya", "Meditation"]),
            ("SCHOOL", ["About", "Teachers", "Journal", "Contact"])]
    x = w - 520
    for title, items in cols:
        b += T.draw(KARLA_M, title, 10.5, x, 62, ink, tracking=2.0, opacity=0.65)[0]
        yy = 92
        for it in items:
            b += T.draw(KARLA, it, 12.5, x, yy, ink, opacity=0.85)[0]
            yy += 24
        x += 230
    b += (f'<line x1="48" y1="{h-56}" x2="{w-48}" y2="{h-56}" stroke="{ink}" '
          f'stroke-width="1" opacity="0.18"/>')
    b += T.draw(KARLA, "(c) Trikonam. All rights reserved.", 11, 48, h - 28, ink,
                opacity=0.6)[0]
    return canvas(w, h, b, bg)


def web_nav_compact(w=420, h=72, bg=IVORY, ink=INK):
    lock, _, _ = L.render("horizontal", ink=ink, pad=0.0)
    return canvas(w, h, _fit(lock, 20, 14, 250, 44, "left"), bg)


def loading(w=800, h=800, bg=IVORY, ink=INK, animated=True):
    seal, _, _ = L.render("seal", ink=ink, pad=0.0)
    b = _fit(seal, w / 2 - 90, h / 2 - 130, 180, 180)
    b += T.draw(WORDMARK, "TRIKONAM", 20, w / 2, h / 2 + 118, ink,
                tracking=20 * 0.155, anchor="middle")[0]
    if animated:
        b = (f'<g><animate attributeName="opacity" values="0.35;1;0.35" dur="2.6s" '
             f'repeatCount="indefinite"/>{b}</g>')
    return canvas(w, h, b, bg)


def open_graph(w=1200, h=630, bg=IVORY, ink=INK, sub="Classical Hatha Yoga"):
    b = f'<rect width="{w}" height="{h}" fill="{bg}"/>'
    lock, _, _ = L.render("primary", ink=ink, pad=0.0)
    b += _fit(lock, w / 2 - 150, 120, 300, 300)
    b += T.draw(KARLA_M, sub.upper(), 17, w / 2, 512, MOSS if bg == IVORY else ink,
                tracking=4.2, anchor="middle")[0]
    b += (f'<line x1="{w/2-90}" y1="546" x2="{w/2+90}" y2="546" stroke="{RULE}" '
          f'stroke-width="1"/>')
    return canvas(w, h, b, bg)


def twitter_card(w=1200, h=628, **kw):
    return open_graph(w, h, **kw)


# ---------------------------------------------------------------- social
def avatar(size=1000, bg=IVORY, ink=INK, circular=True, k=1.85):
    d = B.seal_path(size / 2, size * 0.715, k * size / 1000.0)
    shape = (f'<circle cx="{size/2}" cy="{size/2}" r="{size/2}" fill="{bg}"/>'
             if circular else f'<rect width="{size}" height="{size}" fill="{bg}"/>')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" '
            f'viewBox="0 0 {size} {size}">{shape}'
            f'<path d="{d}" fill="{ink}" fill-rule="evenodd"/></svg>')


def banner(w, h, bg=INK, ink=IVORY, safe=None, tagline="CLASSICAL HATHA YOGA"):
    b = ""
    lock, _, _ = L.render("primary", ink=ink, pad=0.0)
    lh = min(h * 0.46, 320)
    b += _fit(lock, w / 2 - lh * 0.5, h / 2 - lh * 0.62, lh, lh)
    b += T.draw(KARLA_M, tagline, max(11, h * 0.022), w / 2, h / 2 + lh * 0.52, ink,
                tracking=h * 0.006, anchor="middle", opacity=0.8)[0]
    return canvas(w, h, b, bg)


# ---------------------------------------------------------------- stationery
def letterhead(w=1240, h=1754, bg=IVORY):       # A4 at 150dpi
    lock, _, _ = L.render("horizontal", ink=INK, pad=0.0)
    b = _fit(lock, 110, 96, 300, 54, "left")
    b += (f'<line x1="110" y1="200" x2="{w-110}" y2="200" stroke="{RULE}" '
          f'stroke-width="1"/>')
    b += (f'<line x1="110" y1="{h-150}" x2="{w-110}" y2="{h-150}" stroke="{RULE}" '
          f'stroke-width="1"/>')
    foot = "projecttrikonam@gmail.com          trikonam.com"
    b += T.draw(KARLA, foot, 11.5, 110, h - 118, MUTED, tracking=0.4)[0]
    wm, _, _ = L.render("watermark", ink=INK, pad=0.0)
    b += _fit(wm, w - 420, h - 640, 320, 420)
    return canvas(w, h, b, bg)


def invoice(w=1240, h=1754, bg=IVORY):
    lock, _, _ = L.render("horizontal", ink=INK, pad=0.0)
    b = _fit(lock, 110, 96, 280, 50, "left")
    b += T.draw(FRAUNCES, "Invoice", 40, w - 110, 150, INK, anchor="end")[0]
    b += (f'<line x1="110" y1="210" x2="{w-110}" y2="210" stroke="{RULE}" '
          f'stroke-width="1"/>')
    heads = ["DESCRIPTION", "QTY", "RATE", "AMOUNT"]
    xs = [110, w - 520, w - 360, w - 200]
    for hh, x in zip(heads, xs):
        b += T.draw(KARLA_M, hh, 10.5, x, 300, MOSS, tracking=1.9)[0]
    b += (f'<line x1="110" y1="320" x2="{w-110}" y2="320" stroke="{RULE}" '
          f'stroke-width="1"/>')
    for i in range(6):
        yy = 372 + i * 46
        b += (f'<line x1="110" y1="{yy+14}" x2="{w-110}" y2="{yy+14}" stroke="{RULE}" '
              f'stroke-width="0.6" opacity="0.7"/>')
    b += T.draw(KARLA_M, "TOTAL", 12, w - 360, 700, INK, tracking=1.6)[0]
    b += (f'<line x1="110" y1="{h-150}" x2="{w-110}" y2="{h-150}" stroke="{RULE}" '
          f'stroke-width="1"/>')
    b += T.draw(KARLA, "projecttrikonam@gmail.com", 11.5, 110, h - 118, MUTED)[0]
    return canvas(w, h, b, bg)


def email_signature(w=560, h=150, bg=IVORY):
    lock, _, _ = L.render("horizontal", ink=INK, pad=0.0)
    b = _fit(lock, 18, 20, 210, 40, "left")
    b += (f'<line x1="18" y1="82" x2="{w-18}" y2="82" stroke="{RULE}" stroke-width="1"/>')
    b += T.draw(KARLA_M, "TRIKONAM", 12, 18, 108, INK, tracking=1.6)[0]
    b += T.draw(KARLA, "Classical Hatha Yoga", 11.5, 18, 128, MUTED)[0]
    b += T.draw(KARLA, "projecttrikonam@gmail.com", 11.5, 250, 108, MOSS)[0]
    b += T.draw(KARLA, "trikonam.com", 11.5, 250, 128, MUTED)[0]
    return canvas(w, h, b, bg)


def certificate(w=1754, h=1240, bg=IVORY):      # A4 landscape at 150dpi
    b = (f'<rect x="52" y="52" width="{w-104}" height="{h-104}" fill="none" '
         f'stroke="{INK}" stroke-width="2"/>'
         f'<rect x="68" y="68" width="{w-136}" height="{h-136}" fill="none" '
         f'stroke="{INK}" stroke-width="0.8"/>')
    lock, _, _ = L.render("primary", ink=INK, pad=0.0)
    b += _fit(lock, w / 2 - 110, 130, 220, 250)
    b += T.draw(FRAUNCES_L, "Certificate of Completion", 46, w / 2, 470, INK,
                anchor="middle")[0]
    b += T.draw(KARLA, "This is to certify that", 14, w / 2, 540, MUTED,
                anchor="middle")[0]
    b += (f'<line x1="{w/2-300}" y1="640" x2="{w/2+300}" y2="640" stroke="{RULE}" '
          f'stroke-width="1"/>')
    b += T.draw(KARLA, "has completed the programme of study in classical Hatha Yoga",
                14, w / 2, 690, MUTED, anchor="middle")[0]
    st, _, _ = L.render("stamp", ink=INK, pad=0.0)
    b += _fit(st, w - 400, h - 400, 190, 190)
    for lx in (w / 2 - 420, w / 2 + 120):
        b += (f'<line x1="{lx}" y1="{h-250}" x2="{lx+300}" y2="{h-250}" '
              f'stroke="{RULE}" stroke-width="1"/>')
    b += T.draw(KARLA_M, "DATE", 10.5, w / 2 - 420, h - 222, MOSS, tracking=1.9)[0]
    b += T.draw(KARLA_M, "SIGNED", 10.5, w / 2 + 120, h - 222, MOSS, tracking=1.9)[0]
    return canvas(w, h, b, bg)


def presentation_cover(w=1920, h=1080, bg=INK, ink=IVORY):
    lock, _, _ = L.render("primary", ink=ink, pad=0.0)
    b = _fit(lock, 150, h / 2 - 190, 260, 380, "left")
    b += T.draw(FRAUNCES_L, "Classical Hatha Yoga", 62, 520, h / 2 - 30, ink)[0]
    b += T.draw(KARLA, "Foundations of practice", 22, 520, h / 2 + 30, ink,
                opacity=0.72)[0]
    b += (f'<line x1="520" y1="{h/2+80}" x2="1200" y2="{h/2+80}" stroke="{ink}" '
          f'stroke-width="1" opacity="0.25"/>')
    b += T.draw(KARLA_M, "TRIKONAM", 13, 520, h / 2 + 128, ink, tracking=3.4,
                opacity=0.6)[0]
    return canvas(w, h, b, bg)


def presentation_divider(w=1920, h=1080, bg=SAND, ink=INK):
    b = _fit(L.render("symbol", ink=ink, pad=0.0)[0], w / 2 - 90, h / 2 - 150, 180, 240)
    return canvas(w, h, b, bg)
