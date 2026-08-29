import { RevealOnScroll } from '@/components/ui/RevealOnScroll';

/**
 * Home → "What can practice become in your life?" (2026 refinement).
 *
 * The four dimensions Classical Hatha Yoga supports — moved to the homepage from the
 * About page and given a more evocative frame. The cards reveal one after another as the
 * section enters the viewport (Body → Mind → Energy → Emotions), each a short beat rather
 * than all at once.
 */
const dimensions = [
  {
    label: 'Body',
    text: 'Strength, flexibility, posture, stability — and an everyday ease in being physical.',
  },
  {
    label: 'Mind',
    text: 'Greater clarity, focus, and steadiness, and the space to respond rather than react.',
  },
  {
    label: 'Energy',
    text: 'Balance within the body’s energy system — vitality, lightness, and a sense of inner aliveness.',
  },
  {
    label: 'Emotions',
    text: 'Emotional balance, inner stability, and a more joyful, unforced experience of life.',
  },
];

export function WhatPracticeBecomes() {
  return (
    <section className="bg-bg px-6 py-16 sm:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <RevealOnScroll className="max-w-2xl">
          <span className="eyebrow eyebrow--tick mb-5">In an ordinary life</span>
          <h2 className="text-balance font-serif text-[clamp(1.6rem,3.4vw,2.6rem)] font-normal leading-[1.22] text-primary">
            What can practice become in your life?
          </h2>
          <p className="prose-measure mt-5 text-body-lg text-secondary">
            Each practice has its own purpose. Together, over time, they become a quiet
            support beneath everything — working on every dimension of how a life is
            lived.
          </p>
        </RevealOnScroll>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {dimensions.map((d, i) => (
            <RevealOnScroll
              as="li"
              key={d.label}
              delay={i * 0.12}
              className="flex h-full flex-col rounded-[12px] surface-elevated p-6 ring-1 ring-black/[0.04] sm:p-7"
            >
              <span className="mb-3 block font-serif text-[1.3rem] text-primary">{d.label}</span>
              <span aria-hidden className="mb-4 block h-px w-8 bg-gradient-to-r from-gold/50 to-gold/0" />
              <p className="text-body text-secondary">{d.text}</p>
            </RevealOnScroll>
          ))}
        </ul>
      </div>
    </section>
  );
}
