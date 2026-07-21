'use client';

import { useState } from 'react';

/**
 * Share row for an article — X, Facebook, LinkedIn, WhatsApp, and a copy-link button.
 * Uses the canonical absolute URL passed in (built at render time), so it works on the
 * static site without reading window at render.
 */
export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);

  const links = [
    { label: 'X', href: `https://twitter.com/intent/tweet?url=${u}&text=${t}` },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { label: 'WhatsApp', href: `https://wa.me/?text=${t}%20${u}` },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <span className="mr-1 text-[0.78rem] uppercase tracking-[0.12em] text-secondary">Share</span>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-border px-3.5 py-1 text-[0.8rem] text-secondary transition-colors hover:border-moss hover:text-moss"
        >
          {l.label}
        </a>
      ))}
      <button
        type="button"
        onClick={copy}
        className="rounded-full border border-border px-3.5 py-1 text-[0.8rem] text-secondary transition-colors hover:border-moss hover:text-moss"
      >
        {copied ? 'Copied' : 'Copy link'}
      </button>
    </div>
  );
}
