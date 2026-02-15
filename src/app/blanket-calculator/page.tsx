import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Free Blanket Size Calculator Online | FiberTools",
  description: "Find stitch count, row count, and yarn yardage for any blanket size.",
};

export default function BlanketCalculatorPage() {
  return (
    <ToolLayout slug="blanket-calculator">
      <ComingSoon slug="blanket-calculator" />
    </ToolLayout>
  );
}
