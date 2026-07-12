/**
 * Online Programs (Trikonam v2.0) — the live online offerings and their registration
 * metadata. SINGLE SOURCE OF TRUTH for the Online Programs page, the registration
 * dropdown, and the corporate enquiry dropdown, so a programme's name is written once
 * and stays consistent everywhere (mirrors the convention in practices.ts / programs.ts).
 *
 * No prices are stated (none provided; payment links are sent manually after
 * registration — see docs/apps-script/README.md).
 */

export interface OnlineProgram {
  /** Stable slug — used for ?program= prefill on the registration form. */
  slug: string;
  name: string;
  /** e.g. "1 Session", "7 Sessions". */
  sessions: string;
  /** e.g. "45 Minutes", "1 Hour", "1 Hour 15 Minutes". */
  duration: string;
  /** Optional time-of-day label shown as a small chip (Morning / Noon / Evening). */
  timeOfDay?: string;
  /** One calm line for the card. */
  blurb: string;
}

/** Why learn online — the advantages, each a short line (Online Programs §Why Online). */
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

/** General online programmes — the nine offerings (Online Programs §General). */
export const generalPrograms: OnlineProgram[] = [
  {
    slug: 'introduction',
    name: 'Introduction',
    sessions: '1 Session',
    duration: '45 Minutes',
    blurb: 'A gentle first meeting with Classical Hatha Yoga and the way we practise together online.',
  },
  {
    slug: 'kriya-and-meditation',
    name: 'Kriya and Meditation',
    sessions: '1 Session',
    duration: '1 Hour',
    blurb: 'An introduction to a simple kriya and meditation, to settle the body and quieten the mind.',
  },
  {
    slug: 'yoga-for-wellbeing',
    name: 'Yoga for Wellbeing',
    sessions: '7 Sessions',
    duration: '1 Hour',
    blurb: 'A week-long journey through foundational practices for steady health and inner balance.',
  },
  {
    slug: 'upa-yoga',
    name: 'Upa Yoga',
    sessions: '4 Sessions',
    duration: '1 Hour',
    blurb: 'Simple, effective practices to activate the joints, muscles, and energy system.',
  },
  {
    slug: 'healthy-eating',
    name: 'Healthy Eating',
    sessions: '1 Session',
    duration: '1 Hour',
    blurb: 'A yogic perspective on food — eating in a way that leaves the body light and at ease.',
  },
  {
    slug: 'yoga-for-health-and-immunity',
    name: 'Yoga for Health & Immunity',
    sessions: '1 Session',
    duration: '1 Hour 15 Minutes',
    timeOfDay: 'Morning',
    blurb: 'A morning practice to strengthen the system and support natural immunity.',
  },
  {
    slug: 'yoga-for-stress-relief',
    name: 'Yoga for Stress Relief',
    sessions: '1 Session',
    duration: '1 Hour 15 Minutes',
    timeOfDay: 'Noon',
    blurb: 'A midday pause to release tension and return to a calmer, clearer state.',
  },
  {
    slug: 'yoga-for-relaxation',
    name: 'Yoga for Relaxation',
    sessions: '1 Session',
    duration: '1 Hour 15 Minutes',
    timeOfDay: 'Evening',
    blurb: 'An evening practice to unwind the body and let the day settle into rest.',
  },
  {
    slug: 'meditation-for-mental-health',
    name: 'Meditation for Mental Health',
    sessions: '1 Session',
    duration: '45 Minutes',
    blurb: 'A guided meditation to steady the mind and support emotional wellbeing.',
  },
];

/** Corporate online programmes — shown separately (Online Programs §Corporate). */
export const corporatePrograms: OnlineProgram[] = [
  {
    slug: 'online-yoga-for-corporate',
    name: 'Online Yoga for Corporate',
    sessions: '16 Sessions',
    duration: '45 Minutes',
    blurb: 'A structured series for teams — reducing stress and building steadiness through the working week.',
  },
  {
    slug: 'yoga-for-success',
    name: 'Yoga for Success',
    sessions: '1 Session',
    duration: '45 Minutes',
    blurb: 'A focused session on clarity, energy, and composure for high-performing workplaces.',
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
