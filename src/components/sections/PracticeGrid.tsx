import { Card } from '@/components/ui/Card';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { practices } from '@/content/practices';

/**
 * Grid of practice cards (Handoff §6.4). Reused on the home teaser (a preview of
 * 3–4) and the full /practices hub (all eleven) via the `limit` prop.
 */
export function PracticeGrid({ limit }: { limit?: number }) {
  const items = limit ? practices.slice(0, limit) : practices;

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p, i) => (
        <RevealOnScroll as="li" key={p.slug} delay={(i % 3) * 0.05} className="h-full">
          <Card
            href={`/practices/${p.slug}`}
            title={p.name}
            eyebrow="Practice"
            excerpt={p.summary}
            image={p.image}
            imageAlt={p.imageAlt}
          />
        </RevealOnScroll>
      ))}
    </ul>
  );
}
