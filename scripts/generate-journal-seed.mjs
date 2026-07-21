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

// --- One fully-populated sample article (exercises every non-image block) --------
const S = 'sample-a-morning-with-the-breath';
const sampleBody = [
  block('s-b0', 'normal', [
    span('s-b0s0', 'This piece is a working sample. It exists to show every kind of block the Journal can hold — headings, quotes, callouts, a pull quote, an embedded video, a list, ', []),
    span('s-b0s1', 'links', ['s-link']),
    span('s-b0s2', ', and footnotes', []),
    span('s-b0s3', '1', ['s-fn']),
    span('s-b0s4', ' — so you can see the finished shape before writing your own.', []),
  ], {
    markDefs: [
      { _key: 's-link', _type: 'link', href: 'https://trikonam.in/practices/upa-yoga' },
      { _key: 's-fn', _type: 'footnote', text: 'Footnotes render as small numbered references and collect into a References list at the foot of the article.' },
    ],
  }),
  block('s-b1', 'h2', [span('s-b1s', 'Beginning with the breath')]),
  block('s-b2', 'normal', [span('s-b2s', 'A short, honest practice met each morning changes more than a long one attempted rarely. Begin where you are; the breath will meet you there.')]),
  { _type: 'callout', _key: 's-b3', tone: 'note', title: 'A note before you begin', body: [
    block('s-b3b', 'normal', [span('s-b3bs', 'Find a quiet space and comfortable clothing. Nothing else is required — no prior experience, no special equipment.')]),
  ] },
  block('s-b4', 'h3', [span('s-b4s', 'A simple sequence')]),
  block('s-b5', 'normal', [span('s-b5s', 'Sit comfortably and let the breath settle of its own accord.')], { listItem: 'bullet', level: 1 }),
  block('s-b6', 'normal', [span('s-b6s', 'Lengthen the exhale, without forcing it.')], { listItem: 'bullet', level: 1 }),
  block('s-b7', 'normal', [span('s-b7s', 'Rest for a moment at the end of each breath.')], { listItem: 'bullet', level: 1 }),
  { _type: 'pullQuote', _key: 's-b8', text: 'In that stillness, peace is not something to be achieved; it becomes your very nature.' },
  { _type: 'callout', _key: 's-b9', tone: 'tip', title: 'A small tip', body: [
    block('s-b9b', 'normal', [span('s-b9bs', 'If the mind wanders, simply return to the sensation of the breath. The returning is the practice.')]),
  ] },
  { _type: 'videoEmbed', _key: 's-b10', url: 'https://www.youtube.com/watch?v=inpok4MKVLM', title: 'A short guided sitting' },
  { _type: 'callout', _key: 's-b11', tone: 'reflection', title: 'To carry with you', body: [
    block('s-b11b', 'normal', [span('s-b11bs', 'What would change if you met tomorrow morning a little more slowly than today?')]),
  ] },
  block('s-b12', 'blockquote', [span('s-b12s', 'We do not promise transformation. We offer the practice — and trust that consistency, not persuasion, is what creates change.')]),
];

docs.push({
  _id: articleId(S),
  _type: 'article',
  title: 'A morning with the breath',
  subtitle: 'A working sample article, showing every block the Journal can hold.',
  slug: slugField(S),
  excerpt: 'A short, honest practice met each morning changes more than a long one attempted rarely. A sample piece exercising every editorial block.',
  body: sampleBody,
  author: ref(authorId('trikonam')),
  category: ref(catId('classical-hatha-yoga')),
  series: ref(seriesId('first-steps')),
  tags: ['beginners', 'breath'].map((t) => ({ _type: 'reference', _ref: tagId(t), _key: `${S}-${t}` })),
  featured: false,
  publishedAt: toDateTime('2026-07-15'),
  updatedAt: toDateTime('2026-07-20'),
  relatedPractices: ['upa-yoga', 'surya-kriya'],
  relatedPrograms: ['online-programs', 'group-workshops'],
  seo: {
    _type: 'seo',
    metaTitle: 'A morning with the breath — Trikonam Journal',
    metaDescription: 'A sample Journal article showing the full editorial toolkit: callouts, pull quotes, video, footnotes, and more.',
    noIndex: false,
  },
});

// --- Write NDJSON ---------------------------------------------------------------
const outDir = resolve(root, 'studio/seed');
mkdirSync(outDir, { recursive: true });
const outFile = resolve(outDir, 'journal-seed.ndjson');
writeFileSync(outFile, docs.map((d) => JSON.stringify(d)).join('\n') + '\n', 'utf8');

const counts = docs.reduce((m, d) => ((m[d._type] = (m[d._type] || 0) + 1), m), {});
console.log(`Wrote ${docs.length} documents → studio/seed/journal-seed.ndjson`);
console.log(counts);
