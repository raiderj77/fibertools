import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
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
      <C2cCalculatorTool />
    </ToolLayout>
  );
}
