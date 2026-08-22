import type { Metadata } from "next";
import BlanketCalculatorTool from "@/app/blanket-calculator/BlanketCalculatorTool";
import EmbedCalculatorShell from "@/components/EmbedCalculatorShell";

export const metadata: Metadata = {
  title: "Blanket Calculator Embed",
  description: "A free branded FiberTools blanket calculator embed.",
  alternates: { canonical: "/blanket-calculator" },
  robots: { index: false, follow: false },
};

export default function BlanketCalculatorEmbedPage() {
  return (
    <EmbedCalculatorShell
      name="Blanket Yarn & Size Calculator"
      description="Estimate blanket dimensions, stitch counts, rows, yarn, and skeins from your project details and measured swatch."
      fullCalculatorPath="/blanket-calculator"
    >
      <BlanketCalculatorTool embedded />
    </EmbedCalculatorShell>
  );
}
