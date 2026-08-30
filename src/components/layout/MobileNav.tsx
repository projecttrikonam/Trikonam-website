'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { primaryNav, chyMega } from '@/content/site-config';
import { BeginJourneyButton } from '@/components/ui/BeginJourneyButton';

/**
 * Full-screen mobile navigation overlay (Handoff §8; v2.0 adds the Classical Hatha
 * Yoga expandable group). Locks body scroll while open and closes on Escape or on
 * choosing a link. The CHY item expands in place to reveal the mega-menu groups.
 *
 * 2026 navigation refinement: the entrance is CSS, not framer. The overlay and each
 * link are fully visible in their resting styles; `.mobile-nav-overlay` /
 * `.mobile-nav-item` add a gentle fade + stagger for full-motion visitors only
 * (`prefers-reduced-motion: no-preference` in globals.css). Reduced-motion visitors
 * get the menu with no animation and nothing can be left stranded at opacity 0. The
 * overlay still renders directly on `open` (no exit animation) so React unmounts it
 * the instant the menu closes — no stale, click-blocking layer is ever left behind.
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
  const [chyOpen, setChyOpen] = useState(false);

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

  // Collapse the CHY group whenever the menu closes, so it reopens tidy.
  useEffect(() => {
    if (!open) setChyOpen(false);
  }, [open]);

  if (!open) return null;

  return (
    <div
      id="mobile-nav"
      className="mobile-nav-overlay glass fixed inset-0 z-40 overflow-y-auto lg:hidden"
    >
      <nav aria-label="Mobile" className="flex min-h-full flex-col justify-center px-8 py-24">
        {primaryNav.map((item, i) => {
          const active = currentPath === item.href;
          const isMega = 'mega' in item;

          return (
            <div
              key={item.href}
              className="mobile-nav-item border-b border-border/70"
              style={{ '--stagger': i } as React.CSSProperties}
            >
              {isMega ? (
                <>
                  <div className="flex items-center justify-between">
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-baseline gap-4 py-4 ${
                        active || currentPath.startsWith('/practices') ? 'text-moss' : 'text-primary'
                      }`}
                    >
                      <span className="font-sans text-[0.7rem] tabular-nums tracking-widest text-moss/60">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="font-serif text-[1.65rem] leading-tight">{item.label}</span>
                    </Link>
                    <button
                      type="button"
                      aria-label={chyOpen ? 'Collapse Classical Hatha Yoga menu' : 'Expand Classical Hatha Yoga menu'}
                      aria-expanded={chyOpen}
                      onClick={() => setChyOpen((v) => !v)}
                      className="flex h-11 w-11 items-center justify-center text-moss"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden
                        className={`transition-transform duration-300 ${chyOpen ? 'rotate-180' : ''}`}
                      >
                        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>

                  {chyOpen && (
                    <div className="space-y-5 pb-5 pl-9">
                      {chyMega.columns.map((col) => (
                        <div key={col.heading}>
                          <h3 className="eyebrow mb-2">{col.heading}</h3>
                          <ul className="space-y-1">
                            {col.items.map((it) => (
                              <li key={it.href}>
                                <Link
                                  href={it.href}
                                  onClick={onClose}
                                  className="block py-1.5 font-serif text-[1.15rem] text-primary hover:text-moss"
                                >
                                  {it.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-baseline gap-4 py-4 ${active ? 'text-moss' : 'text-primary'}`}
                >
                  <span className="font-sans text-[0.7rem] tabular-nums tracking-widest text-moss/60">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-serif text-[1.65rem] leading-tight">{item.label}</span>
                </Link>
              )}
            </div>
          );
        })}
        <div
          className="mobile-nav-item mt-8"
          style={{ '--stagger': primaryNav.length } as React.CSSProperties}
          onClick={onClose}
        >
          <BeginJourneyButton />
        </div>
      </nav>
    </div>
  );
}
