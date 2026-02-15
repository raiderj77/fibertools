import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import ColorPoolingCalculatorTool from "./ColorPoolingCalculatorTool";

export const metadata: Metadata = {
  title: "Free Color Pooling Calculator — Plan Variegated Yarn Pooling | FiberTools",
  description:
    "Calculate the exact stitch count to make variegated yarn pool into argyle and plaid patterns. Live visual preview shows how your colors will align.",
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
