import Link from 'next/link';
import Image from 'next/image';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { teachers } from '@/content/teachers';

/**
 * Teacher cards (Handoff §6.3; 2026 visual polish).
 *
 * Quiet, human, editorial. Each card is just a portrait on a calm backdrop, then the
 * name, the role, a one-line introduction, and a "Read more" affordance — no boxed card
 * chrome, so the person and their identity carry equal weight. Consistent proportions
 * across all five (and consistent with the homepage). On hover or keyboard focus the
 * card lifts a few pixels toward the reader — a lift, not a zoom; removed under
 * prefers-reduced-motion. A teacher without a `photo` keeps the monogram.
 */
export function TeacherGrid() {
  return (
    <ul className="mx-auto grid max-w-4xl grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 sm:gap-x-8 lg:grid-cols-5">
      {teachers.map((t, i) => (
        <RevealOnScroll as="li" key={t.slug} delay={0.04 + (i % 5) * 0.06} className="h-full">
          <Link
            href={`/teachers/${t.slug}`}
            className="tactile group flex h-full flex-col rounded-[10px] focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[10px] bg-bg-alt ring-1 ring-black/[0.04]">
              {t.photo ? (
                <Image
                  src={t.photo}
                  alt={t.photoAlt ?? t.name}
                  fill
                  sizes="(min-width: 1024px) 15vw, (min-width: 640px) 26vw, 44vw"
                  className="object-cover"
                />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center font-serif text-[2rem] text-moss/25">
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
            <p className="mt-2.5 line-clamp-2 flex-1 text-caption leading-relaxed text-secondary">
              {t.summary}
            </p>
            <span className="mt-3 inline-flex items-center gap-1.5 text-fine font-medium uppercase tracking-[0.12em] text-moss">
              Read more
              <svg width="13" height="9" viewBox="0 0 13 9" fill="none" aria-hidden className="transition-transform duration-300 ease-calm group-hover:translate-x-0.5">
                <path d="M1 4.5h10M8 1l3.5 3.5L8 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Link>
        </RevealOnScroll>
      ))}
    </ul>
  );
}
