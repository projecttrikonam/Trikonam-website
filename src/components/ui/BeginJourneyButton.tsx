'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from './Button';
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion';

/**
 * The single button that opens the Trikonam Welcome System at /begin (v2.1).
 *
 * `label` is context-specific — "Begin Your Journey" is reserved for the header, mobile
 * nav, and homepage hero; elsewhere it reads "Register", "Register for {practice}",
 * "Plan a Workshop", "Request a Consultation", etc. Pass a `journey` to deep-link into
 * that journey's form, and an optional `practice` (or `program`) to pre-select a dropdown
 * inside it. Carries the signature breath ring on hover (Handoff §4.5), frozen under
 * prefers-reduced-motion.
 */
export function BeginJourneyButton({
  label = 'Begin Your Journey',
  journey,
  practice,
  program,
  variant = 'primary',
  className = '',
}: {
  label?: string;
  /** Optional journey id to preselect in the Welcome System. */
  journey?: string;
  /** Optional practice name to pre-select the practice dropdown (CHY journey). */
  practice?: string;
  /** Optional program name to pre-select the program dropdown (online/corporate). */
  program?: string;
  variant?: 'primary' | 'secondary' | 'text';
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const [hovered, setHovered] = useState(false);

  const params = new URLSearchParams();
  if (journey) params.set('journey', journey);
  if (practice) params.set('practice', practice);
  if (program) params.set('program', program);
  const qs = params.toString();
  const href = qs ? `/begin?${qs}` : '/begin';

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
