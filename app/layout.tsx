import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { profile } from "@/content/profile";
import { Background } from "@/components/Background";
import { Navbar } from "@/components/Navbar";
import { Preloader } from "@/components/Preloader";
import { Shell } from "@/components/Shell";
import { VisitorCounter } from "@/components/VisitorCounter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

/** Display face for h1/h2 only. See --font-display-face in globals.css. */
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: true,
});

const siteUrl = "https://vicoworks.com";

const description =
  "Vico Aritonang builds AI agents that do real operational work — LLM agent orchestration, high-concurrency Go services and serverless AWS backends. Case studies from Avagenc, Datafact and NusaVerify.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Vico Aritonang — AI Engineer",
    template: "%s · Vico Aritonang",
  },
  description,
  keywords: [
    "Vico Aritonang",
    "AI Engineer",
    "Agentic AI",
    "LLM agent orchestration",
    "Go engineer",
    "Serverless AWS",
    "Portfolio",
  ],
  authors: [{ name: "Vico Aritonang" }],
  creator: "Vico Aritonang",
  publisher: "Vico Aritonang",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Vico Aritonang",
    title: "Vico Aritonang — AI Engineer",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Vico Aritonang — AI Engineer",
    description,
    creator: "@VicoAritonang",
  },
  alternates: { canonical: siteUrl },
  category: "Technology",
  manifest: "/manifest.json",
  icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0d0f12",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The font variables live on <html>, not <body>: --font-display-face is
    // declared on :root and refers to --font-instrument-serif, so the variable
    // has to exist at that scope or the whole declaration is invalid and the
    // display face silently falls back to the body sans.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
    >
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
        {/* Resolve the theme before first paint so the page never flashes the
            wrong palette. Mirrors the logic in components/theme.tsx. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('vw-theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}document.documentElement.dataset.theme=t;var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',t==='light'?'#faf9f7':'#0d0f12');}catch(e){document.documentElement.dataset.theme='dark';}})();`,
          }}
        />
      </head>
      <body
        className="antialiased"
      >
        {/* Chrome that outlives navigation lives here rather than being mounted
            by each page — it used to be duplicated across both routes. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:rounded focus:border focus:border-line focus:bg-panel focus:px-3 focus:py-2 focus:text-sm"
        >
          Skip to content
        </a>
        <Background />
        <Preloader />
        <Navbar />
        <Shell />
        {children}
        <footer className="section-divider relative z-10 mt-8">
          <div className="container mx-auto flex flex-col gap-2 px-4 py-8 text-xs text-faint sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <span>
              © {new Date().getFullYear()} {profile.name} · {profile.education}
            </span>
            <span className="flex items-center gap-3">
              <span className="font-mono">Next.js · diagrams drawn from data, not exported</span>
              <VisitorCounter className="text-faint" />
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
