/**
 * Single source of truth for everything a crawler reads.
 *
 * The site URL used to be re-declared as a `const siteUrl` in layout.tsx,
 * page.tsx, projects/page.tsx, robots.ts and sitemap.ts. Five copies of one
 * string is five chances for a canonical to point somewhere it should not.
 */

import { AWARDS, EXPERIENCE, EXPERTISE, PROFILE } from '@/content/home';

export const SITE_URL = 'https://vicoworks.com';

/* The geography is deliberate. "AI engineer" alone is a global query Vico
   cannot win; "AI engineer Indonesia" is one where being actually Indonesian
   is the ranking signal. Every string below carries the country. */
export const LOCATION = {
  locality: 'Depok',
  region: 'West Java',
  regionCode: 'ID-JB',
  country: 'Indonesia',
  countryCode: 'ID',
  /** Search-visible phrasing, used in copy as well as metadata. */
  label: 'Depok, Greater Jakarta, Indonesia',
} as const;

export const SITE_TITLE = 'Vico Aritonang — AI Engineer in Indonesia';

export const SITE_DESCRIPTION =
  'Vico Aritonang is an Indonesian AI engineer in Depok, Greater Jakarta, building agentic AI, LLM orchestration and automation systems — with Go microservices and cloud infrastructure on GCP and AWS.';

/**
 * Keyword list. Google ignores the meta tag, but Bing still reads it and the
 * list doubles as the checklist for what the page copy has to actually say —
 * a keyword that appears only here and nowhere in the body is a lie.
 */
export const SITE_KEYWORDS = [
  'Vico Aritonang',
  'Vico AI Engineer',
  'Indonesian AI Engineer',
  'AI Engineer Indonesia',
  'AI Engineer Jakarta',
  'AI Engineer Depok',
  'AI Automation Engineer',
  'Agentic AI Engineer',
  'LLM Orchestration',
  'RAG Engineer',
  'Go Backend Engineer Indonesia',
  'Machine Learning Engineer Indonesia',
  'Universitas Indonesia',
  'Avagenc',
];

/**
 * The Person entity. This is the payload that lets Google resolve "Vico" the
 * string into Vico the person, and it is what a knowledge panel is built from,
 * so it carries the identifiers (`sameAs`), the employer and the school —
 * every corroborating edge back to a page Google already trusts.
 */
export function personSchema() {
  const currentRole = EXPERIENCE.find((e) => e.current);

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#vico`,
    name: 'Vico Aritonang',
    alternateName: ['Vico Winner Sebastian Aritonang', 'Vico'],
    givenName: 'Vico',
    familyName: 'Aritonang',
    jobTitle: 'AI Engineer',
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    email: `mailto:${PROFILE.email}`,
    nationality: { '@type': 'Country', name: LOCATION.country },
    knowsLanguage: ['id-ID', 'en'],
    address: {
      '@type': 'PostalAddress',
      addressLocality: LOCATION.locality,
      addressRegion: LOCATION.region,
      addressCountry: LOCATION.countryCode,
    },
    homeLocation: {
      '@type': 'Place',
      name: LOCATION.label,
      address: {
        '@type': 'PostalAddress',
        addressLocality: LOCATION.locality,
        addressRegion: LOCATION.region,
        addressCountry: LOCATION.countryCode,
      },
    },
    worksFor: currentRole
      ? {
          '@type': 'Organization',
          name: currentRole.org,
          description: 'AI automation startup',
          address: {
            '@type': 'PostalAddress',
            addressLocality: LOCATION.locality,
            addressCountry: LOCATION.countryCode,
          },
        }
      : undefined,
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Universitas Indonesia',
      sameAs: 'https://www.ui.ac.id/',
    },
    /* sameAs is the strongest entity signal available without a Wikipedia
       page: it ties this domain to profiles Google has already indexed. */
    sameAs: [PROFILE.github, PROFILE.linkedin],
    knowsAbout: [
      ...EXPERTISE.flatMap((e) => e.body.split(', ').map((s) => s.trim())),
      'Agentic AI',
      'Retrieval-Augmented Generation',
      'AI Automation',
    ],
    award: AWARDS.map((a) => a.title),
    seeks: {
      '@type': 'Demand',
      name: 'AI engineering internship or full-time role',
    },
  };
}
