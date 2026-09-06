import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import WpiCalculatorTool from "./WpiCalculatorTool";

export const metadata: Metadata = {
  title: "WPI to Yarn Weight Converter",
  description:
    "Enter wraps per inch to estimate possible yarn weight categories, recommended needles, hooks, gauge range, and project ideas. Free WPI tool.",
  keywords: [
    "wraps per inch calculator",
    "WPI yarn weight",
    "identify yarn weight",
    "WPI chart",
    "yarn weight from WPI",
    "wraps per inch chart",
  ],
  alternates: { canonical: "/wpi-calculator" },
  openGraph: {
    title: "WPI to Yarn Weight Converter",
    description:
      "Enter wraps per inch to estimate possible yarn weight categories, recommended needles, hooks, gauge range, and project ideas.",
    url: "https://fibertools.app/wpi-calculator",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "WPI to Yarn Weight Converter" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "WPI to Yarn Weight Converter",
    description:
      "Enter wraps per inch to estimate possible yarn weight categories, recommended needles, hooks, gauge range, and project ideas.",
    images: ["/og-image.png"],
  },
};

export default function WpiCalculatorPage() {
  return (
    <ToolLayout slug="wpi-calculator">
      <AnswerBlock
        what="A reference that estimates possible yarn weight categories from your wraps-per-inch measurement, with recommended needles, hooks, gauge range, and project ideas."
        who="Fiber artists with unlabeled yarn who need to determine the weight category before starting a project."
        bottomLine="Wrap your yarn around a ruler, count the wraps per inch, and enter the number to compare possible categories. Always check a swatch."
        lastUpdated="2026-03-16"
      />
      <div className="sr-only">
        <h2>WPI to Yarn Weight Converter</h2>
        <h2>How to Measure Wraps Per Inch</h2>
        <h2>Yarn Weight Identification Results and Recommendations</h2>
      </div>
      <WpiCalculatorTool />

      <section className="mt-12 space-y-4">
        <h2 className="text-xl font-semibold">How to interpret WPI</h2>
        <p>WPI is subjective: wrap without stretching or leaving large gaps, measure several places, and compare the result with a swatch. CYC ranges overlap: Super Fine is 14–30, Fine is 12–18, Light is 11–15, Medium is 9–12, and Bulky is 6–9 WPI. An overlap returns every matching category; a gap returns none.</p>
        <p>Needle and hook ranges are starting points. The listed gauge is knitting stockinette stitches per 4 inches, not crochet gauge. Use the actual pattern gauge and fabric you want to decide whether a yarn works.</p>
        <h2 className="text-xl font-semibold">Can WPI tell me how much yarn I have?</h2>
        <p>No. WPI does not establish yards per gram, fiber content, or care instructions. Use a yarn label or measure a known length and its mass. Confirm suitability with the actual yarn and pattern before starting.</p>
      </section>
    </ToolLayout>
  );
}
