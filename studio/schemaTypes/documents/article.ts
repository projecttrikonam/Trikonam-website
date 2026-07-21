import { defineType, defineField } from 'sanity';

/** Practice slugs — must match src/content/practices.ts in the website. */
const PRACTICE_OPTIONS = [
  { title: 'Upa-Yoga', value: 'upa-yoga' },
  { title: 'Surya Kriya', value: 'surya-kriya' },
  { title: 'Surya Shakti', value: 'surya-shakti' },
  { title: 'Angamardhana', value: 'angamardhana' },
  { title: 'Yogasanas', value: 'yogasanas' },
  { title: 'Bhuta Shuddhi', value: 'bhuta-shuddhi' },
  { title: 'Eye Care (Sunayana)', value: 'sunayana-eye-care' },
  { title: 'Shanmukhi Mudra', value: 'shanmukhi-mudra' },
  { title: 'Bhastrika Kriya', value: 'bhastrika-kriya' },
  { title: 'Pavanamuktasana', value: 'pavanamuktasana' },
  { title: 'Pregnancy Yoga', value: 'pregnancy-yoga' },
];

/** Program / learning-format keys — must match the website's routes. */
const PROGRAM_OPTIONS = [
  { title: 'Online Programs', value: 'online-programs' },
  { title: 'Group Workshops', value: 'group-workshops' },
  { title: 'Private One-to-One Guidance', value: 'private-guidance' },
  { title: "Children's Yoga", value: 'childrens-yoga' },
  { title: 'Retreats', value: 'retreats' },
  { title: 'Corporate Wellness', value: 'corporate-wellness' },
];

export const article = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'meta', title: 'Details' },
    { name: 'related', title: 'Related' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', group: 'content', validation: (r) => r.required() }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'string', group: 'content', description: 'Optional — a quiet second line beneath the title.' }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt text', validation: (r) => r.required() }],
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'One or two sentences — shown on cards and used as the meta description fallback.',
      validation: (r) => r.required().max(220),
    }),
    defineField({ name: 'body', title: 'Body', type: 'blockContent', group: 'content' }),

    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
      group: 'meta',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      group: 'meta',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'series',
      title: 'Series (optional)',
      type: 'reference',
      to: [{ type: 'series' }],
      group: 'meta',
    }),
    defineField({
      name: 'seriesOrder',
      title: 'Position in series',
      type: 'number',
      group: 'meta',
      description: 'Lower numbers appear earlier within the series.',
      hidden: ({ document }) => !document?.series,
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'tag' }] }],
      group: 'meta',
    }),
    defineField({
      name: 'featured',
      title: 'Featured article',
      type: 'boolean',
      group: 'meta',
      initialValue: false,
      description: 'The most recent featured article headlines the Journal homepage.',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publish date',
      type: 'datetime',
      group: 'meta',
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Last updated (optional)',
      type: 'datetime',
      group: 'meta',
    }),

    defineField({
      name: 'relatedPractices',
      title: 'Related practices',
      type: 'array',
      group: 'related',
      of: [{ type: 'string' }],
      options: { list: PRACTICE_OPTIONS },
    }),
    defineField({
      name: 'relatedPrograms',
      title: 'Related programs',
      type: 'array',
      group: 'related',
      of: [{ type: 'string' }],
      options: { list: PROGRAM_OPTIONS },
    }),

    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  orderings: [
    { title: 'Newest', name: 'publishedDesc', by: [{ field: 'publishedAt', direction: 'desc' }] },
    { title: 'Oldest', name: 'publishedAsc', by: [{ field: 'publishedAt', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', subtitle: 'category.title', media: 'heroImage', date: 'publishedAt' },
    prepare({ title, subtitle, media, date }) {
      const d = date ? new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Draft';
      return { title, subtitle: [subtitle, d].filter(Boolean).join(' · '), media };
    },
  },
});
