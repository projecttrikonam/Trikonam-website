'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion';

/**
 * Base card (Handoff §8) — Creative Director revision.
 *
 * Image-forward and quiet: a soft elevated surface (no heavy border), a hairline gold
 * rule that draws in on hover, the inner image easing to ~1.04 within an overflow
 * wrapper, and a layered shadow that deepens as the card lifts (§4.6 row 4). Cards
 * without a photo get a calm gradient canvas with a large faint monogram and a breath
 * ring — so image-less practices never read as broken. Movement removed under
 * prefers-reduced-motion.
 */
export function Card({
  href,
  title,
  eyebrow,
  excerpt,
  image,
  imageAlt = '',
  aspect = 'aspect-[4/3]',
  external = false,
}: {
  href: string;
  title: string;
  eyebrow?: string;
  excerpt?: string;
  image?: string;
  imageAlt?: string;
  aspect?: string;
  external?: boolean;
}) {
  const reduced = usePrefersReducedMotion();

  const cardClass =
    'group/card relative flex h-full flex-col overflow-hidden rounded-[10px] surface-elevated ring-1 ring-black/[0.04] transition-shadow duration-500 ease-calm hover:shadow-lift focus-visible:outline-2 focus-visible:outline-offset-2';

  const inner = (
    <>
      <div className={`relative ${aspect} w-full overflow-hidden bg-[radial-gradient(120%_120%_at_50%_15%,rgb(var(--color-surface)),rgb(var(--color-bg-alt)))]`}>
        {image ? (
          // object-contain so full postures (including extended limbs) are never cropped;
          // the posture floats on the soft canvas, consistent with the no-image cards.
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className={`object-contain p-4 transition-transform duration-[900ms] ease-calm ${
              reduced ? '' : 'group-hover/card:scale-[1.03]'
            }`}
          />
        ) : (
          // Calm canvas for image-less practices — a large faint monogram + breath ring.
          <div className="relative flex h-full w-full items-center justify-center bg-[radial-gradient(120%_120%_at_50%_0%,rgb(var(--color-surface)),rgb(var(--color-bg-alt)))]">
            <span className="font-serif text-[5.5rem] leading-none text-moss/15">
              {title.charAt(0)}
            </span>
            <svg viewBox="0 0 100 100" className="absolute h-24 w-24 stroke-moss/25" aria-hidden>
              <circle cx="50" cy="50" r="46" fill="none" strokeWidth="1" />
            </svg>
          </div>
        )}
      </div>

      <div className="relative flex flex-1 flex-col p-6 sm:p-7">
        {eyebrow && <span className="eyebrow mb-2.5 text-[0.72rem]">{eyebrow}</span>}
        <h3 className="font-serif text-[1.35rem] leading-snug text-primary">{title}</h3>
        {excerpt && (
          <p className="mt-2 flex-1 text-body text-secondary">{excerpt}</p>
        )}
        <span className="mt-5 inline-flex items-center gap-2 text-[0.82rem] font-medium uppercase tracking-[0.12em] text-moss">
          Read more
        </span>
        {/* Gold hairline that draws in from the left on hover. */}
        <span className="pointer-events-none absolute inset-x-6 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-gold/60 to-transparent transition-transform duration-700 ease-calm group-hover/card:scale-x-100 sm:inset-x-7" />
      </div>
    </>
  );

  return (
    <motion.div
      whileHover={reduced ? undefined : { y: -4 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      {external ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={cardClass}>
          {inner}
        </a>
      ) : (
        <Link href={href} className={cardClass}>
          {inner}
        </Link>
      )}
    </motion.div>
  );
}
