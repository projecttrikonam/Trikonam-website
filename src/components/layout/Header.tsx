'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { primaryNav } from '@/content/site-config';
import { RegisterButton } from '@/components/ui/RegisterButton';
import { MobileNav } from './MobileNav';
import { Wordmark } from './Wordmark';

/**
 * Site header: wordmark, nav, and Register invitation.
 *
 * On the home page it rests transparent over the full-screen hero with light type, then
 * settles into a soft glass bar with dark type once the page moves. On every other page
 * it is dark type from the top. The transition is a slow fade — nothing snaps.
 */
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const current = pathname?.replace(/\/+$/, '') || '/';

  // Light type only while resting over the home hero (before any scroll).
  const overHero = current === '/' && !scrolled;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-24 transition-all duration-700 ease-calm ${
        scrolled ? 'glass shadow-[0_1px_0_rgba(226,217,198,0.9)]' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between pl-6 pr-6 sm:pl-8 sm:pr-8 xl:pr-0">
        <Link
          href="/"
          aria-label="Trikonam — home"
          className="shrink-0 transition-opacity hover:opacity-70"
        >
          <Wordmark light={overHero} />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {primaryNav.slice(1).map((item) => {
            const active = current === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`relative text-[0.9rem] tracking-[0.01em] transition-colors ${
                  overHero
                    ? 'text-inverse/85 hover:text-inverse'
                    : active
                    ? 'text-moss'
                    : 'text-primary hover:text-moss'
                }`}
              >
                <span className={overHero ? '' : 'link-underline'}>{item.label}</span>
                {active && !overHero && (
                  <span
                    aria-hidden
                    className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-moss"
                  />
                )}
              </Link>
            );
          })}
          <RegisterButton />
        </nav>

        {/* Mobile menu toggle */}
        <button
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((v) => !v)}
          className={`relative z-50 flex h-10 w-10 items-center justify-center lg:hidden ${
            overHero && !menuOpen ? 'text-inverse' : 'text-primary'
          }`}
        >
          <span className="sr-only">Menu</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            {menuOpen ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            ) : (
              <path d="M4 8h16M4 16h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} currentPath={current} />
    </header>
  );
}
