'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { chyMega } from '@/content/site-config';

/**
 * Classical Hatha Yoga mega menu (v2.0) — desktop only.
 *
 * Behaviour is inspired by Isha's Yoga & Meditation menu (a hover/focus panel of
 * grouped links); the visual language is entirely Trikonam's own — a calm glass panel
 * on the ivory palette, moss eyebrow column headers, serif links, a gold hairline that
 * draws in on hover. Movement is removed under prefers-reduced-motion.
 *
 * The trigger still navigates to /practices on click. The panel opens on hover and on
 * keyboard focus, and closes on mouse-leave (after a short grace delay so the cursor can
 * cross the gap into the panel), Escape, outside click, or route change.
 */
export function MegaMenu({
  label,
  href,
  overHero,
  active,
}: {
  label: string;
  href: string;
  overHero: boolean;
  active: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  };
  const openNow = () => {
    cancelClose();
    setOpen(true);
  };

  // Close on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Escape and on outside click/focus.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onOutside = (e: Event) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onOutside);
    document.addEventListener('focusin', onOutside);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onOutside);
      document.removeEventListener('focusin', onOutside);
    };
  }, [open]);

  useEffect(() => () => cancelClose(), []);

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={scheduleClose}
    >
      <Link
        href={href}
        aria-current={active ? 'page' : undefined}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={panelId}
        onFocus={openNow}
        className={`relative inline-flex items-center gap-1.5 text-[0.9rem] tracking-[0.01em] transition-[color,transform] duration-300 ease-calm hover:-translate-y-px motion-reduce:hover:translate-y-0 ${
          overHero
            ? 'text-inverse/85 hover:text-inverse'
            : active
            ? 'text-moss'
            : 'text-primary hover:text-moss'
        }`}
      >
        <span
          className={
            overHero ? '' : `link-underline${active ? ' link-underline--active' : ''}`
          }
        >
          {label}
        </span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          aria-hidden
          className={`mt-px transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>

      {/* Rendered directly on `open` (no AnimatePresence exit) so the panel unmounts
          cleanly when it closes — never left mounted at opacity 0 blocking clicks.
          Centering is the Tailwind `-translate-x-1/2` (the resting state, and what
          reduced-motion visitors see). `.mega-panel` layers a fade + slight drop on
          top for full-motion visitors only (globals.css), its keyframe keeping the
          same -50% X so the horizontal position never shifts. */}
      {open && (
          <div
            id={panelId}
            onMouseEnter={openNow}
            onMouseLeave={scheduleClose}
            className="mega-panel fixed left-1/2 top-[calc(6rem+0.25rem)] z-50 w-[min(56rem,calc(100vw-3rem))] -translate-x-1/2"
          >
            <div className="glass overflow-hidden rounded-[14px] border border-border/70 shadow-float">
              <div className="grid grid-cols-3 gap-x-8 gap-y-2 p-8">
                {chyMega.columns.map((col) => (
                  <div key={col.heading}>
                    <h3 className="eyebrow mb-4">{col.heading}</h3>
                    <ul className="space-y-1">
                      {col.items.map((it) => (
                        <li key={it.href}>
                          <Link
                            href={it.href}
                            className="group/mm flex items-center justify-between rounded-md px-3 py-2 font-serif text-[1.05rem] text-primary transition-colors hover:bg-moss/[0.06] hover:text-moss focus-visible:outline-2 focus-visible:outline-offset-2"
                          >
                            {it.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
