import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { PageHeader } from '@/components/ui/PageHeader';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import { BreathDivider } from '@/components/ui/BreathDivider';
import { Button } from '@/components/ui/Button';
import { SadhguruQuote } from '@/components/sections/SadhguruQuote';
import { quotes } from '@/content/quotes';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'About',
  description:
    'Trikonam offers Classical Hatha Yoga in its authentic form — taught with precision, care, and deep respect for the integrity of these transformative yogic sciences.',
  path: '/about',
});

/** The four dimensions Classical Hatha Yoga supports (client copy). */
const supports = [
  {
    label: 'Body',
    text: 'Supports strength, flexibility, posture, stability, and overall physical well-being.',
  },
  {
    label: 'Mind',
    text: 'Brings greater mental clarity, focus, steadiness, and the ability to respond rather than react.',
  },
  {
    label: 'Energy',
    text: "Creates balance within the body's energy system, helping one experience vitality, ease, and inner aliveness.",
  },
  {
    label: 'Emotions',
    text: 'Helps cultivate emotional balance, inner stability, and a more joyful experience of life.',
  },
];

/**
 * About page. Storytelling refinement (visual rhythm, image-beside/image-below, feature
 * cards) — typography, spacing, colours, and animations unchanged.
 */
export default function AboutPage() {
  return (
    <>
      {/* SECTION 1 — About Trikonam (text left, image right) */}
      <Section tone="bg" width="wide">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <PageHeader
            eyebrow="About Trikonam"
            title="The practice itself — offered exactly as it was meant to be received."
          >
            <div className="prose-measure space-y-5 text-body-lg text-secondary">
              <p>
                Trikonam is dedicated to offering Classical Hatha Yoga in its authentic
                form, exactly as it has been preserved through the yogic tradition.
              </p>
              <p>
                Every program is taught with precision, care, and deep respect for the
                integrity of these practices. Nothing is modified for convenience, trend,
                or performance. The methods remain true to their original intent.
              </p>
              <p>
                Our purpose is simple—to make these transformative yogic sciences
                accessible to anyone who sincerely wishes to cultivate greater health,
                balance, vitality, and inner well-being.
              </p>
              <p>
                Whether someone begins with a desire to improve physical health or simply
                wishes to experience life with more ease, these practices gradually become
                a natural support for a more conscious way of living.
              </p>
            </div>
          </PageHeader>

          <RevealOnScroll delay={0.1}>
            <ResponsiveImage
              src="/images/about/about-hero.webp"
              alt="Practitioners in white sit in meditation before the Adiyogi, a large sculpted face of the first yogi."
              aspect="aspect-[4/5]"
              sizes="(min-width: 768px) 45vw, 100vw"
              priority
            />
          </RevealOnScroll>
        </div>
      </Section>

      {/* SECTION 2 — Our Vision (unchanged) */}
      <Section tone="bg-alt" width="narrow">
        <RevealOnScroll className="text-center">
          <span className="eyebrow mb-5 block">Our Vision</span>
          <p className="mx-auto max-w-2xl font-serif text-h2 leading-[1.35] text-primary">
            To make authentic Classical Hatha Yoga available to anyone seeking greater
            balance, vitality, and inner well-being, while nurturing a way of living
            that is conscious, joyful, and deeply connected to life.
          </p>
        </RevealOnScroll>
      </Section>

      {/* SECTION 3 — What is Classical Hatha Yoga? (text, then image below) */}
      <Section tone="bg" width="narrow">
        <RevealOnScroll className="prose-measure">
          <span className="eyebrow eyebrow--tick mb-4">The Practice</span>
          <h2 className="text-h2">What is Classical Hatha Yoga?</h2>
          <div className="mt-5 space-y-4 text-body-lg text-secondary">
            <p>
              Classical Hatha Yoga is a complete inner science that works on every
              dimension of the human system. Rather than being a collection of physical
              exercises, it is a profound technology that aligns the body, mind, energy,
              and emotions into greater balance.
            </p>
            <p>
              These practices have been carefully preserved over centuries and are offered
              in their original form. Their purpose is not merely flexibility or fitness,
              but to establish a stable foundation for health, clarity, vitality, and
              inner well-being.
            </p>
            <p>
              With consistent practice, they become tools that support everyday life
              naturally, allowing one to experience greater ease, awareness, and balance.
            </p>
          </div>
        </RevealOnScroll>
      </Section>
      <Section tone="bg" width="wide" className="pt-0">
        <RevealOnScroll>
          <ResponsiveImage
            src="/images/about/what-is-chy.webp"
            alt="Practitioners hold classical postures along a sunlit stone colonnade at dawn."
            aspect="aspect-[3/2]"
            sizes="(min-width: 1024px) 72rem, 100vw"
          />
        </RevealOnScroll>
      </Section>

      {/* SECTION 4 — Our Approach (kept, trimmed for repetition) */}
      <Section tone="bg-alt" width="narrow">
        <RevealOnScroll>
          <span className="eyebrow eyebrow--tick mb-4">Our Approach</span>
          <h2 className="text-h2">Consistent practice, not quick solutions.</h2>
          <div className="prose-measure mt-5 space-y-4 text-body-lg text-secondary">
            <p>
              We believe that meaningful transformation happens through consistent
              practice rather than quick solutions. We encourage every participant to
              learn at their own pace and develop a sustainable practice that naturally
              becomes part of everyday life.
            </p>
            <p>
              Rather than offering temporary motivation, our intention is to provide tools
              that continue to support physical health, mental clarity, emotional balance,
              and inner stability for years to come.
            </p>
          </div>
        </RevealOnScroll>
      </Section>

      {/* What We Offer (kept) */}
      <Section tone="bg" width="default">
        <RevealOnScroll>
          <span className="eyebrow mb-4 block">What We Offer</span>
          <h2 className="text-h2">
            Programs for individuals, groups, institutions, and communities.
          </h2>
          <p className="prose-measure mt-5 text-body-lg text-secondary">
            We conduct Classical Hatha Yoga programs for individuals, groups,
            educational institutions, organisations, and communities.
          </p>
          <div className="mt-8 grid gap-x-10 gap-y-3 sm:grid-cols-2">
            {[
              'Individual Classical Hatha Yoga Practices',
              'Meditation & Pranayama',
              'Corporate Wellness Programs',
              'School & College Yoga Programs',
              'Workshops for Communities and Organisations',
              'One-to-One Guidance (where applicable)',
              'Offline & Online Classes',
              "Children's Programs & Retreats",
            ].map((item) => (
              <p key={item} className="flex items-start gap-3 text-body-lg text-primary">
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-moss" />
                {item}
              </p>
            ))}
          </div>
        </RevealOnScroll>
      </Section>

      {/* Conscious Living (kept) */}
      <Section tone="bg-alt" width="narrow">
        <RevealOnScroll className="prose-measure">
          <span className="eyebrow eyebrow--tick mb-4">Conscious Living</span>
          <h2 className="text-h2">Well-being is not shaped on the mat alone.</h2>
          <div className="mt-5 space-y-4 text-body-lg text-secondary">
            <p>
              The balance you cultivate in practice is meant to extend into everyday
              life. Alongside the practices themselves, we guide the way you live around
              them — a more conscious way of living, the right way to consume food, and a
              diet tailored to your own body and needs.
            </p>
            <p>
              These are not rigid rules but gentle, practical support — so that health,
              clarity, and ease become part of how you live, not something set apart from
              it.
            </p>
          </div>
        </RevealOnScroll>
      </Section>

      {/* Sadhguru — consciousness as the source. */}
      <SadhguruQuote quote={quotes.consciousness} tone="dark" />

      {/* SECTION 5 — How these practices support you (cards + large image) */}
      <Section tone="bg" width="wide">
        <RevealOnScroll className="max-w-2xl">
          <span className="eyebrow eyebrow--tick mb-4">Trikonam Offers</span>
          <h2 className="text-h2">How these practices support you</h2>
          <p className="prose-measure mt-5 text-body-lg text-secondary">
            At Trikonam, every offering is rooted in the science of Classical Hatha Yoga.
            While each practice has its own purpose, together they create a balanced
            system that supports every dimension of your life.
          </p>
        </RevealOnScroll>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {supports.map((s, i) => (
            <RevealOnScroll
              as="li"
              key={s.label}
              delay={(i % 4) * 0.06}
              className="flex h-full flex-col rounded-[10px] surface-elevated p-6 ring-1 ring-black/[0.04] sm:p-7"
            >
              <span className="eyebrow mb-3 block">{s.label}</span>
              <p className="text-body text-secondary">{s.text}</p>
            </RevealOnScroll>
          ))}
        </ul>

        <RevealOnScroll className="mt-14">
          <ResponsiveImage
            src="/images/about/support.webp"
            alt="A practitioner sits in a quiet gesture of prayer beneath a traditional tiled pavilion."
            aspect="aspect-[16/10]"
            sizes="(min-width: 1024px) 72rem, 100vw"
          />
        </RevealOnScroll>
      </Section>

      <BreathDivider className="pb-4" />

      {/* Invitation (kept) */}
      <Section tone="bg" width="narrow" className="pt-6 text-center">
        <RevealOnScroll>
          <span className="eyebrow mb-4 block">Invitation</span>
          <p className="mx-auto max-w-2xl font-serif text-h2 leading-[1.4] text-primary">
            Whether you are taking your very first step into yoga or looking to deepen an
            existing practice, you are welcome at Trikonam.
          </p>
          <p className="prose-measure mx-auto mt-6 text-body-lg text-secondary">
            Wherever you are in your journey, we invite you to experience these timeless
            practices with openness, patience, and consistency.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Button href="/programs" variant="primary">
              Explore Our Programs
            </Button>
            <Button href="/practices" variant="secondary">
              The Practices
            </Button>
          </div>
        </RevealOnScroll>
      </Section>
    </>
  );
}
