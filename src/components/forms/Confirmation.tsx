'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { BreathMark } from '@/components/ui/BreathMark';
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion';

/**
 * The Welcome System confirmation (v2.1) — shown after any journey is submitted. Not a
 * bare "form submitted": a warm arrival with a calm journey timeline, in Trikonam's own
 * visual language.
 */

const timeline = [
  'Registration Received',
  'Registration Reviewed',
  'Payment Link Sent',
  'Registration Confirmed',
  'Welcome to Trikonam',
];

export function Confirmation({
  title = 'Your journey begins here.',
  body = 'Thank you for registering with Trikonam. We’ve received your details successfully. Our team will contact you shortly with payment details and the next steps.',
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
      className="relative mx-auto max-w-xl overflow-hidden rounded-[16px] border border-border/70 bg-[radial-gradient(120%_140%_at_50%_-20%,rgba(91,107,78,0.08),transparent_60%)] px-6 py-14 text-center shadow-soft sm:px-14 sm:py-16"
    >
      <BreathMark
        className="pointer-events-none absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2"
        opacity={0.12}
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

        {/* Journey timeline */}
        <ol className="mx-auto mt-10 flex max-w-sm flex-col gap-0 text-left">
          {timeline.map((step, i) => {
            const last = i === timeline.length - 1;
            return (
              <li key={step} className="relative flex items-start gap-4 pb-6 last:pb-0">
                {!last && (
                  <span aria-hidden className="absolute left-[7px] top-4 h-full w-px bg-border" />
                )}
                <span
                  aria-hidden
                  className={`relative z-10 mt-1 h-3.5 w-3.5 shrink-0 rounded-full border ${
                    i === 0 ? 'border-moss bg-moss' : 'border-border bg-bg'
                  }`}
                />
                <span className={`text-body ${i === 0 ? 'font-medium text-primary' : 'text-secondary'}`}>
                  {step}
                </span>
              </li>
            );
          })}
        </ol>

        <div className="mt-10">
          <Link href="/" className="text-[0.95rem] font-medium text-moss hover:text-moss-dark">
            ← Return home
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
