import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import { BreathMark } from '@/components/ui/BreathMark';
import {
  whyOnline,
  journeyPrograms,
  themedPrograms,
  corporatePrograms,
  durationAdjective,
  type OnlineProgram,
} from '@/content/online-programs';
import { whatsappUrl } from '@/lib/whatsapp';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Online Programs',
  description:
    'Learn Classical Hatha Yoga live from anywhere. Authentic online programs — small live batches guided by certified teachers, offered as journeys by duration, for beginners and beyond.',
  path: '/online-programs',
});

/**
 * Online Programs (2026 refinement).
 *
 * The offering is framed as journeys by duration, not by the practices inside them —
 * the cards deliberately never list "Upa-Yoga + Pranayama + …". Every action opens
 * WhatsApp ("I'm Interested"); there is no checkout, because batches are small and formed
 * by conversation. The "Why Online" section is preserved verbatim. The hero is a
 * left-copy / right-image split (no full-bleed image), so the header sits on the ivory
 * page as normal.
 */

function interestHref(program: OnlineProgram) {
  const label =
    program.group === 'journey'
      ? `${program.name} — the ${durationAdjective(program.duration)} online journey${
          program.price ? ` (${program.price})` : ''
        }`
      : `the ${program.name} online session`;
  return whatsappUrl(`Hi Trikonam, I'm interested in ${label}. Please tell me more.`);
}

function ProgramCard({ program }: { program: OnlineProgram }) {
  return (
    <article className="flex h-full flex-col rounded-[12px] surface-elevated p-7 ring-1 ring-black/[0.04]">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 className="font-serif text-[1.35rem] leading-snug text-primary">
          {program.name}
          {program.gloss && (
            <span className="ml-2 align-middle text-[0.9rem] font-normal text-secondary">
              · {program.gloss}
            </span>
          )}
        </h3>
        {program.price && (
          <span className="text-[0.95rem] font-medium text-primary">{program.price}</span>
        )}
      </div>
      <p className="mt-2 text-[0.8rem] uppercase tracking-[0.1em] text-secondary">{program.duration}</p>
      <p className="mt-4 flex-1 text-body text-secondary">{program.blurb}</p>
      <div className="mt-6">
        <a
          href={interestHref(program)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-fine font-medium uppercase tracking-[0.12em] text-moss transition-colors hover:text-moss-dark"
        >
          I’m Interested
          <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden>
            <path d="M1 5h13M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </article>
  );
}

export default function OnlineProgramsPage() {
  return (
    <>
      {/* HERO — left copy, right image (no full-bleed). */}
      <Section tone="bg" width="wide" className="pt-10 md:pt-16">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <RevealOnScroll>
            <span className="mb-5 block text-label uppercase tracking-[0.22em] text-moss">
              Live Online Programs
            </span>
            <h1 className="text-balance font-serif text-[clamp(2rem,4.6vw,3.4rem)] font-normal leading-[1.1] tracking-[-0.02em] text-primary">
              Learn Classical Hatha Yoga from Anywhere.
            </h1>
            <p className="prose-measure mt-6 text-body-lg leading-relaxed text-secondary">
              Authentic live online sessions, offered by certified Classical Hatha Yoga
              teachers — the same practice, the same attention, wherever you are.
            </p>
            <a
              href="#programs"
              className="mt-8 inline-flex items-center gap-2 text-fine font-medium uppercase tracking-[0.12em] text-moss transition-colors hover:text-moss-dark"
            >
              See the programs
              <svg width="14" height="16" viewBox="0 0 14 16" fill="none" aria-hidden>
                <path d="M7 1v13M1 8l6 6 6-6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
            <ResponsiveImage
              src="/images/online-programs/hero.webp"
              alt="A student in white joins a live online Classical Hatha Yoga session on a laptop, seated in a sunlit garden."
              aspect="aspect-[4/3]"
              sizes="(min-width: 768px) 46vw, 100vw"
              priority
            />
          </RevealOnScroll>
        </div>
      </Section>

      {/* WHY ONLINE — preserved verbatim. DO NOT TOUCH. */}
      <Section tone="bg" width="wide">
        <RevealOnScroll className="mb-12 max-w-3xl">
          <span className="eyebrow eyebrow--tick mb-4">Why Online</span>
          <h2 className="text-balance text-h2">
            The full depth of the practice, brought to your own space.
          </h2>
        </RevealOnScroll>
        <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {whyOnline.map((item, i) => (
            <RevealOnScroll as="li" key={item.title} delay={(i % 3) * 0.06}>
              <span aria-hidden className="mb-4 block h-px w-8 bg-gradient-to-r from-gold/60 to-gold/0" />
              <h3 className="font-serif text-[1.2rem] text-primary">{item.title}</h3>
              <p className="mt-2 text-body text-secondary">{item.text}</p>
            </RevealOnScroll>
          ))}
        </ul>
      </Section>

      {/* THE JOURNEYS */}
      <Section id="programs" tone="bg-alt" width="wide">
        <RevealOnScroll className="mb-12 max-w-2xl">
          <span className="eyebrow eyebrow--tick mb-4">The Journeys</span>
          <h2 className="text-balance text-h2">Choose a journey, not a checklist.</h2>
          <p className="prose-measure mt-4 text-body-lg text-secondary">
            Each journey is a guided arc of live practice in a small batch. We keep the
            specific practices for a conversation once you’re interested — what matters
            first is how far you’d like to go. Beginners are always welcome.
          </p>
        </RevealOnScroll>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {journeyPrograms.map((program) => (
            <li key={program.slug}>
              <ProgramCard program={program} />
            </li>
          ))}
        </ul>
      </Section>

      {/* THEMED SESSIONS */}
      <Section tone="bg" width="wide">
        <RevealOnScroll className="mb-12 max-w-2xl">
          <span className="eyebrow eyebrow--tick mb-4">Themed Sessions</span>
          <h2 className="text-balance text-h2">Single sessions, for a specific need.</h2>
          <p className="prose-measure mt-4 text-body-lg text-secondary">
            Shorter, focused sessions you can join on their own — for eating well, rest,
            steadiness, and the immune system.
          </p>
        </RevealOnScroll>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {themedPrograms.map((program) => (
            <li key={program.slug}>
              <ProgramCard program={program} />
            </li>
          ))}
        </ul>
      </Section>

      {/* CORPORATE — separated */}
      <Section tone="bg-alt" width="wide">
        <RevealOnScroll className="relative mb-10 overflow-hidden rounded-[16px] border border-border/70 bg-[radial-gradient(120%_140%_at_50%_-20%,rgba(138,98,48,0.06),transparent_60%)] p-8 sm:p-12">
          <BreathMark
            className="pointer-events-none absolute -right-10 -top-10 h-48 w-48"
            opacity={0.1}
          />
          <div className="relative">
            <span className="eyebrow eyebrow--tick mb-4">For Organisations</span>
            <h2 className="text-balance text-h2">Online yoga for the workplace.</h2>
            <p className="prose-measure mt-4 text-body-lg text-secondary">
              Structured live programs for teams — bringing steadiness, clarity, and
              wellbeing into the working week, wherever your people are based.
            </p>
          </div>
        </RevealOnScroll>
        <ul className="grid gap-6 sm:grid-cols-2">
          {corporatePrograms.map((program) => (
            <li key={program.slug}>
              <ProgramCard program={program} />
            </li>
          ))}
        </ul>
        <RevealOnScroll className="mt-10">
          <a
            href={whatsappUrl(
              "Hi Trikonam, I'd like to talk about an online corporate wellness program for our team.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-[7px] gradient-gold px-8 py-3.5 text-[0.95rem] font-medium tracking-[0.01em] text-inverse shadow-soft ring-1 ring-inset ring-white/10 transition-all duration-300 ease-calm hover:-translate-y-0.5 hover:shadow-lift hover:brightness-[1.06] focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Talk to us on WhatsApp
          </a>
        </RevealOnScroll>
      </Section>
    </>
  );
}
