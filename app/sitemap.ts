import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { getPosts } from '@/lib/blog';
import { caseStudySlugs } from '@/content/caseStudies';

/*
 * The previous version mapped every project row to `${baseUrl}/projects` –
 * the same URL, once per project. A sitemap that lists one <loc> four times
 * is not extra coverage, it is a malformed sitemap, and Search Console
 * reports it as duplicate URLs rather than crawling anything new.
 *
 * It also called getProjects(), so a Supabase outage during a build produced
 * a sitemap that silently lost entries. The route list is static; it does not
 * need a database round-trip to be written down.
 */

export default function sitemap(): MetadataRoute.Sitemap {
  // Omit lastModified unless an actual content date is known. Deploy time
  // is not a content update and should not change every URL's lastmod.
  return [
    {
      url: SITE_URL,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/projects`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...[
      ['/about', 0.7],
      ['/blog', 0.6],
      ['/uses', 0.4],
      ['/links', 0.4],
      ['/guestbook', 0.3],
      ['/bucket-list', 0.3],
      ['/attribution', 0.2],
      ['/legal/privacy', 0.1],
      ['/legal/terms', 0.1],
    ].map(([path, priority]) => ({
      url: `${SITE_URL}${path}`,
      changeFrequency: 'monthly' as const,
      priority: priority as number,
    })),
    ...caseStudySlugs.map((slug) => ({
      url: `${SITE_URL}/projects/${slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...getPosts().map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: new Date(`${p.date}T00:00:00Z`),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
  ];
}
