import Link from 'next/link';
import Image from 'next/image';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { Button } from '@/components/ui/Button';
import { teachers } from '@/content/teachers';

/**
 * Home → "Meet the Teachers" (2026 interaction layer).
 *
 * The teachers, with confirmed portraits. Photographs ease in as the row enters the
 * viewport, staggered one after another; on hover or keyboard focus each portrait card
 * lifts a few pixels toward the reader and the image drifts gently within its frame —
 * the shared `.tactile` vocabulary, pure CSS, disabled under prefers-reduced-motion.
 *
 * Dr. Sasi Vadana (physician & meditator) sits in the same treatment as everyone else.
 */
export function HomeTeachers() {
  return (
    <section className="bg-bg px-6 py-16 sm:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <RevealOnScroll className="max-w-2xl">
          <span className="eyebrow eyebrow--tick mb-5">Meet the Teachers</span>
        </RevealOnScroll>
        <RevealOnScroll variant="rise" delay={0.06}>
          <h2 className="max-w-2xl text-balance font-serif text-[clamp(1.6rem,3.4vw,2.6rem)] font-normal leading-[1.22] text-primary">
            One lineage. Many teachers. One intention.
          </h2>
        </RevealOnScroll>
        <RevealOnScroll delay={0.14}>
          <p className="prose-measure mt-5 max-w-2xl text-body-lg text-secondary">
            A growing community of Classical Hatha Yoga teachers, each certified over
            1,750 hours at Sadhguru Gurukulam — united by one aim: to offer these
            practices in their authentic form.
          </p>
        </RevealOnScroll>

        <ul className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          {teachers.map((t, i) => (
            <RevealOnScroll as="li" key={t.slug} delay={0.05 + (i % 5) * 0.08}>
              <Link
                href={`/teachers/${t.slug}`}
                className="tactile group block rounded-[10px] focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[10px] bg-bg-alt shadow-soft ring-1 ring-black/[0.05]">
                  {t.photo ? (
                    <Image
                      src={t.photo}
                      alt={t.photoAlt ?? t.name}
                      fill
                      sizes="(min-width: 1024px) 18vw, (min-width: 640px) 30vw, 45vw"
                      className="tactile-media object-cover"
                    />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center font-serif text-[2.5rem] text-moss/25">
                      {t.name.charAt(0)}
                    </span>
                  )}
                  <span className="pointer-events-none absolute inset-0 rounded-[10px] ring-1 ring-inset ring-gold/10" />
                </div>
                <h3 className="mt-4 font-serif text-[1.05rem] leading-snug text-primary transition-colors duration-300 group-hover:text-moss">
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
