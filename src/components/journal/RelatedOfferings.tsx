import Link from 'next/link';
import { getPractice } from '@/content/practices';

/** Program keys (from the article schema) → label + route on the site. */
const PROGRAM_MAP: Record<string, { label: string; href: string }> = {
  'online-programs': { label: 'Online Programs', href: '/online-programs' },
  'group-workshops': { label: 'Group Workshops', href: '/learn/group-workshops' },
  'private-guidance': { label: 'Private One-to-One Guidance', href: '/learn/private-guidance' },
  'childrens-yoga': { label: "Children's Yoga", href: '/learn/childrens-yoga' },
  retreats: { label: 'Retreats', href: '/learn/retreats' },
  'corporate-wellness': { label: 'Corporate Wellness', href: '/programs/corporate' },
};

function LinkCard({ href, eyebrow, title }: { href: string; eyebrow: string; title: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-[10px] border border-border/70 bg-surface/50 px-5 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-moss/40 hover:shadow-soft focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <span>
        <span className="block text-[0.68rem] uppercase tracking-[0.14em] text-moss">{eyebrow}</span>
        <span className="mt-0.5 block font-serif text-[1.1rem] text-primary">{title}</span>
      </span>
    </Link>
  );
}

/**
 * "Related practices" and "Related programs" — resolves the article's slugs/keys to the
 * matching pages on the site, in the existing card idiom. Renders nothing when empty.
 */
export function RelatedOfferings({
  practices = [],
  programs = [],
}: {
  practices?: string[];
  programs?: string[];
}) {
  const practiceItems = practices
    .map((slug) => {
      const p = getPractice(slug);
      return p ? { href: `/practices/${p.slug}`, title: p.name } : null;
    })
    .filter((x): x is { href: string; title: string } => Boolean(x));

  const programItems = programs
    .map((key) => PROGRAM_MAP[key])
    .filter((x): x is { label: string; href: string } => Boolean(x));

  if (!practiceItems.length && !programItems.length) return null;

  return (
    <div className="prose-measure mx-auto mt-14 border-t border-border pt-10">
      {practiceItems.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-[0.78rem] uppercase tracking-[0.16em] text-secondary">Related practices</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {practiceItems.map((p) => (
              <li key={p.href}>
                <LinkCard href={p.href} eyebrow="Practice" title={p.title} />
              </li>
            ))}
          </ul>
        </div>
      )}
      {programItems.length > 0 && (
        <div>
          <h2 className="mb-4 text-[0.78rem] uppercase tracking-[0.16em] text-secondary">Related programs</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {programItems.map((p) => (
              <li key={p.href}>
                <LinkCard href={p.href} eyebrow="Program" title={p.label} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
