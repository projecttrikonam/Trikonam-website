import type { Metadata } from 'next';
import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { PageHeader } from '@/components/ui/PageHeader';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import { BreathDivider } from '@/components/ui/BreathDivider';
import { RegisterButton } from '@/components/ui/RegisterButton';
import { programSections, programCallouts } from '@/content/programs';
import { siteConfig } from '@/content/site-config';

import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Offline Programs',
  description:
    'In-person Classical Hatha Yoga across Andhra Pradesh & Telangana — workshops, private sessions, children’s programs, and retreats. Looking to learn online? See our live Online Programs.',
  path: '/programs',
});

// The offline Programs page keeps its own "Register Now" pointing at the existing
// Google registration form (v2.0 repointed the global default to online registration).
const OFFLINE_REGISTER = siteConfig.forms.register;

/**
 * Programs hub (Handoff §6.6, client-revised). Same-page anchored sections. Each
 * registrable section carries a Register Now CTA and, where relevant, its group
 * minimum. Two enquiry-gated callouts (Corporate, Schools & Colleges) sit at the foot,
 * followed by an invitation to bring friends for a group discount.
 */
export default function ProgramsHubPage() {
  return (
    <>
      <Section tone="bg" width="wide">
        <PageHeader
          eyebrow="Offline Programs"
          title="Ways to begin, and to keep going."
          intro="Our in-person programs are conducted with the same emphasis on authenticity, safety, and individual attention. Choose the setting that suits you — the integrity of the practice stays the same throughout. Prefer to learn live from home? Explore our Online Programs."
        />
      </Section>

      {programSections.map((section, i) => (
        <Section
          key={section.id}
          id={section.id}
          tone={i % 2 === 0 ? 'bg-alt' : 'bg'}
          width="wide"
          className="scroll-mt-24"
        >
          <div
            className={`grid items-center gap-10 ${
              section.image ? 'md:grid-cols-2 md:gap-16' : ''
            }`}
          >
            <RevealOnScroll className={section.image && i % 2 === 0 ? 'md:order-2' : ''}>
              <span className="eyebrow eyebrow--tick mb-4">Program</span>
              <h2 className="text-balance text-h2">{section.title}</h2>
              <div className="prose-measure mt-5 space-y-4 text-body-lg text-secondary">
                {section.body.map((para) => (
                  <p key={para}>{para}</p>
                ))}
              </div>
              {section.minimum && (
                <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-[0.82rem] tracking-wide text-secondary">
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-moss" />
                  {section.minimum}
                </p>
              )}
              <div className="mt-7">
                <RegisterButton href={OFFLINE_REGISTER} external />
              </div>
            </RevealOnScroll>

            {section.image && (
              <RevealOnScroll className={i % 2 === 0 ? 'md:order-1' : ''}>
                <ResponsiveImage
                  src={section.image}
                  alt={section.imageAlt ?? ''}
                  aspect="aspect-[4/3]"
                  contain
                  sizes="(min-width: 768px) 45vw, 100vw"
                />
              </RevealOnScroll>
            )}
          </div>
        </Section>
      ))}

      <BreathDivider className="py-4" />

      {/* Enquiry-gated callouts (Handoff §6.6 foot). These use Enquire, not Register. */}
      <Section tone="bg" width="wide" className="pt-6">
        <RevealOnScroll className="mb-10 text-center">
          <span className="eyebrow eyebrow--tick mx-auto mb-4 w-fit">Tailored Programs</span>
          <h2 className="text-h2">Individually scoped, by enquiry.</h2>
        </RevealOnScroll>
        <ul className="grid gap-6 md:grid-cols-2">
          {programCallouts.map((c) => (
            <RevealOnScroll as="li" key={c.href}>
              <Link
                href={c.href}
                className="group flex h-full flex-col rounded-[10px] surface-elevated p-8 ring-1 ring-black/[0.04] transition-all duration-500 hover:-translate-y-1 hover:shadow-lift focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <h3 className="font-serif text-h3 text-primary">{c.title}</h3>
                <p className="mt-3 flex-1 text-body-lg text-secondary">{c.excerpt}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-[0.9rem] font-medium text-moss">
                  Enquire
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </Link>
            </RevealOnScroll>
          ))}
        </ul>
      </Section>

      {/* Bring-a-friend invitation — group registrations, shared discount. */}
      <Section tone="bg-alt" width="default" className="text-center">
        <RevealOnScroll className="relative mx-auto max-w-2xl">
          <span className="eyebrow eyebrow--tick mx-auto mb-5 w-fit">Practice Together</span>
          <h2 className="text-balance font-serif text-[clamp(1.38rem,2.7vw,2.05rem)] leading-[1.25] text-primary">
            Begin together, and go further.
          </h2>
          <p className="prose-measure mx-auto mt-5 text-body-lg text-secondary">
            Practice deepens in good company. Bring your friends or family along and your
            whole group enjoys a special discount — a small thank-you for sharing these
            practices, and a gentle way to encourage others to begin their own.
          </p>
          <div className="mt-8 flex justify-center">
            <RegisterButton label="Register Your Group" href={OFFLINE_REGISTER} external />
          </div>
        </RevealOnScroll>
      </Section>
    </>
  );
}
