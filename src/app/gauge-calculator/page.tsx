import type { Metadata } from "next";
import Link from "next/link";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import GaugeCalculatorTool from "./GaugeCalculatorTool";

export const metadata: Metadata = {
  title: "Knitting and Crochet Gauge Calculator",
  description:
    "Calculate gauge from a measured swatch, proportionally scale entered stitch or row counts, and review an at-or-above width checkpoint.",
  keywords: [
    "gauge calculator",
    "crochet gauge calculator",
    "knitting gauge calculator",
    "stitches per inch calculator",
    "gauge swatch calculator",
    "stitch count calculator",
  ],
  alternates: { canonical: "/gauge-calculator" },
  openGraph: {
    title: "Knitting and Crochet Gauge Calculator",
    description:
      "Calculate measured gauge and bounded proportional stitch or row checkpoints from the values you enter.",
    url: "https://fibertools.app/gauge-calculator",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Knitting and Crochet Gauge Calculator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Knitting and Crochet Gauge Calculator",
    description:
      "Calculate measured gauge and bounded proportional stitch or row checkpoints from the values you enter.",
    images: ["/og-image.png"],
  },
  other: { dateModified: "2026-08-29" },
};

export default function GaugeCalculatorPage() {
  return (
    <ToolLayout
      slug="gauge-calculator"
      widgetFirst
      focused
      nextAction={{
        href: "/stitch-pattern-calculator",
        label: "Reconcile a stitch repeat",
        description: "If several repeat constraints must agree, use the bounded multiple-plus solver before returning to the selected pattern.",
      }}
    >
      <AnswerBlock
        what="A bounded worksheet that calculates gauge from entered swatch measurements and proportionally scales only the stitch or row counts you enter."
        who="Knitters and crocheters checking measured fabric or one arithmetic checkpoint against a tested pattern."
        bottomLine="Use a representative treated swatch. The results do not regrade shaping, verify fit, choose an edge treatment, or replace project-specific pattern instructions."
        lastUpdated="2026-08-29"
      />

      <GaugeCalculatorTool />

      <section className="mt-12 border-t border-bark-200 pt-6 dark:border-bark-700">
        <h2 className="mb-3 text-base font-semibold text-bark-700 dark:text-cream-300">References</h2>
        <ul className="space-y-2 text-sm text-bark-500 dark:text-bark-400">
          <li>
            <Link className="text-sage-600 underline dark:text-sage-400" href="https://www.craftyarncouncil.com/read_instructions.html" target="_blank" rel="nofollow noopener">
              Craft Yarn Council: Reading Instructions &amp; Other Basics
            </Link>{" "}
            describes making a representative gauge swatch and checking it against the pattern.
          </li>
          <li>
            <Link className="text-sage-600 underline dark:text-sage-400" href="https://www.craftyarncouncil.com/standards/yarn-weight-system" target="_blank" rel="nofollow noopener">
              Craft Yarn Council: Standard Yarn Weight System
            </Link>{" "}
            publishes guideline gauge ranges and says to follow the gauge stated in the pattern.
          </li>
        </ul>
      </section>
    </ToolLayout>
  );
}
