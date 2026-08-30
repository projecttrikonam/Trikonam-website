import Link from 'next/link';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { BreathMark } from '@/components/ui/BreathMark';

/**
 * Home → Practice Compass invitation (2026 refinement).
 *
 * A deliberately distinct feature panel — a warm-dark card with a gold glow — so the
 * assessment reads as an inviting moment rather than blending into the ivory sections
 * around it. Placed after "What can practice become" and before "Upcoming".
 */
export function PracticeCompassInvite() {
  return (
    <section className="bg-bg px-6 pb-16 pt-0 sm:px-8 md:pb-24">
      <RevealOnScroll variant="rise" className="mx-auto max-w-5xl">
        <div className="relative isolate overflow-hidden rounded-[22px] bg-primary px-6 py-14 text-center shadow-lift sm:px-14 sm:py-16">
          {/* Warm light — gold from above, a breath of moss from below. */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_90%_at_50%_-10%,rgba(168,124,61,0.28),transparent_60%)]" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_90%_at_50%_120%,rgba(91,107,78,0.22),transparent_55%)]" />
          <BreathMark
            className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2"
            strokeClassName="stroke-gold"
            opacity={0.22}
          />

          <div className="relative">
            <span className="mb-4 inline-flex items-center gap-2.5 text-[0.78rem] font-medium uppercase tracking-[0.2em] text-gold-leaf">
              <span aria-hidden className="h-px w-7 bg-gold-leaf/60" />
              Practice Compass
            </span>
            <h2 className="text-balance font-serif text-[clamp(1.7rem,3.6vw,2.5rem)] font-normal leading-[1.15] text-inverse">
              Find where your practice begins.
            </h2>
            <p className="prose-measure mx-auto mt-4 text-body-lg leading-relaxed text-inverse/80">
              Ten quiet questions — no score, no sign-up. Just a clearer sense of the
              practice, the journey, and the first step that suits you right now.
            </p>

            <div className="mt-9">
              <Link
                href="/practice-compass"
                className="inline-flex items-center justify-center gap-2 rounded-[8px] gradient-gold px-8 py-4 text-[0.98rem] font-medium tracking-[0.01em] text-inverse shadow-lift ring-1 ring-inset ring-white/15 transition-all duration-300 ease-calm hover:-translate-y-0.5 hover:brightness-[1.08] focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Take the Assessment
                <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden>
                  <path d="M1 6h15M11 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

            <p className="mt-5 text-caption uppercase tracking-[0.16em] text-inverse/45">
              10 questions · about 2 minutes · not a health score
            </p>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
