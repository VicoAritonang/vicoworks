import { getProjects } from '@/lib/data';
import { ProjectsList } from '@/components/ProjectsList';
import { VisitorCounter } from '@/components/VisitorCounter';
import { SiteNav } from '@/components/site/SiteNav';
import { SiteFooter } from '@/components/site/SiteFooter';
import { PageFrame } from '@/components/site/PageFrame';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import { LOCATION, SITE_URL } from '@/lib/seo';
import { caseStudySlugs, getProject } from '@/content/caseStudies';
import { FEATURED_PROJECTS } from '@/content/home';

/* Was `force-dynamic`, which means Googlebot's crawl of /projects triggered a
   live Supabase query – and rendered an empty page if that query failed. ISR
   serves a cached HTML page to every crawl and refreshes it hourly, so the
   page is fast, always populated, and still current. */
export const revalidate = 3600;

const description =
  'AI engineering and automation projects by Vico Aritonang, an Indonesian AI engineer in Jakarta – agentic AI systems, LLM and RAG applications, Go backends, and serverless cloud architecture on GCP and AWS.';

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
    siteName: 'Vico Aritonang – AI Engineer',
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
    hasPart: caseStudySlugs.map((slug) => ({
      '@type': 'WebPage',
      '@id': `${SITE_URL}/projects/${slug}#page`,
      url: `${SITE_URL}/projects/${slug}`,
      name: getProject(slug)!.name,
      mainEntity: { '@id': `${SITE_URL}/projects/${slug}#work` },
    })),
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
      <main id="main" className="relative min-h-screen">
        <VisitorCounter />
        <PageFrame>
          <div className="relative px-3 pt-28 pb-10 sm:px-6 sm:pt-32">
            {/* Header */}
            <div className="mb-10 flex flex-col items-center gap-6 text-center sm:mb-14">
              <Link
                href="/"
                className="group inline-flex w-fit items-center gap-2 font-mono text-xs text-muted uppercase transition-colors hover:text-foreground"
              >
                <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
                Back home
              </Link>
              <span className="font-mono text-xs tracking-widest text-black/80 uppercase dark:text-white/70">
                The archive
              </span>
              {/* "Project Archives" described the page but matched no query.
                  The h1 is the strongest on-page signal there is; it should
                  say what the work is, not what the folder is called. */}
              <h1 className="font-serif text-5xl tracking-tight text-balance md:text-7xl">
                AI engineering{' '}
                <span className="mask-sweep animate-mask-sweep inline-block px-1 pb-1 italic text-colorful animate-gradient-x">
                  projects
                </span>
              </h1>
              <p className="max-w-2xl text-base leading-relaxed font-light text-muted sm:text-lg">
                Agentic AI, automation and cloud systems built by Vico Aritonang,
                an AI engineer based in Jakarta, Indonesia – production work,
                hackathon builds and research experiments. Sorted by popularity.
              </p>
            </div>
            <div className="-mx-3 border-t sm:-mx-6" />

            {/* Case studies: static, so the page is never empty for a crawler
                even when the Supabase list below fails to load. */}
            <section aria-labelledby="case-studies" className="pt-10">
              <h2 id="case-studies" className="mb-5 font-mono text-xs tracking-widest text-neutral-600 uppercase dark:text-neutral-400">
                Case studies
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {caseStudySlugs.map((slug) => {
                  const cs = getProject(slug)!;
                  const gradient =
                    FEATURED_PROJECTS.find((f) => f.slug === slug)?.gradient ??
                    'linear-gradient(145deg, #1e293b 0%, #475569 40%, #94a3b8 75%, #cbd5e1 100%)';
                  return (
                    <Link
                      key={slug}
                      href={`/projects/${slug}`}
                      className="group relative flex min-h-44 flex-col justify-end overflow-hidden rounded-2xl p-5 text-white ring-1 ring-line"
                    >
                      <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105" style={{ background: gradient }} />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                      <div className="relative">
                        <div className="font-mono text-[10px] tracking-widest uppercase opacity-80">{cs.year} · {cs.role}</div>
                        <h3 className="font-display text-2xl">{cs.name}</h3>
                        <p className="mt-1 line-clamp-2 text-sm text-white/85">{cs.oneLiner}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* Main Content */}
            <div className="pt-12">
              <ProjectsList projects={projects} />
            </div>
          </div>
        </PageFrame>
      </main>
      <SiteFooter />
    </>
  );
}
