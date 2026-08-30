'use client';

import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { useFocusGroup } from '@/lib/interaction';

/**
 * Home → "What can practice become in your life?" (2026 interaction layer).
 *
 * The four dimensions Classical Hatha Yoga supports. This is the reference example of
 * the Trikonam focus interaction: move the cursor to Body and Body comes gently forward
 * and into focus while Mind, Energy, and Emotions recede; move to Mind and the focus
 * transfers; leave the section and the four settle back level. It should feel like
 * bringing one dimension of practice into awareness — tactile and slow, not a hover pop.
 *
 * Driven by useFocusGroup: cursor + keyboard on pointer devices; on touch, the card
 * nearest the middle of the screen takes focus as you scroll, and a tap pins one.
 * Movement is dropped under prefers-reduced-motion (the quiet opacity shift stays, as it
 * aids focus rather than decorates).
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
  const { groupProps, getPeerProps } = useFocusGroup(dimensions.length);

  return (
    <section className="bg-bg px-6 py-16 sm:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <RevealOnScroll className="max-w-2xl">
          <span className="eyebrow eyebrow--tick mb-5">In an ordinary life</span>
        </RevealOnScroll>
        <RevealOnScroll delay={0.06}>
          <h2 className="max-w-2xl text-balance font-serif text-[clamp(1.6rem,3.4vw,2.6rem)] font-normal leading-[1.22] text-primary">
            What can practice become in your life?
          </h2>
        </RevealOnScroll>
        <RevealOnScroll delay={0.12}>
          <p className="prose-measure mt-5 max-w-2xl text-body-lg text-secondary">
            Each practice has its own purpose. Together, over time, they become a quiet
            support beneath everything — working on every dimension of how a life is
            lived.
          </p>
        </RevealOnScroll>

        <ul
          {...groupProps}
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {dimensions.map((d, i) => (
            <RevealOnScroll as="li" key={d.label} delay={0.18 + i * 0.09} className="h-full">
              <div
                {...getPeerProps(i)}
                className="focus-peer flex h-full flex-col rounded-[12px] surface-elevated p-6 ring-1 ring-black/[0.04] sm:p-7"
              >
                <span className="mb-3 block font-serif text-[1.3rem] text-primary">{d.label}</span>
                <span aria-hidden className="mb-4 block h-px w-8 bg-gradient-to-r from-gold/50 to-gold/0" />
                <p className="text-body text-secondary">{d.text}</p>
              </div>
            </RevealOnScroll>
          ))}
        </ul>
      </div>
    </section>
  );
}
