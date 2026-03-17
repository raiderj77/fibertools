import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import InstallPrompt from "@/components/InstallPrompt";
import CookieConsent from "@/components/CookieConsent";
import { OrganizationSchema } from "@/components/StructuredData";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fibertools.app"),
  title: {
    default: "FiberTools — Free Fiber Arts Calculators",
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
    "google-adsense-account": process.env.NEXT_PUBLIC_ADSENSE_ID || "",
    "msvalidate.01": "C4C9B6256BDEDED169E4DE01CA953390",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "FiberTools",
    title: "FiberTools — Free Fiber Arts Calculators",
    description:
      "Free online calculators for knitting, crochet, weaving, spinning & embroidery. No login. Works offline.",
    url: "https://fibertools.app",
    images: [
      {
        url: "https://fibertools.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "FiberTools — Free Calculators for Knitters, Crocheters & Weavers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FiberTools — Free Calculators for Fiber Crafters",
    description: "Free yarn calculators, gauge tools, needle converters & more. No login. Works offline.",
    images: ["https://fibertools.app/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
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
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://fibertools.app/?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6b8e6d" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <OrganizationSchema />
        {/* Cookiebot CMP — must load before any tracking scripts */}
        <Script
          id="Cookiebot"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid="a9a99ccb-4863-4e33-a895-a6d5642f408d"
          data-blockingmode="auto"
          strategy="beforeInteractive"
        />
        {/* Google Consent Mode v2 — set defaults BEFORE gtag loads */}
        <Script id="consent-mode-defaults" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              analytics_storage: 'denied',
              functionality_storage: 'denied',
              personalization_storage: 'denied',
              wait_for_update: 500
            });
          `}
        </Script>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-T92LYDE8NN"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-T92LYDE8NN');
          `}
        </Script>
        {/* Google AdSense — auto ads */}
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        {/* Microsoft Clarity — heatmaps & session recordings */}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window,document,"clarity","script","vss29q2h55");
          `}
        </Script>
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:bg-sage-600 focus:text-white focus:rounded-lg focus:text-sm focus:font-medium">
          Skip to main content
        </a>
        <Header />
        <div id="main-content" className="flex-1">{children}</div>
        <Footer />
        <ServiceWorkerRegistration />
        <InstallPrompt />
        <CookieConsent />
      </body>
    </html>
  );
}
