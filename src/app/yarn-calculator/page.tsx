import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import YarnCalculatorTool from "./YarnCalculatorTool";

export const metadata: Metadata = {
  lastModified: new Date('2026-03-16'),
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'How much yarn do I need for my project?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Use this calculator to enter your gauge, dimensions, and yarn weight to get an instant yardage estimate.',
                },
              },
              {
                '@type': 'Question',
                name: 'What is a gauge swatch?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'A gauge swatch is a small knitted or crocheted sample made with your yarn and needles to measure stitches and rows per inch.',
                },
              },
            ],
            dateModified: '2026-03-16',
          }),
        }}
      />
    <ToolLayout slug="yarn-calculator">
      <AnswerBlock
        what="A yardage estimator that calculates how much yarn you need for any knitting or crochet project based on your gauge, dimensions, and yarn weight (CYC Lace 0 through Jumbo 7)."
        who="Any knitter or crocheter planning a project — especially if you're buying yarn and need to know how many skeins to get before you start."
        bottomLine="Enter your gauge swatch numbers and project size to get an instant yardage estimate, so you buy the right amount of yarn the first time."
        lastUpdated="2026-03-16"
      />
      <div className="sr-only">
        <h2>Yarn Yardage Calculator</h2>
        <h2>How to Calculate Yarn Yardage</h2>
        <h2>Yarn Estimation Results and Tips</h2>
      </div>
      <YarnCalculatorTool />
    </ToolLayout>
  );
}
