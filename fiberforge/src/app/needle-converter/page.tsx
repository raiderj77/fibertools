import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import NeedleConverterTool from "./NeedleConverterTool";

export const metadata: Metadata = {
  title: "Free Needle & Hook Size Converter Online — US, UK, Metric & Japanese | FiberTools",
  description:
    "Instantly convert knitting needle and crochet hook sizes between US, UK, metric (mm), and Japanese systems. Interactive chart with search, yarn weight recommendations, and visual size comparison.",
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
