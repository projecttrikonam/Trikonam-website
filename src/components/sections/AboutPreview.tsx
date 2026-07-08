import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import { Button } from '@/components/ui/Button';

/**
 * Home → an intimate first meeting with Trikonam (client redesign).
 *
 * Asymmetric and unhurried: a single warm photograph given room, a narrow column of
 * text offset beside it, and a great deal of air. No card, no ring — just image, words,
 * and space. Says little, and lets the rest be felt.
 */
export function AboutPreview() {
  return (
    <section className="px-6 py-16 sm:px-8 md:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-12 md:gap-16">
        {/* Text — a narrow, quiet column. */}
        <RevealOnScroll className="md:col-span-4">
          <span className="eyebrow mb-6 block">A space, not a studio</span>
          <p className="font-serif text-[clamp(1.35rem,2.2vw,1.7rem)] leading-[1.5] text-primary">
            Trikonam is a place to meet the practice in its original form — offered with
            sincerity, and the trust that consistency, not persuasion, is what creates
            change.
          </p>
          <div className="mt-8">
            <Button href="/about" variant="text">
              About Trikonam
            </Button>
          </div>
        </RevealOnScroll>

        {/* Image — larger, offset. */}
        <RevealOnScroll delay={0.1} className="md:col-span-7 md:col-start-6">
          <ResponsiveImage
            src="/images/home/about-preview.webp"
            alt="A lone practitioner sits in deep meditation within a rock hollow beside a mountain waterfall."
            aspect="aspect-[3/2]"
            sizes="(min-width: 768px) 58vw, 100vw"
          />
        </RevealOnScroll>
      </div>
    </section>
  );
}
