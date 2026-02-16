import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import StitchQuickReferenceTool from "./StitchQuickReferenceTool";

export const metadata: Metadata = {
  title: "Free Crochet & Knitting Stitch Quick Reference — Step-by-Step Diagrams | FiberForge",
  description:
    "Quick visual reference for crochet and knitting stitches. See yarn overs, pull-throughs, loop counts, and step-by-step instructions for SC, DC, TR, and more.",
  keywords: [
    "crochet stitch diagram",
    "how to double crochet",
    "crochet stitch reference",
    "single crochet steps",
    "half double crochet tutorial",
    "treble crochet instructions",
    "crochet stitch height chart",
    "yarn over pull through count",
    "basic crochet stitches guide",
    "knit stitch steps",
    "purl stitch diagram",
    "crochet turning chain chart",
    "stitch quick reference card",
    "how many yarn overs double crochet",
    "crochet stitch comparison chart",
    "front post double crochet steps",
    "magic ring instructions",
    "crochet stitches for beginners",
  ],
};

export default function StitchQuickReferencePage() {
  return (
    <ToolLayout slug="stitch-quick-reference">
      <StitchQuickReferenceTool />
    </ToolLayout>
  );
}
