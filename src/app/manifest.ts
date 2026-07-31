import type { MetadataRoute } from 'next';
import { siteConfig } from '@/content/site-config';

/**
 * Web app manifest — Trikonam Brand Identity v1.0.
 *
 * Next.js emits this to /manifest.webmanifest at build time (it is included in the
 * static export). Every icon referenced here is a verbatim copy from
 * `Brand Identity Kit/02_Icons/`.
 *
 * Colours are the approved palette: Ivory as the ground, Forest Ink as the theme.
 * Together with the maskable icon these are what Android uses to compose the PWA
 * splash screen, so no separate splash artwork is required on that platform.
 *
 * `purpose: 'maskable'` points at the Android adaptive foreground, whose lotus is
 * drawn inside the centre-66% safe zone — the standard icon would be cropped by
 * circular and squircle masks.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Trikonam · Classical Hatha Yoga',
    short_name: 'Trikonam',
    description: siteConfig.description,
    id: '/',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#FAF7EF', // Ivory — the brand's primary ground
    theme_color: '#2F3A2A', // Forest Ink — the brand's ink
    categories: ['health', 'lifestyle', 'education'],
    icons: [
      { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/favicon-64x64.png', sizes: '64x64', type: 'image/png' },
      { src: '/favicon-128x128.png', sizes: '128x128', type: 'image/png' },
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/favicon-256x256.png', sizes: '256x256', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      {
        src: '/icon-maskable-1024.png',
        sizes: '1024x1024',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
