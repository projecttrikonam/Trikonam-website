import Link from 'next/link';
import type { Category } from '@/content/journal/types';

/**
 * The category as a standalone label above an article title — the Journal's main
 * signpost in listings. Kept in one place so the featured article and the grid label
 * things identically. Renders nothing when an article has no category.
 */
export function CategoryLabel({
  category,
  className = '',
}: {
  category?: Category;
  className?: string;
}) {
  if (!category) return null;
  return (
    <Link
      href={`/journal/category/${category.slug}`}
      className={`inline-block text-[0.7rem] font-medium uppercase tracking-[0.2em] text-moss transition-colors hover:text-moss-dark ${className}`}
    >
      {category.title}
    </Link>
  );
}
