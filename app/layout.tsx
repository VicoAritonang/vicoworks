import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const siteUrl = 'https://vicoworks.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Vico Aritonang - AI Engineer & Software Developer Portfolio',
    template: '%s | Vico Aritonang - AI Engineer'
  },
  description: 'Vico Aritonang - AI Engineer and Software Developer. Explore my portfolio showcasing AI engineering projects, software development skills, and technological innovations. Specialized in Artificial Intelligence, Machine Learning, and cutting-edge software solutions.',
  keywords: [
    'Vico Aritonang',
    'AI Engineer',
    'Artificial Intelligence Engineer',
    'Software Engineer',
    'Machine Learning Engineer',
    'AI Developer',
    'Software Developer',
    'Portfolio',
    'Vico',
    'AI Engineering',
    'Tech Portfolio',
    'Developer Portfolio',
    'AI Projects',
    'Software Projects'
  ],
  authors: [{ name: 'Vico Aritonang' }],
  creator: 'Vico Aritonang',
  publisher: 'Vico Aritonang',
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
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Vico Aritonang Portfolio',
    title: 'Vico Aritonang - AI Engineer & Software Developer',
    description: 'AI Engineer and Software Developer specializing in Artificial Intelligence, Machine Learning, and innovative software solutions. Explore my portfolio of cutting-edge projects.',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Vico Aritonang - AI Engineer Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vico Aritonang - AI Engineer & Software Developer',
    description: 'AI Engineer and Software Developer. Explore my portfolio of AI engineering projects and software solutions.',
    images: [`${siteUrl}/og-image.jpg`],
    creator: '@VicoAritonang',
  },
  alternates: {
    canonical: siteUrl,
  },
  category: 'Technology',
  classification: 'Portfolio',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  verification: {
    // Add Google Search Console verification when available
    // google: 'your-google-verification-code',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href={siteUrl} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#030305" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
