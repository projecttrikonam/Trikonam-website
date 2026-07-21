import { defineType } from 'sanity';

/**
 * A callout block — a quiet, boxed aside. Three calm tones matching Trikonam's palette:
 * Note (moss), Tip (gold), Reflection (a softer, contemplative variant).
 */
export const callout = defineType({
  name: 'callout',
  title: 'Callout',
  type: 'object',
  fields: [
    {
      name: 'tone',
      title: 'Type',
      type: 'string',
      initialValue: 'note',
      options: {
        list: [
          { title: 'Note', value: 'note' },
          { title: 'Tip', value: 'tip' },
          { title: 'Reflection', value: 'reflection' },
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    },
    { name: 'title', title: 'Title (optional)', type: 'string' },
    {
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{ type: 'block', styles: [{ title: 'Normal', value: 'normal' }], lists: [] }],
      validation: (r) => r.required(),
    },
  ],
  preview: {
    select: { tone: 'tone', title: 'title' },
    prepare({ tone, title }) {
      return { title: title || 'Callout', subtitle: `${(tone || 'note')[0].toUpperCase()}${(tone || 'note').slice(1)}` };
    },
  },
});
