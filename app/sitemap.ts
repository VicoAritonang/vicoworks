import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

/*
 * The previous version mapped every project row to `${baseUrl}/projects` —
 * the same URL, once per project. A sitemap that lists one <loc> four times
 * is not extra coverage, it is a malformed sitemap, and Search Console
 * reports it as duplicate URLs rather than crawling anything new.
 *
 * It also called getProjects(), so a Supabase outage during a build produced
 * a sitemap that silently lost entries. The route list is static; it does not
 * need a database round-trip to be written down.
 */

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];
}
