import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { PageHeader } from '@/components/ui/PageHeader';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import { CtaBand } from '@/components/sections/CtaBand';
import { EnquireButton } from '@/components/ui/EnquireButton';

import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Corporate Wellness',
  description:
    'A specially structured Classical Hatha Yoga program for corporate settings, addressing workplace stress and the pressures of work. Enquire to begin.',
  path: '/programs/corporate',
});

/**
 * Corporate Wellness (Handoff §6.7 & §7.3). Enquiry-gated by design — the CTA is
 * "Enquire Now", NOT "Register Now" (§3.4). No pricing, format, or duration is
 * stated; none were provided, and the page is correctly short without them.
 */
export default function CorporatePage() {
  return (
    <>
      <Section tone="bg" width="wide">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <PageHeader
            eyebrow="Corporate Wellness"
            title="A steadier way to meet the pressures of work."
            intro="Trikonam offers a specially structured Classical Hatha Yoga program for corporate settings, addressing the stress and pressure that build up through working life."
          />
          <RevealOnScroll>
            <ResponsiveImage
              src="/images/programs/corporate/corporate.webp"
              alt="A teacher leads a large group of office employees seated in meditation in an open-plan workplace."
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
            The program is built for the realities of the workplace — offering practices
            that support focus, resilience, and a calmer relationship to pressure,
            taught with the same authenticity and individual attention that runs through
            everything we teach.
          </p>
          <p>
            Because every organisation is different, these engagements are scoped
            individually. We begin with a short enquiry rather than a direct
            registration, so the program can be shaped to your setting.
          </p>
        </RevealOnScroll>
      </Section>

      <CtaBand
        title="Bring Trikonam to your workplace."
        text="Tell us a little about your organisation and we’ll take it from there."
      >
        <EnquireButton />
      </CtaBand>
    </>
  );
}
