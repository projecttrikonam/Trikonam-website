import type { Article } from './types';

/**
 * Journal articles (seed content).
 *
 * This array is the ONLY place article content lives. Components and pages never
 * hardcode article text — they read through src/lib/journal.ts. To move to Sanity,
 * this array is replaced by a GROQ fetch; nothing else changes (see
 * docs/CMS_PREPARATION.md).
 *
 * Cover images, when present, must be real professional photography placed under
 * /public/images/journal/ and optimized via scripts/optimize-images.mjs.
 */
export const articles: Article[] = [
  {
    slug: 'beginning-where-you-are',
    title: 'Beginning where you are',
    excerpt:
      'You do not need to be flexible, calm, or experienced to begin. You only need to begin.',
    publishedAt: '2026-06-02',
    author: 'trikonam',
    category: 'practice',
    series: 'first-steps',
    seriesTitle: 'First Steps',
    tags: ['beginners', 'consistency'],
    featured: true,
    body: [
      {
        _type: 'paragraph',
        text: 'Most people imagine they must become someone else before they can practice — steadier, suppler, quieter. It is the opposite. The practice is not a reward for already being calm; it is the means by which calm slowly arrives.',
      },
      { _type: 'heading', level: 2, text: 'Start small, and stay' },
      {
        _type: 'paragraph',
        text: 'A short practice, met honestly and often, changes more than a long one attempted rarely. We teach Upa-Yoga first for exactly this reason: it asks little, works directly with the joints where the body stores its fatigue, and leaves the system a little more awake than it found it.',
      },
      {
        _type: 'quote',
        text: 'We do not promise transformation. We offer the practice — and trust that consistency, not persuasion, is what creates change.',
      },
      { _type: 'heading', level: 2, text: 'What to expect' },
      {
        _type: 'paragraph',
        text: 'Nothing dramatic, at first. A little more ease of movement. A breath that reaches lower. An afternoon that feels less crowded. These are not small things — they are the ground on which everything else is built.',
      },
      {
        _type: 'list',
        style: 'bullet',
        items: [
          'Comfortable, loose clothing and a quiet space are enough.',
          'No prior experience is needed — every program welcomes complete beginners.',
          'Consistency matters more than intensity.',
        ],
      },
    ],
  },
  {
    slug: 'the-breath-as-a-bridge',
    title: 'The breath as a bridge',
    excerpt:
      'Pranayama is not a technique to master but a bridge to cross — between the body you can feel and the life you can sense.',
    publishedAt: '2026-06-18',
    author: 'trikonam',
    category: 'well-being',
    series: 'first-steps',
    seriesTitle: 'First Steps',
    tags: ['breath', 'meditation'],
    body: [
      {
        _type: 'paragraph',
        text: 'Of all the things the body does without asking, the breath is the one we can also do on purpose. That small overlap — automatic and voluntary at once — is why it has always been a doorway in yoga.',
      },
      { _type: 'heading', level: 2, text: 'Why the breath steadies the mind' },
      {
        _type: 'paragraph',
        text: 'When the breath is hurried and shallow, the mind tends to follow. When it lengthens and settles, the mind, given nothing to chase, settles too. Pranayama simply makes this relationship deliberate: by regulating the breath with care, we bring balance to the body, the mind, and the energies together.',
      },
      {
        _type: 'quote',
        text: 'In that stillness, peace is not something to be achieved; it becomes your very nature.',
      },
      {
        _type: 'paragraph',
        text: 'We teach these practices slowly and under guidance, because the pace and rhythm matter and are best matched to your own system. Learned this way, the breath becomes something you can return to anywhere — a bridge always within reach.',
      },
    ],
  },
  {
    slug: 'why-we-dont-promise-outcomes',
    title: 'Why we don’t promise outcomes',
    excerpt:
      'A quiet word on sincerity — and why the most honest thing a school can offer is the practice itself.',
    publishedAt: '2026-07-01',
    author: 'trikonam',
    category: 'philosophy',
    tags: ['consistency', 'stillness'],
    body: [
      {
        _type: 'paragraph',
        text: 'It would be easy to promise things — clarity in thirty days, calm in eight sessions, a new you by the season’s end. It would also be untrue. What each person experiences from a practice is their own, shaped by their body, their mind, and their willingness to stay.',
      },
      { _type: 'heading', level: 2, text: 'Safeguarding the path' },
      {
        _type: 'paragraph',
        text: 'Our role is narrower, and we think more honest: to keep these practices intact — passed down in their original form, without dilution or modern reinterpretation — and to guide each person faithfully along the path. The rest unfolds on its own time.',
      },
      {
        _type: 'quote',
        text: 'The quality of human life will only truly change when we change within ourselves.',
        attribution: 'Sadhguru',
      },
      {
        _type: 'paragraph',
        text: 'So we say less, and offer more room. If you leave a session a little quieter than you arrived, that is enough for us to have done our part well.',
      },
    ],
  },
  {
    slug: 'the-five-elements',
    title: 'The five elements, and why balance begins there',
    excerpt:
      'Earth, water, fire, air, and space — a short note on Bhuta Shuddhi and addressing imbalance at its root.',
    publishedAt: '2026-05-20',
    author: 'trikonam',
    category: 'philosophy',
    tags: ['stillness'],
    body: [
      {
        _type: 'paragraph',
        text: 'The classical system begins with a simple, radical idea: the human body is made of five elements — earth, water, fire, air, and space. When they fall out of balance, so do we. Bhuta Shuddhi is the practice of tending to them directly.',
      },
      {
        _type: 'paragraph',
        text: 'It is why we treat it as foundational. Rather than chasing symptoms, it works at the level from which much of Hatha Yoga is drawn — quietly, and with patience.',
      },
    ],
  },
  {
    slug: 'a-word-on-consistency',
    title: 'A word on consistency',
    excerpt:
      'A short practice met often changes more than a long one attempted rarely. On showing up.',
    publishedAt: '2026-05-06',
    author: 'trikonam',
    category: 'practice',
    series: 'first-steps',
    seriesTitle: 'First Steps',
    tags: ['consistency', 'beginners'],
    body: [
      {
        _type: 'paragraph',
        text: 'The most common question we hear is not about difficulty, but about time. The honest answer: a little, often, is enough — and far more effective than a great deal, rarely.',
      },
      {
        _type: 'quote',
        text: 'If you reach a certain level of maturity and balance, everything you do will be naturally graceful and wonderful.',
        attribution: 'Sadhguru',
      },
      {
        _type: 'paragraph',
        text: 'Consistency is not discipline in the harsh sense. It is a kind of kindness — returning to the mat before the mind can build a case against it.',
      },
    ],
  },
  {
    slug: 'stillness-is-not-emptiness',
    title: 'Stillness is not emptiness',
    excerpt:
      'On what meditation actually is — not the absence of life, but the fullest experience of it.',
    publishedAt: '2026-04-22',
    author: 'trikonam',
    category: 'well-being',
    tags: ['meditation', 'stillness'],
    body: [
      {
        _type: 'paragraph',
        text: 'People often imagine meditation as switching off. It is closer to the opposite — a switching on so complete that the noise simply has no room left to occupy.',
      },
      {
        _type: 'paragraph',
        text: 'Meditation is not about escaping life; it is about experiencing it with absolute clarity. As the mind settles, one begins to perceive life beyond the compulsions of thought and emotion — and peace, rather than something to be achieved, becomes one’s very nature.',
      },
    ],
  },
];
