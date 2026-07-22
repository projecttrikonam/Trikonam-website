import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { PageHeader } from '@/components/ui/PageHeader';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { BreathDivider } from '@/components/ui/BreathDivider';
import { BeginJourneyButton } from '@/components/ui/BeginJourneyButton';
import { Accordion } from '@/components/ui/Accordion';
import { ContactDetails } from '@/components/sections/ContactDetails';
import { CtaBand } from '@/components/sections/CtaBand';
import { contactFaqs } from '@/content/contact-faqs';

import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Contact',
  description:
    'Get in touch with Trikonam — Classical Hatha Yoga across Andhra Pradesh & Telangana, and online worldwide. Reach us by phone, WhatsApp, or email.',
  path: '/contact',
});

/**
 * Contact (Handoff §6.12) — 2026 warm-refresh (client-requested; content only, no
 * change to typography, colour, spacing, or animation language). No embedded map pin,
 * as no exact coordinates were provided (§14.3); that remains a Phase 2 addition.
 */
export default function ContactPage() {
  return (
    <>
      <Section tone="bg" width="default">
        <PageHeader
          eyebrow="Contact"
          title="Begin your journey with us."
          intro="Whether you’re looking to learn Classical Hatha Yoga, organise a corporate wellness program, or simply have a question, we’d be happy to hear from you."
        />
      </Section>

      <Section tone="bg-alt" width="default" className="rounded-none">
        <ContactDetails />
      </Section>

      {/* Where We Teach — in-person service area, plus the online-worldwide option. */}
      <Section tone="bg" width="wide">
        <div className="grid gap-14 md:grid-cols-2 md:gap-20">
          <RevealOnScroll>
            <span className="eyebrow eyebrow--tick mb-4">Where We Teach</span>
            <h2 className="text-h2">Currently offering sessions in</h2>
            <ul className="mt-6 space-y-3 text-body-lg text-primary">
              <li className="flex items-start gap-3">
                <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-moss" />
                Across Telangana &amp; Andhra Pradesh
              </li>
              <li className="flex items-start gap-3">
                <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-moss" />
                Online programs, worldwide
              </li>
            </ul>
            <p className="prose-measure mt-6 text-body text-secondary">
              Don’t see your city listed? Write to us — we’re always glad to help
              organise a workshop in your own city as well.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={0.05}>
            <span className="eyebrow eyebrow--tick mb-4">Online, Worldwide</span>
            <h2 className="text-h2">Join us from anywhere.</h2>
            <p className="prose-measure mt-5 text-body-lg text-secondary">
              Our online sessions are designed so that sincere seekers anywhere in the
              world can experience authentic Classical Hatha Yoga from the comfort of
              home.
            </p>
          </RevealOnScroll>
        </div>
      </Section>

      <CtaBand
        title="Prefer to talk it through?"
        text="Request a short consultation and we’ll help you find the right place to begin."
      >
        <div className="flex flex-col items-center gap-4">
          <BeginJourneyButton label="Send an Enquiry" journey="enquiry" />
          <p className="text-caption text-secondary">
            We usually respond within 24 hours.
          </p>
        </div>
      </CtaBand>

      {/* Closing statement — a quiet, warm sign-off; no further CTA beneath it. */}
      <Section tone="bg-alt" width="narrow" className="text-center">
        <BreathDivider className="mb-10" />
        <RevealOnScroll>
          <p className="mx-auto max-w-xl text-balance font-serif text-h2 leading-[1.35] text-primary">
            Every meaningful journey begins with a conversation.
          </p>
          <p className="prose-measure mx-auto mt-4 text-body-lg text-secondary">
            We look forward to welcoming you to Trikonam.
          </p>
        </RevealOnScroll>
      </Section>

      <Section tone="bg" width="default">
        <RevealOnScroll className="text-center">
          <span className="eyebrow eyebrow--tick mx-auto mb-4 w-fit">FAQ</span>
          <h2 className="text-h2">A few common questions.</h2>
        </RevealOnScroll>
        <div className="mx-auto mt-12 max-w-3xl">
          <Accordion items={contactFaqs} />
        </div>
      </Section>
    </>
  );
}
