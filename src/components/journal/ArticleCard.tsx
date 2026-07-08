import Link from 'next/link';
import { ArticleMeta } from './ArticleMeta';
import { readingTime } from '@/lib/journal';
import type { Article, Category } from '@/content/journal/types';

/**
 * An article preview card. Text-led and calm; shows a cover image only when the article
 * genuinely has one (professional photography only). Resolves its own category + reading
 * time from the passed categories list so pages stay simple.
 */
export function ArticleCard({
  article,
  categories,
}: {
  article: Article;
  categories: Category[];
}) {
  const category = categories.find((c) => c.slug === article.category);

  return (
    <article className="group flex h-full flex-col">
      {article.coverImage && (
        <Link
          href={`/journal/${article.slug}`}
          className="mb-6 block overflow-hidden rounded-[10px] bg-bg-alt shadow-soft ring-1 ring-black/[0.05]"
          tabIndex={-1}
          aria-hidden
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.coverImage}
            alt={article.coverAlt ?? ''}
            className="aspect-[3/2] w-full object-cover transition-transform duration-[900ms] ease-calm group-hover:scale-[1.03]"
          />
        </Link>
      )}
      <ArticleMeta article={article} category={category} readingMinutes={readingTime(article)} className="mb-3" />
      <h3 className="font-serif text-[1.5rem] leading-snug text-primary">
        <Link href={`/journal/${article.slug}`} className="transition-colors hover:text-moss">
          {article.title}
        </Link>
      </h3>
      <p className="mt-3 flex-1 text-body text-secondary">{article.excerpt}</p>
      <Link
        href={`/journal/${article.slug}`}
        className="mt-5 inline-flex items-center gap-2 text-[0.82rem] font-medium uppercase tracking-[0.12em] text-moss"
      >
        Read
        <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </Link>
    </article>
  );
}
