/**
 * Programs (Handoff §6.6 & §7.3, plus client revisions).
 *
 * The Foundational Hatha Yoga Programs section was removed at the client's request.
 * Group minimums are woven in per category (workshops 10, children 7, retreats 10,
 * online & offline 10). Private one-to-one sessions have no minimum. No prices,
 * schedules, or durations are stated — none were provided.
 *
 * Registrable sections use "Register Now". The two enquiry-gated offerings
 * (Corporate, Schools & Colleges) live on their own pages and use "Enquire Now".
 */

export interface ProgramSection {
  /** Anchor id used on the /programs hub page. */
  id: string;
  title: string;
  body: string[];
  /** Optional short line about the minimum group size. */
  minimum?: string;
  image?: string;
  imageAlt?: string;
}

export const programSections: ProgramSection[] = [
  {
    id: 'workshops',
    title: 'Group Workshops',
    body: [
      'From time to time we hold focused workshops for communities and organisations — a way to experience these practices together, in a shared and unhurried setting.',
      'Each workshop keeps the same emphasis on authenticity and individual attention that runs through everything we teach.',
    ],
    minimum: 'Conducted for groups of ten or more.',
  },
  {
    id: 'private-sessions',
    title: 'Private (One-to-One) Sessions',
    body: [
      'For those who prefer individual guidance, we offer one-to-one sessions where the practice can be met to a person’s own pace, body, and needs.',
      'This close attention makes private sessions well suited to anyone with specific considerations or a wish to go more deeply at their own rhythm.',
    ],
    image: '/images/programs/private-sessions/private.webp',
    imageAlt: 'A teacher in white gives warm one-to-one guidance to a student in a calm studio.',
  },
  {
    id: 'children',
    title: 'Children’s Programs',
    body: [
      'We conduct Classical Hatha Yoga programs adapted for children — gentle, age-appropriate, and grounded in the same classical tradition.',
      'The intention is to offer young practitioners a calm, steady practice they can carry with them as they grow.',
    ],
    minimum: 'Conducted for groups of seven or more.',
    image: '/images/programs/children/children.webp',
    imageAlt: 'Children seated in quiet meditation on mats, mountains in the distance.',
  },
  {
    id: 'retreats',
    title: 'Retreats',
    body: [
      'Our retreats offer time away from the pace of everyday life — space to practice, rest, and return to oneself in a quieter setting.',
      'They are designed to let the practice settle more fully, without the interruptions of the ordinary day.',
    ],
    minimum: 'Conducted for groups of ten or more.',
    image: '/images/programs/retreats/retreats.webp',
    imageAlt: 'A group seated in a circle around a fire at dusk, mountains beyond, on retreat.',
  },
  {
    id: 'online-offline',
    title: 'Online & Offline Classes',
    body: [
      'Offline classes are held in person at our locations across Andhra Pradesh and Telangana. Online classes are conducted live, with the same attentive guidance, from wherever you are.',
      'Both offer the same authentic instruction — the setting changes, the integrity of the practice does not.',
    ],
    minimum: 'Conducted for groups of ten or more.',
    image: '/images/programs/online/online.webp',
    imageAlt: 'A practitioner in an online Classical Hatha Yoga session.',
  },
];

/** The two enquiry-gated callouts shown at the foot of the Programs hub. */
export const programCallouts = [
  {
    href: '/programs/corporate',
    title: 'Corporate Wellness',
    excerpt:
      'A specially structured program for workplace settings, addressing stress and the pressures of work.',
  },
  {
    href: '/programs/schools-colleges',
    title: 'Schools & Colleges',
    excerpt:
      'A specially structured program for students, addressing exam pressure, deadlines, and academic stress.',
  },
];
