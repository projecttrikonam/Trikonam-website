import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { BreathMark } from '@/components/ui/BreathMark';
import { Button } from '@/components/ui/Button';

// Calm 404 (Handoff tone). Static export renders this as /404.html.
export default function NotFound() {
  return (
    <Section tone="bg" width="narrow" className="min-h-[60vh] text-center">
      <div className="relative mx-auto">
        <BreathMark
          className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2"
          opacity={0.25}
        />
        <div className="relative">
          <span className="eyebrow mb-4 block">Page not found</span>
          <h1 className="text-h1">This path leads nowhere — for now.</h1>
          <p className="prose-measure mx-auto mt-5 text-body-lg text-secondary">
            The page you were looking for isn’t here. Return home, or explore the
            practices at your own pace.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button href="/" variant="primary">
              Return home
            </Button>
            <Link href="/practices" className="link-underline self-center text-moss">
              Explore the practices
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
