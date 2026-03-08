import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import YarnWeightChartTool from "./YarnWeightChartTool";

export const metadata: Metadata = {
  title: "Yarn Weight Chart & Substitution — Free",
  description:
    "Interactive yarn weight chart with US, UK, and Australian names. Check substitution compatibility and fiber properties. Free, instant — no signup.",
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
    title: "Yarn Weight Chart & Substitution — Free",
    description:
      "Interactive yarn weight chart with US, UK, and Australian names. Check substitution compatibility and fiber properties. Free, instant — no signup.",
    url: "https://fibertools.app/yarn-weight-chart",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Yarn Weight Chart & Substitution — Free" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yarn Weight Chart & Substitution — Free",
    description:
      "Interactive yarn weight chart with US, UK, and Australian names. Check substitution compatibility and fiber properties. Free, instant — no signup.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/yarn-weight-chart" },
};

export default function YarnWeightChartPage() {
  return (
    <ToolLayout slug="yarn-weight-chart">
      <YarnWeightChartTool />
    </ToolLayout>
  );
}
