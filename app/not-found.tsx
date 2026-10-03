import Link from 'next/link';
import { PageShell } from '@/components/site/PageShell';
import { FloodButton } from '@/components/site/ui';

export default function NotFound() {
  return (
    <PageShell eyebrow="404" title="Page not" accent="found" description="That page doesn't exist – or it moved while you weren't looking.">
      <div className="flex flex-col items-center gap-6 py-6 text-center">
        <FloodButton href="/">Back home</FloodButton>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 font-mono text-xs text-muted uppercase">
          {[
            ['Work', '/projects'],
            ['About', '/about'],
            ['Blog', '/blog'],
            ['Guestbook', '/guestbook'],
          ].map(([label, href]) => (
            <Link key={href} href={href} className="hover:text-foreground">
              {label}
            </Link>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
