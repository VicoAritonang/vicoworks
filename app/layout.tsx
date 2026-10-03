import type { Metadata, Viewport } from "next";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import {
  LOCATION,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_TITLE,
  SITE_URL,
  personSchema,
} from "@/lib/seo";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: 'swap',
  preload: true,
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    /* Name first. The query being lost is "vico ai engineer", and Google
       weights the leading words of a <title> most heavily. */
    default: SITE_TITLE,
    template: '%s | Vico Aritonang — AI Engineer',
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  authors: [{ name: 'Vico Aritonang', url: SITE_URL }],
  creator: 'Vico Aritonang',
  publisher: 'Vico Aritonang',
  applicationName: 'Vico Aritonang — AI Engineer Portfolio',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'profile',
    firstName: 'Vico',
    lastName: 'Aritonang',
    username: 'VicoAritonang',
    /* en_ID, not en_US. The audience and the geography are Indonesian even
       though the copy is English. */
    locale: 'en_ID',
    alternateLocale: ['id_ID'],
    url: SITE_URL,
    siteName: 'Vico Aritonang — AI Engineer',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    /* Image comes from app/opengraph-image.tsx. The old hardcoded
       /og-image.jpg was never added to public/ and 404'd on every share. */
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    creator: '@VicoAritonang',
  },
  /* No hreflang block. There is exactly one language version of this site;
     declaring an `id-ID` alternate that resolves to the same English page
     claims a translation that does not exist. `lang="en-ID"` on <html>, the
     geo meta pair and the copy itself carry the country signal honestly. */
  alternates: { canonical: '/' },
  category: 'Technology',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  verification: {
    /* Set GOOGLE_SITE_VERIFICATION in Vercel → Project → Environment
       Variables. Verifying by DNS or by the HTML file works too; this is the
       option that survives a redeploy without keeping a file in public/. */
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  other: {
    'geo.region': LOCATION.regionCode,
    'geo.placename': LOCATION.locality,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0a0a0c',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /* lang is en-ID: the prose is English, the audience and the market are
       Indonesian. Plain "en" told Google nothing about where Vico is. */
    <html lang="en-ID">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
        {/* The Person entity is site-wide, not homepage-only: every indexed
            URL should resolve to the same @id so Google merges them into one
            person rather than several weakly-related pages. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              '@id': `${SITE_URL}/#website`,
              url: SITE_URL,
              name: SITE_TITLE,
              description: SITE_DESCRIPTION,
              inLanguage: 'en-ID',
              publisher: { '@id': `${SITE_URL}/#vico` },
            }),
          }}
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} antialiased`}
      >
        {/* Skip link: an accessibility requirement, and the first crawlable
            anchor on the page now points at the content rather than the nav. */}
        <a
          href="#home"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:font-bold focus:text-accent-ink"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
