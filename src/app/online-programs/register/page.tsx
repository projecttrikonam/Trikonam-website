import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { PageHeader } from '@/components/ui/PageHeader';
import { RegistrationForm } from '@/components/forms/RegistrationForm';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Register — Online Programs',
  description:
    'Register for a live online Classical Hatha Yoga program with Trikonam. Our team will follow up by email with your payment link and batch details.',
  path: '/online-programs/register',
  noIndex: true,
});

/**
 * Online Programs registration (v2.0). A single premium in-site form; on submit it posts
 * to the Google Apps Script endpoint and swaps to a confirmation screen (no payment
 * gateway — links are emailed manually). Noindex: a utility/conversion page.
 */
export default function RegisterPage() {
  return (
    <Section tone="bg" width="narrow">
      <PageHeader
        eyebrow="Online Registration"
        title="Register for a live online program."
        intro="Complete the short form below. Once we receive it, our team will email your payment link, batch details, and next steps — usually within 24 hours."
      />
      <div className="mt-12">
        <RegistrationForm />
      </div>
    </Section>
  );
}
