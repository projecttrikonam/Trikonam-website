import { PortableText, type PortableTextComponents } from '@portabletext/react';
import type { PortableBlock } from '@/content/journal/types';
import { headingId } from '@/lib/journal-toc';
import { urlForImage } from '@/sanity/image';

/**
 * Renders an article body — the presentation half of the content/presentation split.
 * One component handles BOTH sources: Sanity native Portable Text (`_type: 'block'` +
 * custom types) and the local seed union (`paragraph`/`heading`/`quote`/`list`/`image`).
 * All styles use the existing Trikonam tokens; nothing new visually.
 */

// --- helpers -----------------------------------------------------------------
function textOfBlock(value: unknown): string {
  const v = value as Record<string, unknown>;
  if (typeof v?.text === 'string') return v.text;
  if (Array.isArray(v?.children)) {
    return (v.children as Array<{ text?: string }>).map((c) => c?.text ?? '').join('');
  }
  return '';
}

/** YouTube / Vimeo watch URL → embeddable URL. */
function embedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) return `https://www.youtube-nocookie.com/embed/${u.pathname.slice(1)}`;
    if (u.hostname.includes('youtube.com')) {
      const id = u.searchParams.get('v');
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (u.hostname.includes('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch {
    /* ignore */
  }
  return null;
}

function imageSrc(value: Record<string, unknown>, width: number): string | null {
  if (value.asset) {
    const b = urlForImage(value as never);
    return b ? b.width(width).quality(80).auto('format').url() : null;
  }
  if (typeof value.src === 'string') return value.src; // local seed
  return null;
}

const CALLOUT_TONE: Record<string, { label: string; ring: string; accent: string }> = {
  note: { label: 'Note', ring: 'border-moss/25 bg-moss/[0.05]', accent: 'text-moss' },
  tip: { label: 'Tip', ring: 'border-gold/30 bg-gold/[0.05]', accent: 'text-gold' },
  reflection: { label: 'Reflection', ring: 'border-border bg-surface/60', accent: 'text-secondary' },
};

// --- component ---------------------------------------------------------------
export function ArticleBody({ blocks }: { blocks: PortableBlock[] }) {
  // Assign footnote numbers in document order (Sanity markDefs).
  const footnotes: { key: string; text: string; n: number }[] = [];
  const footnoteN = new Map<string, number>();
  for (const raw of blocks) {
    const b = raw as Record<string, unknown>;
    if (b._type === 'block' && Array.isArray(b.markDefs)) {
      for (const def of b.markDefs as Array<Record<string, unknown>>) {
        if (def._type === 'footnote' && !footnoteN.has(def._key as string)) {
          const n = footnotes.length + 1;
          footnoteN.set(def._key as string, n);
          footnotes.push({ key: def._key as string, text: (def.text as string) ?? '', n });
        }
      }
    }
  }

  // De-dupe heading ids exactly as extractHeadings() does, in render order.
  const headingCount = new Map<string, number>();
  const nextHeadingId = (text: string) => {
    const base = headingId(text);
    const seen = headingCount.get(base) ?? 0;
    headingCount.set(base, seen + 1);
    return seen > 0 ? `${base}-${seen + 1}` : base;
  };

  const LocalList = ({ value }: { value: Record<string, unknown> }) => {
    const items = (value.items as string[]) ?? [];
    return value.style === 'number' ? (
      <ol className="list-decimal space-y-2 pl-6 marker:text-moss">
        {items.map((it, j) => <li key={j}>{it}</li>)}
      </ol>
    ) : (
      <ul className="list-disc space-y-2 pl-6 marker:text-moss">
        {items.map((it, j) => <li key={j}>{it}</li>)}
      </ul>
    );
  };

  const Figure = ({ value }: { value: Record<string, unknown> }) => {
    const src = imageSrc(value, 1400);
    if (!src) return null;
    return (
      <figure className="!my-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={(value.alt as string) ?? ''} loading="lazy" decoding="async" className="w-full rounded-[10px] shadow-soft ring-1 ring-black/5" />
        {typeof value.caption === 'string' && value.caption && (
          <figcaption className="mt-3 text-center text-caption text-secondary">{value.caption}</figcaption>
        )}
      </figure>
    );
  };

  const components: PortableTextComponents = {
    block: {
      normal: ({ children }) => <p>{children}</p>,
      h2: ({ children, value }) => (
        <h2 id={nextHeadingId(textOfBlock(value))} className="scroll-mt-28 !mt-14 pt-2 font-serif text-h2 text-primary">
          {children}
        </h2>
      ),
      h3: ({ children, value }) => (
        <h3 id={nextHeadingId(textOfBlock(value))} className="scroll-mt-28 !mt-10 font-serif text-h3 text-primary">
          {children}
        </h3>
      ),
      blockquote: ({ children }) => (
        <blockquote className="!my-12 border-l-2 border-gold/60 pl-6">
          <p className="font-serif text-[1.4rem] italic leading-[1.5] text-primary">{children}</p>
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => <ul className="list-disc space-y-2 pl-6 marker:text-moss">{children}</ul>,
      number: ({ children }) => <ol className="list-decimal space-y-2 pl-6 marker:text-moss">{children}</ol>,
    },
    listItem: {
      bullet: ({ children }) => <li>{children}</li>,
      number: ({ children }) => <li>{children}</li>,
    },
    marks: {
      strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
      em: ({ children }) => <em>{children}</em>,
      link: ({ children, value }) => {
        const href = (value?.href as string) ?? '#';
        const external = /^https?:\/\//.test(href);
        return (
          <a href={href} className="link-underline text-moss hover:text-moss-dark" {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
            {children}
          </a>
        );
      },
      footnote: ({ children, markKey }) => {
        const n = markKey ? footnoteN.get(markKey) : undefined;
        if (!n) return <>{children}</>;
        return (
          <>
            {children}
            <sup id={`fnref-${n}`} className="ml-0.5">
              <a href={`#fn-${n}`} className="text-moss no-underline">[{n}]</a>
            </sup>
          </>
        );
      },
    },
    types: {
      // Local seed blocks
      paragraph: ({ value }) => <p>{(value as { text: string }).text}</p>,
      heading: ({ value }) => {
        const v = value as { level: 2 | 3; text: string };
        const id = nextHeadingId(v.text);
        return v.level === 2 ? (
          <h2 id={id} className="scroll-mt-28 !mt-14 pt-2 font-serif text-h2 text-primary">{v.text}</h2>
        ) : (
          <h3 id={id} className="scroll-mt-28 !mt-10 font-serif text-h3 text-primary">{v.text}</h3>
        );
      },
      quote: ({ value }) => {
        const v = value as { text: string; attribution?: string };
        return (
          <blockquote className="!my-12 border-l-2 border-gold/60 pl-6">
            <p className="font-serif text-[1.4rem] italic leading-[1.5] text-primary">{v.text}</p>
            {v.attribution && (
              <cite className="mt-3 block text-label uppercase not-italic tracking-[0.16em] text-moss">— {v.attribution}</cite>
            )}
          </blockquote>
        );
      },
      list: ({ value }) => <LocalList value={value as Record<string, unknown>} />,
      image: ({ value }) => <Figure value={value as Record<string, unknown>} />,

      // Sanity custom blocks
      pullQuote: ({ value }) => {
        const v = value as { text: string; attribution?: string };
        return (
          <figure className="!my-14 text-center">
            <span aria-hidden className="mx-auto mb-1 block font-serif text-[3.25rem] leading-[0.7] text-gold/40">&ldquo;</span>
            <blockquote className="text-balance font-serif text-[clamp(1.3rem,2.6vw,1.9rem)] font-normal leading-[1.4] text-primary">
              {v.text}
            </blockquote>
            {v.attribution && (
              <figcaption className="mt-6 text-label uppercase tracking-[0.2em] text-moss">— {v.attribution}</figcaption>
            )}
          </figure>
        );
      },
      callout: ({ value }) => {
        const v = value as { tone?: string; title?: string; body?: PortableBlock[] };
        const tone = CALLOUT_TONE[v.tone ?? 'note'] ?? CALLOUT_TONE.note;
        return (
          <aside className={`!my-10 rounded-[12px] border ${tone.ring} px-6 py-5`}>
            <p className={`mb-2 text-micro font-medium uppercase tracking-[0.16em] ${tone.accent}`}>
              {v.title || tone.label}
            </p>
            <div className="space-y-3 text-body text-secondary [&_a]:text-moss [&_a]:underline">
              {v.body ? <PortableText value={v.body as never} components={{ block: { normal: ({ children }) => <p>{children}</p> } }} /> : null}
            </div>
          </aside>
        );
      },
      gallery: ({ value }) => {
        const v = value as { images?: Array<Record<string, unknown>>; caption?: string };
        const imgs = v.images ?? [];
        if (!imgs.length) return null;
        return (
          <figure className="!my-10">
            <div className={`grid gap-3 ${imgs.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
              {imgs.map((img, j) => {
                const src = imageSrc(img, 900);
                return src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={j} src={src} alt={(img.alt as string) ?? ''} loading="lazy" decoding="async" className="h-full w-full rounded-[10px] object-cover shadow-soft ring-1 ring-black/5" />
                ) : null;
              })}
            </div>
            {v.caption && <figcaption className="mt-3 text-center text-caption text-secondary">{v.caption}</figcaption>}
          </figure>
        );
      },
      videoEmbed: ({ value }) => {
        const v = value as { url: string; title?: string };
        const src = embedUrl(v.url);
        if (!src) return null;
        return (
          <figure className="!my-10">
            <div className="relative aspect-video w-full overflow-hidden rounded-[10px] shadow-soft ring-1 ring-black/5">
              <iframe
                src={src}
                title={v.title || 'Video'}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
            {v.title && <figcaption className="mt-3 text-center text-caption text-secondary">{v.title}</figcaption>}
          </figure>
        );
      },
    },
    hardBreak: () => <br />,
  };

  return (
    <div className="prose-measure mx-auto space-y-6 text-body-lg leading-[1.75] text-secondary">
      <PortableText value={blocks as never} components={components} />

      {footnotes.length > 0 && (
        <section className="!mt-16 border-t border-border pt-8">
          <h2 className="mb-4 text-label uppercase tracking-[0.16em] text-secondary">References</h2>
          <ol className="space-y-2 text-body text-secondary">
            {footnotes.map((f) => (
              <li key={f.key} id={`fn-${f.n}`} className="flex gap-2">
                <span className="text-moss">{f.n}.</span>
                <span>
                  {f.text}{' '}
                  <a href={`#fnref-${f.n}`} className="text-label text-moss">Back to text</a>
                </span>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
