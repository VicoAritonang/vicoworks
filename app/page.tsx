import type { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { SelectedWork } from '@/components/SelectedWork';
import { HowIBuild } from '@/components/HowIBuild';
import { Research } from '@/components/Research';
import { About } from '@/components/About';
import { Contact } from '@/components/Contact';
import { profile } from '@/content/profile';
import { skillLayers } from '@/content/skills';

/* No `dynamic = 'force-dynamic'` and no data fetch: this page is static.
   It used to render "Connecting to neural network..." whenever Supabase was
   unreachable, which is the one failure mode a portfolio cannot afford. */

const siteUrl = 'https://vicoworks.com';

export const metadata: Metadata = {
  title: 'AI Engineer',
  description:
    'Vico Aritonang builds AI agents that do real operational work — agent orchestration, high-concurrency Go services and serverless AWS backends. Case studies from Avagenc, Datafact and NusaVerify.',
  alternates: { canonical: siteUrl },
};

export default function Home() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.fullName,
    alternateName: profile.name,
    jobTitle: profile.role,
    description: profile.claim,
    url: siteUrl,
    email: `mailto:${profile.email}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Depok',
      addressRegion: 'West Java',
      addressCountry: 'ID',
    },
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Universitas Indonesia',
    },
    sameAs: [profile.links.github, profile.links.linkedin],
    knowsAbout: skillLayers.flatMap((layer) => layer.items),
  };

  return (
    <main id="main" className="relative overflow-x-hidden font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Hero />
      <SelectedWork />
      <HowIBuild />
      <Research />
      <About />
      <Contact />
    </main>
  );
}
