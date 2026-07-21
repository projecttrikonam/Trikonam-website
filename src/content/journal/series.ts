import type { Series } from './types';

/**
 * Local series seed. Series are collections of related articles.
 *
 * One starter series ships with the local seed so "Browse by Series" is demonstrable
 * before Sanity is connected. Once Sanity is configured, series are authored there and
 * this array is ignored (see docs/JOURNAL_CMS.md).
 */
export const series: Series[] = [
  {
    slug: 'first-steps',
    title: 'First Steps',
    description:
      'A short sequence of pieces for anyone at the very beginning — how to start, what to expect, and why consistency matters more than intensity.',
  },
];
