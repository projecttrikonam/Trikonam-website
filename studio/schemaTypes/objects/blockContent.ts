import { defineType, defineArrayMember } from 'sanity';

/**
 * The article body — Portable Text. Standard blocks (headings, paragraphs, quotes,
 * lists) plus the custom editorial blocks Trikonam uses: images with captions, callouts
 * (Note / Tip / Reflection), image galleries, embedded video, and pull quotes. Inline
 * marks include links and footnotes.
 *
 * Headings are limited to H2/H3 so the article H1 (the title) stays unique and the
 * automatic Table of Contents reads cleanly.
 */
export const blockContent = defineType({
  name: 'blockContent',
  title: 'Body',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'Heading 2', value: 'h2' },
        { title: 'Heading 3', value: 'h3' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'URL',
                validation: (r) =>
                  r.uri({ scheme: ['http', 'https', 'mailto', 'tel'], allowRelative: true }),
              },
            ],
          },
          {
            name: 'footnote',
            type: 'object',
            title: 'Footnote / reference',
            fields: [
              { name: 'text', type: 'text', title: 'Note text', rows: 3 },
            ],
          },
        ],
      },
    }),

    // Inline image with required alt + optional caption.
    defineArrayMember({
      type: 'image',
      name: 'image',
      title: 'Image',
      options: { hotspot: true },
      fields: [
        { name: 'alt', type: 'string', title: 'Alt text', validation: (r) => r.required() },
        { name: 'caption', type: 'string', title: 'Caption' },
      ],
    }),

    { type: 'callout' },
    { type: 'gallery' },
    { type: 'videoEmbed' },
    { type: 'pullQuote' },
  ],
});
