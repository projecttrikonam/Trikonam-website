'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { stories } from '@/content/stories';
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion';

/**
 * Home → "Stories from the Practice" (2026 refinement).
 *
 * Genuine Google reviews, verbatim, presented as an unhurried reading experience — one
 * story at a time, transitioning smoothly, with a quiet index and Google attribution.
 * Deliberately not a wall of star ratings. No autoplay (calm, and reduced-motion safe);
 * the reader moves at their own pace.
 */
export function Stories() {
  const reduced = usePrefersReducedMotion();
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);

  // The very first item must simply be present — only animate the crossfade once the
  // reader actually moves between stories. (Relying on framer's enter animation for the
  // first paint is fragile: an effect-driven re-render can strand it at `initial`.)
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
  }, []);

  const go = (next: number) => {
    setDir(next > i || (i === stories.length - 1 && next === 0) ? 1 : -1);
    setI((next + stories.length) % stories.length);
  };

  const story = stories[i];
  const animate = { opacity: 1, x: 0 };
  const initial = mounted.current && !reduced ? { opacity: 0, x: dir * 24 } : false;

  return (
    <section className="bg-bg-alt px-6 py-16 sm:px-8 md:py-28">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <RevealOnScroll>
            <span className="eyebrow eyebrow--tick mx-auto mb-5 w-fit">Stories from the Practice</span>
          </RevealOnScroll>
          <RevealOnScroll variant="rise" delay={0.06}>
            <h2 className="text-balance font-serif text-[clamp(1.6rem,3.4vw,2.6rem)] font-normal leading-[1.22] text-primary">
              In the words of those who practise here.
            </h2>
          </RevealOnScroll>
        </div>

        <RevealOnScroll>
          <div className="relative min-h-[19rem] sm:min-h-[16rem]">
            <span
              aria-hidden
              className="pointer-events-none absolute -top-10 left-0 select-none font-serif text-[6rem] leading-none text-moss/[0.08] sm:-left-6 sm:text-[7.5rem]"
            >
              {String(i + 1).padStart(2, '0')}
            </span>

            {/* A keyed remount, not AnimatePresence/mode="wait" — a no-op exit under
                prefers-reduced-motion can deadlock that pattern on the outgoing item. */}
            <motion.figure
              key={i}
              initial={initial}
              animate={animate}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
                <span aria-hidden className="mb-6 block h-px w-12 bg-gradient-to-r from-gold to-gold/0" />
                <blockquote className="whitespace-pre-line font-serif text-[1.22rem] font-normal leading-[1.6] text-primary text-pretty sm:text-[1.35rem]">
                  {story.text}
                </blockquote>
                <figcaption className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-1 text-label uppercase tracking-[0.14em] text-secondary">
                  <span className="text-primary">{story.name}</span>
                  {story.context && (
                    <>
                      <span aria-hidden className="text-border">·</span>
                      <span className="normal-case tracking-normal">{story.context}</span>
                    </>
                  )}
                  <span aria-hidden className="text-border">·</span>
                <span className="normal-case tracking-normal text-secondary/80">Google review</span>
              </figcaption>
            </motion.figure>
          </div>

          <div className="mt-10 flex items-center gap-5">
            <button
              type="button"
              onClick={() => go(i - 1)}
              aria-label="Previous story"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-secondary transition-colors hover:border-moss hover:text-moss focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden>
                <path d="M15 6H1M6 1 1 6l5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => go(i + 1)}
              aria-label="Next story"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-secondary transition-colors hover:border-moss hover:text-moss focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden>
                <path d="M1 6h14M10 1l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <span className="ml-1 text-caption tabular-nums text-secondary">
              {i + 1} / {stories.length}
            </span>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
