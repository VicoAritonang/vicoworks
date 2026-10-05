import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BlockTitle, PageShell } from '@/components/site/PageShell';
import { TechIcon } from '@/components/site/TechIcon';
import { ProjectMock } from '@/components/home/ProjectMock';
import { caseStudySlugs, getProject } from '@/content/caseStudies';
import { publishable } from '@/content/caseStudyTypes';
import { FEATURED_PROJECTS } from '@/content/home';
import { SITE_URL } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudySlugs.map((slug) => ({ slug }));
}

const STATUS_LABEL = { live: 'Live', 'in-development': 'In development', research: 'Research', archived: 'Archived' } as const;
const FALLBACK_GRADIENT = 'linear-gradient(145deg, #1e293b 0%, #475569 40%, #94a3b8 75%, #cbd5e1 100%)';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProject((await params).slug);
  if (!p) return {};
  const title = `${p.name} – case study by Vico Aritonang`;
  return {
    title,
    description: `${p.oneLiner} Built by Vico Aritonang, AI engineer in Indonesia.`,
    alternates: { canonical: `/projects/${p.slug}` },
    openGraph: { type: 'article', title, description: p.oneLiner, url: `${SITE_URL}/projects/${p.slug}` },
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProject((await params).slug);
  if (!p?.caseStudy) notFound();
  const cs = p.caseStudy;
  const featured = FEATURED_PROJECTS.find((f) => f.slug === p.slug);
  const results = publishable(cs.results);

  const index = caseStudySlugs.indexOf(p.slug);
  const next = getProject(caseStudySlugs[(index + 1) % caseStudySlugs.length])!;

  const url = `${SITE_URL}/projects/${p.slug}`;
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': p.status === 'research' ? 'ScholarlyArticle' : 'CreativeWork',
      '@id': `${url}#work`,
      name: p.name,
      headline: `${p.name} – case study`,
      description: p.oneLiner,
      abstract: cs.whatItIs,
      url,
      author: { '@id': `${SITE_URL}/#vico` },
      creator: { '@id': `${SITE_URL}/#vico` },
      temporalCoverage: p.year,
      keywords: [...p.stack, ...p.categories].join(', '),
      ...(p.links.live ? { sameAs: p.links.live } : {}),
      inLanguage: 'en',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Vico Aritonang', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Projects', item: `${SITE_URL}/projects` },
        { '@type': 'ListItem', position: 3, name: p.name, item: url },
      ],
    },
  ];

  return (
    <PageShell eyebrow={`Case study · ${p.year}`} title={p.name} description={p.oneLiner}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb, visible as well as in schema. */}
      <nav aria-label="Breadcrumb" className="mb-8 font-mono text-xs text-muted uppercase">
        <Link href="/" className="hover:text-foreground">Vico Aritonang</Link>
        <span className="mx-2">/</span>
        <Link href="/projects" className="hover:text-foreground">Projects</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{p.name}</span>
      </nav>

      {/* Hero card */}
      <div className="relative mb-14 aspect-[16/10] w-full overflow-hidden rounded-3xl bg-white p-2 shadow-border sm:aspect-[16/8] dark:bg-white/[0.06]">
        <div className="relative size-full overflow-hidden rounded-2xl">
          <div className="absolute inset-0" style={{ background: featured?.gradient ?? FALLBACK_GRADIENT }} />
          <div className="relative z-10 p-5 text-white/80 sm:p-8">
            <p className="max-w-2xl text-lg text-balance sm:text-2xl">{featured?.headline ?? p.outcome}</p>
          </div>
          {featured?.image ? (
            <div className="absolute top-24 right-0 left-0 z-10 flex justify-center px-6 sm:top-32 md:px-24">
              <Image
                src={featured.image}
                alt={`${p.name} – screenshot of the live product`}
                width={1600}
                height={1000}
                priority
                sizes="(min-width: 1024px) 900px, 100vw"
                className="h-auto w-full rounded-t-md border-2 border-white/50 shadow-[0_4px_20px_rgba(0,0,0,0.4),0_15px_50px_-5px_rgba(0,0,0,0.5)]"
              />
            </div>
          ) : (
            featured?.mock && (
              <div className="absolute top-24 right-0 left-0 z-10 flex justify-center px-6 sm:top-32 md:px-24">
                <ProjectMock kind={featured.mock} />
              </div>
            )
          )}
        </div>
      </div>

      <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
        {/* Facts column */}
        <aside className="lg:col-span-4">
          <div className="flex flex-col gap-6 lg:sticky lg:top-32">
            <dl className="grid grid-cols-2 gap-4 text-sm lg:grid-cols-1">
              {[
                ['Built by', 'Vico Aritonang'],
                ['Role', p.role],
                ['Year', p.year],
                ['Status', STATUS_LABEL[p.status]],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="font-mono text-[10px] tracking-widest text-muted uppercase">{k}</dt>
                  <dd className="mt-1 font-medium">{v}</dd>
                </div>
              ))}
            </dl>
            <div>
              <div className="mb-2 font-mono text-[10px] tracking-widest text-muted uppercase">Stack</div>
              <div className="flex flex-wrap gap-1.5">
                {p.stack.map((t) => (
                  <span key={t} className="flex items-center rounded-md bg-foreground/5 px-2 py-1 font-mono text-[10px] tracking-wide text-neutral-600 uppercase shadow-border dark:text-neutral-300">
                    <TechIcon name={t} className="mr-1.5 size-3" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {p.links.live && (
                <a href={p.links.live} target="_blank" rel="noopener noreferrer" className="font-mono text-xs uppercase underline-offset-4 hover:underline">
                  Visit live site ↗
                </a>
              )}
              {p.links.paper && (
                <a href={p.links.paper} className="font-mono text-xs uppercase underline-offset-4 hover:underline">
                  Read the paper (PDF) ↗
                </a>
              )}
              {p.links.repo && (
                <a href={p.links.repo} target="_blank" rel="noopener noreferrer" className="font-mono text-xs uppercase underline-offset-4 hover:underline">
                  Source code ↗
                </a>
              )}
            </div>
          </div>
        </aside>

        {/* Story column */}
        <article className="flex flex-col gap-14 text-lg leading-relaxed font-light text-neutral-700 lg:col-span-8 dark:text-neutral-300">
          <section>
            <BlockTitle>What it is</BlockTitle>
            <p>{cs.whatItIs}</p>
          </section>
          <section>
            <BlockTitle>The problem</BlockTitle>
            <p>{cs.problem}</p>
          </section>

          {cs.story?.map((ch, i) => {
            const body = publishable(ch.body);
            return (
              <section key={ch.title}>
                <BlockTitle>{`Chapter ${String(i + 1).padStart(2, '0')}`}</BlockTitle>
                <h2 className="mb-4 font-display text-3xl text-foreground">{ch.title}</h2>
                <div className="flex flex-col gap-4">
                  {body.map((para) => (
                    <p key={para.slice(0, 32)}>{para}</p>
                  ))}
                </div>
                {ch.pullQuote && (
                  <blockquote className="my-8 border-l-2 border-indigo-400 pl-5 font-serif text-3xl leading-snug text-foreground italic">
                    &ldquo;{ch.pullQuote}&rdquo;
                  </blockquote>
                )}
              </section>
            );
          })}

          <section>
            <BlockTitle count={cs.decisions.length}>Key decisions</BlockTitle>
            <div className="flex flex-col gap-4">
              {cs.decisions.map((d) => (
                <div key={d.decision} className="rounded-2xl bg-surface p-5 ring-1 ring-line">
                  <h3 className="font-display text-xl text-foreground">{d.decision}</h3>
                  <p className="mt-2 text-base">{d.why}</p>
                  <p className="mt-3 text-sm text-muted">
                    <span className="font-mono text-[10px] tracking-widest uppercase">Trade-off · </span>
                    {d.tradeoff}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {results.length > 0 && (
            <section>
              <BlockTitle>Results</BlockTitle>
              <ul className="flex flex-col gap-2">
                {results.map((r) => (
                  <li key={r} className="flex gap-3">
                    <svg viewBox="0 0 24 24" className="mt-1 size-5 shrink-0 fill-indigo-500 drop-shadow-[0_0_10px_rgb(99_102_241/0.7)]" aria-hidden="true">
                      <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" />
                    </svg>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <BlockTitle>Looking back</BlockTitle>
            <p>{cs.reflection}</p>
          </section>

          <Link
            href={`/projects/${next.slug}`}
            className="group mt-4 flex items-center justify-between gap-6 rounded-2xl bg-surface p-5 ring-1 ring-line transition-colors hover:bg-surface-hover"
          >
            <span>
              <span className="block font-mono text-[10px] tracking-widest text-muted uppercase">Next case study</span>
              <span className="font-display text-2xl text-foreground">{next.name}</span>
            </span>
            <svg viewBox="0 0 24 24" className="size-6 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </article>
      </div>
    </PageShell>
  );
}
