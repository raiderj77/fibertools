import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import GaugeCalculatorTool from "./GaugeCalculatorTool";

export const metadata: Metadata = {
  title: "Knitting Gauge Calculator — Stitches Per Inch",
  description:
    "Enter your swatch measurements and get stitches per inch, row gauge, and resized stitch counts instantly. Free knitting and crochet gauge tool.",
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
  alternates: { canonical: "/gauge-calculator" },
};

export default function GaugeCalculatorPage() {
  return (
    <ToolLayout slug="gauge-calculator">
      <div className="sr-only">
        <h2>Gauge Calculator and Pattern Resizer</h2>
        <h2>How to Calculate Your Gauge</h2>
        <h2>Gauge Calculation Results and Adjustments</h2>
      </div>
      <GaugeCalculatorTool />
    </ToolLayout>
  );
}
