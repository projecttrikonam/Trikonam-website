import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { PageHeader } from '@/components/ui/PageHeader';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { JournalSearch } from '@/components/journal/JournalSearch';
import { getSearchIndex } from '@/lib/journal';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Search the Journal',
  description: 'Search Trikonam’s writing on Classical Hatha Yoga.',
  path: '/journal/search',
  noIndex: true, // a search UI, not a content page
});

/**
 * Search page. The index is built at build time (static) and handed to the client
 * component, which filters instantly in the browser. See docs/CMS_PREPARATION.md to
 * swap this for hosted search (Algolia / Sanity) as the catalogue grows.
 */
export default async function JournalSearchPage() {
  const index = await getSearchIndex();

  return (
    <Section tone="bg" width="default">
      <Breadcrumbs
        className="mb-8"
        items={[
          { label: 'Journal', href: '/journal' },
          { label: 'Search', href: '/journal/search' },
        ]}
      />
      <PageHeader eyebrow="Journal" title="Search the writing." />
      <div className="mx-auto mt-12 max-w-2xl">
        <JournalSearch index={index} />
      </div>
    </Section>
  );
}
