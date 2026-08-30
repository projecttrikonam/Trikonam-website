import Link from 'next/link';
import { CategoryLabel } from './CategoryLabel';
import { formatDate, readingTime } from '@/lib/journal';
import type { Article, Category } from '@/content/journal/types';

/**
 * An article preview in the Journal grid. Every image is framed to the same 3:2 so a row
 * of cards reads as one collection. On hover or keyboard focus the card lifts a few
 * pixels and the image drifts within its frame — the shared `.tactile` vocabulary,
 * deliberately the only two movements, to keep the page calm.
 *
 * Uses `coverImageThumb` (grid-sized) rather than the hero-sized `coverImage`.
 */
export function ArticleCard({
  article,
  categories,
}: {
  article: Article;
  categories: Category[];
}) {
  const category = categories.find((c) => c.slug === article.category);
  const image = article.coverImageThumb ?? article.coverImage;
  const href = `/journal/${article.slug}`;

  return (
    <article className="group flex h-full flex-col transition-transform duration-500 ease-calm hover:-translate-y-1 focus-within:-translate-y-1 motion-reduce:hover:translate-y-0 motion-reduce:focus-within:translate-y-0">
      {image && (
        <Link href={href} className="mb-6 block overflow-hidden bg-bg-alt" tabIndex={-1} aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={article.coverAlt ?? ''}
            loading="lazy"
            decoding="async"
            className="tactile-media aspect-[3/2] w-full object-cover ring-1 ring-black/[0.05]"
          />
        </Link>
      )}
      <CategoryLabel category={category} />
      <h3 className="mt-3 font-serif text-[1.4rem] leading-snug text-primary">
        <Link href={href} className="transition-colors duration-300 hover:text-moss">
          {article.title}
        </Link>
      </h3>
      <p className="mt-3 flex-1 text-body leading-relaxed text-secondary">{article.excerpt}</p>
      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.72rem] uppercase tracking-[0.13em] text-secondary/80">
        <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
        <span aria-hidden className="text-border">·</span>
        <span>{readingTime(article)} min read</span>
      </div>
    </article>
  );
}
