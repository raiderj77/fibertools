import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Free Gauge Calculator & Pattern Resizer Online | FiberTools",
  description: "Calculate gauge from a swatch, resize patterns, and get exact stitch counts.",
};

export default function GaugeCalculatorPage() {
  return (
    <ToolLayout slug="gauge-calculator">
      <ComingSoon slug="gauge-calculator" />
    </ToolLayout>
  );
}
