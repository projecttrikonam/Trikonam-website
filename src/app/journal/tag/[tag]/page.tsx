import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { PageHeader } from '@/components/ui/PageHeader';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { ArticleGrid } from '@/components/journal/ArticleGrid';
import { getArticlesByTag, getCategories, getTag, getTags } from '@/lib/journal';
import { pageMetadata } from '@/lib/seo';

export async function generateStaticParams() {
  const tags = await getTags();
  return tags.map((t) => ({ tag: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { tag: string };
}): Promise<Metadata> {
  const tag = await getTag(params.tag);
  if (!tag) return {};
  return pageMetadata({
    title: `${tag.title} — Journal`,
    description: `Journal articles tagged “${tag.title}”.`,
    path: `/journal/tag/${tag.slug}`,
    // Tag pages are thin aggregations; keep the canonical set focused on categories.
    noIndex: true,
  });
}

export default async function TagPage({ params }: { params: { tag: string } }) {
  const tag = await getTag(params.tag);
  if (!tag) notFound();

  const [articles, categories] = await Promise.all([
    getArticlesByTag(tag.slug),
    getCategories(),
  ]);

  return (
    <>
      <Section tone="bg" width="wide">
        <Breadcrumbs
          className="mb-8"
          items={[
            { label: 'Journal', href: '/journal' },
            { label: `Tag: ${tag.title}`, href: `/journal/tag/${tag.slug}` },
          ]}
        />
        <PageHeader eyebrow="Journal · Tag" title={tag.title} />
      </Section>
      <Section tone="bg-alt" width="wide" className="pt-0">
        <ArticleGrid
          articles={articles}
          categories={categories}
          emptyMessage={`No articles tagged ${tag.title} yet.`}
          srHeading={`Articles tagged ${tag.title}`}
        />
      </Section>
    </>
  );
}
