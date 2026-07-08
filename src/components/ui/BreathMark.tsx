'use client';

import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion';

/**
 * THE BREATH MARK — Trikonam's signature device (Handoff §4.5).
 *
 * A single thin circular ring (SVG stroke, no fill) that slowly scales 100% → 103%
 * → 100% over a 6-second loop, mimicking one breath. Use sparingly (max 3–4 per page)
 * — it is a signature, not a tileable pattern.
 *
 * Respects prefers-reduced-motion: when set, the ring is frozen at 100% scale with no
 * animation (Handoff §4.5, non-negotiable).
 *
 * Decorative by default (aria-hidden). It never carries meaning that text doesn't.
 */
export function BreathMark({
  className = '',
  strokeClassName = 'stroke-moss',
  strokeWidth = 1,
  opacity = 0.5,
}: {
  className?: string;
  /** Tailwind stroke-* class for the ring colour. */
  strokeClassName?: string;
  strokeWidth?: number;
  opacity?: number;
}) {
  const reduced = usePrefersReducedMotion();

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
      focusable="false"
      role="presentation"
    >
      <motion.circle
        cx="50"
        cy="50"
        r="48"
        fill="none"
        className={strokeClassName}
        strokeWidth={strokeWidth}
        style={{ opacity, transformOrigin: '50% 50%' }}
        animate={reduced ? { scale: 1 } : { scale: [1, 1.03, 1] }}
        transition={
          reduced
            ? undefined
            : { duration: 6, ease: 'easeInOut', repeat: Infinity }
        }
      />
    </svg>
  );
}
