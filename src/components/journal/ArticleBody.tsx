import type { PortableBlock } from '@/content/journal/types';

/**
 * Renders an article body from portable-text-like blocks.
 *
 * This is the presentation half of the content/presentation split: it knows how each
 * block LOOKS, the data knows what each block SAYS. When migrating to Sanity, replace
 * this component with `@portabletext/react`'s <PortableText components={...} /> and move
 * these styles into its `components` map — the block shapes already match.
 */
export function ArticleBody({ blocks }: { blocks: PortableBlock[] }) {
  return (
    <div className="prose-measure mx-auto space-y-6 text-body-lg leading-[1.75] text-secondary">
      {blocks.map((block, i) => {
        switch (block._type) {
          case 'heading':
            return block.level === 2 ? (
              <h2 key={i} className="!mt-14 pt-2 font-serif text-h2 text-primary">
                {block.text}
              </h2>
            ) : (
              <h3 key={i} className="!mt-10 font-serif text-h3 text-primary">
                {block.text}
              </h3>
            );
          case 'paragraph':
            return <p key={i}>{block.text}</p>;
          case 'quote':
            return (
              <blockquote key={i} className="!my-12 border-l-2 border-gold/60 pl-6">
                <p className="font-serif text-[1.4rem] italic leading-[1.5] text-primary">
                  {block.text}
                </p>
                {block.attribution && (
                  <cite className="mt-3 block text-[0.78rem] uppercase not-italic tracking-[0.16em] text-moss">
                    — {block.attribution}
                  </cite>
                )}
              </blockquote>
            );
          case 'list':
            return block.style === 'number' ? (
              <ol key={i} className="list-decimal space-y-2 pl-6 marker:text-moss">
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ol>
            ) : (
              <ul key={i} className="list-disc space-y-2 pl-6 marker:text-moss">
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            );
          case 'image':
            return (
              <figure key={i} className="!my-10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={block.src}
                  alt={block.alt}
                  className="w-full rounded-[10px] shadow-soft ring-1 ring-black/5"
                />
                {block.caption && (
                  <figcaption className="mt-3 text-center text-[0.85rem] text-secondary">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
