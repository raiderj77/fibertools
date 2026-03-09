import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import SockCalculatorTool from "./SockCalculatorTool";

export const metadata: Metadata = {
  title: "Sock Knitting Calculator",
  description:
    "Calculate sock stitch counts for top-down or toe-up with heel flap, gusset, and short-row heel instructions.",
  keywords: [
    "sock calculator",
    "sock knitting calculator",
    "toe up sock calculator",
    "heel flap calculator",
    "sock stitch count",
    "top down sock calculator",
  ],
  alternates: { canonical: "/sock-calculator" },
};

export default function SockCalculatorPage() {
  return (
    <ToolLayout slug="sock-calculator">
      <SockCalculatorTool />
    </ToolLayout>
  );
}
