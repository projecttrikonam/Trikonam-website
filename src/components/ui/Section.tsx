import type { ElementType, ReactNode } from 'react';

/**
 * Consistent vertical rhythm + max-width container (Handoff §4.4, §8).
 * Section vertical padding: min 96px desktop / 56px mobile.
 *
 * `tone` sets the background band; alternating tones create the calm, editorial
 * banding the brand calls for.
 */
type Tone = 'bg' | 'bg-alt' | 'surface';
type Width = 'default' | 'narrow' | 'wide';

const tones: Record<Tone, string> = {
  bg: 'bg-bg',
  'bg-alt': 'bg-bg-alt',
  surface: 'bg-surface',
};

const widths: Record<Width, string> = {
  narrow: 'max-w-3xl',
  default: 'max-w-5xl',
  wide: 'max-w-6xl',
};

export function Section({
  as: Tag = 'section',
  tone = 'bg',
  width = 'default',
  className = '',
  containerClassName = '',
  children,
  id,
}: {
  as?: ElementType;
  tone?: Tone;
  width?: Width;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <Tag id={id} className={`${tones[tone]} px-6 py-14 sm:px-8 md:py-24 ${className}`}>
      <div className={`mx-auto ${widths[width]} ${containerClassName}`}>{children}</div>
    </Tag>
  );
}
