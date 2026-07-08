/**
 * JOURNAL DATA ACCESS LAYER — the single integration point for the CMS.
 * ---------------------------------------------------------------------------
 * Every page and component reads the Journal through these functions and NEVER imports
 * the raw data arrays directly. That indirection is the whole point: today each function
 * returns local seed data; to move to Sanity CMS, you replace the BODY of each function
 * with a GROQ `client.fetch(...)` call and change nothing else.
 *
 * The functions are already `async` so that pages `await` them now — meaning the switch
 * to Sanity's async client is a drop-in with zero signature changes.
 *
 * Each swappable function is marked `@cms` below. See docs/CMS_PREPARATION.md.
 * ---------------------------------------------------------------------------
 */
import { articles } from '@/content/journal/articles';
import { authors } from '@/content/journal/authors';
import { categories, tags } from '@/content/journal/categories';
import type { Article, Author, Category, Paginated, Tag } from '@/content/journal/types';

/** How many articles per page in listings. */
export const ARTICLES_PER_PAGE = 4;

const byNewest = (a: Article, b: Article) =>
  b.publishedAt.localeCompare(a.publishedAt);

/** @cms getAllArticles → `client.fetch(groq\`*[_type=="article"]|order(publishedAt desc)\`)` */
export async function getAllArticles(): Promise<Article[]> {
  return [...articles].sort(byNewest);
}

/** @cms getArticleBySlug → `client.fetch(groq\`*[_type=="article" && slug.current==$slug][0]\`, { slug })` */
export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  return articles.find((a) => a.slug === slug);
}

/** The single featured article (falls back to the newest). @cms */
export async function getFeaturedArticle(): Promise<Article | undefined> {
  const featured = [...articles].sort(byNewest).find((a) => a.featured);
  return featured ?? [...articles].sort(byNewest)[0];
}

/** Newest-first, excluding one slug (used to keep the featured article out of the grid). */
export async function getArticles(options?: { excludeSlug?: string }): Promise<Article[]> {
  const all = await getAllArticles();
  return options?.excludeSlug ? all.filter((a) => a.slug !== options.excludeSlug) : all;
}

/** @cms getArticlesByCategory */
export async function getArticlesByCategory(categorySlug: string): Promise<Article[]> {
  return (await getAllArticles()).filter((a) => a.category === categorySlug);
}

/** @cms getArticlesByTag */
export async function getArticlesByTag(tagSlug: string): Promise<Article[]> {
  return (await getAllArticles()).filter((a) => a.tags.includes(tagSlug));
}

/** Related articles: same category, then shared tags, newest first. */
export async function getRelatedArticles(article: Article, limit = 3): Promise<Article[]> {
  const all = await getArticles({ excludeSlug: article.slug });
  const scored = all
    .map((a) => ({
      a,
      score:
        (a.category === article.category ? 2 : 0) +
        a.tags.filter((t) => article.tags.includes(t)).length,
    }))
    .filter((x) => x.score > 0)
    .sort((x, y) => y.score - x.score);
  const picked = (scored.length ? scored.map((x) => x.a) : all).slice(0, limit);
  return picked;
}

// --- Taxonomy -------------------------------------------------------------
export async function getCategories(): Promise<Category[]> {
  return categories;
}
export async function getCategory(slug: string): Promise<Category | undefined> {
  return categories.find((c) => c.slug === slug);
}
export async function getTags(): Promise<Tag[]> {
  return tags;
}
export async function getTag(slug: string): Promise<Tag | undefined> {
  return tags.find((t) => t.slug === slug);
}
export async function getAuthor(slug: string): Promise<Author | undefined> {
  return authors.find((a) => a.slug === slug);
}

// --- Search ---------------------------------------------------------------
/**
 * Naive full-text search over title, excerpt, tags, and body text.
 * @cms For a real CMS this becomes a Sanity GROQ text query or an Algolia index — the
 * signature stays the same. See docs/CMS_PREPARATION.md ("Search").
 */
export async function searchArticles(query: string): Promise<Article[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const all = await getAllArticles();
  return all.filter((a) => {
    const haystack = [
      a.title,
      a.excerpt,
      a.tags.join(' '),
      a.category,
      a.body.map((b) => ('text' in b ? b.text : 'items' in b ? b.items.join(' ') : '')).join(' '),
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  });
}

/** A lightweight client-side search index (used by the search page). */
export interface SearchDoc {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  text: string;
}
export async function getSearchIndex(): Promise<SearchDoc[]> {
  const all = await getAllArticles();
  return all.map((a) => ({
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    category: a.category,
    tags: a.tags,
    text: a.body
      .map((b) => ('text' in b ? b.text : 'items' in b ? b.items.join(' ') : ''))
      .join(' '),
  }));
}

// --- Helpers --------------------------------------------------------------
/** Estimated reading time in whole minutes (~200 wpm). */
export function readingTime(article: Article): number {
  const words = article.body
    .map((b) => ('text' in b ? b.text : 'items' in b ? b.items.join(' ') : ''))
    .join(' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Format an ISO date as e.g. "2 June 2026". */
export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** Slice an array into a page of results. */
export function paginate<T>(items: T[], page: number, perPage = ARTICLES_PER_PAGE): Paginated<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * perPage;
  return {
    items: items.slice(start, start + perPage),
    page: current,
    perPage,
    total,
    totalPages,
  };
}
