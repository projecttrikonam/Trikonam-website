import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import { Button } from '@/components/ui/Button';

/**
 * Home → an intimate first meeting with Trikonam (client redesign; 2026 interaction layer).
 *
 * Asymmetric and unhurried: a single warm photograph given room, a narrow column of
 * text offset beside it, and a great deal of air. The words arrive in three quiet beats
 * (eyebrow → statement → link), and the photograph drifts a few pixels within its frame
 * as the section passes — alive, never a zoom.
 */
export function AboutPreview() {
  return (
    <section className="px-6 py-16 sm:px-8 md:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-12 md:gap-16">
        {/* Text — a narrow, quiet column, revealed in beats. */}
        <div className="md:col-span-4">
          <RevealOnScroll>
            <span className="eyebrow mb-6 block">A space, not a studio</span>
          </RevealOnScroll>
          <RevealOnScroll delay={0.08}>
            <p className="font-serif text-[clamp(1.17rem,1.98vw,1.55rem)] leading-[1.5] text-primary">
              Trikonam is a place to meet the practice in its original form — offered with
              sincerity, and the trust that consistency, not persuasion, is what creates
              change.
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.16}>
            <div className="mt-8">
              <Button href="/about" variant="text">
                About Trikonam
              </Button>
            </div>
          </RevealOnScroll>
        </div>

        {/* Image — larger, offset, with a restrained parallax drift. */}
        <RevealOnScroll variant="soft" delay={0.1} className="md:col-span-7 md:col-start-6">
          <ResponsiveImage
            src="/images/home/about-preview.webp"
            alt="A lone practitioner sits in deep meditation within a rock hollow beside a mountain waterfall."
            aspect="aspect-[3/2]"
            sizes="(min-width: 768px) 58vw, 100vw"
            parallax
          />
        </RevealOnScroll>
      </div>
    </section>
  );
}
