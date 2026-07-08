/**
 * Teachers (Handoff Section 6.3 & 12).
 *
 * NAMES ONLY for now — the client will supply bios later. Do NOT caption any photo
 * with a teacher's name: none of the source images were confirmed as being of a
 * specific named teacher, and a wrong name-to-face pairing is worse than no photo
 * (Handoff §14.5). Cards therefore render name + role label only, with a reserved,
 * intentionally-quiet space for a future bio.
 */

export interface Teacher {
  slug: string;
  name: string;
  role: string;
  /** Reserved for a future bio. Empty by design in Phase 1. */
  bio?: string;
  /** Reserved for a future confirmed portrait. Left undefined until confirmed. */
  image?: string;
}

export const teachers: Teacher[] = [
  { slug: 'vasishta', name: 'Vasishta', role: 'Hatha Yoga Teacher' },
  { slug: 'suresh', name: 'Suresh', role: 'Hatha Yoga Teacher' },
  { slug: 'chandana', name: 'Chandana', role: 'Hatha Yoga Teacher' },
  { slug: 'sirisha', name: 'Sirisha', role: 'Hatha Yoga Teacher' },
  { slug: 'hema', name: 'Hema', role: 'Hatha Yoga Teacher' },
];
