import type { Metadata } from "next";
import Link from "next/link";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import AmigurumiShapesTool from "./AmigurumiShapesTool";

const description =
  "Generate bounded, count-consistent single-crochet references for basic sphere, stepped-cone, circular-base cylinder, and foundation-chain oval starts.";

export const metadata: Metadata = {
  title: "Basic Amigurumi Shape Stitch-Count References",
  description,
  keywords: [
    "amigurumi stitch count reference",
    "crochet sphere count schedule",
    "crochet cylinder base rounds",
    "crochet oval foundation chain",
    "basic crochet cone counts",
  ],
  authors: [{ name: "Jason Ramirez", url: "https://fibertools.app/about" }],
  openGraph: {
    title: "Basic Amigurumi Shape Stitch-Count References",
    description,
    url: "https://fibertools.app/amigurumi-shapes",
    images: [{
      url: "https://fibertools.app/og-image.png",
      width: 1200,
      height: 630,
      alt: "Basic amigurumi shape stitch-count references",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Basic Amigurumi Shape Stitch-Count References",
    description,
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/amigurumi-shapes" },
  other: { dateModified: "2026-08-29" },
};

export default function AmigurumiShapesPage() {
  return (
    <ToolLayout
      slug="amigurumi-shapes"
      widgetFirst
      focused
      pageTitle="Basic Amigurumi Shape Count References"
      nextAction={{
        href: "/amigurumi-pattern-checker",
        label: "Check written round math",
        description: "Compare supported written round instructions with their stated stitch totals.",
      }}
    >
      <AnswerBlock
        what="A bounded generator for basic single-crochet stitch-count schedules: symmetric six-stitch sphere counts, an alternating-increase cone, a circular base plus even cylinder rounds, or an oval start worked around a foundation chain."
        who="Crocheters who want arithmetic references to adapt and swatch while designing basic stuffed forms."
        bottomLine="The schedules make their written counts internally consistent. They do not guarantee a finished geometric shape, size, technique, stuffing result, or safe toy construction."
        lastUpdated="2026-08-29"
      />
      <AmigurumiShapesTool />
      <section className="mt-12 border-t border-bark-200 pt-6 dark:border-bark-700">
        <h2 className="mb-3 text-base font-semibold text-bark-700 dark:text-cream-300">References</h2>
        <p className="text-sm text-bark-500 dark:text-bark-400">
          Crochet stitch names and symbols: {" "}
          <Link
            href="https://www.craftyarncouncil.com/standards/crochet-chart-symbols"
            className="text-sage-600 underline dark:text-sage-400"
            target="_blank"
            rel="nofollow noopener"
          >
            Craft Yarn Council Crochet Chart Symbols
          </Link>.
          The generated schedules are FiberTools arithmetic references, not published patterns.
        </p>
      </section>
    </ToolLayout>
  );
}
