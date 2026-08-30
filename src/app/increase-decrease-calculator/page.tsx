import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import IncDecCalculatorTool from "./IncDecCalculatorTool";

export const metadata: Metadata = {
  title: "Evenly Spaced Increase & Decrease Calculator",
  description:
    "Plan one bounded knitting or crochet row or round that consumes the starting stitch count and produces the selected target count.",
  keywords: [
    "increase evenly calculator", "decrease evenly knitting", "distribute increases",
    "evenly spaced decreases", "knitting increase calculator", "how to increase evenly across a row",
    "distribute decreases crochet", "increase 10 stitches evenly", "knitting math increase",
    "crochet increase calculator", "even decrease calculator", "stitch distribution calculator",
  ],
  openGraph: {
    title: "Evenly Spaced Increase & Decrease Calculator",
    description:
      "Plan one bounded knitting or crochet row or round that consumes the starting stitch count and produces the selected target count.",
    url: "https://fibertools.app/increase-decrease-calculator",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Evenly Spaced Increase & Decrease Calculator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Evenly Spaced Increase & Decrease Calculator",
    description:
      "Plan one bounded knitting or crochet row or round that consumes the starting stitch count and produces the selected target count.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/increase-decrease-calculator" },
};

export default function IncDecCalculatorPage() {
  return (
    <ToolLayout slug="increase-decrease-calculator">
      <AnswerBlock
        what="A bounded single-pass calculator that distributes KFB or K2tog, with equivalent single-crochet examples, across one row or round."
        who="Knitters and crocheters following a pattern that says 'increase X stitches evenly' without telling you where to place them."
        bottomLine="Choose a direction and enter the starting and target counts; supported results consume the start and produce the target exactly, but your pattern still determines the stitch method and visual placement."
        lastUpdated="2026-08-29"
      />
      <div className="sr-only">
        <h2>Increase and Decrease Calculator</h2>
        <h2>How to Distribute Increases Evenly</h2>
        <h2>Increase and Decrease Stitch Instructions</h2>
      </div>
      <IncDecCalculatorTool />

      {/* Content sections */}

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          What does the stitch distribution model guarantee?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            For a supported request, the generated groups consume every starting stitch once and produce the entered target count after one row or round. The calculator also rejects fractional, out-of-range, direction-mismatched, and overly dense one-pass requests.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          The knitting examples use KFB for an increase and K2tog for a decrease. The crochet examples use two single crochets in one stitch and SC2tog. Those choices make the count arithmetic explicit, but they may not match the lean, texture, stitch pattern, or shaping method required by your pattern.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Even numerical spacing does not guarantee invisible shaping, a flat edge, or a particular fabric appearance. Work a sample or follow the designer&rsquo;s stated placement when appearance matters.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          Why can some requested count changes be unsupported?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            This tool models at most one KFB or one two-in-one single-crochet increase per source stitch, and non-overlapping two-to-one decreases. Larger changes need more than one pass or a pattern-specific construction.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          In increase mode, the target must be greater than the start and cannot exceed twice the starting count. In decrease mode, the target must be smaller than the start and cannot be less than half the starting count. These limits keep every modeled change tied to real source stitches.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          If the pattern requests a denser change, multiple shaping rows, paired left- and right-leaning decreases, edge treatment, or a motif-aware distribution, use that pattern instead of forcing the count through this single-pass model.
        </p>
      </section>
    </ToolLayout>
  );
}
