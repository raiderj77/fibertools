import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import NeedleConverterTool from "./NeedleConverterTool";

export const metadata: Metadata = {
  title: "Free Needle & Hook Size Converter",
  description:
    "Convert knitting needle and crochet hook sizes between US, UK, metric, and Japanese — instantly. Covers all 23 needle sizes and 24 hook sizes. Free.",
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
};

export default function NeedleConverterPage() {
  return (
    <ToolLayout slug="needle-converter">
      <NeedleConverterTool />
    </ToolLayout>
  );
}
