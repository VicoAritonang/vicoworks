import type { MetadataRoute } from 'next';
import { SITE_DESCRIPTION, SITE_TITLE } from '@/lib/seo';

/* Replaces public/manifest.json, which pointed at /icon-192.png and
   /icon-512.png — neither of which exists in public/, so both 404'd and the
   manifest was invalid. These two files do exist. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_TITLE,
    short_name: 'Vico Aritonang',
    description: SITE_DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0c',
    theme_color: '#0a0a0c',
    lang: 'en-ID',
    categories: ['portfolio', 'technology', 'business'],
    icons: [
      { src: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
