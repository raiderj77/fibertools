import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import SpinningCalculatorTool from "./SpinningCalculatorTool";

export const metadata: Metadata = {
  title: "Free Spinning Wheel Ratio Calculator — TPI, Plying & Fiber Guide | FiberTools",
  description:
    "Calculate drive ratios, twists per inch (TPI), and plying twist for handspinning. Includes a fiber guide with suggested twist rates for merino, alpaca, silk, cotton, and more.",
  keywords: [
    "spinning wheel ratio", "spinning wheel drive ratio", "twist per inch calculator",
    "spinning wheel ratio chart", "TPI calculator", "what ratio for sock yarn spinning",
    "spinning wheel whorl size calculator", "how to calculate drive ratio spinning wheel",
    "plying twist calculator", "wraps per inch spinning",
    "handspinning calculator", "spinning fiber guide",
  ],
};

export default function SpinningCalculatorPage() {
  return (
    <ToolLayout slug="spinning-ratio-calculator">
      <SpinningCalculatorTool />
    </ToolLayout>
  );
}
