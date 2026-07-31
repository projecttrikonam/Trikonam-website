"""build_manual.py — the Trikonam brand manual, generated from the identity itself."""
import base64, os, sys, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import brand as B, lockups as L, diagrams as D
from brand import PALETTE as P

OUT = sys.argv[1] if len(sys.argv) > 1 else "trikonam-brand-manual.html"


def b64(path):
    return base64.b64encode(open(path, "rb").read()).decode()


FONTS = {k: b64(f"webfonts/{v}") for k, v in
         {"fraunces": "fraunces.woff2", "frauncesl": "fraunces-l.woff2",
          "karla": "karla.woff2", "karla5": "karla5.woff2",
          "wordmark": "wordmark.woff2"}.items()}


def cmyk(hexs):
    r, g, b = (int(hexs[i:i + 2], 16) / 255 for i in (1, 3, 5))
    k = 1 - max(r, g, b)
    if k >= 1:
        return (0, 0, 0, 100)
    c = (1 - r - k) / (1 - k); m = (1 - g - k) / (1 - k); y = (1 - b - k) / (1 - k)
    return tuple(round(v * 100) for v in (c, m, y, k))


def rgb(hexs):
    return tuple(int(hexs[i:i + 2], 16) for i in (1, 3, 5))


PANTONE = {
    "forest": "5605 C", "espresso": "Neutral Black C", "stone": "Warm Gray 11 C",
    "moss": "5757 C",
    "mossdark": "5605 C", "gold": "730 C", "goldleaf": "872 C (metallic)",
    "ivory": "9184 C", "sand": "9224 C", "border": "9225 C",
    "white": "—", "black": "Process Black C",
}

ORDER = ["forest", "espresso", "stone", "moss", "mossdark", "gold", "goldleaf",
         "sand", "ivory", "border"]


def swatches():
    out = []
    for k in ORDER:
        hexs, name, role = P[k]
        r, g, bl = rgb(hexs)
        c, m, y, kk = cmyk(hexs)
        light = k in ("ivory", "sand", "border")
        out.append(f'''<div class="sw">
<div class="sw-chip" style="background:{hexs};{'border:1px solid var(--rule)' if light else ''}"></div>
<div class="sw-body">
<h4>{name}</h4><p class="sw-role">{role}</p>
<dl><dt>HEX</dt><dd>{hexs}</dd><dt>RGB</dt><dd>{r} {g} {bl}</dd>
<dt>CMYK</dt><dd>{c} {m} {y} {kk}</dd><dt>PANTONE</dt><dd>{PANTONE[k]}</dd></dl>
</div></div>''')
    return "".join(out)


def plate(name, label, note="", ink=None, ground=None, cls="", **kw):
    svg, vb, cap = L.render(name, ink=ink or P["forest"][0],
                            pad=0.0 if name in ("seal", "app-icon", "social-profile") else 0.06,
                            **({"ground": ground} if ground else {}), **kw)
    note_html = '<span class="plate-note">' + note + '</span>' if note else ''
    return ('<figure class="plate ' + cls + '"><div class="plate-art">' + svg + '</div>'
            '<figcaption><span class="plate-label">' + label + '</span>'
            + note_html + '</figcaption></figure>')


MISUSE_HTML = "".join(
    f'<figure class="dont"><div class="dont-art">{D.misuse_tile(kind)}</div>'
    f'<figcaption>{label}</figcaption></figure>' for label, kind in D.MISUSE)

CSS = """
:root{
  --ground:#FAF7EF; --ground-alt:#EFE7D6; --surface:#FFFFFF;
  --ink:#2F3A2A; --text:#2A2620; --text-soft:#5F564B;
  --moss:#5B6B4E; --gold:#8A6230; --rule:#E2D9C6;
  --measure:64ch;
}
@media (prefers-color-scheme:dark){
  :root{
    --ground:#20271D; --ground-alt:#28311F; --surface:#2A3325;
    --ink:#E9E3D4; --text:#EDE7DA; --text-soft:#B3AC9A;
    --moss:#9FB088; --gold:#C69A5C; --rule:#3B4534;
  }
}
:root[data-theme="dark"]{
  --ground:#20271D; --ground-alt:#28311F; --surface:#2A3325;
  --ink:#E9E3D4; --text:#EDE7DA; --text-soft:#B3AC9A;
  --moss:#9FB088; --gold:#C69A5C; --rule:#3B4534;
}
:root[data-theme="light"]{
  --ground:#FAF7EF; --ground-alt:#EFE7D6; --surface:#FFFFFF;
  --ink:#2F3A2A; --text:#2A2620; --text-soft:#5F564B;
  --moss:#5B6B4E; --gold:#8A6230; --rule:#E2D9C6;
}
*{box-sizing:border-box}
body{margin:0;background:var(--ground);color:var(--text);
  font-family:Karla,system-ui,sans-serif;font-size:16px;line-height:1.75;
  -webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
h1,h2,h3,h4{font-family:Fraunces,Georgia,serif;font-weight:400;color:var(--ink);
  margin:0;text-wrap:balance;letter-spacing:-0.005em}
p{margin:0}
.wrap{max-width:1120px;margin:0 auto;padding:0 clamp(20px,5vw,64px)}

/* cover */
.cover{min-height:82vh;display:flex;flex-direction:column;justify-content:center;
  gap:48px;padding:88px 0 72px}
.cover-mark{width:min(240px,42vw)}
.cover-mark svg{width:100%;height:auto;display:block;color:var(--ink)}
.cover h1{font-size:clamp(2.4rem,6vw,4.1rem);line-height:1.02}
.cover .sub{font-size:clamp(1rem,1.6vw,1.15rem);color:var(--text-soft);max-width:46ch}
.meta{display:flex;flex-wrap:wrap;gap:8px 34px;padding-top:28px;
  border-top:1px solid var(--rule);font-size:.78rem;letter-spacing:.14em;
  text-transform:uppercase;color:var(--moss)}

/* sections */
section{padding:clamp(56px,8vw,104px) 0;border-top:1px solid var(--rule)}
.eyebrow{display:flex;align-items:center;gap:.7rem;font-weight:500;font-size:.78rem;
  letter-spacing:.17em;text-transform:uppercase;color:var(--moss);margin-bottom:20px}
.eyebrow::before{content:"";width:1.75rem;height:1px;background:currentColor;opacity:.55;
  flex:none}
section>.wrap>h2{font-size:clamp(1.6rem,3.2vw,2.3rem);max-width:22ch;margin-bottom:24px}
.lede{font-size:clamp(1.02rem,1.5vw,1.15rem);color:var(--text);max-width:var(--measure)}
.prose{max-width:var(--measure);display:flex;flex-direction:column;gap:18px;
  margin-top:26px;color:var(--text)}
.prose strong{font-weight:600;color:var(--ink)}
.note{color:var(--text-soft);font-size:.93rem}

/* plates */
.plates{display:grid;gap:26px;margin-top:44px;
  grid-template-columns:repeat(auto-fit,minmax(230px,1fr))}
.plate{margin:0;display:flex;flex-direction:column;gap:12px}
.plate-art{background:var(--ground-alt);border:1px solid var(--rule);border-radius:3px;
  padding:26px;display:flex;align-items:center;justify-content:center;min-height:190px}
.plate-art svg{width:100%;height:auto;max-height:210px;display:block}
.plate.tile .plate-art{padding:0;overflow:hidden;background:transparent;border:none}
.plate.tile .plate-art svg{max-height:none;border-radius:3px}
figcaption{display:flex;flex-direction:column;gap:3px}
.plate-label{font-size:.8rem;letter-spacing:.1em;text-transform:uppercase;color:var(--ink);
  font-weight:500}
.plate-note{font-size:.85rem;color:var(--text-soft);line-height:1.5}

/* figure: full-width technical drawing */
.figure{margin:44px 0 0;background:var(--ground-alt);border:1px solid var(--rule);
  border-radius:3px;padding:clamp(20px,4vw,48px)}
.figure svg{width:100%;height:auto;display:block}
.figure-cap{margin-top:18px;font-size:.88rem;color:var(--text-soft);max-width:60ch}
.fig-pair{display:grid;gap:26px;grid-template-columns:1fr;margin-top:44px}
@media(min-width:820px){.fig-pair{grid-template-columns:1.35fr 1fr}}
.fig-pair .figure{margin:0}

/* don'ts */
.donts{display:grid;gap:22px;margin-top:44px;
  grid-template-columns:repeat(auto-fit,minmax(190px,1fr))}
.dont{margin:0}
.dont-art{border:1px solid var(--rule);border-radius:3px;overflow:hidden;
  position:relative;background:#FAF7EF}
.dont-art svg{width:100%;height:auto;display:block}
.dont-art::after{content:"";position:absolute;inset:0;
  background:linear-gradient(to top left,transparent calc(50% - 0.7px),
    rgba(178,58,58,.62) calc(50% - 0.7px),rgba(178,58,58,.62) calc(50% + 0.7px),
    transparent calc(50% + 0.7px))}
.dont figcaption{margin-top:10px;font-size:.85rem;color:var(--text-soft);line-height:1.5}

/* colour */
.swatches{display:grid;gap:20px;margin-top:44px;
  grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}
.sw{display:flex;flex-direction:column;gap:14px}
.sw-chip{height:104px;border-radius:3px}
.sw-body h4{font-size:1.02rem;margin-bottom:2px}
.sw-role{font-size:.83rem;color:var(--text-soft);margin-bottom:10px;line-height:1.45}
.sw dl{display:grid;grid-template-columns:auto 1fr;gap:2px 14px;margin:0;
  font-size:.78rem;font-variant-numeric:tabular-nums}
.sw dt{color:var(--moss);letter-spacing:.09em}
.sw dd{margin:0;color:var(--text-soft)}

/* type specimens */
.spec{border-top:1px solid var(--rule);padding-top:26px;margin-top:34px;
  display:grid;gap:8px}
.spec:first-of-type{border-top:none}
.spec-name{font-size:.78rem;letter-spacing:.14em;text-transform:uppercase;color:var(--moss)}
.spec-sample{color:var(--ink);line-height:1.12}
.s-wordmark{font-family:TrikonamWordmark,serif;font-size:clamp(2rem,6vw,3.6rem);
  letter-spacing:.155em}
.s-display{font-family:Fraunces,serif;font-size:clamp(1.8rem,5vw,3rem)}
.s-body{font-family:Karla,sans-serif;font-size:clamp(1.4rem,3.4vw,2rem)}
.spec-note{font-size:.88rem;color:var(--text-soft);max-width:56ch}
.scale{width:100%;border-collapse:collapse;margin-top:34px;font-size:.9rem}
.scale th,.scale td{text-align:left;padding:11px 14px;border-bottom:1px solid var(--rule);
  vertical-align:top}
.scale th{font-size:.72rem;letter-spacing:.13em;text-transform:uppercase;color:var(--moss);
  font-weight:500}
.scale td:first-child{color:var(--ink);white-space:nowrap}
.scale td{color:var(--text-soft)}
.tw{overflow-x:auto}

/* backgrounds */
.grounds{display:grid;gap:0;margin-top:44px;border:1px solid var(--rule);border-radius:3px;
  overflow:hidden;grid-template-columns:repeat(auto-fit,minmax(160px,1fr))}
.ground-cell{aspect-ratio:1;display:flex;align-items:center;justify-content:center;padding:22px}
.ground-cell svg{width:100%;height:auto;max-height:100%}
.ground-cap{grid-column:1/-1;padding:14px 18px;font-size:.85rem;color:var(--text-soft);
  border-top:1px solid var(--rule);background:var(--ground)}

/* index */
.idx{width:100%;border-collapse:collapse;margin-top:34px;font-size:.9rem}
.idx th,.idx td{text-align:left;padding:10px 14px;border-bottom:1px solid var(--rule)}
.idx th{font-size:.72rem;letter-spacing:.13em;text-transform:uppercase;color:var(--moss);
  font-weight:500}
.idx td{color:var(--text-soft)}
.idx td code{font-family:ui-monospace,Menlo,monospace;font-size:.85em;color:var(--ink)}
footer{padding:60px 0 80px;border-top:1px solid var(--rule);color:var(--text-soft);
  font-size:.85rem}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
"""


def font_face():
    return f"""
@font-face{{font-family:Fraunces;src:url(data:font/woff2;base64,{FONTS['fraunces']}) format('woff2');
  font-weight:400;font-display:swap}}
@font-face{{font-family:Fraunces;src:url(data:font/woff2;base64,{FONTS['frauncesl']}) format('woff2');
  font-weight:300;font-display:swap}}
@font-face{{font-family:Karla;src:url(data:font/woff2;base64,{FONTS['karla']}) format('woff2');
  font-weight:400;font-display:swap}}
@font-face{{font-family:Karla;src:url(data:font/woff2;base64,{FONTS['karla5']}) format('woff2');
  font-weight:500;font-display:swap}}
@font-face{{font-family:TrikonamWordmark;src:url(data:font/woff2;base64,{FONTS['wordmark']}) format('woff2');
  font-weight:400;font-display:swap}}
"""


FOREST, IVORY, SAND, ESP, MOSS, GOLD = (P["forest"][0], P["ivory"][0], P["sand"][0],
                                        P["espresso"][0], P["moss"][0], P["gold"][0])

cover_svg, _, _ = L.render("primary", ink="currentColor", pad=0.04)

HTML = f"""<title>Trikonam — Brand Identity Manual</title>
<style>{font_face()}{CSS}</style>

<div class="wrap">
<header class="cover">
  <div class="cover-mark">{cover_svg}</div>
  <div>
    <h1>Brand Identity Manual</h1>
    <p class="sub">The master logo system for Trikonam — a school of classical Hatha Yoga.
    One construction, drawn once, expressed at every size and in every medium.</p>
  </div>
  <div class="meta"><span>Version 1.0</span><span>Master logo system</span>
  <span>Trikonam</span></div>
</header>
</div>

<section id="mark"><div class="wrap">
  <p class="eyebrow">01 — The mark</p>
  <h2>A figure, a triangle, and a flower opening at the top of a breath</h2>
  <p class="lede">The symbol is a single practitioner in Trikonasana, the triangle posture
  the school is named for, with a lotus opening from the raised hand.</p>
  <div class="prose">
    <p>Everything the brand believes is already in the drawing. The two legs and the ground
    make a triangle — <strong>sthira</strong>, steadiness, the part of the practice that does
    not move. Rising from it, on a single vertical, is the extended arm and the lotus —
    <strong>sukha</strong>, ease, the part that opens. The mark is that relationship: nothing
    rises without a base.</p>
    <p>It is drawn as one continuous weight of line, the way a posture is held at one
    continuous effort. There is no ornament, no shading, no flourish. At large sizes a
    delicate profile and a hair knot appear; at small sizes they quietly withdraw and the
    silhouette carries. That is deliberate — the mark is meant to be <strong>quiet before it
    is memorable</strong>, and to keep working long after the novelty of any style has passed.</p>
    <p class="note">The master artwork is a refined reconstruction of the founding drawing.
    Its proportions, gesture and character are unchanged; what has changed is that every
    curve is now built on a stated geometry, so the mark can be reproduced exactly, at any
    size, forever.</p>
  </div>
</div></section>

<section id="construction"><div class="wrap">
  <p class="eyebrow">02 — Construction</p>
  <h2>The geometry was already in the drawing. It has been made exact.</h2>
  <p class="lede">The mark stands on an <strong>11 × 14 module field</strong>. Three
  relationships govern it, and all three were measured from the original artwork rather
  than imposed on it.</p>
  <div class="figure">{D.construction()}
    <p class="figure-cap">The master field, one module = u. The ascending axis falls on the
    quarter line, 11u ÷ 4. The earth triangle's height is its base × 0.382 — the golden
    section squared, measured at 0.3818 against a true 0.38197.</p>
  </div>
  <div class="fig-pair">
    <div class="figure">{D.lotus_construction()}
      <p class="figure-cap">Five petals on the ascending axis at 0°, ±35° and ±62°. Each is a
      true vesica — two circular arcs struck between the base point and the tip — and the
      left half is an exact mirror of the right.</p>
    </div>
    <div class="prose" style="margin-top:0">
      <p><strong>The field.</strong> 11 wide by 14 high. Every element is positioned against
      this grid, never by eye.</p>
      <p><strong>The axis.</strong> The lotus and the raised arm share one vertical, standing
      on the field's quarter line.</p>
      <p><strong>The triangle.</strong> The legs and the earth line form the mark's base. Its
      height is the golden section squared of its width — the proportion that makes it feel
      settled rather than merely wide.</p>
      <p class="note">Stroke weight is uniform at 0.89% of the mark's height. The skull and the
      hair knot are true circles. Nothing in the mark is approximate.</p>
    </div>
  </div>
</div></section>

<section id="system"><div class="wrap">
  <p class="eyebrow">03 — The logo system</p>
  <h2>One mark, eleven approved configurations</h2>
  <p class="lede">Choose by the space available, never by preference. If a lockup is not
  shown here, it does not exist.</p>
  <div class="plates">
    {plate("primary","Primary","The default. Use wherever there is room.")}
    {plate("horizontal","Horizontal","Headers, signage, e-mail signatures.")}
    {plate("symbol","Symbol","Once the wordmark is established nearby.")}
    {plate("wordmark","Wordmark","Where the symbol would be too small to read.")}
    {plate("square","Square","Fixed square frames.")}
    {plate("circular","Roundel","Stamps, badges, circular crops.")}
    {plate("stamp","Seal / stamp","Certificates and completion documents.")}
    {plate("seal","Reduced mark","Below 18 mm. The petals, filled.")}
    {plate("app-icon","App icon",'Tile artwork; never crop it.',ink=IVORY,ground=FOREST,cls="tile")}
    {plate("social-profile","Social avatar","Circular crops on every platform.",ink=FOREST,ground=IVORY,cls="tile")}
    {plate("watermark","Watermark","10% ink. Behind text, never over it.")}
  </div>
  <div class="figure">{{WEIGHTS}}
    <p class="figure-cap">Two optical cuts of one drawing. The Display stroke is 0.89% of the
    symbol's height; the Compact stroke is 1.43%. Nothing else changes &mdash; the geometry,
    the proportions and the curves are identical. Below 140&nbsp;px of symbol height the
    Display stroke falls under a single device pixel and the mark greys out; the Compact cut
    is drawn for exactly that range.</p>
  </div>
  <div class="prose">
    <p class="note"><strong>On the reduced mark.</strong> A line as fine as this one cannot
    survive a favicon; below roughly 64 px it turns to grey mist. Rather than thicken the
    figure until it is a different drawing, the mark reduces to its flower — the same five
    vesica petals, filled, with the overlaps knocked out. It is the same construction, not a
    second logo.</p>
  </div>
</div></section>

<section id="space"><div class="wrap">
  <p class="eyebrow">04 — Clear space and minimum size</p>
  <h2>The mark needs air, and it needs a floor</h2>
  <div class="fig-pair">
    <div class="figure">{D.clear_space()}
      <p class="figure-cap"><strong>X is the height of the lotus</strong> — 0.136 of the
      symbol's height, in whatever size the mark is being used. One rule for every lockup, so
      the margin reads as equal across the whole set. For the wordmark alone, X is its cap
      height. Nothing — type, image, rule or edge of page — may enter this zone.</p>
    </div>
    <div class="prose" style="margin-top:0">
      <p>Clear space is a minimum, not a target. Where the layout allows, give the mark more.
      Crowding it is the fastest way to make a restrained identity look cheap.</p>
      <p><strong>Never</strong> place the logo in a coloured box purely to separate it from a
      background. Change the colourway instead.</p>
    </div>
  </div>
  <div class="figure">{D.min_size()}
    <p class="figure-cap">Minimum reproduction sizes, each in the optical cut it is approved
    in. Below these, step down to the next lockup — the primary gives way to the horizontal,
    the horizontal to the symbol, the symbol to the reduced mark.</p>
  </div>
</div></section>

<section id="misuse"><div class="wrap">
  <p class="eyebrow">05 — Incorrect usage</p>
  <h2>Eight things that undo the work</h2>
  <p class="lede">The logo is supplied as vector artwork for exactly one reason: so it never
  has to be redrawn, retyped or approximated.</p>
  <div class="donts">{MISUSE_HTML}</div>
</div></section>

<section id="colour"><div class="wrap">
  <p class="eyebrow">06 — Colour</p>
  <h2>Forest Ink, and the palette it belongs to</h2>
  <p class="lede">The logo's ink is <strong>Forest Ink</strong> — the school's moss accent
  taken to its darkest value. It reads as near-black, carries a trace of green, and is at
  home on warm ivory in a way a true navy never is.</p>
  <div class="prose">
    <p class="note">The founding artwork was drawn in navy. Against the warm ivory ground of
    the identity, a cool blue reads corporate and sits at odds with an earthy palette; it
    also belonged to no part of the existing system. Forest Ink keeps the mark's depth and
    authority, joins the palette that already exists, and — unlike espresso — gives the brand
    a dark ground worth printing on.</p>
  </div>
  <div class="swatches">{swatches()}</div>
  <div class="prose">
    <p class="note"><strong>CMYK values are unmanaged conversions</strong> and a starting
    point only — always proof on the actual stock. <strong>Pantone references are
    approximations</strong> and must be confirmed against a current physical guide before any
    spot-colour run.</p>
    <p class="note"><strong>Moss is a supporting colour.</strong> It is approved for the
    logo only in secondary applications; it does not carry enough weight to be the primary
    ink. <strong>Ochre Gold</strong> is for certificates, foil and accents — never for body
    text on ivory.</p>
  </div>
</div></section>

<section id="type"><div class="wrap">
  <p class="eyebrow">07 — Typography</p>
  <h2>A carved wordmark, a warm serif, and a quiet sans</h2>
  <p class="lede">Three roles, each with one face. The wordmark is drawn artwork and is never
  set as live type.</p>

  <div class="spec">
    <span class="spec-name">The wordmark — Marcellus, refined</span>
    <div class="spec-sample s-wordmark">TRIKONAM</div>
    <p class="spec-note">A Roman inscriptional capital: near-uniform stroke weight, so it
    shares the symbol's monoline rhythm rather than fighting it. Two refinements make it the
    brand's own — the letterspacing is optically measured pair by pair, not uniformly tracked,
    and <strong>the apexes of the A and M are drawn to a point</strong>, echoing the tips of
    the lotus petals. Always used as outlines.</p>
  </div>

  <div class="spec">
    <span class="spec-name">Primary — Fraunces</span>
    <div class="spec-sample s-display">Steadiness and ease</div>
    <p class="spec-note">Headings, titles, pull quotes. Regular and Light only — never bold.
    Already the voice of the website, so the identity and the site speak as one.</p>
  </div>

  <div class="spec">
    <span class="spec-name">Secondary — Karla</span>
    <div class="spec-sample s-body">Body text, labels and interface</div>
    <p class="spec-note">All running text, captions, navigation and small print. A humanist
    sans that stays legible at length and never competes with the display face. No accent
    typeface is required or permitted.</p>
  </div>

  <div class="tw"><table class="scale">
    <thead><tr><th>Role</th><th>Face</th><th>Treatment</th></tr></thead>
    <tbody>
      <tr><td>Display / H1</td><td>Fraunces Regular</td><td>Tight leading, −0.01em tracking, balanced wrap</td></tr>
      <tr><td>Headings</td><td>Fraunces Regular</td><td>Sentence case. Never all-caps, never bold</td></tr>
      <tr><td>Body</td><td>Karla Regular</td><td>16–18px, 1.7 leading, measure ≤ 65 characters</td></tr>
      <tr><td>Captions</td><td>Karla Regular</td><td>13–14px, secondary text colour</td></tr>
      <tr><td>Labels / eyebrows</td><td>Karla Medium</td><td>Uppercase, 0.16em tracking, moss</td></tr>
      <tr><td>Quotations</td><td>Fraunces Light Italic</td><td>No quotation marks; indent instead</td></tr>
      <tr><td>Presentations</td><td>Fraunces + Karla</td><td>One idea per slide; generous margins</td></tr>
      <tr><td>Brochures / print</td><td>Fraunces + Karla</td><td>Body 9.5–10.5pt, leading 1.6</td></tr>
    </tbody>
  </table></div>
</div></section>

<section id="grounds"><div class="wrap">
  <p class="eyebrow">08 — Backgrounds and photography</p>
  <h2>Where the mark may stand</h2>
  <div class="grounds">
    <div class="ground-cell" style="background:{IVORY}">{{plate_svg_ivory}}</div>
    <div class="ground-cell" style="background:{SAND}">{{plate_svg_sand}}</div>
    <div class="ground-cell" style="background:{FOREST}">{{plate_svg_rev}}</div>
    <div class="ground-cell" style="background:{ESP}">{{plate_svg_esp}}</div>
    <p class="ground-cap">Ivory and Sand take the mark in Forest Ink. Forest Ink and Espresso
    take it in Ivory. These four are the whole of it.</p>
  </div>
  <div class="prose">
    <p><strong>Over photography</strong>, use the white colourway, and only where the image is
    quiet — an even, unbusy area with no detail running through the mark. If the mark is not
    clearly legible at a glance, it is in the wrong place; move it, or put it on a plain panel
    beside the image rather than on top of it.</p>
    <p>The school's photography is warm, natural-light and unhurried. Do not add coloured
    overlays to force the logo to work. A gentle darkening of a quiet corner is acceptable;
    a heavy scrim is not.</p>
    <p class="note">Never place the logo over faces, hands, or the focal point of a posture.</p>
  </div>
</div></section>

<section id="access"><div class="wrap">
  <p class="eyebrow">09 — Accessibility</p>
  <h2>Legibility is part of the craft, not a constraint on it</h2>
  <div class="prose" style="margin-top:0">
    <p>Every approved logo pairing clears <strong>WCAG AA</strong> comfortably. Forest Ink on
    Ivory measures <strong>11.15:1</strong>; Ivory on Forest Ink is the same. Espresso on Ivory
    is 14.05:1.</p>
    <p><strong>Moss on Ivory is 5.36:1</strong> — sufficient for the logo and for large text,
    but it must not be used for small body copy. <strong>Ochre Gold is a fill colour</strong>:
    approved with ivory text on it, never as text on ivory.</p>
    <p>Wherever the logo carries meaning, give it a text alternative — <span class="note">alt
    text "Trikonam", or an empty alt where a visible wordmark already sits beside it.</span>
    Never rely on colour alone to distinguish one lockup from another.</p>
    <p class="note">The mark's meaning survives in one colour, so the identity is fully legible
    to viewers with any form of colour vision deficiency.</p>
  </div>
</div></section>

<section id="print"><div class="wrap">
  <p class="eyebrow">10 — Production, print</p>
  <h2>Paper, foil and die</h2>
  <div class="prose" style="margin-top:0">
    <p><strong>Always supply vector.</strong> PDF or SVG from the master library — never a
    PNG, never a placed screenshot, never artwork lifted from the website.</p>
    <p><strong>Foil and gilding.</strong> Supply the single-colour master as 100% K; the gold
    is the foil, not the artwork. Ochre Gold and Gold Leaf are on-screen references for
    matching a foil, not print colours.</p>
    <p><strong>Emboss, deboss and engraving.</strong> The Display stroke is too fine for a die
    or a graver. Use the reduced mark, or the symbol at no less than 18 mm. Minimum engraved
    stroke is 0.15 mm at final size.</p>
    <p><strong>Single-colour print.</strong> 100% K or one spot colour. Do not screen the ink
    back to make a "lighter" logo — use the watermark artwork, which is drawn for it.</p>
    <p class="note">On uncoated and recycled stock, expect dot gain to close fine apertures.
    Step up one lockup from the minimum size, and proof before committing to a run.</p>
  </div>
</div></section>

<section id="digital"><div class="wrap">
  <p class="eyebrow">11 — Production, digital</p>
  <h2>Screens, tabs and profiles</h2>
  <div class="prose" style="margin-top:0">
    <p><strong>Use SVG wherever the platform allows it.</strong> The master SVG carries its ink
    as <code>currentColor</code>, so a colourway is one CSS declaration and the mark can never
    drift out of step with its surroundings.</p>
    <p><strong>Favicons and app icons</strong> use the reduced mark, supplied from 16 px to
    512 px. Do not scale the primary lockup down to fill these slots.</p>
    <p><strong>Social profiles</strong> are cropped to a circle on every platform. Use the
    supplied avatar artwork, which is drawn with the margin that crop requires.</p>
    <p><strong>E-mail signatures</strong> use the horizontal lockup at 200 px wide, PNG at 2×
    for retina, with the ivory ground baked in — mail clients cannot be trusted with
    transparency or with dark mode.</p>
  </div>
</div></section>

<section id="index"><div class="wrap">
  <p class="eyebrow">12 — Asset library</p>
  <h2>What is supplied, and where it lives</h2>
  <div class="tw"><table class="idx">
    <thead><tr><th>Folder</th><th>Contents</th><th>Formats</th></tr></thead>
    <tbody>
      <tr><td><code>01-master-logo</code></td><td>Primary, horizontal, symbol, wordmark</td><td>SVG · PDF · PNG 1200 · PNG 4000</td></tr>
      <tr><td><code>02-variations</code></td><td>Square, roundel, stamp, watermark, reduced mark</td><td>SVG · PDF · PNG</td></tr>
      <tr><td><code>03-colourways</code></td><td>Eleven colourways of the core lockups</td><td>SVG · PDF · PNG</td></tr>
      <tr><td><code>04-icons</code></td><td>Favicons 16–512, app icons, social avatars</td><td>SVG · PNG</td></tr>
      <tr><td><code>05-print-production</code></td><td>Single-colour, foil, emboss, engraving masters</td><td>SVG · PDF</td></tr>
      <tr><td><code>06-brand-manual</code></td><td>This document, palette data</td><td>HTML · JSON</td></tr>
      <tr><td><code>07-source</code></td><td>Construction pipeline, wordmark font, reference art</td><td>Python · TTF · PNG</td></tr>
    </tbody>
  </table></div>
</div></section>

<footer><div class="wrap">
  <p>Trikonam — Brand Identity Manual, Version 1.0. The master artwork is the single source of
  truth; this document describes it. Where the two disagree, the artwork is right.</p>
</div></footer>
"""


def ground_cell(ink):
    svg, _, _ = L.render("primary", ink=ink, pad=0.05)
    return svg


HTML = HTML.replace("{plate_svg_ivory}", ground_cell(FOREST)) \
           .replace("{plate_svg_sand}", ground_cell(FOREST)) \
           .replace("{plate_svg_rev}", ground_cell(IVORY)) \
           .replace("{plate_svg_esp}", ground_cell(IVORY))

# emit pure ASCII with numeric character references, so the page renders
# identically no matter what charset the host declares
HTML = HTML.replace("{WEIGHTS}", D.weights())

open(OUT, "w", encoding="ascii", errors="xmlcharrefreplace").write(HTML)
print(f"wrote {OUT}  ({len(HTML)/1024:.0f} KB)")
