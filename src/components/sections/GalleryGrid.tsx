'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { galleryImages } from '@/content/gallery';
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion';

/**
 * Gallery grid + lightbox (Handoff §6.9). A considered masonry (CSS columns) with a
 * keyboard-navigable lightbox: click/Enter to open, ← → to move, Esc to close. Focus
 * returns to the triggering thumbnail on close.
 */
export function GalleryGrid() {
  const reduced = usePrefersReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const show = useCallback(
    (dir: number) =>
      setOpenIndex((i) =>
        i === null ? i : (i + dir + galleryImages.length) % galleryImages.length,
      ),
    [],
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') show(1);
      if (e.key === 'ArrowLeft') show(-1);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [openIndex, close, show]);

  const active = openIndex === null ? null : galleryImages[openIndex];

  return (
    <>
      <div className="[column-fill:_balance] gap-5 sm:columns-2 lg:columns-3">
        {galleryImages.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => setOpenIndex(i)}
            aria-label={`View image: ${img.alt}`}
            className="group relative mb-5 block w-full overflow-hidden rounded-[10px] bg-bg-alt shadow-soft ring-1 ring-black/[0.05] transition-shadow duration-500 hover:shadow-lift focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={800}
              height={
                img.orientation === 'portrait'
                  ? 1000
                  : img.orientation === 'square'
                  ? 800
                  : 560
              }
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className={`h-auto w-full object-cover transition-transform duration-[900ms] ease-calm ${
                reduced ? '' : 'group-hover:scale-[1.045]'
              }`}
            />
            {/* Quiet gradient + expand cue on hover. */}
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <span className="pointer-events-none absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full glass text-primary opacity-0 transition-all duration-500 group-hover:opacity-100" aria-hidden>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 2H2v4M10 2h4v4M6 14H2v-4M10 14h4v-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="glass-dark fixed inset-0 z-[60] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Image viewer"
            onClick={close}
          >
            {/* Close */}
            <button
              type="button"
              onClick={close}
              aria-label="Close image viewer"
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full text-inverse/80 hover:text-inverse focus-visible:outline-2"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            {/* Prev / Next */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); show(-1); }}
              aria-label="Previous image"
              className="absolute left-2 z-10 flex h-12 w-12 items-center justify-center rounded-full text-inverse/70 hover:text-inverse sm:left-6"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); show(1); }}
              aria-label="Next image"
              className="absolute right-2 z-10 flex h-12 w-12 items-center justify-center rounded-full text-inverse/70 hover:text-inverse sm:right-6"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <motion.figure
              key={active.src}
              initial={{ opacity: 0, scale: reduced ? 1 : 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-h-[85vh] w-auto max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={active.src}
                alt={active.alt}
                width={1600}
                height={1200}
                sizes="90vw"
                className="max-h-[80vh] w-auto rounded-card object-contain"
              />
              <figcaption className="mt-3 text-center text-[0.85rem] text-inverse/70">
                {active.alt}
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
