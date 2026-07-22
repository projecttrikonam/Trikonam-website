'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Client redirect stub (v2.1) for retired form routes. Sends any lingering bookmark to
 * the unified Welcome System at /begin, preselecting the given journey. A short calm line
 * shows in the brief moment before the redirect (and if scripting is disabled).
 */
export function RedirectToBegin({ journey }: { journey: string }) {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/begin?journey=${journey}`);
  }, [router, journey]);

  return (
    <div className="mx-auto max-w-xl px-6 py-32 text-center">
      {/* This interstitial is noindex and shown for a moment, but it still needs a page
          heading so the document has an outline for anyone who lands on it. */}
      <h1 className="sr-only">Redirecting to the Trikonam Welcome System</h1>
      <p className="text-body-lg text-secondary">
        Taking you to the Trikonam Welcome System…{' '}
        <a href={`/begin?journey=${journey}`} className="link-underline text-moss">
          Continue
        </a>
      </p>
    </div>
  );
}
