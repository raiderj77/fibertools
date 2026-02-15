import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Free Color Pooling Calculator Online | FiberTools",
  description: "Calculate stitch counts to make variegated yarn pool into patterns.",
};

export default function ColorPoolingCalculatorPage() {
  return (
    <ToolLayout slug="color-pooling-calculator">
      <ComingSoon slug="color-pooling-calculator" />
    </ToolLayout>
  );
}
