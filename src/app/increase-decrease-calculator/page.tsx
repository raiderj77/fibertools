import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import IncDecCalculatorTool from "./IncDecCalculatorTool";

export const metadata: Metadata = {
  title: "Evenly Spaced Increase & Decrease Calculator",
  description:
    "Calculate exactly where to place increases or decreases evenly across any row or round. Step-by-step instructions for knitting and crochet. Free.",
  keywords: [
    "increase evenly calculator", "decrease evenly knitting", "distribute increases",
    "evenly spaced decreases", "knitting increase calculator", "how to increase evenly across a row",
    "distribute decreases crochet", "increase 10 stitches evenly", "knitting math increase",
    "crochet increase calculator", "even decrease calculator", "stitch distribution calculator",
  ],
  openGraph: {
    title: "Evenly Spaced Increase & Decrease Calculator",
    description:
      "Calculate exactly where to place increases or decreases evenly across any row or round. Step-by-step instructions for knitting and crochet. Free.",
    url: "https://fibertools.app/increase-decrease-calculator",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Evenly Spaced Increase & Decrease Calculator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Evenly Spaced Increase & Decrease Calculator",
    description:
      "Calculate exactly where to place increases or decreases evenly across any row or round. Step-by-step instructions for knitting and crochet. Free.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/increase-decrease-calculator" },
};

export default function IncDecCalculatorPage() {
  return (
    <ToolLayout slug="increase-decrease-calculator">
      <AnswerBlock
        what="A calculator that tells you exactly where to place increases or decreases evenly across a row or round with step-by-step instructions."
        who="Knitters and crocheters following a pattern that says 'increase X stitches evenly' without telling you where to place them."
        bottomLine="Enter your current stitch count and how many to add or remove — the tool shows you the exact placement for each one."
        lastUpdated="2026-03-16"
      />
      <div className="sr-only">
        <h2>Increase and Decrease Calculator</h2>
        <h2>How to Distribute Increases Evenly</h2>
        <h2>Increase and Decrease Stitch Instructions</h2>
      </div>
      <IncDecCalculatorTool />
    </ToolLayout>
  );
}
