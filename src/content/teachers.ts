/**
 * Teachers (Handoff Section 6.3 & 12) — v1.1 finalized bios.
 *
 * Bios are the client's approved copy, used VERBATIM (paragraphs split only on the
 * blank lines in the source), the same convention as practices.ts. `summary` is a
 * first-sentence excerpt of each bio's opening paragraph — used on the teacher grid
 * card, mirroring practices.ts's summary pattern.
 *
 * Do NOT caption any photo with a teacher's name: no source images were confirmed as
 * being of a specific named teacher, and a wrong name-to-face pairing is worse than no
 * photo (Handoff §14.5). Detail pages therefore use the same "no image" centred
 * composition as a practice page without a confirmed photo.
 */

export interface Teacher {
  slug: string;
  name: string;
  role: string;
  /** First-sentence excerpt of `bio[0]` — grid card teaser. */
  summary: string;
  /** Full approved biography, one entry per paragraph (verbatim). */
  bio: string[];
}

export const teachers: Teacher[] = [
  {
    slug: 'vasishta',
    name: 'Vasishta Bhargavi',
    role: 'Hatha Yoga Teacher',
    summary:
      'My academic journey has been shaped by a deep curiosity about human behaviour, learning, identity, and the ways in which people experience and make meaning of the world around them.',
    bio: [
      'My academic journey has been shaped by a deep curiosity about human behaviour, learning, identity, and the ways in which people experience and make meaning of the world around them. Across these different fields, one question has remained constant: what enables human beings to grow, flourish, and realize their fullest potential?',
      'That same curiosity eventually led me to Classical Hatha Yoga. What began as a personal exploration soon became a profound experience, revealing dimensions of human well-being that extended far beyond intellectual understanding. Through the intensive Classical Hatha Yoga Teacher Training at Sadhguru Gurukulam, I came to appreciate yoga not merely as a physical discipline, but as a sophisticated inner technology that offers a direct way to cultivate balance, clarity, vitality, and inner transformation.',
      'Today, my interest lies in bridging these two worlds—bringing together scientific inquiry and the experiential wisdom of the yogic sciences. I am deeply interested in exploring how authentic yogic practices can contribute to physical health, psychological well-being, and the overall quality of human life, while continuing to offer these timeless practices in their traditional form. My aspiration is to make these profound possibilities accessible to those seeking a more balanced and conscious way of living.',
    ],
  },
  {
    slug: 'suresh',
    name: 'M Suresh Kumar',
    role: 'Hatha Yoga Teacher',
    summary:
      'Health, movement, and adventure have been an integral part of my life for as long as I can remember.',
    bio: [
      'Health, movement, and adventure have been an integral part of my life for as long as I can remember. From a young age, I was fascinated by exploring the capabilities of the human body through strength training, powerlifting, CrossFit, outdoor adventures, and endurance-based activities. These experiences shaped my discipline, resilience, and appreciation for both physical and mental well-being.',
      "My journey eventually led me to become a certified mountaineer, an outdoor leader, and an NCC 'C' Certificate holder. Over the years, I had the opportunity to lead adventure camps, trekking expeditions, and leadership programs, witnessing firsthand how stepping beyond one's perceived limits can cultivate confidence, teamwork, and inner strength.",
      'Professionally, I worked with Decathlon before building my career in the hospitality industry, where I took on leadership roles in the corporate world. While these experiences were deeply enriching, I found myself searching for a more holistic understanding of health and well-being. That search eventually led me to the profound science of Classical Hatha Yoga.',
      'What began as a personal exploration gradually became a lifelong commitment. Experiencing the depth and transformative potential of these practices inspired me to undergo the intensive Classical Hatha Yoga Teacher Training at Sadhguru Gurukulam, with the aspiration of offering this timeless science in its authentic form.',
      'Through Trikonam, my intention is to create a space where people can experience not only physical strength and flexibility, but also greater clarity, balance, and inner stability. I believe true well-being arises when the body, mind, and energy function in harmony, and it is my privilege to share these timeless practices with anyone seeking a more conscious and fulfilling way of living.',
    ],
  },
  {
    slug: 'chandana',
    name: 'Kakustam Hari Chandana',
    role: 'Hatha Yoga Teacher',
    summary: 'My journey into yoga did not begin with a desire to become a teacher.',
    bio: [
      "My journey into yoga did not begin with a desire to become a teacher. Like many, I was exploring life through education, travel, and new experiences. After completing my Master's in Project Management in the United Kingdom, I returned to India with a growing feeling that, despite everything I had experienced, there was still something essential I was searching for.",
      'That longing eventually led me to Isha Foundation, where I immersed myself in the yogic path through its programs and practices. What began as curiosity gradually transformed the way I experienced life, revealing a depth and possibility I had never known before. Wanting to explore this path more deeply, I chose to remain at the ashram as a full-time volunteer for nearly three years.',
      'Over time, the desire to keep this experience to myself gave way to a much deeper longing—to make these timeless practices available to others. That aspiration eventually led me to undertake the intensive Classical Hatha Yoga Teacher Training at Sadhguru Gurukulam.',
      'Today, offering these practices is simply an expression of gratitude for everything they have brought into my own life. If they can create even a small possibility for someone to experience greater balance, clarity, and joy within themselves, that itself feels deeply meaningful.',
    ],
  },
  {
    slug: 'shirisha',
    name: 'Shirisha',
    role: 'Hatha Yoga Teacher',
    summary:
      'From a young age, I found myself drawn to questions about life, creation, and the very nature of existence.',
    bio: [
      "From a young age, I found myself drawn to questions about life, creation, and the very nature of existence. While life outwardly unfolded in familiar ways—completing my Bachelor's in Engineering, teaching as a lecturer for two years, and later embracing the role of a homemaker—there remained a quiet longing within to understand the truth behind it all.",
      'That search eventually led me to Isha Foundation through the Inner Engineering program in 2018. What began as an exploration soon became a profound turning point, bringing a sense of clarity that gradually dissolved many of the questions I had carried for years.',
      'My introduction to Classical Hatha Yoga in 2019 deepened this journey in ways I had never imagined. Until then, I had seen yoga largely as a physical discipline, but through the intensive Classical Hatha Yoga Teacher Training at Sadhguru Gurukulam in 2021, I came to experience it as a complete and transformative path. As my practice deepened, I experienced greater lightness, vitality, and an effortless sense of meditativeness that naturally became part of everyday life.',
      'Offering these practices is simply an expression of gratitude for everything they have brought into my own life. My aspiration is to make this possibility available to as many people as I can, so they too may experience the profound impact of Classical Hatha Yoga.',
    ],
  },
];

export const getTeacher = (slug: string) => teachers.find((t) => t.slug === slug);
