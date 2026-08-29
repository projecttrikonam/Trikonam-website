/**
 * Upcoming at Trikonam (2026 refinement) — SINGLE SOURCE OF TRUTH for the homepage
 * "Upcoming" section.
 *
 * The homepage does NOT list the full online catalogue. It shows only what is actually
 * scheduled right now, so the section reads as "what's happening at Trikonam" rather
 * than a directory. To change what the homepage advertises, edit `upcomingPrograms`
 * below — add, remove, or reorder entries. The homepage architecture is driven entirely
 * by this array and makes no assumptions about how many items it holds.
 *
 * `community` is kept separate: the 7-minute meditation is a standing, free community
 * practice, not a scheduled workshop, and is presented differently.
 */

export type ProgramMode = 'in-person' | 'online';

export interface UpcomingProgram {
  /** Stable key. */
  slug: string;
  /** Primary name shown on the card. */
  name: string;
  /** Optional English gloss for a Sanskrit name (e.g. "Introduction"). */
  gloss?: string;
  mode: ProgramMode;
  /** Short structural line, e.g. "4 days · 4 sessions" or "3 days". */
  meta: string;
  /** Where it is held (in-person only). */
  location?: string;
  /** One or two calm sentences. */
  description: string;
  /** What to say when someone taps "I'm Interested" — used to prefill WhatsApp. */
  interest: string;
}

export const upcomingPrograms: UpcomingProgram[] = [
  {
    slug: 'yogasanas',
    name: 'Yogasanas',
    mode: 'in-person',
    meta: '4 days · 4 sessions · In person',
    location: 'Sainikpuri, Hyderabad',
    description:
      'The classical asana system, taught in person over four sessions — held postures that bring stability, alignment, and a settled quality to the body. Learnt directly under a teacher’s eye.',
    interest: 'the in-person Yogasanas program (4 days) at Sainikpuri, Hyderabad',
  },
  {
    slug: 'surya-practices',
    name: 'Surya Practices',
    mode: 'in-person',
    meta: '4 days · 4 sessions · In person',
    location: 'Sainikpuri, Hyderabad',
    description:
      'A four-session in-person introduction to the Surya practices — a complete, structured sequence that builds warmth, vitality, and steadiness in the system.',
    interest: 'the in-person Surya Practices program (4 days) at Sainikpuri, Hyderabad',
  },
  {
    slug: 'arambha',
    name: 'Ārambha',
    gloss: 'Introduction',
    mode: 'online',
    meta: '3 days',
    description:
      'A three-day introductory journey online — a first meeting with the practice, together with a simple kriya and meditation to settle the body and quieten the mind.',
    interest: 'Ārambha — the 3-day online introduction',
  },
  {
    slug: 'adhara',
    name: 'Ādhāra',
    gloss: 'Foundation',
    mode: 'online',
    meta: '8 days',
    description:
      'An eight-day online foundation — a structured beginning that builds familiarity with the practices and helps a steady daily rhythm take shape.',
    interest: 'Ādhāra — the 8-day online foundation',
  },
];

export interface CommunityPractice {
  slug: string;
  name: string;
  meta: string;
  description: string;
  interest: string;
}

export const communityPractice: CommunityPractice = {
  slug: 'seven-minutes-together',
  name: '7 Minutes Together',
  meta: 'Daily · Community practice',
  description:
    'A simple daily meditation held together as a community. Seven minutes. One quiet commitment, kept in company rather than alone.',
  interest: 'the 7 Minutes Together community meditation',
};
