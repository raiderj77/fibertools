import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import C2cCalculatorTool from "./C2cCalculatorTool";

export const metadata: Metadata = {
  title: "C2C Blanket Calculator",
  description:
    "Plan your corner-to-corner crochet blanket with block counts, diagonal rows, and yardage estimates from your gauge swatch.",
  keywords: [
    "C2C calculator",
    "corner to corner crochet calculator",
    "C2C blanket size",
    "C2C block calculator",
    "diagonal crochet planner",
    "corner to corner blanket",
  ],
  alternates: { canonical: "/c2c-calculator" },
};

export default function C2cCalculatorPage() {
  return (
    <ToolLayout slug="c2c-calculator">
      <AnswerBlock
        what="A corner-to-corner crochet planner that calculates block counts, diagonal rows, and yardage estimates from your gauge swatch."
        who="Crocheters planning a C2C blanket or project who need to know how many blocks and how much yarn the design requires."
        bottomLine="Enter your target dimensions and gauge to get accurate block counts and yarn estimates for your C2C project."
        lastUpdated="2026-03-16"
      />
      <div className="sr-only">
        <h2>Corner-to-Corner Blanket Calculator</h2>
        <h2>How to Plan a C2C Crochet Blanket</h2>
        <h2>C2C Block Counts and Yardage Estimates</h2>
      </div>
      <C2cCalculatorTool />
    </ToolLayout>
  );
}
