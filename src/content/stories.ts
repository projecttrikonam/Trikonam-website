/**
 * Stories from the Practice (2026 refinement).
 *
 * These are genuine Google reviews of Trikonam, used verbatim — not rewritten into
 * marketing copy. Names are as publicly displayed on the Google Business Profile. Do not
 * embellish, trim for punch, or invent attribution. To update, copy new reviews across
 * exactly as written.
 *
 * Source: Google Business Profile — "Trikonam – Classical Hatha Yoga", Secunderabad
 * (5.0 rating). https://share.google/ZyD1hXzfWj8qkacJC
 */

export interface Story {
  name: string;
  /** Verbatim review text. */
  text: string;
  /** Optional short, factual context drawn from the review itself. */
  context?: string;
}

export const stories: Story[] = [
  {
    name: 'Sushu Chinny',
    text: 'Vasishta akka has changed my life in the best way possible. Her guidance goes far beyond simply teaching yoga — the way she explains the deeper meaning behind each practice is truly inspiring. She teaches with so much patience, clarity, and genuine care that every session feels meaningful.\n\nThrough her guidance, I have started understanding myself better and have become more peaceful, grounded, and connected within. I’m truly grateful to have Vasishta akka as my teacher. Her words, knowledge, and way of teaching continue to inspire me every day.',
  },
  {
    name: 'Bhargav Mantravadi',
    text: 'I learnt Hatha Yoga from Harichandana Akka. I would say the yoga practices were deeply transformational. The classes were taught with utmost dedication, and the continued support provided after the classes has been truly immense. I thank Trikonam for offering these programs.',
  },
  {
    name: 'Swathi Chavali',
    text: 'I had a wonderful experience learning Angamardhana here. The teaching style is calm, patient, and precise—they take the time to focus on every pose so you understand the underlying geometry and structure. The ongoing support after class showed their real dedication to student practice. I feel confident and well-guided in my journey!',
    context: 'Learnt Angamardhana',
  },
  {
    name: 'K Suhruth Shourie',
    text: 'Practicing Isha Yoga over the last few months has been truly life-changing, and I owe that transformation to my amazing teacher, Vasishta Bhargavi Garimella garu. Her depth of knowledge, patience, and genuine dedication have inspired me every step of the way. She has a remarkable ability to explain the practices with clarity and compassion, making the entire journey meaningful and accessible. Under her guidance, I’ve become more centered, peaceful, and connected to myself, and I’m deeply grateful for the positive shift she has brought into my life.',
  },
  {
    name: 'Sassy k',
    text: 'I have learned Hatha Yoga practices from Vasishta Akka and Chandana Akka, and it has been a truly wonderful and enriching experience. I feel grateful to have learned practices that I can carry with me throughout my life, supporting my overall physical, mental, and emotional well-being.',
  },
  {
    name: '042 jaidev HBA',
    text: 'I joined the Angamardana classes at Trikonam, and the experience has been truly wonderful. The classes are very well structured, and I have learned each process with great attention to even the smallest details. The teachers observe us closely throughout the sessions, ensuring that we perform each process correctly. By the end of each session, I feel much more confident. I can already feel an improvement in my physical strength, flexibility, and overall physical ability. Thank you, Trikonam, for this wonderful experience!',
    context: 'Learnt Angamardhana',
  },
  {
    name: 'Vaddadi Roshan',
    text: 'I learnt Surya Kriya, Surya Shakti, and Angamardhana at Trikonam, and it has been a truly wonderful experience. Their home is warm and conducive to learning, especially with the devi yantra at the place it was mind blowing. The classes were comfortable and well-structured, and the support I’ve received even after completing them has been exceptional.',
    context: 'Learnt Surya Kriya, Surya Shakti & Angamardhana',
  },
  {
    name: 'somasankar nukala',
    text: 'Everyone should start practicing classical Hatha Yoga as early in life as possible. I believe Isha’s Classical Hatha Yoga stays true to the ancient Hatha Yoga tradition and preserves its original lineage.',
  },
  {
    name: 'Harsha Kondapi',
    text: 'It was so wonderful learning Surya Shakti and Surya Kriya at Trikonam. Initially because of fever I discontinued, but thank you for rescheduling the session again.',
    context: 'Learnt Surya Shakti & Surya Kriya',
  },
  {
    name: 'nagasri banala',
    text: 'A very good place to learn Hatha Yoga. They take very good care of you and provide excellent guidance.',
  },
  {
    name: 'Sudha Madhuri',
    text: 'It is the best place to learn traditional Hatha yoga. Akka guides very well with utmost care.',
  },
];
