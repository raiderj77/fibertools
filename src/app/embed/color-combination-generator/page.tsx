import type { Metadata } from "next";
import ColorCombinationTool from "@/app/color-combination-generator/ColorCombinationTool";
import EmbedCalculatorShell from "@/components/EmbedCalculatorShell";

export const metadata: Metadata = {
  title: "Color Combination Generator Embed",
  description: "A free branded FiberTools color combination generator embed for yarn and fabric projects.",
  alternates: { canonical: "/color-combination-generator" },
  robots: { index: false, follow: false },
};

export default function ColorCombinationEmbedPage() {
  return (
    <EmbedCalculatorShell
      name="Color Combination Generator"
      description="Build a yarn or fabric palette from one main color or a photo: named roles, usage shares, a grayscale value check with blend warnings, and a simple stripe cycle."
      fullCalculatorPath="/color-combination-generator"
    >
      <ColorCombinationTool embedded />
    </EmbedCalculatorShell>
  );
}
