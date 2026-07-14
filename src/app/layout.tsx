import type { Metadata } from "next";
import { DM_Serif_Display, Nunito, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import InstallPrompt from "@/components/InstallPrompt";
import CookieConsent from "@/components/CookieConsent";
import AffiliateClickTracker from "@/components/AffiliateClickTracker";
import { OrganizationSchema } from "@/components/StructuredData";

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-display",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fibertools.app"),
  title: {
    default: "FiberTools, Free Fiber Arts Calculators",
    template: "%s | FiberTools",
  },
  description:
    "Free online calculators for knitting, crochet, weaving, spinning & embroidery. Yarn calculator, gauge tools & more. No login. Works offline.",
  icons: {
    icon: "/favicon.svg",
  },
  keywords: [
    "yarn calculator",
    "knitting calculator",
    "crochet calculator",
    "needle size chart",
    "gauge calculator",
    "yarn weight chart",
    "stitch counter",
    "blanket size calculator",
    "weaving sett calculator",
    "spinning ratio calculator",
    "fiber arts tools",
    "free knitting tools",
    "crochet stitch counter",
  ],
  authors: [{ name: "FiberTools" }],
  creator: "FiberTools",
  publisher: "FiberTools",
  other: {
    "google-adsense-account": "ca-pub-7171402107622932",
    "msvalidate.01": "C4C9B6256BDEDED169E4DE01CA953390",
    "p:domain_verify": "84cfa650f01d6392f803f27508a23b12",
  },
  verification: {
    google: "zHstgdeTG-ikPMO_fbH78ZIsky_3abLWtZlJf3_8gRc",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "FiberTools",
    title: "FiberTools, Free Fiber Arts Calculators",
    description:
      "Free online calculators for knitting, crochet, weaving, spinning & embroidery. No login. Works offline.",
    url: "https://fibertools.app",
    images: [
      {
        url: "https://fibertools.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "FiberTools, Free Calculators for Knitters, Crocheters & Weavers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FiberTools, Free Calculators for Fiber Crafters",
    description: "Free yarn calculators, gauge tools, needle converters & more. No login. Works offline.",
    images: ["https://fibertools.app/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large" as const,
      "max-video-preview": -1,
    },
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://fibertools.app/#website",
  url: "https://fibertools.app",
  name: "FiberTools",
  description: "Free online calculators and tools for knitting, crochet, weaving, spinning, and embroidery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsenseEnabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";

  return (
    <html lang="en" className={`${dmSerifDisplay.variable} ${nunito.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6b8e6d" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <OrganizationSchema />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:bg-sage-600 focus:text-white focus:rounded-lg focus:text-sm focus:font-medium">
          Skip to main content
        </a>
        <Header />
        <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <Footer />
        <ServiceWorkerRegistration />
        <InstallPrompt />
        <CookieConsent adsenseEnabled={adsenseEnabled} />
        <AffiliateClickTracker />
      </body>
    </html>
  );
}
