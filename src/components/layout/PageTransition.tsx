'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * Soft cross-fade on route change (Handoff §4.6 row 7): 200ms fade, no slide/wipe.
 *
 * Rendered from app/template.tsx, which Next re-mounts on every navigation — so each
 * page fades in on entry. Movement is intentionally omitted (fade only), which also
 * keeps it correct under prefers-reduced-motion without special-casing.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
