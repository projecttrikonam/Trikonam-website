import type { Metadata } from 'next';
import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { PageHeader } from '@/components/ui/PageHeader';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { BreathDivider } from '@/components/ui/BreathDivider';
import { Card } from '@/components/ui/Card';
import { BeginJourneyButton } from '@/components/ui/BeginJourneyButton';
import { learningPaths } from '@/content/learning-paths';
import { programCallouts } from '@/content/programs';

import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Ways to Learn',
  description:
    'The ways to experience Classical Hatha Yoga with Trikonam — group workshops, private one-to-one guidance, children’s yoga, retreats and more.',
  path: '/programs',
});

/**
 * Ways to Learn overview (v2.1) — the in-person learning pathways as an index of dedicated
 * pages under /learn, plus the enquiry-gated Corporate & Schools callouts. Replaces the
 * former "Offline Programs" hub; each pathway now has its own editorial page.
 */
export default function WaysToLearnPage() {
  return (
    <>
      <Section tone="bg" width="wide">
        <PageHeader
          eyebrow="Ways to Learn"
          title="Learn in the way that suits you."
          intro="Classical Hatha Yoga can be experienced through a variety of formats, depending on your schedule, goals, and stage of practice. Each pathway preserves the authenticity of these timeless practices while making them accessible in the way that fits your life."
        />
        <h2 className="sr-only">Ways to learn</h2>
        <ul className="mt-14 grid gap-6 sm:grid-cols-2">
          {learningPaths.map((p) => (
            <RevealOnScroll as="li" key={p.slug}>
              <Card
                href={`/learn/${p.slug}`}
                title={p.name}
                excerpt={p.tagline}
                image={p.image}
                imageAlt={p.imageAlt}
                aspect="aspect-[3/2]"
              />
            </RevealOnScroll>
          ))}
        </ul>
      </Section>

      <BreathDivider className="py-4" />

      {/* Enquiry-gated callouts — Corporate & Schools/Colleges. */}
      <Section tone="bg" width="wide" className="pt-6">
        <RevealOnScroll className="mb-10 text-center">
          <span className="eyebrow eyebrow--tick mx-auto mb-4 w-fit">Tailored Programs</span>
          <h2 className="text-h2">Individually scoped, by enquiry.</h2>
        </RevealOnScroll>
        <ul className="grid gap-6 md:grid-cols-2">
          {programCallouts.map((c) => (
            <RevealOnScroll as="li" key={c.href}>
              <Link
                href={c.href}
                className="group flex h-full flex-col rounded-[10px] surface-elevated p-8 ring-1 ring-black/[0.04] transition-all duration-500 hover:-translate-y-1 hover:shadow-lift focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <h3 className="font-serif text-h3 text-primary">{c.title}</h3>
                <p className="mt-3 flex-1 text-body-lg text-secondary">{c.excerpt}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-[0.9rem] font-medium text-moss">
                  Learn more
                </span>
              </Link>
            </RevealOnScroll>
          ))}
        </ul>
      </Section>

      {/* Bring-a-friend invitation — a group is a lovely way to begin. */}
      <Section tone="bg-alt" width="default" className="text-center">
        <RevealOnScroll className="relative mx-auto max-w-2xl">
          <span className="eyebrow eyebrow--tick mx-auto mb-5 w-fit">Practice Together</span>
          <h2 className="text-balance font-serif text-[clamp(1.38rem,2.7vw,2.05rem)] leading-[1.25] text-primary">
            Begin together, and go further.
          </h2>
          <p className="prose-measure mx-auto mt-5 text-body-lg text-secondary">
            Practice deepens in good company. Bring your friends or family along, and we’ll
            shape a workshop around your group — a gentle, shared way to begin.
          </p>
          <div className="mt-8 flex justify-center">
            <BeginJourneyButton label="Plan a Workshop" journey="group-workshops" />
          </div>
        </RevealOnScroll>
      </Section>
    </>
  );
}
