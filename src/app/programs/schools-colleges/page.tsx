import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { PageHeader } from '@/components/ui/PageHeader';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import { CtaBand } from '@/components/sections/CtaBand';
import { BeginJourneyButton } from '@/components/ui/BeginJourneyButton';

import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Schools & Colleges',
  description:
    'A specially structured Classical Hatha Yoga program for students, addressing exam pressure, deadlines, and academic stress. Enquire to begin.',
  path: '/programs/schools-colleges',
});

/**
 * Schools & Colleges (Handoff §6.8 & §7.3). Same enquiry-gated structure as Corporate
 * — the CTA is "Enquire Now" (§3.4). No fabricated pricing/format/duration.
 */
export default function SchoolsCollegesPage() {
  return (
    <>
      <Section tone="bg" width="wide">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <PageHeader
            eyebrow="Schools & Colleges"
            title="Calm steadiness for students under pressure."
            intro="Trikonam offers a specially structured Classical Hatha Yoga program for students, addressing exam pressure, deadlines, and the stress that surrounds academic life."
          />
          <RevealOnScroll>
            <ResponsiveImage
              src="/images/programs/schools-colleges/schools.webp"
              alt="A group of young students sit in quiet meditation on mats, mountains softening behind them."
              aspect="aspect-[4/3]"
              sizes="(min-width: 768px) 45vw, 100vw"
              priority
            />
          </RevealOnScroll>
        </div>
      </Section>

      <Section tone="bg" width="narrow" className="pt-0">
        <RevealOnScroll className="prose-measure space-y-4 text-body-lg text-secondary">
          <p>
            The program gives students simple, authentic practices to steady the mind
            and body through demanding periods — supporting focus and composure without
            adding to the load they already carry.
          </p>
          <p>
            Every institution is different, so these programs are scoped individually.
            We begin with a short enquiry rather than a direct registration, so the
            program can be shaped to your students and setting.
          </p>
        </RevealOnScroll>
      </Section>

      <CtaBand
        title="Bring Trikonam to your students."
        text="Tell us about your school or college and we’ll take it from there."
      >
        <BeginJourneyButton label="Enquire Now" journey="enquiry" />
      </CtaBand>
    </>
  );
}
