import Link from 'next/link';
import { formatDate } from '@/lib/journal';
import type { Article, Category } from '@/content/journal/types';

/**
 * The quiet meta line beneath an article title: date · category · reading time.
 * Category links to its page (internal linking / SEO).
 */
export function ArticleMeta({
  article,
  category,
  readingMinutes,
  className = '',
}: {
  article: Article;
  category?: Category;
  readingMinutes: number;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.78rem] uppercase tracking-[0.12em] text-secondary ${className}`}
    >
      <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
      {category && (
        <>
          <span aria-hidden className="text-border">·</span>
          <Link href={`/journal/category/${category.slug}`} className="text-moss hover:text-moss-dark">
            {category.title}
          </Link>
        </>
      )}
      <span aria-hidden className="text-border">·</span>
      <span>{readingMinutes} min read</span>
    </div>
  );
}
