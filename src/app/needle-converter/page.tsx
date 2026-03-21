import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import NeedleConverterTool from "./NeedleConverterTool";

export const metadata: Metadata = {
  title: "Knitting Needle & Hook Size Converter — Free",
  description:
    "Convert knitting needle and crochet hook sizes between US, metric, UK, and Japanese systems. All 23 needle sizes and 24 hook sizes. Free.",
  keywords: [
    "knitting needle size chart",
    "knitting needle conversion chart",
    "crochet hook size chart",
    "crochet hook conversion",
    "needle size converter",
    "mm to us knitting needle",
    "us 8 knitting needle in mm",
    "uk to us needle conversion",
    "japanese knitting needle sizes",
    "crochet hook letter to mm",
    "what size hook for worsted weight",
    "knitting needle sizes",
    "crochet hook sizes",
    "needle size chart printable",
    "hook size chart",
  ],
  openGraph: {
    title: "Knitting Needle & Hook Size Converter — Free",
    description:
      "Convert knitting needle and crochet hook sizes between US, metric, UK, and Japanese systems. All 23 needle sizes and 24 hook sizes. Free.",
    url: "https://fibertools.app/needle-converter",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Knitting Needle & Hook Size Converter — Free" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Knitting Needle & Hook Size Converter — Free",
    description:
      "Convert knitting needle and crochet hook sizes between US, metric, UK, and Japanese systems. All 23 needle sizes and 24 hook sizes. Free.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/needle-converter" },
};

export default function NeedleConverterPage() {
  return (
    <ToolLayout slug="needle-converter">
      <AnswerBlock
        what="A size converter for knitting needles and crochet hooks that translates between US, metric (mm), UK, and Japanese sizing systems instantly."
        who="Knitters and crocheters working from international patterns, or anyone whose pattern calls for a needle or hook size in an unfamiliar system."
        bottomLine="Select or type any needle or hook size and see the equivalent in every major sizing system — no more guessing whether a 4.0 mm hook is a US G/6."
        lastUpdated="2026-03-16"
      />
      <div className="sr-only">
        <h2>Needle and Hook Size Converter</h2>
        <h2>How to Convert Needle Sizes</h2>
        <h2>Needle Size Conversion Results</h2>
      </div>
      <NeedleConverterTool />
    </ToolLayout>
  );
}
