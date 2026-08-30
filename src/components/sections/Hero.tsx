'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion';

/**
 * Home hero — an immersive, full-screen arrival (2026 interaction layer).
 *
 * One exceptional photograph fills the viewport. Elegant type rests over it, lifted by a
 * soft gradient rather than a box. On load the image settles from a hair of extra scale;
 * as the reader scrolls on, it drifts up a little and the words fade — the hero recedes
 * so the story can rise over it. Nothing reads as a zoom.
 *
 * There is deliberately NO call-to-action button here: "Begin Your Journey" lives once,
 * in the navigation, and the Practice Compass invitation appears as a small card.
 */
export function Hero() {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], reduced ? ['0%', '0%'] : ['0%', '-9%']);
  const wordsY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -40]);
  const wordsOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative -mt-24 h-[100svh] min-h-[600px] w-full overflow-hidden bg-primary"
    >
      {/* The photograph fills the frame. A 12s ease-out drift from a hair of extra scale
          gives the arrival a sense of settling; a small scroll-linked rise lets it
          recede as the reader moves on. */}
      <motion.div
        className="absolute inset-0"
        style={{ y: imgY }}
        initial={{ scale: reduced ? 1.16 : 1.22 }}
        animate={{ scale: 1.16 }}
        transition={{ duration: 12, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/home/hero.webp"
          alt="A practitioner sits in quiet meditation at dusk, mountains softening into the distance."
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      </motion.div>

      {/* Soft gradients for legibility. */}
      <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-primary/45 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-primary/85 via-primary/25 to-transparent" />

      {/* Words, resting low — they lift and fade as the reader scrolls on. */}
      <motion.div
        style={{ y: wordsY, opacity: wordsOpacity }}
        className="absolute inset-x-0 bottom-0 top-0 flex items-end"
      >
        <div className="mx-auto w-full max-w-6xl px-6 pb-24 sm:px-8 md:pb-28">
          <motion.p
            initial={{ opacity: 0, y: reduced ? 0 : 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="mb-6 text-[0.78rem] uppercase tracking-[0.22em] text-inverse/75"
          >
            Authentic Classical Hatha Yoga
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: reduced ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.45 }}
            className="max-w-3xl font-serif text-[clamp(2.75rem,7vw,5.5rem)] font-normal leading-[1.02] tracking-[-0.02em] text-inverse"
          >
            Return to stillness.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: reduced ? 0 : 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.7 }}
            className="mt-7 max-w-lg text-body-lg leading-relaxed text-inverse/85"
          >
            A quiet space for the practice, kept in its original form.
          </motion.p>
        </div>
      </motion.div>

      {/* A whisper of a scroll cue. */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1.2 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:block"
      >
        <span className="relative block h-12 w-px overflow-hidden bg-inverse/25">
          {!reduced && (
            <motion.span
              className="absolute inset-x-0 top-0 h-4 bg-inverse/70"
              animate={{ y: [-16, 48] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
        </span>
      </motion.div>
    </section>
  );
}
