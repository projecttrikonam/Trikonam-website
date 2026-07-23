'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, type ReactNode } from 'react';
import { heroContainer, heroItem } from '@/lib/motion-variants';
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion';

/**
 * Calm interior-page header (Handoff §4.6 row 1: staggered fade+rise on load).
 * eyebrow → title → intro, staggered ~80ms. Movement removed under reduced motion.
 *
 * As with PageTransition, the very first page skips the enter animation. Starting from
 * the `hidden` variant meant the server-rendered eyebrow, headline and intro all carried
 * `style="opacity:0"`, so the top of every interior page was blank until framer-motion
 * hydrated. Subsequent client-side navigations still stagger in.
 */

/** Module scope so it survives the per-navigation remount — see PageTransition. */
let hasNavigated = false;
export function PageHeader({
  eyebrow,
  title,
  intro,
  align = 'left',
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  align?: 'left' | 'center';
  children?: ReactNode;
}) {
  const reduced = usePrefersReducedMotion();
  const item = heroItem(reduced);
  const alignment = align === 'center' ? 'items-center text-center mx-auto' : 'items-start';

  // Read once at mount: false on the server and on the first client render, so the
  // markup matches and hydration stays clean.
  const [animateIn] = useState(() => hasNavigated);
  useEffect(() => {
    hasNavigated = true;
  }, []);

  return (
    <motion.div
      variants={heroContainer}
      initial={animateIn ? 'hidden' : false}
      animate="show"
      className={`flex max-w-3xl flex-col ${alignment}`}
    >
      {eyebrow && (
        <motion.span variants={item} className={`eyebrow eyebrow--tick mb-5 ${align === 'center' ? 'mx-auto w-fit' : ''}`}>
          {eyebrow}
        </motion.span>
      )}
      <motion.h1 variants={item} className="text-balance font-serif text-[clamp(1.75rem,3.6vw,2.95rem)] font-normal leading-[1.18] sm:leading-[1.08] tracking-[-0.015em] text-primary">
        {title}
      </motion.h1>
      {intro && (
        <motion.div
          variants={item}
          className={`prose-measure mt-6 text-body-lg text-secondary ${align === 'center' ? 'mx-auto' : ''}`}
        >
          {intro}
        </motion.div>
      )}
      {children && (
        <motion.div variants={item} className="mt-8">
          {children}
        </motion.div>
      )}
    </motion.div>
  );
}
