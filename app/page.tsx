import { getHomeView, getStatistics } from '@/lib/data';
import { Hero } from '@/components/Hero';
import { Stats } from '@/components/Stats';
import { Skills } from '@/components/Skills';
import { Contact } from '@/components/Contact';
import { Background } from '@/components/Background';
import { VisitorCounter } from '@/components/VisitorCounter';
import { BrainCursor } from '@/components/BrainCursor';
import { ProfileHighlight } from '@/components/ProfileHighlight';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

const siteUrl = 'https://vicoworks.com';

export const metadata: Metadata = {
  title: 'Home - AI Engineer Portfolio',
  description: 'Vico Aritonang - AI Engineer and Software Developer. Explore my portfolio showcasing AI engineering projects, software development skills, and technological innovations. Specialized in Artificial Intelligence, Machine Learning, and cutting-edge software solutions.',
  keywords: ['Vico Aritonang', 'AI Engineer', 'Artificial Intelligence Engineer', 'Software Engineer', 'Vico', 'AI Engineering', 'Portfolio'],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: 'Vico Aritonang - AI Engineer & Software Developer Portfolio',
    description: 'AI Engineer and Software Developer specializing in Artificial Intelligence, Machine Learning, and innovative software solutions.',
    url: siteUrl,
    type: 'website',
  },
};

export default async function Home() {
  const homeData = await getHomeView();
  const statsData = await getStatistics();

  if (!homeData || !statsData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black px-4">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl mb-4">Loading Portfolio...</h1>
          <p className="text-sm sm:text-base text-gray-400">Connecting to neural network...</p>
        </div>
      </div>
    );
  }

  // Structured Data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Vico Aritonang',
    jobTitle: 'AI Engineer',
    description: 'AI Engineer and Software Developer specializing in Artificial Intelligence and Machine Learning',
    url: siteUrl,
    sameAs: [
      homeData.Github || 'https://github.com/VicoAritonang',
      homeData.linkedIn,
    ].filter(Boolean),
    knowsAbout: homeData.skill?.split(';').map(s => s.trim()) || [],
    alumniOf: {
      '@type': 'Organization',
      name: 'Educational Institution'
    },
    image: homeData.image_url || `${siteUrl}/og-image.jpg`,
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
      <main className="min-h-screen relative overflow-x-hidden font-sans">
        <VisitorCounter />
        <Background />
        <BrainCursor />

        <Hero data={homeData} />
        <Stats data={statsData} />
        <Skills data={homeData} />
        <ProfileHighlight data={homeData} />
        <Contact data={homeData} />
      </main>
    </>
  );
}
