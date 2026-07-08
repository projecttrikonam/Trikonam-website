# Content Guide — editing the site without breaking it

All words and data live in `src/content/`. You never edit page layout to change content.
After any change, run `npm run build` locally (or push and let the host rebuild).

## Everyday edits

| To change… | Edit |
| --- | --- |
| A practice description | `src/content/practices.ts` |
| An FAQ | `src/content/faqs.ts` |
| A program section / group minimum | `src/content/programs.ts` |
| Teacher names / roles | `src/content/teachers.ts` |
| A testimonial (only the two approved) | `src/content/testimonials.ts` |
| A Sadhguru quote | `src/content/quotes.ts` |
| Gallery images shown | `src/content/gallery.ts` |
| Phone / email / form links / nav | `src/content/site-config.ts` |

## Publishing a Journal article (today, before Sanity)

1. Open `src/content/journal/articles.ts`.
2. Copy an existing entry and change the fields. Required: `slug`, `title`, `excerpt`,
   `publishedAt` (YYYY-MM-DD), `author`, `category`, `tags`, `body`.
3. Write the `body` as a list of blocks:
   ```ts
   body: [
     { _type: 'heading', level: 2, text: 'A section title' },
     { _type: 'paragraph', text: 'A paragraph of prose.' },
     { _type: 'quote', text: 'A pulled quote.', attribution: 'Sadhguru' },
     { _type: 'list', style: 'bullet', items: ['one', 'two'] },
     // { _type: 'image', src: '/images/journal/x.webp', alt: 'describe it' },
   ]
   ```
4. Categories and tags must already exist in `src/content/journal/categories.ts`
   (add them there first if new).
5. Set `featured: true` on at most **one** article (it heads the Journal landing).
6. Rebuild. The article, its category page, tag pages, sitemap entry, and JSON-LD are all
   generated automatically.

> After the Sanity migration (see CMS_PREPARATION.md) this step becomes: write in Sanity
> Studio and hit publish — no code.

## Adding or changing images

- **Only high-quality professional photography.** No stock, no AI, no casual snapshots.
- People in postures must be **fully visible** — the site uses `object-contain` for
  posture images so nothing is cropped.
- Put the original in `assets/source-images/`, add a line to the `JOBS` array in
  `scripts/optimize-images.mjs`, then run `npm run optimize-images`. The optimized
  `.webp` is written into `public/images/` (committed).
- Journal cover images go under `/public/images/journal/`.

## The firm rules (do not break)

- Don't hardcode text inside components — content lives in `src/content/`.
- Don't add a testimonial that isn't one of the two approved stories.
- Don't invent facts — prices, schedules, durations, a street address, or a map pin.
- Don't mix up **Register Now** (programs/practices) and **Enquire Now** (Corporate,
  Schools & Colleges only). These are separate forms in `site-config.ts`.
- Don't rewrite the practice descriptions to sound more "textbook".
