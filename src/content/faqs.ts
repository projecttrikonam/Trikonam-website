/**
 * FAQs (Handoff Section 7.6). Used verbatim. Client approved the "basic, honest"
 * framing — do not embellish or add questions.
 */

export interface Faq {
  question: string;
  answer: string;
}

export const faqs: Faq[] = [
  {
    question: 'Do I need any prior yoga experience to join?',
    answer:
      'No. Every program at Trikonam is designed to welcome complete beginners, and no previous experience is required.',
  },
  {
    question: 'Is Classical Hatha Yoga suitable for all ages and fitness levels?',
    answer:
      'Yes, broadly — Trikonam’s programs are open to a wide range of ages and fitness levels. Some of our more intensive practices (such as Angamardhana) have specific practical considerations, which a teacher will always discuss with you individually.',
  },
  {
    question: 'What should I wear or bring to a class?',
    answer:
      'Comfortable, loose-fitting clothing that allows free movement. If you’re practicing at home for an online class, a yoga mat and a quiet space are all you need.',
  },
  {
    question: 'What’s the difference between online and offline classes?',
    answer:
      'Both offer the same authentic instruction. Offline classes are held in person at our locations across Andhra Pradesh and Telangana; online classes are conducted live, with the same attentive guidance, from wherever you are.',
  },
  {
    question: 'How is Trikonam’s yoga different from a typical studio or fitness class?',
    answer:
      'Trikonam teaches Classical Hatha Yoga in its preserved, original form — not adapted for fitness trends or studio formats. Our focus is on authenticity and consistency, not on quick results.',
  },
  {
    question: 'How do I register for a program or workshop?',
    answer:
      'Use the "Register Now" button on the relevant page, which opens a short registration form.',
  },
  {
    question: 'How do I get in touch about a Corporate or School/College program?',
    answer:
      'Use the "Enquire Now" button on the Corporate Wellness or Schools & Colleges page. These programs are individually scoped, so we start with a short enquiry rather than a direct registration.',
  },
  {
    question: 'How soon will I notice a difference?',
    answer:
      'This varies by person, and depends on your body, your mind, and your consistency — we don’t promise a specific timeline. What we can say is that the practices are designed to reward regular, sustained practice over quick effort.',
  },
];
