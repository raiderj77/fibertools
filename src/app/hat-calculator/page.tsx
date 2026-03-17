import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
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
      <div className="sr-only">
        <h2>Hat Size Calculator Tool</h2>
        <h2>How to Calculate Hat Dimensions</h2>
        <h2>Hat Size Results and Crown Decrease Schedule</h2>
      </div>
      <HatCalculatorTool />
    </ToolLayout>
  );
}
