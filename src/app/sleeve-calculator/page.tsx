import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import SleeveCalculatorTool from "./SleeveCalculatorTool";

export const metadata: Metadata = {
  title: "Sleeve Shaping Calculator",
  description:
    "Get row-by-row decrease instructions for tapered sleeves in knit or crochet with evenly distributed shaping.",
  keywords: [
    "sleeve shaping calculator",
    "sleeve decrease calculator",
    "tapered sleeve knitting",
    "sleeve shaping math",
    "knitting sleeve calculator",
  ],
  alternates: { canonical: "/sleeve-calculator" },
};

export default function SleeveCalculatorPage() {
  return (
    <ToolLayout slug="sleeve-calculator">
      <SleeveCalculatorTool />
    </ToolLayout>
  );
}
