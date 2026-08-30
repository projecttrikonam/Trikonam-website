'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { practicePhotos } from '@/content/practice-photos';
import manifest from '@/content/image-manifest.json';

/**
 * Home → "Practice, as it is lived" (2026 refinement).
 *
 * A browsable horizontal strip of real sessions — Google Business Profile shots and the
 * client's casual practice photos — placed as a visual pause between Stories and Journal.
 *
 * The strip is a plain scroll container: swipe / trackpad on touch, and paddle buttons +
 * edge fades on desktop. No `justify-center` (which makes the leading frames unreachable
 * once the content overflows), and the native scrollbar is hidden in favour of the
 * paddles. Plain <img loading="lazy"> with a manifest srcset — native lazy-loading is
 * predictable and unaffected by any wrapper transform.
 */
const WIDTHS = [480, 768, 1200, 1600];

function srcSet(src: string): string | undefined {
  const entry = (manifest as Record<string, { widths?: number[] }>)[src];
  if (!entry?.widths?.length) return undefined;
  const stem = src.replace(/\.webp$/, '');
  return [
    ...entry.widths.filter((w) => WIDTHS.includes(w)).map((w) => `${stem}-${w}.webp ${w}w`),
    `${src} 2000w`,
  ].join(', ');
}

export function PracticePhotographs() {
  const scroller = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const update = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  useEffect(() => {
    update();
    const el = scroller.current;
    if (!el) return;
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [update]);

  const page = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    // Assign scrollLeft directly rather than scrollBy({behavior:'smooth'}) — the latter
    // is silently ignored when the computed scroll-behavior is forced to `auto`
    // (prefers-reduced-motion). This defers to the `scroll-smooth` CSS class: it animates
    // when motion is allowed and jumps when it isn't. Refresh the paddle state here too,
    // rather than trusting the scroll event to fire for a programmatic scroll.
    el.scrollLeft += dir * el.clientWidth * 0.8;
    update();
    window.setTimeout(update, 400);
  };

  return (
    <section className="bg-bg py-16 md:py-28">
      <div className="mx-auto mb-10 max-w-6xl px-6 sm:px-8">
        <RevealOnScroll>
          <span className="eyebrow eyebrow--tick mb-5">A visual pause</span>
        </RevealOnScroll>
        <RevealOnScroll variant="rise" delay={0.06}>
          <h2 className="text-balance font-serif text-[clamp(1.6rem,3.4vw,2.6rem)] font-normal leading-[1.22] text-primary">
            Practice, as it is lived.
          </h2>
        </RevealOnScroll>
      </div>

      <div className="group relative">
        {/* Edge fades (desktop) */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-20 bg-gradient-to-r from-bg to-transparent transition-opacity duration-300 lg:block ${
            canPrev ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-20 bg-gradient-to-l from-bg to-transparent transition-opacity duration-300 lg:block ${
            canNext ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Paddles (desktop) */}
        <button
          type="button"
          onClick={() => page(-1)}
          aria-label="Previous photographs"
          disabled={!canPrev}
          className="absolute left-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-bg/90 text-primary shadow-soft backdrop-blur transition-all duration-300 hover:border-moss hover:text-moss disabled:pointer-events-none disabled:opacity-0 lg:flex"
        >
          <svg width="16" height="14" viewBox="0 0 16 14" fill="none" aria-hidden>
            <path d="M15 7H1M7 1 1 7l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => page(1)}
          aria-label="More photographs"
          disabled={!canNext}
          className="absolute right-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-bg/90 text-primary shadow-soft backdrop-blur transition-all duration-300 hover:border-moss hover:text-moss disabled:pointer-events-none disabled:opacity-0 lg:flex"
        >
          <svg width="16" height="14" viewBox="0 0 16 14" fill="none" aria-hidden>
            <path d="M1 7h14M9 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <ul
          ref={scroller}
          onScroll={update}
          className="flex gap-4 overflow-x-auto scroll-smooth px-6 pb-4 [scrollbar-width:none] sm:gap-6 sm:px-8 lg:px-10 [&::-webkit-scrollbar]:hidden"
        >
          {practicePhotos.map((photo, i) => (
            <li key={photo.src} className="shrink-0">
              <figure
                className="tactile group relative h-60 overflow-hidden rounded-[10px] bg-bg-alt shadow-lift ring-1 ring-black/[0.05] sm:h-72 lg:h-[22rem]"
                style={{ aspectRatio: photo.aspect.replace('/', ' / ') }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.src}
                  srcSet={srcSet(photo.src)}
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 72vw"
                  alt={photo.alt}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="tactile-media absolute inset-0 h-full w-full object-cover"
                />
                <span className="pointer-events-none absolute inset-0 rounded-[10px] ring-1 ring-inset ring-gold/10" />
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
