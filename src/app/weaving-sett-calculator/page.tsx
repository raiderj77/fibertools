import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
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
      <AnswerBlock
        what="A calculator that determines the correct sett (ends per inch) for your yarn and weave structure, with warp length, loom waste, and reed substitution."
        who="Weavers planning a new project who need to calculate how many warp ends to wind and which reed dent to use."
        bottomLine="Enter your yarn WPI and weave structure to get the recommended sett, total warp ends, and warp yardage."
        lastUpdated="2026-03-16"
      />
      <div className="sr-only">
        <h2>Weaving Sett Calculator Tool</h2>
        <h2>How to Calculate Sett and EPI</h2>
        <h2>Weaving Sett Results and Reed Substitution</h2>
      </div>
      <WeavingSettCalculatorTool />
    </ToolLayout>
  );
}
