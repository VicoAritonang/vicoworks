import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { featuredProjects } from '@/content/projects';
import type { Project } from '@/content/types';
import { ArchitectureDiagram } from './ArchitectureDiagram';
import { VideoThumb } from './VideoThumb';
import { SectionHeading, StackList, StatusBadge } from './ui';

/* Work comes before skills, because a skill list is a claim and a system is
   evidence. Each entry is full-width rather than one of three cards: three
   substantial projects deserve room, and the diagram needs it to stay legible. */

function Entry({ project }: { project: Project }) {
  const href = `/projects/${project.slug}`;

  return (
    <article className="border-t border-line py-12 first:border-t-0 first:pt-0 md:py-16">
      {/* The still sits beside the description rather than under it: at this
          width a full-bleed thumbnail would push the third project off the
          screen entirely, and the point of this section is that all three are
          visible without scrolling past one. */}
      <div className="grid gap-8 md:grid-cols-[minmax(0,26rem)_1fr] md:items-start md:gap-12">
        {project.video && project.caseStudy && (
          <VideoThumb video={project.video} href={href} label="Walkthrough" />
        )}

        <div className="min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="display-3 text-fg">{project.name}</h3>
              <p className="kicker mt-2">
                {project.year} · {project.role}
              </p>
            </div>
            <StatusBadge status={project.status} />
          </div>

          <p className="mt-5 text-base leading-relaxed text-muted">{project.oneLiner}</p>
          <p className="mt-4 text-sm leading-relaxed text-muted">{project.outcome}</p>
          <StackList items={project.stack} className="mt-5" />
        </div>
      </div>

      {project.diagram && (
        <ArchitectureDiagram
          spec={project.diagram}
          variant="spine"
          align="start"
          className="mt-10"
        />
      )}

      <div className="mt-8 border-t border-line pt-6">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          {project.caseStudy && (
            <Link
              href={href}
              className="group inline-flex items-center gap-2 text-sm text-fg transition-colors hover:text-accent"
            >
              Read the case study
              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          )}
          {project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
            >
              Visit {project.links.live.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export function SelectedWork() {
  return (
    <section id="work" className="section px-4 sm:px-6" aria-labelledby="work-heading">
      <div className="container mx-auto">
        <SectionHeading
          id="work-heading"
          kicker="Selected work"
          title="Three systems, and how they are put together."
          lede="Each one is a working product rather than a tutorial. The diagrams are drawn from the same data the text is, so they cannot drift apart."
        />

        <div className="mt-14">
          {featuredProjects.map((project) => (
            <Entry key={project.slug} project={project} />
          ))}
        </div>

        <Link
          href="/projects"
          className="group mt-12 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
        >
          Everything else I have built
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
