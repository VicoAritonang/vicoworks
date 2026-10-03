import type { Metadata, Viewport } from "next";
import { Outfit, Instrument_Serif, JetBrains_Mono, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import {
  LOCATION,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_TITLE,
  SITE_URL,
  personSchema,
} from "@/lib/seo";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: 'swap',
});

/* The editorial headline face. Italic is loaded for the colourful accent word. */
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: 'swap',
});

const mono = JetBrains_Mono({
  variable: "--font-mono-face",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: 'swap',
});

/* Card titles and project names: a high-contrast display serif. */
const displaySerif = DM_Serif_Display({
  variable: "--font-display-face",
  subsets: ["latin"],
  weight: "400",
  display: 'swap',
});

/* Runs before paint so a visitor who picked light mode never sees a dark flash. */
const themeScript = `try{if(localStorage.getItem('theme')==='light')document.documentElement.classList.remove('dark')}catch(e){}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    /* Name first. The query being lost is "vico ai engineer", and Google
       weights the leading words of a <title> most heavily. */
    default: SITE_TITLE,
    template: '%s | Vico Aritonang – AI Engineer',
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  authors: [{ name: 'Vico Aritonang', url: SITE_URL }],
  creator: 'Vico Aritonang',
  publisher: 'Vico Aritonang',
  applicationName: 'Vico Aritonang – AI Engineer Portfolio',
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
    siteName: 'Vico Aritonang – AI Engineer',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    /* Image comes from app/opengraph-image.tsx. The old hardcoded
       /og-image.jpg was never added to public/ and 404'd on every share. */
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
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
    /* Bing Webmaster Tools. Bing's index is what ChatGPT search and Copilot
       answer from, so this matters as much as Google. Set BING_SITE_VERIFICATION
       in Vercel (the content of the msvalidate.01 meta tag). */
    other: process.env.BING_SITE_VERIFICATION ? { 'msvalidate.01': process.env.BING_SITE_VERIFICATION } : undefined,
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
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
    { media: '(prefers-color-scheme: light)', color: '#f4f4f4' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /* lang is en-ID: the prose is English, the audience and the market are
       Indonesian. Plain "en" told Google nothing about where Vico is. */
    <html lang="en-ID" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
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
        className={`${outfit.variable} ${instrumentSerif.variable} ${mono.variable} ${displaySerif.variable} antialiased`}
      >
        {/* Skip link: an accessibility requirement, and the first crawlable
            anchor on the page now points at the content rather than the nav. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:font-bold focus:text-accent-ink"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
