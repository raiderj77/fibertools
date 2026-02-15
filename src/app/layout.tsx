import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
  title: {
    default: "FiberTools — Free Calculators for Knitters, Crocheters & Weavers",
    template: "%s | FiberTools",
  },
  description:
    "Free online calculators and tools for knitting, crochet, weaving, spinning, and embroidery. Yarn calculator, needle converter, gauge calculator, and more. No login. Works offline.",
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
  ],
  authors: [{ name: "FiberTools" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "FiberTools",
    title: "FiberTools — Free Calculators for Knitters, Crocheters & Weavers",
    description:
      "Free online calculators and tools for all fiber arts. No login required. Works offline.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
