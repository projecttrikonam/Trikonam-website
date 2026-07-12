import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import { BreathMark } from '@/components/ui/BreathMark';
import { CtaBand } from '@/components/sections/CtaBand';
import { BeginJourneyButton } from '@/components/ui/BeginJourneyButton';
import { practices, getPractice } from '@/content/practices';
import { pageMetadata } from '@/lib/seo';

// Static export needs every dynamic path enumerated at build time.
export function generateStaticParams() {
  return practices.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const practice = getPractice(params.slug);
  if (!practice) return {};
  return pageMetadata({
    title: practice.name,
    description: practice.summary,
    path: `/practices/${practice.slug}`,
    image: practice.image ?? '/og-image.jpg',
  });
}

/**
 * Individual practice page (Handoff §6.5) — Creative Director revision.
 *
 * Two compositions, chosen by whether a genuinely fitting photograph exists:
 *   • WITH image — an asymmetric editorial split: an oversized quiet index letter, the
 *     name, the verbatim description, and a sticky, elevated image alongside.
 *   • WITHOUT image — a centred, single-column editorial layout with a large monogram
 *     watermark and breath ring. No forced or placeholder photo (§5.4 / client image
 *     direction): the composition itself carries the page, and it reads as intentional
 *     restraint rather than a missing asset.
 */
export default function PracticePage({ params }: { params: { slug: string } }) {
  const practice = getPractice(params.slug);
  if (!practice) notFound();

  const index = practices.findIndex((p) => p.slug === practice.slug);
  const next = practices[(index + 1) % practices.length];
  const hasImage = Boolean(practice.image);

  return (
    <>
      <Section tone="bg" width="wide">
        <Link
          href="/practices"
          className="link-underline mb-10 inline-flex items-center gap-2 text-[0.78rem] uppercase tracking-[0.16em] text-moss"
        >
          <span aria-hidden>←</span> All practices
        </Link>

        {hasImage ? (
          /* --- Editorial split, photo alongside --- */
          <div className="grid items-start gap-12 md:grid-cols-2 md:gap-16">
            <div className="relative">
              <span
                aria-hidden
                className="pointer-events-none absolute -left-3 -top-14 select-none font-serif text-[8rem] leading-none text-moss/[0.07] sm:text-[10rem]"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <RevealOnScroll className="relative">
                <span className="eyebrow eyebrow--tick mb-5">Classical Hatha Yoga</span>
                <h1 className="text-balance font-serif text-[clamp(1.95rem,4.05vw,3.19rem)] leading-[1.05] tracking-[-0.015em] text-primary">
                  {practice.name}
                </h1>
                <p className="prose-measure mt-8 text-body-lg leading-[1.8] text-secondary text-pretty">
                  {practice.description}
                </p>
              </RevealOnScroll>
            </div>

            <RevealOnScroll delay={0.08} className="md:sticky md:top-28">
              <ResponsiveImage
                src={practice.image as string}
                alt={practice.imageAlt ?? `${practice.name} practice at Trikonam.`}
                aspect="aspect-[4/3]"
                sizes="(min-width: 768px) 45vw, 100vw"
                contain
                priority
              />
            </RevealOnScroll>
          </div>
        ) : (
          /* --- Centred editorial composition, no photo --- */
          <RevealOnScroll className="relative mx-auto max-w-2xl pt-8 text-center">
            <div className="relative mx-auto mb-2 flex h-40 w-40 items-center justify-center">
              <BreathMark className="absolute inset-0 h-full w-full" opacity={0.4} />
              <span className="font-serif text-[5rem] leading-none text-moss/20">
                {practice.name.charAt(0)}
              </span>
            </div>
            <span className="eyebrow eyebrow--tick mx-auto mb-5 w-fit">Classical Hatha Yoga</span>
            <h1 className="text-balance font-serif text-[clamp(1.95rem,4.5vw,3.41rem)] leading-[1.05] tracking-[-0.015em] text-primary">
              {practice.name}
            </h1>
            <p className="mx-auto mt-8 max-w-[62ch] text-body-lg leading-[1.85] text-secondary text-pretty">
              {practice.description}
            </p>
          </RevealOnScroll>
        )}
      </Section>

      {/* Onward path to the next practice. */}
      <Section tone="bg" width="wide" className="pt-0">
        <div className="flex items-center justify-between border-t border-border pt-8">
          <span className="text-[0.78rem] uppercase tracking-[0.16em] text-secondary">
            Next practice
          </span>
          <Link
            href={`/practices/${next.slug}`}
            className="group inline-flex items-center gap-3 font-serif text-[1.5rem] text-primary transition-colors hover:text-moss"
          >
            {next.name}
            <span aria-hidden className="text-moss transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </Section>

      <CtaBand
        title="Learn this practice with guidance."
        text="Begin at your own pace, with attentive instruction — tell us what you’re looking for."
      >
        <BeginJourneyButton journey="classical-hatha-yoga" />
      </CtaBand>
    </>
  );
}
