import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import CastOnCalculatorTool from "./CastOnCalculatorTool";

export const metadata: Metadata = {
  title: "Cast On Calculator",
  description:
    "Calculate how many stitches to cast on for any width with stitch pattern multiple rounding and edge stitch notes.",
  keywords: [
    "cast on calculator",
    "how many stitches to cast on",
    "knitting cast on count",
    "foundation chain calculator",
    "stitch count calculator",
    "cast on for width",
  ],
  alternates: { canonical: "/cast-on-calculator" },
};

export default function CastOnCalculatorPage() {
  return (
    <ToolLayout slug="cast-on-calculator">
      <CastOnCalculatorTool />
    </ToolLayout>
  );
}
