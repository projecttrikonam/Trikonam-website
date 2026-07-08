import { siteConfig } from '@/content/site-config';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';

/**
 * Contact details block (Handoff §6.12, §12).
 *
 * All three phone numbers are listed equally — no primary was designated (§14.4).
 * Service area is the general region only; no fabricated street address or map pin
 * (§14.3). Reused wherever contact details are shown.
 */
export function ContactDetails() {
  const { contact, serviceArea } = siteConfig;

  return (
    <div className="grid gap-10 sm:grid-cols-3">
      <RevealOnScroll>
        <h2 className="eyebrow mb-4">Call</h2>
        <ul className="space-y-2 text-body-lg text-primary">
          {contact.phones.map((phone) => (
            <li key={phone}>
              <a href={`tel:${phone}`} className="link-underline hover:text-moss">
                {phone}
              </a>
            </li>
          ))}
        </ul>
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

      <RevealOnScroll delay={0.1}>
        <h2 className="eyebrow mb-4">Where We Teach</h2>
        <p className="text-body-lg text-primary">{serviceArea}</p>
        <p className="mt-2 text-body text-secondary">
          Offline classes in person; online classes conducted live, wherever you are.
        </p>
      </RevealOnScroll>
    </div>
  );
}
