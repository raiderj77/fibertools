import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import YarnCalculatorTool from "./YarnCalculatorTool";

export const metadata: Metadata = {
  title: "Yarn Yardage Calculator — Free Online",
  description:
    "Calculate how much yarn you need for any knitting or crochet project. Enter your gauge and dimensions for instant yardage estimates. Free, no signup.",
  keywords: [
    "yarn calculator",
    "how much yarn do I need",
    "yarn yardage calculator",
    "yarn estimator",
    "crochet yarn calculator",
    "knitting yarn calculator",
    "how much yarn for a blanket",
    "yarn needed for sweater",
    "estimate yarn for crochet project",
    "how many skeins do I need",
    "yarn calculator by weight",
    "leftover yarn yardage calculator",
    "yarn yardage estimator",
    "blanket yarn calculator",
    "crochet blanket yarn needed",
  ],
  openGraph: {
    title: "Yarn Yardage Calculator — Free Online",
    description:
      "Calculate how much yarn you need for any knitting or crochet project. Enter your gauge and dimensions for instant yardage estimates. Free, no signup.",
    url: "https://fibertools.app/yarn-calculator",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Yarn Yardage Calculator — Free Online" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yarn Yardage Calculator — Free Online",
    description:
      "Calculate how much yarn you need for any knitting or crochet project. Enter your gauge and dimensions for instant yardage estimates. Free, no signup.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/yarn-calculator" },
};

export default function YarnCalculatorPage() {
  return (
    <ToolLayout slug="yarn-calculator">
      <YarnCalculatorTool />
    </ToolLayout>
  );
}
