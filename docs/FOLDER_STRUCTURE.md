# Folder Structure

```
trikonam-website/
├── assets/
│   └── source-images/        Original professional photos (input to the image pipeline)
├── docs/                     PROJECT / DEPLOYMENT / SEO / CONTENT_GUIDE / CMS_PREPARATION / this file
├── public/
│   ├── images/               Web-ready .webp served by the site (generated, committed)
│   ├── teachers-certified.png  Sadhguru Gurukulam "Certified Teacher" badge (footer)
│   └── og-image.jpg          Social share image (generated)
├── scripts/
│   └── optimize-images.mjs   Turns source photos → optimized .webp (run locally)
├── src/
│   ├── app/                  Routes (App Router). One folder = one URL.
│   │   ├── layout.tsx        Root layout: fonts, header/footer, Organization JSON-LD
│   │   ├── page.tsx          Home (single-story composition)
│   │   ├── about/ teachers/ practices/ programs/ gallery/ testimonials/ faqs/ contact/
│   │   ├── practices/[slug]/ Generated from src/content/practices.ts
│   │   ├── journal/          ── The Journal (publishing platform) ──
│   │   │   ├── page.tsx              Landing (featured + grid + pagination)
│   │   │   ├── [slug]/               Article template
│   │   │   ├── category/[category]/  Category pages
│   │   │   ├── tag/[tag]/            Tag pages (noindex)
│   │   │   ├── page/[page]/          Pagination (page 2..N)
│   │   │   └── search/               Client-side search
│   │   ├── sitemap.ts / robots.ts    SEO routes
│   │   └── icon.svg                  Favicon
│   ├── components/
│   │   ├── layout/           Header, Footer, MobileNav, Wordmark, PageTransition
│   │   ├── ui/               Button, RegisterButton, EnquireButton, Card, Section,
│   │   │                     PageHeader, ResponsiveImage, BreathMark, Accordion, …
│   │   ├── sections/         Home/page sections (Hero, AboutPreview, FullBleedInterlude,
│   │   │                     TestimonialBlock, DeeperVisionClosing, SadhguruQuote, …)
│   │   ├── journal/          ArticleCard, ArticleGrid, FeaturedArticle, ArticleBody,
│   │   │                     ArticleMeta, Pagination, CategoryNav, JournalSearch
│   │   └── seo/              Breadcrumbs (visual + BreadcrumbList JSON-LD)
│   ├── content/              ── ALL words & data (edit these) ──
│   │   ├── site-config.ts    Forms, contact, nav (single source of truth)
│   │   ├── practices.ts faqs.ts programs.ts teachers.ts testimonials.ts quotes.ts gallery.ts
│   │   └── journal/          types.ts, articles.ts, categories.ts, authors.ts
│   └── lib/
│       ├── seo.ts            Metadata + structured-data builders (SEO source of truth)
│       ├── journal.ts        Journal data-access layer (THE CMS integration boundary)
│       ├── motion-variants.ts, use-reduced-motion.ts
├── next.config.js            Static export config
├── tailwind.config.ts        Design tokens (colour as RGB channels, type scale)
└── README.md
```

## Conventions

- **Content vs presentation**: `src/content/**` holds data; `src/components/**` and
  `src/app/**` hold presentation. Components never hardcode copy.
- **Data access**: the Journal is read only through `src/lib/journal.ts`. Other content
  is imported directly from `src/content/*` (small, static, no CMS planned for those).
- **Colour tokens** are RGB channel triples in `globals.css`, wrapped as
  `rgb(var(--token) / <alpha-value>)` in `tailwind.config.ts` so opacity modifiers work.
- **Images** are pre-optimized to `.webp`; the site is a static export.
