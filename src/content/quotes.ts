/**
 * Sadhguru quotes (client-supplied, used with permission).
 *
 * Placed sparingly across the site to lend a deeper sense of connection and trust.
 * Attributed to Sadhguru. Kept in one place so wording/placement stay consistent.
 */
export interface Quote {
  id: string;
  text: string;
  author: string;
}

export const quotes: Record<string, Quote> = {
  yogaProcess: {
    id: 'yoga-process',
    text: 'Yoga is not just an exercise. It is a process and system through which human beings can find their highest possible potential.',
    author: 'Sadhguru',
  },
  completePath: {
    id: 'complete-path',
    text: 'Classical Hatha Yoga is a complete path by itself. If you give yourself totally to this process, you can make yourself the way you want.',
    author: 'Sadhguru',
  },
  changeWithin: {
    id: 'change-within',
    text: 'The quality of human life will only truly change when we change within ourselves.',
    author: 'Sadhguru',
  },
  grace: {
    id: 'grace',
    text: 'If you reach a certain level of maturity and balance, everything you do will be naturally graceful and wonderful.',
    author: 'Sadhguru',
  },
  consciousness: {
    id: 'consciousness',
    text: 'Consciousness is the source of who we are. Our thoughts, intentions, and actions are a consequence of that.',
    author: 'Sadhguru',
  },
};
