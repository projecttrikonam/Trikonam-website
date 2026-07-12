import type { Metadata } from 'next';
import { RedirectToBegin } from '@/components/forms/RedirectToBegin';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Register — Online Programs',
  description: 'Register for a live online Classical Hatha Yoga program with Trikonam.',
  path: '/online-programs/register',
  noIndex: true,
});

/**
 * Retired route (v2.1). Registration now lives in the unified Trikonam Welcome System;
 * this path redirects any bookmark straight to the Online Programs journey.
 */
export default function RegisterRedirectPage() {
  return <RedirectToBegin journey="online-programs" />;
}
