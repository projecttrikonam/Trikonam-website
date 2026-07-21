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
