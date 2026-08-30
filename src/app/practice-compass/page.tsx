import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { PageHeader } from '@/components/ui/PageHeader';
import { PracticeCompass } from '@/components/compass/PracticeCompass';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Practice Compass',
  description:
    'A short ten-question reflection to understand where your Classical Hatha Yoga practice might begin — the practice, the journey, and the place to start that may suit you now. Not a health score.',
  path: '/practice-compass',
});

/**
 * The Practice Compass — a self-enquiry that helps a visitor find their starting point.
 * The interactive assessment and its result live in <PracticeCompass>; this page is the
 * calm frame around it.
 */
export default function PracticeCompassPage() {
  return (
    <Section tone="bg" width="wide">
      <PageHeader
        eyebrow="Practice Compass"
        title="Find where your practice begins."
        align="center"
        intro="Ten short questions about where you are, what draws you, and how you’d like to begin. There is no score and no diagnosis — just a clearer sense of the practice, the journey, and the first step that may suit you right now."
      />
      <div className="mt-14">
        <PracticeCompass />
      </div>
    </Section>
  );
}
