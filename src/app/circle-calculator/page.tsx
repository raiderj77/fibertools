import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import CircleCalculatorTool from "./CircleCalculatorTool";

export const metadata: Metadata = {
  title: "Perfect Circle Calculator — Crochet Circle Pattern Generator | FiberTools",
  description:
    "Generate a flat circle crochet pattern for any stitch type. Enter your stitch and number of rounds to get the full increase pattern with staggered increases.",
  keywords: [
    "crochet circle pattern",
    "perfect circle crochet",
    "crochet circle calculator",
    "flat circle crochet",
    "crochet circle increase pattern",
    "how to crochet a flat circle",
    "crochet circle formula",
    "magic ring circle pattern",
    "crochet round pattern generator",
    "crochet circle increases per round",
    "single crochet circle pattern",
    "double crochet circle pattern",
    "crochet hat crown calculator",
    "crochet circle instructions",
    "flat circle increase calculator",
  ],
};

export default function CircleCalculatorPage() {
  return (
    <ToolLayout slug="circle-calculator">
      <CircleCalculatorTool />
    </ToolLayout>
  );
}
