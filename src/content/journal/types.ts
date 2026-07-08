/**
 * Journal content model.
 *
 * These types are the CONTRACT between content and presentation. They are deliberately
 * shaped to mirror Sanity CMS conventions so that a future migration is mechanical:
 *   • the block union below mirrors Sanity's Portable Text (`_type` discriminator);
 *   • Article / Category / Tag / Author map 1:1 to Sanity document types;
 *   • references (category, tags, author) are stored by slug now and become Sanity
 *     references later.
 *
 * See docs/CMS_PREPARATION.md for the full migration plan. Do not put presentation
 * concerns (class names, JSX) in this file — content only.
 */

export interface Author {
  /** Stable id / slug. */
  slug: string;
  name: string;
  role?: string;
}

export interface Category {
  slug: string;
  title: string;
  description?: string;
}

export interface Tag {
  slug: string;
  title: string;
}

/**
 * A single block of article body content. This union mirrors Sanity Portable Text —
 * each block carries a `_type` discriminator. A CMS migration replaces this hand-rolled
 * union with `@portabletext/types` and swaps <ArticleBody> for <PortableText>.
 */
export type PortableBlock =
  | { _type: 'heading'; level: 2 | 3; text: string }
  | { _type: 'paragraph'; text: string }
  | { _type: 'quote'; text: string; attribution?: string }
  | { _type: 'list'; style: 'bullet' | 'number'; items: string[] }
  | { _type: 'image'; src: string; alt: string; caption?: string };

export interface Article {
  slug: string;
  title: string;
  /** One or two sentences; used on cards, meta description fallback, and previews. */
  excerpt: string;
  /** ISO 8601 date (YYYY-MM-DD). */
  publishedAt: string;
  updatedAt?: string;
  /** Author slug → resolved via getAuthor(). */
  author: string;
  /** Category slug → resolved via getCategory(). */
  category: string;
  /** Tag slugs. */
  tags: string[];
  /** Optional cover image path under /public/images/journal/. */
  coverImage?: string;
  coverAlt?: string;
  /** Portable-text-like body. */
  body: PortableBlock[];
  /** At most one featured article surfaces on the Journal landing hero. */
  featured?: boolean;
  /** Optional SEO overrides; fall back to title/excerpt when absent. */
  seoTitle?: string;
  seoDescription?: string;
}

/** A page of results, produced by paginate(). */
export interface Paginated<T> {
  items: T[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}
