'use client';

import { useState } from 'react';

/**
 * A lightweight YouTube embed (2026 refinement).
 *
 * Renders the video's own thumbnail with a calm play control and loads the real iframe
 * only on click — so the homepage never pays YouTube's script/network cost on load, and
 * nothing plays until the visitor asks. Uses youtube-nocookie.com. Keyboard accessible;
 * respects the surrounding motion language (no autoplay of anything decorative).
 *
 * `poster` should be a locally-hosted still (we save the video's real cover into
 * /public/images), so the closed state is fully self-contained.
 */
export function YouTubeFacade({
  id,
  poster,
  title,
}: {
  id: string;
  poster: string;
  title: string;
}) {
  const [active, setActive] = useState(false);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-[12px] bg-primary shadow-lift ring-1 ring-black/[0.06]">
      {active ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          aria-label={`Play video: ${title}`}
          className="group absolute inset-0 h-full w-full cursor-pointer"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={poster}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <span className="absolute inset-0 bg-primary/20 transition-colors duration-500 group-hover:bg-primary/10" />
          <span className="absolute left-1/2 top-1/2 flex h-[68px] w-[68px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-bg/95 shadow-float transition-transform duration-500 ease-calm group-hover:scale-105">
            <svg width="22" height="26" viewBox="0 0 22 26" fill="none" aria-hidden>
              <path d="M21 13 0.75 25.12V0.88L21 13Z" fill="rgb(var(--color-accent-gold))" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
