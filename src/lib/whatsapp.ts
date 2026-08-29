/**
 * WhatsApp deep-link helper (2026 refinement).
 *
 * Every "I'm Interested" / "Register Interest" action on the site opens a WhatsApp chat
 * with Trikonam rather than a checkout or booking flow — batches are small and formed by
 * conversation. The number is the single one in site-config; this keeps the wa.me URL
 * and message-encoding in one place.
 */
import { siteConfig } from '@/content/site-config';

/** Digits only, e.g. "919537278706". */
export const whatsappNumber = siteConfig.contact.phone.replace(/[^0-9]/g, '');

export function whatsappUrl(message: string): string {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
