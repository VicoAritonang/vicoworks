import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageShell } from '@/components/site/PageShell';
import { Markdown } from '@/components/site/Markdown';
import { formatDate, getPost, getPosts } from '@/lib/blog';
import { SITE_URL } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: 'article', title: post.title, description: post.description, url: `${SITE_URL}/blog/${post.slug}`, publishedTime: post.date },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    url: `${SITE_URL}/blog/${post.slug}`,
    author: { '@id': `${SITE_URL}/#vico` },
    keywords: post.tags.join(', '),
  };

  return (
    <PageShell
      eyebrow={`${formatDate(post.date)} · ${post.readingMinutes} min read`}
      title={post.title}
      description={post.description}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="mx-auto max-w-2xl">
        {post.tags.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <span key={t} className="rounded-md bg-foreground/5 px-2.5 py-1 font-mono text-[11px] tracking-wide text-neutral-600 uppercase shadow-border dark:text-neutral-300">
                {t}
              </span>
            ))}
          </div>
        )}
        <Markdown source={post.body} />
        <div className="mt-16 border-t pt-8">
          <Link href="/blog" className="group inline-flex items-center gap-2 font-mono text-xs text-neutral-700 uppercase hover:text-black dark:text-white/70 dark:hover:text-white">
            <svg viewBox="0 0 24 24" className="size-3.5 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
            All posts
          </Link>
        </div>
      </article>
    </PageShell>
  );
}
