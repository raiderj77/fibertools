import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
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
  alternates: { canonical: "/needle-converter" },
};

export default function NeedleConverterPage() {
  return (
    <ToolLayout slug="needle-converter">
      <NeedleConverterTool />
    </ToolLayout>
  );
}
