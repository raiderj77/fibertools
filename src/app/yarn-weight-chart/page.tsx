import type { Metadata } from "next";
import Link from "next/link";
import ToolLayout from "@/components/ToolLayout";
import YarnWeightChartTool from "./YarnWeightChartTool";

export const metadata: Metadata = {
  title: { absolute: "Yarn Weight Chart: Sizes 0–7, Gauge & Substitutions" },
  description:
    "Free yarn weight chart — all 8 CYC categories with gauge, needle and hook sizes, and US/UK/AU ply names. Compare substitutes, then swatch.",
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
    title: "Yarn Weight Chart: Sizes 0–7, Gauge & Substitutions",
    description:
      "All 8 CYC categories with gauge, needle and hook sizes, and US/UK/AU ply names. Compare substitutes, then swatch.",
    url: "https://fibertools.app/yarn-weight-chart",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Yarn Weight Chart & Substitution, Free" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yarn Weight Chart: Sizes 0–7, Gauge & Substitutions",
    description:
      "All 8 CYC categories with gauge, needle and hook sizes, and US/UK/AU ply names. Compare substitutes, then swatch.",
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
        Working with yarn that has lost its label? Use the{" "}
        <Link href="/yarn-weight-calculator">
          Yarn Weight Calculator
        </Link>{" "}
        to estimate possible categories from WPI or knitting stockinette gauge. Ready to
        evaluate a substitute yarn? Make a swatch, then use the{" "}
        <Link href="/gauge-calculator">
          Gauge Calculator
        </Link>{" "}
        to compare its stitch and row gauge with your pattern.
      </p>
    </ToolLayout>
  );
}
