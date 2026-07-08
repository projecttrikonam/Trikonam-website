# Trikonam — Website

The official website for **Trikonam**, an authentic Classical Hatha Yoga school
serving Telangana & Andhra Pradesh. It presents the school, its practices and programs,
hosts a growing **Journal**, and sends every "Register" / "Enquire" action to an external
Google Form.

Built with **Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion**, and
delivered as a fully **static site** (no server needed) for **Cloudflare Pages**.

## 📚 Documentation

Full documentation lives in [`docs/`](docs/):

- **[PROJECT.md](docs/PROJECT.md)** — overview, architecture, performance, accessibility, future modules
- **[FOLDER_STRUCTURE.md](docs/FOLDER_STRUCTURE.md)** — where everything lives
- **[CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md)** — editing copy & publishing Journal articles
- **[CMS_PREPARATION.md](docs/CMS_PREPARATION.md)** — the Sanity CMS migration plan
- **[SEO.md](docs/SEO.md)** — what's implemented + manual setup (Search Console, Analytics…)
- **[DEPLOYMENT.md](docs/DEPLOYMENT.md)** — building & deploying to Cloudflare Pages

---

## Table of contents

1. [Running the site locally](#1-running-the-site-locally)
2. [Editing the words (copy)](#2-editing-the-words-copy)
3. [Adding or replacing images](#3-adding-or-replacing-images)
4. [Changing the Register / Enquire form links & contact details](#4-changing-the-register--enquire-form-links--contact-details)
5. [Deploying to Cloudflare Pages](#5-deploying-to-cloudflare-pages)
6. [What NOT to do](#6-what-not-to-do)
7. [How the project is organised](#how-the-project-is-organised)
8. [Phase 2 & future](#phase-2--future)

---

## 1. Running the site locally

You need [Node.js](https://nodejs.org) (version 18 or newer) installed.

```bash
npm install      # once, to download dependencies
npm run dev      # start the site at http://localhost:3000
```

Open <http://localhost:3000> in your browser. Changes you save appear instantly.

To produce the final files that get published:

```bash
npm run build    # creates the static site in the `out/` folder
```

---

## 2. Editing the words (copy)

**All text lives in typed files under [`src/content/`](src/content) — you never need to
touch the page layout to change wording.** Open the relevant file, edit the text
between the quotes, and save.

| To edit…                         | Open this file                              |
| -------------------------------- | ------------------------------------------- |
| An **FAQ** question/answer       | [`src/content/faqs.ts`](src/content/faqs.ts) |
| A **practice** description       | [`src/content/practices.ts`](src/content/practices.ts) |
| A **program** section            | [`src/content/programs.ts`](src/content/programs.ts) |
| The **teacher** names/roles      | [`src/content/teachers.ts`](src/content/teachers.ts) |
| A **testimonial**                | [`src/content/testimonials.ts`](src/content/testimonials.ts) |
| Gallery images & captions        | [`src/content/gallery.ts`](src/content/gallery.ts) |
| Phone / email / form links / nav | [`src/content/site-config.ts`](src/content/site-config.ts) |

**Example — editing an FAQ.** Open `src/content/faqs.ts`, find the question, and change
the text after `answer:`:

```ts
{
  question: 'Do I need any prior yoga experience to join?',
  answer: 'No. Every program at Trikonam is designed to welcome complete beginners…',
},
```

Save the file — that's it.

---

## 3. Adding or replacing images

Photos are **pre-optimized** before they go on the site, so the site stays fast.

**The short version:** put your original photo(s) in
[`assets/source-images/`](assets/source-images), tell the site which slot they belong
to, then run one command.

1. Copy your new photo into `assets/source-images/` (give it a clear name).
2. Open [`scripts/optimize-images.mjs`](scripts/optimize-images.mjs) and add a line to
   the `JOBS` list saying which source file maps to which position on the site, e.g.:
   ```js
   { src: 'my-new-photo.jpg', out: ['about/approach.webp'], fit: 'portrait' },
   ```
3. Run:
   ```bash
   npm run optimize-images
   ```
   This writes the web-ready images into [`public/images/`](public/images) (organised
   into folders per section — home, about, practices, programs, gallery, etc.).

> **HEIC photos (from iPhone):** files ending in `.HEIC` are handled automatically on a
> Mac. If you run this on Windows/Linux, convert HEIC to JPEG first, because those
> systems can't read HEIC.

**Important rules for images** (these are firm brand rules):

- Use **only Trikonam's own photographs**. No stock photos, no AI-generated images, no
  images from the internet — ever.
- If a section has no genuinely fitting photo, **leave it without one** (the layout is
  designed for generous whitespace). Don't force a mismatched image. Pages that need a
  photo but don't have one show a soft "Image to come" placeholder instead.

---

## 4. Changing the Register / Enquire form links & contact details

Everything a client might need to update is in **one file**:
[`src/content/site-config.ts`](src/content/site-config.ts).

- **Register Now** form link → `forms.register`
- **Enquire Now** form link → `forms.enquire`
- **Phone numbers** → `contact.phones`
- **Email** → `contact.email`
- **Social media** → `social` (currently empty; add links here and the footer icons
  appear automatically)

Change the value, save, and every button/link across the whole site updates.

> The two form buttons are deliberately kept as small reusable pieces
> (`RegisterButton`, `EnquireButton`) so that a future real booking system can replace
> them by editing one component — no page rewrites.

---

## 5. Deploying to Cloudflare Pages

The site is a **static export**, which Cloudflare Pages serves directly.

**Cloudflare Pages settings:**

| Setting                    | Value          |
| -------------------------- | -------------- |
| Framework preset           | `Next.js (Static HTML Export)` (or "None") |
| Build command              | `npm run build` |
| Build output directory     | `out`          |
| Node version (env var)     | `NODE_VERSION` = `18` (or newer) |

On every push to your repository's main branch, Cloudflare will run `npm run build` and
publish the `out/` folder. The image-optimization step is **not** part of the deploy
build (it's run locally when photos change and the results are committed), so the deploy
stays simple and fast.

Before your first deploy, set the real site domain in
[`src/content/site-config.ts`](src/content/site-config.ts) (`url:`) so the sitemap and
social-share tags point at the right address.

---

## 6. What NOT to do

- **Don't hardcode text inside the page components.** All copy lives in
  `src/content/*.ts`. Edit it there.
- **Don't add stock photos, AI-generated images, or internet images.** Trikonam's own
  photography only.
- **Don't add a testimonial** that isn't one of the two approved stories in
  `src/content/testimonials.ts`. Do not invent or borrow testimonials.
- **Don't rewrite the practice descriptions** to sound more "textbook". They are
  original writing in Trikonam's voice and are used as-is.
- **Don't mix up the buttons.** "Register Now" is for programs, workshops, and
  practices. "Enquire Now" is **only** for the Corporate Wellness and Schools & Colleges
  pages. (These are separate forms and separate components on purpose.)
- **Don't invent facts** — prices, schedules, durations, a street address, or a map
  pin — that the client hasn't provided.

---

## How the project is organised

```
trikonam-website/
├── assets/source-images/     Original photos (input to the image pipeline)
├── public/images/            Web-ready images the site actually serves (generated)
├── scripts/optimize-images.mjs   Turns source photos into web-ready images
├── src/
│   ├── app/                  The pages (one folder per URL) + sitemap/robots/icon
│   ├── components/           Reusable building blocks (header, footer, cards, buttons…)
│   ├── content/              ALL the words & data — edit these to update the site
│   └── lib/                  Small helpers (motion, reduced-motion preference)
├── tailwind.config.ts        Colours & fonts (the design system)
└── next.config.js            Static-export configuration
```

**Design system** (colours, fonts, spacing) is defined once in
[`src/app/globals.css`](src/app/globals.css) and
[`tailwind.config.ts`](tailwind.config.ts) — components never hardcode colours.
The fonts are **Fraunces** (headings) and **Karla** (body), loaded automatically with
no external requests.

Accessibility and motion are treated as a quality floor: keyboard focus is always
visible, text meets WCAG AA contrast, and anyone who has "reduce motion" turned on gets
a calm, still version of the site (no parallax, no looping animations).

---

## Phase 2 & future

The site is structured so the following can be **added later without a redesign** — but
none of them are built now:

- **Booking & payments** — replace the internals of `RegisterButton` / `EnquireButton`.
- **Student accounts / login** — layers on top of the existing pages.
- **Blog** — add an `app/blog/` route reading from `src/content/` or a CMS.
- **Newsletter** — a form/widget slots into the footer.
- **Digital courses** — a new top-level route with its own content.

> **Migration note for developers:** this site uses Next.js **static export**
> (`output: 'export'` in `next.config.js`) because Phase 1 has no server-side logic. The
> moment a future phase needs a server (bookings, accounts, an admin dashboard, a CMS),
> switch from static export to the [`@cloudflare/next-on-pages`](https://github.com/cloudflare/next-on-pages)
> adapter. Until then, keep it static.

---

*This site was built from the Phase 1 development handoff specification. The full brand,
content, and design brief lives in that document.*
