/**
 * Online Programs (Trikonam — 2026 refinement) — SINGLE SOURCE OF TRUTH for the Online
 * Programs page and the registration dropdowns.
 *
 * The offering is now framed as a set of *journeys* by duration, not by the individual
 * practices inside them. The cards deliberately do not list "Upa-Yoga + Pranayama +
 * Meditation …" — the specific practices are explained after someone expresses interest,
 * in conversation. Five duration-based journeys come first, then five themed single
 * sessions.
 *
 * Every action opens WhatsApp (see src/lib/whatsapp.ts). There is no checkout: batches
 * are small and formed by conversation.
 */

export type ProgramGroup = 'journey' | 'themed';

export interface OnlineProgram {
  /** Stable slug — also used for ?program= prefill on the registration form. */
  slug: string;
  name: string;
  /** English gloss for a Sanskrit name (journeys only). */
  gloss?: string;
  /** e.g. "3 Days", "1 Month", "1 Session · 1 Hour". */
  duration: string;
  /** Display price, e.g. "₹500". Omitted where a price is not fixed. */
  price?: string;
  /** One calm line — the journey, not its contents. */
  blurb: string;
  group: ProgramGroup;
}

/** Why learn online — unchanged (Online Programs §Why Online). DO NOT edit. */
export const whyOnline: { title: string; text: string }[] = [
  {
    title: 'Learn from anywhere',
    text: 'Join live from home, wherever you are in the world — no travel, no studio required.',
  },
  {
    title: 'Live, interactive sessions',
    text: 'Practise in real time with a teacher who can see you, guide you, and answer your questions.',
  },
  {
    title: 'Small batches',
    text: 'Groups are kept small, so each person receives genuine, personal attention.',
  },
  {
    title: 'Authentic teaching',
    text: 'Classical Hatha Yoga offered exactly as it has been preserved — never diluted for a screen.',
  },
  {
    title: 'Certified teachers',
    text: 'Every session is guided by teachers trained and certified at Sadhguru Gurukulam.',
  },
];

/** The five duration-based journeys, in order. */
export const journeyPrograms: OnlineProgram[] = [
  {
    slug: 'arambha',
    name: 'Ārambha',
    gloss: 'Introduction',
    duration: '3 Days',
    price: '₹500',
    blurb: 'A gentle first meeting with the practice.',
    group: 'journey',
  },
  {
    slug: 'adhara',
    name: 'Ādhāra',
    gloss: 'Foundation',
    duration: '8 Days',
    price: '₹1,000',
    blurb:
      'A structured beginning for building familiarity with practice and creating a steady rhythm.',
    group: 'journey',
  },
  {
    slug: 'abhyasa',
    name: 'Abhyāsa',
    gloss: 'Practice',
    duration: '15 Days',
    price: '₹2,300',
    blurb:
      'Two weeks of guided practice, designed to help you move beyond simply starting and towards a more consistent sadhana.',
    group: 'journey',
  },
  {
    slug: 'sadhana',
    name: 'Sādhanā',
    gloss: 'Discipline',
    duration: '21 Days',
    price: '₹2,800',
    blurb:
      'A three-week journey of guided practice, consistency, and deeper involvement, supported by a community practising together.',
    group: 'journey',
  },
  {
    slug: 'anubhava',
    name: 'Anubhava',
    gloss: 'Experience',
    duration: '1 Month',
    price: '₹3,500',
    blurb:
      'A month of sustained practice, guidance, and community support, for those ready to make yoga a more regular part of their lives.',
    group: 'journey',
  },
];

/** Themed single sessions, kept after the journeys. */
export const themedPrograms: OnlineProgram[] = [
  {
    slug: 'healthy-eating',
    name: 'Healthy Eating',
    duration: '1 Session · 1 Hour',
    blurb: 'A yogic perspective on food — eating in a way that leaves the body light and at ease.',
    group: 'themed',
  },
  {
    slug: 'health-and-immunity',
    name: 'Health & Immunity',
    duration: '1 Session · 1 Hour 15 Minutes',
    blurb: 'A morning practice to strengthen the system and support natural immunity.',
    group: 'themed',
  },
  {
    slug: 'stress-relief',
    name: 'Stress Relief',
    duration: '1 Session · 1 Hour 15 Minutes',
    blurb: 'A midday pause to release tension and return to a calmer, clearer state.',
    group: 'themed',
  },
  {
    slug: 'relaxation',
    name: 'Relaxation',
    duration: '1 Session · 1 Hour 15 Minutes',
    blurb: 'An evening practice to unwind the body and let the day settle into rest.',
    group: 'themed',
  },
  {
    slug: 'meditation-for-mental-health',
    name: 'Meditation for Mental Health',
    duration: '1 Session · 45 Minutes',
    blurb: 'A guided meditation to steady the mind and support emotional wellbeing.',
    group: 'themed',
  },
];

/** All general online programmes in display order (journeys, then themed). */
export const generalPrograms: OnlineProgram[] = [...journeyPrograms, ...themedPrograms];

/** Corporate online programmes — shown separately (Online Programs §Corporate). */
export const corporatePrograms: OnlineProgram[] = [
  {
    slug: 'online-yoga-for-corporate',
    name: 'Online Yoga for Corporate',
    duration: '16 Sessions · 45 Minutes',
    blurb:
      'A structured series for teams — reducing stress and building steadiness through the working week.',
    group: 'themed',
  },
  {
    slug: 'yoga-for-success',
    name: 'Yoga for Success',
    duration: '1 Session · 45 Minutes',
    blurb: 'A focused session on clarity, energy, and composure for high-performing workplaces.',
    group: 'themed',
  },
];

/**
 * Preferred batch options for the registration form. The final option is a sentinel
 * that reveals a free-text field ("specify a suitable time").
 */
export const batchOptions = [
  'Morning · 6:00–7:00',
  'Noon · 11:30–12:30',
  'Evening · 6:30–7:30',
] as const;

/** Sentinel value for the "specify your own time" batch choice. */
export const BATCH_CUSTOM = 'Or specify a suitable time';

export const getOnlineProgram = (slug: string): OnlineProgram | undefined =>
  [...generalPrograms, ...corporatePrograms].find((p) => p.slug === slug);
