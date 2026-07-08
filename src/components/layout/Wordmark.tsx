import Image from 'next/image';

/**
 * Website logo (client-provided artwork: /public/trikonam-logo.png).
 *
 * The source file's flat background was made transparent (a mechanical prep step —
 * no artwork, colours, or proportions altered) so the mark renders cleanly on every
 * surface the site uses: the ivory background, the sandy footer, the glass nav, and the
 * dark hero overlay.
 *
 * `light` is kept for API compatibility with existing call sites (Header passes it for
 * the dark hero state) but is intentionally a no-op — the logo's colours are fixed by
 * the client and must not be altered.
 */
export function Wordmark({ className = '', light = false }: { className?: string; light?: boolean }) {
  void light;
  return (
    <span className={`inline-flex items-center ${className}`}>
      <Image
        src="/trikonam-logo.png"
        alt="Trikonam — Yoga, Meditation, Lifestyle"
        width={900}
        height={450}
        priority
        className="h-14 w-auto sm:h-20"
      />
    </span>
  );
}
