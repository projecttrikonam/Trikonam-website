// @ts-nocheck
/**
 * One-off image processing for the 2026 homepage-journey refinement.
 *
 * Produces the base .webp files for:
 *   • Teacher portraits   → public/images/teachers/<slug>.webp  (4:5, hand-set face crop)
 *   • Practice photographs → public/images/practice/<name>.webp  (3:2, attention crop)
 *
 * Sources are the client's own photographs, copied into assets/source-images
 * (teacher-*.{jpg,png}, gbp-*.jpg). They are candid snapshots, so each teacher portrait
 * carries a hand-set crop box (fractions of the EXIF-oriented image) that frames the
 * head and shoulders and drops most of the incidental background.
 *
 * A gentle, consistent grade (slight desaturation + a whisper of contrast) is applied so
 * the snapshots sit calmly beside the site's editorial photography and the ivory / moss
 * palette. Faces and postures are never retouched.
 *
 * After running this, run `npm run image-variants` to emit the responsive widths and
 * refresh src/content/image-manifest.json.
 *
 *   node scripts/process-2026-refresh.mjs
 */
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SRC = join(ROOT, 'assets', 'source-images');
const OUT = join(ROOT, 'public', 'images');

/** Quiet grade for the practice photos — natural, just calmer. */
const grade = (img) => img.modulate({ saturation: 0.9, brightness: 1.015 }).linear(1.03, -4);

/**
 * Portrait grade — the teacher snapshots come from very different rooms (a car park, an
 * event banner, a kitchen, a tree-lined path). A deeper desaturation, a touch of warmth,
 * and a soft edge vignette pull them into one calm, editorial register that sits with
 * the ivory / espresso palette without inventing colour.
 */
const PORTRAIT_W = 1100;
const PORTRAIT_H = 1375; // 4:5

const vignette = Buffer.from(
  `<svg width="${PORTRAIT_W}" height="${PORTRAIT_H}">
     <defs>
       <radialGradient id="v" cx="50%" cy="42%" r="75%">
         <stop offset="55%" stop-color="#000" stop-opacity="0"/>
         <stop offset="100%" stop-color="#20140a" stop-opacity="0.42"/>
       </radialGradient>
     </defs>
     <rect width="100%" height="100%" fill="url(#v)"/>
   </svg>`,
);

const portraitGrade = (img) =>
  img
    .modulate({ saturation: 0.62, brightness: 1.02, hue: 4 })
    .linear(1.05, -8)
    .composite([{ input: vignette, blend: 'over' }]);

// Each box is [centreX, centreY, cropHeight] as fractions of the EXIF-oriented source;
// the crop width is derived from the 4:5 target ratio.
const TEACHERS = [
  { src: 'teacher-vasishta.jpg', out: 'teachers/vasishta.webp', box: [0.475, 0.505, 0.32] },
  { src: 'teacher-suresh.png', out: 'teachers/suresh.webp', box: [0.44, 0.4, 0.56] },
  { src: 'teacher-chandana.jpg', out: 'teachers/chandana.webp', box: [0.44, 0.44, 0.44] },
  { src: 'teacher-shirisha.jpg', out: 'teachers/shirisha.webp', box: [0.52, 0.37, 0.35] },
  { src: 'teacher-sasi-vadana.jpg', out: 'teachers/sasi-vadana.webp', box: [0.55, 0.5, 0.46] },
];

// "Practice, as it is lived" strip — a mix of Google Business Profile shots (landscape)
// and the client's casual photography (mostly portrait single-figure). Each frame is
// rendered at a fixed height in the strip, so `ar` just picks a sensible crop shape.
// `box` is an optional [centreX, centreY, cropHeight] (fractions of the oriented source)
// for the portrait casual shots where attention-cropping alone misses the figure.
const AR = { '3/2': [2000, 1333], '4/5': [1240, 1550], '1/1': [1400, 1400] };
const PRACTICE = [
  { src: 'gbp-colonnade.jpg', out: 'practice/colonnade.webp', ar: '3/2' },
  { src: 'cp-beach-backbend.jpg', out: 'practice/beach-backbend.webp', ar: '4/5', box: [0.5, 0.46, 0.62] },
  { src: 'gbp-nadi-shuddhi.jpg', out: 'practice/nadi-shuddhi.webp', ar: '3/2' },
  { src: 'cp-river-balance.jpg', out: 'practice/river-balance.webp', ar: '4/5', box: [0.52, 0.44, 0.74] },
  { src: 'gbp-meditation.jpg', out: 'practice/meditation.webp', ar: '3/2' },
  { src: 'cp-reverse-namaskar.jpg', out: 'practice/reverse-namaskar.webp', ar: '4/5', box: [0.5, 0.44, 0.68] },
  { src: 'gbp-sunset.jpg', out: 'practice/sunset.webp', ar: '4/5', box: [0.46, 0.6, 0.82] },
  { src: 'cp-rock-hollow.jpg', out: 'practice/rock-hollow.webp', ar: '1/1' },
  { src: 'gbp-group.jpg', out: 'practice/group.webp', ar: '3/2' },
];

const ensureDir = (p) => mkdirSync(dirname(p), { recursive: true });
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

async function portrait(job) {
  const srcPath = join(SRC, job.src);
  if (!existsSync(srcPath)) return console.warn(`  ! missing ${job.src}`);

  // Bake EXIF orientation into a buffer so the crop coordinates are in the same space
  // the image is actually displayed in.
  const oriented = await sharp(srcPath).rotate().toBuffer();
  const meta = await sharp(oriented).metadata();
  const W = meta.width;
  const H = meta.height;
  const ratio = PORTRAIT_W / PORTRAIT_H; // 0.8

  const [cx, cy, hFrac] = job.box;
  let height = Math.round(hFrac * H);
  let width = Math.round(height * ratio);
  if (width > W) {
    width = W;
    height = Math.round(width / ratio);
  }
  let left = clamp(Math.round(cx * W - width / 2), 0, W - width);
  let top = clamp(Math.round(cy * H - height / 2), 0, H - height);

  const outPath = join(OUT, job.out);
  ensureDir(outPath);
  await portraitGrade(
    sharp(oriented)
      .extract({ left, top, width, height })
      .resize(PORTRAIT_W, PORTRAIT_H, { fit: 'cover' }),
  )
    .webp({ quality: 88 })
    .toFile(outPath);
  console.log(`  ✓ ${job.out}  (${width}×${height} @ ${left},${top} from ${W}×${H})`);
}

async function practice(job) {
  const srcPath = join(SRC, job.src);
  if (!existsSync(srcPath)) return console.warn(`  ! missing ${job.src}`);
  const [W_OUT, H_OUT] = AR[job.ar ?? '3/2'];
  const outPath = join(OUT, job.out);
  ensureDir(outPath);

  let pipeline;
  if (job.box) {
    const oriented = await sharp(srcPath).rotate().toBuffer();
    const m = await sharp(oriented).metadata();
    const ratio = W_OUT / H_OUT;
    const [cx, cy, hFrac] = job.box;
    let height = Math.round(hFrac * m.height);
    let width = Math.round(height * ratio);
    if (width > m.width) {
      width = m.width;
      height = Math.round(width / ratio);
    }
    const left = clamp(Math.round(cx * m.width - width / 2), 0, m.width - width);
    const top = clamp(Math.round(cy * m.height - height / 2), 0, m.height - height);
    pipeline = sharp(oriented).extract({ left, top, width, height }).resize(W_OUT, H_OUT, { fit: 'cover' });
  } else {
    pipeline = sharp(srcPath)
      .rotate()
      .resize(W_OUT, H_OUT, { fit: 'cover', position: job.position ?? sharp.strategy.attention });
  }

  await grade(pipeline).webp({ quality: 84 }).toFile(outPath);
  console.log(`  ✓ ${job.out}  (${W_OUT}×${H_OUT})`);
}

async function run() {
  for (const job of TEACHERS) await portrait(job);
  for (const job of PRACTICE) await practice(job);
  console.log(`\nDone. Now run: npm run image-variants`);
}

run();
