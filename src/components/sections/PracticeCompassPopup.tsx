'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { BreathMark } from '@/components/ui/BreathMark';
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion';

/**
 * Practice Compass invitation (2026 refinement) — replaces the old Online Programs
 * promo card.
 *
 * A small, calm, premium card that rests in the bottom-right corner (bottom-full-width
 * on mobile). It is an *invitation to self-enquiry*, not a sales popup: it offers a
 * short assessment that helps a visitor understand where their practice might begin.
 *
 * Behaviour: appears after ~3s OR a small scroll. No backdrop — it never blocks content.
 * Dismissing (× / Not Now / Escape) hides it for this page session only (in-memory, not
 * persisted), so it returns gently on a fresh visit. Movement is removed under
 * prefers-reduced-motion. Rendered only on the home page.
 */
export function PracticeCompassPopup() {
  const reduced = usePrefersReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      window.removeEventListener('scroll', onScroll);
      clearTimeout(timer);
      setShow(true);
    };
    const onScroll = () => {
      if (window.scrollY > 220) reveal();
    };
    const timer = setTimeout(reveal, 3000);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setShow(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [show]);

  if (!show) return null;

  return (
    <motion.aside
      initial={{ opacity: 0, y: reduced ? 0 : 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Practice Compass"
      className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-sm sm:inset-x-auto sm:bottom-6 sm:right-6 sm:mx-0"
    >
      <div className="relative overflow-hidden rounded-[18px] border border-border/70 bg-bg p-6 shadow-float sm:p-7">
        <BreathMark
          className="pointer-events-none absolute -right-8 -top-8 h-36 w-36"
          opacity={0.1}
        />

        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => setShow(false)}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-secondary transition-colors hover:bg-moss/10 hover:text-moss focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <div className="relative">
          <span className="eyebrow eyebrow--tick mb-3">Practice Compass</span>
          <h2 className="text-balance font-serif text-[1.3rem] leading-[1.2] text-primary">
            Find where your practice begins
          </h2>
          <p className="mt-2.5 text-body text-secondary">
            A short ten-question reflection to understand what kind of practice and
            journey may suit you right now.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              href="/practice-compass"
              onClick={() => setShow(false)}
              className="inline-flex items-center justify-center rounded-[7px] gradient-gold px-5 py-2.5 text-[0.88rem] font-medium tracking-[0.01em] text-inverse shadow-soft ring-1 ring-inset ring-white/10 transition-all duration-300 ease-calm hover:-translate-y-0.5 hover:shadow-lift hover:brightness-[1.06] focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Take the Assessment
            </Link>
            <button
              type="button"
              onClick={() => setShow(false)}
              className="text-[0.88rem] font-medium text-secondary transition-colors hover:text-moss"
            >
              Not Now
            </button>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
