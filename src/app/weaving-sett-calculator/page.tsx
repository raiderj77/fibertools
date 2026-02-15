import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Free Weaving Sett Calculator Online | FiberTools",
  description: "Find the right sett for your yarn and weave structure.",
};

export default function WeavingSettCalculatorPage() {
  return (
    <ToolLayout slug="weaving-sett-calculator">
      <ComingSoon slug="weaving-sett-calculator" />
    </ToolLayout>
  );
}
