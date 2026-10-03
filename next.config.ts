import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Enable compression
  compress: true,
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  /*
   * Google has already indexed four case-study URLs from the version of this
   * site currently live: /projects/avagenc, /projects/datafact,
   * /projects/nusaverify and /projects/robot-tutor-rl. This redesign has no
   * [slug] route, so the moment it deploys those four become 404s and their
   * accumulated ranking is thrown away.
   *
   * 307 rather than 301 on purpose: a 301 is cached hard by browsers and
   * treated by Google as final, which would fight you if the case-study pages
   * come back. Once their fate is decided, make this 301 (gone for good) or
   * delete the block (they are back).
   */
  async redirects() {
    return [
      {
        source: '/projects/:slug',
        destination: '/projects',
        permanent: false,
      },
    ];
  },
  // Headers for SEO and security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        /* Fonts and hashed bundles are immutable — the filename changes when
           the content does. Caching them for a year is what turns a repeat
           visit into a no-network render, and Core Web Vitals is a ranking
           input. */
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
