# Trikonam — Project Overview

The website for **Trikonam**, an authentic Classical Hatha Yoga school serving
Telangana & Andhra Pradesh. A calm, editorial, static site plus a growing **Journal**.

- **Stack:** Next.js (App Router) · TypeScript · Tailwind CSS · Framer Motion
- **Delivery:** static export (`output: 'export'`) → Cloudflare Pages
- **Content:** typed files in `src/content/` today; the Journal is Sanity-CMS-ready

See also: [FOLDER_STRUCTURE](FOLDER_STRUCTURE.md) · [CONTENT_GUIDE](CONTENT_GUIDE.md) ·
[CMS_PREPARATION](CMS_PREPARATION.md) · [SEO](SEO.md) · [DEPLOYMENT](DEPLOYMENT.md)

## Architecture principles

1. **Content is separate from presentation.** Copy/data live in `src/content/`;
   components read from them and never hardcode text.
2. **One integration boundary for the CMS.** The Journal is read only through
   `src/lib/journal.ts` — swap its function bodies for Sanity later, change nothing else.
3. **One SEO source of truth.** `src/lib/seo.ts` builds all metadata and structured data.
4. **Design tokens, not magic values.** Colour/type live in `globals.css` +
   `tailwind.config.ts`.
5. **Accessibility and performance are build-time defaults**, not afterthoughts.

## What exists today

- Marketing pages: Home, About, Teachers, Classical Hatha Yoga (+ 11 practice pages),
  Programs (+ Corporate, Schools & Colleges), Gallery, Testimonials, FAQs, Contact.
- **Journal**: landing, article template, category/tag pages, pagination, client search,
  featured article, related articles — all CMS-ready.
- SEO: per-page metadata, canonical URLs, Open Graph/Twitter, robots, sitemap,
  Organization/LocalBusiness/Article/FAQ/Breadcrumb JSON-LD.

## Performance (Core Web Vitals)

Design choices that keep vitals green:

- **Static export** — pre-rendered HTML, no server latency.
- **`next/font`** self-hosts Fraunces + Karla → no layout-shift flash (CLS), no external
  font request.
- **Pre-optimized `.webp`** at fixed sizes; the hero uses `<img>` with intrinsic sizing.
- **Lean JS** — Framer Motion is the only animation dependency; first-load JS ≈ 87 kB
  shared. Scroll reveals are CSS transitions, not JS loops.
- **Lazy loading** — below-the-fold imagery loads lazily; the hero is eager.

**Manual verification:** run Lighthouse / PageSpeed Insights against the deployed URL and
confirm LCP < 2.5s, CLS < 0.1, INP < 200ms. (Local `out/` served statically is a good
proxy.)

## Accessibility

- Semantic landmarks (`<header>/<nav>/<main>/<footer>`), one `<h1>` per page, ordered
  headings.
- Visible keyboard focus (`--color-focus-ring`) on every interactive element; skip link.
- Colour contrast meets WCAG AA (secondary text 6.7:1, moss 5.4:1, gold CTA ~5:1).
- All meaningful images have descriptive `alt`; decorative ones use `alt=""`.
- `prefers-reduced-motion` disables parallax and animation globally.
- Forms/links are keyboard-operable with discernible names; the lightbox and mobile nav
  trap/close on Escape.

## Future modules (Phase 8) — prepared, not built

The architecture leaves clean seams for these. **None are implemented**; this is where
they would attach:

| Module | Where it attaches | Notes |
| --- | --- | --- |
| **Bookings** | swap the internals of `RegisterButton`/`EnquireButton` | today they link to Google Forms; a real flow replaces one component |
| **Payments** | new route `/checkout`, server runtime required | triggers the static→`next-on-pages` migration (DEPLOYMENT.md) |
| **Events / Retreats** | new content type mirroring `journal` (`src/content/events`, `src/lib/events.ts`, `/app/events`) | copy the Journal pattern |
| **Newsletter** | a form component in the `Footer`; POST to a provider (Buttondown/Mailchimp) | no restructure needed |
| **Student Portal / Community** | auth-gated area, separate route group `(app)/portal` | needs server runtime + auth provider |
| **Library / Cafe** | content-driven pages like the Journal, or new nav sections | reuse content-layer + card components |

Guidance: reuse the **Journal pattern** (typed content in `src/content/<module>/`, a
`src/lib/<module>.ts` data layer, routes in `src/app/<module>/`) for any new
content-driven module. Auth/payments/bookings need a server runtime — plan that migration
when the first such module lands.

## Requires manual setup (accounts / external)

- Real production **domain** → set `siteConfig.url`.
- **Google Search Console** + **Bing Webmaster** (submit sitemap).
- **Google Business Profile** (local SEO / Hyderabad).
- **Analytics** (GA4 or Plausible) — add the snippet in `layout.tsx` or via a small
  `<Analytics/>` component.
- **Sanity CMS** project (CMS_PREPARATION.md) + Cloudflare deploy hook.
- Real **street address / geo** for LocalBusiness schema, when a venue is fixed.
- **Full-resolution professional photography** for the practice pages, contact/about, and
  a richer gallery (currently image-light by design — only 7 high-res professional images
  exist).
