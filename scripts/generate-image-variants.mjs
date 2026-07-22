/**
 * Generates responsive width variants for the local photography in public/images.
 *
 * The site is a static export, so next/image's optimiser isn't available — variants are
 * produced ahead of time instead and served through <ResponsiveImage>. For every source
 * image this writes `name-<width>.webp` beside it (only for widths smaller than the
 * original — we never upscale, so quality is never invented) and records the intrinsic
 * size in image-manifest.json, which lets the component set width/height and stop layout
 * shift.
 *
 * Quality is deliberately high (82): the point is to stop phones downloading 2000px
 * files, not to squeeze bytes out of the photography.
 *
 * Run: node scripts/generate-image-variants.mjs   (wired into `npm run build`)
 */
import { readdirSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { join, extname, basename, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const imagesDir = join(root, 'public', 'images');
const WIDTHS = [480, 768, 1200, 1600];
const QUALITY = 82;
/** Variants we generated previously — never treat one as a source image. */
const isVariant = (name) => /-\d{3,4}\.webp$/.test(name);

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (/\.(webp|jpe?g|png)$/i.test(entry) && !isVariant(entry)) out.push(full);
  }
  return out;
}

const manifest = {};
let generated = 0;
let skipped = 0;

for (const file of walk(imagesDir)) {
  const img = sharp(file);
  const { width, height } = await img.metadata();
  const publicPath = '/' + relative(join(root, 'public'), file).split('\\').join('/');
  const ext = extname(file);
  const stem = join(dirname(file), basename(file, ext));

  const widths = WIDTHS.filter((w) => w < width);
  for (const w of widths) {
    const out = `${stem}-${w}.webp`;
    if (existsSync(out)) { skipped++; continue; }
    await sharp(file).resize({ width: w, withoutEnlargement: true }).webp({ quality: QUALITY }).toFile(out);
    generated++;
  }

  manifest[publicPath] = { width, height, widths };
}

writeFileSync(
  join(root, 'src', 'content', 'image-manifest.json'),
  JSON.stringify(manifest, null, 1) + '\n',
);

const count = Object.keys(manifest).length;
console.log(`Images: ${count} source files → ${generated} variants generated, ${skipped} already present`);
