import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { PageHeader } from '@/components/ui/PageHeader';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { ArticleGrid } from '@/components/journal/ArticleGrid';
import { getArticlesBySeries, getCategories, getSeries, getSeriesList } from '@/lib/journal';
import { pageMetadata } from '@/lib/seo';

export async function generateStaticParams() {
  const series = await getSeriesList();
  return series.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const series = await getSeries(params.slug);
  if (!series) return {};
  return pageMetadata({
    title: `${series.title} — Journal Series`,
    description: series.description ?? `Articles in the ${series.title} series.`,
    path: `/journal/series/${series.slug}`,
  });
}

export default async function SeriesPage({ params }: { params: { slug: string } }) {
  const series = await getSeries(params.slug);
  if (!series) notFound();

  const [articles, categories] = await Promise.all([
    getArticlesBySeries(series.slug),
    getCategories(),
  ]);

  return (
    <>
      <Section tone="bg" width="wide">
        <Breadcrumbs
          className="mb-8"
          items={[
            { label: 'Journal', href: '/journal' },
            { label: series.title, href: `/journal/series/${series.slug}` },
          ]}
        />
        <PageHeader eyebrow="Journal · Series" title={series.title} intro={series.description} />
      </Section>
      <Section tone="bg-alt" width="wide" className="pt-0">
        <ArticleGrid
          articles={articles}
          categories={categories}
          emptyMessage={`No articles in ${series.title} yet.`}
        />
      </Section>
    </>
  );
}
