'use client';

import { useEffect, useRef, useState } from 'react';
import type { ElementType, ReactNode } from 'react';

/**
 * Scroll reveal (Handoff §4.6 row 2): fade in + 16px upward slide as the element enters
 * the viewport, triggering once.
 *
 * IMPORTANT — nothing is hidden before JavaScript runs. This used to render at
 * `opacity: 0` and wait for an effect to reveal it, which meant the server-rendered HTML
 * arrived invisible and the page stayed blank until React hydrated. That blank window is
 * what reads as a flicker on load, and it grows with the size of the JS bundle.
 *
 * So the element paints immediately, and is only "armed" (hidden, ready to animate)
 * after mount and only when it sits below the fold — where hiding it cannot be seen.
 * Above-the-fold content is therefore never hidden at any point.
 *
 * The fade itself stays a CSS transition: time-based, always settles at its final state,
 * costs no main-thread work, and reduced motion is handled entirely in CSS.
 */
export function RevealOnScroll({
  children,
  className = '',
  delay = 0,
  as: Tag = 'div' as ElementType,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Within (or near) the viewport at mount → leave it exactly as painted. No hiding,
    // no animation, no flash.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;
    if (typeof IntersectionObserver === 'undefined') return;

    // Below the fold: hide it now (unseen), then fade it in when it scrolls into view.
    setArmed(true);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setArmed(false);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -80px 0px' },
    );
    io.observe(el);

    // Backstop: never leave content hidden if the observer never fires.
    const failsafe = window.setTimeout(() => {
      setArmed(false);
      io.disconnect();
    }, 2500);

    return () => {
      io.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);

  return (
    <Tag
      ref={ref}
      className={`${armed ? 'reveal-armed' : 'reveal-in'} ${className}`}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </Tag>
  );
}
