import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import WeavingSettCalculatorTool from "./WeavingSettCalculatorTool";

export const metadata: Metadata = {
  title: "Weaving Sett & EPI Calculator — Free",
  description:
    "Calculate the right sett (EPI) for your yarn and weave structure. Includes warp length, loom waste, and reed substitution. Free, no signup.",
  keywords: [
    "weaving sett calculator", "warp sett chart", "ends per inch calculator",
    "reed substitution chart", "weaving yarn calculator", "how many ends per inch for weaving",
    "warp calculator weaving", "how to calculate warp length", "rigid heddle sett guide",
    "weaving EPI calculator", "warp length calculator",
  ],
  openGraph: {
    title: "Weaving Sett & EPI Calculator — Free",
    description:
      "Calculate the right sett (EPI) for your yarn and weave structure. Includes warp length, loom waste, and reed substitution. Free, no signup.",
    url: "https://fibertools.app/weaving-sett-calculator",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Weaving Sett & EPI Calculator — Free" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Weaving Sett & EPI Calculator — Free",
    description:
      "Calculate the right sett (EPI) for your yarn and weave structure. Includes warp length, loom waste, and reed substitution. Free, no signup.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/weaving-sett-calculator" },
};

export default function WeavingSettCalculatorPage() {
  return (
    <ToolLayout slug="weaving-sett-calculator">
      <WeavingSettCalculatorTool />
    </ToolLayout>
  );
}
