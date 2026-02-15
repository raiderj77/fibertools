import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import CrossStitchCalculatorTool from "./CrossStitchCalculatorTool";

export const metadata: Metadata = {
  title: "Free Cross Stitch Size & Thread Calculator | FiberTools",
  description:
    "Calculate finished dimensions for any fabric count, estimate thread amounts per color, and figure out how much fabric you need with margin for framing.",
  keywords: [
    "cross stitch size calculator", "cross stitch fabric calculator", "aida cloth calculator",
    "how much fabric for cross stitch", "DMC thread calculator", "cross stitch dimensions by count",
    "aida 14 count how big", "cross stitch thread amount calculator", "how much floss do I need",
    "cross stitch finished size", "cross stitch fabric estimator",
  ],
};

export default function CrossStitchCalculatorPage() {
  return (
    <ToolLayout slug="cross-stitch-calculator">
      <CrossStitchCalculatorTool />
    </ToolLayout>
  );
}
