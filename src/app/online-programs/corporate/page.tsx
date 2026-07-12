import type { Metadata } from 'next';
import { RedirectToBegin } from '@/components/forms/RedirectToBegin';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Corporate Enquiry — Online Programs',
  description: 'Enquire about live online Classical Hatha Yoga programs for your organisation.',
  path: '/online-programs/corporate',
  noIndex: true,
});

/**
 * Retired route (v2.1). Corporate enquiries now go through the unified Trikonam Welcome
 * System; this path redirects any bookmark straight to the Corporate Wellness journey.
 */
export default function CorporateRedirectPage() {
  return <RedirectToBegin journey="corporate-wellness" />;
}
