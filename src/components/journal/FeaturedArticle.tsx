import Link from 'next/link';
import { CategoryLabel } from './CategoryLabel';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { formatDate, readingTime } from '@/lib/journal';
import type { Article, Category } from '@/content/journal/types';

/**
 * The lead article at the head of the Journal — the page's focal point. A full-width
 * landscape image with the words centred beneath it, given far more room than a card, so
 * the page opens like a publication rather than a feed. Square corners and no card
 * chrome, matching the article page's hero.
 */
export function FeaturedArticle({
  article,
  categories,
}: {
  article: Article;
  categories: Category[];
}) {
  const category = categories.find((c) => c.slug === article.category);
  const href = `/journal/${article.slug}`;

  return (
    <RevealOnScroll>
      <article className="group">
        {article.coverImage && (
          <Link href={href} className="block overflow-hidden bg-bg-alt" tabIndex={-1} aria-hidden>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.coverImage}
              srcSet={article.coverImageSrcSet}
              sizes="(min-width: 1152px) 1152px, 100vw"
              alt={article.coverAlt ?? ''}
              loading="eager"
              fetchPriority="high"
              className="aspect-[3/2] w-full object-cover ring-1 ring-black/[0.05] transition-transform duration-[1200ms] ease-calm group-hover:scale-[1.02]"
            />
          </Link>
        )}

        <div className={`mx-auto max-w-2xl text-center ${article.coverImage ? 'mt-11 sm:mt-14' : ''}`}>
          <CategoryLabel category={category} />
          <h2 className="mt-4 text-balance font-serif text-[clamp(1.7rem,3.2vw,2.6rem)] leading-[1.12] tracking-[-0.01em] text-primary">
            <Link href={href} className="transition-colors duration-300 hover:text-moss">
              {article.title}
            </Link>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-body-lg leading-relaxed text-secondary">
            {article.excerpt}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[0.74rem] uppercase tracking-[0.14em] text-secondary/80">
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
            <span aria-hidden className="text-border">·</span>
            <span>{readingTime(article)} min read</span>
          </div>
          <Link
            href={href}
            className="mt-9 inline-block border-b border-moss/30 pb-1 text-fine font-medium uppercase tracking-[0.16em] text-moss transition-colors duration-300 hover:border-moss hover:text-moss-dark"
          >
            Read article
          </Link>
        </div>
      </article>
    </RevealOnScroll>
  );
}
