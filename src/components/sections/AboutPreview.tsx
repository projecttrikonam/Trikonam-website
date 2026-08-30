import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import { Button } from '@/components/ui/Button';

/**
 * Home → an intimate first meeting with Trikonam (client redesign; 2026 interaction layer).
 *
 * Asymmetric and unhurried: a single warm photograph given room, a narrow column of
 * text offset beside it, and a great deal of air. The words settle in as one quiet
 * movement, and the photograph drifts a few pixels within its frame as the section
 * passes — alive, never a zoom.
 */
export function AboutPreview() {
  return (
    <section className="px-6 py-20 sm:px-8 md:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-12 md:gap-16">
        {/* Text — a narrow, quiet column. */}
        <RevealOnScroll variant="rise" className="md:col-span-4">
          <span className="eyebrow mb-6 block">A space, not a studio</span>
          <p className="font-serif text-[clamp(1.17rem,1.98vw,1.55rem)] leading-[1.5] text-primary">
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

        {/* Image — offset, with a restrained parallax drift. */}
        <RevealOnScroll variant="soft" delay={0.1} className="md:col-span-6 md:col-start-7">
          <ResponsiveImage
            src="/images/home/about-preview.webp"
            alt="A lone practitioner sits in deep meditation within a rock hollow beside a mountain waterfall."
            aspect="aspect-[3/2]"
            sizes="(min-width: 768px) 50vw, 100vw"
            parallax
          />
        </RevealOnScroll>
      </div>
    </section>
  );
}
