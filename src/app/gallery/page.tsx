import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { PageHeader } from '@/components/ui/PageHeader';
import { GalleryGrid } from '@/components/sections/GalleryGrid';

import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Gallery',
  description:
    'A quiet look at Classical Hatha Yoga as it is practised at Trikonam — moments of stillness, training, and community.',
  path: '/gallery',
});

/**
 * Gallery (Handoff §6.9). The most visually driven page — a considered grid with a
 * keyboard-navigable lightbox, in keeping with the "museum website" reference point.
 */
export default function GalleryPage() {
  return (
    <Section tone="bg" width="wide">
      <PageHeader
        eyebrow="Gallery"
        title="Moments of practice."
        intro="A quiet look at Classical Hatha Yoga as it is lived at Trikonam — in nature, in stillness, and in company."
      />
      <div className="mt-14">
        <GalleryGrid />
      </div>
    </Section>
  );
}
