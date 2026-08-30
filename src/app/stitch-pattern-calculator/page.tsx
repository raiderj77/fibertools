import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import StitchPatternCalculatorTool from "./StitchPatternCalculatorTool";

export const metadata: Metadata = {
  title: "Stitch Pattern Calculator, Free Online",
  description:
    "Check bounded whole-stitch counts against entered multiple-of M plus P constraints, optional per-side edges, and a gauge range. Arithmetic reference only.",
  keywords: [
    "stitch pattern calculator",
    "crochet stitch multiple calculator",
    "sampler blanket planner",
    "stitch multiple calculator",
    "crochet blanket stitch calculator",
    "combine stitch patterns",
    "stitch repeat calculator",
    "crochet multiple of stitches",
    "blanket sampler stitch count",
    "lcm stitch calculator",
    "knitting stitch multiples",
    "stitch compatibility calculator",
  ],
  openGraph: {
    title: "Stitch Pattern Calculator, Free Online",
    description:
      "Check bounded whole-stitch counts against entered repeat constraints, optional per-side edges, and a gauge range.",
    url: "https://fibertools.app/stitch-pattern-calculator",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Stitch Pattern Calculator, Free Online" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stitch Pattern Calculator, Free Online",
    description:
      "Check bounded whole-stitch counts against entered repeat constraints, optional per-side edges, and a gauge range.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/stitch-pattern-calculator" },
};

export default function StitchPatternCalculatorPage() {
  return (
    <ToolLayout slug="stitch-pattern-calculator" widgetFirst>
      <AnswerBlock
        what="A bounded arithmetic reference that finds whole totals satisfying up to eight entered “multiple of M plus P” constraints within 1 to 10,000 stitches."
        who="Crocheters and knitters comparing stated stitch-repeat arithmetic before they swatch or follow a pattern."
        bottomLine="A returned total satisfies the entered arithmetic after the edge allowance is added to each side. It does not validate the pattern, construction, gauge, fit, or yarn requirement."
        lastUpdated="2026-08-29"
      />
      <div className="sr-only">
        <h2>Stitch Pattern Calculator Tool</h2>
        <h2>How Stitch Multiple Constraints Are Combined</h2>
        <h2>Calculator Limits and Result Interpretation</h2>
      </div>
      <StitchPatternCalculatorTool />

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          How are stitch multiples and plus values combined?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            An instruction such as &quot;multiple of 4 plus 1&quot; means the pattern-stitch count must equal 4 times a whole number of repeats, plus 1. The plus value is part of the arithmetic and cannot be treated as simple divisibility by 4.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          The calculator combines the entered constraints and reports an error when their plus offsets cannot share a solution. When they are compatible, the displayed LCM is the spacing between shared arithmetic solutions, not proof that the underlying pattern instructions are correct.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          At least one full repeat is required for every entered pattern, so a plus-only count is not returned as a usable repeat.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Edge stitches are entered per side and added twice to each returned total. The repeat constraints are checked against the remaining pattern stitches.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          What limits and checks does this calculator apply?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            One calculation accepts up to 8 patterns, multiples from 1 through 1,000, plus values from 0 through 10,000, and a total-stitch range from 1 through 10,000. Edge allowances are limited to 5,000 stitches per side. It rejects a combined solution spacing above 1,000,000,000 and displays at most the first 500 matches.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Gauge mode converts the entered physical-width interval to whole stitch counts inside that interval. A zero tolerance remains zero. Required or out-of-range inputs, fractional values in whole-count fields, and reversed ranges produce an error instead of a fallback result; plus, edge, and tolerance fields allow zero.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Confirm every multiple and plus value against the source pattern, then swatch and follow the designer&apos;s construction and edge instructions. Arithmetic compatibility alone does not establish finished dimensions or pattern suitability.
        </p>
      </section>
    </ToolLayout>
  );
}
