'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useParallax } from '@/lib/interaction';

/**
 * Thin wrapper over next/image for our static-export setup (Handoff §9, §11.3) —
 * Creative Director revision: images sit on a soft elevated frame (hairline ring +
 * float shadow + faint inset gold edge) so photography reads with depth.
 *
 * `contain` — set true for posture/person photographs so the FULL figure and posture
 * stay visible (object-contain on a soft background), never cropping hands or feet out
 * of frame (client requirement). Leave false for scenic/atmospheric images, where
 * object-cover fills the frame cleanly.
 *
 * `parallax` (2026 interaction layer) — the photograph drifts a few pixels within its
 * frame as the section scrolls past. The frame clips and the image is over-scaled so no
 * edge is ever exposed. Ignored for `contain` images (the whole figure must stay put)
 * and frozen under prefers-reduced-motion. Use on a page's one or two anchor images.
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
  parallax = false,
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
  parallax?: boolean;
}) {
  const { ref, y } = useParallax(26);
  const drift = parallax && !contain;

  return (
    <div
      ref={ref}
      className={`relative ${aspect} w-full overflow-hidden ${
        contain
          ? 'bg-[radial-gradient(120%_120%_at_50%_15%,rgb(var(--color-surface)),rgb(var(--color-bg-alt)))]'
          : 'bg-bg-alt'
      } ${rounded ? 'rounded-[10px]' : ''} ${
        elevated ? 'shadow-lift ring-1 ring-black/[0.05]' : ''
      } ${className}`}
    >
      <motion.div style={drift ? { y } : undefined} className={drift ? 'absolute inset-0 scale-[1.08]' : 'contents'}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={`${contain ? 'object-contain p-3 sm:p-4' : 'object-cover'} ${imgClassName}`}
        />
      </motion.div>
      {goldEdge && (
        <span className="pointer-events-none absolute inset-0 rounded-[10px] ring-1 ring-inset ring-gold/12" />
      )}
    </div>
  );
}
