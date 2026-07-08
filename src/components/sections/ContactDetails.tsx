import { siteConfig } from '@/content/site-config';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';

/**
 * Minimal line-art chat glyph (not the trademarked WhatsApp logo) — kept consistent
 * with the site's thin single-stroke icon language (Header menu icon, Accordion
 * plus/close icon) rather than importing a third-party brand mark.
 */
function ChatIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden focusable="false">
      <path
        d="M12 3.5c-4.42 0-8 3.36-8 7.5 0 1.62.55 3.12 1.48 4.35-.2 1.1-.58 2.1-1.13 2.9a.45.45 0 0 0 .5.7c1.28-.32 2.4-.85 3.33-1.5A8.7 8.7 0 0 0 12 18.5c4.42 0 8-3.36 8-7.5s-3.58-7.5-8-7.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M8.9 9.85c0-.35.28-.63.63-.63h.28c.29 0 .54.2.6.48l.32 1.2c.06.24 0 .48-.17.65l-.35.36a5 5 0 0 0 2.32 2.32l.36-.35a.68.68 0 0 1 .65-.17l1.2.32c.28.06.48.31.48.6v.28c0 .35-.28.63-.63.63h-.35a5.1 5.1 0 0 1-5.1-5.1v-.35Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Contact details block (Handoff §6.12, §12) — 2026 refresh.
 *
 * A single phone number, reachable by call or WhatsApp, replaces the previous three
 * undifferentiated numbers (client-requested consolidation). The WhatsApp icon opens
 * a chat directly via wa.me; the number itself remains a plain tel: link for anyone
 * who prefers to call. Service-area detail now lives in its own "Where We Teach"
 * section further down the page, so this block stays a quiet, minimal pairing.
 */
export function ContactDetails() {
  const { contact } = siteConfig;
  const phoneDigits = contact.phone.replace(/\D/g, '');

  return (
    <div className="grid gap-10 sm:grid-cols-2 sm:gap-16">
      <RevealOnScroll>
        <h2 className="eyebrow mb-4">Call &amp; WhatsApp</h2>
        <div className="flex items-center gap-4">
          <a
            href={`tel:+${phoneDigits}`}
            className="link-underline text-body-lg text-primary hover:text-moss"
          >
            {contact.phone}
          </a>
          <a
            href={`https://wa.me/${phoneDigits}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with Trikonam on WhatsApp — opens in a new tab"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-moss/70 text-moss transition-all duration-300 ease-calm hover:-translate-y-0.5 hover:border-moss hover:bg-moss hover:text-inverse hover:shadow-soft focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <ChatIcon className="h-5 w-5" />
          </a>
        </div>
        <p className="mt-3 text-body text-secondary">
          General enquiries, programs &amp; registrations, workshops.
        </p>
      </RevealOnScroll>

      <RevealOnScroll delay={0.05}>
        <h2 className="eyebrow mb-4">Email</h2>
        <a
          href={`mailto:${contact.email}`}
          className="link-underline break-all text-body-lg text-primary hover:text-moss"
        >
          {contact.email}
        </a>
      </RevealOnScroll>
    </div>
  );
}
