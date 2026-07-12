'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { BreathMark } from '@/components/ui/BreathMark';
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion';

/**
 * Homepage promotional announcement (v2.0) — a calm, premium invitation to the live
 * Online Programs. NOT an advertisement: a soft glass card with the breath mark and a
 * gold hairline, in Trikonam's own language.
 *
 * Behaviour: appears once, after ~2.5s OR a small scroll (whichever comes first).
 * Dismissing it (× / Not Now / Escape / backdrop) records a localStorage flag so it is
 * never shown again. Movement is removed under prefers-reduced-motion. Rendered only on
 * the home page (mounted in app/page.tsx).
 */

const DISMISS_KEY = 'trikonam_online_promo_dismissed';

const bullets = [
  'Live interactive sessions',
  'Small batches',
  'Beginners welcome',
  'Join from anywhere in the world',
];

export function OnlinePromoCard() {
  const reduced = usePrefersReducedMotion();
  const [show, setShow] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Already dismissed (this device) → never show again.
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(DISMISS_KEY) === '1';
    } catch {
      /* private mode / storage blocked — treat as not dismissed */
    }
    if (dismissed) return;

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

  // Focus the close control and wire Escape once shown.
  useEffect(() => {
    if (!show) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && dismiss();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [show]);

  function dismiss() {
    try {
      localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* ignore */
    }
    setShow(false);
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="promo-title"
        >
          {/* Soft backdrop — gentle, not a hard dim. Click to dismiss. */}
          <button
            type="button"
            aria-label="Dismiss"
            onClick={dismiss}
            className="absolute inset-0 h-full w-full cursor-default bg-primary/40"
          />

          <motion.div
            initial={{ opacity: 0, y: reduced ? 0 : 24, scale: reduced ? 1 : 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduced ? 0 : 16 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md overflow-hidden rounded-[18px] border border-border/70 bg-bg p-8 shadow-float sm:p-10"
          >
            <BreathMark
              className="pointer-events-none absolute -right-8 -top-8 h-40 w-40"
              opacity={0.12}
            />

            {/* Close (×) */}
            <button
              ref={closeRef}
              type="button"
              aria-label="Close"
              onClick={dismiss}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-secondary transition-colors hover:bg-moss/10 hover:text-moss focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            <div className="relative">
              <span className="eyebrow eyebrow--tick mb-4">Now Online</span>
              <h2 id="promo-title" className="text-balance font-serif text-[1.5rem] leading-[1.2] text-primary">
                Learn Classical Hatha Yoga Live — From Anywhere
              </h2>
              <p className="mt-3 text-body text-secondary">
                Join our live online programs, taught by certified Classical Hatha Yoga
                teachers.
              </p>
              <ul className="mt-5 space-y-2.5">
                {bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-body text-primary">
                    <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-moss" />
                    {b}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/online-programs"
                  onClick={dismiss}
                  className="inline-flex items-center justify-center rounded-[7px] bg-[linear-gradient(180deg,#8a6230,#6e4d24)] px-6 py-3 text-[0.9rem] font-medium tracking-[0.01em] text-inverse shadow-soft ring-1 ring-inset ring-white/10 transition-all duration-300 ease-calm hover:-translate-y-0.5 hover:shadow-lift hover:brightness-[1.06] focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  Explore Online Programs
                </Link>
                <button
                  type="button"
                  onClick={dismiss}
                  className="text-[0.9rem] font-medium text-secondary transition-colors hover:text-moss"
                >
                  Not Now
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
