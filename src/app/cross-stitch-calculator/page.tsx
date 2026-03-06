import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import CrossStitchCalculatorTool from "./CrossStitchCalculatorTool";

export const metadata: Metadata = {
  title: "Cross Stitch Size & Thread Calculator — Free",
  description:
    "Calculate cross stitch dimensions for any Aida count. Estimate DMC thread amounts per color with framing margin. Free, instant results.",
  keywords: [
    "cross stitch size calculator", "cross stitch fabric calculator", "aida cloth calculator",
    "how much fabric for cross stitch", "DMC thread calculator", "cross stitch dimensions by count",
    "aida 14 count how big", "cross stitch thread amount calculator", "how much floss do I need",
    "cross stitch finished size", "cross stitch fabric estimator",
  ],
  alternates: { canonical: "/cross-stitch-calculator" },
};

export default function CrossStitchCalculatorPage() {
  return (
    <ToolLayout slug="cross-stitch-calculator">
      <CrossStitchCalculatorTool />
    </ToolLayout>
  );
}
