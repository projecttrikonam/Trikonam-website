import type { Metadata } from 'next';
import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { BreathMark } from '@/components/ui/BreathMark';
import { CtaBand } from '@/components/sections/CtaBand';
import { RegisterButton } from '@/components/ui/RegisterButton';
import {
  whyOnline,
  generalPrograms,
  corporatePrograms,
  type OnlineProgram,
} from '@/content/online-programs';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Online Programs',
  description:
    'Learn Classical Hatha Yoga live from anywhere. Authentic online programs — small live batches guided by certified teachers, for beginners and beyond.',
  path: '/online-programs',
});

/**
 * Online Programs (Trikonam v2.0) — the flagship page. Built entirely from the existing
 * design system (full-bleed hero in the home-hero idiom, Section/RevealOnScroll rhythm,
 * elevated cards, CtaBand). The header sits transparent with light type over this hero,
 * exactly like the home page (see Header `overHero`).
 */

/** One programme card — elevated surface, calm hover lift, gold hairline (shared shell). */
function ProgramCard({ program, formPath }: { program: OnlineProgram; formPath: string }) {
  return (
    <Link
      href={`${formPath}?program=${program.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-[12px] surface-elevated p-7 ring-1 ring-black/[0.04] transition-all duration-500 ease-calm hover:-translate-y-1 hover:shadow-lift focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      {program.timeOfDay && (
        <span className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-surface/60 px-3 py-1 text-[0.72rem] uppercase tracking-[0.14em] text-moss">
          {program.timeOfDay}
        </span>
      )}
      <h3 className="font-serif text-[1.3rem] leading-snug text-primary">{program.name}</h3>
      <div className="mt-2 flex items-center gap-2 text-[0.82rem] uppercase tracking-[0.1em] text-secondary">
        <span>{program.sessions}</span>
        <span aria-hidden className="h-1 w-1 rounded-full bg-moss/50" />
        <span>{program.duration}</span>
      </div>
      <p className="mt-4 flex-1 text-body text-secondary">{program.blurb}</p>
      <span className="mt-6 inline-flex items-center gap-2 text-[0.8rem] font-medium uppercase tracking-[0.12em] text-moss">
        Register
        <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </span>
      <span className="pointer-events-none absolute inset-x-7 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-gold/60 to-transparent transition-transform duration-700 ease-calm group-hover:scale-x-100" />
    </Link>
  );
}

export default function OnlineProgramsPage() {
  return (
    <>
      {/* HERO — full-bleed immersive image, in the home-hero idiom. */}
      <section className="relative -mt-24 flex h-[82vh] min-h-[560px] w-full items-end overflow-hidden bg-primary">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/home/interlude.webp"
          alt="Practitioners in a sunrise Classical Hatha Yoga session, mountains softening into the distance."
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-primary/45 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-primary/85 via-primary/25 to-transparent" />

        <div className="relative mx-auto w-full max-w-6xl px-6 pb-20 sm:px-8 md:pb-24">
          <RevealOnScroll>
            <span className="mb-5 block text-[0.78rem] uppercase tracking-[0.22em] text-inverse/75">
              Live Online Programs
            </span>
            <h1 className="max-w-3xl font-serif text-[clamp(2rem,5vw,3.75rem)] font-normal leading-[1.05] tracking-[-0.02em] text-inverse">
              Learn Classical Hatha Yoga from Anywhere.
            </h1>
            <p className="mt-6 max-w-xl text-body-lg leading-relaxed text-inverse/85">
              Authentic live online sessions, offered by certified Classical Hatha Yoga
              teachers — the same practice, the same attention, wherever you are.
            </p>
            <div className="mt-9">
              <RegisterButton />
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* WHY ONLINE */}
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

      {/* AVAILABLE PROGRAMS — GENERAL */}
      <Section tone="bg-alt" width="wide">
        <RevealOnScroll className="mb-12">
          <span className="eyebrow eyebrow--tick mb-4">Available Programs</span>
          <h2 className="text-balance text-h2">Choose where to begin.</h2>
          <p className="prose-measure mt-4 text-body-lg text-secondary">
            Each program is conducted live in small batches. Beginners are always welcome —
            start with an Introduction, or step straight into the practice that calls to you.
          </p>
        </RevealOnScroll>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {generalPrograms.map((program) => (
            <li key={program.slug} className="relative">
              <ProgramCard program={program} formPath="/online-programs/register" />
            </li>
          ))}
        </ul>
      </Section>

      {/* CORPORATE PROGRAMS — separated */}
      <Section tone="bg" width="wide">
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
            <li key={program.slug} className="relative">
              <ProgramCard program={program} formPath="/online-programs/corporate" />
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand
        title="Begin your practice, live from anywhere."
        text="Register in a few minutes. Our team will follow up by email with your batch details and next steps."
      >
        <RegisterButton />
      </CtaBand>
    </>
  );
}
