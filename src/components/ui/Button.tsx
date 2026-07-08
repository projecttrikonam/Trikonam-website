import Link from 'next/link';
import { forwardRef } from 'react';
import type { AnchorHTMLAttributes } from 'react';

/**
 * Base button, rendered as a link (all Phase 1 "actions" are navigation, internal or
 * to an external Google Form). Handoff §8.
 *
 * Variants:
 *   primary   — gold fill; reserved for the two CTAs only (Register / Enquire). §4.2
 *   secondary — moss outline; secondary actions
 *   text      — quiet moss text link with drawn underline
 */
type Variant = 'primary' | 'secondary' | 'text';

const base =
  'inline-flex items-center justify-center gap-2 font-sans font-medium tracking-[0.01em] transition-all duration-300 ease-calm focus-visible:outline-2 focus-visible:outline-offset-2';

const variants: Record<Variant, string> = {
  // Gold gradient (both stops meet WCAG AA with ivory text), layered shadow, calm lift.
  primary:
    'rounded-[7px] px-8 py-3.5 text-[0.95rem] text-inverse shadow-soft bg-[linear-gradient(180deg,#8a6230,#6e4d24)] ring-1 ring-inset ring-white/10 hover:-translate-y-0.5 hover:shadow-lift hover:brightness-[1.06]',
  // Quiet moss outline that fills on hover, with a faint tint step before the fill.
  secondary:
    'rounded-[7px] border border-moss/70 bg-moss/0 px-8 py-3.5 text-[0.95rem] text-moss hover:-translate-y-0.5 hover:border-moss hover:bg-moss hover:text-inverse hover:shadow-soft',
  text: 'group text-[0.95rem] font-medium text-moss hover:text-moss-dark',
};

export interface ButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: Variant;
  /** Set true for external links (adds target/rel). */
  external?: boolean;
}

export const Button = forwardRef<HTMLAnchorElement, ButtonProps>(function Button(
  { href, variant = 'primary', external = false, className = '', children, ...rest },
  ref,
) {
  const classes = `${base} ${variants[variant]} ${className}`;
  const externalProps = external
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {};

  // Internal links use next/link for client-side transitions; external use a plain <a>.
  if (external || href.startsWith('http')) {
    return (
      <a ref={ref} href={href} className={classes} {...externalProps} {...rest}>
        {children}
        {variant === 'text' && (
          <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
        )}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {children}
      {variant === 'text' && (
        <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
      )}
    </Link>
  );
});
