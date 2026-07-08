import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { PageHeader } from '@/components/ui/PageHeader';
import { TestimonialBlock } from '@/components/sections/TestimonialBlock';

import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Testimonials',
  description:
    'Two accounts of what stillness revealed — in the words of those who found it through Classical Hatha Yoga at Trikonam.',
  path: '/testimonials',
});

/**
 * Testimonials page (Handoff §6.10). The same two real, anonymous stories as the home
 * section, given their own dedicated, unhurried page (useful for the footer link).
 */
export default function TestimonialsPage() {
  return (
    <Section tone="bg" width="wide">
      <PageHeader
        align="center"
        eyebrow="In Their Words"
        title="What the practice revealed."
        intro="We do not promise transformation. What each person experiences is their own. These are two accounts, shared as they were told."
      />
      <div className="mt-16">
        <TestimonialBlock />
      </div>
    </Section>
  );
}
