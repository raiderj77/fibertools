import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import RaglanCalculatorTool from "./RaglanCalculatorTool";

export const metadata: Metadata = {
  title: "Raglan Sweater Calculator",
  description:
    "Calculate neck cast-on, stitch distribution, and increase rounds for a top-down raglan sweater construction.",
  keywords: [
    "raglan calculator",
    "top down raglan calculator",
    "raglan sweater calculator",
    "raglan increase calculator",
    "yoke calculator",
  ],
  alternates: { canonical: "/raglan-calculator" },
};

export default function RaglanCalculatorPage() {
  return (
    <ToolLayout slug="raglan-calculator" widgetFirst>
      <AnswerBlock
        what="A calculator for top-down raglan sweater construction that provides neck cast-on count, stitch distribution across sections, and increase round scheduling."
        who="Knitters designing or modifying a top-down raglan sweater who need the math for neck, yoke, and body proportions."
        bottomLine="Enter your gauge and measurements to get a complete raglan setup with stitch counts for each section."
        lastUpdated="2026-03-16"
      />
      <div className="sr-only">
        <h2>Raglan Calculator Tool</h2>
        <h2>How to Calculate Raglan Shaping</h2>
        <h2>Raglan Results and Increase Round Schedule</h2>
      </div>
      <RaglanCalculatorTool />
    </ToolLayout>
  );
}
