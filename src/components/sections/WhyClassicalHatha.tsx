import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { YouTubeFacade } from '@/components/ui/YouTubeFacade';
import { Button } from '@/components/ui/Button';

/**
 * Home → "Why Classical Hatha Yoga?" (2026 refinement).
 *
 * The second major beat of the homepage story. It makes the case for Classical Hatha
 * Yoga as an inner science rather than exercise, stretching, or stress relief —
 * educational and a little philosophical, but written for someone entirely new. A single
 * Sadhguru talk sits below the statement as the one piece of moving image in the upper
 * half of the page.
 */
export function WhyClassicalHatha() {
  return (
    <section className="bg-bg-alt px-6 py-20 sm:px-8 md:py-32">
      <div className="mx-auto max-w-4xl">
        <RevealOnScroll variant="rise">
          <span className="eyebrow eyebrow--tick mb-6 block">Why Classical Hatha Yoga</span>
          <h2 className="max-w-3xl text-balance font-serif text-[clamp(1.6rem,3.4vw,2.6rem)] font-normal leading-[1.22] text-primary">
            Not exercise, not stretching, not a way to relax — a complete inner science.
          </h2>
          <div className="prose-measure mt-8 space-y-4 text-body-lg text-secondary">
            <p>
              Classical Hatha Yoga is often mistaken for a fitness routine. In its
              original form it is something quite different: a precise system for bringing
              the body, breath, mind, and energy into alignment, so that life is met with
              more stability and clarity.
            </p>
            <p>
              The postures are not held to be performed or perfected. Each one is a
              deliberate process — a way of organising the human system so that health,
              steadiness, and a quieter mind become natural rather than pursued. Kept in
              its classical structure, and practised consistently, it works on dimensions
              that exercise cannot reach.
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll variant="soft" delay={0.1} className="mt-14">
          <YouTubeFacade
            id="UIK3hR-NjYU"
            poster="/images/home/why-chy-video.webp"
            title="Sadhguru — The Incredible Power of Classical Hatha Yoga"
          />
          <p className="mt-3 text-caption text-secondary">
            Sadhguru on what Classical Hatha Yoga is, and what it can do.
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={0.15} className="mt-10">
          <Button href="/about" variant="text">
            More on the practice
          </Button>
        </RevealOnScroll>
      </div>
    </section>
  );
}
