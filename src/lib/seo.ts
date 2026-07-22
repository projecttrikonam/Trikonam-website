/**
 * SEO utilities — one place for metadata construction and structured data (JSON-LD).
 *
 * Keeping these here means every page produces consistent titles, descriptions,
 * canonical URLs, Open Graph / Twitter cards, and schema. See docs/SEO.md.
 */
import type { Metadata } from 'next';
import { siteConfig } from '@/content/site-config';
import type { Article, Author, Category } from '@/content/journal/types';

const absolute = (path: string) =>
  /^https?:\/\//.test(path) ? path : `${siteConfig.url}${path === '/' ? '' : path}`;

/**
 * Build page Metadata with a canonical URL and per-page Open Graph / Twitter cards.
 * `path` must start with '/'. `image` defaults to the site OG image.
 */
export function pageMetadata({
  title,
  description,
  path,
  type = 'website',
  image = '/og-image.jpg',
  publishedTime,
  modifiedTime,
  noIndex = false,
}: {
  /**
   * Plain string titles are run through the root layout's `%s · Trikonam` template
   * (e.g. 'About' → 'About · Trikonam'). Pass `{ absolute: '...' }` to bypass the
   * template entirely — used by the home page, which wants the layout's own default
   * title verbatim rather than a templated variant.
   */
  title: string | { absolute: string };
  description: string;
  path: string;
  type?: 'website' | 'article';
  image?: string;
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
}): Metadata {
  const cleaned = typeof title === 'string' ? stripBrandSuffix(title) : title;
  const flatTitle = typeof cleaned === 'string' ? cleaned : cleaned.absolute;
  description = clampDescription(description);
  return {
    title: cleaned,
    description,
    alternates: { canonical: path },
    robots: noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      type,
      url: absolute(path),
      title: flatTitle,
      description,
      siteName: siteConfig.name,
      images: [{ url: image, width: 1200, height: 630 }],
      ...(type === 'article' ? { publishedTime, modifiedTime } : {}),
    },
    twitter: { card: 'summary_large_image', title: flatTitle, description, images: [image] },
  };
}

/**
 * Keeps a meta description inside the ~155 characters a search result actually shows.
 *
 * Several descriptions reuse a `summary` that also appears on the page, and CMS copy is
 * written by hand — so rather than shortening the visible content, the description is
 * clamped here at a word boundary. Anything already short enough passes through
 * untouched, so this only ever acts on the tail Google would have cut anyway.
 */
function clampDescription(text: string, max = 155): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const at = cut.lastIndexOf(' ');
  return `${cut.slice(0, at > 0 ? at : max).replace(/[,;:—–-]$/, '')}…`;
}

/**
 * Removes a trailing brand suffix from a page title.
 *
 * The root layout already templates titles as `%s · Trikonam`, but a CMS `metaTitle` is
 * written by hand and editors reasonably type the brand in themselves — which produced
 * "… | Trikonam Journal · Trikonam". Stripping it here means the rule holds for every
 * article ever published, rather than being corrected one document at a time.
 */
function stripBrandSuffix(title: string): string {
  return title.replace(/\s*[|·–—-]\s*Trikonam(\s+Journal)?\s*$/i, '').trim() || title;
}

/** Organization + LocalBusiness schema (Phase 3/4). Region-only — no fabricated address. */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': ['EducationalOrganization', 'LocalBusiness'],
    '@id': `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    alternateName: 'Trikonam Classical Hatha Yoga',
    description: siteConfig.description,
    url: siteConfig.url,
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phone,
    image: absolute('/og-image.jpg'),
    knowsAbout: [
      'Classical Hatha Yoga',
      'Hatha Yoga',
      'Pranayama',
      'Meditation',
      'Corporate Wellness',
      'Yoga for Schools and Colleges',
    ],
    areaServed: [
      { '@type': 'City', name: 'Hyderabad' },
      { '@type': 'AdministrativeArea', name: 'Telangana' },
      { '@type': 'AdministrativeArea', name: 'Andhra Pradesh' },
      { '@type': 'Country', name: 'India' },
    ],
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'Telangana & Andhra Pradesh',
      addressCountry: 'IN',
    },
  };
}

/** Article schema for a Journal post (Phase 3). */
export function articleJsonLd(article: Article, author?: Author, category?: Category) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: { '@type': 'WebPage', '@id': absolute(`/journal/${article.slug}`) },
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    articleSection: category?.title,
    keywords: article.tags.join(', '),
    ...(article.coverImage ? { image: [absolute(article.coverImage)] } : {}),
    author: { '@type': 'Organization', name: author?.name ?? siteConfig.name },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: { '@type': 'ImageObject', url: absolute('/og-image.jpg') },
    },
  };
}

/** FAQPage schema (Phase 3). */
export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}
