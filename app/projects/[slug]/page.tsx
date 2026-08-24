import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, ArrowUpRight, FileText } from 'lucide-react';
import { allProjects, caseStudySlugs, getProject } from '@/content/projects';
import { publishable } from '@/content/types';
import { ArchitectureDiagram } from '@/components/ArchitectureDiagram';
import { VideoFigure } from '@/components/VideoFigure';
import { LikeButton } from '@/components/LikeButton';
import { StackList, StatusBadge } from '@/components/ui';

/* =========================================================================
   CASE STUDY
   -------------------------------------------------------------------------
   Statically generated, one real URL per project, built as a document rather
   than as a landing page:

     - the demo sits directly under the title, because a recorded walkthrough
       proves more in forty seconds than any paragraph can;
     - the facts a reader checks first (role, year, status, stack) are a
       single scannable band, not sentences to hunt through;
     - prose runs at a reading measure and stays there. Only the two things
       that are genuinely wide — the video and the architecture diagram —
       break out of the column.

   The earlier version put a small label in a left gutter beside every
   paragraph. It filled the width without using it, and every section looked
   identical from a distance, so the page read as a template.
   ========================================================================= */

const siteUrl = 'https://vicoworks.com';

/** The reading measure. Prose lives here; the video and diagram do not. */
const COLUMN = 'mx-auto w-full max-w-[46rem]';

export function generateStaticParams() {
  return caseStudySlugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return {
    title: project.name,
    description: project.oneLiner,
    alternates: { canonical: `${siteUrl}/projects/${project.slug}` },
    openGraph: {
      title: `${project.name} — ${project.role}`,
      description: project.oneLiner,
      url: `${siteUrl}/projects/${project.slug}`,
      type: 'article',
    },
  };
}

/** A section heading that carries its own number, so the page reads as a
    sequence rather than as a stack of unrelated blocks. */
function Heading({ index, title, id }: { index: string; title: string; id?: string }) {
  return (
    <div className="mb-7 flex items-baseline gap-4">
      <span className="font-mono text-xs text-faint tabular-nums">{index}</span>
      <h2 id={id} className="display-3 text-fg">
        {title}
      </h2>
    </div>
  );
}

/* "Live at datafact.site. Fully event-driven..." must yield the whole first
   sentence, so a full stop only ends one when whitespace or the string end
   follows it — otherwise a domain name truncates the line mid-word. */
function firstSentence(text: string): string {
  return /^.*?[.!?](?=\s|$)/.exec(text)?.[0] ?? text;
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0 py-4">
      <dt className="kicker">{label}</dt>
      <dd className="mt-2 text-sm leading-relaxed text-fg">{children}</dd>
    </div>
  );
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project?.caseStudy) notFound();

  const study = project.caseStudy;
  const results = publishable(study.results);
  const story = study.story ?? [];

  const studies = allProjects.filter((p) => p.caseStudy);
  const index = studies.findIndex((p) => p.slug === project.slug);
  const next = studies.length > 1 ? studies[(index + 1) % studies.length] : null;

  /* Numbering is computed rather than hard-coded, because a project without a
     story or without a diagram would otherwise leave a hole in the sequence. */
  let step = 0;
  const n = () => String(++step).padStart(2, '0');

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.name,
    description: project.oneLiner,
    url: `${siteUrl}/projects/${project.slug}`,
    creator: { '@type': 'Person', name: 'Vico Aritonang', url: siteUrl },
    keywords: project.stack.join(', '),
    ...(project.video && {
      video: {
        '@type': 'VideoObject',
        name: project.video.title,
        description: project.video.caption ?? project.oneLiner,
        embedUrl: `https://www.youtube-nocookie.com/embed/${project.video.youtubeId}`,
        thumbnailUrl: `https://i.ytimg.com/vi/${project.video.youtubeId}/hq720.jpg`,
      },
    }),
  };

  return (
    <main id="main" className="relative px-4 pt-28 pb-20 sm:px-6 sm:pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="container mx-auto max-w-6xl">
        {/* ---------- Title ---------- */}
        <header className={COLUMN}>
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 font-mono text-xs tracking-wider text-faint uppercase transition-colors hover:text-accent"
          >
            <ArrowLeft
              size={14}
              className="transition-transform group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            All projects
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2">
            <p className="kicker">{project.categories.join(' · ')}</p>
            <span className="h-3 w-px bg-line" aria-hidden="true" />
            <StatusBadge status={project.status} />
          </div>

          <h1 className="display-1 mt-5 text-fg">{project.name}</h1>
          <p className="lede mt-5">{project.oneLiner}</p>

          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
            {project.links.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-[var(--accent-fg)] transition-colors hover:bg-accent-hover"
              >
                Open the live site
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            )}
            {project.links.repo && (
              <a
                href={project.links.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
              >
                Source
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            )}
            {project.links.paper && (
              <a
                href={project.links.paper}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
              >
                <FileText size={15} aria-hidden="true" />
                Full paper (PDF)
              </a>
            )}
          </div>
        </header>

        {/* ---------- Demo ----------
            Full container width and high on the page. This is the only place
            a reader sees the software actually running. */}
        {project.video && (
          <div className="mt-12 sm:mt-14">
            <VideoFigure video={project.video} eager />
          </div>
        )}

        {/* ---------- Facts ----------
            One band, four cells, everything a reader checks before deciding
            whether to read the prose. */}
        <dl className="mt-12 grid grid-cols-2 gap-x-8 border-y border-line py-2 sm:mt-14 md:grid-cols-4">
          <Fact label="Role">{project.role}</Fact>
          <Fact label="Timeline">{project.year}</Fact>
          <Fact label="Status">{firstSentence(project.outcome)}</Fact>
          <Fact label="Core stack">{project.stack.slice(0, 3).join(' · ')}</Fact>
        </dl>

        {/* ---------- Prose ---------- */}
        <div className={`${COLUMN} mt-16 sm:mt-20`}>
          <Heading index={n()} title="What it is" id="what-it-is" />
          <p className="prose-body">{study.whatItIs}</p>

          <div className="mt-14">
            <Heading index={n()} title="The problem" id="the-problem" />
            <p className="prose-body">{study.problem}</p>
          </div>
        </div>

        {/* ---------- Story ---------- */}
        {story.length > 0 && (
          <div className={`${COLUMN} mt-20`}>
            <Heading index={n()} title="How it went" id="story" />

            <div className="space-y-14">
              {story.map((chapter, i) => {
                const paragraphs = publishable(chapter.body);
                return (
                  <section key={chapter.title}>
                    <h3 className="flex items-baseline gap-3 text-lg font-medium text-fg">
                      <span className="font-mono text-xs text-accent tabular-nums">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {chapter.title}
                    </h3>

                    <div className="mt-4 space-y-4">
                      {paragraphs.map((paragraph) => (
                        <p key={paragraph} className="prose-body">
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    {chapter.pullQuote && (
                      <blockquote className="mt-8 border-l-2 border-accent pl-6">
                        <p className="display-3 text-fg">{chapter.pullQuote}</p>
                      </blockquote>
                    )}
                  </section>
                );
              })}
            </div>
          </div>
        )}

        {/* ---------- Architecture ----------
            Breaks the reading column: the diagram needs the full width or it
            clips and forces the page into a horizontal scroll. */}
        {project.diagram && (
          <div className="mt-20">
            <div className={COLUMN}>
              <Heading index={n()} title="Architecture" id="architecture" />
            </div>
            {/* The diagram component is already a <figure>; this is only the
                panel it sits in, so the caption aligns with the drawing
                instead of with the page edge. */}
            <div className="rounded-xl border border-line bg-panel/40 px-2 py-8 sm:px-8 sm:py-10">
              <ArchitectureDiagram spec={project.diagram} variant="full" />
            </div>
          </div>
        )}

        {/* ---------- Decisions ---------- */}
        <div className={`${COLUMN} mt-20`}>
          <Heading index={n()} title="The decisions" id="decisions" />

          <ol className="space-y-10">
            {study.decisions.map((item) => (
              <li key={item.decision}>
                <h3 className="text-base font-medium text-fg">{item.decision}</h3>
                <p className="prose-body mt-3">{item.why}</p>
                <p className="mt-3 border-l-2 border-line pl-4 text-sm leading-relaxed text-muted">
                  <span className="font-mono text-[11px] tracking-[0.18em] text-faint uppercase">
                    Trade-off
                  </span>{' '}
                  {item.tradeoff}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* ---------- Results ---------- */}
        <div className={`${COLUMN} mt-20`}>
          <Heading index={n()} title="Where it landed" id="results" />

          <ul className="divide-y divide-line border-y border-line">
            {results.map((result) => (
              <li key={result} className="flex gap-4 py-4">
                <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                <span className="text-sm leading-relaxed text-fg">{result}</span>
              </li>
            ))}
          </ul>

          <div className="mt-14">
            <Heading index={n()} title="In hindsight" id="hindsight" />
            <p className="prose-body">{study.reflection}</p>
          </div>

          <div className="mt-14">
            <p className="kicker">Built with</p>
            <StackList items={project.stack} className="mt-4" />
          </div>

          <div className="mt-12">
            <LikeButton slug={project.slug} />
          </div>
        </div>

        {/* ---------- Next ----------
            A full-width handover rather than a small link, because the most
            useful thing a reader can do at the bottom of one case study is
            open the next one. */}
        {next && (
          <Link
            href={`/projects/${next.slug}`}
            className="group mt-20 block rounded-xl border border-line bg-panel/40 p-8 transition-colors hover:border-line-2 sm:p-10"
          >
            <p className="kicker">Next case study</p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <h2 className="display-2 text-fg transition-colors group-hover:text-accent">
                {next.name}
              </h2>
              <ArrowRight
                size={22}
                className="shrink-0 text-faint transition-all group-hover:translate-x-1 group-hover:text-accent"
                aria-hidden="true"
              />
            </div>
            <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-muted">{next.oneLiner}</p>
          </Link>
        )}
      </div>
    </main>
  );
}
