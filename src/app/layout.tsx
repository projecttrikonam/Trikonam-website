import type { Metadata, Viewport } from 'next';
import { Fraunces, Karla } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { siteConfig } from '@/content/site-config';
import { organizationJsonLd } from '@/lib/seo';

// Both typefaces self-hosted by next/font — no external request, no layout shift
// (Handoff §4.3 / §9). Fraunces = display serif; Karla = body/UI sans.
const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-fraunces',
});

const karla = Karla({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-karla',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'Trikonam · Classical Hatha Yoga',
    template: '%s · Trikonam',
  },
  description: siteConfig.description,
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    title: 'Trikonam · Classical Hatha Yoga',
    description: siteConfig.description,
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'A practitioner in quiet meditation at dusk.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trikonam · Classical Hatha Yoga',
    description: siteConfig.description,
    images: ['/og-image.jpg'],
  },
  // No global canonical — each page sets its own via pageMetadata() in src/lib/seo.ts.
  //
  // Favicon / app icon — regenerated for v1.1 from the bolder icon mark (cropped from
  // the current header logo, public/trikonam-logo.png) composited onto the same ivory
  // circle-on-white badge treatment as before, sized up to fill more of the frame. The
  // original thin-stroke mark read as a faint grey smudge at 16–32px; this version
  // trades a little fine detail for legibility at true favicon sizes.
  // scripts/optimize-images.mjs is NOT used here — these are one-off, hand-run sizes;
  // source master lives at assets/source-images/trikonam-favicon-source.png — regenerate
  // all sizes from it (or a newer source) if the mark ever changes again. Set once here
  // so every page inherits it — no page defines its own `icons`, so nothing overrides this.
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: ['/favicon.ico'],
  },
};

// Organization + LocalBusiness structured data — one source in src/lib/seo.ts.
const orgJsonLd = organizationJsonLd();

/**
 * Tells the browser (and mobile UI chrome) the page is light and what colour it is, so
 * the canvas it paints during navigation matches the site instead of defaulting to
 * white or, in Dark Mode, dark grey.
 */
export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#FAF7EF',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${karla.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-surface focus:px-4 focus:py-2 focus:text-primary focus:shadow-soft">
          Skip to content
        </a>
        <Header />
        {/* pt-24 clears the fixed h-24 header on every page; the home hero cancels it
            with -mt-24 to sit full-bleed behind the transparent header. */}
        <main id="main" className="pt-24">
          {children}
        </main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </body>
    </html>
  );
}
