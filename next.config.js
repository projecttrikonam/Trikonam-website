/** @type {import('next').NextConfig} */

// PHASE 1: Trikonam is a fully static showcase site — every "action" is an external
// Google Form link, so there is no server-side logic. We therefore use Next.js
// static export (`output: 'export'`), which produces a plain `out/` folder of HTML
// that deploys to Cloudflare Pages with zero adapter complexity.
//
// PHASE 2 MIGRATION NOTE (do not remove): the moment a future phase needs server
// logic (bookings, payments, student accounts, an admin dashboard, a CMS), this is
// the decision point to switch from static export to the `@cloudflare/next-on-pages`
// adapter. Until then, keep it static.
const nextConfig = {
  output: 'export',

  // Static export cannot run Next's on-demand image optimizer, so we pre-optimize
  // every photo at build time via `scripts/optimize-images.mjs` (sharp) and serve
  // fixed, already-sized assets. `unoptimized` tells next/image to emit the <img>
  // as-is rather than expecting a running optimizer.
  images: {
    unoptimized: true,
  },

  // Emit `/about/index.html` instead of `/about.html` so Cloudflare Pages serves
  // clean URLs without extra redirect rules.
  trailingSlash: true,

  reactStrictMode: true,
};

module.exports = nextConfig;
