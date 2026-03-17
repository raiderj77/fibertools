import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import GrannySquarePlannerTool from "./GrannySquarePlannerTool";

export const metadata: Metadata = {
  title: "Granny Square Blanket Planner",
  description:
    "Plan your granny square blanket with grid layout, total squares, per-color yardage, and joining yarn estimates.",
  keywords: [
    "granny square calculator",
    "granny square blanket planner",
    "how many granny squares for blanket",
    "granny square yardage",
    "crochet blanket planner",
  ],
  alternates: { canonical: "/granny-square-planner" },
};

export default function GrannySquarePlannerPage() {
  return (
    <ToolLayout slug="granny-square-planner">
      <div className="sr-only">
        <h2>Granny Square Planner Tool</h2>
        <h2>How to Plan a Granny Square Blanket</h2>
        <h2>Granny Square Layout and Yardage Estimates</h2>
      </div>
      <GrannySquarePlannerTool />
    </ToolLayout>
  );
}
