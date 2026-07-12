'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from './Button';
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion';

/**
 * "Begin Your Journey" — the ONE registration CTA across the entire site (v2.1). It opens
 * the Trikonam Welcome System at /begin. Pass a `journey` to deep-link straight to that
 * journey's form (e.g. journey="online-programs"); omit it to land on the chooser.
 *
 * There is deliberately no other registration button anywhere — this replaces every former
 * Register / Register Now / Enquire button. Carries the signature breath ring on hover
 * (Handoff §4.5), frozen under prefers-reduced-motion.
 */
export function BeginJourneyButton({
  label = 'Begin Your Journey',
  journey,
  variant = 'primary',
  className = '',
}: {
  label?: string;
  /** Optional journey id to preselect in the Welcome System. */
  journey?: string;
  variant?: 'primary' | 'secondary' | 'text';
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const [hovered, setHovered] = useState(false);
  const href = journey ? `/begin?journey=${journey}` : '/begin';

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
      <Button href={href} variant={variant} className={className}>
        {label}
      </Button>
    </span>
  );
}
