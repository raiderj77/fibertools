import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import BlanketCalculatorTool from "./BlanketCalculatorTool";

export const metadata: Metadata = {
  title: "Free Blanket Size Calculator — Stitch Count & Yardage for Any Blanket | FiberTools",
  description:
    "Calculate stitch counts, row counts, and yarn yardage for any blanket size from baby to California king. Includes pillow tuck, overhang, and stitch multiple rounding.",
  keywords: [
    "blanket size chart", "crochet blanket sizes", "blanket size calculator",
    "how big should a blanket be", "baby blanket size crochet", "throw blanket dimensions",
    "king size blanket crochet stitches", "how many chains for a throw blanket",
    "crochet blanket yardage chart", "blanket dimensions chart",
    "blanket yarn calculator", "crochet blanket calculator",
    "knitting blanket size guide", "blanket stitch count",
  ],
};

export default function BlanketCalculatorPage() {
  return (
    <ToolLayout slug="blanket-calculator">
      <BlanketCalculatorTool />
    </ToolLayout>
  );
}
