/**
 * JOURNAL DATA ACCESS LAYER — the single integration point for the CMS.
 * ---------------------------------------------------------------------------
 * Every Journal page and component reads through these functions and never imports raw
 * data. When `NEXT_PUBLIC_SANITY_PROJECT_ID` is set, the Journal is sourced from Sanity;
 * otherwise it transparently falls back to the local seed (so the site always builds and
 * never breaks). Signatures are unchanged from the local-only version — nothing
 * downstream (pages, components, SEO) changed.
 *
 * See docs/JOURNAL_CMS.md (runbook) and docs/CMS_PREPARATION.md (background).
 * ---------------------------------------------------------------------------
 */
import { articles as localArticles } from '@/content/journal/articles';
import { authors as localAuthors } from '@/content/journal/authors';
import { categories as localCategories, tags as localTags } from '@/content/journal/categories';
import { series as localSeries } from '@/content/journal/series';
import type { Article, Author, Category, Paginated, Series, Tag } from '@/content/journal/types';
import { hasSanity } from '@/sanity/env';
import { sanityFetch, ALL_ARTICLES, ALL_CATEGORIES, ALL_SERIES, ALL_AUTHORS, ALL_TAGS } from '@/sanity/queries';

/** How many articles per page in listings. */
export const ARTICLES_PER_PAGE = 4;

const byNewest = (a: Article, b: Article) => b.publishedAt.localeCompare(a.publishedAt);

// --- Dataset load (Sanity → local fallback), memoised for the build -----------
interface Dataset {
  articles: Article[];
  categories: Category[];
  series: Series[];
  authors: Author[];
  tags: Tag[];
}

const localDataset = (): Dataset => ({
  articles: localArticles,
  categories: localCategories,
  series: localSeries,
  authors: localAuthors,
  tags: localTags,
});

let cached: Promise<Dataset> | null = null;

async function loadDataset(): Promise<Dataset> {
  if (!cached) cached = fetchDataset();
  return cached;
}

async function fetchDataset(): Promise<Dataset> {
  if (!hasSanity) return localDataset();
  const [a, c, s, au, t] = await Promise.all([
    sanityFetch<Article[]>(ALL_ARTICLES),
    sanityFetch<Category[]>(ALL_CATEGORIES),
    sanityFetch<Series[]>(ALL_SERIES),
    sanityFetch<Author[]>(ALL_AUTHORS),
    sanityFetch<Tag[]>(ALL_TAGS),
  ]);
  // If the core articles query fails, fall back entirely so a build never breaks.
  if (!a) return localDataset();
  return {
    articles: a,
    categories: c && c.length ? c : localCategories,
    series: s ?? [],
    authors: au && au.length ? au : localAuthors,
    tags: t && t.length ? t : localTags,
  };
}

// --- Articles -----------------------------------------------------------------
/** @cms All articles, newest first. */
export async function getAllArticles(): Promise<Article[]> {
  return [...(await loadDataset()).articles].sort(byNewest);
}

/** @cms A single article by slug. */
export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  return (await loadDataset()).articles.find((a) => a.slug === slug);
}

/** The single featured article (falls back to the newest). @cms */
export async function getFeaturedArticle(): Promise<Article | undefined> {
  const all = await getAllArticles();
  return all.find((a) => a.featured) ?? all[0];
}

/** Newest-first, excluding one slug (keeps the featured article out of the grid). */
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

/** @cms getArticlesBySeries */
export async function getArticlesBySeries(seriesSlug: string): Promise<Article[]> {
  return (await getAllArticles()).filter((a) => a.series === seriesSlug);
}

/** Related articles: same category, then shared tags, newest first. */
export async function getRelatedArticles(article: Article, limit = 3): Promise<Article[]> {
  const all = await getArticles({ excludeSlug: article.slug });
  const scored = all
    .map((a) => ({
      a,
      score:
        (a.category === article.category ? 2 : 0) +
        (a.series && a.series === article.series ? 2 : 0) +
        a.tags.filter((t) => article.tags.includes(t)).length,
    }))
    .filter((x) => x.score > 0)
    .sort((x, y) => y.score - x.score);
  return (scored.length ? scored.map((x) => x.a) : all).slice(0, limit);
}

// --- Taxonomy -----------------------------------------------------------------
export async function getCategories(): Promise<Category[]> {
  return (await loadDataset()).categories;
}
export async function getCategory(slug: string): Promise<Category | undefined> {
  return (await loadDataset()).categories.find((c) => c.slug === slug);
}
export async function getSeriesList(): Promise<Series[]> {
  return (await loadDataset()).series;
}
export async function getSeries(slug: string): Promise<Series | undefined> {
  return (await loadDataset()).series.find((s) => s.slug === slug);
}
export async function getTags(): Promise<Tag[]> {
  return (await loadDataset()).tags;
}
export async function getTag(slug: string): Promise<Tag | undefined> {
  return (await loadDataset()).tags.find((t) => t.slug === slug);
}
export async function getAuthor(slug: string): Promise<Author | undefined> {
  return (await loadDataset()).authors.find((a) => a.slug === slug);
}

// --- Body text extraction (handles local + Sanity Portable Text) --------------
/** Flatten any body block to plain text (for reading time, search, previews). */
function blockToText(block: unknown): string {
  if (!block || typeof block !== 'object') return '';
  const b = block as Record<string, unknown>;
  if (typeof b.text === 'string') return b.text; // local paragraph/heading/quote, pullQuote
  if (Array.isArray(b.items)) return (b.items as string[]).join(' '); // local list
  if (Array.isArray(b.children)) {
    return (b.children as Array<{ text?: string }>).map((c) => c?.text ?? '').join(''); // Sanity block
  }
  if (Array.isArray(b.body)) return (b.body as unknown[]).map(blockToText).join(' '); // callout
  return '';
}
function bodyText(body: Article['body']): string {
  return body.map(blockToText).join(' ');
}

// --- Search -------------------------------------------------------------------
/** @cms Naive full-text search over title, excerpt, tags, category, and body. */
export async function searchArticles(query: string): Promise<Article[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const all = await getAllArticles();
  return all.filter((a) => {
    const haystack = [a.title, a.subtitle ?? '', a.excerpt, a.tags.join(' '), a.category, bodyText(a.body)]
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  });
}

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
    text: bodyText(a.body),
  }));
}

// --- Helpers ------------------------------------------------------------------
/** Estimated reading time in whole minutes (~200 wpm). */
export function readingTime(article: Article): number {
  const words = bodyText(article.body).trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Format an ISO date (date-only or full datetime) as e.g. "2 June 2026". */
export function formatDate(iso: string): string {
  const d = iso.length <= 10 ? new Date(`${iso}T00:00:00`) : new Date(iso);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

/** Slice an array into a page of results. */
export function paginate<T>(items: T[], page: number, perPage = ARTICLES_PER_PAGE): Paginated<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * perPage;
  return { items: items.slice(start, start + perPage), page: current, perPage, total, totalPages };
}
