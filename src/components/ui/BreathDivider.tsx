import { BreathMark } from './BreathMark';

/**
 * Section-divider motif (Handoff §4.5): the breath-mark ring replacing generic
 * numbered markers or icon rows between major sections. Used sparingly — the breath
 * mark should appear at most 3–4 times per page total.
 */
export function BreathDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`} aria-hidden>
      <span className="h-px w-16 bg-border sm:w-24" />
      <BreathMark className="h-7 w-7" opacity={0.55} />
      <span className="h-px w-16 bg-border sm:w-24" />
    </div>
  );
}
