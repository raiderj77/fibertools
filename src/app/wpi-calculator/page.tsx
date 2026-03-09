import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import WpiCalculatorTool from "./WpiCalculatorTool";

export const metadata: Metadata = {
  title: "WPI to Yarn Weight Converter",
  description:
    "Enter wraps per inch to identify yarn weight, recommended needles, hooks, gauge range, and project ideas. Free WPI tool.",
  keywords: [
    "wraps per inch calculator",
    "WPI yarn weight",
    "identify yarn weight",
    "WPI chart",
    "yarn weight from WPI",
    "wraps per inch chart",
  ],
  alternates: { canonical: "/wpi-calculator" },
};

export default function WpiCalculatorPage() {
  return (
    <ToolLayout slug="wpi-calculator">
      <WpiCalculatorTool />
    </ToolLayout>
  );
}
