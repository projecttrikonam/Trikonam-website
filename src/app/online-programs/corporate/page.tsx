import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { PageHeader } from '@/components/ui/PageHeader';
import { CorporateForm } from '@/components/forms/CorporateForm';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Corporate Enquiry — Online Programs',
  description:
    'Enquire about live online Classical Hatha Yoga programs for your organisation. Our team will follow up to discuss dates, scope, and next steps.',
  path: '/online-programs/corporate',
  noIndex: true,
});

/**
 * Corporate online-programs enquiry (v2.0). Separate form from general registration;
 * posts to the same Apps Script endpoint with a distinct formType and confirms in-site.
 * Noindex: a utility/conversion page.
 */
export default function CorporateEnquiryPage() {
  return (
    <Section tone="bg" width="narrow">
      <PageHeader
        eyebrow="Corporate Online Programs"
        title="Bring Classical Hatha Yoga to your team."
        intro="Share a few details about your organisation and what you're looking for. Our team will be in touch to discuss dates, scope, and how best to support your people."
      />
      <div className="mt-12">
        <CorporateForm />
      </div>
    </Section>
  );
}
