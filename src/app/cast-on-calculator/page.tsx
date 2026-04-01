import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import CastOnCalculatorTool from "./CastOnCalculatorTool";

export const metadata: Metadata = {
  title: "Cast On Calculator",
  description:
    "Calculate how many stitches to cast on for any width with stitch pattern multiple rounding and edge stitch notes.",
  keywords: [
    "cast on calculator",
    "how many stitches to cast on",
    "knitting cast on count",
    "foundation chain calculator",
    "stitch count calculator",
    "cast on for width",
  ],
  alternates: { canonical: "/cast-on-calculator" },
};

export default function CastOnCalculatorPage() {
  return (
    <ToolLayout slug="cast-on-calculator">
      <AnswerBlock
        what="A calculator that determines how many stitches to cast on for any target width, with stitch pattern multiple rounding and edge stitch adjustments."
        who="Knitters who need the exact cast-on count for a custom-width project or when substituting yarn at a different gauge."
        bottomLine="Enter your gauge and desired width to get a cast-on number rounded to your pattern repeat."
        lastUpdated="2026-03-16"
      />
      <div className="sr-only">
        <h2>Cast On Calculator Tool</h2>
        <h2>How to Calculate Cast On Stitches</h2>
        <h2>Cast On Results and Pattern Multiple Adjustments</h2>
      </div>
      <CastOnCalculatorTool />
    </ToolLayout>
  );
}
