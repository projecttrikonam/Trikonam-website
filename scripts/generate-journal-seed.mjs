/**
 * Generate the Sanity import file for the Journal — studio/seed/journal-seed.ndjson.
 *
 * It reads the REAL local seed content (src/content/journal/*), so the migration can
 * never drift from what the site currently ships, converts each article's body into
 * Sanity Portable Text, seeds the nine editorial categories from the brief (remapping the
 * three local categories into them), and appends one fully-populated sample article that
 * exercises every custom block type.
 *
 * Run:  node scripts/generate-journal-seed.mjs
 * Then: cd studio && npx sanity dataset import ../studio/seed/journal-seed.ndjson production
 *
 * Images (hero, body images, galleries, author photo) are NOT in this file — assets are
 * uploaded in the Studio after import (see docs/JOURNAL_CMS.md).
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import ts from 'typescript';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

/** Transpile a TS content module and import it (type-only imports are erased). */
async function importTs(relPath) {
  const src = readFileSync(resolve(root, relPath), 'utf8');
  const js = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const dataUri = 'data:text/javascript;base64,' + Buffer.from(js).toString('base64');
  return import(dataUri);
}

const { articles } = await importTs('src/content/journal/articles.ts');
const { authors } = await importTs('src/content/journal/authors.ts');
const { series } = await importTs('src/content/journal/series.ts');

// --- Taxonomy: the nine editorial categories from the brief ---------------------
const CATEGORIES = [
  ['classical-hatha-yoga', 'Classical Hatha Yoga', 'The practices themselves — how to begin, and how to keep going.'],
  ['wellbeing', 'Wellbeing', 'Living well around the practice — breath, rest, food, and daily rhythm.'],
  ['meditation-mind', 'Meditation & Mind', 'Stillness, attention, and the inner dimension of the practice.'],
  ['science-research', 'Science & Research', 'What contemporary understanding says about yoga and the body.'],
  ['stories', 'Stories', 'Voices and experiences from the Trikonam community.'],
  ['lifestyle', 'Lifestyle', 'Food, sleep, and the small habits that hold a practice together.'],
  ['community', 'Community', 'News, gatherings, and life around the school.'],
  ['retreat-journal', 'Retreat Journal', 'Notes and reflections from our retreats.'],
  ['the-art-of-noticing', 'The Art of Noticing', 'Quiet essays on the ideas beneath the practice.'],
];

/** Map the three local category slugs onto the nine editorial categories. */
const CATEGORY_REMAP = {
  practice: 'classical-hatha-yoga',
  philosophy: 'the-art-of-noticing',
  'well-being': 'wellbeing',
};

const catId = (slug) => `category-${slug}`;
const tagId = (slug) => `tag-${slug}`;
const authorId = (slug) => `author-${slug}`;
const seriesId = (slug) => `series-${slug}`;
const articleId = (slug) => `article-${slug}`;
const ref = (id) => ({ _type: 'reference', _ref: id });
const slugField = (current) => ({ _type: 'slug', current });
const toDateTime = (iso) => (iso.length <= 10 ? `${iso}T09:00:00.000Z` : iso);

// --- Portable Text conversion (local union body → Sanity PT) --------------------
const span = (key, text, marks = []) => ({ _type: 'span', _key: key, text, marks });
const block = (key, style, children, extra = {}) => ({
  _type: 'block',
  _key: key,
  style,
  markDefs: [],
  children,
  ...extra,
});

function convertBody(body, base) {
  const out = [];
  body.forEach((b, i) => {
    const k = `${base}-b${i}`;
    if (b._type === 'paragraph') {
      out.push(block(k, 'normal', [span(`${k}s`, b.text)]));
    } else if (b._type === 'heading') {
      out.push(block(k, `h${b.level || 2}`, [span(`${k}s`, b.text)]));
    } else if (b._type === 'quote') {
      // Local editorial quotes carry an optional attribution → pull quote object.
      out.push({ _type: 'pullQuote', _key: k, text: b.text, ...(b.attribution ? { attribution: b.attribution } : {}) });
    } else if (b._type === 'list') {
      const listItem = b.style === 'number' ? 'number' : 'bullet';
      (b.items || []).forEach((item, j) => {
        const ik = `${k}-i${j}`;
        out.push(block(ik, 'normal', [span(`${ik}s`, item)], { listItem, level: 1 }));
      });
    }
  });
  return out;
}

// --- Build documents ------------------------------------------------------------
const docs = [];

// Categories
CATEGORIES.forEach(([slug, title, description], i) => {
  docs.push({ _id: catId(slug), _type: 'category', title, slug: slugField(slug), description, order: (i + 1) * 10 });
});

// Author(s)
authors.forEach((a) => {
  docs.push({
    _id: authorId(a.slug),
    _type: 'author',
    name: a.name,
    slug: slugField(a.slug),
    designation: a.designation ?? a.role ?? undefined,
    bio: [
      block(`${authorId(a.slug)}-bio`, 'normal', [
        span(
          `${authorId(a.slug)}-bios`,
          'Trikonam is a school of Classical Hatha Yoga, offering these practices in their original form under experienced guidance.',
        ),
      ]),
    ],
  });
});

// Series
series.forEach((s) => {
  docs.push({
    _id: seriesId(s.slug),
    _type: 'series',
    title: s.title,
    slug: slugField(s.slug),
    ...(s.description ? { description: s.description } : {}),
  });
});

// Tags (collected from articles)
const tagSet = new Map();
articles.forEach((a) => (a.tags || []).forEach((t) => tagSet.set(t, t)));
for (const slug of tagSet.keys()) {
  const title = slug.replace(/(^|-)([a-z])/g, (_, s, c) => (s ? ' ' : '') + c.toUpperCase());
  docs.push({ _id: tagId(slug), _type: 'tag', title, slug: slugField(slug) });
}

// Articles (migrated from local seed)
articles.forEach((a) => {
  const catSlug = CATEGORY_REMAP[a.category] || a.category;
  docs.push({
    _id: articleId(a.slug),
    _type: 'article',
    title: a.title,
    ...(a.subtitle ? { subtitle: a.subtitle } : {}),
    slug: slugField(a.slug),
    excerpt: a.excerpt,
    body: convertBody(a.body, articleId(a.slug)),
    author: ref(authorId(a.author)),
    category: ref(catId(catSlug)),
    ...(a.series ? { series: ref(seriesId(a.series)) } : {}),
    tags: (a.tags || []).map((t) => ({ _type: 'reference', _ref: tagId(t), _key: `${a.slug}-${t}` })),
    featured: Boolean(a.featured),
    publishedAt: toDateTime(a.publishedAt),
    ...(a.updatedAt ? { updatedAt: toDateTime(a.updatedAt) } : {}),
  });
});

// --- Write NDJSON ---------------------------------------------------------------
const outDir = resolve(root, 'studio/seed');
mkdirSync(outDir, { recursive: true });
const outFile = resolve(outDir, 'journal-seed.ndjson');
writeFileSync(outFile, docs.map((d) => JSON.stringify(d)).join('\n') + '\n', 'utf8');

const counts = docs.reduce((m, d) => ((m[d._type] = (m[d._type] || 0) + 1), m), {});
console.log(`Wrote ${docs.length} documents → studio/seed/journal-seed.ndjson`);
console.log(counts);
