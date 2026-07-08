'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion';

/**
 * A full-bleed photographic pause — a single image given the whole width to breathe.
 * No card, no border. Used as a wordless interval in the homepage's story (a visual
 * exhale between passages of text). An optional quiet line can rest over it, but often
 * it is more powerful with none.
 *
 * `preserveComposition` (opt-in, default off — existing behaviour is unchanged for any
 * other use): renders the image at its own natural aspect ratio with object-contain
 * instead of a fixed-height object-cover crop, so the complete photograph — every
 * person, posture, and edge of the frame — is always visible on every screen size,
 * never cropped or stretched. Editorial treatment for photography where composition
 * must be preserved exactly. The parallax drift is skipped in this mode, since it
 * relies on cropped overflow margin that this mode does not have.
 */
export function FullBleedInterlude({
  src,
  alt,
  caption,
  preserveComposition = false,
}: {
  src: string;
  alt: string;
  caption?: string;
  preserveComposition?: boolean;
}) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? ['0%', '0%'] : ['-8%', '8%']);

  if (preserveComposition) {
    return (
      <section className="relative w-full overflow-hidden bg-primary">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="block h-auto w-full object-contain"
        />
        {caption && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 mx-auto max-w-3xl px-6 pb-16 text-center sm:px-8">
              <p className="font-serif text-[clamp(1.35rem,2.6vw,2rem)] leading-[1.4] text-inverse">
                {caption}
              </p>
            </div>
          </>
        )}
      </section>
    );
  }

  return (
    <section ref={ref} className="relative h-[70vh] min-h-[420px] w-full overflow-hidden bg-primary">
      <motion.div style={{ y }} className="absolute inset-[-8%]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-center"
        />
      </motion.div>
      {caption && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-3xl px-6 pb-16 text-center sm:px-8">
            <p className="font-serif text-[clamp(1.35rem,2.6vw,2rem)] leading-[1.4] text-inverse">
              {caption}
            </p>
          </div>
        </>
      )}
    </section>
  );
}
