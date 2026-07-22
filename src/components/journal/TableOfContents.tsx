import type { Heading } from '@/lib/journal-toc';

/**
 * Automatic Table of Contents — an "In this article" box rendered above the body.
 * Anchor links jump to the matching heading id. Renders nothing for short articles.
 */
export function TableOfContents({ headings }: { headings: Heading[] }) {
  if (headings.length < 2) return null;
  return (
    <nav
      aria-label="In this article"
      className="prose-measure mx-auto mb-12 rounded-[12px] border border-border/70 bg-surface/40 px-6 py-5"
    >
      <p className="mb-3 text-micro font-medium uppercase tracking-[0.16em] text-moss">In this article</p>
      <ol className="space-y-1.5">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? 'pl-4' : ''}>
            <a href={`#${h.id}`} className="link-underline text-body text-secondary hover:text-moss">
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
