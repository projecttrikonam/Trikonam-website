import Link from 'next/link';
import { ArticleMeta } from './ArticleMeta';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { readingTime } from '@/lib/journal';
import type { Article, Category } from '@/content/journal/types';

/**
 * The featured article at the head of the Journal — given more room than a card. Text
 * carries it (a cover image shows only when one truly exists).
 */
export function FeaturedArticle({
  article,
  categories,
}: {
  article: Article;
  categories: Category[];
}) {
  const category = categories.find((c) => c.slug === article.category);

  return (
    <RevealOnScroll>
      <article className="group grid gap-8 md:grid-cols-12 md:items-center md:gap-14">
        {article.coverImage && (
          <Link
            href={`/journal/${article.slug}`}
            className="block overflow-hidden rounded-[12px] bg-bg-alt shadow-lift ring-1 ring-black/[0.05] md:col-span-7"
            aria-hidden
            tabIndex={-1}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.coverImage}
              alt={article.coverAlt ?? ''}
              className="aspect-[16/10] w-full object-cover transition-transform duration-[1200ms] ease-calm group-hover:scale-[1.03]"
            />
          </Link>
        )}
        <div className={article.coverImage ? 'md:col-span-5' : 'md:col-span-9'}>
          <span className="eyebrow eyebrow--tick mb-5">Featured</span>
          <ArticleMeta article={article} category={category} readingMinutes={readingTime(article)} className="mb-4" />
          <h2 className="font-serif text-[clamp(1.9rem,3.4vw,2.75rem)] leading-[1.1] tracking-[-0.01em] text-primary">
            <Link href={`/journal/${article.slug}`} className="transition-colors hover:text-moss">
              {article.title}
            </Link>
          </h2>
          <p className="prose-measure mt-5 text-body-lg text-secondary">{article.excerpt}</p>
          <Link
            href={`/journal/${article.slug}`}
            className="mt-7 inline-flex items-center gap-2 text-[0.85rem] font-medium uppercase tracking-[0.12em] text-moss"
          >
            Read the article
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </article>
    </RevealOnScroll>
  );
}
