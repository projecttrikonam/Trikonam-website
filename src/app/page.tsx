import type { Metadata } from 'next';
import { Hero } from '@/components/sections/Hero';
import { AboutPreview } from '@/components/sections/AboutPreview';
import { FullBleedInterlude } from '@/components/sections/FullBleedInterlude';
import { TestimonialBlock } from '@/components/sections/TestimonialBlock';
import { DeeperVisionClosing } from '@/components/sections/DeeperVisionClosing';
import { SadhguruQuote } from '@/components/sections/SadhguruQuote';
import { OnlinePromoCard } from '@/components/sections/OnlinePromoCard';
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
      {/* v2.0: a calm one-time invitation to the live Online Programs. Additive only —
          it overlays nothing structural and the sections below are unchanged. */}
      <OnlinePromoCard />

      {/* Start the hero download at the very top of the document, before the browser has
          even parsed the <img>. The hero section paints bg-primary (dark espresso) until
          the photograph arrives, so any delay shows as a full-viewport dark flash on
          desktop where the section is 100svh. */}
      <link rel="preload" as="image" href="/images/home/hero.webp" fetchPriority="high" />
      <Hero />

      {/* A held breath — the frame, in Sadhguru's words. */}
      <SadhguruQuote quote={quotes.yogaProcess} tone="light" compact />

      {/* An intimate first meeting with Trikonam. */}
      <AboutPreview />

      {/* The practices — an invitation, not a directory. */}
      <section className="px-6 py-16 sm:px-8 md:py-24">
        <RevealOnScroll className="mx-auto max-w-xl text-center">
          <span className="eyebrow mb-6 block">Classical Hatha Yoga</span>
          <p className="font-serif text-[clamp(1.3rem,2.34vw,1.82rem)] leading-[1.4] text-primary">
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
