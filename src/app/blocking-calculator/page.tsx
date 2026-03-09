import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import BlockingCalculatorTool from "./BlockingCalculatorTool";

export const metadata: Metadata = {
  title: "Blocking Calculator & Fiber Guide",
  description:
    "Get the right blocking method for your fiber type with stretch feasibility ratings and step-by-step instructions.",
  keywords: [
    "blocking calculator",
    "how to block knitting",
    "blocking guide",
    "wet blocking",
    "steam blocking",
    "blocking crochet",
    "fiber blocking method",
  ],
  alternates: { canonical: "/blocking-calculator" },
};

export default function BlockingCalculatorPage() {
  return (
    <ToolLayout slug="blocking-calculator">
      <BlockingCalculatorTool />
    </ToolLayout>
  );
}
