'use client';

/**
 * Trikonam interaction system (2026) — the shared hooks behind the site's tactile,
 * editorial response layer. Keep these few and restrained; the CSS side lives in
 * globals.css (`.tactile`, `.tactile-media`, `.focus-peer`, `.reveal*`).
 *
 *   useFocusGroup — "bring one into awareness, let the others recede": the Body / Mind /
 *                   Energy / Emotions pattern, and any peer set that benefits from it.
 *                   Cursor + keyboard on pointer devices; scroll-linked focus on touch.
 *   useParallax   — a very small scroll-linked drift for an image inside its frame, so a
 *                   photograph feels alive without ever reading as a zoom.
 *
 * Both are inert (no transform) under prefers-reduced-motion; emphasis via opacity is
 * kept where it aids focus.
 */

import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { useScroll, useTransform, type MotionValue } from 'framer-motion';
import { usePrefersReducedMotion } from './use-reduced-motion';

export type FocusPeerState = 'focus' | 'dim' | 'idle';

export interface FocusGroupApi {
  /** The peer currently in focus, or null when the group is at rest. */
  activeIndex: number | null;
  /** Spread on the element that wraps all peers. */
  groupProps: {
    onPointerLeave: () => void;
  };
  /**
   * Spread on each peer element; `i` is its index. The peers are treated as decorative
   * emphasis, not controls — no tab stop is added and the always-visible text needs no
   * keyboard equivalent. When a peer IS interactive (a link/button), pass
   * `interactive: true` so hover/focus of that control also moves the group focus.
   */
  getPeerProps: (
    i: number,
    opts?: { interactive?: boolean },
  ) => {
    ref: (el: HTMLElement | null) => void;
    'data-state': FocusPeerState;
    onPointerEnter: () => void;
    onFocusCapture?: () => void;
    onClick: () => void;
  };
}

/**
 * `count` peers, one of which can be "in focus". On a pointer device, hover/focus moves
 * the focus and leaving the group settles it back. On touch (no hover), the peer nearest
 * the vertical centre of the viewport becomes the focus as the reader scrolls, and a tap
 * pins one. Under reduced motion the scroll-linked behaviour is disabled (it stays a
 * plain hover/tap affordance) and only opacity emphasis is applied by CSS.
 */
export function useFocusGroup(count: number): FocusGroupApi {
  const reduced = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  const els = useRef<(HTMLElement | null)[]>([]);
  const hasPointer = useRef(true);

  const setRef = useCallback(
    (i: number) => (el: HTMLElement | null) => {
      els.current[i] = el;
    },
    [],
  );

  useEffect(() => {
    hasPointer.current =
      typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;
  }, []);

  // Touch: track which peer sits nearest the viewport centre while scrolling.
  useEffect(() => {
    if (reduced) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(hover: hover)').matches) return;

    let raf = 0;
    const pick = () => {
      raf = 0;
      if (pinned !== null) return;
      const mid = window.innerHeight / 2;
      let best: number | null = null;
      let bestDist = Infinity;
      els.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setActiveIndex(best);
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(pick);
    };
    pick();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [reduced, pinned]);

  const activate = useCallback((i: number) => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
      setActiveIndex(i);
    }
  }, []);

  const settle = useCallback(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
      setActiveIndex(null);
    }
  }, []);

  const groupProps = useMemo(() => ({ onPointerLeave: settle }), [settle]);

  const getPeerProps = useCallback(
    (i: number, opts?: { interactive?: boolean }) => {
      const state: FocusPeerState =
        activeIndex === null ? 'idle' : activeIndex === i ? 'focus' : 'dim';
      return {
        ref: setRef(i),
        'data-state': state,
        onPointerEnter: () => activate(i),
        ...(opts?.interactive ? { onFocusCapture: () => activate(i) } : {}),
        onClick: () => setPinned((p) => (p === i ? null : i)),
      };
    },
    [activeIndex, activate, setRef],
  );

  // Keep pinned/active in step on touch.
  useEffect(() => {
    if (pinned !== null) setActiveIndex(pinned);
  }, [pinned]);

  return { activeIndex, groupProps, getPeerProps };
}

/**
 * A restrained parallax: as `ref`'s element travels through the viewport, the returned
 * `y` MotionValue moves from +range/2 to -range/2 pixels. Put `y` on a `motion.*` child
 * that is slightly taller than its frame (or on an over-scaled image) so nothing clips.
 * Returns a frozen `y` (always 0) under reduced motion.
 */
export function useParallax(range = 16): {
  ref: RefObject<HTMLDivElement>;
  y: MotionValue<number>;
} {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? [0, 0] : [range / 2, -range / 2],
  );
  return { ref, y };
}
