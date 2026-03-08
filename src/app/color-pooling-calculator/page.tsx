import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import ColorPoolingCalculatorTool from "./ColorPoolingCalculatorTool";

export const metadata: Metadata = {
  title: "Planned Pooling Crochet Calculator — Free",
  description:
    "Calculate exact stitch counts for planned pooling with variegated yarn. Live argyle and plaid preview before you start. Free, no login.",
  keywords: [
    "color pooling calculator", "planned pooling crochet", "variegated yarn pooling",
    "color pooling stitch count", "how to plan color pooling crochet",
    "color pooling calculator moss stitch", "variegated yarn color repeat length",
    "planned pooling argyle", "color pooling foundation chain",
    "planned pooling calculator", "yarn pooling pattern generator",
  ],
  alternates: { canonical: "/color-pooling-calculator" },
};

export default function ColorPoolingCalculatorPage() {
  return (
    <ToolLayout slug="color-pooling-calculator">
      <ColorPoolingCalculatorTool />
    </ToolLayout>
  );
}
