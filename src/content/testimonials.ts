/**
 * Testimonials (Handoff Section 7.5).
 *
 * These are the ONLY two permitted testimonials. Do NOT add more, do not invent
 * "sample" testimonials, and do not add attribution names, titles, or photos unless
 * the client supplies them later (Handoff Ground Rule §3 and §7.5). They are
 * anonymous, first-person accounts, used in full.
 */

export interface Testimonial {
  id: string;
  quote: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 'story-one',
    quote:
      'Before Trikonam, I believed life was meant to be chased — through travel, indulgence, and doing exactly as I pleased, whenever I pleased. I had all of it. And none of it was ever enough. Somewhere beneath the noise, I knew there had to be more. It wasn’t until I encountered Hatha Yoga that I found it — not outside myself, but in stillness. In that stillness, I felt something no external pursuit had ever given me: a completeness that needed nothing added to it. A bliss that required no substance, no movement, no destination — only presence. That single moment undid everything I thought I understood about a fulfilled life. I had spent years searching outward for something that had been waiting within, all along.',
  },
  {
    id: 'story-two',
    quote:
      'He came to class a skeptic — a logical mind who trusted evidence, not experience, and who was there only because his wife had asked him to be. On the final day of the course, after the physical practice, we moved into a simple meditation. What happened next surprised even him. He sat in silence, in tears, touched by something he had no language for. He left that day without answers. Weeks later, he called — not to explain what had happened, but simply to say that his life had not been the same since.',
  },
];
