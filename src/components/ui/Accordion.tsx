'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion';

/**
 * Accessible accordion for the FAQ page (Handoff §6.11, §8).
 *
 * Uses a real <button> per item with aria-expanded / aria-controls so it is fully
 * keyboard-operable and screen-reader friendly. Panel height animates open/closed;
 * under prefers-reduced-motion it snaps with no movement.
 */
export interface AccordionItem {
  question: string;
  answer: string;
}

export function Accordion({ items }: { items: AccordionItem[] }) {
  const reduced = usePrefersReducedMotion();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <ul className="divide-y divide-border border-y border-border">
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `faq-panel-${i}`;
        const btnId = `faq-btn-${i}`;
        return (
          <li key={item.question}>
            <h3 className="m-0">
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-moss focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <span className="font-serif text-h3 leading-snug text-primary">
                  {item.question}
                </span>
                <span
                  aria-hidden
                  className={`shrink-0 text-moss transition-transform duration-300 ${
                    isOpen ? 'rotate-45' : ''
                  }`}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  initial={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  animate={reduced ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                  exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="prose-measure pb-6 text-body-lg text-secondary">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
