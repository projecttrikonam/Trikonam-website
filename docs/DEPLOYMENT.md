# Deployment

The site is a **Next.js static export** — `npm run build` produces a plain `out/` folder
of HTML/CSS/JS/images that any static host serves. Target host: **Cloudflare Pages**.

## Prerequisites

- Node.js 18+ (`node -v`).
- Set the real domain in `src/content/site-config.ts` → `url` before the first deploy
  (canonical URLs, sitemap, and Open Graph all derive from it).

## Build locally

```bash
npm install
npm run build      # → out/
```

Preview the built site:

```bash
npx serve out      # then open the printed URL
```

## Cloudflare Pages settings

| Setting | Value |
| --- | --- |
| Framework preset | `Next.js (Static HTML Export)` (or "None") |
| Build command | `npm run build` |
| Build output directory | `out` |
| Environment variable | `NODE_VERSION` = `18` (or newer) |

On every push to the production branch, Cloudflare runs `npm run build` and publishes
`out/`. The image pipeline is **not** part of the deploy build (it needs macOS `sips`
for HEIC); the optimized images in `public/images/` are committed, so the deploy just
builds HTML.

## Images

Run `npm run optimize-images` **locally** whenever source photos change, then commit the
updated `public/images/`. See CONTENT_GUIDE.md.

## Custom domain

1. Add the domain in Cloudflare Pages → Custom domains.
2. Point DNS (Cloudflare-managed is simplest).
3. Update `siteConfig.url`, rebuild, and re-submit the sitemap in Search Console.

## When the Journal moves to Sanity

1. Add Sanity env vars (`SANITY_PROJECT_ID`, `SANITY_DATASET`) in Cloudflare Pages.
2. Create a **Deploy Hook** in Cloudflare Pages; add a **Sanity webhook** pointing at it
   so publishing an article triggers a rebuild. (See CMS_PREPARATION.md.)

## If a future phase needs a server (bookings, accounts, payments)

Static export has no server. At that point, migrate from `output: 'export'` to the
[`@cloudflare/next-on-pages`](https://github.com/cloudflare/next-on-pages) adapter (or
Vercel). This is the single documented decision point — until then, keep it static.

## Rollback

Cloudflare Pages keeps every deployment. To roll back, promote a previous deployment in
the dashboard — no rebuild required.
