/**
 * Journal content model — the CONTRACT between content and presentation.
 *
 * These types are the single shape every Journal page and component reads, whether the
 * data comes from Sanity (production) or the local seed files (fallback when Sanity isn't
 * configured). The block union mirrors Sanity Portable Text so one renderer handles both.
 *
 * See docs/JOURNAL_CMS.md for the CMS runbook and docs/CMS_PREPARATION.md for background.
 */

export interface SocialLink {
  platform: string;
  url: string;
}

export interface Author {
  /** Stable id / slug. */
  slug: string;
  name: string;
  /** Job title, e.g. "Classical Hatha Yoga Teacher". */
  role?: string;
  designation?: string;
  /** Resolved image URL (Sanity CDN) or /public path. */
  photo?: string;
  /** Flattened plain-text bio for the byline card. */
  bio?: string;
  socials?: SocialLink[];
}

export interface Category {
  slug: string;
  title: string;
  description?: string;
  order?: number;
}

export interface Series {
  slug: string;
  title: string;
  description?: string;
  coverImage?: string;
}

export interface Tag {
  slug: string;
  title: string;
}

/**
 * One block of article body content. The first five members are the local-seed shape;
 * the rest mirror Sanity Portable Text (native `block` text plus Trikonam's custom
 * editorial blocks). A single <ArticleBody> renders every `_type`, so local and Sanity
 * content share one renderer.
 */
export type PortableBlock =
  | { _type: 'heading'; level: 2 | 3; text: string }
  | { _type: 'paragraph'; text: string }
  | { _type: 'quote'; text: string; attribution?: string }
  | { _type: 'list'; style: 'bullet' | 'number'; items: string[] }
  | { _type: 'image'; src?: string; alt: string; caption?: string; asset?: unknown }
  // Sanity Portable Text (loosely typed — the renderer reads them structurally):
  | { _type: 'block'; [key: string]: unknown }
  | { _type: 'callout'; [key: string]: unknown }
  | { _type: 'gallery'; [key: string]: unknown }
  | { _type: 'videoEmbed'; [key: string]: unknown }
  | { _type: 'pullQuote'; [key: string]: unknown };

export interface Article {
  slug: string;
  title: string;
  subtitle?: string;
  /** One or two sentences; cards, meta-description fallback, previews. */
  excerpt: string;
  /** ISO 8601 date. */
  publishedAt: string;
  updatedAt?: string;
  /** Author slug → resolved via getAuthor(). */
  author: string;
  /** Category slug → resolved via getCategory(). */
  category: string;
  /** Optional series slug + title (denormalised for convenience). */
  series?: string;
  seriesTitle?: string;
  /** Tag slugs. */
  tags: string[];
  /** Resolved cover/hero image URL. */
  coverImage?: string;
  coverAlt?: string;
  /** Portable-text body (see PortableBlock). */
  body: PortableBlock[];
  /** At most one featured article surfaces on the Journal landing hero. */
  featured?: boolean;
  /** Related practice slugs (resolve against src/content/practices.ts). */
  relatedPractices?: string[];
  /** Related program keys (resolve against JOURNAL program map). */
  relatedPrograms?: string[];
  /** SEO overrides; fall back to title/excerpt/coverImage when absent. */
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

/** A page of results, produced by paginate(). */
export interface Paginated<T> {
  items: T[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}
