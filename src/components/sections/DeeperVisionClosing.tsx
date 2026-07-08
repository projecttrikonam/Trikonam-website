'use client';

import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion';

/**
 * The closing (Handoff §2.3, §6.1 item 6) — client redesign.
 *
 * The poetic vision, the brand's emotional core, given a warm-dark room of its own and
 * nothing else — no photograph, no device. The words rise in slowly, like a held breath
 * releasing, and rest in the quiet. It is meant to close, not to pitch: there is no CTA
 * beneath it. This is the one place the deeper vision appears.
 */
export function DeeperVisionClosing() {
  const reduced = usePrefersReducedMotion();

  const line = {
    hidden: { opacity: 0, y: reduced ? 0 : 16 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 1.1, delay: i * 0.18, ease: [0.22, 1, 0.36, 1] as const },
    }),
  };

  return (
    <section className="relative isolate overflow-hidden bg-primary">
      <div className="absolute inset-0 bg-[radial-gradient(130%_100%_at_50%_0%,rgba(91,107,78,0.16),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_120%,rgba(138,98,48,0.12),transparent_55%)]" />

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-15% 0px' }}
        className="relative mx-auto max-w-2xl px-6 py-24 text-center sm:px-8 md:py-32"
      >
        <motion.p
          custom={0}
          variants={line}
          className="font-serif text-[clamp(1.9rem,4vw,3rem)] leading-[1.3] text-inverse"
        >
          Trikonam exists to help people return to themselves.
        </motion.p>
        <div className="mx-auto mt-12 max-w-xl space-y-7 text-body-lg leading-relaxed text-inverse/80">
          <motion.p custom={1} variants={line}>
            We begin where most people are ready to begin — a healthier body, a quieter
            mind, a life that simply works better. But underneath is a deeper unfolding,
            one we never rush and never announce.
          </motion.p>
          <motion.p custom={2} variants={line} className="font-serif text-[1.3rem] italic text-inverse">
            Not the pursuit of happiness. The remembering of it.
          </motion.p>
          <motion.p custom={3} variants={line}>
            This is not a program with an end date. It is a way of living that continues
            to reveal itself, one still moment at a time.
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
