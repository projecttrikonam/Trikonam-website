import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { PageHeader } from '@/components/ui/PageHeader';
import { WelcomeSystem } from '@/components/forms/WelcomeSystem';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Begin Your Journey',
  description:
    'Tell us what you are looking for — Classical Hatha Yoga, live Online Programs, workshops or retreats — and we will guide you to the right place to begin.',
  path: '/begin',
});

/**
 * The Trikonam Welcome System (v2.1) — the single registration experience the whole site
 * funnels to via "Begin Your Journey". The chooser + all journey forms + confirmation live
 * in <WelcomeSystem>; this page provides the calm welcome frame.
 */
export default function BeginPage() {
  return (
    <Section tone="bg" width="wide">
      <PageHeader
        eyebrow="Welcome to Trikonam"
        title="Every journey begins differently."
        intro="Tell us what you are looking for, and we’ll guide you towards the most suitable program."
        align="center"
      />
      <div className="mt-14">
        <WelcomeSystem />
      </div>
    </Section>
  );
}
