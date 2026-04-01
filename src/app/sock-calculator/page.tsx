import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import SockCalculatorTool from "./SockCalculatorTool";

export const metadata: Metadata = {
  title: "Sock Knitting Calculator",
  description:
    "Calculate sock stitch counts for top-down or toe-up with heel flap, gusset, and short-row heel instructions.",
  keywords: [
    "sock calculator",
    "sock knitting calculator",
    "toe up sock calculator",
    "heel flap calculator",
    "sock stitch count",
    "top down sock calculator",
  ],
  alternates: { canonical: "/sock-calculator" },
};

export default function SockCalculatorPage() {
  return (
    <ToolLayout slug="sock-calculator">
      <AnswerBlock
        what="A sock calculator that provides stitch counts for top-down or toe-up construction with heel flap, gusset, and short-row heel instructions."
        who="Sock knitters who need accurate stitch counts for any foot size and want shaping instructions for their preferred heel style."
        bottomLine="Enter your foot measurements and gauge to get a complete sock blueprint including heel and toe shaping."
        lastUpdated="2026-03-16"
      />
      <div className="sr-only">
        <h2>Sock Foot Calculator Tool</h2>
        <h2>How to Calculate Sock Stitches</h2>
        <h2>Sock Construction Results and Heel Instructions</h2>
      </div>
      <SockCalculatorTool />
    </ToolLayout>
  );
}
