import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { PageHeader } from '@/components/ui/PageHeader';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { CategoryNav } from '@/components/journal/CategoryNav';
import { ArticleGrid } from '@/components/journal/ArticleGrid';
import { getArticlesByCategory, getCategories, getCategory } from '@/lib/journal';
import { pageMetadata } from '@/lib/seo';

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const category = await getCategory(params.category);
  if (!category) return {};
  return pageMetadata({
    title: `${category.title} — Journal`,
    description: category.description ?? `Journal articles in ${category.title}.`,
    path: `/journal/category/${category.slug}`,
  });
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const category = await getCategory(params.category);
  if (!category) notFound();

  const [articles, categories] = await Promise.all([
    getArticlesByCategory(category.slug),
    getCategories(),
  ]);

  return (
    <>
      <Section tone="bg" width="wide">
        <Breadcrumbs
          className="mb-8"
          items={[
            { label: 'Journal', href: '/journal' },
            { label: category.title, href: `/journal/category/${category.slug}` },
          ]}
        />
        <PageHeader eyebrow="Journal · Category" title={category.title} intro={category.description} />
        <div className="mt-12">
          <CategoryNav categories={categories} activeSlug={category.slug} />
        </div>
      </Section>
      <Section tone="bg-alt" width="wide" className="pt-0">
        <ArticleGrid
          articles={articles}
          categories={categories}
          emptyMessage={`No articles in ${category.title} yet.`}
          srHeading={`Articles in ${category.title}`}
        />
      </Section>
    </>
  );
}
