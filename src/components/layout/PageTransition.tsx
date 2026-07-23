'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

/**
 * Soft cross-fade on route change (Handoff §4.6 row 7): 200ms fade, no slide/wipe.
 *
 * Rendered from app/template.tsx, which Next re-mounts on every navigation — so each
 * page fades in on entry. Movement is intentionally omitted (fade only), which also
 * keeps it correct under prefers-reduced-motion without special-casing.
 *
 * The FIRST page is deliberately not animated. With `initial={{ opacity: 0 }}` the
 * server-rendered HTML carried `style="opacity:0"` around the whole of <main>, so every
 * page arrived invisible and only appeared once framer-motion had downloaded, hydrated
 * and run — a blank-then-appear on every cold load, and the heavier the page the longer
 * the gap. Passing `initial={false}` on that first render emits no inline opacity at
 * all, so the content is painted as soon as the HTML arrives. Client-side navigations
 * still cross-fade, which is where the effect was actually wanted.
 */

/**
 * Module scope, so it survives the template remount Next performs on each navigation —
 * that is what lets us tell the first server-rendered page from a later route change.
 */
let hasNavigated = false;

export function PageTransition({ children }: { children: ReactNode }) {
  // Read once at mount. Server and first client render both see `false`, so the markup
  // matches and hydration stays clean.
  const [animateIn] = useState(() => hasNavigated);

  useEffect(() => {
    hasNavigated = true;
  }, []);

  return (
    <motion.div
      initial={animateIn ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
