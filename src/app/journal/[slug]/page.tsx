import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { ArticleBody } from '@/components/journal/ArticleBody';
import { ArticleMeta } from '@/components/journal/ArticleMeta';
import { ArticleGrid } from '@/components/journal/ArticleGrid';
import {
  getAllArticles,
  getArticleBySlug,
  getAuthor,
  getCategories,
  getCategory,
  getRelatedArticles,
  readingTime,
} from '@/lib/journal';
import { articleJsonLd, pageMetadata } from '@/lib/seo';

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  if (!article) return {};
  return pageMetadata({
    title: article.seoTitle ?? article.title,
    description: article.seoDescription ?? article.excerpt,
    path: `/journal/${article.slug}`,
    type: 'article',
    image: article.coverImage ?? '/og-image.jpg',
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt ?? article.publishedAt,
  });
}

/**
 * Article template. Renders any article through the content model — no article text is
 * hardcoded. Emits Article + Breadcrumb JSON-LD for rich results.
 */
export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug);
  if (!article) notFound();

  const [author, category, categories, related] = await Promise.all([
    getAuthor(article.author),
    getCategory(article.category),
    getCategories(),
    getRelatedArticles(article, 3),
  ]);

  const jsonLd = articleJsonLd(article, author, category);

  return (
    <>
      <Section tone="bg" width="default">
        <Breadcrumbs
          className="mb-10"
          items={[
            { label: 'Journal', href: '/journal' },
            ...(category ? [{ label: category.title, href: `/journal/category/${category.slug}` }] : []),
            { label: article.title, href: `/journal/${article.slug}` },
          ]}
        />

        <article>
          {/* Header */}
          <header className="mx-auto max-w-3xl text-center">
            <ArticleMeta
              article={article}
              category={category}
              readingMinutes={readingTime(article)}
              className="justify-center"
            />
            <h1 className="mt-5 text-balance font-serif text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.08] tracking-[-0.015em] text-primary">
              {article.title}
            </h1>
            <p className="prose-measure mx-auto mt-6 text-body-lg italic text-secondary">
              {article.excerpt}
            </p>
          </header>

          {article.coverImage && (
            <RevealOnScroll className="mx-auto mt-12 max-w-4xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.coverImage}
                alt={article.coverAlt ?? ''}
                className="w-full rounded-[12px] shadow-lift ring-1 ring-black/[0.05]"
              />
            </RevealOnScroll>
          )}

          {/* Body */}
          <div className="mt-14">
            <ArticleBody blocks={article.body} />
          </div>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="prose-measure mx-auto mt-14 flex flex-wrap items-center gap-2.5 border-t border-border pt-8">
              <span className="mr-1 text-[0.78rem] uppercase tracking-[0.12em] text-secondary">Tags</span>
              {article.tags.map((t) => (
                <Link
                  key={t}
                  href={`/journal/tag/${t}`}
                  className="rounded-full border border-border px-3.5 py-1 text-[0.8rem] text-secondary transition-colors hover:border-moss hover:text-moss"
                >
                  {t}
                </Link>
              ))}
            </div>
          )}
        </article>
      </Section>

      {/* Related */}
      {related.length > 0 && (
        <Section tone="bg-alt" width="wide">
          <RevealOnScroll className="mb-12">
            <span className="eyebrow eyebrow--tick mb-4">Keep reading</span>
            <h2 className="text-h2">More from the Journal</h2>
          </RevealOnScroll>
          <ArticleGrid articles={related} categories={categories} />
        </Section>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
