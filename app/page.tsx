import type { Metadata } from 'next';
import { SiteNav } from '@/components/site/SiteNav';
import { SiteFooter } from '@/components/site/SiteFooter';
import { PageFrame } from '@/components/site/PageFrame';
import { Hero } from '@/components/home/Hero';
import { Bento } from '@/components/home/Bento';
import { CuratedWork } from '@/components/home/CuratedWork';
import { Explore } from '@/components/home/Explore';
import { ContactCta } from '@/components/home/ContactCta';
import { VisitorCounter } from '@/components/VisitorCounter';
import { EXPERIENCE, FEATURED_PROJECTS } from '@/content/home';
import { LOCATION, SITE_DESCRIPTION, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  /* No `title` override. The homepage wants the root default,
     "Vico Aritonang – AI Engineer in Indonesia". The old value was
     "Home - AI Engineer Portfolio", which pushed the name out of the title
     entirely and spent the first word on "Home" – a word nobody searches. */
  /* Nothing else is set here on purpose. Next replaces `openGraph` and
     `alternates` wholesale rather than merging them field by field, so an
     override this page did not need was quietly dropping og:locale and the
     profile:* tags the root layout declares. */
  description: SITE_DESCRIPTION,
};

export default function Home() {
  /* The Person entity itself is emitted site-wide from layout.tsx. This page
     adds the ProfilePage wrapper Google expects on a personal landing page,
     and points `mainEntity` at the same @id so the two merge into one node
     instead of competing as two. */
  const profilePage = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${SITE_URL}/#profilepage`,
    url: SITE_URL,
    name: 'Vico Aritonang – AI Engineer in Indonesia',
    description: SITE_DESCRIPTION,
    inLanguage: 'en-ID',
    isPartOf: { '@id': `${SITE_URL}/#website` },
    mainEntity: { '@id': `${SITE_URL}/#vico` },
    about: { '@id': `${SITE_URL}/#vico` },
    significantLink: FEATURED_PROJECTS.map((p) => (p.caseStudy ? `${SITE_URL}/projects/${p.slug}` : p.href)),
  };

  const workHistory = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${SITE_URL}/#work`,
    name: 'Selected AI engineering work by Vico Aritonang',
    itemListElement: FEATURED_PROJECTS.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'CreativeWork',
        ...(p.caseStudy ? { '@id': `${SITE_URL}/projects/${p.slug}#work` } : {}),
        name: p.name,
        description: p.body,
        url: p.caseStudy ? `${SITE_URL}/projects/${p.slug}` : p.href,
        ...(p.caseStudy ? { sameAs: p.href } : {}),
        /* `p.year` is "2025-26" / "2025 – present", not an ISO date, so it
           goes in temporalCoverage. Putting it in dateCreated would emit
           schema Google reads as malformed. */
        temporalCoverage: p.year,
        keywords: p.stack,
        author: { '@id': `${SITE_URL}/#vico` },
        locationCreated: {
          '@type': 'Place',
          name: LOCATION.label,
        },
      },
    })),
  };

  const employment = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${SITE_URL}/#experience`,
    name: 'Experience and education',
    itemListElement: EXPERIENCE.map((e, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Role',
        roleName: e.role,
        description: `${e.org} · ${e.period} – ${e.body}`,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(workHistory) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(employment) }}
      />
      <SiteNav />
      <main id="main" className="relative">
        <VisitorCounter />
        <PageFrame>
          <Hero />
          <Bento />
          <CuratedWork />
          <Explore />
          <ContactCta />
        </PageFrame>
      </main>
      <SiteFooter />
    </>
  );
}
