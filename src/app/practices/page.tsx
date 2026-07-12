import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { PageHeader } from '@/components/ui/PageHeader';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { PracticeGrid } from '@/components/sections/PracticeGrid';
import { SadhguruQuote } from '@/components/sections/SadhguruQuote';
import { CtaBand } from '@/components/sections/CtaBand';
import { Button } from '@/components/ui/Button';
import { RegisterButton } from '@/components/ui/RegisterButton';
import { quotes } from '@/content/quotes';

import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Classical Hatha Yoga',
  description:
    'The Classical Hatha Yoga practices taught at Trikonam — structured by Sadhguru and preserved in their original form, from Upa-Yoga to Pregnancy Yoga, with meditation and pranayama.',
  path: '/practices',
});

/**
 * Classical Hatha Yoga hub (Handoff §6.4, client-revised). Heading no longer states a
 * count; the intro is drawn from Isha's Hatha Yoga material in Trikonam's own words and
 * notes that the practices are structured by Sadhguru. Includes a dedicated
 * Meditation & Pranayama section (client-supplied copy).
 */
export default function PracticesHubPage() {
  return (
    <>
      <Section tone="bg" width="wide">
        <PageHeader
          eyebrow="Classical Hatha Yoga"
          title="A complete path, kept intact and offered in its original form."
          intro="Classical Hatha Yoga is not about fitness or flexibility. It is a way of preparing the body and the whole system so that it can hold higher levels of energy — bringing body, mind, breath, and inner nature into a single, balanced alignment. The practices we teach are structured by Sadhguru and offered exactly as they have been passed down through an unbroken lineage — from Shiva, the first yogi, to the Saptarishis, and later systematized by Patanjali in the Yoga Sutras. Each is a carefully composed process, not a matter of performance. Below is an honest introduction to each."
        />
        <div className="mt-16">
          <PracticeGrid />
        </div>
      </Section>

      {/* Sadhguru — the complete path. */}
      <SadhguruQuote quote={quotes.completePath} tone="dark" />

      {/* Meditation & Pranayama (client-supplied copy). */}
      <Section id="meditation-pranayama" tone="bg" width="narrow" className="scroll-mt-24">
        <div>
          <RevealOnScroll>
            <span className="eyebrow eyebrow--tick mb-5">Meditation & Pranayama</span>
            <h2 className="text-balance text-h2">Stillness, and the conscious breath.</h2>
            <div className="prose-measure mt-6 space-y-4 text-body-lg text-secondary">
              <p>
                Meditation is not about escaping life—it is about experiencing it with
                absolute clarity. As the mind settles and awareness deepens, one
                naturally begins to perceive life beyond the compulsions of thought and
                emotion. In that stillness, peace is not something to be achieved; it
                becomes your very nature.
              </p>
              <p>
                Pranayama is the conscious regulation of the breath to bring balance to
                the body, mind, and energies. Breath is the bridge between the physical
                and the subtle dimensions of our existence. Through simple yet profound
                yogic practices, pranayama enhances vitality, steadies the mind, improves
                emotional balance, and prepares one for deeper states of meditation.
                Together, meditation and pranayama create a strong foundation for a life
                of balance, joy, and inner wellbeing. This reflects a central theme in
                classical yoga: inner transformation comes through cultivating the right
                inner conditions, rather than forcing the mind.
              </p>
              <p className="text-primary">
                We offer guided meditations and pranayama as part of other practices to
                deepen your experience.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </Section>

      {/* Ways to Learn (v2.0) — the bridge to the offline and online gateways. */}
      <Section tone="bg-alt" width="narrow">
        <RevealOnScroll>
          <span className="eyebrow eyebrow--tick mb-4">Ways to Learn</span>
          <h2 className="text-balance text-h2">Meet the practice in the way that suits you.</h2>
          <p className="prose-measure mt-5 text-body-lg text-secondary">
            Classical Hatha Yoga can be experienced through a variety of learning formats,
            depending on your schedule, goals, and stage of practice. Whether you are
            looking for immersive workshops, private sessions, retreats, children’s
            offerings, or live online programs, each format preserves the authenticity of
            these timeless yogic sciences while making them accessible to a wider community.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/online-programs">Explore Online Programs</Button>
            <Button href="/programs" variant="secondary">Explore Offline Programs</Button>
          </div>
        </RevealOnScroll>
      </Section>

      <CtaBand
        title="Begin where you are."
        text="No prior experience is needed. Register for a program or workshop and take the first step."
      >
        <RegisterButton />
      </CtaBand>
    </>
  );
}
