import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        /* `/_next/` used to be disallowed wholesale. That also blocks
           /_next/static/, which holds the CSS and JS Googlebot needs to render
           the page — a blocked-resource render is what makes a Next.js site
           look like an empty shell in Search Console. Only the data and image
           endpoints are worth excluding, and even those are harmless. */
        disallow: ['/api/', '/_next/data/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
