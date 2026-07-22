import manifest from '@/content/image-manifest.json';

type Meta = { width: number; height: number; widths: number[] };
const images = manifest as Record<string, Meta>;

/**
 * Photography on a soft elevated frame (hairline ring + float shadow + faint inset gold
 * edge) so images read with depth (Handoff §9, §11.3).
 *
 * Serves a width-appropriate file. This used to wrap next/image, but the site is a
 * static export with `images.unoptimized`, so next/image emitted the full-size original
 * with no srcset — a phone was downloading 2000px photographs for a 327px slot. Widths
 * are now generated ahead of time by scripts/generate-image-variants.mjs and offered as
 * a srcset, so the browser picks (~21KB instead of ~284KB on a practice card). Quality
 * is unchanged: variants are never upscaled and are encoded at q82.
 *
 * `sizes` should describe how wide the image actually renders — roughly right is enough.
 * Paths missing from the manifest fall back to a plain <img>, so nothing breaks.
 *
 * `contain` — set true for posture/person photographs so the FULL figure and posture
 * stay visible (object-contain on a soft background), never cropping hands or feet out
 * of frame (client requirement). Leave false for scenic/atmospheric images, where
 * object-cover fills the frame cleanly.
 */
export function ResponsiveImage({
  src,
  alt,
  aspect = 'aspect-[4/3]',
  sizes = '(min-width: 768px) 50vw, 100vw',
  priority = false,
  className = '',
  imgClassName = '',
  rounded = true,
  elevated = true,
  goldEdge = true,
  contain = false,
}: {
  src: string;
  alt: string;
  aspect?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  rounded?: boolean;
  elevated?: boolean;
  goldEdge?: boolean;
  contain?: boolean;
}) {
  return (
    <div
      className={`relative ${aspect} w-full overflow-hidden ${
        contain
          ? 'bg-[radial-gradient(120%_120%_at_50%_15%,rgb(var(--color-surface)),rgb(var(--color-bg-alt)))]'
          : 'bg-bg-alt'
      } ${rounded ? 'rounded-[10px]' : ''} ${
        elevated ? 'shadow-lift ring-1 ring-black/[0.05]' : ''
      } ${className}`}
    >
      <ResponsiveImg
        src={src}
        alt={alt}
        sizes={sizes}
        priority={priority}
        fill
        className={`${contain ? 'object-contain p-3 sm:p-4' : 'object-cover'} ${imgClassName}`}
      />
      {goldEdge && (
        <span className="pointer-events-none absolute inset-0 rounded-[10px] ring-1 ring-inset ring-gold/12" />
      )}
    </div>
  );
}

/**
 * The bare <img> with a width-appropriate srcset — no frame, no wrapper. Use this where
 * the image already sits in its own styled container (cards, heroes, article covers) and
 * ResponsiveImage's elevated frame would be wrong.
 *
 * Intrinsic width/height come from the manifest so the browser reserves the correct box
 * and the page doesn't shift as photographs load. Lazy by default; pass `priority` for
 * anything above the fold.
 */
export function ResponsiveImg({
  src,
  alt,
  sizes = '100vw',
  className = '',
  priority = false,
  fill = false,
  width,
  height,
}: {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
  /**
   * The image fills a positioned parent rather than sitting in the normal flow.
   *
   * This must be set for that case, and it does two things that matter. It positions the
   * image with inline styles rather than classes, so the box is correct the instant the
   * markup is parsed instead of waiting on the stylesheet. And it omits the intrinsic
   * width/height, because declaring 2000×1469 on an element the container is supposed to
   * size gives the browser a competing aspect ratio.
   */
  fill?: boolean;
  /** Override the intrinsic ratio where a layout depends on a declared box (e.g. the
   *  gallery's masonry columns). Omit to use the photograph's real dimensions. */
  width?: number;
  height?: number;
}) {
  const meta = images[src];
  const loading = priority ? 'eager' : 'lazy';

  /**
   * Transparent text colour keeps the `alt` from painting inside the frame while the
   * image is still loading — without it every lazy image flashes its alt text and then
   * replaces it with the photograph. Positioning is inline for `fill` so it never
   * depends on stylesheet timing.
   */
  const style: React.CSSProperties = fill
    ? { position: 'absolute', inset: 0, width: '100%', height: '100%', color: 'transparent' }
    : { color: 'transparent' };

  if (!meta) {
    // Not a local file we generated variants for (e.g. a Sanity CDN URL, already sized).
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        style={style}
        loading={loading}
        decoding="async"
      />
    );
  }

  const stem = src.slice(0, src.lastIndexOf('.'));
  const srcSet = [
    ...meta.widths.map((w) => `${stem}-${w}.webp ${w}w`),
    `${src} ${meta.width}w`,
  ].join(', ');

  // Intrinsic dimensions reserve the right box in normal flow, but must be withheld in
  // `fill` mode — there the parent decides the box, and a declared ratio fights it.
  const dimensions = fill ? {} : { width: width ?? meta.width, height: height ?? meta.height };

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      {...dimensions}
      alt={alt}
      className={className}
      style={style}
      loading={loading}
      // Always async. `sync` makes the browser decode the image before it will present
      // the frame, so a large hero stalls painting — which is visible as a flicker,
      // especially with the page held at opacity 0 until hydration. Priority is
      // expressed through fetchPriority/eager instead, which is what next/image does.
      decoding="async"
      {...(priority ? { fetchPriority: 'high' as const } : {})}
    />
  );
}
