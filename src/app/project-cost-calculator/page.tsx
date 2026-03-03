import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import ProjectCostCalculatorTool from "./ProjectCostCalculatorTool";

export const metadata: Metadata = {
  title: "Free Yarn & Project Cost Calculator",
  description:
    "Calculate the total cost of any knitting or crochet project — yarn, notions, and time. See your effective hourly rate if selling handmade items.",
  keywords: [
    "crochet cost calculator", "knitting cost calculator", "how much does a blanket cost to make",
    "yarn project cost estimator", "cost to crochet a blanket", "is it cheaper to knit or buy",
    "how much does it cost to knit a sweater", "yarn budget planner",
    "handmade pricing calculator", "craft project cost",
  ],
};

export default function ProjectCostCalculatorPage() {
  return (
    <ToolLayout slug="project-cost-calculator">
      <ProjectCostCalculatorTool />
    </ToolLayout>
  );
}
