import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { PageHeader } from '@/components/ui/PageHeader';
import { CategoryNav } from '@/components/journal/CategoryNav';
import { SeriesNav } from '@/components/journal/SeriesNav';
import { FeaturedArticle } from '@/components/journal/FeaturedArticle';
import { ArticleGrid } from '@/components/journal/ArticleGrid';
import { Pagination } from '@/components/journal/Pagination';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import {
  ARTICLES_PER_PAGE,
  getArticles,
  getCategories,
  getFeaturedArticle,
  getSeriesList,
  paginate,
} from '@/lib/journal';
import { pageMetadata } from '@/lib/seo';

const journalMeta = pageMetadata({
  title: 'Journal',
  description:
    'Quiet writing on Classical Hatha Yoga — the practice, its philosophy, and living well around it. Reflections from Trikonam.',
  path: '/journal',
});
export const metadata: Metadata = {
  ...journalMeta,
  alternates: {
    ...journalMeta.alternates,
    types: { 'application/rss+xml': '/journal/rss.xml' },
  },
};

/**
 * Journal landing (page 1). Featured article, then the rest paginated. All content is
 * read through src/lib/journal.ts — no article text is hardcoded here.
 */
export default async function JournalPage() {
  const [featured, categories, series] = await Promise.all([
    getFeaturedArticle(),
    getCategories(),
    getSeriesList(),
  ]);
  const rest = await getArticles({ excludeSlug: featured?.slug });
  const { items, page, totalPages } = paginate(rest, 1, ARTICLES_PER_PAGE);

  return (
    <>
      <Section tone="bg" width="wide">
        <PageHeader
          eyebrow="The Journal"
          title="Quiet writing on the practice."
          align="center"
          intro="Reflections rather than instruction — on how to begin, the ideas beneath the postures, and what Classical Hatha Yoga asks of an ordinary life. New pieces are added slowly, when there is something worth saying."
        />
        <div className="mt-12 flex justify-center">
          <CategoryNav categories={categories} />
        </div>
      </Section>

      {featured && (
        <Section tone="bg" width="wide" className="pt-2">
          <FeaturedArticle article={featured} categories={categories} />
        </Section>
      )}

      <Section tone="bg-alt" width="wide">
        {items.length > 0 && (
          <RevealOnScroll className="mb-12">
            <span className="eyebrow eyebrow--tick mb-3">More reading</span>
            <h2 className="text-h3">From the archive</h2>
          </RevealOnScroll>
        )}
        <ArticleGrid articles={items} categories={categories} />
        <Pagination
          page={page}
          totalPages={totalPages}
          buildHref={(n) => (n === 1 ? '/journal' : `/journal/page/${n}`)}
        />
      </Section>

      {/* Series appear here as soon as any exist in the CMS — nothing to change in code. */}
      {series.length > 0 && (
        <Section tone="bg" width="wide">
          <RevealOnScroll>
            <SeriesNav series={series} />
          </RevealOnScroll>
        </Section>
      )}
    </>
  );
}
