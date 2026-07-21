# Journal CMS — Sanity runbook

Everything you need to run the Journal on Sanity: one-time setup, the day-to-day
publishing workflow, and how the pieces fit together. The rest of the website is
untouched — Sanity powers **only** the Journal.

---

## 1. How it works (in one minute)

- The site is a **static export** (`next build` → `out/`), deployed to Cloudflare Pages.
- The Journal reads through a single data layer, [`src/lib/journal.ts`](../src/lib/journal.ts).
  When the Sanity env vars are present it sources articles from Sanity at **build time**;
  when they are absent it falls back to the local seed in `src/content/journal/`. The site
  therefore always builds and never breaks, whether or not Sanity is connected.
- Because the site is static, new or edited content goes live on the **next build**. A
  Sanity **webhook** pings a Cloudflare **deploy hook** on publish, so a rebuild kicks off
  automatically and the change is live in ~1–2 minutes. No code, no manual deploy.
- The **Studio** (the editing app) is a separate project in `studio/`, deployed to
  `https://<name>.sanity.studio`. It stays out of the main site bundle.

```
Editor writes in Studio ──publish──▶ Sanity webhook ──▶ Cloudflare deploy hook
                                                              │
                                                     next build (fetches Sanity)
                                                              │
                                                        live in ~1–2 min
```

---

## 2. One-time setup (~10 minutes)

You need a free Sanity account. Do this once.

### 2.1 Create the Sanity project

```bash
cd studio
npm install
npx sanity login          # opens the browser
npx sanity init --env     # create a NEW project; dataset: production
```

`sanity init` prints a **Project ID** and writes `studio/.env` with
`SANITY_STUDIO_PROJECT_ID` / `SANITY_STUDIO_DATASET`. Keep that Project ID handy.

### 2.2 Import the seed content

This loads the nine categories, the author, the "First Steps" series, tags, the six
existing articles, and one fully-populated sample article.

```bash
# still in studio/
npm run import-seed        # = sanity dataset import ./seed/journal-seed.ndjson production --replace
```

> The seed file is generated from the site's own local content by
> `node scripts/generate-journal-seed.mjs` (run from the repo root). Re-run it if the local
> seed changes; images are **not** in the file — add them in the Studio after import (§4).

### 2.3 Point the website at Sanity

Copy [`.env.example`](../.env.example) to `.env.local` and fill in the Project ID:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=<your project id>
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

Add the **same three variables** to **Cloudflare Pages → Settings → Environment variables**
(Production and Preview) so production builds source the Journal from Sanity.

Verify locally:

```bash
npm run build     # should now fetch from Sanity; Journal pages reflect the dataset
```

### 2.4 Allow the browser to read Sanity (CORS)

In [sanity.io/manage](https://sanity.io/manage) → your project → **API → CORS origins**,
add your site origin(s), e.g. `https://trikonam.in` (no credentials needed — the dataset is
public/read-only for the site). Build-time fetches from CI don't need this, but it's good
hygiene if you ever read client-side.

### 2.5 Deploy the Studio

```bash
cd studio
npm run deploy            # choose a hostname → https://<name>.sanity.studio
```

Editors log in there to write. (Invite them under **Project → Members**.)

### 2.6 Auto-rebuild on publish (webhook → deploy hook)

1. **Cloudflare Pages → your project → Settings → Builds & deployments → Deploy hooks.**
   Create one (e.g. "Sanity publish"). Copy the URL.
2. **sanity.io/manage → API → Webhooks → Create webhook:**
   - **URL**: the Cloudflare deploy-hook URL
   - **Trigger on**: Create, Update, Delete
   - **Filter**: `_type in ["article","category","series","author","tag"]`
   - **HTTP method**: POST
3. Publish any change → a Cloudflare build starts within seconds.

---

## 3. Day-to-day: writing and publishing

In the Studio (`https://<name>.sanity.studio`):

1. **Journal → Articles → +** (create).
2. Fill **Title**, then generate the **Slug**. Add **Excerpt** (used on cards and as the
   meta-description fallback). Upload the **Hero image** (with alt text).
3. Write the **Body**. Alongside normal text, headings (H2/H3), quotes, and lists, use the
   custom blocks from the insert menu:
   - **Callout** — Note / Tip / Reflection boxes.
   - **Pull quote** — a large set-apart line, with optional attribution.
   - **Image** / **Image gallery** — captioned, with required alt text.
   - **Video** — paste a YouTube or Vimeo URL (embedded lazily on the site).
   - **Footnote** (a text mark) — becomes a numbered reference collected at the article foot.
   - **Link** (a text mark) — internal (`/practices/...`) or external URLs.
4. **Details** tab: **Author**, **Category**, optional **Series**, **Tags**, **Featured**
   (the newest featured article headlines the Journal homepage), **Publish date**, and
   optional **Last updated**.
5. **Related** tab: tick **Related practices** and **Related programs** — these render as
   native link cards at the foot of the article, deep-linking to the matching pages.
6. **SEO** tab (all optional): Meta title, Meta description, Social share image, Canonical
   URL, and "Hide from search engines".
7. **Preview** while editing (§5).
8. **Publish.** The webhook triggers a rebuild; the article is live in ~1–2 minutes at
   `/journal/<slug>`, and automatically appears in the homepage, its category, its series,
   search, the sitemap, and the RSS feed.

**Editing** an existing article: open it, change what you need, set **Last updated** if you
want the "Updated …" line to show, and **Publish** again.

**Unpublishing**: delete or unpublish the document; the next build removes its page.

---

## 4. Adding authors, categories, series, tags

All live under the **Journal** menu in the Studio:

- **Authors** — Name, Photo (+ alt), Designation, Bio, Social links. Shown in the byline
  card at the foot of each article.
- **Categories** — Title, Slug, Description, Display order. Nine ship with the seed; add
  more freely. Each gets its own `/journal/category/<slug>` page.
- **Series** — Title, Slug, Description, optional Cover image. Collections of related
  articles; each gets a `/journal/series/<slug>` page and appears in "Browse by series".
- **Tags** — Title, Slug. Cross-cutting; each gets a `/journal/tag/<slug>` page.

Create these first if a new article needs one, then reference them from the article.

---

## 5. Previewing drafts

Because the public site is a static export, it only ever shows **published** content — a
token-based live preview would require shipping a read token in the browser bundle, which we
deliberately avoid. Preview instead works like this:

- **In the Studio**, the editing pane shows the article exactly as authored (text, images,
  block layout) as you type — this is the working preview for structure and copy.
- **On the live site**, the finished article appears automatically after Publish + rebuild
  (~1–2 min). Treat that as the final visual proof.

If a true pre-publish visual preview is ever needed, the clean path is a small Sanity
"preview" deployment of the Next app running as a server (not the static export) with a
server-only token — out of scope here, and documented as a future option in
[`CMS_PREPARATION.md`](./CMS_PREPARATION.md).

---

## 6. SEO, sitemap, RSS — all automatic

- **Per-article JSON-LD** (`Article` schema: headline, dates, author, image, section,
  keywords) is emitted on every article page, plus breadcrumb structured data.
- **`/sitemap.xml`** includes every article, category, series, and the journal pagination.
- **`/journal/rss.xml`** is a full RSS 2.0 feed (auto-discovered via a `<link>` on the
  Journal page). Both regenerate on each build.
- Meta title / description / OG image / canonical / noindex come from the article's **SEO**
  tab, falling back to title / excerpt / hero image.

---

## 7. Troubleshooting

- **Journal shows old content** → a build hasn't run since the change. Check the Cloudflare
  deploy-hook fired (Sanity → Webhooks → delivery log) and the build succeeded.
- **Build shows local seed, not Sanity** → the three `NEXT_PUBLIC_SANITY_*` vars aren't set
  in that environment. The build logs `[sanity] fetch failed, falling back…` only on a fetch
  error; a missing Project ID silently uses the local seed by design.
- **Images broken** → the article references an image asset that wasn't uploaded, or CORS
  isn't set. Re-upload in the Studio; confirm §2.4.
- **A category/series page 404s** → the referenced document is still a draft; publish it.
