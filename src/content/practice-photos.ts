/**
 * Practice, as it is lived (2026 refinement).
 *
 * A curated set of real photographs — from Trikonam's Google Business Profile and the
 * client's own casual practice photos — shown as a browsable horizontal strip between
 * the Stories and Journal sections, not a gallery. Frames alternate between landscape
 * (3:2) and portrait (4:5 / 1:1) for an editorial rhythm; the strip renders every frame
 * at one height. To change the sequence, edit this array; images live in
 * /public/images/practice (see scripts/process-2026-refresh.mjs).
 */

export interface PracticePhoto {
  src: string;
  alt: string;
  /** Frame shape in the strip. */
  aspect: '3/2' | '4/5' | '1/1';
}

export const practicePhotos: PracticePhoto[] = [
  {
    src: '/images/practice/colonnade.webp',
    alt: 'A practitioner holds a low posture on an open terrace beneath a colonnade, palms flat, gaze lifted.',
    aspect: '3/2',
  },
  {
    src: '/images/practice/beach-backbend.webp',
    alt: 'A lone figure arches into a backbend on an empty beach as the sun rises over the water.',
    aspect: '4/5',
  },
  {
    src: '/images/practice/nadi-shuddhi.webp',
    alt: 'Students seated in rows on an open ground practising alternate-nostril breathing together in the morning light.',
    aspect: '3/2',
  },
  {
    src: '/images/practice/river-balance.webp',
    alt: 'A practitioner holds a standing balance on a flat rock beside a still green river, forested hills behind.',
    aspect: '4/5',
  },
  {
    src: '/images/practice/meditation.webp',
    alt: 'A large group sits in quiet meditation on an open ground, eyes closed, hands resting.',
    aspect: '3/2',
  },
  {
    src: '/images/practice/reverse-namaskar.webp',
    alt: 'Seen from behind, a practitioner joins the palms in reverse prayer between the shoulder blades, green foliage around.',
    aspect: '4/5',
  },
  {
    src: '/images/practice/sunset.webp',
    alt: 'A practitioner extends one leg in a balancing posture on a mat outdoors against a wide evening sky.',
    aspect: '4/5',
  },
  {
    src: '/images/practice/rock-hollow.webp',
    alt: 'A practitioner sits cross-legged in meditation within a smooth hollow of rock.',
    aspect: '1/1',
  },
  {
    src: '/images/practice/group.webp',
    alt: 'A small international group stands with two Trikonam teachers after a session, mats laid out behind them.',
    aspect: '3/2',
  },
];
