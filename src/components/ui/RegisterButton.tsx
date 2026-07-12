'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from './Button';
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion';

/**
 * "Register Now" — the primary registration CTA. As of v2.0 its DEFAULT target is the
 * in-site Online Programs registration page (`/online-programs/register`), making online
 * the site-wide default registration path.
 *
 * Pass an explicit `href` to override — the OFFLINE Programs page passes the existing
 * Google registration form (`siteConfig.forms.register`, external) so offline
 * registration is preserved. Any `http…` href is treated as external automatically.
 *
 * Carries the signature breath detail: a moss ring that breathes outward once on
 * hover, then stops (Handoff §4.5). Frozen when prefers-reduced-motion is set.
 */
export function RegisterButton({
  label = 'Register Now',
  variant = 'primary',
  className = '',
  href,
  external,
}: {
  label?: string;
  variant?: 'primary' | 'secondary' | 'text';
  className?: string;
  /** Override the default `/online-programs/register` target. */
  href?: string;
  /** Force external behaviour; inferred from an `http…` href when omitted. */
  external?: boolean;
}) {
  const reduced = usePrefersReducedMotion();
  const [hovered, setHovered] = useState(false);

  const target = href ?? '/online-programs/register';
  const isExternal = external ?? target.startsWith('http');
  const ariaLabel = isExternal
    ? `${label} — opens the registration form in a new tab`
    : label;

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {!reduced && variant === 'primary' && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-card border border-gold"
          initial={{ opacity: 0, scale: 1 }}
          animate={hovered ? { opacity: [0, 0.5, 0], scale: [1, 1.18, 1.28] } : { opacity: 0, scale: 1 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
        />
      )}
      <Button
        href={target}
        external={isExternal}
        variant={variant}
        className={className}
        aria-label={ariaLabel}
      >
        {label}
      </Button>
    </span>
  );
}
