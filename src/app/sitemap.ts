import type { MetadataRoute } from 'next';
import { siteConfig } from '@/content/site-config';
import { practices } from '@/content/practices';
import { teachers } from '@/content/teachers';
import { learningPaths } from '@/content/learning-paths';
import {
  ARTICLES_PER_PAGE,
  getAllArticles,
  getArticles,
  getCategories,
  getFeaturedArticle,
  getSeriesList,
  paginate,
} from '@/lib/journal';

/** Parse an ISO date that may be date-only ("2026-06-02") or a full datetime. */
const toDate = (iso: string) => new Date(iso.length <= 10 ? `${iso}T00:00:00` : iso);

// Sitemap (Handoff §11.1 / SEO Phase 3). Emitted as /sitemap.xml at build time.
// Static export requires this to be fully static — no request-time data.
export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const now = new Date();

  const staticRoutes = [
    '',
    '/about',
    '/teachers',
    '/practices',
    '/online-programs',
    '/begin',
    '/programs',
    '/programs/corporate',
    '/programs/schools-colleges',
    '/journal',
    '/gallery',
    '/testimonials',
    '/faqs',
    '/contact',
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: path === '' ? 1 : path === '/online-programs' ? 0.9 : 0.7,
  }));

  const practiceRoutes = practices.map((p) => ({
    url: `${base}/practices/${p.slug}`,
    lastModified: now,
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }));

  const teacherRoutes = teachers.map((t) => ({
    url: `${base}/teachers/${t.slug}`,
    lastModified: now,
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }));

  const learningRoutes = learningPaths.map((p) => ({
    url: `${base}/learn/${p.slug}`,
    lastModified: now,
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }));

  // --- Journal ---
  const articles = await getAllArticles();
  const articleRoutes = articles.map((a) => ({
    url: `${base}/journal/${a.slug}`,
    lastModified: toDate(a.updatedAt ?? a.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const categories = await getCategories();
  const categoryRoutes = categories.map((c) => ({
    url: `${base}/journal/category/${c.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  const series = await getSeriesList();
  const seriesRoutes = series.map((s) => ({
    url: `${base}/journal/series/${s.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  const featured = await getFeaturedArticle();
  const rest = await getArticles({ excludeSlug: featured?.slug });
  const { totalPages } = paginate(rest, 1, ARTICLES_PER_PAGE);
  const paginationRoutes = Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
    url: `${base}/journal/page/${i + 2}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.3,
  }));

  // Tag pages are intentionally noindex (thin aggregations) — omitted from the sitemap.

  return [
    ...staticRoutes,
    ...practiceRoutes,
    ...teacherRoutes,
    ...learningRoutes,
    ...articleRoutes,
    ...categoryRoutes,
    ...seriesRoutes,
    ...paginationRoutes,
  ];
}
