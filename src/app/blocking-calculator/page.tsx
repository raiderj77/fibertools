import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
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
      <AnswerBlock
        what="A tool that recommends the correct blocking method for your fiber type with stretch feasibility ratings and step-by-step instructions."
        who="Fiber artists who need to know whether to wet block, steam block, or spray block their finished project based on fiber content."
        bottomLine="Enter your fiber type to get the recommended blocking method — always test on a swatch first if you are unsure."
        lastUpdated="2026-03-16"
      />
      <div className="sr-only">
        <h2>Blocking Calculator Tool</h2>
        <h2>How to Choose a Blocking Method</h2>
        <h2>Blocking Method Results and Step-by-Step Guide</h2>
      </div>
      <BlockingCalculatorTool />
    </ToolLayout>
  );
}
