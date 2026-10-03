import { getProjects } from '@/lib/data';
import { ProjectsList } from '@/components/ProjectsList';
import { VisitorCounter } from '@/components/VisitorCounter';
import { SiteNav } from '@/components/home/SiteNav';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import { LOCATION, SITE_URL } from '@/lib/seo';

/* Was `force-dynamic`, which means Googlebot's crawl of /projects triggered a
   live Supabase query — and rendered an empty page if that query failed. ISR
   serves a cached HTML page to every crawl and refreshes it hourly, so the
   page is fast, always populated, and still current. */
export const revalidate = 3600;

const description =
  'AI engineering and automation projects by Vico Aritonang, an Indonesian AI engineer in Depok, Greater Jakarta — agentic AI systems, LLM and RAG applications, Go backends, and serverless cloud architecture on GCP and AWS.';

export const metadata: Metadata = {
  title: 'AI Engineering Projects',
  description,
  alternates: { canonical: '/projects' },
  openGraph: {
    /* Re-stating siteName and locale is not redundant: a page-level
       `openGraph` replaces the root object rather than merging into it, so
       anything omitted here is simply absent from the tag output. */
    title: 'AI Engineering Projects | Vico Aritonang',
    description,
    url: `${SITE_URL}/projects`,
    siteName: 'Vico Aritonang — AI Engineer',
    locale: 'en_ID',
    type: 'website',
  },
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  // Structured Data for Projects Page
  const projectsStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${SITE_URL}/projects#page`,
    url: `${SITE_URL}/projects`,
    name: 'AI Engineering Projects by Vico Aritonang',
    description,
    inLanguage: 'en-ID',
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#vico` },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: projects.length,
      itemListElement: projects.slice(0, 20).map((project, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'CreativeWork',
          name: project.projectName,
          description: project.description,
          url: project.project_url || `${SITE_URL}/projects`,
          author: { '@id': `${SITE_URL}/#vico` },
          locationCreated: { '@type': 'Place', name: LOCATION.label },
        },
      })),
    },
  };

  /* Breadcrumbs give Google the site hierarchy and replace the raw URL in the
     result snippet with "vicoworks.com › Projects". */
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Vico Aritonang', item: SITE_URL },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Projects',
        item: `${SITE_URL}/projects`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <SiteNav />
      <main className="min-h-screen relative font-sans bg-background overflow-hidden">
        <VisitorCounter />
        <div className="spec-grid pointer-events-none fixed inset-0 z-0" aria-hidden="true" />

        <div className="container mx-auto px-4 sm:px-6 pt-20 sm:pt-28 pb-6 sm:pb-10 relative z-10">
          {/* Header */}
          <div className="mb-8 sm:mb-12 flex flex-col gap-4 sm:gap-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-muted hover:text-accent transition-colors w-fit group text-sm sm:text-base font-mono"
            >
              <ArrowLeft size={18} className="sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
              cd ../home
            </Link>

            <div className="space-y-3">
              <div className="font-mono text-[11px] font-bold text-muted-2 tracking-[0.24em]">
                [ DATABASE / PROJECTS ]
              </div>
              {/* "Project Archives" described the page but matched no query.
                  The h1 is the strongest on-page signal there is; it should
                  say what the work is, not what the folder is called. */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight">
                AI Engineering <span className="text-accent">Projects</span>
              </h1>
              <p className="text-base sm:text-lg text-muted max-w-2xl leading-[1.75]">
                Agentic AI, automation and cloud systems built by Vico Aritonang,
                an AI engineer based in Depok, Indonesia — production work,
                hackathon builds and research experiments. Sorted by popularity.
              </p>
            </div>
          </div>

          {/* Main Content */}
          <ProjectsList projects={projects} />
        </div>
      </main>
    </>
  );
}
