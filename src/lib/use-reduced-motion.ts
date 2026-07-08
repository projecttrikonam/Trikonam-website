'use client';

import { useEffect, useState } from 'react';

/**
 * Single source of truth for the user's motion preference (Handoff §4.6 / §11.2).
 *
 * Returns `true` when `prefers-reduced-motion: reduce` is set. Components use this to
 * strip parallax, the breath-mark loop, and slide distances — keeping opacity fades
 * only. This is a quality-floor requirement, implemented once here rather than being
 * re-derived per component.
 *
 * SSR-safe: starts `false` on the server/first paint, then syncs on mount.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);

    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
