import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import GrannySquarePlannerTool from "./GrannySquarePlannerTool";

export const metadata: Metadata = {
  title: "Granny Square Blanket Planner",
  description:
    "Plan a nominal granny-square grid, total square count, internal seam length, and measured yarn-per-square totals.",
  keywords: [
    "granny square calculator",
    "granny square blanket planner",
    "how many granny squares for blanket",
    "granny square yardage",
    "crochet blanket planner",
  ],
  alternates: { canonical: "/granny-square-planner" },
  openGraph: {
    title: "Granny Square Blanket Planner",
    description:
      "Plan a nominal granny-square grid, total square count, internal seam length, and measured yarn-per-square totals.",
    url: "https://fibertools.app/granny-square-planner",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Granny Square Blanket Planner" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Granny Square Blanket Planner",
    description:
      "Plan a nominal granny-square grid, total square count, internal seam length, and measured yarn-per-square totals.",
    images: ["/og-image.png"],
  },
};

export default function GrannySquarePlannerPage() {
  return (
    <ToolLayout slug="granny-square-planner" widgetFirst>
      <AnswerBlock
        what="A planner that rounds each grid axis up from your target dimensions and blocked test-square size, then reports total squares and unique internal seam length."
        who="Crocheters assembling a rectangular granny-square blanket who want a bounded grid and measured-input yarn plan before starting."
        bottomLine="The grid is a nominal plan, not a finished-size prediction. Yarn totals cover the squares only when you enter measured yarn use from a representative square."
        lastUpdated="2026-08-29"
      />
      <div className="sr-only">
        <h2>Granny Square Planner Tool</h2>
        <h2>How to Plan a Granny Square Blanket</h2>
        <h2>Granny Square Layout and Yardage Estimates</h2>
      </div>
      <GrannySquarePlannerTool />
    </ToolLayout>
  );
}
