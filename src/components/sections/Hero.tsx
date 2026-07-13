'use client';

import { motion } from 'framer-motion';
import { BeginJourneyButton } from '@/components/ui/BeginJourneyButton';
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion';

/**
 * Home hero — an immersive, full-screen arrival (client redesign).
 *
 * One exceptional photograph (a solitary meditation in a waterfall cave) fills the
 * viewport. Elegant type rests over it, lifted by a soft gradient rather than a box.
 * The only motion is an almost-imperceptible slow drift of the image and a gentle
 * fade-up of the words — nothing jumps. The header sits transparent over this and
 * solidifies on scroll.
 *
 * No decorative devices (the outlined ring is gone). The image is meant to be felt,
 * not read.
 */
export function Hero() {
  const reduced = usePrefersReducedMotion();

  return (
    <section className="relative -mt-24 h-[100svh] min-h-[600px] w-full overflow-hidden bg-primary">
      {/* The photograph fills the frame — a single figure at dusk, centred so it holds
          on both wide screens and tall phones. Rendered as a plain <img> for reliable
          full-bleed painting; it simply rests there. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/home/hero.webp"
        alt="A practitioner sits in quiet meditation at dusk, mountains softening into the distance."
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* Soft gradients for legibility — the middle is left clear so the photograph is
          felt, with just enough veil at top (for the nav) and bottom (for the words). */}
      <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-primary/45 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-primary/85 via-primary/25 to-transparent" />

      {/* Words, resting low. */}
      <div className="absolute inset-x-0 bottom-0 top-0 flex items-end">
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
            className="mt-7 max-w-md text-body-lg leading-relaxed text-inverse/85"
          >
            A quiet space for the practice, kept in its original form.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: reduced ? 0 : 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.9 }}
            className="mt-9"
          >
            <BeginJourneyButton />
          </motion.div>
        </div>
      </div>

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
