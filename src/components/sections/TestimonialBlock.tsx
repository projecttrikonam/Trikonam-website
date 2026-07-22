import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { testimonials } from '@/content/testimonials';

/**
 * Testimonials (Handoff §6.1 item 5, §6.10, §7.5) — Creative Director revision.
 *
 * The two real, anonymous stories, presented as a quiet, unhurried reading experience
 * — deliberately not a carousel-of-stars (§7.5). Editorial treatment: a faint index
 * numeral, a short gold rule, and generous serif measure. No names, titles, or photos
 * are attached (§7.5).
 */
export function TestimonialBlock({
  heading,
  limit,
}: {
  heading?: string;
  /** Show only the first N stories (the home page shows one). */
  limit?: number;
}) {
  const items = limit ? testimonials.slice(0, limit) : testimonials;
  return (
    <div>
      {heading && (
        <RevealOnScroll className="mx-auto mb-16 max-w-2xl text-center">
          <span className="eyebrow eyebrow--tick mx-auto mb-5 w-fit">In Their Words</span>
          <h2 className="text-balance text-h2">{heading}</h2>
        </RevealOnScroll>
      )}

      <div className="mx-auto flex max-w-3xl flex-col gap-20">
        {items.map((t, i) => (
          <RevealOnScroll key={t.id}>
            <figure className="relative">
              {/* Faint editorial index numeral. */}
              <span
                aria-hidden
                className="pointer-events-none absolute -left-2 -top-10 select-none font-serif text-[6rem] leading-none text-moss/[0.08] sm:-left-10 sm:text-[7.5rem]"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span aria-hidden className="mb-6 block h-px w-12 bg-gradient-to-r from-gold to-gold/0" />
              <blockquote className="relative font-serif text-[1.4rem] font-normal leading-[1.62] text-primary text-pretty sm:text-[1.55rem] sm:leading-[1.6]">
                {t.quote}
              </blockquote>
              <figcaption className="mt-7 text-label uppercase tracking-[0.16em] text-secondary">
                — A Trikonam student
              </figcaption>
            </figure>
          </RevealOnScroll>
        ))}
      </div>
    </div>
  );
}
