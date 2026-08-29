'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { Button } from '@/components/ui/Button';
import { teachers } from '@/content/teachers';
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion';

/**
 * Home → "Meet the Teachers" (2026 refinement).
 *
 * The teachers, now with confirmed portraits — a more human, more trustworthy section
 * than the previous monogram grid. Photographs ease gently into place as the row enters
 * the viewport. Each card links to the full profile at /teachers/[slug].
 *
 * The physician-meditator (Dr. Sasi Vadana) sits in the same treatment as everyone else
 * — part of the community, not a clinical addition.
 */
export function HomeTeachers() {
  const reduced = usePrefersReducedMotion();

  return (
    <section className="bg-bg px-6 py-16 sm:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <RevealOnScroll className="mb-12 max-w-2xl">
          <span className="eyebrow eyebrow--tick mb-5">Meet the Teachers</span>
          <h2 className="text-balance font-serif text-[clamp(1.6rem,3.4vw,2.6rem)] font-normal leading-[1.22] text-primary">
            One lineage. Many teachers. One intention.
          </h2>
          <p className="prose-measure mt-5 text-body-lg text-secondary">
            A growing community of Classical Hatha Yoga teachers, each certified over
            1,750 hours at Sadhguru Gurukulam — united by one aim: to offer these
            practices in their authentic form.
          </p>
        </RevealOnScroll>

        <ul className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          {teachers.map((t, i) => (
            <RevealOnScroll as="li" key={t.slug} delay={(i % 5) * 0.08}>
              <Link
                href={`/teachers/${t.slug}`}
                className="group block focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <motion.div
                  whileHover={reduced ? undefined : { y: -4 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="relative aspect-[4/5] w-full overflow-hidden rounded-[10px] bg-bg-alt shadow-soft ring-1 ring-black/[0.05]"
                >
                  {t.photo ? (
                    <Image
                      src={t.photo}
                      alt={t.photoAlt ?? t.name}
                      fill
                      sizes="(min-width: 1024px) 18vw, (min-width: 640px) 30vw, 45vw"
                      className="object-cover transition-transform duration-[900ms] ease-calm group-hover:scale-[1.03]"
                    />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center font-serif text-[2.5rem] text-moss/25">
                      {t.name.charAt(0)}
                    </span>
                  )}
                  <span className="pointer-events-none absolute inset-0 rounded-[10px] ring-1 ring-inset ring-gold/10" />
                </motion.div>
                <h3 className="mt-4 font-serif text-[1.05rem] leading-snug text-primary">
                  {t.name}
                </h3>
                <p className="mt-1 text-micro uppercase tracking-[0.14em] text-secondary">
                  {t.role}
                </p>
              </Link>
            </RevealOnScroll>
          ))}
        </ul>

        <RevealOnScroll delay={0.1} className="mt-12">
          <Button href="/teachers" variant="text">
            Meet the teachers
          </Button>
        </RevealOnScroll>
      </div>
    </section>
  );
}
