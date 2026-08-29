'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { teachers } from '@/content/teachers';
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion';

/**
 * Teacher cards (Handoff §6.3; 2026 refinement).
 *
 * Each card now leads with a confirmed portrait (client-supplied, graded to one calm
 * register) and links through to the full bio at /teachers/[slug]. A teacher without a
 * `photo` keeps the earlier monogram-in-a-breath-ring treatment.
 */
export function TeacherGrid() {
  const reduced = usePrefersReducedMotion();

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {teachers.map((t, i) => (
        <RevealOnScroll as="li" key={t.slug} delay={(i % 3) * 0.06} className="h-full">
          <Link
            href={`/teachers/${t.slug}`}
            className="block h-full focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <motion.article
              whileHover={reduced ? undefined : { y: -4 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="group flex h-full flex-col overflow-hidden rounded-[12px] surface-elevated ring-1 ring-black/[0.04] transition-shadow duration-500 hover:shadow-lift"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-bg-alt">
                {t.photo ? (
                  <Image
                    src={t.photo}
                    alt={t.photoAlt ?? t.name}
                    fill
                    sizes="(min-width: 1024px) 24rem, (min-width: 640px) 45vw, 100vw"
                    className="object-cover transition-transform duration-[900ms] ease-calm group-hover:scale-[1.03]"
                  />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center font-serif text-[3rem] text-moss/20">
                    {t.name.charAt(0)}
                  </span>
                )}
                <span className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-gold/10" />
              </div>

              <div className="flex flex-1 flex-col p-7">
                <h3 className="font-serif text-[1.3rem] text-primary">{t.name}</h3>
                <p className="mt-1.5 text-[0.72rem] uppercase tracking-[0.16em] text-secondary">
                  {t.role}
                </p>
                <span aria-hidden className="my-4 block h-px w-8 bg-gradient-to-r from-gold/50 to-gold/0" />
                <p className="flex-1 text-caption leading-relaxed text-secondary">{t.summary}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-label font-medium uppercase tracking-[0.12em] text-moss">
                  Read more
                </span>
              </div>
            </motion.article>
          </Link>
        </RevealOnScroll>
      ))}
    </ul>
  );
}
