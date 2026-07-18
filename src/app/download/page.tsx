import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Your Free Yarn Crafters Survival Kit",
  description: "Download your free Yarn Crafters Survival Kit, a quick-reference guide for knitters and crocheters.",
  alternates: { canonical: "/download" },
  robots: { index: false },
};

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-xl mx-auto px-6 py-20 text-center">
        <div className="text-5xl mb-6">🧶</div>
        <h1
          className="font-display text-4xl text-stone-800 mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          You&rsquo;re in!
        </h1>
        <p className="text-stone-600 text-lg mb-10 leading-relaxed">
          Welcome to FiberTools. Your Yarn Crafters Survival Kit is ready to download.
        </p>

        <a
          href="/survival-kit.pdf"
          download="Yarn-Crafters-Survival-Kit.pdf"
          className="inline-block bg-stone-800 text-white text-lg font-semibold px-8 py-4 rounded-lg hover:bg-stone-700 transition-colors mb-10"
        >
          Download Your Survival Kit
        </a>

        <p className="text-stone-500 text-sm mb-12">
          PDF opens in a new tab on some browsers, use the download button or right-click &rarr; Save As.
        </p>

        <div className="border-t border-stone-200 pt-10">
          <p className="text-stone-500 text-sm mb-4">
            While you&rsquo;re here, explore the free tools:
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <Link href="/gauge-calculator" className="text-stone-700 underline hover:text-stone-900">Gauge Calculator</Link>
            <Link href="/yarn-calculator" className="text-stone-700 underline hover:text-stone-900">Yarn Calculator</Link>
            <Link href="/needle-converter" className="text-stone-700 underline hover:text-stone-900">Needle Converter</Link>
            <Link href="/blanket-calculator" className="text-stone-700 underline hover:text-stone-900">Blanket Calculator</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
