import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { PageHeader } from '@/components/ui/PageHeader';
import { CategoryNav } from '@/components/journal/CategoryNav';
import { ArticleGrid } from '@/components/journal/ArticleGrid';
import { Pagination } from '@/components/journal/Pagination';
import {
  ARTICLES_PER_PAGE,
  getArticles,
  getCategories,
  getFeaturedArticle,
  paginate,
} from '@/lib/journal';
import { pageMetadata } from '@/lib/seo';

// Generate /journal/page/2 … /journal/page/N (page 1 lives at /journal).
export async function generateStaticParams() {
  const featured = await getFeaturedArticle();
  const rest = await getArticles({ excludeSlug: featured?.slug });
  const { totalPages } = paginate(rest, 1, ARTICLES_PER_PAGE);
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
    page: String(i + 2),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { page: string };
}): Promise<Metadata> {
  return pageMetadata({
    title: `Journal — Page ${params.page}`,
    description: 'More writing on Classical Hatha Yoga from Trikonam.',
    path: `/journal/page/${params.page}`,
  });
}

export default async function JournalPaginatedPage({ params }: { params: { page: string } }) {
  const pageNum = Number(params.page);
  if (!Number.isInteger(pageNum) || pageNum < 2) notFound();

  const [featured, categories] = await Promise.all([getFeaturedArticle(), getCategories()]);
  const rest = await getArticles({ excludeSlug: featured?.slug });
  const { items, page, totalPages } = paginate(rest, pageNum, ARTICLES_PER_PAGE);
  if (pageNum > totalPages) notFound();

  return (
    <>
      <Section tone="bg" width="wide">
        <PageHeader eyebrow={`The Journal · Page ${page}`} title="Quiet writing on the practice." />
        <div className="mt-12">
          <CategoryNav categories={categories} />
        </div>
      </Section>
      <Section tone="bg-alt" width="wide" className="pt-0">
        <ArticleGrid articles={items} categories={categories} />
        <Pagination
          page={page}
          totalPages={totalPages}
          buildHref={(n) => (n === 1 ? '/journal' : `/journal/page/${n}`)}
        />
      </Section>
    </>
  );
}
