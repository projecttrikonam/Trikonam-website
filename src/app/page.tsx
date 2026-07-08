import type { Metadata } from 'next';
import { Hero } from '@/components/sections/Hero';
import { AboutPreview } from '@/components/sections/AboutPreview';
import { FullBleedInterlude } from '@/components/sections/FullBleedInterlude';
import { TestimonialBlock } from '@/components/sections/TestimonialBlock';
import { DeeperVisionClosing } from '@/components/sections/DeeperVisionClosing';
import { SadhguruQuote } from '@/components/sections/SadhguruQuote';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { Button } from '@/components/ui/Button';
import { quotes } from '@/content/quotes';
import { siteConfig } from '@/content/site-config';
import { pageMetadata } from '@/lib/seo';

// The home page previously had no metadata of its own (it only inherited the root
// layout's defaults), which meant it emitted no canonical URL and no page-specific
// Open Graph `url`. Every other route uses pageMetadata() for this; the home page now
// does too, using `title: { absolute }` so it keeps the layout's exact default title
// instead of picking up the `%s · Trikonam` template.
export const metadata: Metadata = pageMetadata({
  title: { absolute: 'Trikonam · Classical Hatha Yoga' },
  description: siteConfig.description,
  path: '/',
});

/**
 * Home — a single, unfolding story rather than a stack of sections (client redesign).
 *
 * The rhythm is deliberate — image, then a held breath of words, then an intimate
 * meeting, then quiet, then a full-bleed exhale, then one voice, and finally the vision
 * resting in the dark. Generous air between each; nothing repeats; nothing hurries.
 */
export default function HomePage() {
  return (
    <>
      <Hero />

      {/* A held breath — the frame, in Sadhguru's words. */}
      <SadhguruQuote quote={quotes.yogaProcess} tone="light" compact />

      {/* An intimate first meeting with Trikonam. */}
      <AboutPreview />

      {/* The practices — an invitation, not a directory. */}
      <section className="px-6 py-16 sm:px-8 md:py-24">
        <RevealOnScroll className="mx-auto max-w-xl text-center">
          <span className="eyebrow mb-6 block">Classical Hatha Yoga</span>
          <p className="font-serif text-[clamp(1.5rem,2.6vw,2rem)] leading-[1.4] text-primary">
            A set of practices, kept in their original form and structured by Sadhguru —
            each one a quiet, deliberate process rather than a posture to perfect.
          </p>
          <div className="mt-9">
            <Button href="/practices" variant="text">
              Explore the practices
            </Button>
          </div>
        </RevealOnScroll>
      </section>

      {/* A wordless exhale — a shared practice at sunrise. Shown at its full, uncropped
          composition (preserveComposition) so every practitioner stays in frame. */}
      <FullBleedInterlude
        src="/images/home/interlude.webp"
        alt="Rows of practitioners hold a posture together at sunrise, facing an open horizon."
        preserveComposition
      />

      {/* One voice. */}
      <section className="px-6 py-16 sm:px-8 md:py-24">
        <TestimonialBlock limit={1} />
        <RevealOnScroll className="mt-12 text-center">
          <Button href="/testimonials" variant="text">
            Read another story
          </Button>
        </RevealOnScroll>
      </section>

      {/* The vision, resting in the quiet. No CTA follows. */}
      <DeeperVisionClosing />
    </>
  );
}
