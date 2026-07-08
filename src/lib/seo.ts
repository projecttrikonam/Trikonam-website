/**
 * SEO utilities — one place for metadata construction and structured data (JSON-LD).
 *
 * Keeping these here means every page produces consistent titles, descriptions,
 * canonical URLs, Open Graph / Twitter cards, and schema. See docs/SEO.md.
 */
import type { Metadata } from 'next';
import { siteConfig } from '@/content/site-config';
import type { Article, Author, Category } from '@/content/journal/types';

const absolute = (path: string) => `${siteConfig.url}${path === '/' ? '' : path}`;

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
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'article';
  image?: string;
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      type,
      url: absolute(path),
      title,
      description,
      siteName: siteConfig.name,
      images: [{ url: image, width: 1200, height: 630 }],
      ...(type === 'article' ? { publishedTime, modifiedTime } : {}),
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
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
    telephone: siteConfig.contact.phones,
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
