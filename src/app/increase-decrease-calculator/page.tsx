import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Free Increase & Decrease Calculator Online | FiberTools",
  description: "Get stitch-by-stitch instructions for distributing increases or decreases evenly.",
};

export default function IncreaseDecreaseCalculatorPage() {
  return (
    <ToolLayout slug="increase-decrease-calculator">
      <ComingSoon slug="increase-decrease-calculator" />
    </ToolLayout>
  );
}
