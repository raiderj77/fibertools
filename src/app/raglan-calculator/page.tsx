import type { Metadata } from "next";
import Link from "next/link";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import RaglanCalculatorTool from "./RaglanCalculatorTool";

export const metadata: Metadata = {
  title: "Raglan Sweater Calculator",
  description:
    "Calculate neck cast-on, stitch distribution, and increase rounds for a top-down raglan sweater construction.",
  keywords: [
    "raglan calculator",
    "top down raglan calculator",
    "raglan sweater calculator",
    "raglan increase calculator",
    "yoke calculator",
  ],
  alternates: { canonical: "/raglan-calculator" },
  openGraph: {
    title: "Raglan Sweater Calculator",
    description:
      "Calculate neck cast-on, stitch distribution, and increase rounds for a top-down raglan sweater construction.",
    url: "https://fibertools.app/raglan-calculator",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Raglan Sweater Calculator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Raglan Sweater Calculator",
    description:
      "Calculate neck cast-on, stitch distribution, and increase rounds for a top-down raglan sweater construction.",
    images: ["/og-image.png"],
  },
};

export default function RaglanCalculatorPage() {
  return (
    <ToolLayout slug="raglan-calculator" widgetFirst>
      <AnswerBlock
        what="A calculator for top-down raglan sweater construction that provides neck cast-on count, stitch distribution across sections, and increase round scheduling."
        who="Knitters designing or modifying a top-down raglan sweater who need the math for neck, yoke, and body proportions."
        bottomLine="Enter your gauge and measurements to get a complete raglan setup with stitch counts for each section."
        lastUpdated="2026-03-16"
      />
      <div className="sr-only">
        <h2>Raglan Calculator Tool</h2>
        <h2>How to Calculate Raglan Shaping</h2>
        <h2>Raglan Results and Increase Round Schedule</h2>
      </div>
      <RaglanCalculatorTool />
      <section className="mt-10">
        <h2 className="section-heading">Plan the rest of your raglan project</h2>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Use the{" "}
          <Link href="/yarn-calculator" className="text-sage-700 dark:text-sage-300 underline underline-offset-2">
            yarn calculator
          </Link>{" "}
          to estimate yardage from the same gauge, and the{" "}
          <Link href="/cast-on-calculator" className="text-sage-700 dark:text-sage-300 underline underline-offset-2">
            cast-on calculator
          </Link>{" "}
          when a hem, cuff, or separate neckline needs to fit a stitch-pattern repeat. After the yoke split, the{" "}
          <Link href="/sleeve-calculator" className="text-sage-700 dark:text-sage-300 underline underline-offset-2">
            sleeve calculator
          </Link>{" "}
          can distribute taper decreases for the remaining sleeve length.
        </p>
      </section>
    </ToolLayout>
  );
}
