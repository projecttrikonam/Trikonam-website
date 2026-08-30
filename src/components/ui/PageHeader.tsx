import type { ReactNode } from 'react';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';

/**
 * Calm interior-page header (Handoff §4.6 row 1) — 2026 navigation refinement.
 *
 * eyebrow → title → intro → action, settling in together as the page arrives. Built on
 * the site's own RevealOnScroll: a CSS transition shown immediately when the element is
 * at the top of the viewport (which a page header always is), that always settles to
 * fully visible and is collapsed to instant by the global reduced-motion rule. The
 * earlier framer version could strand the heading at opacity 0 for reduced-motion users
 * when the preference resolved after mount.
 */
export function PageHeader({
  eyebrow,
  title,
  intro,
  align = 'left',
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  align?: 'left' | 'center';
  children?: ReactNode;
}) {
  const alignment = align === 'center' ? 'items-center text-center mx-auto' : 'items-start';

  return (
    <RevealOnScroll variant="rise" className={`flex max-w-3xl flex-col ${alignment}`}>
      {eyebrow && (
        <span className={`eyebrow eyebrow--tick mb-6 ${align === 'center' ? 'mx-auto w-fit' : ''}`}>
          {eyebrow}
        </span>
      )}
      <h1 className="text-balance font-serif text-[clamp(1.75rem,3.6vw,2.95rem)] font-normal leading-[1.08] tracking-[-0.015em] text-primary">
        {title}
      </h1>
      {intro && (
        <div className={`prose-measure mt-7 text-body-lg text-secondary ${align === 'center' ? 'mx-auto' : ''}`}>
          {intro}
        </div>
      )}
      {children && <div className="mt-8">{children}</div>}
    </RevealOnScroll>
  );
}
