import Link from 'next/link';
import type { Series } from '@/content/journal/types';

/**
 * "Browse by Series" — collections of related articles. Renders nothing when there are no
 * series, so the homepage stays clean until the first series is published in the CMS.
 */
export function SeriesNav({ series }: { series: Series[] }) {
  if (!series.length) return null;
  return (
    <div>
      <div className="mb-6">
        <span className="eyebrow eyebrow--tick mb-3">Collections</span>
        <h2 className="text-h3">Browse by series</h2>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {series.map((s) => (
          <li key={s.slug}>
            <Link
              href={`/journal/series/${s.slug}`}
              className="group flex h-full flex-col rounded-[12px] border border-border/70 bg-surface/50 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-moss/40 hover:shadow-soft focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <span className="text-[0.68rem] uppercase tracking-[0.16em] text-moss">Series</span>
              <span className="mt-1.5 font-serif text-[1.2rem] leading-snug text-primary">{s.title}</span>
              {s.description && (
                <span className="mt-2 text-body text-secondary line-clamp-3">{s.description}</span>
              )}
              <span className="mt-4 text-caption text-moss">Explore</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
