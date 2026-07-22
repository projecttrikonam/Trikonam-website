/**
 * Learning Pathways (v2.1) — the four offline formats in which Classical Hatha Yoga is
 * offered, each a dedicated page built on the same editorial template as the practice
 * pages (see src/app/learn/[slug]/page.tsx). Content is the client's approved copy,
 * written in the site's calm editorial tone. Adding a future pathway is one entry here.
 *
 * Intros and taglines are used verbatim from the client brief.
 */

export interface LearningSection {
  heading: string;
  /** Editorial prose — one or more paragraphs. */
  body: string[];
  /** Optional short, refined list (used sparingly — formats, areas, locations). */
  list?: string[];
}

export interface LearningPath {
  slug: string;
  name: string;
  tagline: string;
  image: string;
  imageAlt: string;
  /**
   * Search-result summary, ~150 characters. Kept separate from `intro` because a body
   * paragraph makes a poor meta description — Google truncates it around 155 and the
   * useful part is lost.
   */
  metaDescription: string;
  intro: string[];
  sections: LearningSection[];
  cta: { label: string; journey: string };
}

export const learningPaths: LearningPath[] = [
  {
    slug: 'group-workshops',
    name: 'Group Workshops',
    tagline: 'Experience yoga together.',
    image: '/images/learn/group-workshops.webp',
    imageAlt: 'A group of practitioners holding Classical Hatha Yoga postures together on temple steps at dawn.',
    metaDescription:
      'Classical Hatha Yoga for groups — from a single introductory session to an immersive multi-day workshop, shaped around your group’s needs and experience.',
    intro: [
      'Not every yogic journey begins individually. Sometimes it begins with a classroom, a workplace, a residential community, or simply a group of people who wish to learn together. Group Workshops are designed to make the transformative possibility of Classical Hatha Yoga accessible in a shared environment, while preserving the authenticity of these timeless practices.',
      'Whether offered as a short introductory session or a more immersive multi-day workshop, each program is thoughtfully designed according to the group’s needs, experience, and intention. Conducted by certified Classical Hatha Yoga teachers, these workshops create an opportunity for participants to experience greater balance, vitality, clarity, and inner well-being together.',
    ],
    sections: [
      {
        heading: 'The purpose',
        body: [
          'The intention behind a group workshop is a simple one — to bring the depth of Classical Hatha Yoga to people who are already together, without diluting the practice to suit the setting. Learning alongside familiar faces often makes the first steps feel less daunting, and the shared rhythm of a group can carry a practice further than a single session ever could.',
        ],
      },
      {
        heading: 'Who it is for',
        body: [
          'A workshop is shaped around the group it is offered to, and can be arranged for almost any community that wishes to practise together:',
        ],
        list: [
          'Schools',
          'Colleges',
          'Corporates',
          'Residential communities',
          'Friends & families',
          'Wellness groups',
        ],
      },
      {
        heading: 'Workshop formats',
        body: [
          'Each workshop is designed around the time a group can give and the depth it wishes to reach — from a single gentle introduction to a sustained, immersive process:',
        ],
        list: [
          'One-hour introductory sessions',
          'Half-day workshops',
          'Three-day workshops',
          'Eight-day workshops',
          'Fifteen-day workshops',
          'Twenty-one-day workshops',
          'Monthly guided practice circles',
        ],
      },
      {
        heading: 'Group size',
        body: [
          'Workshops are best experienced with roughly 7 to 150 participants, allowing for both a genuine sense of shared practice and the attentive guidance these methods deserve.',
        ],
      },
    ],
    cta: { label: 'Plan a Workshop', journey: 'group-workshops' },
  },
  {
    slug: 'private-guidance',
    name: 'Private One-to-One Guidance',
    tagline: 'A journey designed around you.',
    image: '/images/programs/private-sessions/private.webp',
    imageAlt: 'A teacher offering warm, individual guidance to a student in a calm space.',
    metaDescription:
      'One-to-one Classical Hatha Yoga, with the practice and pace shaped entirely around you — your body, your schedule, and where you are in the practice.',
    intro: [
      'Every individual begins their journey from a different place. While group programs provide a shared learning experience, some situations benefit from dedicated personal attention and guidance. One-to-One Guidance offers an opportunity to understand your current needs, aspirations, and challenges before recommending a practice that is most suitable for you.',
      'The journey begins with a personal consultation, allowing the teacher to design a thoughtful and structured approach tailored to your goals. Whether your intention is to improve overall well-being, build strength, establish a consistent practice, or simply begin exploring yoga with confidence, each session is offered with care, clarity, and individual attention.',
    ],
    sections: [
      {
        heading: 'The purpose',
        body: [
          'Individual guidance exists for the moments when a general path is not quite enough — when the body carries specific considerations, when time is limited, or when a person simply learns best with undivided attention. The practice is met to you, rather than the other way around.',
        ],
      },
      {
        heading: 'Who it is for',
        body: [
          'This is well suited to anyone who would value a practice shaped to their own body and rhythm — those with particular health considerations, those returning after a long pause, complete beginners who prefer to start privately, and anyone who wishes to go deeper at their own pace.',
        ],
      },
      {
        heading: 'How it works',
        body: [
          'It begins with a conversation. In an initial consultation, the teacher takes the time to understand where you are and where you hope to go, and from there designs a structured approach that unfolds session by session — adjusting as your practice matures, always with care and clarity.',
        ],
      },
      {
        heading: 'Areas of support',
        body: [
          'One-to-one guidance can be oriented towards whatever matters most to you at this point in your life:',
        ],
        list: [
          'Overall well-being',
          'Weight management',
          'Strength',
          'Flexibility',
          'Lifestyle',
          'Meditation',
        ],
      },
    ],
    cta: { label: 'Book a Consultation', journey: 'private-sessions' },
  },
  {
    slug: 'childrens-yoga',
    name: "Children's Yoga",
    tagline: 'Growing with awareness, curiosity, and joy.',
    image: '/images/programs/children/children.webp',
    imageAlt: 'Children seated quietly in practice, mountains softening in the distance.',
    metaDescription:
      'Classical Hatha Yoga for children — simple practices offered through play and curiosity, building steadiness, attention, and confidence as they grow.',
    intro: [
      'The early years of life are a wonderful time to cultivate awareness, balance, confidence, and joyful participation. Children’s Yoga introduces young minds to simple yogic practices through engaging experiences that encourage movement, attention, creativity, and connection with nature.',
      'Designed specifically for children between the ages of 7 and 15, these programs combine Classical Hatha Yoga with games, nature-based activities, creative learning, and meaningful group experiences. The intention is not only to support physical health and coordination, but also to help children develop focus, emotional balance, confidence, and a deeper appreciation for themselves and the world around them.',
    ],
    sections: [
      {
        heading: 'The purpose',
        body: [
          'For a child, yoga is best offered not as discipline but as delight. The practices are introduced gently, through play and curiosity, so that steadiness of body and clarity of mind grow naturally — qualities that quietly serve a child through school, friendships, and everything that follows.',
        ],
      },
      {
        heading: 'Age group',
        body: [
          'Children’s Yoga is designed for young practitioners between the ages of 7 and 15, with the approach thoughtfully adapted to each stage of a child’s growth.',
        ],
      },
      {
        heading: 'Offerings',
        body: [
          'Across the year, children can take part in a variety of experiences that blend authentic practice with joyful, age-appropriate learning:',
        ],
        list: [
          'Children’s group workshops',
          'Summer programs',
          'Nature-based experiences',
          'Yoga & meditation',
          'Games & activities',
          'Creative learning',
        ],
      },
    ],
    cta: { label: 'Enquire Now', journey: 'childrens-programs' },
  },
  {
    slug: 'retreats',
    name: 'Retreats',
    tagline: 'Pause. Breathe. Return to what matters.',
    image: '/images/programs/retreats/retreats.webp',
    imageAlt: 'A small group seated together at dusk in a quiet natural setting, on retreat.',
    metaDescription:
      'Residential Classical Hatha Yoga retreats — unhurried days of practice, silence, and simple living, away from the noise of routine.',
    intro: [
      'Stepping away from the pace of everyday life creates a unique opportunity to reconnect with oneself. Trikonam Retreats are designed as immersive yogic experiences where participants can spend a few days surrounded by nature, simplicity, and practices that nurture both body and mind.',
      'Rather than focusing on sightseeing or leisure, these retreats create an environment where yoga, meditation, mindful living, and conscious participation become part of daily life. Conducted in carefully chosen natural settings across India, each retreat is thoughtfully designed to support inner balance while allowing participants to experience the restorative influence of nature.',
    ],
    sections: [
      {
        heading: 'An immersive experience',
        body: [
          'A retreat is not a holiday with yoga attached to it. Here, practice is not something set apart from the day — it becomes the day. From the first light of morning to the quiet of evening, the rhythm of practice, stillness, and mindful living carries participants gently inward, away from the noise they arrived with.',
        ],
      },
      {
        heading: 'Who it is for',
        body: [
          'Retreats are organised for private groups of five or more — a circle of friends, a family, a community, or a group of practitioners who wish to step away together and share the experience of a few unhurried days in practice.',
        ],
      },
      {
        heading: 'Where they are held',
        body: [
          'Each retreat is held in a natural setting chosen for its quiet and its beauty. Depending on the group and the season, these have included:',
        ],
        list: [
          'Ooty',
          'Pondicherry',
          'Hampi',
          'Goa',
          'Alappuzha',
          'Dharamshala',
          'Manali',
          'Hyderabad',
          'Bengaluru',
          'Special Pournami gatherings',
        ],
      },
    ],
    cta: { label: 'Enquire About Retreats', journey: 'retreats' },
  },
];

export const getLearningPath = (slug: string): LearningPath | undefined =>
  learningPaths.find((p) => p.slug === slug);
