import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import SpinningCalculatorTool from "./SpinningCalculatorTool";

export const metadata: Metadata = {
  title: "Spinning Wheel Ratio Calculator — Free",
  description:
    "Calculate drive ratios, twists per inch, and plying twist for handspinning. Includes fiber guide with TPI ranges. Free — no signup needed.",
  keywords: [
    "spinning wheel ratio", "spinning wheel drive ratio", "twist per inch calculator",
    "spinning wheel ratio chart", "TPI calculator", "what ratio for sock yarn spinning",
    "spinning wheel whorl size calculator", "how to calculate drive ratio spinning wheel",
    "plying twist calculator", "wraps per inch spinning",
    "handspinning calculator", "spinning fiber guide",
  ],
  alternates: { canonical: "/spinning-ratio-calculator" },
};

export default function SpinningCalculatorPage() {
  return (
    <ToolLayout slug="spinning-ratio-calculator">
      <SpinningCalculatorTool />
    </ToolLayout>
  );
}
