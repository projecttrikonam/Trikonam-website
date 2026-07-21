import type { PortableBlock } from '@/content/journal/types';

export interface Heading {
  text: string;
  level: 2 | 3;
  id: string;
}

/** Deterministic anchor id from heading text — used by both the body and the TOC. */
export function headingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80);
}

function textOf(block: Record<string, unknown>): string {
  if (typeof block.text === 'string') return block.text; // local heading
  if (Array.isArray(block.children)) {
    return (block.children as Array<{ text?: string }>).map((c) => c?.text ?? '').join('');
  }
  return '';
}

/**
 * Extract H2/H3 headings from a body (local or Sanity Portable Text) for the automatic
 * Table of Contents. Local headings carry `level`; Sanity headings carry `style` (h2/h3).
 */
export function extractHeadings(body: PortableBlock[]): Heading[] {
  const out: Heading[] = [];
  const seen = new Map<string, number>();

  for (const raw of body) {
    const block = raw as Record<string, unknown>;
    let level: 2 | 3 | null = null;

    if (block._type === 'heading' && (block.level === 2 || block.level === 3)) {
      level = block.level;
    } else if (block._type === 'block' && (block.style === 'h2' || block.style === 'h3')) {
      level = block.style === 'h2' ? 2 : 3;
    }
    if (!level) continue;

    const text = textOf(block).trim();
    if (!text) continue;

    let id = headingId(text);
    const n = seen.get(id) ?? 0;
    seen.set(id, n + 1);
    if (n > 0) id = `${id}-${n + 1}`; // de-dupe repeated headings

    out.push({ text, level, id });
  }
  return out;
}
