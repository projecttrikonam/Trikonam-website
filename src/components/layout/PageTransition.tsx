import type { ReactNode } from 'react';

/**
 * The route-change transition (Handoff §4.6 row 7) — 2026 navigation refinement.
 *
 * Rendered from app/template.tsx, which Next re-mounts on every navigation, so each page
 * fades in as it arrives. Driven by a CSS animation (`.page-enter` in globals.css)
 * rather than JS: time-based, always settles to fully visible, never strands the page at
 * opacity 0, and needs no client component. Deliberately opacity-only — no transform on
 * this wrapper, so `position: fixed` descendants (the Practice Compass popup) keep
 * referencing the viewport. The header lives in the layout, outside this component, so
 * it never re-animates: the visitor stays "inside Trikonam" while the page beneath it
 * settles. Under prefers-reduced-motion the global reduced-motion rule neutralises the
 * animation and the page is simply there.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
