import { PageTransition } from '@/components/layout/PageTransition';

// A template re-mounts on every navigation (unlike layout), giving each route a fresh
// enter animation. See PageTransition for the fade behaviour (Handoff §4.6).
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
