import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Free Project Cost Calculator Online | FiberTools",
  description: "Calculate the total cost of your fiber arts project.",
};

export default function ProjectCostCalculatorPage() {
  return (
    <ToolLayout slug="project-cost-calculator">
      <ComingSoon slug="project-cost-calculator" />
    </ToolLayout>
  );
}
