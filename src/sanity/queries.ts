import { client } from './client';

/**
 * GROQ queries + a guarded fetch. Projections return exactly the Journal `Article` /
 * `Category` / `Series` / `Author` / `Tag` shapes from src/content/journal/types.ts, so
 * the data layer stays source-agnostic. Body images keep their asset reference (resolved
 * to URLs by @sanity/image-url in the renderer); hero/cover/og images resolve to URLs.
 */

const ARTICLE_PROJECTION = /* groq */ `{
  "slug": slug.current,
  title,
  subtitle,
  excerpt,
  publishedAt,
  updatedAt,
  "author": author->slug.current,
  "category": category->slug.current,
  "series": series->slug.current,
  "seriesTitle": series->title,
  "tags": coalesce(tags[]->slug.current, []),
  "coverImage": heroImage.asset->url + "?w=1600&fit=max&auto=format&q=80",
  "coverAlt": heroImage.alt,
  body,
  "featured": coalesce(featured, false),
  "relatedPractices": coalesce(relatedPractices, []),
  "relatedPrograms": coalesce(relatedPrograms, []),
  "seoTitle": seo.metaTitle,
  "seoDescription": seo.metaDescription,
  "ogImage": seo.ogImage.asset->url + "?w=1200&h=630&fit=crop&auto=format&q=80",
  "canonicalUrl": seo.canonicalUrl,
  "noIndex": coalesce(seo.noIndex, false)
}`;

export const ALL_ARTICLES = /* groq */ `*[_type == "article" && defined(slug.current) && !(_id in path("drafts.**"))] | order(publishedAt desc) ${ARTICLE_PROJECTION}`;

export const ALL_CATEGORIES = /* groq */ `*[_type == "category" && defined(slug.current)] | order(coalesce(order, 100) asc, title asc) {
  "slug": slug.current, title, description, order
}`;

export const ALL_SERIES = /* groq */ `*[_type == "series" && defined(slug.current)] | order(title asc) {
  "slug": slug.current, title, description, "coverImage": coverImage.asset->url + "?w=800&fit=max&auto=format&q=80"
}`;

export const ALL_AUTHORS = /* groq */ `*[_type == "author" && defined(slug.current)] {
  "slug": slug.current, name, designation, "role": designation,
  "photo": photo.asset->url + "?w=160&h=160&fit=crop&auto=format&q=80", "bio": pt::text(bio), "socials": socialLinks[]{platform, url}
}`;

export const ALL_TAGS = /* groq */ `*[_type == "tag" && defined(slug.current)] | order(title asc) {
  "slug": slug.current, title
}`;

/** Fetch from Sanity, or `null` if Sanity isn't configured (→ local fallback). */
export async function sanityFetch<T>(query: string): Promise<T | null> {
  if (!client) return null;
  try {
    return await client.fetch<T>(query);
  } catch (err) {
    console.error('[sanity] fetch failed, falling back to local content:', err);
    return null;
  }
}
