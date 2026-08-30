'use client';

import { useEffect, useRef, useState } from 'react';
import type { ElementType, ReactNode } from 'react';

/**
 * Scroll reveal wrapper (Handoff §4.6 row 2): fade in + 16px upward slide as the
 * element enters the viewport, triggering once.
 *
 * Driven by an IntersectionObserver that toggles a CSS class, with the fade handled by
 * a CSS transition (see `.reveal` in globals.css). This is deliberately CSS- rather than
 * JS-animated: CSS transitions are time-based and always settle to their final state
 * (they never freeze half-finished the way a throttled rAF animation can), they cost no
 * main-thread work, and they fail open — if scripting is unavailable the content is
 * simply shown. Reduced motion is handled entirely in CSS.
 */
export function RevealOnScroll({
  children,
  className = '',
  delay = 0,
  variant,
  as: Tag = 'div' as ElementType,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  /**
   * Motion character. Default is the standard fade + 16px rise. `soft` fades with no
   * movement (full-bleed images), `rise` gives a longer lift to a section's opening
   * statement, `still` is an almost-motionless slow fade for quiet interior blocks.
   */
  variant?: 'soft' | 'rise' | 'still';
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Already within (or near) the viewport at mount → reveal immediately, without
    // depending on an observer callback. This covers all above-the-fold content and
    // keeps it robust even where IntersectionObserver ticks are throttled.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) {
      setShown(true);
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -80px 0px' },
    );
    io.observe(el);

    // Ultimate backstop: never leave content hidden if the observer never fires.
    const failsafe = window.setTimeout(() => setShown(true), 2500);
    return () => {
      io.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${variant ? `reveal--${variant}` : ''} ${shown ? 'reveal-in' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </Tag>
  );
}
