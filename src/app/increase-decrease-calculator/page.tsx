import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import IncDecCalculatorTool from "./IncDecCalculatorTool";

export const metadata: Metadata = {
  title: "Increase & Decrease Calculator — Free",
  description:
    "Get exact stitch-by-stitch instructions to distribute increases or decreases evenly across any row or round. Free tool for knitting and crochet.",
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
