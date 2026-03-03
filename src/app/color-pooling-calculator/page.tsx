import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import ColorPoolingCalculatorTool from "./ColorPoolingCalculatorTool";

export const metadata: Metadata = {
  title: "Planned Color Pooling Calculator",
  description:
    "Calculate the exact stitch count for variegated yarn color pooling. Live preview of argyle and plaid patterns before you start. Free, no login needed.",
  keywords: [
    "color pooling calculator", "planned pooling crochet", "variegated yarn pooling",
    "color pooling stitch count", "how to plan color pooling crochet",
    "color pooling calculator moss stitch", "variegated yarn color repeat length",
    "planned pooling argyle", "color pooling foundation chain",
    "planned pooling calculator", "yarn pooling pattern generator",
  ],
};

export default function ColorPoolingCalculatorPage() {
  return (
    <ToolLayout slug="color-pooling-calculator">
      <ColorPoolingCalculatorTool />
    </ToolLayout>
  );
}
