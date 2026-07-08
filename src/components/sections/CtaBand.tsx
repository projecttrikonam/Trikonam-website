import type { ReactNode } from 'react';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { BreathMark } from '@/components/ui/BreathMark';

/**
 * Quiet call-to-action band (Creative Director revision). The button (Register or
 * Enquire) is passed in as a child, so this component never hardcodes a form URL —
 * CTA logic lives in the RegisterButton / EnquireButton components (Handoff §3.4).
 *
 * Presented on an elevated glass panel with a soft gradient wash and the breath mark,
 * giving the closing invitation on each page a sense of arrival.
 */
export function CtaBand({
  title,
  text,
  children,
}: {
  title: string;
  text?: string;
  children: ReactNode;
}) {
  return (
    <section className="bg-bg px-6 py-16 sm:px-8 md:py-24">
      <RevealOnScroll className="mx-auto max-w-4xl">
        <div className="relative overflow-hidden rounded-[16px] border border-border/70 bg-[radial-gradient(120%_140%_at_50%_-20%,rgba(138,98,48,0.07),transparent_60%)] px-6 py-16 text-center shadow-soft sm:px-16 sm:py-20">
          <BreathMark
            className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2"
            opacity={0.14}
          />
          <div className="relative">
            <h2 className="text-balance font-serif text-[clamp(1.6rem,3vw,2.25rem)] leading-[1.2] text-primary">
              {title}
            </h2>
            {text && (
              <p className="prose-measure mx-auto mt-4 text-body-lg text-secondary">
                {text}
              </p>
            )}
            <div className="mt-9 flex justify-center">{children}</div>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
