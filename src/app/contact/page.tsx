import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { PageHeader } from '@/components/ui/PageHeader';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { ContactDetails } from '@/components/sections/ContactDetails';
import { RegisterButton } from '@/components/ui/RegisterButton';
import { EnquireButton } from '@/components/ui/EnquireButton';

import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Contact',
  description:
    'Get in touch with Trikonam. Classical Hatha Yoga across Andhra Pradesh & Telangana — by phone, email, or through our registration and enquiry forms.',
  path: '/contact',
});

/**
 * Contact (Handoff §6.12). Phone numbers, email, and the general service area — a
 * calm layout. No embedded map pin, as no exact coordinates were provided (§14.3);
 * that remains a Phase 2 addition.
 */
export default function ContactPage() {
  return (
    <>
      <Section tone="bg" width="default">
        <PageHeader
          eyebrow="Contact"
          title="We’re glad to hear from you."
          intro="Whether you’re taking your first step or returning to practice, reach out by phone or email — or use the forms below to register or enquire."
        />
      </Section>

      <Section tone="bg-alt" width="wide" className="rounded-none">
        <ContactDetails />
      </Section>

      <Section tone="bg" width="default" className="text-center">
        <RevealOnScroll>
          <h2 className="text-h2">Take the next step.</h2>
          <p className="prose-measure mx-auto mt-4 text-body-lg text-secondary">
            Register for a program or workshop, or enquire about a corporate or
            school & college program.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <RegisterButton />
            <EnquireButton variant="secondary" />
          </div>
        </RevealOnScroll>
      </Section>
    </>
  );
}
