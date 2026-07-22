'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { heroContainer, heroItem } from '@/lib/motion-variants';
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion';

/**
 * Calm interior-page header (Handoff §4.6 row 1: staggered fade+rise on load).
 * eyebrow → title → intro, staggered ~80ms. Movement removed under reduced motion.
 */
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

  return (
    <motion.div
      variants={heroContainer}
      initial="hidden"
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
