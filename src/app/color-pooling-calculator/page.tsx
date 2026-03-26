import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
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
  openGraph: {
    title: "Planned Pooling Crochet Calculator — Free",
    description:
      "Calculate exact stitch counts for planned pooling with variegated yarn. Live argyle and plaid preview before you start. Free, no login.",
    url: "https://fibertools.app/color-pooling-calculator",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Planned Pooling Crochet Calculator — Free" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Planned Pooling Crochet Calculator — Free",
    description:
      "Calculate exact stitch counts for planned pooling with variegated yarn. Live argyle and plaid preview before you start. Free, no login.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/color-pooling-calculator" },
};

export default function ColorPoolingCalculatorPage() {
  return (
    <ToolLayout slug="color-pooling-calculator">
      <AnswerBlock
        what="A calculator that determines the exact stitch count and foundation chain length for planned pooling with variegated yarn, with a live argyle preview."
        who="Crocheters who want to create intentional argyle or plaid patterns from variegated yarn by controlling stitch placement."
        bottomLine="Enter your yarn's color repeat length and stitch gauge to see exactly how many stitches you need for a clean pooling pattern."
        lastUpdated="2026-03-16"
      />
      <div className="sr-only">
        <h2>Color Pooling Calculator Tool</h2>
        <h2>How to Calculate Color Pooling</h2>
        <h2>Color Pooling Results and Pattern Preview</h2>
      </div>
      <ColorPoolingCalculatorTool />
    </ToolLayout>
  );
}
