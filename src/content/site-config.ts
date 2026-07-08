/**
 * SINGLE SOURCE OF TRUTH for external links, contact details, and navigation.
 *
 * If a form URL, phone number, or email ever changes, change it HERE — not inside
 * a component. (Handoff Section 10 & 12.)
 */

export const siteConfig = {
  name: 'Trikonam',
  tagline: 'Classical Hatha Yoga',
  description:
    'Trikonam offers authentic Classical Hatha Yoga — preserved in its original form — to cultivate health, inner balance, and a deeper connection with oneself. Serving Andhra Pradesh & Telangana.',
  // Used for canonical URLs, sitemap, Open Graph. Update to the real production
  // domain once it is registered.
  url: 'https://trikonam.in',
  serviceArea: 'Andhra Pradesh & Telangana, India',

  // --- External forms (Handoff Section 3.4 & 12) ---------------------------
  // REGISTER: every "Register Now" button. ENQUIRE: Corporate & Schools/Colleges only.
  forms: {
    register:
      'https://docs.google.com/forms/d/e/1FAIpQLSfF6MSVE-mnGEELVaVjZfCES_i_8xh1sWjahh9kvSbgwDYhZw/viewform?usp=share_link&ouid=102767741845224190576',
    enquire: 'https://forms.gle/1gfKXoUs3B1a7XGW8',
  },

  // --- Contact (Handoff Section 12) ----------------------------------------
  // Email: the client typed "Projecttrilonam@gmail.com" (with an L) but the verified
  // Google Drive account is "projecttrikonam@gmail.com" (with a K). We use the
  // Drive-verified spelling per Handoff Section 14, item 2.
  contact: {
    email: 'projecttrikonam@gmail.com',
    // All three numbers listed equally — no primary was designated (Handoff §14.4).
    phones: ['9491527020', '9985898518', '9537278706'],
  },

  // --- Social (Handoff §12): none supplied yet. Footer row stays structurally
  // present but renders nothing until links exist here. ----------------------
  social: [] as { label: string; href: string }[],
} as const;

// --- Primary navigation (Handoff §3.1): 6 items + 1 CTA --------------------
export const primaryNav = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Meet the Teachers', href: '/teachers' },
  { label: 'Classical Hatha Yoga', href: '/practices' },
  { label: 'Programs', href: '/programs' },
  { label: 'Journal', href: '/journal' },
  { label: 'Contact', href: '/contact' },
] as const;

// --- Footer navigation (Handoff §3.3) --------------------------------------
export const footerNav = [
  { label: 'Journal', href: '/journal' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'Corporate Wellness', href: '/programs/corporate' },
  { label: 'Schools & Colleges', href: '/programs/schools-colleges' },
  { label: 'Contact', href: '/contact' },
] as const;
