import type { Metadata } from "next";
import YarnCalculatorTool from "@/app/yarn-calculator/YarnCalculatorTool";
import EmbedCalculatorShell from "@/components/EmbedCalculatorShell";

export const metadata: Metadata = {
  title: "Yarn Calculator Embed",
  description: "A free branded FiberTools yarn yardage calculator embed.",
  alternates: { canonical: "/yarn-calculator" },
  robots: { index: false, follow: false },
};

export default function YarnCalculatorEmbedPage() {
  return (
    <EmbedCalculatorShell
      name="Yarn Yardage Calculator"
      description="Estimate yarn length and whole skeins for a knitting or crochet project using dimensions, yarn weight, and optional gauge."
      fullCalculatorPath="/yarn-calculator"
    >
      <YarnCalculatorTool embedded />
    </EmbedCalculatorShell>
  );
}
