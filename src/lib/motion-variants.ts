import type { Variants } from 'framer-motion';

/**
 * Shared Framer Motion variants (Handoff §4.6). Motion distances here assume motion
 * is allowed; components pass a `reduced` flag from usePrefersReducedMotion() and
 * fall back to opacity-only fades when it is set.
 */

const easeCalm: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Hero page-load: fade + 12px rise, children staggered ~80ms (§4.6 row 1). */
export const heroContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export const heroItem = (reduced: boolean): Variants => ({
  hidden: { opacity: 0, y: reduced ? 0 : 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeCalm },
  },
});
