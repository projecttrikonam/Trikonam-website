import type { Category, Tag } from './types';

/**
 * Journal categories and tags. Each maps to a Sanity document type later
 * (see docs/CMS_PREPARATION.md). Categories are broad sections; tags are cross-cutting.
 */
export const categories: Category[] = [
  {
    slug: 'practice',
    title: 'Practice',
    description: 'On the practices themselves — how to begin, and how to keep going.',
  },
  {
    slug: 'philosophy',
    title: 'Philosophy',
    description: 'The ideas beneath the practice, drawn from the classical tradition.',
  },
  {
    slug: 'well-being',
    title: 'Well-being',
    description: 'Living well around the practice — breath, rest, food, and daily rhythm.',
  },
];

export const tags: Tag[] = [
  { slug: 'beginners', title: 'Beginners' },
  { slug: 'breath', title: 'Breath' },
  { slug: 'meditation', title: 'Meditation' },
  { slug: 'consistency', title: 'Consistency' },
  { slug: 'stillness', title: 'Stillness' },
];
