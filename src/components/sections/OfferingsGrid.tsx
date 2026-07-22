import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';

/**
 * "What We Offer" (Handoff §6.1 item 3) — an editorial index (Aesop / Aman style):
 * numbered rows separated by faded hairlines, with a moss wash and arrow that resolve
 * on hover. Deliberately typographic and image-free, both for restraint and so no photo
 * is repeated from its destination page (client requirement). The breadth of offerings
 * quietly demonstrates the "everyone" audience (§2.6).
 */
const offerings = [
  { title: 'Individual Practices', href: '/practices', text: 'The Classical Hatha Yoga practices, each introduced on its own.' },
  { title: 'Meditation & Pranayama', href: '/practices#meditation-pranayama', text: 'Guided stillness and conscious breath, woven through our practices.' },
  { title: 'Workshops', href: '/programs#workshops', text: 'Focused sessions for communities and organisations.' },
  { title: 'Private Sessions', href: '/programs#private-sessions', text: 'One-to-one guidance, met to your own pace and body.' },
  { title: "Children's Programs", href: '/programs#children', text: 'Gentle, age-appropriate practice grounded in the classical tradition.' },
  { title: 'Retreats', href: '/programs#retreats', text: 'Time away to practice, rest, and return to oneself.' },
  { title: 'Corporate Wellness', href: '/programs/corporate', text: 'A structured program for workplace stress and pressure.' },
  { title: 'Schools & Colleges', href: '/programs/schools-colleges', text: 'For students meeting exam pressure, deadlines, and academic stress.' },
];

export function OfferingsGrid() {
  return (
    <Section tone="bg-alt" width="wide">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        {/* Heading — held to the left as a sticky editorial column on large screens. */}
        <div className="lg:col-span-4">
          <RevealOnScroll className="lg:sticky lg:top-28">
            <span className="eyebrow eyebrow--tick mb-5">What We Offer</span>
            <h2 className="text-balance text-h2">
              For individuals, groups, institutions, and communities.
            </h2>
            <p className="prose-measure mt-5 text-body text-secondary">
              One practice, offered in many settings — the integrity of it never changes,
              only where and how it is met.
            </p>
          </RevealOnScroll>
        </div>

        {/* The index */}
        <ul className="lg:col-span-8">
          {offerings.map((o, i) => (
            <RevealOnScroll as="li" key={o.title} delay={(i % 8) * 0.03}>
              <Link
                href={o.href}
                className="group relative flex items-baseline gap-5 border-t border-border py-6 sm:gap-8 sm:py-7"
              >
                <span className="pointer-events-none absolute inset-x-[-1.25rem] inset-y-0 -z-0 origin-left scale-x-0 rounded-[8px] bg-bg/70 opacity-0 transition-all duration-500 ease-calm group-hover:scale-x-100 group-hover:opacity-100" />
                <span className="relative w-8 shrink-0 font-sans text-fine tabular-nums tracking-widest text-moss/70">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="relative flex-1">
                  <span className="block font-serif text-[1.5rem] leading-tight text-primary transition-transform duration-500 ease-calm group-hover:translate-x-1 sm:text-[1.75rem]">
                    {o.title}
                  </span>
                  <span className="mt-1 block max-w-md text-body text-secondary">{o.text}</span>
                </span>
                <span
                  aria-hidden
                  className="relative mt-2 shrink-0 text-moss opacity-0 transition-all duration-500 ease-calm group-hover:translate-x-1 group-hover:opacity-100"
                >
                  <svg width="26" height="14" viewBox="0 0 26 14" fill="none">
                    <path d="M1 7h23M19 1l6 6-6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            </RevealOnScroll>
          ))}
          <li className="border-t border-border" aria-hidden />
        </ul>
      </div>
    </Section>
  );
}
