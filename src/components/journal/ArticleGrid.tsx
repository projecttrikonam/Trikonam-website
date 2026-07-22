import { ArticleCard } from './ArticleCard';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import type { Article, Category } from '@/content/journal/types';

/**
 * A responsive grid of article cards, with a graceful empty state.
 */
export function ArticleGrid({
  articles,
  categories,
  emptyMessage = 'No articles here yet.',
  srHeading,
}: {
  articles: Article[];
  categories: Category[];
  emptyMessage?: string;
  /**
   * A screen-reader-only h2 naming the grid. Pass this on pages where the grid follows
   * the h1 directly, so the outline doesn't jump h1 → h3 (the cards are h3). Omit where
   * the page already shows a visible h2 above the grid.
   */
  srHeading?: string;
}) {
  if (articles.length === 0) {
    return (
      <p className="py-16 text-center text-body-lg text-secondary">{emptyMessage}</p>
    );
  }

  return (
    <>
      {srHeading && <h2 className="sr-only">{srHeading}</h2>}
      <ul className="grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article, i) => (
        <RevealOnScroll as="li" key={article.slug} delay={(i % 3) * 0.05} className="h-full">
          <ArticleCard article={article} categories={categories} />
        </RevealOnScroll>
      ))}
      </ul>
    </>
  );
}
