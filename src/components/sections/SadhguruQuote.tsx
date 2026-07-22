import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import type { Quote } from '@/content/quotes';

/**
 * A single Sadhguru quote, given room to breathe (client-supplied, used with
 * permission). Two tones:
 *   • 'light'  — quiet band on the ivory/sand palette
 *   • 'dark'   — an immersive espresso band for a deeper pause
 *
 * Intentionally restrained: large serif measure, a hairline gold rule, a faint breath
 * mark. Never a loud pull-quote.
 */
export function SadhguruQuote({
  quote,
  tone = 'light',
  compact = false,
}: {
  quote: Quote;
  tone?: 'light' | 'dark';
  /** Tighter vertical padding (used on the home page to reduce excess whitespace). */
  compact?: boolean;
}) {
  const dark = tone === 'dark';

  return (
    <section
      className={`relative overflow-hidden px-6 sm:px-8 ${
        compact ? 'py-16 md:py-24' : 'py-28 md:py-40'
      } ${dark ? 'bg-primary' : 'bg-transparent'}`}
    >
      {dark && (
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_-10%,rgba(91,107,78,0.22),transparent_60%)]" />
      )}
      <RevealOnScroll className="relative mx-auto max-w-3xl text-center">
        <span aria-hidden className="mx-auto mb-8 block h-px w-12 bg-gradient-to-r from-gold/0 via-gold to-gold/0" />
        <blockquote
          className={`text-balance font-serif text-[clamp(1.3rem,2.88vw,2.18rem)] font-normal leading-[1.36] ${
            dark ? 'text-inverse' : 'text-primary'
          }`}
        >
          {quote.text}
        </blockquote>
        <cite
          className={`mt-8 block text-label uppercase not-italic tracking-[0.2em] ${
            dark ? 'text-inverse/70' : 'text-moss'
          }`}
        >
          — {quote.author}
        </cite>
      </RevealOnScroll>
    </section>
  );
}
