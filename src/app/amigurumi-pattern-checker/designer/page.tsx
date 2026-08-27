import type { Metadata } from "next";
import Link from "next/link";
import StitchProofDesignerWorkspace from "./StitchProofDesignerWorkspace";

export const metadata: Metadata = {
  title: "StitchProof Designer Report and Version Compare",
  description:
    "Compare amigurumi pattern revisions, record corrections, and create a private browser-local QA report without uploading your pattern.",
  alternates: { canonical: "/amigurumi-pattern-checker/designer" },
  openGraph: {
    title: "StitchProof Designer Report and Version Compare",
    description:
      "Check supported round math, compare revisions, and keep a private QA report in your browser.",
    url: "https://fibertools.app/amigurumi-pattern-checker/designer",
    images: [
      {
        url: "https://fibertools.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "FiberTools StitchProof Designer Report",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StitchProof Designer Report and Version Compare",
    description: "Private, deterministic amigurumi pattern QA in your browser.",
    images: ["https://fibertools.app/og-image.png"],
  },
};

export default function StitchProofDesignerPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <nav className="no-print mb-5 flex flex-wrap items-center gap-2 text-sm text-bark-500" aria-label="Breadcrumb">
        <Link href="/" className="text-sage-600 underline">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link href="/amigurumi-pattern-checker" className="text-sage-600 underline">
          Amigurumi Pattern Checker
        </Link>
        <span aria-hidden="true">/</span>
        <span>Designer workspace</span>
      </nav>

      <header className="no-print overflow-hidden rounded-3xl border border-plum-200 bg-gradient-to-br from-plum-50 via-white to-sage-50 px-5 py-9 dark:border-plum-800 dark:from-plum-900/30 dark:via-bark-900 dark:to-sage-900/20 sm:px-9 sm:py-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-plum-600 dark:text-plum-300">
          StitchProof founding preview
        </p>
        <h1 className="mt-3 max-w-4xl text-3xl font-bold leading-tight text-bark-800 dark:text-cream-100 sm:text-5xl">
          Check the math. Compare the revision. Keep the report.
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-bark-700 dark:text-cream-300 sm:text-lg">
          StitchProof reviews supported amigurumi round math in your browser, tracks corrections, and compares
          pattern versions without uploading your pattern.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full bg-white px-3 py-1.5 font-semibold text-sage-700 shadow-sm dark:bg-bark-800 dark:text-sage-300">
            No account
          </span>
          <span className="rounded-full bg-white px-3 py-1.5 font-semibold text-sage-700 shadow-sm dark:bg-bark-800 dark:text-sage-300">
            Browser-local processing
          </span>
          <span className="rounded-full bg-white px-3 py-1.5 font-semibold text-sage-700 shadow-sm dark:bg-bark-800 dark:text-sage-300">
            Deterministic checks only
          </span>
        </div>
      </header>

      <StitchProofDesignerWorkspace />
    </div>
  );
}
