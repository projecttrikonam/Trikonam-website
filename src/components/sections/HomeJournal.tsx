import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { Button } from '@/components/ui/Button';
import { ArticleGrid } from '@/components/journal/ArticleGrid';
import type { Article, Category } from '@/content/journal/types';

/**
 * Home → "From the Journal" (2026 refinement).
 *
 * Renders the three most recent Journal pieces. Data is fetched by the page through the
 * existing CMS data layer (src/lib/journal.ts) and passed in — never hardcoded here.
 * Signals that Trikonam is also a place for learning and contemplation, not only
 * registration.
 */
export function HomeJournal({
  articles,
  categories,
}: {
  articles: Article[];
  categories: Category[];
}) {
  const latest = articles.slice(0, 3);
  if (latest.length === 0) return null;

  return (
    <section className="bg-bg-alt px-6 py-20 sm:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <RevealOnScroll variant="rise" className="mb-14 flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
          <div className="max-w-2xl">
            <span className="eyebrow eyebrow--tick mb-6 block">From the Journal</span>
            <h2 className="text-balance font-serif text-[clamp(1.6rem,3.4vw,2.6rem)] font-normal leading-[1.22] text-primary">
              Reading, not only registering.
            </h2>
            <p className="prose-measure mt-8 text-body-lg text-secondary">
              Quiet writing on the practice, its philosophy, and living well around it —
              added slowly, when there is something worth saying.
            </p>
          </div>
          <Button href="/journal" variant="text">
            All writing
          </Button>
        </RevealOnScroll>

        <ArticleGrid articles={latest} categories={categories} srHeading="Recent Journal articles" />
      </div>
    </section>
  );
}
