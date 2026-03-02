import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import NeedleGuideTool from "./NeedleGuideTool";

export const metadata: Metadata = {
  title: "Sewing Needle Types & Sizes Guide",
  description:
    "Visual guide to sewing needle types: tapestry, chenille, embroidery, sharps, beading, and more. Find the right needle for your project.",
  keywords: [
    "sewing needle types",
    "tapestry needle vs chenille needle",
    "yarn needle",
    "embroidery needle",
    "needle types for crochet",
    "needle types for sewing",
    "darning needle",
    "beading needle",
    "quilting needle",
    "needle size chart",
    "which needle for weaving in ends",
    "craft needle guide",
    "sewing needle comparison",
    "chenille needle uses",
    "tapestry needle uses",
  ],
};

export default function NeedleGuidePage() {
  return (
    <ToolLayout slug="needle-guide">
      <NeedleGuideTool />
    </ToolLayout>
  );
}
