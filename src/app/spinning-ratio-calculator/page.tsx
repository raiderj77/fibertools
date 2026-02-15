import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Free Spinning Wheel Ratio Calculator Online | FiberTools",
  description: "Calculate drive ratios and twists per inch for handspinning.",
};

export default function SpinningRatioCalculatorPage() {
  return (
    <ToolLayout slug="spinning-ratio-calculator">
      <ComingSoon slug="spinning-ratio-calculator" />
    </ToolLayout>
  );
}
