import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { BreathMark } from '@/components/ui/BreathMark';
import { CtaBand } from '@/components/sections/CtaBand';
import { BeginJourneyButton } from '@/components/ui/BeginJourneyButton';
import { teachers, getTeacher } from '@/content/teachers';
import { pageMetadata } from '@/lib/seo';

// Static export needs every dynamic path enumerated at build time.
export function generateStaticParams() {
  return teachers.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const teacher = getTeacher(params.slug);
  if (!teacher) return {};
  return pageMetadata({
    title: teacher.name,
    description: teacher.summary,
    path: `/teachers/${teacher.slug}`,
  });
}

/**
 * Individual teacher page (Handoff §6.3) — v1.1 addition, completing the `bio` field
 * reserved on the Teacher type since Phase 1.
 *
 * Mirrors the practice-detail page's "no image" centred composition exactly (large
 * monogram in a breath ring, eyebrow, name, verbatim copy) — no portrait, matching
 * the practices/[slug] pattern used whenever no confirmed photo exists. No source
 * image is confirmed as being of a specific named teacher (§14.5), so this treatment
 * stays intentional restraint rather than a missing asset.
 */
export default function TeacherPage({ params }: { params: { slug: string } }) {
  const teacher = getTeacher(params.slug);
  if (!teacher) notFound();

  const index = teachers.findIndex((t) => t.slug === teacher.slug);
  const next = teachers[(index + 1) % teachers.length];

  return (
    <>
      <Section tone="bg" width="wide">
        <Link
          href="/teachers"
          className="link-underline mb-10 inline-flex items-center gap-2 text-[0.78rem] uppercase tracking-[0.16em] text-moss"
        >
          <span aria-hidden>←</span> All teachers
        </Link>

        <RevealOnScroll className="relative mx-auto max-w-2xl pt-8 text-center">
          <div className="relative mx-auto mb-2 flex h-40 w-40 items-center justify-center">
            <BreathMark className="absolute inset-0 h-full w-full" opacity={0.4} />
            <span className="font-serif text-[5rem] leading-none text-moss/20">
              {teacher.name.charAt(0)}
            </span>
          </div>
          <span className="eyebrow eyebrow--tick mx-auto mb-5 w-fit">{teacher.role}</span>
          <h1 className="text-balance font-serif text-[clamp(1.95rem,4.5vw,3.19rem)] leading-[1.05] tracking-[-0.015em] text-primary">
            {teacher.name}
          </h1>
          <div className="prose-measure mx-auto mt-8 space-y-5 text-left text-body-lg leading-[1.8] text-secondary text-pretty">
            {teacher.bio.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </RevealOnScroll>
      </Section>

      {/* Onward path to the next teacher. */}
      <Section tone="bg" width="wide" className="pt-0">
        <div className="flex items-center justify-between border-t border-border pt-8">
          <span className="text-[0.78rem] uppercase tracking-[0.16em] text-secondary">
            Meet another teacher
          </span>
          <Link
            href={`/teachers/${next.slug}`}
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
        title="Learn with guidance like this."
        text="Begin at your own pace, with attentive instruction — tell us what you’re looking for."
      >
        <BeginJourneyButton journey="classical-hatha-yoga" />
      </CtaBand>
    </>
  );
}
