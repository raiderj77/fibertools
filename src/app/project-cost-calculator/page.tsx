import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import ProjectCostCalculatorTool from "./ProjectCostCalculatorTool";

export const metadata: Metadata = {
  title: "Yarn & Project Cost Calculator — Free",
  description:
    "Calculate the total cost of any knitting or crochet project — yarn, notions, and time. See your hourly rate for selling. Free, no signup needed.",
  keywords: [
    "crochet cost calculator", "knitting cost calculator", "how much does a blanket cost to make",
    "yarn project cost estimator", "cost to crochet a blanket", "is it cheaper to knit or buy",
    "how much does it cost to knit a sweater", "yarn budget planner",
    "handmade pricing calculator", "craft project cost",
  ],
  openGraph: {
    title: "Yarn & Project Cost Calculator — Free",
    description:
      "Calculate the total cost of any knitting or crochet project — yarn, notions, and time. See your hourly rate for selling. Free, no signup needed.",
    url: "https://fibertools.app/project-cost-calculator",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Yarn & Project Cost Calculator — Free" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yarn & Project Cost Calculator — Free",
    description:
      "Calculate the total cost of any knitting or crochet project — yarn, notions, and time. See your hourly rate for selling. Free, no signup needed.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/project-cost-calculator" },
};

export default function ProjectCostCalculatorPage() {
  return (
    <ToolLayout slug="project-cost-calculator">
      <AnswerBlock
        what="A calculator that totals yarn, notions, and time costs for any knitting or crochet project, plus shows your effective hourly rate if selling."
        who="Fiber artists who want to know the true cost of a project before buying supplies or setting a sale price for finished items."
        bottomLine="Enter your yarn quantities, prices, and estimated hours to see total project cost and a realistic pricing guide."
        lastUpdated="2026-03-16"
      />
      <div className="sr-only">
        <h2>Project Cost Calculator Tool</h2>
        <h2>How to Estimate Project Costs</h2>
        <h2>Project Cost Breakdown and Time Estimates</h2>
      </div>
      <ProjectCostCalculatorTool />
    </ToolLayout>
  );
}
