import { defineType } from 'sanity';

/**
 * Per-article SEO overrides. All optional — the site falls back to the article's title,
 * excerpt, and hero image when a field is empty.
 */
export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    {
      name: 'metaTitle',
      title: 'Meta title',
      type: 'string',
      description: 'Overrides the article title in the <title> tag and social cards.',
      validation: (r) => r.max(70).warning('Keep under ~70 characters.'),
    },
    {
      name: 'metaDescription',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      description: 'Overrides the excerpt for search engines and social cards.',
      validation: (r) => r.max(180).warning('Keep under ~180 characters.'),
    },
    {
      name: 'ogImage',
      title: 'Social share image',
      type: 'image',
      description: 'Overrides the hero image for social cards (1200×630 recommended).',
      options: { hotspot: true },
    },
    {
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
      description: 'Only set if this article was first published elsewhere.',
    },
    {
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      initialValue: false,
    },
  ],
});
