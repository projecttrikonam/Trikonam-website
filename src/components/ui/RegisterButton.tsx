'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from './Button';
import { siteConfig } from '@/content/site-config';
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion';

/**
 * "Register Now" — the ONLY component that knows the registration form URL
 * (Handoff §3.4, §8, §13). Every registrable page uses this. To swap registration
 * for a real booking flow in Phase 2, change this one file — not every page.
 *
 * Carries the signature breath detail: a moss ring that breathes outward once on
 * hover, then stops (Handoff §4.5). Frozen when prefers-reduced-motion is set.
 */
export function RegisterButton({
  label = 'Register Now',
  variant = 'primary',
  className = '',
}: {
  label?: string;
  variant?: 'primary' | 'secondary' | 'text';
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const [hovered, setHovered] = useState(false);

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
        href={siteConfig.forms.register}
        external
        variant={variant}
        className={className}
        aria-label={`${label} — opens the registration form in a new tab`}
      >
        {label}
      </Button>
    </span>
  );
}
