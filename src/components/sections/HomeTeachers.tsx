import Link from 'next/link';
import Image from 'next/image';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { Button } from '@/components/ui/Button';
import { teachers } from '@/content/teachers';

/**
 * Home → "Meet the Teachers" (2026 visual polish).
 *
 * People being introduced to the visitor — not a photo gallery. Small, consistent
 * portraits on a quiet backdrop, name and role given equal weight, generous whitespace.
 * On hover or keyboard focus the card lifts a few pixels toward the reader (the shared
 * `.tactile` vocabulary) — a lift, not a zoom. Removed under prefers-reduced-motion.
 *
 * Dr. Sasi Vadana (physician & meditator) sits in the same treatment as everyone else.
 */
export function HomeTeachers() {
  return (
    <section className="bg-bg px-6 py-20 sm:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <RevealOnScroll variant="rise" className="mb-16 max-w-2xl">
          <span className="eyebrow eyebrow--tick mb-6 block">Meet the Teachers</span>
          <h2 className="text-balance font-serif text-[clamp(1.6rem,3.4vw,2.6rem)] font-normal leading-[1.22] text-primary">
            One lineage. Many teachers. One intention.
          </h2>
          <p className="prose-measure mt-8 text-body-lg text-secondary">
            A growing community of Classical Hatha Yoga teachers, each certified over
            1,750 hours at Sadhguru Gurukulam — united by one aim: to offer these
            practices in their authentic form.
          </p>
        </RevealOnScroll>

        <ul className="mx-auto grid max-w-4xl grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 sm:gap-x-8 lg:grid-cols-5">
          {teachers.map((t, i) => (
            <RevealOnScroll as="li" key={t.slug} delay={0.04 + (i % 5) * 0.06}>
              <Link
                href={`/teachers/${t.slug}`}
                className="tactile group block rounded-[10px] focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[10px] bg-bg-alt ring-1 ring-black/[0.04]">
                  {t.photo ? (
                    <Image
                      src={t.photo}
                      alt={t.photoAlt ?? t.name}
                      fill
                      sizes="(min-width: 1024px) 12vw, (min-width: 640px) 22vw, 40vw"
                      className="object-cover"
                    />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center font-serif text-[2rem] text-moss/25">
                      {t.name.charAt(0)}
                    </span>
                  )}
                  <span className="pointer-events-none absolute inset-0 rounded-[10px] ring-1 ring-inset ring-gold/10" />
                </div>
                <h3 className="mt-4 font-serif text-[1rem] leading-snug text-primary transition-colors duration-300 group-hover:text-moss">
                  {t.name}
                </h3>
                <p className="mt-1 text-micro uppercase tracking-[0.14em] text-secondary">
                  {t.role}
                </p>
              </Link>
            </RevealOnScroll>
          ))}
        </ul>

        <RevealOnScroll delay={0.1} className="mt-14">
          <Button href="/teachers" variant="text">
            Meet the teachers
          </Button>
        </RevealOnScroll>
      </div>
    </section>
  );
}
