import type { MetadataRoute } from 'next';
import { siteConfig } from '@/content/site-config';

// robots.txt (Handoff §11.1). Static for export.
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
