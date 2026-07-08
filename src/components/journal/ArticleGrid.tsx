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
}: {
  articles: Article[];
  categories: Category[];
  emptyMessage?: string;
}) {
  if (articles.length === 0) {
    return (
      <p className="py-16 text-center text-body-lg text-secondary">{emptyMessage}</p>
    );
  }

  return (
    <ul className="grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article, i) => (
        <RevealOnScroll as="li" key={article.slug} delay={(i % 3) * 0.05} className="h-full">
          <ArticleCard article={article} categories={categories} />
        </RevealOnScroll>
      ))}
    </ul>
  );
}
