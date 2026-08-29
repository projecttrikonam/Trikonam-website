/**
 * The Trikonam Practice Assessment → Practice Compass (2026 refinement).
 *
 * A ten-question self-enquiry that helps a visitor understand where their practice might
 * begin. It is NOT a health score and NOT a diagnosis. The result is a "Practice
 * Compass": a theme to begin with, one practice to explore, one Trikonam journey that
 * may suit, and a standing community practice.
 *
 * `computeCompass()` is a pure, deterministic function — the mapping from answers to a
 * recommendation is written out in full here, never random. It only ever recommends
 * practices and programs Trikonam actually offers, and it respects the online / in-person
 * boundary (some Classical Hatha Yoga practices are in-person only — see
 * docs / brief Part 9).
 */

import { journeyPrograms } from './online-programs';
import { whatsappUrl } from '@/lib/whatsapp';

export interface AssessmentOption {
  value: string;
  label: string;
}

export interface AssessmentQuestion {
  id: string;
  title: string;
  /** Small note under the question (e.g. the Q6 disclaimer). */
  help?: string;
  /** True for the "select all that apply" question. */
  multi?: boolean;
  options: AssessmentOption[];
}

export type AnswerMap = Record<string, string | string[] | undefined>;

// --------------------------------------------------------------------------
// The ten questions (wording from the brief, verbatim).
// --------------------------------------------------------------------------
export const questions: AssessmentQuestion[] = [
  {
    id: 'q1',
    title: 'Where are you with yoga?',
    options: [
      { value: 'new', label: "I'm completely new to yoga" },
      { value: 'occasional', label: "I've explored yoga occasionally" },
      { value: 'regular', label: 'I have some regular practice' },
      { value: 'longtime', label: "I've been practising for some time" },
      {
        value: 'other-forms',
        label: "I've explored different forms of yoga but want to understand Classical Hatha Yoga",
      },
    ],
  },
  {
    id: 'q2',
    title: 'What brings you to Trikonam today?',
    options: [
      { value: 'body', label: 'I want to become more physically capable' },
      { value: 'energy', label: 'I want greater energy and vitality' },
      { value: 'clarity', label: 'I want greater mental clarity and steadiness' },
      { value: 'meditation', label: 'I want to explore meditation and inner wellbeing' },
      { value: 'understand', label: 'I want to understand yoga more deeply' },
      { value: 'begin', label: 'I simply feel that I should begin somewhere' },
    ],
  },
  {
    id: 'q3',
    title: 'How does your body feel in everyday life?',
    options: [
      { value: 'capable', label: 'Comfortable and capable' },
      { value: 'stiff', label: 'Somewhat stiff or inactive' },
      { value: 'energetic-more', label: 'Energetic, but I want to become more capable' },
      { value: 'tension', label: 'I often carry tension in my body' },
      { value: 'disconnected', label: "I don't feel very connected with my body" },
    ],
  },
  {
    id: 'q4',
    title: 'How would you describe your energy through the day?',
    options: [
      { value: 'steady', label: 'Steady and balanced' },
      { value: 'fluctuating', label: 'It rises and falls quite a bit' },
      { value: 'low', label: 'I often feel low on energy' },
      { value: 'restless', label: 'I have plenty of energy but find it difficult to settle' },
      { value: 'unsure', label: "I'm not really sure" },
    ],
  },
  {
    id: 'q5',
    title: 'What usually makes it difficult to maintain a practice?',
    options: [
      { value: 'time', label: 'Finding the time' },
      { value: 'consistency', label: 'Staying consistent' },
      { value: 'what', label: 'Knowing what to practise' },
      { value: 'motivation', label: 'Staying motivated on my own' },
      { value: 'fade', label: 'I start enthusiastically but find it difficult to continue' },
      { value: 'deepen', label: 'Nothing in particular — I want to deepen my existing practice' },
    ],
  },
  {
    id: 'q6',
    title: 'Is there something in your wellbeing you would particularly like your practice to support?',
    help: 'This is not a medical assessment or diagnosis. It simply helps us understand what kind of practice support may be relevant to you.',
    multi: true,
    options: [
      { value: 'physical', label: 'General physical wellbeing' },
      { value: 'mobility', label: 'Stiffness or mobility' },
      { value: 'stress', label: 'Everyday stress or tension' },
      { value: 'sleep', label: 'Sleep and rest' },
      { value: 'energy', label: 'Energy and vitality' },
      { value: 'digestion', label: 'Digestion and eating habits' },
      { value: 'breath', label: 'Breath and respiratory wellbeing' },
      { value: 'mind', label: 'Mental steadiness' },
      { value: 'none', label: 'Nothing in particular' },
      { value: 'private', label: "I'd prefer not to say" },
    ],
  },
  {
    id: 'q7',
    title: 'What would you most enjoy exploring?',
    options: [
      { value: 'movement', label: 'Movement and working with the body' },
      { value: 'breath', label: 'Breath and its possibilities' },
      { value: 'sound', label: 'Sound and chants' },
      { value: 'meditation', label: 'Meditation and stillness' },
      { value: 'combination', label: 'A combination of these' },
      { value: 'unsure', label: "I'm not sure yet" },
    ],
  },
  {
    id: 'q8',
    title: 'What happens when you sit quietly?',
    options: [
      { value: 'settle', label: 'I settle quite naturally' },
      { value: 'active', label: 'My mind remains active' },
      { value: 'restless', label: 'I become restless' },
      { value: 'cannot-sustain', label: 'I enjoy stillness but find it difficult to sustain' },
      { value: 'unexplored', label: "I haven't really explored this yet" },
    ],
  },
  {
    id: 'q9',
    title: 'Where would you most like to experience your practice?',
    options: [
      { value: 'home', label: "I'd like to begin from home — online feels easiest for me right now" },
      {
        value: 'in-person',
        label: "I'd love to learn in person — I value being guided directly by a teacher",
      },
      { value: 'either', label: "I'm open to either — I mainly want to find the right place to begin" },
      {
        value: 'in-person-eventually',
        label: "I'd like to eventually learn in person — but online is a good starting point",
      },
      { value: 'unsure', label: "I'm not sure yet" },
    ],
  },
  {
    id: 'q10',
    title: 'What kind of beginning feels right for you?',
    options: [
      { value: 'short', label: 'A short beginning — I want to experience it first' },
      { value: 'few-days', label: 'A few days of guided practice — I want to start building a rhythm' },
      { value: 'longer', label: 'A longer journey — I want to establish consistency' },
      {
        value: 'deeper',
        label: "A deeper commitment — I'm ready to make practice a regular part of my life",
      },
      { value: 'exploring', label: "I'm still exploring — help me understand where to begin" },
    ],
  },
];

// --------------------------------------------------------------------------
// The Practice Compass result.
// --------------------------------------------------------------------------
export interface CompassPractice {
  name: string;
  note: string;
  href?: string;
}

export interface CompassProgram {
  name: string;
  gloss?: string;
  meta: string;
  price?: string;
  body: string;
  mode: 'online' | 'in-person';
  location?: string;
  href: string;
  /** Pre-filled WhatsApp link for "I'm Interested". */
  whatsappHref: string;
}

export interface CompassResult {
  theme: { title: string; body: string };
  practice: CompassPractice;
  program: CompassProgram;
  /** Shown when the visitor is open to / heading towards in-person learning. */
  alsoInPerson?: { title: string; body: string; whatsappHref: string };
  community: { name: string; body: string; whatsappHref: string };
  /** "Rise & Practise" 5 AM consistency support — offered for the longer journeys. */
  riseAndPractise: boolean;
}

// --- helper data ---------------------------------------------------------
const THEMES: Record<string, { title: string; body: string }> = {
  body: {
    title: 'Meeting the Body',
    body: 'Your responses point to the body as the natural place to begin — building strength, mobility, and a steady, comfortable relationship with it before anything else is asked of you.',
  },
  energy: {
    title: 'Restoring Energy',
    body: 'Your responses suggest that working with the body’s energy — steadying what fluctuates, and letting vitality return — may be the most useful place to begin.',
  },
  mind: {
    title: 'Steadying the Mind',
    body: 'Your responses suggest that a quieter, steadier mind is what you are really looking for. Working with the breath, and then with stillness, is a reliable way in.',
  },
  inward: {
    title: 'Turning Inward',
    body: 'Your responses suggest a readiness for meditation and the inner dimensions of the practice — approached gently, without force or expectation.',
  },
  understand: {
    title: 'Understanding the Practice',
    body: 'Your responses suggest you are drawn to Classical Hatha Yoga itself — its structure and its logic — not only its effects. A foundational journey, learnt in order, will serve that best.',
  },
  rhythm: {
    title: 'Building a Rhythm',
    body: 'Your responses suggest that creating consistency may be the most valuable place to begin. Rather than trying to do too much at once, a simple guided practice and a steady rhythm can help you establish a foundation.',
  },
};

const PRACTICE_NOTES: Record<string, { note: string; href?: string }> = {
  'Upa-Yoga': {
    note: 'Simple, accessible practices that loosen the joints and activate the body’s energy system — a natural, undemanding first step.',
    href: '/practices/upa-yoga',
  },
  'Yoga Namaskar': {
    note: 'A short, complete sequence that gathers the whole body into one flowing practice you can return to each day.',
  },
  Pranayama: {
    note: 'Working consciously with the breath — the most direct way to steady the mind and settle the system.',
  },
  'Nada Yoga': {
    note: 'Practising with sound and chant — an absorbing, accessible way into stillness for those drawn to it.',
  },
  Meditation: {
    note: 'A guided meditation to begin turning the attention inward, without force and without a goal to reach.',
  },
};

const asArray = (v: string | string[] | undefined): string[] =>
  Array.isArray(v) ? v : v ? [v] : [];

// --------------------------------------------------------------------------
// The engine.
// --------------------------------------------------------------------------
export function computeCompass(answers: AnswerMap): CompassResult {
  const q1 = (answers.q1 as string) || 'new';
  const q2 = (answers.q2 as string) || 'begin';
  const q3 = (answers.q3 as string) || '';
  const q4 = (answers.q4 as string) || '';
  const q5 = (answers.q5 as string) || '';
  const q6 = asArray(answers.q6);
  const q7 = (answers.q7 as string) || 'unsure';
  const q8 = (answers.q8 as string) || 'unexplored';
  const q9 = (answers.q9 as string) || 'either';
  const q10 = (answers.q10 as string) || 'exploring';

  const experienced = q1 === 'regular' || q1 === 'longtime' || q1 === 'other-forms';
  const serious = (q10 === 'longer' || q10 === 'deeper') && experienced;

  // --- theme (primarily from Q2) ---------------------------------------
  let themeKey =
    q2 === 'body'
      ? 'body'
      : q2 === 'energy'
        ? 'energy'
        : q2 === 'clarity'
          ? 'mind'
          : q2 === 'meditation'
            ? 'inward'
            : q2 === 'understand'
              ? 'understand'
              : /* begin */ q1 === 'other-forms'
                ? 'understand'
                : 'rhythm';
  // A struggle with consistency gently pulls a vague "just begin" toward rhythm.
  if (q2 === 'begin' && ['consistency', 'fade', 'motivation'].includes(q5)) themeKey = 'rhythm';

  // --- practice to explore (from Q7, constrained to what suits a beginning
  //     at home; an explicit interest is respected, "unsure/combination" is
  //     resolved from the theme and wellbeing goals) ---------------------
  let practiceName: string;
  if (q7 === 'movement') practiceName = 'Upa-Yoga';
  else if (q7 === 'breath') practiceName = 'Pranayama';
  else if (q7 === 'sound') practiceName = 'Nada Yoga';
  else if (q7 === 'meditation') practiceName = 'Meditation';
  else {
    // unsure / combination → derive
    practiceName =
      themeKey === 'mind'
        ? 'Pranayama'
        : themeKey === 'inward'
          ? 'Meditation'
          : themeKey === 'rhythm'
            ? 'Meditation'
            : 'Upa-Yoga';
    if (q6.includes('sleep') || q6.includes('stress') || q6.includes('breath')) practiceName = 'Pranayama';
    else if (q6.includes('mobility')) practiceName = 'Upa-Yoga';
    if (q7 === 'combination') practiceName = 'Upa-Yoga';
  }
  // If someone struggles to sit at all, breath before stillness.
  if (practiceName === 'Meditation' && (q8 === 'restless' || q8 === 'active') && q7 !== 'meditation') {
    practiceName = 'Pranayama';
  }
  const practice: CompassPractice = {
    name: practiceName,
    note: PRACTICE_NOTES[practiceName].note,
    href: PRACTICE_NOTES[practiceName].href,
  };

  // --- journey length (from Q10, upgraded for experienced practitioners) ---
  let journeySlug =
    q10 === 'short' || q10 === 'exploring'
      ? 'arambha'
      : q10 === 'few-days'
        ? 'adhara'
        : q10 === 'longer'
          ? 'abhyasa'
          : /* deeper */ experienced
            ? 'anubhava'
            : 'sadhana';
  // A settled beginner ready for more, but new, still starts with the foundation.
  if (q10 === 'deeper' && q1 === 'new') journeySlug = 'adhara';

  // --- mode --------------------------------------------------------------
  const wantsInPerson = q9 === 'in-person';
  const openToInPerson = q9 === 'either' || q9 === 'unsure' || q9 === 'in-person-eventually';

  let program: CompassProgram;
  let alsoInPerson: CompassResult['alsoInPerson'];

  const themeSentence = ' It gives that a steady, unhurried shape.';

  if (wantsInPerson || (serious && q9 !== 'home')) {
    // In-person workshop as the primary recommendation.
    const suryaLean =
      q2 === 'energy' || q4 === 'low' || q4 === 'fluctuating' || q6.includes('energy');
    const workshop = suryaLean
      ? {
          name: 'Surya Practices',
          href: '/practices/surya-kriya',
          focus: 'a complete sequence that builds warmth, vitality, and steadiness',
        }
      : {
          name: 'Yogasanas',
          href: '/practices/yogasanas',
          focus: 'held classical postures that bring stability, alignment, and ease to the body',
        };
    const body = serious
      ? `A four-session in-person program at Sainikpuri, Hyderabad — ${workshop.focus}, learnt directly under a teacher’s eye. Given your experience and commitment, a group workshop or private one-to-one guidance would suit you well; tell us on WhatsApp and we will help you choose.`
      : `A four-session in-person program at Sainikpuri, Hyderabad — ${workshop.focus}, learnt directly under a teacher’s eye.`;
    program = {
      name: workshop.name,
      meta: '4 days · 4 sessions · In person',
      location: 'Sainikpuri, Hyderabad',
      mode: 'in-person',
      body,
      href: workshop.href,
      whatsappHref: whatsappUrl(
        `Hi Trikonam, I took the Practice Compass and it suggested the in-person ${workshop.name} program (4 days) at Sainikpuri, Hyderabad. I'd like to know more.`,
      ),
    };
  } else {
    // Online journey as the primary recommendation.
    const j = journeyPrograms.find((p) => p.slug === journeySlug)!;
    program = {
      name: j.name,
      gloss: j.gloss,
      meta: `${j.duration} · Online${j.price ? ` · ${j.price}` : ''}`,
      price: j.price,
      mode: 'online',
      body: j.blurb + themeSentence,
      href: '/online-programs',
      whatsappHref: whatsappUrl(
        `Hi Trikonam, I took the Practice Compass and it suggested ${j.name} — the ${j.duration.toLowerCase()} online journey${
          j.price ? ` (${j.price})` : ''
        }. I'd like to know more.`,
      ),
    };
    if (openToInPerson || serious) {
      alsoInPerson = {
        title: 'When you’re ready to be in the room',
        body: 'Yogasanas and the Surya practices are taught in person at Sainikpuri, Hyderabad. Begin online, and step into an in-person workshop — or private one-to-one guidance — when it feels right.',
        whatsappHref: whatsappUrl(
          "Hi Trikonam, I took the Practice Compass. I'd like to begin online but also learn about the in-person workshops in Hyderabad.",
        ),
      };
    }
  }

  const riseAndPractise =
    ['abhyasa', 'sadhana', 'anubhava'].includes(journeySlug) ||
    q10 === 'longer' ||
    q10 === 'deeper';

  return {
    theme: THEMES[themeKey],
    practice,
    program,
    alsoInPerson,
    community: {
      name: '7-Minute Community Meditation',
      body: 'Sit with us each day. Seven minutes. One simple commitment, kept in company rather than alone.',
      whatsappHref: whatsappUrl(
        "Hi Trikonam, I'd like to join the 7-Minute Community Meditation.",
      ),
    },
    riseAndPractise,
  };
}
