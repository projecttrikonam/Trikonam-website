'use client';

import { useState } from 'react';
import { siteConfig } from '@/content/site-config';

export type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

/**
 * Submits a Welcome System journey to the one Google Apps Script Web App (v2.1).
 *
 * The submitted `data` carries a `category` (the journey id) which the backend uses to
 * route the row to the correct tab in the Trikonam Student Hub spreadsheet, plus a
 * `journey` label and `sheet` name for the internal email / logging.
 *
 * On a static site the browser cannot read an Apps Script response (no CORS headers), so
 * we POST with `mode: 'no-cors'` and form-encoded data — fire-and-forget — then show our
 * own in-site confirmation. The request succeeds silently server-side (script logs to the
 * Sheet + emails); it only rejects on a genuine network failure.
 *
 * Resilience: if the endpoint isn't configured yet or the network fails, we open a
 * pre-filled email so a submission is never lost.
 */
export function useFormSubmit() {
  const [status, setStatus] = useState<SubmitStatus>('idle');

  async function submit(data: Record<string, string>) {
    setStatus('submitting');
    const endpoint = siteConfig.forms.appsScript;
    const payload = { ...data, submittedAt: new Date().toISOString() };

    // Endpoint not configured yet — fall back to a pre-filled email, then confirm.
    if (!endpoint) {
      openMailFallback(payload);
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
      openMailFallback(payload);
      setStatus('error');
    }
  }

  return { status, submit };
}

function openMailFallback(data: Record<string, string>) {
  if (typeof window === 'undefined') return;
  const subject = `Trikonam — ${data.journey || 'Registration'}`;
  const body = Object.entries(data)
    .filter(([k, v]) => v && k !== 'category' && k !== 'sheet')
    .map(([k, v]) => `${labelize(k)}: ${v}`)
    .join('\n');
  const href = `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = href;
}

function labelize(key: string) {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());
}
