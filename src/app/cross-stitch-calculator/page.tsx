import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
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
  openGraph: {
    title: "Cross Stitch Size & Thread Calculator — Free",
    description:
      "Calculate cross stitch dimensions for any Aida count. Estimate DMC thread amounts per color with framing margin. Free, instant results.",
    url: "https://fibertools.app/cross-stitch-calculator",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Cross Stitch Size & Thread Calculator — Free" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cross Stitch Size & Thread Calculator — Free",
    description:
      "Calculate cross stitch dimensions for any Aida count. Estimate DMC thread amounts per color with framing margin. Free, instant results.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/cross-stitch-calculator" },
};

export default function CrossStitchCalculatorPage() {
  return (
    <ToolLayout slug="cross-stitch-calculator">
      <AnswerBlock
        what="A calculator that determines finished dimensions and DMC thread amounts for cross stitch projects on any Aida count fabric with framing margins."
        who="Cross stitchers who need to know how much fabric and floss to buy before starting a pattern."
        bottomLine="Enter your pattern stitch count and fabric count to get exact dimensions and thread estimates."
        lastUpdated="2026-03-16"
      />
      <div className="sr-only">
        <h2>Cross Stitch Size and Thread Calculator</h2>
        <h2>How to Calculate Cross Stitch Dimensions</h2>
        <h2>Cross Stitch Size Results and Thread Estimates</h2>
      </div>
      <CrossStitchCalculatorTool />
    </ToolLayout>
  );
}
