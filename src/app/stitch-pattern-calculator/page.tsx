import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
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
  alternates: { canonical: "/stitch-pattern-calculator" },
};

export default function StitchPatternCalculatorPage() {
  return (
    <ToolLayout slug="stitch-pattern-calculator">
      <StitchPatternCalculatorTool />
    </ToolLayout>
  );
}
