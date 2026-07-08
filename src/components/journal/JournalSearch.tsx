'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { SearchDoc } from '@/lib/journal';

/**
 * Client-side Journal search.
 *
 * The search index is built at request/build time on the server (getSearchIndex) and
 * passed in as a prop, so the filtering runs instantly in the browser with no network.
 * @cms When the catalogue grows, swap this for Algolia/Sanity search by replacing the
 * `index` prop with a hosted search call — the results UI stays the same. (CMS_PREPARATION.md)
 */
export function JournalSearch({ index }: { index: SearchDoc[] }) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return index.filter((d) =>
      `${d.title} ${d.excerpt} ${d.tags.join(' ')} ${d.category} ${d.text}`
        .toLowerCase()
        .includes(q),
    );
  }, [query, index]);

  return (
    <div>
      <label htmlFor="journal-search" className="sr-only">
        Search the Journal
      </label>
      <div className="relative">
        <svg
          width="18"
          height="18"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-secondary"
        >
          <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4" />
          <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <input
          id="journal-search"
          type="search"
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the Journal…"
          className="w-full rounded-full border border-border bg-surface py-3.5 pl-12 pr-5 text-body text-primary shadow-soft outline-none transition-colors placeholder:text-secondary/70 focus:border-moss"
        />
      </div>

      <div className="mt-10" aria-live="polite">
        {query.trim() && (
          <p className="mb-8 text-[0.82rem] uppercase tracking-[0.12em] text-secondary">
            {results.length} {results.length === 1 ? 'result' : 'results'} for “{query.trim()}”
          </p>
        )}
        <ul className="divide-y divide-border border-y border-border">
          {results.map((d) => (
            <li key={d.slug}>
              <Link href={`/journal/${d.slug}`} className="group block py-6">
                <h3 className="font-serif text-[1.35rem] text-primary transition-colors group-hover:text-moss">
                  {d.title}
                </h3>
                <p className="mt-2 text-body text-secondary">{d.excerpt}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
