import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import StitchPatternCalculatorTool from "./StitchPatternCalculatorTool";

export const metadata: Metadata = {
  title: "Stitch Pattern Calculator — Free Online",
  description:
    "Find compatible stitch counts for sampler blankets. Browse 50+ stitch patterns and calculate the LCM instantly. Free — no signup required.",
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
    title: "Stitch Pattern Calculator — Free Online",
    description:
      "Find compatible stitch counts for sampler blankets. Browse 50+ stitch patterns and calculate the LCM instantly. Free — no signup required.",
    url: "https://fibertools.app/stitch-pattern-calculator",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Stitch Pattern Calculator — Free Online" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stitch Pattern Calculator — Free Online",
    description:
      "Find compatible stitch counts for sampler blankets. Browse 50+ stitch patterns and calculate the LCM instantly. Free — no signup required.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/stitch-pattern-calculator" },
};

export default function StitchPatternCalculatorPage() {
  return (
    <ToolLayout slug="stitch-pattern-calculator">
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
    </ToolLayout>
  );
}
