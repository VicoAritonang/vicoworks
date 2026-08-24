import Link from 'next/link';
import { ArrowRight, FileText } from 'lucide-react';
import { research } from '@/content/projects';
import { publishable } from '@/content/types';
import { ArchitectureDiagram } from './ArchitectureDiagram';
import { SectionHeading, StackList } from './ui';

/* One research block, one result. It sits after the shipped work because a
   benchmark is evidence of a different kind — useful, but not the thing an
   engineering team hires for first. */

export function Research() {
  const results = research.caseStudy ? publishable(research.caseStudy.results) : [];

  return (
    <section id="research" className="section px-4 sm:px-6" aria-labelledby="research-heading">
      <div className="container mx-auto">
        <SectionHeading
          id="research-heading"
          kicker="Research"
          title="Optimizing robot tutor strategies."
          lede={research.oneLiner}
        />

        <ArchitectureDiagram spec={research.diagram!} variant="spine" className="mt-10" />

        <div className="mt-10 grid gap-8 border-t border-line pt-8 md:grid-cols-[1fr_auto] md:gap-12">
          <div>
            <ul className="space-y-2.5">
              {results.map((result) => (
                <li key={result} className="flex gap-3 text-sm leading-relaxed text-muted">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-line-2" aria-hidden="true" />
                  <span>{result}</span>
                </li>
              ))}
            </ul>
            <StackList items={research.stack} className="mt-6" />
          </div>

          <div className="flex flex-col gap-3 md:items-end">
            <Link
              href={`/projects/${research.slug}`}
              className="group inline-flex items-center gap-2 text-sm text-fg transition-colors hover:text-accent"
            >
              Read the write-up
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
            {research.links.paper && (
              <a
                href={research.links.paper}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
              >
                <FileText size={15} aria-hidden="true" />
                Full paper (PDF)
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
