import { defineType } from 'sanity';

/** An embedded video — paste a YouTube or Vimeo URL. Rendered lazily on the site. */
export const videoEmbed = defineType({
  name: 'videoEmbed',
  title: 'Video',
  type: 'object',
  fields: [
    {
      name: 'url',
      title: 'YouTube or Vimeo URL',
      type: 'url',
      validation: (r) =>
        r.required().uri({ scheme: ['http', 'https'] }),
    },
    { name: 'title', title: 'Title / caption (optional)', type: 'string' },
  ],
  preview: {
    select: { url: 'url', title: 'title' },
    prepare({ url, title }) {
      return { title: title || 'Video', subtitle: url };
    },
  },
});
