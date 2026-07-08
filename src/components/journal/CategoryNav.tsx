import Link from 'next/link';
import type { Category } from '@/content/journal/types';

/**
 * A quiet row of category links for the Journal, plus "All" and a search entry.
 * Supports internal linking between journal sections (SEO) and orientation for readers.
 */
export function CategoryNav({
  categories,
  activeSlug,
}: {
  categories: Category[];
  activeSlug?: string;
}) {
  const base =
    'rounded-full border px-4 py-1.5 text-[0.82rem] tracking-wide transition-colors';
  return (
    <nav aria-label="Journal categories" className="flex flex-wrap items-center gap-2.5">
      <Link
        href="/journal"
        className={`${base} ${!activeSlug ? 'border-moss bg-moss text-inverse' : 'border-border text-secondary hover:border-moss hover:text-moss'}`}
      >
        All
      </Link>
      {categories.map((c) => (
        <Link
          key={c.slug}
          href={`/journal/category/${c.slug}`}
          className={`${base} ${activeSlug === c.slug ? 'border-moss bg-moss text-inverse' : 'border-border text-secondary hover:border-moss hover:text-moss'}`}
        >
          {c.title}
        </Link>
      ))}
      <Link
        href="/journal/search"
        className={`${base} ml-auto inline-flex items-center gap-1.5 border-border text-secondary hover:border-moss hover:text-moss`}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
          <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4" />
          <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        Search
      </Link>
    </nav>
  );
}
