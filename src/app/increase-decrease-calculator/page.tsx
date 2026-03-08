import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import IncDecCalculatorTool from "./IncDecCalculatorTool";

export const metadata: Metadata = {
  title: "Evenly Spaced Increase & Decrease Calculator",
  description:
    "Calculate exactly where to place increases or decreases evenly across any row or round. Step-by-step instructions for knitting and crochet. Free.",
  keywords: [
    "increase evenly calculator", "decrease evenly knitting", "distribute increases",
    "evenly spaced decreases", "knitting increase calculator", "how to increase evenly across a row",
    "distribute decreases crochet", "increase 10 stitches evenly", "knitting math increase",
    "crochet increase calculator", "even decrease calculator", "stitch distribution calculator",
  ],
  alternates: { canonical: "/increase-decrease-calculator" },
};

export default function IncDecCalculatorPage() {
  return (
    <ToolLayout slug="increase-decrease-calculator">
      <IncDecCalculatorTool />
    </ToolLayout>
  );
}
