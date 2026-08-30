import type { Metadata } from "next";
import Link from "next/link";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import YarnCalculatorTool from "./YarnCalculatorTool";

const description =
  "Scale measured yarn use from a representative swatch to a flat rectangular project, then convert the estimate to whole skeins from your yarn label.";

export const metadata: Metadata = {
  title: "Measured Swatch Yarn Calculator for Flat Fabric",
  description,
  keywords: [
    "measured swatch yarn calculator",
    "flat fabric yarn estimate",
    "swatch yarn consumption",
    "yarn skein calculator",
    "partial skein calculator",
  ],
  authors: [{ name: "Jason Ramirez", url: "https://fibertools.app/about" }],
  openGraph: {
    title: "Measured Swatch Yarn Calculator for Flat Fabric",
    description,
    url: "https://fibertools.app/yarn-calculator",
    images: [{
      url: "https://fibertools.app/og-image.png",
      width: 1200,
      height: 630,
      alt: "Measured swatch yarn calculator",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Measured Swatch Yarn Calculator for Flat Fabric",
    description,
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/yarn-calculator" },
  other: { dateModified: "2026-08-29" },
};

export default function YarnCalculatorPage() {
  return (
    <ToolLayout
      slug="yarn-calculator"
      widgetFirst
      focused
      pageTitle="Measured Swatch Yarn Calculator"
      nextAction={{
        href: "/project-cost-calculator",
        label: "Estimate the project cost",
        description: "Carry the whole-skein count into a materials and optional labor-cost estimate.",
      }}
    >
      <AnswerBlock
        what="A proportional estimate for flat rectangular fabric: finished area divided by swatch area, multiplied by yarn length actually consumed by a representative swatch."
        who="Knitters and crocheters who can make a swatch with the same yarn, stitch pattern, tools, tension, and finishing planned for a flat project."
        bottomLine="Measure the swatch dimensions and yarn used. The result scales that measured consumption and lists any planning allowance separately; it does not model garments, shaping, seams, borders, or three-dimensional pieces."
        lastUpdated="2026-08-29"
      />
      <YarnCalculatorTool />
      <section className="mt-12 border-t border-bark-200 pt-6 dark:border-bark-700">
        <h2 className="mb-3 text-base font-semibold text-bark-700 dark:text-cream-300">References</h2>
        <p className="text-sm text-bark-500 dark:text-bark-400">
          Yarn-label weight categories and length units: {" "}
          <Link
            href="https://www.craftyarncouncil.com/standards/yarn-weight-system"
            className="text-sage-600 underline dark:text-sage-400"
            target="_blank"
            rel="nofollow noopener"
          >
            Craft Yarn Council Standard Yarn Weight System
          </Link>.
          The proportional swatch-scaling model and its limits are stated above.
        </p>
      </section>
    </ToolLayout>
  );
}
