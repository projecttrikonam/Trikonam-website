import { defineType } from 'sanity';

/** An image gallery — a small grid of captioned images. */
export const gallery = defineType({
  name: 'gallery',
  title: 'Image gallery',
  type: 'object',
  fields: [
    {
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', type: 'string', title: 'Alt text', validation: (r) => r.required() },
            { name: 'caption', type: 'string', title: 'Caption' },
          ],
        },
      ],
      validation: (r) => r.min(2),
    },
    { name: 'caption', title: 'Gallery caption (optional)', type: 'string' },
  ],
  preview: {
    select: { images: 'images' },
    prepare({ images }) {
      const count = Array.isArray(images) ? images.length : 0;
      return { title: 'Image gallery', subtitle: `${count} image${count === 1 ? '' : 's'}` };
    },
  },
});
