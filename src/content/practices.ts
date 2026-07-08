/**
 * The Classical Hatha Yoga practices (Handoff Section 7.4).
 *
 * Descriptions are the client's approved copy, used VERBATIM (do not shorten or rewrite).
 * `summary` is a first-sentence excerpt of each description — used on cards and as the
 * SEO meta description, so the same approved copy stays consistent everywhere.
 *
 * Each practice carries its own image (matched by name). Posture photos display
 * object-contain so people are never cropped.
 */

export interface Practice {
  slug: string;
  name: string;
  /** Short excerpt (first sentence of the description) — cards + SEO. */
  summary: string;
  /** Full approved description (verbatim). */
  description: string;
  image?: string;
  imageAlt?: string;
}

export const practices: Practice[] = [
  {
    slug: 'upa-yoga',
    name: 'Upa-Yoga',
    summary:
      'Gentle yet effective, Upa-Yoga is a set of simple practices designed to activate the joints, muscles, and energy system.',
    description:
      'Gentle yet effective, Upa-Yoga is a set of simple practices designed to activate the joints, muscles, and energy system. It helps relieve physical stiffness, improves flexibility and circulation, and prepares the body to remain active, comfortable, and at ease throughout the day. Suitable for people of all ages and levels of fitness.',
    image: '/images/practices/upa-yoga/upa-yoga.webp',
    imageAlt: 'The Upa-Yoga practice at Trikonam.',
  },
  {
    slug: 'surya-kriya',
    name: 'Surya Kriya',
    summary:
      'A powerful classical yogic practice that brings balance to the body, steadiness to the mind, and vitality to the entire system.',
    description:
      'Surya means sun and Kriya means Inner Energy process. Surya Kriya is a powerful classical yogic practice that brings balance to the body, steadiness to the mind, and vitality to the entire system. Rooted in an ancient yogic tradition, it strengthens the spine, enhances energy, improves overall health, and creates the foundation for deeper states of wellbeing and inner stability.',
    image: '/images/practices/surya-kriya/surya-kriya.webp',
    imageAlt: 'The Surya Kriya practice at Trikonam.',
  },
  {
    slug: 'surya-shakti',
    name: 'Surya Shakti',
    summary:
      'Surya Shakti is a dynamic sequence that develops strength, stamina, and physical agility while energizing the entire system.',
    description:
      'Surya Shakti is a dynamic sequence that develops strength, stamina, and physical agility while energizing the entire system. Regular practice builds resilience, improves flexibility and coordination, and leaves the body feeling vibrant, alert, and ready to meet the demands of daily life.',
    image: '/images/practices/surya-shakti/surya-shakti.webp',
    imageAlt: 'The Surya Shakti practice at Trikonam.',
  },
  {
    slug: 'angamardhana',
    name: 'Angamardhana',
    summary:
      "Angamardhana is a yogic workout system, an invigorating practice that uses the body's own weight to build strength, flexibility, and endurance without the need for equipment.",
    description:
      "Angamardhana is a yogic workout system, an invigorating practice that uses the body's own weight to build strength, flexibility, and endurance without the need for equipment. It revitalizes the muscular and skeletal systems, improves balance and control, and cultivates a deep sense of confidence and physical mastery.",
    image: '/images/practices/angamardhana/angamardhana.webp',
    imageAlt: 'The Angamardhana practice at Trikonam.',
  },
  {
    slug: 'yogasanas',
    name: 'Yogasanas',
    summary:
      'Yogasanas are very subtle classical postures that bring stability, balance, and ease to both body and mind.',
    description:
      'Yogasanas are very subtle classical postures that bring stability, balance, and ease to both body and mind. They create the conditions for the body to become aligned, effortless, and receptive, supporting long-term health and inner wellbeing.',
    image: '/images/practices/yogasanas/yogasanas.webp',
    imageAlt: 'The Yogasanas practice at Trikonam.',
  },
  {
    slug: 'bhuta-shuddhi',
    name: 'Bhuta Shuddhi',
    summary:
      'Bhuta Shuddhi is a subtle yogic process that harmonizes the five fundamental elements within the human system.',
    description:
      'Bhuta Shuddhi is a subtle yogic process that harmonizes the five fundamental elements within the human system. Earth, Fire, Water, Air and Space. By bringing greater balance to these elemental forces, the practice creates a supportive foundation for physical health, mental clarity, emotional balance, and inner growth.',
    image: '/images/practices/bhuta-shuddhi/bhuta-shuddhi.webp',
    imageAlt:
      'A quiet ritual arrangement — a copper vessel and a scroll before a seated practitioner.',
  },
  {
    slug: 'sunayana-eye-care',
    name: 'Sunayana (Eye Care)',
    summary:
      'Sunayana is a simple yet effective practice designed to relax, strengthen, and rejuvenate the eyes.',
    description:
      'Sunayana is a simple yet effective practice designed to relax, strengthen, and rejuvenate the eyes. Particularly beneficial for those who spend long hours looking at screens or reading, it helps reduce strain, improve comfort, and promote healthier vision through natural yogic techniques.',
    image: '/images/practices/sunayana-eye-care/sunayana.webp',
    imageAlt: 'The Sunayana eye-care practice at Trikonam.',
  },
  {
    slug: 'shanmukhi-mudra',
    name: 'Shanmukhi Mudra',
    summary:
      "Shanmukhi Mudra is a calming meditative practice that gently turns one's awareness inward.",
    description:
      "Shanmukhi Mudra is a calming meditative practice that gently turns one's awareness inward. By creating a sense of distance from external stimulation, it helps quiet mental activity, enhance clarity, improve emotional balance, and establish a deeper sense of inner peace.",
    image: '/images/practices/shanmukhi-mudra/shanmukhi-mudra.webp',
    imageAlt: 'The Shanmukhi Mudra practice at Trikonam.',
  },
  {
    slug: 'bhastrika-kriya',
    name: 'Bhastrika Kriya',
    summary:
      'Bhastrika Kriya is a powerful breathing practice that increases the flow of prana throughout the body.',
    description:
      'Bhastrika Kriya is a powerful breathing practice that increases the flow of prana throughout the body. It revitalizes the respiratory system, enhances energy levels, improves mental alertness, and prepares the body and mind for greater focus and meditative receptivity.',
    image: '/images/practices/bhastrika-kriya/bhastrika.webp',
    imageAlt: 'The Bhastrika Kriya breathing practice at Trikonam.',
  },
  {
    slug: 'pavanamuktasana',
    name: 'Pavanamuktasana',
    summary:
      'Pavanamuktasana is a gentle sequence that helps release accumulated tension and improves the natural functioning of the joints and digestive system.',
    description:
      'Pavanamuktasana is a gentle sequence that helps release accumulated tension and improves the natural functioning of the joints and digestive system. It supports better mobility, enhances circulation, and creates a sense of lightness and ease throughout the body, making it an excellent daily practice for overall wellbeing.',
    image: '/images/practices/pavanamuktasana/pavanamuktasana.webp',
    imageAlt: 'The Pavanamuktasana practice at Trikonam.',
  },
  {
    slug: 'pregnancy-yoga',
    name: 'Pregnancy Yoga',
    summary:
      'Our Pregnancy Yoga program offers safe, supportive practices thoughtfully adapted for each stage of pregnancy.',
    description:
      'Our Pregnancy Yoga program offers safe, supportive practices thoughtfully adapted for each stage of pregnancy. Through gentle movement, conscious breathing, relaxation, and mindful awareness, it helps expectant mothers maintain physical comfort, emotional balance, and a deeper connection with themselves and their growing child. The practices are designed to support wellbeing throughout pregnancy while preparing the body and mind for childbirth and motherhood.',
  },
];

export const getPractice = (slug: string) =>
  practices.find((p) => p.slug === slug);
