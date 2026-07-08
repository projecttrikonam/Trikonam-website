import Image from 'next/image';

/**
 * Thin wrapper over next/image for our static-export setup (Handoff §9, §11.3) —
 * Creative Director revision: images sit on a soft elevated frame (hairline ring +
 * float shadow + faint inset gold edge) so photography reads with depth.
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
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`${contain ? 'object-contain p-3 sm:p-4' : 'object-cover'} ${imgClassName}`}
      />
      {goldEdge && (
        <span className="pointer-events-none absolute inset-0 rounded-[10px] ring-1 ring-inset ring-gold/12" />
      )}
    </div>
  );
}
