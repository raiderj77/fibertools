import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import BlanketCalculatorTool from "./BlanketCalculatorTool";

export const metadata: Metadata = {
  title: "Blanket Yarn Calculator — How Much Do I Need?",
  description:
    "Calculate how much yarn you need for any blanket — baby to king size. Get stitch count, row count, and total yardage instantly. Free.",
  keywords: [
    "blanket size chart", "crochet blanket sizes", "blanket size calculator",
    "how big should a blanket be", "baby blanket size crochet", "throw blanket dimensions",
    "king size blanket crochet stitches", "how many chains for a throw blanket",
    "crochet blanket yardage chart", "blanket dimensions chart",
    "blanket yarn calculator", "crochet blanket calculator",
    "knitting blanket size guide", "blanket stitch count",
  ],
  alternates: { canonical: "/blanket-calculator" },
};

export default function BlanketCalculatorPage() {
  return (
    <ToolLayout slug="blanket-calculator">
      <BlanketCalculatorTool />
    </ToolLayout>
  );
}
