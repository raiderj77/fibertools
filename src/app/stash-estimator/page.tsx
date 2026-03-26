import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import StashEstimatorTool from "./StashEstimatorTool";

export const metadata: Metadata = {
  title: "Yarn Stash Estimator",
  description:
    "Estimate remaining yardage in partial skeins by weight, plus a yardage reference table for unlabeled yarn by weight category.",
  keywords: [
    "yarn stash calculator",
    "partial skein yardage",
    "how much yarn is left",
    "yarn weight yardage chart",
    "remaining yarn calculator",
  ],
  alternates: { canonical: "/stash-estimator" },
};

export default function StashEstimatorPage() {
  return (
    <ToolLayout slug="stash-estimator">
      <AnswerBlock
        what="A tool that estimates remaining yardage in partial skeins by weight, with a reference table for unlabeled yarn by weight category."
        who="Yarn crafters with partial skeins who need to know if they have enough yarn left for a project."
        bottomLine="Weigh your partial skein and enter the original skein specs to find out how many yards remain."
        lastUpdated="2026-03-16"
      />
      <div className="sr-only">
        <h2>Yarn Stash Estimator Tool</h2>
        <h2>How to Estimate Remaining Yardage</h2>
        <h2>Stash Estimation Results and Yardage Reference</h2>
      </div>
      <StashEstimatorTool />
    </ToolLayout>
  );
}
