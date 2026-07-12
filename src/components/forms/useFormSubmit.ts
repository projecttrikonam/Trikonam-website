'use client';

import { useState } from 'react';
import { siteConfig } from '@/content/site-config';

export type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

/**
 * Submits an in-site form to the Google Apps Script Web App (v2.0).
 *
 * On a static site the browser cannot read an Apps Script response (no CORS headers),
 * so we POST with `mode: 'no-cors'` and form-encoded data — fire-and-forget — then show
 * our own in-site confirmation. The request succeeds silently server-side (the script
 * logs to a Sheet + emails the team); it only rejects on a genuine network failure.
 *
 * Resilience: if the endpoint isn't configured yet (`forms.appsScript` empty) or the
 * network fails, we open a pre-filled email so a registration is never lost.
 */
export function useFormSubmit(formType: string) {
  const [status, setStatus] = useState<SubmitStatus>('idle');

  async function submit(data: Record<string, string>) {
    setStatus('submitting');
    const endpoint = siteConfig.forms.appsScript;
    const payload = { ...data, formType, submittedAt: new Date().toISOString() };

    // Endpoint not configured yet — fall back to a pre-filled email, then confirm.
    if (!endpoint) {
      openMailFallback(formType, payload);
      setStatus('success');
      return;
    }

    try {
      await fetch(endpoint, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(payload).toString(),
      });
      setStatus('success');
    } catch {
      // Genuine network failure — hand off to email so the submission still arrives.
      openMailFallback(formType, payload);
      setStatus('error');
    }
  }

  return { status, submit };
}

function openMailFallback(formType: string, data: Record<string, string>) {
  if (typeof window === 'undefined') return;
  const subject =
    formType === 'corporate-enquiry'
      ? 'Corporate Enquiry — Trikonam Online Programs'
      : 'Online Program Registration — Trikonam';
  const body = Object.entries(data)
    .filter(([, v]) => v)
    .map(([k, v]) => `${labelize(k)}: ${v}`)
    .join('\n');
  const href = `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = href;
}

function labelize(key: string) {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());
}
