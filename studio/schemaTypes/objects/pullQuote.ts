import { defineType } from 'sanity';

/** A pull quote — a larger, set-apart line drawn from (or complementing) the article. */
export const pullQuote = defineType({
  name: 'pullQuote',
  title: 'Pull quote',
  type: 'object',
  fields: [
    { name: 'text', title: 'Quote', type: 'text', rows: 3, validation: (r) => r.required() },
    { name: 'attribution', title: 'Attribution (optional)', type: 'string' },
  ],
  preview: {
    select: { text: 'text', attribution: 'attribution' },
    prepare({ text, attribution }) {
      return { title: text || 'Pull quote', subtitle: attribution ? `— ${attribution}` : 'Pull quote' };
    },
  },
});
