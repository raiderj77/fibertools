import type { Metadata } from "next";
import Link from "next/link";
import ToolLayout from "@/components/ToolLayout";
import YarnWeightChartTool from "./YarnWeightChartTool";

export const metadata: Metadata = {
  title: "Yarn Weight Chart & Substitution, Free",
  description:
    "Compare CYC yarn weight categories, knitting gauge guidelines, and common regional names. Compare yarn labels, then verify substitutions with a swatch. Free.",
  keywords: [
    "yarn weight chart",
    "yarn weight conversion",
    "yarn substitution",
    "DK vs worsted",
    "yarn weight categories",
    "ply conversion chart",
    "what is worsted weight yarn",
    "DK yarn equivalent",
    "Australian ply to US weight",
    "substitute yarn in pattern",
    "fingering vs sock yarn",
    "can I use DK instead of worsted",
    "yarn fiber guide",
    "wool vs cotton yarn",
    "yarn weight comparison",
  ],
  openGraph: {
    title: "Yarn Weight Chart & Substitution, Free",
    description:
      "Compare CYC yarn weight categories, knitting gauge guidelines, and common regional names. Compare yarn labels, then verify substitutions with a swatch. Free.",
    url: "https://fibertools.app/yarn-weight-chart",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Yarn Weight Chart & Substitution, Free" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yarn Weight Chart & Substitution, Free",
    description:
      "Compare CYC yarn weight categories, knitting gauge guidelines, and common regional names. Compare yarn labels, then verify substitutions with a swatch. Free.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/yarn-weight-chart" },
};

export default function YarnWeightChartPage() {
  return (
    <ToolLayout slug="yarn-weight-chart">
      <div className="sr-only">
        <h2>Yarn Weight and Substitution Guide</h2>
        <h2>How to Identify Yarn Weights</h2>
        <h2>Yarn Weight Comparison and Substitution Results</h2>
      </div>
      <YarnWeightChartTool />
      <p style={{ marginTop: "1.5rem", fontSize: "0.95rem" }}>
        Ready to evaluate your substitute yarn? Make a swatch, then use the{" "}
        <Link href="/gauge-calculator">
          Gauge Calculator
        </Link>{" "}
        to compare its stitch and row gauge with your pattern.
      </p>
    </ToolLayout>
  );
}
