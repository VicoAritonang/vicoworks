import type { Metadata } from 'next';
import { SiteNav } from '@/components/home/SiteNav';
import { Hero } from '@/components/home/Hero';
import { QuickFacts } from '@/components/home/QuickFacts';
import { TechMarquee } from '@/components/home/TechMarquee';
import { Expertise } from '@/components/home/Expertise';
import { Experience } from '@/components/home/Experience';
import { FeaturedWork } from '@/components/home/FeaturedWork';
import { ContactSection } from '@/components/home/ContactSection';
import { VisitorCounter } from '@/components/VisitorCounter';
import { EXPERTISE, FEATURED_PROJECTS, PROFILE } from '@/content/home';

const siteUrl = 'https://vicoworks.com';

export const metadata: Metadata = {
  title: 'Home - AI Engineer Portfolio',
  description:
    'Vico Aritonang - AI Engineer and Software Developer. Explore my portfolio showcasing AI engineering projects, software development skills, and technological innovations. Specialized in Artificial Intelligence, Machine Learning, and cutting-edge software solutions.',
  keywords: [
    'Vico Aritonang',
    'AI Engineer',
    'Artificial Intelligence Engineer',
    'Software Engineer',
    'Vico',
    'AI Engineering',
    'Portfolio',
  ],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: 'Vico Aritonang - AI Engineer & Software Developer Portfolio',
    description:
      'AI Engineer and Software Developer specializing in Artificial Intelligence, Machine Learning, and innovative software solutions.',
    url: siteUrl,
    type: 'website',
  },
};

export default function Home() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Vico Aritonang',
    jobTitle: 'AI Engineer',
    description:
      'AI Engineer and Software Developer specializing in Artificial Intelligence and Machine Learning',
    url: siteUrl,
    sameAs: [PROFILE.github, PROFILE.linkedin],
    knowsAbout: EXPERTISE.map((e) => e.title),
    alumniOf: {
      '@type': 'Organization',
      name: 'University of Indonesia',
    },
  };

  const portfolioStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Vico Aritonang Portfolio',
    description: 'Portfolio showcasing AI engineering projects and software development work',
    url: siteUrl,
    mainEntity: {
      '@type': 'Person',
      name: 'Vico Aritonang',
      jobTitle: 'AI Engineer',
    },
    hasPart: FEATURED_PROJECTS.map((p) => ({
      '@type': 'CreativeWork',
      name: p.name,
      description: p.body,
      url: p.href,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioStructuredData) }}
      />
      <SiteNav />
      <main className="relative min-h-screen overflow-x-hidden bg-background font-sans">
        <VisitorCounter />
        {/* Hairline grid backdrop, faded out below the fold. */}
        <div className="spec-grid pointer-events-none fixed inset-0 z-0" aria-hidden="true" />

        <Hero />
        <QuickFacts />
        <TechMarquee />
        <Expertise />
        <Experience />
        <FeaturedWork />
        <ContactSection />
      </main>
    </>
  );
}
