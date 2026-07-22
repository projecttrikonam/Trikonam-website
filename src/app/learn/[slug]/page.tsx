import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import { CtaBand } from '@/components/sections/CtaBand';
import { BeginJourneyButton } from '@/components/ui/BeginJourneyButton';
import { learningPaths, getLearningPath } from '@/content/learning-paths';
import { pageMetadata } from '@/lib/seo';

// Static export needs every dynamic path enumerated at build time.
export function generateStaticParams() {
  return learningPaths.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const path = getLearningPath(params.slug);
  if (!path) return {};
  return pageMetadata({
    title: path.name,
    description: path.metaDescription,
    path: `/learn/${path.slug}`,
    image: path.image,
  });
}

/**
 * Learning Pathway page (v2.1) — one reusable template for the four offline formats
 * (Group Workshops, Private Guidance, Children's Yoga, Retreats). Built deliberately in
 * the practice-page editorial idiom (see practices/[slug]): a framed image beside the
 * intro, a measured prose column per section, an onward link, and a closing CTA — NOT the
 * Online Programs layout. A new pathway is one entry in content/learning-paths.ts.
 */
export default function LearningPathPage({ params }: { params: { slug: string } }) {
  const path = getLearningPath(params.slug);
  if (!path) notFound();

  const index = learningPaths.findIndex((p) => p.slug === path.slug);
  const next = learningPaths[(index + 1) % learningPaths.length];

  return (
    <>
      {/* Intro — image-beside editorial split, in the practice-page idiom. */}
      <Section tone="bg" width="wide">
        <Link
          href="/practices"
          className="link-underline mb-10 inline-flex items-center gap-2 text-label uppercase tracking-[0.16em] text-moss"
        >
          Classical Hatha Yoga
        </Link>

        <div className="grid items-start gap-12 md:grid-cols-2 md:gap-16">
          <RevealOnScroll>
            <span className="eyebrow eyebrow--tick mb-5">Ways to Learn</span>
            <h1 className="text-balance font-serif text-[clamp(1.95rem,4.05vw,3.19rem)] leading-[1.16] sm:leading-[1.05] tracking-[-0.015em] text-primary">
              {path.name}
            </h1>
            <p className="mt-3 font-serif text-[1.15rem] italic text-moss">{path.tagline}</p>
            <div className="prose-measure mt-7 space-y-5 text-body-lg leading-[1.8] text-secondary text-pretty">
              {path.intro.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.08} className="md:sticky md:top-28">
            <ResponsiveImage
              src={path.image}
              alt={path.imageAlt}
              aspect="aspect-[3/2]"
              sizes="(min-width: 768px) 45vw, 100vw"
              priority
            />
          </RevealOnScroll>
        </div>
      </Section>

      {/* Editorial prose sections. */}
      <Section tone="bg" width="narrow" className="pt-0">
        <div className="space-y-14">
          {path.sections.map((section) => (
            <RevealOnScroll key={section.heading}>
              <h2 className="text-balance text-h2">{section.heading}</h2>
              <div className="prose-measure mt-5 space-y-4 text-body-lg text-secondary">
                {section.body.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
              {section.list && (
                <ul className="mt-6 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                  {section.list.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-body-lg text-primary">
                      <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-moss" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </RevealOnScroll>
          ))}
        </div>
      </Section>

      {/* Onward path to the next way to learn. */}
      <Section tone="bg" width="wide" className="pt-0">
        <div className="flex items-center justify-between border-t border-border pt-8">
          <span className="text-label uppercase tracking-[0.16em] text-secondary">
            Another way to learn
          </span>
          <Link
            href={`/learn/${next.slug}`}
            className="group inline-flex items-center gap-3 text-right font-serif text-[1.35rem] leading-tight text-primary transition-colors hover:text-moss sm:text-[1.5rem]"
          >
            {next.name}
          </Link>
        </div>
      </Section>

      <CtaBand
        title="Bring this to your group."
        text="Tell us a little about what you have in mind, and we’ll take it from there."
      >
        <BeginJourneyButton label={path.cta.label} journey={path.cta.journey} />
      </CtaBand>
    </>
  );
}
