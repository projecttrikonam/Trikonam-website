'use client';

import { motion } from 'framer-motion';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { teachers } from '@/content/teachers';
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion';

/**
 * Teacher cards (Handoff §6.3) — Creative Director revision. NAMES ONLY for now: no
 * bios yet, and no photo is captioned with a name (none confirmed, §14.5). Each card
 * is a calm, elevated panel with a serif monogram inside a breath ring, the name, a
 * role label, and a quiet "Introduction to come" note — so the current absence of a
 * bio reads as intentional restraint, not a broken state.
 */
export function TeacherGrid() {
  const reduced = usePrefersReducedMotion();

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {teachers.map((t, i) => (
        <RevealOnScroll as="li" key={t.slug} delay={(i % 3) * 0.06}>
          <motion.article
            whileHover={reduced ? undefined : { y: -4 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="group flex h-full flex-col items-center overflow-hidden rounded-[12px] surface-elevated px-8 py-10 text-center ring-1 ring-black/[0.04] transition-shadow duration-500 hover:shadow-lift"
          >
            {/* Monogram within a breath ring. */}
            <div className="relative flex h-24 w-24 items-center justify-center">
              <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
                <circle
                  cx="50"
                  cy="50"
                  r="47"
                  fill="none"
                  className="stroke-moss/25"
                  strokeWidth="1"
                />
              </svg>
              <div className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-bg-alt">
                <span className="font-serif text-[2rem] text-moss">{t.name.charAt(0)}</span>
              </div>
            </div>
            <h3 className="mt-6 font-serif text-[1.4rem] text-primary">{t.name}</h3>
            <p className="mt-1.5 text-[0.75rem] uppercase tracking-[0.16em] text-secondary">
              {t.role}
            </p>
            <span aria-hidden className="my-5 block h-px w-8 bg-gradient-to-r from-gold/50 to-gold/0" />
            <p className="text-[0.8rem] italic text-secondary/70">Introduction to come</p>
          </motion.article>
        </RevealOnScroll>
      ))}
    </ul>
  );
}
