import type { Metadata } from "next";
import Link from "next/link";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import YarnWeightChartTool from "./YarnWeightChartTool";

export const metadata: Metadata = {
  title: { absolute: "Yarn Weight Chart: Sizes 0–7, Gauge & Substitutions" },
  description:
    "Yarn weight chart for CYC sizes 0–7 with knitting and crochet gauge, WPI, tools, regional names, and current Size 8 status.",
  keywords: [
    "yarn weight chart",
    "yarn weight conversion",
    "yarn substitution",
    "DK vs worsted",
    "yarn weight categories",
    "ply conversion chart",
    "what is worsted weight yarn",
    "DK yarn equivalent",
    "Australian ply to US weight",
    "substitute yarn in pattern",
    "fingering vs sock yarn",
    "can I use DK instead of worsted",
    "yarn fiber guide",
    "wool vs cotton yarn",
    "yarn weight comparison",
  ],
  openGraph: {
    title: "Yarn Weight Chart: Sizes 0–7, Gauge & Substitutions",
    description:
      "CYC sizes 0–7 with knitting and crochet gauge, WPI, tool sizes, and regional names. Includes current Size 8 status. Compare substitutes, then swatch.",
    url: "https://fibertools.app/yarn-weight-chart",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Yarn Weight Chart & Substitution, Free" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yarn Weight Chart: Sizes 0–7, Gauge & Substitutions",
    description:
      "CYC sizes 0–7 with knitting and crochet gauge, WPI, tool sizes, and regional names. Includes current Size 8 status. Compare substitutes, then swatch.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/yarn-weight-chart" },
  other: { dateModified: "2026-10-17" },
};

export default function YarnWeightChartPage() {
  return (
    <ToolLayout slug="yarn-weight-chart">
      <div className="sr-only">
        <h2>Yarn Weight and Substitution Guide</h2>
        <h2>How to Identify Yarn Weights</h2>
        <h2>Yarn Weight Comparison and Substitution Results</h2>
      </div>
      <AnswerBlock
        what="A reference for the eight CYC yarn-weight rows 0–7 in the published detailed table, with knitting gauge, crochet gauge, WPI, regional names, and suggested needle and hook sizes."
        who="Knitters and crocheters comparing a yarn label, identifying an unlabeled yarn, or checking a possible substitution before swatching."
        bottomLine="Use the category and ranges as a starting point. Read the actual yarn label, follow the pattern, and swatch because category, gauge, and WPI ranges do not guarantee interchangeable yarns."
        lastUpdated="2026-10-17"
      />
      <YarnWeightChartTool />
      <section className="mt-8">
        <h2 className="section-heading">Reading the skein symbol</h2>
        <p className="text-bark-600 dark:text-cream-300 leading-relaxed text-[15px]">
          For the rows covered by this chart, the number from 0 through 7 inside the skein symbol identifies the
          CYC weight category. Use it to find the matching row, then check that yarn label&apos;s own gauge and tool
          guidance because those details apply to the specific yarn. The category is a starting point, not a promise
          that two yarns will behave the same.
        </p>
        <p className="mt-3 text-bark-600 dark:text-cream-300 leading-relaxed text-[15px]">
          CYC now says its updated system includes Size 8, Blocking, and Plus symbols. Its current public detailed
          table still supplies the numeric gauge and tool ranges used here only for sizes 0–7, so this chart does not
          invent a Size 8 row. See the{" "}
          <a
            href="https://www.craftyarncouncil.com/standards/yarn-weight-system"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sage-600 dark:text-sage-400 underline hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-600"
          >
            current CYC standard
          </a>
          .
        </p>
      </section>
      <p style={{ marginTop: "1.5rem", fontSize: "0.95rem" }}>
        Working with yarn that has lost its label? Use the{" "}
        <Link href="/yarn-weight-calculator">
          Yarn Weight Calculator
        </Link>{" "}
        to estimate possible categories from WPI or knitting stockinette gauge. Ready to
        evaluate a substitute yarn? Make a swatch, then use the{" "}
        <Link href="/gauge-calculator">
          Gauge Calculator
        </Link>{" "}
        to compare its stitch and row gauge with your pattern.
      </p>
    </ToolLayout>
  );
}
