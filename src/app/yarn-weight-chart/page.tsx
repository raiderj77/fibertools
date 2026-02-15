import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Free Yarn Weight & Substitution Guide Online | FiberTools",
  description: "Interactive yarn weight chart with substitution compatibility checker.",
};

export default function YarnWeightChartPage() {
  return (
    <ToolLayout slug="yarn-weight-chart">
      <ComingSoon slug="yarn-weight-chart" />
    </ToolLayout>
  );
}
