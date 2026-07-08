// @ts-nocheck
/**
 * Trikonam image pipeline (Handoff Section 5.1 & 9).
 *
 * WHAT IT DOES
 *   Reads the curated source photographs from /assets/source-images and writes
 *   web-optimized .webp files into /public/images at the sizes each slot needs.
 *   The .webp files in /public/images are what the static site actually serves and
 *   ARE committed to the repo.
 *
 * WHEN TO RUN
 *   Locally, whenever the source photos change:  npm run optimize-images
 *   It is intentionally NOT a build hook — Cloudflare's Linux build box has no HEIC
 *   decoder (`sips` is macOS-only), and the committed /public/images already contains
 *   the final assets, so the deploy build does not need this script.
 *
 * HEIC HANDLING (Handoff Section 5.1, item 2)
 *   Some sources are .HEIC. sharp can only decode HEIC when its libvips was built
 *   with libheif. To stay robust, HEIC inputs are first transcoded to a temporary
 *   JPEG via macOS `sips`, then processed by sharp like any other file. On a non-mac
 *   machine, either install a libheif-enabled sharp or pre-convert HEIC to JPEG.
 *
 * ADDING IMAGES
 *   Drop the new source into /assets/source-images and add an entry to JOBS below.
 *   Never point this at stock/AI/internet imagery — client photos only (Ground Rule).
 */

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SRC_DIR = join(ROOT, 'assets', 'source-images');
const OUT_DIR = join(ROOT, 'public', 'images');
const TMP_DIR = join(ROOT, '.image-cache');

// A "job" = one source file → one or more output webp files.
// fit:
//   'hero'     full-screen hero / full-bleed band → 2560px wide cap
//   'wide'     landscape band / grid image        → 2000px wide cap
//   'portrait' tall figure image                  → 1400px tall cap
//   'card'     grid card / medium                 → 1200px wide cap
//   'square'   1:1                                → 1200px
// Each source maps to exactly ONE output — no image is reused anywhere on the site
// (client requirement: strictly no repetition). `fit` is always non-cropping ('inside')
// so full figures and postures stay in frame; display-side cropping is likewise avoided
// via object-contain for posture photos.
//
// PROFESSIONAL-ONLY, full resolution. All sources below are the client's professional
// photography (see "Corrected high quality images" for the practice set) — no stock, no
// AI, no casual snapshots, and no low-resolution thumbnails remain in use.
const JOBS = [
  // --- Home / Teachers / Programs (full-resolution professional images) ---
  { src: 'home-hero.jpg', out: ['home/hero.webp'], fit: 'hero' }, // dusk meditation, centred figure — full-screen hero
  { src: 's-meditation-pranayama.jpg', out: ['home/about-preview.webp'], fit: 'wide' }, // waterfall cave — intimate About moment
  { src: 'chq-home-page.jpg', out: ['home/interlude.webp'], fit: 'hero' }, // sunrise group practice — full-bleed editorial image, shown uncropped
  { src: 'prog-children.jpg', out: ['programs/children/children.webp'], fit: 'wide' }, // children meditating
  { src: 'prog-schools.jpg', out: ['programs/schools-colleges/schools.webp'], fit: 'wide' }, // children chanting
  { src: 'teachers-training.jpg', out: ['teachers/training.webp'], fit: 'wide' }, // gurukulam training hall

  // --- New full-resolution section images (client "must use" set) ---
  { src: 'mu-corporate.png', out: ['programs/corporate/corporate.webp'], fit: 'wide' }, // office group meditation
  { src: 'mu-private.png', out: ['programs/private-sessions/private.webp'], fit: 'wide' }, // one-to-one guidance
  { src: 'mu-retreats.png', out: ['programs/retreats/retreats.webp'], fit: 'wide' }, // firelit mountain circle

  // --- About page (Classical Hatha Yoga imagery) ---
  { src: 'about-chy1.jpg', out: ['about/about-hero.webp'], fit: 'wide' }, // Adiyogi + practitioners meditating
  { src: 'about-chy2.jpg', out: ['about/what-is-chy.webp'], fit: 'hero' }, // colonnade postures at dawn
  { src: 'about-chy3.jpg', out: ['about/support.webp'], fit: 'hero' }, // namaskar under a pavilion (large highlight)

  // --- Practice images ("Corrected high quality images" set — matched by filename to
  //     each practice, all full-resolution). Shown object-contain so people are never
  //     cropped; 'wide' fit keeps them sharp at the sizes the layout displays them. ---
  { src: 'chq-upa-yoga.jpg', out: ['practices/upa-yoga/upa-yoga.webp'], fit: 'wide' },
  { src: 'chq-surya-kriya.jpg', out: ['practices/surya-kriya/surya-kriya.webp'], fit: 'wide' },
  { src: 'chq-surya-shakti.jpg', out: ['practices/surya-shakti/surya-shakti.webp'], fit: 'wide' },
  { src: 'chq-angamardhana.jpg', out: ['practices/angamardhana/angamardhana.webp'], fit: 'wide' },
  { src: 'chq-yogasanas.jpg', out: ['practices/yogasanas/yogasanas.webp'], fit: 'wide' },
  { src: 'p-bhuta-shuddhi.jpg', out: ['practices/bhuta-shuddhi/bhuta-shuddhi.webp'], fit: 'wide' }, // copper-ritual detail (full-res)
  { src: 'chq-sunayana.jpg', out: ['practices/sunayana-eye-care/sunayana.webp'], fit: 'wide' },
  { src: 'chq-shanmukhi.jpg', out: ['practices/shanmukhi-mudra/shanmukhi-mudra.webp'], fit: 'wide' },
  { src: 'chq-bhastrika.jpg', out: ['practices/bhastrika-kriya/bhastrika.webp'], fit: 'wide' },
  { src: 'chq-pavanamuktasana.jpg', out: ['practices/pavanamuktasana/pavanamuktasana.webp'], fit: 'wide' },

  // --- Online classes ---
  { src: 'mu-online.jpg', out: ['programs/online/online.webp'], fit: 'card' },
];

const FIT = {
  hero: { width: 2560, height: null }, // full-screen hero / full-bleed interlude
  wide: { width: 2000, height: null },
  portrait: { width: null, height: 1600 },
  card: { width: 1200, height: null },
  square: { width: 1200, height: 1200 },
};

const QUALITY = 82;

function ensureDir(p) {
  mkdirSync(dirname(p), { recursive: true });
}

/** Return a path sharp can read: HEIC → transcode to temp JPEG via sips first. */
function decodableInput(srcPath) {
  if (!/\.hei[cf]$/i.test(srcPath)) return srcPath;
  mkdirSync(TMP_DIR, { recursive: true });
  const tmp = join(TMP_DIR, srcPath.split('/').pop().replace(/\.hei[cf]$/i, '.jpg'));
  try {
    execFileSync('sips', ['-s', 'format', 'jpeg', srcPath, '--out', tmp], { stdio: 'ignore' });
    return tmp;
  } catch (err) {
    throw new Error(
      `Could not decode HEIC "${srcPath}". macOS "sips" failed and sharp cannot read HEIC ` +
        `without libheif. Install a libheif-enabled sharp or pre-convert to JPEG.\n${err.message}`,
    );
  }
}

async function run() {
  if (!existsSync(SRC_DIR)) {
    console.error(`Source folder not found: ${SRC_DIR}`);
    process.exit(1);
  }

  let count = 0;
  for (const job of JOBS) {
    const srcPath = join(SRC_DIR, job.src);
    if (!existsSync(srcPath)) {
      console.warn(`  ! skipping missing source: ${job.src}`);
      continue;
    }
    const input = decodableInput(srcPath);
    const { width, height } = FIT[job.fit];

    for (const rel of job.out) {
      const outPath = join(OUT_DIR, rel);
      ensureDir(outPath);
      await sharp(input)
        .rotate() // honour EXIF orientation
        .resize({
          width: width ?? undefined,
          height: height ?? undefined,
          fit: job.fit === 'square' ? 'cover' : 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: QUALITY })
        .toFile(outPath);
      console.log(`  ✓ ${rel}`);
      count++;
    }
  }

  // Open Graph / social share image (Handoff Section 11.1) — a real photo, 1200×630.
  const ogSrc = join(SRC_DIR, 'home-hero.jpg');
  const ogOut = join(ROOT, 'public', 'og-image.jpg');
  await sharp(ogSrc)
    .rotate()
    .resize({ width: 1200, height: 630, fit: 'cover', position: 'attention' })
    .jpeg({ quality: 84 })
    .toFile(ogOut);
  console.log('  ✓ og-image.jpg');
  count++;

  // Clean up temporary HEIC transcodes.
  if (existsSync(TMP_DIR)) rmSync(TMP_DIR, { recursive: true, force: true });

  console.log(`\nDone — wrote ${count} optimized files to /public/images.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
