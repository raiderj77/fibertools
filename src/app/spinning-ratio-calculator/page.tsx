import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import SpinningCalculatorTool from "./SpinningCalculatorTool";

export const metadata: Metadata = {
  title: "Spinning Wheel Ratio Calculator — Free",
  description:
    "Calculate drive ratios, twists per inch, and plying twist for handspinning. Includes fiber guide with TPI ranges. Free — no signup needed.",
  keywords: [
    "spinning wheel ratio", "spinning wheel drive ratio", "twist per inch calculator",
    "spinning wheel ratio chart", "TPI calculator", "what ratio for sock yarn spinning",
    "spinning wheel whorl size calculator", "how to calculate drive ratio spinning wheel",
    "plying twist calculator", "wraps per inch spinning",
    "handspinning calculator", "spinning fiber guide",
  ],
  openGraph: {
    title: "Spinning Wheel Ratio Calculator — Free",
    description:
      "Calculate drive ratios, twists per inch, and plying twist for handspinning. Includes fiber guide with TPI ranges. Free — no signup needed.",
    url: "https://fibertools.app/spinning-ratio-calculator",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Spinning Wheel Ratio Calculator — Free" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Spinning Wheel Ratio Calculator — Free",
    description:
      "Calculate drive ratios, twists per inch, and plying twist for handspinning. Includes fiber guide with TPI ranges. Free — no signup needed.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/spinning-ratio-calculator" },
};

export default function SpinningCalculatorPage() {
  return (
    <ToolLayout slug="spinning-ratio-calculator">
      <AnswerBlock
        what="A calculator for handspinners that computes drive ratios, twists per inch, and plying twist with a fiber guide showing recommended TPI ranges."
        who="Handspinners who need to dial in their spinning wheel settings for a specific yarn weight or fiber type."
        bottomLine="Enter your whorl and drive wheel measurements to calculate your ratio, then match it to the TPI your target yarn needs."
        lastUpdated="2026-03-16"
      />
      <div className="sr-only">
        <h2>Spinning Wheel Ratio Calculator</h2>
        <h2>How to Calculate Drive Ratios</h2>
        <h2>Spinning Ratio Results and Plying Guide</h2>
      </div>
      <SpinningCalculatorTool />
    </ToolLayout>
  );
}
