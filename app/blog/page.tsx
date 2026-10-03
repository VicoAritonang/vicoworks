import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell } from '@/components/site/PageShell';
import { formatDate, getPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Writing by Vico Aritonang on agentic AI, automation, Go and cloud infrastructure.',
  alternates: { canonical: '/blog', types: { 'application/rss+xml': '/rss' } },
};

export default function BlogPage() {
  const posts = getPosts();

  return (
    <PageShell eyebrow="From the desk" title="Thoughts &" accent="writings" description="Notes on building agents, automation and the infrastructure underneath.">
      {posts.length === 0 ? (
        <div className="mx-auto flex max-w-md flex-col items-center gap-5 py-10 text-center">
          <div className="relative grid size-20 place-items-center rounded-[22px] border-2 p-2">
            <div className="grid size-full place-items-center rounded-xl bg-[#EDEEF0] shadow-inner dark:bg-white/[0.04]">
              <svg viewBox="0 0 24 24" className="size-7 text-neutral-500" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 20l4-1L19 8a2.1 2.1 0 0 0-3-3L5 16zM14 7l3 3" />
              </svg>
            </div>
          </div>
          <h2 className="font-display text-2xl">The first post is being written</h2>
          <p className="font-light text-muted">
            Nothing published yet. Subscribe to the{' '}
            <a href="/rss" className="underline underline-offset-4">
              RSS feed
            </a>{' '}
            and it will show up the moment it lands.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="group flex h-full flex-col rounded-3xl p-2.5 ring-1 ring-line transition-all duration-300 hover:bg-neutral-50 dark:hover:bg-neutral-900/40"
            >
              <div className="relative aspect-[16/11] overflow-hidden rounded-2xl">
                <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105" style={{ background: p.cover }} />
                <div className="absolute inset-0 bg-black/25 dark:bg-black/40" />
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <span className="text-center text-xl leading-snug tracking-tight text-balance text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)]">{p.title}</span>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-2 p-3">
                <h2 className="font-display text-xl leading-snug">{p.title}</h2>
                <p className="line-clamp-3 text-sm font-light text-muted">{p.description}</p>
                <div className="mt-auto flex items-center justify-between pt-3 font-mono text-[11px] text-muted uppercase">
                  <span>{formatDate(p.date)}</span>
                  <span className="flex items-center gap-1 transition-colors group-hover:text-foreground">
                    Read article
                    <svg viewBox="0 0 24 24" className="size-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </PageShell>
  );
}
