import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import GaugeCalculatorTool from "./GaugeCalculatorTool";

export const metadata: Metadata = {
  title: "Free Gauge Calculator & Pattern Resizer — Stitch Count Calculator | FiberTools",
  description:
    "Calculate your knitting or crochet gauge from a swatch, resize patterns to a new gauge, and get exact stitch and row counts for any dimension. Includes stitch multiple rounding.",
  keywords: [
    "gauge calculator",
    "crochet gauge calculator",
    "knitting gauge converter",
    "pattern resizer",
    "resize crochet pattern",
    "stitch calculator",
    "how to calculate gauge",
    "stitches per inch calculator",
    "crochet blanket stitch calculator",
    "how many stitches per inch",
    "resize knitting pattern different yarn",
    "cast on calculator",
    "foundation chain calculator",
    "gauge swatch calculator",
    "knitting math calculator",
  ],
};

export default function GaugeCalculatorPage() {
  return (
    <ToolLayout slug="gauge-calculator">
      <GaugeCalculatorTool />
    </ToolLayout>
  );
}
