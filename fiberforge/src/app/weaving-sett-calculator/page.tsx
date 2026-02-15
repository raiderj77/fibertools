import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import WeavingSettCalculatorTool from "./WeavingSettCalculatorTool";

export const metadata: Metadata = {
  title: "Free Weaving Sett Calculator — EPI, Warp Length & Reed Substitution | FiberTools",
  description:
    "Calculate the right sett (EPI) for your yarn and weave structure, plan warp length with loom waste and shrinkage, and figure out reed threading patterns.",
  keywords: [
    "weaving sett calculator", "warp sett chart", "ends per inch calculator",
    "reed substitution chart", "weaving yarn calculator", "how many ends per inch for weaving",
    "warp calculator weaving", "how to calculate warp length", "rigid heddle sett guide",
    "weaving EPI calculator", "warp length calculator",
  ],
};

export default function WeavingSettCalculatorPage() {
  return (
    <ToolLayout slug="weaving-sett-calculator">
      <WeavingSettCalculatorTool />
    </ToolLayout>
  );
}
