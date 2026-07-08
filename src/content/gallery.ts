/**
 * Gallery manifest (Handoff §6.9).
 *
 * A small, curated showcase of Trikonam's professional photography. Because only
 * high-quality professional images are used site-wide (no casual photography), and the
 * professional set is small, the gallery draws from those same images — a gallery is a
 * showcase, so this is expected. It will grow as more full-resolution professional
 * photography is supplied (add the file, map it in scripts/optimize-images.mjs, then add
 * an entry here). Only real client photography — never stock/AI (Ground Rule §1).
 */

export interface GalleryImage {
  src: string;
  alt: string;
  orientation: 'portrait' | 'landscape' | 'square';
}

export const galleryImages: GalleryImage[] = [
  {
    src: '/images/home/interlude.webp',
    alt: 'Practitioners hold a posture together at dawn on a stone terrace, mist rising over the mountains behind them.',
    orientation: 'landscape',
  },
  {
    src: '/images/teachers/training.webp',
    alt: 'Trainees seated in rows at Sadhguru Gurukulam during a Classical Hatha Yoga teacher-training session.',
    orientation: 'landscape',
  },
  {
    src: '/images/programs/children/children.webp',
    alt: 'Children seated in quiet meditation on mats outdoors, mountains in the distance.',
    orientation: 'landscape',
  },
  {
    src: '/images/practices/bhuta-shuddhi/bhuta-shuddhi.webp',
    alt: 'A quiet ritual arrangement — a copper vessel and a hand-written scroll before a seated practitioner in white.',
    orientation: 'landscape',
  },
  {
    src: '/images/programs/schools-colleges/schools.webp',
    alt: 'A group of young students chant together during a Classical Hatha Yoga session.',
    orientation: 'landscape',
  },
];
