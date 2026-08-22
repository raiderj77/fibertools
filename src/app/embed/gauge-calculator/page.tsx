import type { Metadata } from "next";
import GaugeCalculatorTool from "@/app/gauge-calculator/GaugeCalculatorTool";
import EmbedCalculatorShell from "@/components/EmbedCalculatorShell";

export const metadata: Metadata = {
  title: "Gauge Calculator Embed",
  description: "A free branded FiberTools knitting and crochet gauge calculator embed.",
  alternates: { canonical: "/gauge-calculator" },
  robots: { index: false, follow: false },
};

export default function GaugeCalculatorEmbedPage() {
  return (
    <EmbedCalculatorShell
      name="Gauge Calculator & Pattern Resizer"
      description="Calculate gauge from a swatch, resize stitch and row counts, or convert a target size into project counts."
      fullCalculatorPath="/gauge-calculator"
    >
      <GaugeCalculatorTool embedded />
    </EmbedCalculatorShell>
  );
}
