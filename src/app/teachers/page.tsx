import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { PageHeader } from '@/components/ui/PageHeader';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import { TeacherGrid } from '@/components/sections/TeacherGrid';
import { SadhguruQuote } from '@/components/sections/SadhguruQuote';
import { quotes } from '@/content/quotes';

import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Meet the Teachers',
  description:
    'Trikonam’s teachers are certified Classical Hatha Yoga instructors, trained over 1,750 hours at Sadhguru Gurukulam and accredited by the Ministry of AYUSH.',
  path: '/teachers',
});

/**
 * Meet the Teachers (Handoff §6.3, v1.1 finalized). Each card links through to a full
 * bio at /teachers/[slug]. The credentials paragraph and the gurukulam training image
 * establish the teachers' authenticity. No photo is captioned with a name until
 * confirmed (§14.5).
 */
export default function TeachersPage() {
  return (
    <>
      <Section tone="bg" width="wide">
        <PageHeader
          eyebrow="Meet the Teachers"
          title="The people who safeguard the path, and guide each person along it."
          intro="Trikonam is not defined by individual teachers, but by a shared commitment to the practice itself. It is a growing community of Classical Hatha Yoga teachers united by one intention—to offer these timeless yogic sciences in their authentic form, with humility, sincerity, and deep respect for the tradition. Every teacher brings their own journey and presence. What unites them is the aspiration to create the conditions in which the practice can do its work."
        />
      </Section>

      {/* Credentials + gurukulam training image. */}
      <Section tone="bg-alt" width="wide" className="pt-0 md:pt-0">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <RevealOnScroll>
            <ResponsiveImage
              src="/images/teachers/training.webp"
              alt="Trainees seated in rows at Sadhguru Gurukulam during a Classical Hatha Yoga teacher-training session."
              aspect="aspect-[4/3]"
              sizes="(min-width: 768px) 45vw, 100vw"
            />
          </RevealOnScroll>
          <RevealOnScroll delay={0.05}>
            <span className="eyebrow eyebrow--tick mb-5">Certified & Accredited</span>
            <div className="prose-measure space-y-4 text-body-lg text-secondary">
              <p>
                Our teachers are certified Classical Hatha Yoga instructors who have
                completed over 1,750 hours of intensive residential training at Sadhguru
                Gurukulam. The Gurukulam is established under the aegis of Isha Foundation
                and accredited by the Yoga Certification Board, Ministry of AYUSH,
                Government of India.
              </p>
              <p>
                With 5–7 years of dedicated teaching experience, they have offered
                authentic Classical Hatha Yoga across schools, universities, corporate
                organizations, communities, wellness centers, and private programs.
                Rooted in the classical yogic tradition, they are committed to sharing
                these time-tested practices with sincerity, creating a space where every
                individual can cultivate physical wellbeing, mental clarity, emotional
                balance, and inner transformation.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </Section>

      <Section tone="bg" width="wide">
        <RevealOnScroll className="mb-12">
          <span className="eyebrow eyebrow--tick mb-4">Our Teachers</span>
          <h2 className="text-h2">One lineage. Many teachers. One intention.</h2>
          <p className="mt-3 text-body-lg text-secondary">
            A growing community of Classical Hatha Yoga teachers.
          </p>
        </RevealOnScroll>
        <TeacherGrid />
      </Section>

      {/* Sadhguru — grace through maturity and balance. */}
      <SadhguruQuote quote={quotes.grace} tone="light" />
    </>
  );
}
