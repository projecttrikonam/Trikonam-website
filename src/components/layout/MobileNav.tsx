'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { primaryNav } from '@/content/site-config';
import { RegisterButton } from '@/components/ui/RegisterButton';
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion';

/**
 * Full-screen mobile navigation overlay (Handoff §8). Traps nothing heavy — it is a
 * simple, calm panel. Locks body scroll while open and closes on Escape or on
 * choosing a link.
 */
export function MobileNav({
  open,
  onClose,
  currentPath,
}: {
  open: boolean;
  onClose: () => void;
  currentPath: string;
}) {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-nav"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="glass fixed inset-0 z-40 lg:hidden"
        >
          <nav
            aria-label="Mobile"
            className="flex h-full flex-col justify-center px-8 pt-16"
          >
            {primaryNav.map((item, i) => {
              const active = currentPath === item.href;
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: reduced ? 0 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className="border-b border-border/70"
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-baseline gap-4 py-4 ${
                      active ? 'text-moss' : 'text-primary'
                    }`}
                  >
                    <span className="font-sans text-[0.7rem] tabular-nums tracking-widest text-moss/60">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="font-serif text-[1.65rem] leading-tight">
                      {item.label}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
            <motion.div
              initial={{ opacity: 0, y: reduced ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8"
              onClick={onClose}
            >
              <RegisterButton />
            </motion.div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
