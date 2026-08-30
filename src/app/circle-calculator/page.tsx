import type { Metadata } from "next";
import Link from "next/link";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import CircleCalculatorTool from "./CircleCalculatorTool";

export const metadata: Metadata = {
  title: "Crochet Circle Round Planner - Preset Schedule",
  description:
    "Generate a bounded 3-to-30-round arithmetic schedule from a selected 6, 8, 12, or 16 starting-count preset, then check the actual fabric.",
  keywords: [
    "crochet circle round planner",
    "crochet circle increase schedule",
    "flat circle crochet reference",
    "crochet round stitch counts",
  ],
  authors: [{ name: "Jason Ramirez", url: "https://fibertools.app/about" }],
  openGraph: {
    title: "Crochet Circle Round Planner - Preset Schedule",
    description:
      "Generate a bounded selected-preset round schedule without treating it as a flatness or finished-size guarantee.",
    url: "https://fibertools.app/circle-calculator",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Crochet Circle Round Planner" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crochet Circle Round Planner - Preset Schedule",
    description:
      "Generate a bounded selected-preset round schedule without treating it as a flatness or finished-size guarantee.",
    images: ["/og-image.png"],
  },
  alternates: { canonical: "/circle-calculator" },
  other: { dateModified: "2026-08-29" },
};

export default function CircleCalculatorPage() {
  return (
    <ToolLayout
      slug="circle-calculator"
      widgetFirst
      focused
      nextAction={{
        href: "/amigurumi-pattern-checker",
        label: "Check written round math",
        description: "Already have supported written round instructions? Compare their stated totals with the bounded instruction checker.",
      }}
    >
      <AnswerBlock
        what="A bounded arithmetic planner for one of four common crochet starting-count presets: 6, 8, 12, or 16 additions per later round."
        who="Crocheters who want a count-preserving starting schedule to compare with a selected pattern and the actual fabric."
        bottomLine="The planner does not accept gauge or target diameter and cannot guarantee flatness, roundness, fit, or finished size."
        lastUpdated="2026-08-29"
      />

      <CircleCalculatorTool />

      <section className="mt-12 border-t border-bark-200 pt-6 dark:border-bark-700">
        <h2 className="mb-3 text-base font-semibold text-bark-700 dark:text-cream-300">References</h2>
        <p className="text-sm leading-relaxed text-bark-500 dark:text-bark-400">
          <Link
            href="https://www.craftyarncouncil.com/standards/crochet-chart-symbols"
            className="text-sage-600 underline dark:text-sage-400"
            target="_blank"
            rel="nofollow noopener"
          >
            Craft Yarn Council crochet symbols
          </Link>{" "}
          provide the stitch terminology reference. The 6, 8, 12, and 16 values in this tool are explicitly labeled FiberTools starting presets; the linked standard does not establish them as universal flatness rules.
        </p>
      </section>
    </ToolLayout>
  );
}
