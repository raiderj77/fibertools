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
      description="Scale measured yarn use from a representative swatch to a flat rectangular knit or crochet project, then convert the estimate to whole skeins from the yarn label."
      fullCalculatorPath="/yarn-calculator"
    >
      <YarnCalculatorTool embedded />
    </EmbedCalculatorShell>
  );
}
