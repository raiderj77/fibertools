import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import IncDecCalculatorTool from "./IncDecCalculatorTool";

export const metadata: Metadata = {
  title: "Increase & Decrease Calculator",
  description:
    "Get stitch-by-stitch instructions to distribute increases or decreases evenly across a row or round. Works for knitting and crochet patterns.",
  keywords: [
    "increase evenly calculator", "decrease evenly knitting", "distribute increases",
    "evenly spaced decreases", "knitting increase calculator", "how to increase evenly across a row",
    "distribute decreases crochet", "increase 10 stitches evenly", "knitting math increase",
    "crochet increase calculator", "even decrease calculator", "stitch distribution calculator",
  ],
};

export default function IncDecCalculatorPage() {
  return (
    <ToolLayout slug="increase-decrease-calculator">
      <IncDecCalculatorTool />
    </ToolLayout>
  );
}
