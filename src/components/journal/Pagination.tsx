import Link from 'next/link';

/**
 * Accessible pagination. `buildHref` maps a page number to a URL so the same component
 * serves the main listing, category, and tag pages.
 */
export function Pagination({
  page,
  totalPages,
  buildHref,
}: {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Pagination" className="mt-20 flex items-center justify-center gap-2">
      {page > 1 && (
        <Link
          href={buildHref(page - 1)}
          rel="prev"
          className="px-3 py-2 text-[0.85rem] text-moss hover:text-moss-dark"
        >
          Previous
        </Link>
      )}
      <ul className="flex items-center gap-1">
        {pages.map((n) => (
          <li key={n}>
            <Link
              href={buildHref(n)}
              aria-current={n === page ? 'page' : undefined}
              className={`flex h-9 w-9 items-center justify-center rounded-full text-[0.85rem] tabular-nums transition-colors ${
                n === page ? 'bg-moss text-inverse' : 'text-secondary hover:text-moss'
              }`}
            >
              {n}
            </Link>
          </li>
        ))}
      </ul>
      {page < totalPages && (
        <Link
          href={buildHref(page + 1)}
          rel="next"
          className="px-3 py-2 text-[0.85rem] text-moss hover:text-moss-dark"
        >
          Next
        </Link>
      )}
    </nav>
  );
}
