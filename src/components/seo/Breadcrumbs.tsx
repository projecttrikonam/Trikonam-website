import Link from 'next/link';
import { siteConfig } from '@/content/site-config';

export interface Crumb {
  label: string;
  href: string;
}

/**
 * Visual breadcrumb trail + BreadcrumbList JSON-LD (SEO breadcrumb schema), co-located
 * so the two never drift apart. `items` starts after Home (Home is prepended).
 */
export function Breadcrumbs({ items, className = '' }: { items: Crumb[]; className?: string }) {
  const trail: Crumb[] = [{ label: 'Home', href: '/' }, ...items];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      item: `${siteConfig.url}${c.href === '/' ? '' : c.href}`,
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-2 text-label uppercase tracking-[0.12em] text-secondary">
        {trail.map((c, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={c.href} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className="text-secondary/80">{c.label}</span>
              ) : (
                <Link href={c.href} className="text-moss hover:text-moss-dark">{c.label}</Link>
              )}
              {!last && <span aria-hidden className="text-border">/</span>}
            </li>
          );
        })}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </nav>
  );
}
