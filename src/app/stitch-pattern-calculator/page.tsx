import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import StitchPatternCalculatorTool from "./StitchPatternCalculatorTool";

export const metadata: Metadata = {
  title: "Stitch Pattern Calculator, Free Online",
  description:
    "Find compatible stitch counts for sampler blankets. Browse 50+ stitch patterns and calculate the LCM instantly. Free, no signup required.",
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
    "waffle stitch multiple",
    "shell stitch multiple",
    "crochet stitch library",
    "stitch pattern database",
    "knitting stitch multiples",
    "sampler blanket row planner",
    "crochet row repeat calculator",
    "stitch compatibility calculator",
  ],
  openGraph: {
    title: "Stitch Pattern Calculator, Free Online",
    description:
      "Find compatible stitch counts for sampler blankets. Browse 50+ stitch patterns and calculate the LCM instantly. Free, no signup required.",
    url: "https://fibertools.app/stitch-pattern-calculator",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Stitch Pattern Calculator, Free Online" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stitch Pattern Calculator, Free Online",
    description:
      "Find compatible stitch counts for sampler blankets. Browse 50+ stitch patterns and calculate the LCM instantly. Free, no signup required.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/stitch-pattern-calculator" },
};

export default function StitchPatternCalculatorPage() {
  return (
    <ToolLayout slug="stitch-pattern-calculator" widgetFirst>
      <AnswerBlock
        what="A calculator that finds compatible stitch counts for sampler blankets by computing the LCM across 50+ stitch patterns you select."
        who="Crocheters and knitters planning sampler blankets who need a stitch count that works with multiple pattern repeats."
        bottomLine="Select the stitch patterns you want to combine and get the smallest stitch count that divides evenly into all of them."
        lastUpdated="2026-03-16"
      />
      <div className="sr-only">
        <h2>Stitch Pattern Calculator Tool</h2>
        <h2>How to Find Compatible Stitch Counts</h2>
        <h2>Stitch Pattern Results and Sampler Planning</h2>
      </div>
      <StitchPatternCalculatorTool />

      {/* Content sections */}

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          Why is combining stitch patterns in a sampler blanket so tricky?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Each crochet stitch pattern has its own repeat requirement, which is the number of stitches it needs to work correctly. When you want to use two patterns side by side in the same blanket, your total stitch count must be divisible by all the pattern multiples at once.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Think of it like finding a time when two events line up. One pattern might need multiples of 5, and another needs multiples of 8. If you just pick any number of stitches, one pattern will work but the other will have leftover stitches that break the design. Your sampler blanket will look unfinished or messy on the edges.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          This is where the least common multiple, or LCM, comes in. It finds the smallest number that works for all your chosen patterns at the same time. This saves you from guessing or ripping back after discovering your stitch count does not fit.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          How do you know if a crochet stitch pattern multiple matches your blanket plan?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Check the pattern instructions for the stitch multiple listed near the abbreviations or materials section, usually written as something like &quot;multiple of 4 plus 2.&quot; Use this number when calculating compatible stitch counts for your sampler.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          If the pattern is described only in rows without a stated multiple, count the stitches across one full stitch repeat in the written or charted instructions. For example, if a fan stitch repeats every 6 stitches, then 6 is your multiple. The part that comes after the multiple (like plus 2) means those extra stitches go at the edges for balance, not in the repeat itself.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Once you have the multiples for all the patterns you want to combine, plug them into a stitch pattern calculator to find the ideal stitch count. This removes the guesswork and ensures every pattern in your blanket sampler lines up neatly from edge to edge.
        </p>
      </section>
    </ToolLayout>
  );
}
