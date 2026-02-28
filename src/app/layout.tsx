import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import InstallPrompt from "@/components/InstallPrompt";
import CookieConsent from "@/components/CookieConsent";
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
    default: "FiberTools — Free Calculators for Knitters, Crocheters & Weavers",
    template: "%s | FiberTools",
  },
  description:
    "Free online calculators and tools for knitting, crochet, weaving, spinning, and embroidery. Yarn calculator, needle converter, gauge calculator, and more. No login. Works offline.",
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
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "FiberTools",
    title: "FiberTools — Free Calculators for Knitters, Crocheters & Weavers",
    description:
      "Free online calculators and tools for all fiber arts. No login required. Works offline.",
    url: "https://fibertools.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "FiberTools — Free Calculators for Fiber Crafters",
    description: "Free yarn calculators, gauge tools, needle converters & more. No login. Works offline.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
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
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7171402107622932"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* Google Consent Mode v2 — set defaults BEFORE gtag loads */}
        <Script id="consent-mode-defaults" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              analytics_storage: 'denied',
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
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
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
        <ServiceWorkerRegistration />
        <InstallPrompt />
        <CookieConsent />
      </body>
    </html>
  );
}
