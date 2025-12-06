import { getProjects } from '@/lib/data';
import { ProjectsList } from '@/components/ProjectsList';
import { BrainCursor } from '@/components/BrainCursor';
import { VisitorCounter } from '@/components/VisitorCounter';
import { AIBackgroundAnimations } from '@/components/AIBackgroundAnimations';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

const siteUrl = 'https://vicoworks.com';

export const metadata: Metadata = {
  title: 'Projects - AI Engineering Portfolio',
  description: 'Explore Vico Aritonang\'s AI engineering projects and software development work. Discover innovative AI solutions, machine learning applications, and cutting-edge software projects developed by an AI Engineer.',
  keywords: ['Vico Aritonang Projects', 'AI Engineering Projects', 'AI Engineer Portfolio', 'Software Projects', 'Machine Learning Projects', 'Vico', 'AI Engineer'],
  alternates: {
    canonical: `${siteUrl}/projects`,
  },
  openGraph: {
    title: 'Projects - Vico Aritonang AI Engineer Portfolio',
    description: 'Explore innovative AI engineering projects and software development work by Vico Aritonang, an AI Engineer specializing in Artificial Intelligence and Machine Learning.',
    url: `${siteUrl}/projects`,
    type: 'website',
  },
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  // Structured Data for Projects Page
  const projectsStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'AI Engineering Projects by Vico Aritonang',
    description: 'Collection of AI engineering and software development projects',
    url: `${siteUrl}/projects`,
    itemListElement: projects.slice(0, 10).map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'CreativeWork',
        name: project.projectName,
        description: project.description,
        url: project.project_url || `${siteUrl}/projects`,
        creator: {
          '@type': 'Person',
          name: 'Vico Aritonang',
          jobTitle: 'AI Engineer',
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsStructuredData) }}
      />
      <main className="min-h-screen relative font-sans bg-[#030305] overflow-hidden">
        <VisitorCounter />
        <AIBackgroundAnimations />
        <BrainCursor />

        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10 relative z-10">
          {/* Header */}
          <div className="mb-8 sm:mb-12 flex flex-col gap-4 sm:gap-6">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors w-fit group text-sm sm:text-base"
            >
              <ArrowLeft size={18} className="sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
            
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
                Project <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">Archives</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl">
                A collection of my work, experiments, and technological explorations. 
                Sorted by popularity.
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
