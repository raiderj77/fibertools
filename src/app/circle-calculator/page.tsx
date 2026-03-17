import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import CircleCalculatorTool from "./CircleCalculatorTool";

export const metadata: Metadata = {
  title: "Crochet Circle Pattern Generator — Free",
  description:
    "Generate a flat circle crochet pattern for any stitch type. Round-by-round increase instructions with staggered placement. Free, no signup.",
  keywords: [
    "crochet circle pattern",
    "perfect circle crochet",
    "crochet circle calculator",
    "flat circle crochet",
    "crochet circle increase pattern",
    "how to crochet a flat circle",
    "crochet circle formula",
    "magic ring circle pattern",
    "crochet round pattern generator",
    "crochet circle increases per round",
    "single crochet circle pattern",
    "double crochet circle pattern",
    "crochet hat crown calculator",
    "crochet circle instructions",
    "flat circle increase calculator",
  ],
  openGraph: {
    title: "Crochet Circle Pattern Generator — Free",
    description:
      "Generate a flat circle crochet pattern for any stitch type. Round-by-round increase instructions with staggered placement. Free, no signup.",
    url: "https://fibertools.app/circle-calculator",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Crochet Circle Pattern Generator — Free" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crochet Circle Pattern Generator — Free",
    description:
      "Generate a flat circle crochet pattern for any stitch type. Round-by-round increase instructions with staggered placement. Free, no signup.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/circle-calculator" },
};

export default function CircleCalculatorPage() {
  return (
    <ToolLayout slug="circle-calculator">
      <div className="sr-only">
        <h2>Perfect Circle Calculator Tool</h2>
        <h2>How to Crochet a Flat Circle</h2>
        <h2>Circle Pattern Results and Increase Schedule</h2>
      </div>
      <CircleCalculatorTool />
    </ToolLayout>
  );
}
