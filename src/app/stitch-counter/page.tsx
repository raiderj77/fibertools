import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import StitchCounterTool from "./StitchCounterTool";

export const metadata: Metadata = {
  title: "Free Stitch & Row Counter for Knitting Online",
  description:
    "Free online row counter for knitting and crochet. Track stitches, rows, and repeats with undo/redo. Works offline — no login required.",
  keywords: [
    "stitch counter online",
    "row counter online",
    "knitting counter",
    "crochet row counter",
    "digital stitch counter",
    "stitch counter free",
    "online row counter for knitting",
    "free stitch counter no download",
    "row counter for crochet",
    "digital tally counter for knitting",
    "knitting counter web app",
    "stitch counter app free",
    "crochet counter online",
    "row tracker knitting",
    "knitting row counter",
  ],
  alternates: { canonical: "/stitch-counter" },
};

export default function StitchCounterPage() {
  return (
    <ToolLayout slug="stitch-counter">
      <StitchCounterTool />
    </ToolLayout>
  );
}
