# SEO — what's implemented, and what needs manual setup

## Implemented (in code)

| Item | Where |
| --- | --- |
| Per-page `<title>` (with `%s · Trikonam` template) | every page's `metadata` / `pageMetadata()` |
| Meta descriptions | every page, via `pageMetadata()` |
| **Canonical URLs** (per page, self-referencing) | `pageMetadata()` in `src/lib/seo.ts` |
| Open Graph tags (type, url, title, description, image) | `pageMetadata()` + `layout.tsx` |
| Twitter cards (`summary_large_image`) | `pageMetadata()` |
| `metadataBase` (absolute URLs) | `src/app/layout.tsx` |
| **robots.txt** | `src/app/robots.ts` |
| **sitemap.xml** (all pages incl. Journal, categories, pagination) | `src/app/sitemap.ts` |
| **Organization + LocalBusiness** JSON-LD | `organizationJsonLd()` in `layout.tsx` |
| **FAQPage** JSON-LD | `src/app/faqs/page.tsx` |
| **Article** JSON-LD | `articleJsonLd()` on `/journal/[slug]` |
| **BreadcrumbList** JSON-LD | `<Breadcrumbs>` on Journal pages |
| Semantic HTML + one `<h1>` per page + heading hierarchy | all pages |
| Descriptive `alt` text on all meaningful images | content files + components |
| Internal linking (nav, footer, category/tag, related articles, breadcrumbs) | throughout |
| `noindex` on thin pages (tag pages, search) | `pageMetadata({ noIndex: true })` |

### The single source of truth
`src/lib/seo.ts` builds all metadata and structured data. To change the org schema,
canonical logic, or OG defaults, edit that one file.

## Local SEO (Telangana / Hyderabad / India)

- `organizationJsonLd()` declares `areaServed`: Hyderabad, Telangana, Andhra Pradesh,
  India, and `knowsAbout`: Classical Hatha Yoga, Pranayama, Meditation, Corporate
  Wellness, School yoga.
- Copy references the service area naturally (never keyword-stuffed).
- **No street address is fabricated.** When a real venue address exists, add it to
  `organizationJsonLd()` (`address` + `geo`) and consider a `Place`/`geo` block.

## Needs manual setup (outside the code)

These require accounts / DNS and cannot be done in the repo:

1. **Real production domain** — set `siteConfig.url` in `src/content/site-config.ts`
   (currently `https://trikonam.in`). Everything canonical/sitemap/OG derives from it.
2. **Google Search Console** — verify the domain, submit `https://<domain>/sitemap.xml`.
3. **Bing Webmaster Tools** — same.
4. **Google Business Profile** — for local pack ranking (Hyderabad). Add the real
   address, hours, phone, and photos; keep NAP (name/address/phone) identical to the site.
5. **Analytics** — add Google Analytics 4 or Plausible (see PROJECT.md → "Analytics").
6. **Social OG preview** — validate with the [Facebook Sharing Debugger] and Twitter
   Card Validator after the domain is live.
7. **Rich Results Test** — validate Article / FAQ / Breadcrumb / LocalBusiness schema at
   <https://search.google.com/test/rich-results> once deployed.

## After each publish / deploy

- Re-submit the sitemap in Search Console if many pages changed.
- Confirm new Journal articles appear in `sitemap.xml` (they're added automatically).
