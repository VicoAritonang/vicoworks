'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Search, X } from 'lucide-react';
import type { ProjectSummary } from '@/content/types';
import { StackList, StatusBadge } from './ui';
import { VideoThumb } from './VideoThumb';

/* An index, not a gallery. The previous version gave every project a 3D tilt,
   a cursor spotlight, six floating particles and an autoplaying video embed,
   which made three projects take longer to skim than thirty should. */

function Row({ project }: { project: ProjectSummary }) {
  const body = (
    <>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="display-3 text-fg transition-colors group-hover:text-accent">{project.name}</h3>
        <span className="kicker">{project.year}</span>
      </div>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{project.oneLiner}</p>
    </>
  );

  return (
    <article className="border-b border-line py-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-10">
        {/* A still where there is one. It is the only image on the page, so a
            row with a recorded walkthrough reads as more finished than one
            without — which is exactly the ranking a reader should see. */}
        {project.video && project.hasCaseStudy && (
          <VideoThumb
            video={project.video}
            href={`/projects/${project.slug}`}
            label="Demo"
            className="md:w-56 md:shrink-0"
          />
        )}

        <div className="min-w-0 flex-1">
          {project.hasCaseStudy ? (
            <Link href={`/projects/${project.slug}`} className="group block">
              {body}
            </Link>
          ) : (
            <div className="group">{body}</div>
          )}
          <StackList items={project.stack} className="mt-4" />
        </div>

        <div className="flex shrink-0 flex-col items-start gap-3 md:items-end">
          <StatusBadge status={project.status} />
          {project.hasCaseStudy && (
            <Link
              href={`/projects/${project.slug}`}
              className="group inline-flex items-center gap-2 text-sm text-fg transition-colors hover:text-accent"
            >
              Case study
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          )}
          {project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
            >
              Visit site
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
              Paper (PDF)
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export function ProjectsList({ projects }: { projects: ProjectSummary[] }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing =
        target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
      if (e.key === '/' && !typing) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.categories.forEach((c) => set.add(c)));
    return ['All', ...Array.from(set).sort()];
  }, [projects]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.oneLiner.toLowerCase().includes(q) ||
        p.stack.some((s) => s.toLowerCase().includes(q));
      const matchesCategory = category === 'All' || p.categories.includes(category);
      return matchesQuery && matchesCategory;
    });
  }, [projects, query, category]);

  return (
    <div>
      <div className="flex flex-col gap-4 border-y border-line py-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-xs">
          <Search
            size={15}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-faint"
            aria-hidden="true"
          />
          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search — press /"
            aria-label="Search projects"
            className="w-full rounded-md border border-line bg-tint py-2 pr-8 pl-9 text-sm text-fg placeholder-faint focus:border-line-2 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute top-1/2 right-2.5 -translate-y-1/2 text-faint transition-colors hover:text-fg"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Masked at the right edge so an overflowing row reads as "there is
            more" rather than as a chip clipped by accident. */}
        <div
          className="scrollbar-hide -mx-1 flex gap-1 overflow-x-auto px-1"
          style={{
            maskImage: 'linear-gradient(to right, black calc(100% - 24px), transparent)',
            WebkitMaskImage: 'linear-gradient(to right, black calc(100% - 24px), transparent)',
          }}
        >
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`rounded-full px-3 py-1.5 text-xs whitespace-nowrap transition-colors ${
                category === item
                  ? 'bg-accent text-accent-fg'
                  : 'border border-line text-muted hover:border-line-2 hover:text-fg'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-2">
        {filtered.length > 0 ? (
          filtered.map((project) => <Row key={project.slug} project={project} />)
        ) : (
          <div className="py-16 text-center">
            <p className="text-sm text-muted">Nothing matches that.</p>
            <button
              onClick={() => {
                setQuery('');
                setCategory('All');
              }}
              className="mt-4 rounded-full border border-line px-4 py-2 text-sm text-muted transition-colors hover:border-line-2 hover:text-fg"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      <p className="mt-6 font-mono text-xs text-faint">
        {filtered.length} of {projects.length} projects
      </p>
    </div>
  );
}
