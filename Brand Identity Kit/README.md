# Trikonam Brand Identity v1.1

**Frozen. This folder is the single source of truth for the Trikonam brand.**

Any future logo, marketing piece, merchandise, stationery, presentation, social
template or website update must draw from these files. Do not redraw the mark, do
not re-set the wordmark from a font, and do not introduce a variation that is not
in `01_Master Logos`. If something needed is genuinely missing, extend the system
from `09_Source Files/Editable Sources` and re-version it — do not improvise.

---

## CHANGELOG

### v1.1 — the horizontal lockup, re-spaced optically

**Scope: the horizontal lockup only.** The symbol, the wordmark, the colour palette,
the typography, and every other lockup are byte-for-byte unchanged from v1.0. This
was verified by diffing the two kits: of 372 deterministic artwork files, 307 are
identical and all 65 changed files contain the horizontal lockup.

Two corrections, both measured rather than eyeballed:

**1. The gap: 84 → 23.7 units** (0.075 → 0.02116 of symbol height).

The symbol is a **wedge**. Across the vertical band the wordmark occupies, its ink
stops at x=561, while the ground line alone reaches x=879. A gap measured off the
bounding box therefore read as a **402-unit void** beside the type — 4.8× its nominal
size — and the two elements drifted apart, most visibly on screen. Reducing the
*geometric* gap does almost nothing to this; the new value closes the **perceived**
void by 15%, landing the T's left edge on the ground line's terminus. The gap stays
positive, so the wordmark never overhangs the symbol's box and the clear-space rule
is unaffected.

**2. The wordmark drops 44.6 units** (0.03982 of symbol height).

The symbol's ink centroid sits 105 units below its bounding-box centre — the legs and
the earth line carry the mass — so a box-centred wordmark rode visually high. This
takes back about 40% of that. Chasing the full centroid reads as a slump.

Lockup size: **2977.6 × 1120** (was 3037.9 × 1120). Clear space is unchanged at
X = the lotus height.

### v1.0 — initial system

Built from the founding artwork and frozen after a measured Creative Director review.

---

## The identity in one paragraph

The symbol is a practitioner in **Trikonasana**, the triangle posture the school is
named for, with a lotus opening from the raised hand. It is built on an **11 × 14
module field**: the ascending axis stands on the field's quarter line, and the
triangle formed by the legs and the earth line has a height of **base × φ⁻²**
(measured 0.38182 against a true 0.381966). Those relationships were measured from
the founding artwork, not imposed on it. The ink is **Forest Ink #2F3A2A**. The
wordmark is **Marcellus, refined** — optically respaced pair by pair, with the
apexes of the A and M drawn to a point to echo the lotus petal tips.

## Two things that are easy to get wrong

**Use the right optical cut.** The mark is a monoline, so it ships in two weights of
one drawing. **Display** (stroke 0.89% of symbol height) for a symbol height of
140 px and above. **Compact** (1.43%) between 60 and 140 px — files are suffixed
`-compact`. Below 60 px use the **Reduced Mark**, never a shrunken lockup.

**Clear space is X, and X is the height of the lotus** — 0.136 of the symbol's
height, at whatever size the mark is used. One rule for every lockup. For the
wordmark alone, X is its cap height.

## Minimum sizes

| Lockup | Minimum |
|---|---|
| Primary / Stacked | 32 mm · 120 px wide |
| Horizontal | 52 mm · 200 px wide |
| Symbol | 16 mm · 60 px wide |
| Wordmark | 24 mm · 90 px wide |
| Reduced Mark | 6 mm · 16 px |

## Formats

Every master lockup ships as **SVG · PDF · EPS · PNG 1200 / 2400 / 4000 px**.
SVG masters carry their ink as `currentColor`, so a colourway is one declaration.

## Naming

`trikonam-<lockup>-<colourway>[-compact][-<size>px].<ext>` — lower case, hyphenated,
no spaces, no dates. Keep it.

---

## What could NOT be generated natively, and why

Nothing in this kit is a placeholder. These five items are genuinely outside what
can be produced here, and each is stated rather than faked:

1. **Native Adobe files (.ai, .psd, .indd).** Proprietary, undocumented formats that
   require Adobe software to author. *This is not a gap:* the supplied **PDF and EPS
   open directly in Illustrator** as fully editable vector paths, and
   `09_Source Files/Editable Sources/Pipeline` contains the parametric generator that
   produced every asset — a more editable source than an .ai file.

2. **Pantone-certified colour data or proofs.** Pantone libraries are licensed
   intellectual property. The references here are **visual approximations derived
   from the RGB values** and are labelled as such throughout. Confirm every one
   against a current physical Pantone guide before any spot-colour or foil run.

3. **Device-CMYK, ICC colour-managed PDFs.** The PDFs are **RGB**. Correct CMYK
   separation depends on the press, stock and ink set, and is properly the printer's
   conversion. Supply them the vector. If they provide a target ICC profile, the
   pipeline can re-export against it.

4. **Physical proofs and dies** — foil blocks, emboss/deboss dies, engraving plates.
   These require a finisher. The artwork they need (single-colour vector, Compact
   cut) is in `03_Print Assets`, with production notes in each folder.

5. **Adobe round-trip confirmation of the .ase.** The swatch file is written to the
   ASE specification and its binary block structure has been walked and verified,
   but Adobe is not available here to confirm the import visually. Open it once in
   Illustrator before relying on it.

**Fonts are not a limitation.** Fraunces, Karla and Marcellus are all SIL Open Font
Licence 1.1 — free to embed, modify and redistribute, commercially, for web and
desktop. No purchase or licence is required, and the modified wordmark font is
supplied.

---

## Regenerating

```bash
cd "09_Source Files/Editable Sources/Pipeline"
python3 -m venv venv
./venv/bin/pip install cairosvg fonttools uharfbuzz numpy scipy scikit-image pillow brotli pypdf
./venv/bin/python build_kit.py "../../../../Brand Identity Kit"
./venv/bin/python build_docs.py "../../../../Brand Identity Kit"
```

`audit.py` re-runs the optical review; `verify_kit.py` re-runs the file verification.

Note: PDF and EPS files carry a creation timestamp, so they differ byte-for-byte on
every regeneration even when the artwork is identical. Compare SVG or PNG, or the
decompressed PDF page operators, when checking whether artwork actually changed.
