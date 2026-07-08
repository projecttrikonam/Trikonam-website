import Image from 'next/image';
import Link from 'next/link';
import { footerNav, siteConfig } from '@/content/site-config';
import { Wordmark } from './Wordmark';

/**
 * Site footer (Handoff §3.3, §8, §12): footer nav, contact details, and a social row
 * that is structurally present but empty/hidden until links are supplied (§12).
 */
export function Footer() {
  const { contact } = siteConfig;

  return (
    <footer className="relative border-t border-border bg-bg-alt bg-[radial-gradient(120%_120%_at_100%_0%,var(--wash-moss),transparent_55%)]">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 sm:px-8 md:grid-cols-[1.3fr_1fr_1fr]">
        {/* Brand + intent + certification badge */}
        <div>
          <Wordmark />
          <p className="prose-measure mt-4 max-w-xs text-body text-secondary">
            Authentic Classical Hatha Yoga, offered in its original form — for a
            balanced body, a clear mind, and a joyful life.
          </p>
          {/* Authenticity: Sadhguru Gurukulam certified teachers. */}
          <div className="mt-8">
            <p className="mb-3 text-[0.7rem] uppercase tracking-[0.16em] text-secondary/80">
              Taught by certified teachers
            </p>
            <Image
              src="/teachers-certified.png"
              alt="Classical Hatha Yoga — Sadhguru Gurukulam Certified Teacher"
              width={1000}
              height={264}
              className="h-auto w-[190px] max-w-full"
            />
          </div>
        </div>

        {/* Explore */}
        <nav aria-label="Footer">
          <h2 className="eyebrow mb-4">Explore</h2>
          <ul className="space-y-2.5">
            {footerNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="link-underline text-body text-primary hover:text-moss"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        <div>
          <h2 className="eyebrow mb-4">Contact</h2>
          <ul className="space-y-2.5 text-body text-primary">
            <li>
              <a
                href={`tel:${contact.phone.replace(/\s/g, '')}`}
                className="link-underline hover:text-moss"
              >
                {contact.phone}
              </a>
            </li>
            <li className="pt-1">
              <a
                href={`mailto:${contact.email}`}
                className="link-underline break-all hover:text-moss"
              >
                {contact.email}
              </a>
            </li>
            <li className="pt-1 text-secondary">{siteConfig.serviceArea}</li>
          </ul>

          {/* Social row: present but empty until links exist (Handoff §12). */}
          {siteConfig.social.length > 0 && (
            <ul className="mt-5 flex gap-4" aria-label="Social media">
              {siteConfig.social.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-moss hover:text-moss-dark">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-[0.8125rem] text-secondary sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© {new Date().getFullYear()} Trikonam. All rights reserved.</p>
          <p>Classical Hatha Yoga · Andhra Pradesh &amp; Telangana</p>
        </div>
      </div>
    </footer>
  );
}
