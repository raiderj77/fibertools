import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Free Cross Stitch Size & Thread Calculator Online | FiberTools",
  description: "Calculate finished dimensions and thread amounts for cross stitch projects.",
};

export default function CrossStitchCalculatorPage() {
  return (
    <ToolLayout slug="cross-stitch-calculator">
      <ComingSoon slug="cross-stitch-calculator" />
    </ToolLayout>
  );
}
