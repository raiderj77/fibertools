import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
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
    <ToolLayout slug="raglan-calculator">
      <RaglanCalculatorTool />
    </ToolLayout>
  );
}
