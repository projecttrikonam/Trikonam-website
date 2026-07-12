'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { BreathMark } from '@/components/ui/BreathMark';
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion';

/**
 * Shared confirmation screen shown after a successful registration or corporate enquiry
 * (v2.0). Calm and premium — a breath mark, a warm thank-you, and a quiet way back.
 */
export function Confirmation({
  title = 'Thank you for registering.',
  body = 'We have received your registration. Our team will be in touch and email your payment link, batch details, and next steps shortly.',
}: {
  title?: string;
  body?: string;
}) {
  const reduced = usePrefersReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: reduced ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto max-w-xl overflow-hidden rounded-[16px] border border-border/70 bg-[radial-gradient(120%_140%_at_50%_-20%,rgba(91,107,78,0.08),transparent_60%)] px-6 py-16 text-center shadow-soft sm:px-14 sm:py-20"
    >
      <BreathMark
        className="pointer-events-none absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2"
        opacity={0.14}
      />
      <div className="relative">
        <span aria-hidden className="mx-auto mb-7 flex h-14 w-14 items-center justify-center rounded-full border border-moss/40 text-moss">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M5 12.5l4 4 10-10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h2 className="text-balance font-serif text-[clamp(1.5rem,3vw,2.05rem)] leading-[1.2] text-primary">
          {title}
        </h2>
        <p className="prose-measure mx-auto mt-4 text-body-lg text-secondary">{body}</p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Link
            href="/online-programs"
            className="text-[0.95rem] font-medium text-moss hover:text-moss-dark"
          >
            ← Back to Online Programs
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
