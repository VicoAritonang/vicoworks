import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { allProjects } from '@/content/projects';
import { toSummary } from '@/content/types';
import { ProjectsList } from '@/components/ProjectsList';

/* Static. Ordered by curation (`order` in content/projects.ts) rather than by
   like count — "sorted by popularity" on a portfolio of your own work is a
   ranking of nothing. */

const siteUrl = 'https://vicoworks.com';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Every project by Vico Aritonang — agentic AI systems, serverless backends, an RL research environment, and the things that did not fit on the homepage.',
  alternates: { canonical: `${siteUrl}/projects` },
};

export default function ProjectsPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Projects by Vico Aritonang',
    url: `${siteUrl}/projects`,
    itemListElement: allProjects.map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'CreativeWork',
        name: project.name,
        description: project.oneLiner,
        url: project.caseStudy
          ? `${siteUrl}/projects/${project.slug}`
          : (project.links.live ?? `${siteUrl}/projects`),
      },
    })),
  };

  return (
    <main id="main" className="relative px-4 pt-28 pb-16 sm:px-6 sm:pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="container mx-auto">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
          Back home
        </Link>

        <header className="mt-8 max-w-3xl">
          <p className="kicker">Projects</p>
          <h1 className="display-1 mt-3 text-fg">Everything I have built.</h1>
          <p className="lede mt-5">
            Shipped products, one research environment, and a couple of small tools. The three on the
            homepage are the ones worth your time first.
          </p>
        </header>

        <div className="mt-14">
          {/* Projected, not passed whole — see toSummary() in content/types.ts. */}
          <ProjectsList projects={allProjects.map(toSummary)} />
        </div>
      </div>
    </main>
  );
}
