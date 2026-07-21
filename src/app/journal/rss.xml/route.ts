import { siteConfig } from '@/content/site-config';
import { getAllArticles, getCategories } from '@/lib/journal';

/**
 * RSS 2.0 feed for the Journal, emitted as a static file at /journal/rss.xml.
 * Static export requires a force-static GET handler with no request-time data.
 */
export const dynamic = 'force-static';

const esc = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const toRfc822 = (iso: string) =>
  new Date(iso.length <= 10 ? `${iso}T00:00:00Z` : iso).toUTCString();

export async function GET() {
  const [articles, categories] = await Promise.all([getAllArticles(), getCategories()]);
  const catTitle = (slug: string) => categories.find((c) => c.slug === slug)?.title;
  const base = siteConfig.url;
  const feedUrl = `${base}/journal/rss.xml`;
  const updated = articles[0]?.updatedAt ?? articles[0]?.publishedAt ?? new Date().toISOString();

  const items = articles
    .map((a) => {
      const url = `${base}/journal/${a.slug}`;
      const cat = catTitle(a.category);
      return `    <item>
      <title>${esc(a.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${toRfc822(a.publishedAt)}</pubDate>
      ${cat ? `<category>${esc(cat)}</category>` : ''}
      <description>${esc(a.excerpt)}</description>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(siteConfig.name)} — Journal</title>
    <link>${base}/journal</link>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    <description>Quiet writing on Classical Hatha Yoga — the practice, its philosophy, and living well around it.</description>
    <language>en</language>
    <lastBuildDate>${toRfc822(updated)}</lastBuildDate>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
