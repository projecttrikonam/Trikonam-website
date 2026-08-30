/**
 * Teachers (Handoff Section 6.3 & 12) — v1.1 bios; 2026 refinement adds portraits and
 * the physician-meditator profile.
 *
 * Bios are the client's approved copy, used VERBATIM (paragraphs split only on the
 * blank lines in the source), the same convention as practices.ts. `summary` is a
 * first-sentence excerpt of each bio's opening paragraph — used on the teacher grid
 * card, mirroring practices.ts's summary pattern.
 *
 * `photo` (2026) — a confirmed, client-supplied portrait of that named teacher, so the
 * name-to-face pairing is safe. Portraits are graded to one calm register in
 * scripts/process-2026-refresh.mjs. A teacher without a `photo` falls back to the
 * monogram-in-a-breath-ring treatment.
 */

export interface Teacher {
  slug: string;
  name: string;
  role: string;
  /** First-sentence excerpt of `bio[0]` — grid card teaser. */
  summary: string;
  /** Full approved biography, one entry per paragraph (verbatim). */
  bio: string[];
  /** Confirmed portrait (4:5). Optional — falls back to a monogram. */
  photo?: string;
  photoAlt?: string;
}

export const teachers: Teacher[] = [
  {
    slug: 'vasishta',
    name: 'Vasishta Bhargavi',
    role: 'Hatha Yoga Teacher',
    photo: '/images/teachers/vasishta.webp',
    photoAlt: 'Portrait of Vasishta Bhargavi, Classical Hatha Yoga teacher at Trikonam.',
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
    role: 'Hatha Yoga Teacher & Strength Trainer',
    photo: '/images/teachers/suresh.webp',
    photoAlt: 'Portrait of M Suresh Kumar, Classical Hatha Yoga teacher at Trikonam.',
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
    photo: '/images/teachers/chandana.webp',
    photoAlt: 'Portrait of Kakustam Hari Chandana, Classical Hatha Yoga teacher at Trikonam.',
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
    photo: '/images/teachers/shirisha.webp',
    photoAlt: 'Portrait of Shirisha, Classical Hatha Yoga teacher at Trikonam.',
    summary:
      'From a young age, I found myself drawn to questions about life, creation, and the very nature of existence.',
    bio: [
      "From a young age, I found myself drawn to questions about life, creation, and the very nature of existence. While life outwardly unfolded in familiar ways—completing my Bachelor's in Engineering, teaching as a lecturer for two years, and later embracing the role of a homemaker—there remained a quiet longing within to understand the truth behind it all.",
      'That search eventually led me to Isha Foundation through the Inner Engineering program in 2018. What began as an exploration soon became a profound turning point, bringing a sense of clarity that gradually dissolved many of the questions I had carried for years.',
      'My introduction to Classical Hatha Yoga in 2019 deepened this journey in ways I had never imagined. Until then, I had seen yoga largely as a physical discipline, but through the intensive Classical Hatha Yoga Teacher Training at Sadhguru Gurukulam in 2021, I came to experience it as a complete and transformative path. As my practice deepened, I experienced greater lightness, vitality, and an effortless sense of meditativeness that naturally became part of everyday life.',
      'Offering these practices is simply an expression of gratitude for everything they have brought into my own life. My aspiration is to make this possibility available to as many people as I can, so they too may experience the profound impact of Classical Hatha Yoga.',
    ],
  },
  {
    // A physician and meditator who is part of the Trikonam community. Deliberately given
    // the same treatment as every other profile — not framed as a medical authority, and
    // making no medical treatment claims. Bio is the client's approved copy, verbatim.
    slug: 'sasi-vadana',
    name: 'Dr. Sasi Vadana',
    role: 'Physician & Meditator',
    photo: '/images/teachers/sasi-vadana.webp',
    photoAlt: 'Portrait of Dr. Sasi Vadana, physician and meditator, part of the Trikonam community.',
    summary:
      'I have been associated with Isha since 2018, and over the years, I had the opportunity to explore and complete the various programs offered, including Samyama.',
    bio: [
      'I have been associated with Isha since 2018, and over the years, I had the opportunity to explore and complete the various programs offered, including Samyama.',
      'What kept drawing me deeper into the practices was seeing the changes they were bringing about in people around me — not just in the way they felt, but in the way they lived and experienced life.',
      'As a doctor, this naturally made me curious. I wanted to understand more about the human system — both through the lens of physiology and through the science of yoga. And as I continued practicing, I began noticing the physical changes in myself and in others. There were times when the body responded to the practices in ways I had not expected, even in situations where medication had not brought the same results.',
      'This made me want to look more closely at the body and, more importantly, learn to listen to it.',
      'Every body speaks differently. Understanding what it is telling us, and approaching our practices with the right awareness and guidance, can make a meaningful difference to how we grow and move through our lives.',
      'This understanding is what brought me to Trikonam.',
      'I joined Trikonam because I want to support people in approaching yoga with the right guidance — not simply as something to do, but as a way of understanding and working with oneself.',
      'I hope that, together with the Trikonam community, we can take these practices to more people and help them discover for themselves the possibilities that yoga can open up.',
    ],
  },
];

export const getTeacher = (slug: string) => teachers.find((t) => t.slug === slug);
