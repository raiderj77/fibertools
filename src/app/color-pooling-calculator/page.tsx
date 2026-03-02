import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import ColorPoolingCalculatorTool from "./ColorPoolingCalculatorTool";

export const metadata: Metadata = {
  title: "Color Pooling Calculator",
  description:
    "Calculate the exact stitch count for variegated yarn pooling. See a live preview of argyle and plaid patterns before you start crocheting.",
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
