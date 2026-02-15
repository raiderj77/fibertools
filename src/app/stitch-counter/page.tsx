import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import StitchCounterTool from "./StitchCounterTool";

export const metadata: Metadata = {
  title: "Free Stitch & Row Counter Online — No Login, Works Offline | FiberTools",
  description:
    "Free digital stitch and row counter for knitting and crochet. Multiple named counters, row reminders, undo/redo, fullscreen mode, and auto-save. No app download or login needed.",
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
};

export default function StitchCounterPage() {
  return (
    <ToolLayout slug="stitch-counter">
      <StitchCounterTool />
    </ToolLayout>
  );
}
