# CMS Preparation — migrating the Journal to Sanity

The site is built so that connecting **Sanity CMS** later is a contained, low-risk change.
Nothing about the visual design or the page components changes. This document is the
migration plan.

## The core idea: one integration boundary

Presentation never touches raw content. Everything flows through a single data-access
layer:

```
Pages / Components  ──▶  src/lib/journal.ts  ──▶  src/content/journal/*.ts  (today)
                                             ──▶  Sanity client + GROQ      (later)
```

Every reader (`getAllArticles`, `getArticleBySlug`, `getArticlesByCategory`, …) is an
`async` function in `src/lib/journal.ts`. Pages already `await` them. To move to Sanity
you replace **only the bodies** of those functions with `client.fetch(groq\`…\`)`. The
function signatures, the components, and the pages stay identical.

Each swappable function is marked with a `@cms` comment in `src/lib/journal.ts`.

## Why it maps cleanly

The content model in `src/content/journal/types.ts` was written to mirror Sanity:

| Local type (`types.ts`) | Sanity document / type | Notes |
| --- | --- | --- |
| `Article` | `article` document | `category`/`author` become references; `tags` an array of references |
| `Category` | `category` document | |
| `Tag` | `tag` document | |
| `Author` | `author` document | |
| `PortableBlock[]` (`body`) | **Portable Text** | The block union already uses `_type` discriminators (`heading`/`paragraph`/`quote`/`list`/`image`) |
| `coverImage: string` | Sanity image asset | Replace the string path with a Sanity image + `@sanity/image-url` |

## Migration steps (when you're ready)

1. **Create the Sanity project**
   - `npm create sanity@latest` (separate `studio/` folder or a hosted studio).
   - Define schemas matching the table above (`article`, `category`, `tag`, `author`).
   - Model `body` as Portable Text (`type: 'array', of: [{type:'block'}, {type:'image'}]`).

2. **Add the client to this project**
   - `npm i @sanity/client @portabletext/react @sanity/image-url`.
   - Add `src/lib/sanity.client.ts` with `createClient({ projectId, dataset, apiVersion, useCdn })`.
   - Put `SANITY_PROJECT_ID` / `SANITY_DATASET` in `.env.local` (and in the host's env).

3. **Swap the data layer** — edit `src/lib/journal.ts` only. Example:
   ```ts
   export async function getAllArticles(): Promise<Article[]> {
     return sanity.fetch(groq`*[_type=="article"]|order(publishedAt desc){
       "slug": slug.current, title, excerpt, publishedAt, updatedAt,
       "author": author->slug.current, "category": category->slug.current,
       "tags": tags[]->slug.current, "coverImage": coverImage.asset->url,
       coverAlt, body, featured, seoTitle, seoDescription
     }`)
   }
   ```
   Return the same `Article` shape and nothing downstream changes.

4. **Swap the body renderer** — replace `<ArticleBody blocks={…} />` internals with
   `@portabletext/react`'s `<PortableText value={body} components={…} />`. The existing
   styles move into the `components` map. (`src/components/journal/ArticleBody.tsx`.)

5. **Rebuilds on publish**
   - Static export means new articles appear after a rebuild. Add a Sanity **webhook** →
     a deploy hook on Cloudflare Pages so publishing triggers a rebuild automatically.
   - Result: **publishing requires no code** — an editor writes in Sanity Studio, hits
     publish, the site rebuilds itself.

6. **(Optional) Live preview / ISR** — only needed if you later move off static export to
   the `@cloudflare/next-on-pages` runtime (see DEPLOYMENT.md). Not required for publishing.

## Search

`src/components/journal/JournalSearch.tsx` filters a build-time index (`getSearchIndex`).
For a large catalogue, replace the `index` prop with an Algolia or Sanity text search —
the results UI is unchanged. This is the only other `@cms` swap point.

## What does NOT change

- Any page or component under `src/app/journal/**` or `src/components/journal/**`.
- The URL structure (`/journal`, `/journal/[slug]`, `/journal/category/[c]`, …).
- SEO (metadata, Article/Breadcrumb JSON-LD) — it reads from the same `Article` shape.
