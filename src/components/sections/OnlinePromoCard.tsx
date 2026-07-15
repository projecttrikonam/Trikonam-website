'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { BreathMark } from '@/components/ui/BreathMark';
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion';

/**
 * Homepage promotional announcement (v2.1) — a calm, premium invitation to the live
 * Online Programs. NOT an advertisement and NOT a modal: a soft floating card that rests
 * in the bottom-right corner (bottom-full-width on mobile), with the breath mark and a
 * gold hairline, in Trikonam's own language.
 *
 * Behaviour: appears after ~2.5s OR a small scroll (whichever comes first). It never
 * blocks content — there is no backdrop. Dismissing it (× / Not Now / Escape) hides it
 * for the current page session ONLY (in-memory) — it is intentionally not persisted, so it
 * gently reappears on every fresh visit or refresh. Movement is removed under
 * prefers-reduced-motion. Rendered only on the home page (app/page.tsx).
 */

const bullets = [
  'Live interactive sessions',
  'Small batches',
  'Beginners welcome',
  'Join from anywhere in the world',
];

export function OnlinePromoCard() {
  const reduced = usePrefersReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // No persistence: the popup reveals on every fresh page load, then a dismissal only
    // holds for this in-memory session (until the next refresh/visit).
    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      window.removeEventListener('scroll', onScroll);
      clearTimeout(timer);
      setShow(true);
    };
    const onScroll = () => {
      if (window.scrollY > 180) reveal();
    };
    const timer = setTimeout(reveal, 2500);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Escape dismisses while shown.
  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && dismiss();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [show]);

  function dismiss() {
    // Session-only: hide for this page view; no storage, so it returns on the next visit.
    setShow(false);
  }

  // Rendered directly on `show` (not via AnimatePresence exit) so a dismissal unmounts
  // the card cleanly — no stale, click-blocking overlay is ever left in the corner. The
  // gentle fade + slide-up entrance is preserved via initial/animate.
  if (!show) return null;

  return (
    <motion.aside
      initial={{ opacity: 0, y: reduced ? 0 : 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Online Programs announcement"
      className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-sm sm:inset-x-auto sm:right-6 sm:bottom-6 sm:mx-0"
    >
          <div className="relative overflow-hidden rounded-[18px] border border-border/70 bg-bg p-6 shadow-float sm:p-7">
            <BreathMark
              className="pointer-events-none absolute -right-8 -top-8 h-36 w-36"
              opacity={0.1}
            />

            <button
              type="button"
              aria-label="Dismiss"
              onClick={dismiss}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-secondary transition-colors hover:bg-moss/10 hover:text-moss focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            <div className="relative">
              <span className="eyebrow eyebrow--tick mb-3">Now Online</span>
              <h2 className="text-balance font-serif text-[1.3rem] leading-[1.2] text-primary">
                Learn Classical Hatha Yoga Live — From Anywhere
              </h2>
              <p className="mt-2.5 text-body text-secondary">
                Join our live online programs, taught by certified Classical Hatha Yoga teachers.
              </p>
              <ul className="mt-4 space-y-2">
                {bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-[0.9rem] text-primary">
                    <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-moss" />
                    {b}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link
                  href="/online-programs"
                  onClick={dismiss}
                  className="inline-flex items-center justify-center rounded-[7px] bg-[linear-gradient(180deg,#8a6230,#6e4d24)] px-5 py-2.5 text-[0.88rem] font-medium tracking-[0.01em] text-inverse shadow-soft ring-1 ring-inset ring-white/10 transition-all duration-300 ease-calm hover:-translate-y-0.5 hover:shadow-lift hover:brightness-[1.06] focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  Explore Online Programs
                </Link>
                <button
                  type="button"
                  onClick={dismiss}
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
