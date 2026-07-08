import { Button } from './Button';
import { siteConfig } from '@/content/site-config';

/**
 * "Enquire Now" — the ONLY component that knows the enquiry form URL.
 *
 * Used on EXACTLY two pages: Corporate Wellness and Schools & Colleges (Handoff
 * §3.4). These engagements are individually scoped, so they are enquiry-gated rather
 * than open-registration. Do not use this anywhere else, and do not swap Register ⇄
 * Enquire without re-checking Handoff §3.4.
 */
export function EnquireButton({
  label = 'Enquire Now',
  variant = 'primary',
  className = '',
}: {
  label?: string;
  variant?: 'primary' | 'secondary' | 'text';
  className?: string;
}) {
  return (
    <Button
      href={siteConfig.forms.enquire}
      external
      variant={variant}
      className={className}
      aria-label={`${label} — opens the enquiry form in a new tab`}
    >
      {label}
    </Button>
  );
}
