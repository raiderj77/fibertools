import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import GaugeCalculatorTool from "./GaugeCalculatorTool";

export const metadata: Metadata = {
  title: "Gauge Calculator & Pattern Resizer — Free",
  description:
    "Calculate gauge from your swatch, resize patterns, and get exact stitch counts for knitting or crochet. Free, instant results — no signup required.",
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
