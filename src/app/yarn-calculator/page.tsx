import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Free Yarn Yardage Calculator Online | FiberTools",
  description: "Calculate exactly how much yarn you need for any project.",
};

export default function YarnCalculatorPage() {
  return (
    <ToolLayout slug="yarn-calculator">
      <ComingSoon slug="yarn-calculator" />
    </ToolLayout>
  );
}
