import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import HatCalculatorTool from "./HatCalculatorTool";

export const metadata: Metadata = {
  title: "Hat Size Calculator",
  description:
    "Get cast-on count, crown decrease schedule, and yardage for any head size — preemie to large adult with ease adjustments.",
  keywords: [
    "hat calculator",
    "knit hat size chart",
    "beanie calculator",
    "crown decrease calculator",
    "hat stitch count",
    "crochet hat calculator",
  ],
  alternates: { canonical: "/hat-calculator" },
};

export default function HatCalculatorPage() {
  return (
    <ToolLayout slug="hat-calculator">
      <AnswerBlock
        what="A calculator that provides cast-on count, crown decrease schedule, and yardage for any head size from preemie to large adult with ease adjustments."
        who="Knitters and crocheters making hats who need accurate stitch counts and shaping instructions for a specific head circumference."
        bottomLine="Select the head size and enter your gauge to get a complete hat blueprint with crown shaping instructions."
        lastUpdated="2026-03-16"
      />
      <div className="sr-only">
        <h2>Hat Size Calculator Tool</h2>
        <h2>How to Calculate Hat Dimensions</h2>
        <h2>Hat Size Results and Crown Decrease Schedule</h2>
      </div>
      <HatCalculatorTool />
    </ToolLayout>
  );
}
