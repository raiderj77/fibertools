import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import YarnWeightChartTool from "./YarnWeightChartTool";

export const metadata: Metadata = {
  title: "Free Yarn Weight Chart & Substitution Guide — DK vs Worsted vs Aran | FiberTools",
  description:
    "Interactive yarn weight chart with US, UK, and Australian ply names. Check yarn substitution compatibility and browse a fiber properties guide for wool, cotton, acrylic, and more.",
  keywords: [
    "yarn weight chart",
    "yarn weight conversion",
    "yarn substitution",
    "DK vs worsted",
    "yarn weight categories",
    "ply conversion chart",
    "what is worsted weight yarn",
    "DK yarn equivalent",
    "Australian ply to US weight",
    "substitute yarn in pattern",
    "fingering vs sock yarn",
    "can I use DK instead of worsted",
    "yarn fiber guide",
    "wool vs cotton yarn",
    "yarn weight comparison",
  ],
};

export default function YarnWeightChartPage() {
  return (
    <ToolLayout slug="yarn-weight-chart">
      <YarnWeightChartTool />
    </ToolLayout>
  );
}
