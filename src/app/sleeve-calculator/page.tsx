import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
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
      <AnswerBlock
        what="A calculator that generates row-by-row decrease instructions for tapered sleeves with evenly distributed shaping."
        who="Knitters and crocheters who need to taper a sleeve from upper arm to cuff and want the math done for them."
        bottomLine="Enter your upper arm and cuff stitch counts plus sleeve length to get an even decrease schedule."
        lastUpdated="2026-03-16"
      />
      <div className="sr-only">
        <h2>Sleeve Shaping Calculator Tool</h2>
        <h2>How to Calculate Sleeve Decreases</h2>
        <h2>Sleeve Shaping Results and Row Instructions</h2>
      </div>
      <SleeveCalculatorTool />
    </ToolLayout>
  );
}
