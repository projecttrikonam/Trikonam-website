"""tokens.py — the palette in every format a team actually consumes."""
import struct, json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from brand import PALETTE as P

ORDER = ["forest", "espresso", "stone", "moss", "mossdark", "gold", "goldleaf",
         "sand", "ivory", "border", "white", "black"]
PANTONE = {
    "forest": "5605 C", "espresso": "Neutral Black C", "stone": "Warm Gray 11 C",
    "moss": "5757 C",
    "mossdark": "5605 C", "gold": "730 C", "goldleaf": "872 C (metallic)",
    "ivory": "9184 C", "sand": "9224 C", "border": "9225 C",
    "white": "n/a", "black": "Process Black C",
}
VAR = {"forest": "forest-ink", "espresso": "espresso", "stone": "stone",
       "moss": "moss",
       "mossdark": "moss-deep", "gold": "ochre-gold", "goldleaf": "gold-leaf",
       "sand": "sand", "ivory": "ivory", "border": "hairline",
       "white": "white", "black": "black"}


def rgb(h):
    return tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))


def cmyk(h):
    r, g, b = (v / 255 for v in rgb(h))
    k = 1 - max(r, g, b)
    if k >= 1:
        return (0, 0, 0, 100)
    return tuple(round(v * 100) for v in
                 ((1 - r - k) / (1 - k), (1 - g - k) / (1 - k), (1 - b - k) / (1 - k), k))


# ---------------------------------------------------------------- ASE
def _ase_block(name, r, g, b):
    n = name + "\0"
    nb = n.encode("utf-16-be")
    body = struct.pack(">H", len(n)) + nb + b"RGB " + struct.pack(">fff", r, g, b) \
        + struct.pack(">H", 2)          # 2 = normal colour
    return struct.pack(">HI", 0x0001, len(body)) + body


def _ase_group(name):
    n = name + "\0"
    body = struct.pack(">H", len(n)) + n.encode("utf-16-be")
    return struct.pack(">HI", 0xC001, len(body)) + body


def _ase_group_end():
    return struct.pack(">HI", 0xC002, 0)


def write_ase(path, group="Trikonam Brand Identity v1.1"):
    blocks = [_ase_group(group)]
    for k in ORDER:
        hexs, name, _ = P[k]
        r, g, b = (v / 255.0 for v in rgb(hexs))
        blocks.append(_ase_block(f"Trikonam {name}", r, g, b))
    blocks.append(_ase_group_end())
    data = b"ASEF" + struct.pack(">HHI", 1, 0, len(blocks)) + b"".join(blocks)
    open(path, "wb").write(data)
    return len(blocks) - 2


# ---------------------------------------------------------------- text formats
HEADER = ("Trikonam Brand Identity v1.1 - colour palette\n"
          "Generated from the master identity. Do not hand-edit.\n"
          "CMYK values are unmanaged conversions; proof on stock.\n"
          "Pantone references are approximations; confirm against a physical guide.\n")


def write_json(path):
    data = {"name": "Trikonam Brand Identity", "version": "1.1",
            "colours": {}}
    for k in ORDER:
        hexs, name, role = P[k]
        data["colours"][VAR[k]] = {
            "name": name, "role": role, "hex": hexs,
            "rgb": list(rgb(hexs)), "cmyk": list(cmyk(hexs)),
            "pantone": PANTONE[k],
        }
    json.dump(data, open(path, "w"), indent=2)


def write_css(path):
    L = ["/* " + HEADER.replace("\n", "\n   ").rstrip() + " */", "", ":root {"]
    for k in ORDER:
        hexs, name, role = P[k]
        L.append(f"  --trikonam-{VAR[k]}: {hexs}; /* {name} - {role} */")
    L.append("")
    L.append("  /* channel triplets, for opacity modifiers: rgb(var(--x) / 40%) */")
    for k in ORDER:
        r, g, b = rgb(P[k][0])
        L.append(f"  --trikonam-{VAR[k]}-rgb: {r} {g} {b};")
    L.append("}")
    open(path, "w").write("\n".join(L) + "\n")


def write_scss(path):
    L = ["// " + HEADER.replace("\n", "\n// ").rstrip(), ""]
    for k in ORDER:
        hexs, name, role = P[k]
        L.append(f"$trikonam-{VAR[k]}: {hexs}; // {name} - {role}")
    L.append("")
    L.append("$trikonam-palette: (")
    L.append(",\n".join(f'  "{VAR[k]}": {P[k][0]}' for k in ORDER))
    L.append(");")
    open(path, "w").write("\n".join(L) + "\n")


def write_tailwind(path):
    L = ["// " + HEADER.replace("\n", "\n// ").rstrip(), "",
         "module.exports = {", "  theme: {", "    extend: {", "      colors: {"]
    for k in ORDER:
        hexs, name, role = P[k]
        L.append(f"        '{VAR[k]}': '{hexs}', // {name}")
    L += ["      },", "    },", "  },", "};", ""]
    open(path, "w").write("\n".join(L))


def write_txt(path):
    w = ["TRIKONAM BRAND IDENTITY v1.1 - COLOUR REFERENCE", "=" * 74, "", HEADER, ""]
    w.append(f"{'NAME':<14}{'HEX':<10}{'RGB':<16}{'CMYK':<18}{'PANTONE':<20}ROLE")
    w.append("-" * 110)
    for k in ORDER:
        hexs, name, role = P[k]
        r = " ".join(str(v) for v in rgb(hexs))
        c = " ".join(str(v) for v in cmyk(hexs))
        w.append(f"{name:<14}{hexs:<10}{r:<16}{c:<18}{PANTONE[k]:<20}{role}")
    open(path, "w").write("\n".join(w) + "\n")
