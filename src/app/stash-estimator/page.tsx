import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
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
      <StashEstimatorTool />
    </ToolLayout>
  );
}
