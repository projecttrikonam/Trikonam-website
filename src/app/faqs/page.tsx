import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { PageHeader } from '@/components/ui/PageHeader';
import { Accordion } from '@/components/ui/Accordion';
import { CtaBand } from '@/components/sections/CtaBand';
import { BeginJourneyButton } from '@/components/ui/BeginJourneyButton';
import { faqs } from '@/content/faqs';

import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'FAQs',
  description:
    'Honest answers to common questions about Classical Hatha Yoga at Trikonam — experience, suitability, classes, and registration.',
  path: '/faqs',
});

// FAQ structured data (helps search engines; uses the exact verbatim Q&A).
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: { '@type': 'Answer', text: f.answer },
  })),
};

/**
 * FAQs (Handoff §6.11 & §7.6). Accordion, questions/answers used verbatim.
 */
export default function FaqsPage() {
  return (
    <>
      <Section tone="bg" width="default">
        <PageHeader
          eyebrow="FAQs"
          title="Questions, answered plainly."
          intro="A few honest answers. If yours isn’t here, we’re glad to help — just get in touch."
        />
        <div className="mx-auto mt-14 max-w-3xl">
          <Accordion items={faqs} />
        </div>
      </Section>

      <CtaBand
        title="Ready to begin?"
        text="Tell us what you’re looking for and we’ll guide you from there."
      >
        <BeginJourneyButton label="Explore Programs" />
      </CtaBand>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
