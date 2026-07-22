import { createImageUrlBuilder } from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url';
import { projectId, dataset, hasSanity } from './env';

const builder = hasSanity ? createImageUrlBuilder({ projectId, dataset }) : null;

/**
 * Build a Sanity CDN image URL for a Portable Text image value (hero, body, gallery).
 * Returns null for local content (which already carries a plain `src`). Callers add
 * width/quality (`.width(1600).quality(80).auto('format')`).
 */
export function urlForImage(source: SanityImageSource | undefined) {
  if (!builder || !source) return null;
  return builder.image(source);
}

/** Convenience: a ready optimized URL string at a given width. */
export function imageUrl(source: SanityImageSource | undefined, width = 1200): string | null {
  const b = urlForImage(source);
  return b ? b.width(width).quality(80).auto('format').url() : null;
}

/**
 * A CDN-cropped URL at a fixed aspect ratio, for hero/cover images.
 *
 * Passing BOTH width and height is what makes @sanity/image-url honour the **crop
 * rectangle and hotspot** an editor sets in the Studio. URLs assembled by string
 * concatenation in GROQ cannot do this — they can only centre-crop — which is why every
 * cover URL is built here instead.
 */
export function croppedImageUrl(
  source: SanityImageSource | undefined,
  width: number,
  ratio = 3 / 2,
): string | undefined {
  const b = urlForImage(source);
  if (!b) return undefined;
  return b
    .width(width)
    .height(Math.round(width / ratio))
    .fit('crop')
    .auto('format')
    .quality(80)
    .url();
}
