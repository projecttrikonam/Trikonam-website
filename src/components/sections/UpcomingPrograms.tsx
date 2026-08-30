import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { Button } from '@/components/ui/Button';
import { whatsappUrl } from '@/lib/whatsapp';
import {
  upcomingPrograms,
  communityPractice,
  type UpcomingProgram,
} from '@/content/upcoming-programs';

/**
 * Home → "Upcoming at Trikonam" (2026 refinement).
 *
 * Shows ONLY what is currently scheduled — a live "what's happening" board, not the full
 * catalogue. Entirely driven by src/content/upcoming-programs.ts, so the client can add,
 * remove, or reorder programmes without touching this component. Every "I'm Interested"
 * action opens WhatsApp; there is no checkout.
 */

function modeLabel(mode: UpcomingProgram['mode']) {
  return mode === 'in-person' ? 'In person' : 'Online';
}

function ProgramCard({ program }: { program: UpcomingProgram }) {
  const href = whatsappUrl(
    `Hi Trikonam, I'm interested in ${program.interest}. Please tell me more.`,
  );
  return (
    <article className="tactile group flex h-full flex-col rounded-[12px] surface-elevated p-7 ring-1 ring-black/[0.04]">
      <div className="flex items-center gap-2 text-micro uppercase tracking-[0.14em] text-moss">
        <span>{modeLabel(program.mode)}</span>
        <span aria-hidden className="h-1 w-1 rounded-full bg-moss/40" />
        <span className="text-secondary">{program.meta.replace(/ · In person$/i, '')}</span>
      </div>

      <h3 className="mt-3 font-serif text-[1.35rem] leading-snug text-primary">
        {program.name}
        {program.gloss && (
          <span className="ml-2 align-middle text-[0.9rem] font-normal not-italic text-secondary">
            · {program.gloss}
          </span>
        )}
      </h3>

      {program.location && (
        <p className="mt-1.5 text-caption uppercase tracking-[0.12em] text-secondary">
          {program.location}
        </p>
      )}

      <p className="mt-4 flex-1 text-body text-secondary">{program.description}</p>

      <div className="mt-6">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="group/link inline-flex items-center gap-2 text-fine font-medium uppercase tracking-[0.12em] text-moss transition-colors hover:text-moss-dark"
        >
          I’m Interested
          <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden className="transition-transform duration-300 ease-calm group-hover/link:translate-x-1">
            <path d="M1 5h13M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </article>
  );
}

export function UpcomingPrograms() {
  const communityHref = whatsappUrl(
    `Hi Trikonam, I'm interested in ${communityPractice.interest}. Please tell me more.`,
  );

  return (
    <section className="bg-bg-alt px-6 py-20 sm:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <RevealOnScroll variant="rise" className="mb-14 max-w-2xl">
          <span className="eyebrow eyebrow--tick mb-6 block">Upcoming at Trikonam</span>
          <h2 className="text-balance font-serif text-[clamp(1.6rem,3.4vw,2.6rem)] font-normal leading-[1.22] text-primary">
            What’s happening now.
          </h2>
          <p className="prose-measure mt-8 text-body-lg text-secondary">
            The programs currently scheduled — in person in Hyderabad, and live online.
            Batches are small, so we form them by conversation: tell us you’re interested
            and we’ll take it from there.
          </p>
        </RevealOnScroll>

        <ul className="grid gap-6 sm:grid-cols-2">
          {upcomingPrograms.map((program, i) => (
            <RevealOnScroll as="li" key={program.slug} delay={0.05 + (i % 2) * 0.1} className="h-full">
              <ProgramCard program={program} />
            </RevealOnScroll>
          ))}
        </ul>

        {/* The community practice, presented apart — not a paid workshop. */}
        <RevealOnScroll delay={0.1} className="mt-6">
          <div className="tactile group flex flex-col items-start gap-4 rounded-[12px] border border-dashed border-moss/30 bg-bg/40 p-7 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 text-micro uppercase tracking-[0.14em] text-moss">
                <span>{communityPractice.meta}</span>
              </div>
              <h3 className="mt-2 font-serif text-[1.3rem] text-primary">
                {communityPractice.name}
              </h3>
              <p className="mt-2 text-body text-secondary">{communityPractice.description}</p>
            </div>
            <a
              href={communityHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link inline-flex shrink-0 items-center gap-2 text-fine font-medium uppercase tracking-[0.12em] text-moss transition-colors hover:text-moss-dark"
            >
              Join the Practice
              <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden className="transition-transform duration-300 ease-calm group-hover/link:translate-x-1">
                <path d="M1 5h13M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1} className="mt-12">
          <Button href="/online-programs" variant="text">
            See all online programs
          </Button>
        </RevealOnScroll>
      </div>
    </section>
  );
}
