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
  // REGISTER: the OFFLINE programmes' "Register Now" (still a Google Form). ENQUIRE:
  // Corporate & Schools/Colleges. CONSULTATION: the Contact page's "Request a
  // Consultation" button.
  //
  // appsScript (v2.0): the deployed Google Apps Script Web App /exec URL that receives
  // the in-site Online Registration & Corporate Enquiry submissions (logs each to a
  // Google Sheet + emails the team). Paste the deployed URL here after following
  // docs/apps-script/README.md. While empty, the in-site forms fall back to opening a
  // pre-filled email so no registration is ever lost.
  forms: {
    register:
      'https://docs.google.com/forms/d/e/1FAIpQLSfF6MSVE-mnGEELVaVjZfCES_i_8xh1sWjahh9kvSbgwDYhZw/viewform?usp=share_link&ouid=102767741845224190576',
    enquire: 'https://forms.gle/1gfKXoUs3B1a7XGW8',
    consultation: 'https://forms.gle/u1yNdwR1tcaL2jCf8',
    appsScript:
      'https://script.google.com/macros/s/AKfycbxow61RKzmHTgOtnTm2W7UfLLRkSpHR-I5QxLUNQPbNo49UJw7jAO5jhqZp9q08_moJ/exec',
  },

  // --- Contact (Handoff Section 12) ----------------------------------------
  // Email: the client typed "Projecttrilonam@gmail.com" (with an L) but the verified
  // Google Drive account is "projecttrikonam@gmail.com" (with a K). We use the
  // Drive-verified spelling per Handoff Section 14, item 2.
  //
  // Phone: consolidated to a single number (2026 update) — one line for General
  // Enquiries, Programs & Registrations, and Workshops alike, rather than three
  // undifferentiated numbers. Also reachable on WhatsApp at the same number.
  contact: {
    email: 'projecttrikonam@gmail.com',
    phone: '+91 9537278706',
  },

  // --- Social (Handoff §12): none supplied yet. Footer row stays structurally
  // present but renders nothing until links exist here. ----------------------
  social: [] as { label: string; href: string }[],
} as const;

// --- Primary navigation (v2.0) ---------------------------------------------
// "Programs" is no longer a standalone item — it now lives inside the Classical
// Hatha Yoga mega menu (see chyMega below). "Online Programs" is promoted to a
// top-level item. The item carrying `mega: 'chy'` renders as a dropdown trigger in
// the header (and an expandable group in the mobile nav); it still navigates to
// /practices on click.
export const primaryNav = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Meet the Teachers', href: '/teachers' },
  { label: 'Classical Hatha Yoga', href: '/practices', mega: 'chy' },
  { label: 'Online Programs', href: '/online-programs' },
  { label: 'Journal', href: '/journal' },
  { label: 'Contact', href: '/contact' },
] as const;

// --- Classical Hatha Yoga mega menu (v2.0) ---------------------------------
// Behaviour inspired by Isha's Yoga & Meditation menu; the visual language is
// entirely Trikonam's own. Practice links resolve to existing /practices/[slug]
// pages. "Ways to Learn" bridges to the offline (/programs) and online
// (/online-programs) gateways.
export const chyMega = {
  columns: [
    {
      heading: 'Core Practices',
      items: [
        { label: 'Upa-Yoga', href: '/practices/upa-yoga' },
        { label: 'Surya Kriya', href: '/practices/surya-kriya' },
        { label: 'Surya Shakti', href: '/practices/surya-shakti' },
        { label: 'Angamardhana', href: '/practices/angamardhana' },
        { label: 'Yogasanas', href: '/practices/yogasanas' },
        { label: 'Bhuta Shuddhi', href: '/practices/bhuta-shuddhi' },
      ],
    },
    {
      heading: 'Other Practices',
      items: [
        { label: 'Eye Care', href: '/practices/sunayana-eye-care' },
        { label: 'Shanmukhi Mudra', href: '/practices/shanmukhi-mudra' },
        { label: 'Bhastrika Kriya', href: '/practices/bhastrika-kriya' },
        { label: 'Pavanamuktasana', href: '/practices/pavanamuktasana' },
      ],
    },
    {
      heading: 'Ways to Learn',
      items: [
        { label: 'Offline Programs', href: '/programs' },
        { label: 'Online Programs', href: '/online-programs' },
      ],
    },
  ],
} as const;

// --- Footer navigation (Handoff §3.3; v2.0 adds Online Programs) ------------
export const footerNav = [
  { label: 'Online Programs', href: '/online-programs' },
  { label: 'Journal', href: '/journal' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'Corporate Wellness', href: '/programs/corporate' },
  { label: 'Schools & Colleges', href: '/programs/schools-colleges' },
  { label: 'Contact', href: '/contact' },
] as const;
