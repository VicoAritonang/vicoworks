import type { MetadataRoute } from 'next';
import { caseStudySlugs } from '@/content/projects';

/* The previous version emitted one entry per project — every one of them
   pointing at the same /projects URL. Now each case study has a real address. */

const baseUrl = 'https://vicoworks.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const caseStudies = caseStudySlugs.map((slug) => ({
    url: `${baseUrl}/projects/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    ...caseStudies,
  ];
}
