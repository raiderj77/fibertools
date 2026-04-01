import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
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
  openGraph: {
    title: "Free Stitch & Row Counter for Knitting Online",
    description:
      "Free online row counter for knitting and crochet. Track stitches, rows, and repeats with undo/redo. Works offline — no login required.",
    url: "https://fibertools.app/stitch-counter",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Free Stitch & Row Counter for Knitting Online" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Stitch & Row Counter for Knitting Online",
    description:
      "Free online row counter for knitting and crochet. Track stitches, rows, and repeats with undo/redo. Works offline — no login required.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/stitch-counter" },
};

export default function StitchCounterPage() {
  return (
    <ToolLayout slug="stitch-counter">
      <AnswerBlock
        what="A free online stitch and row counter for knitting and crochet with undo/redo, multiple counters, and offline support."
        who="Knitters and crocheters who need a digital tally counter to track stitches, rows, and pattern repeats while working."
        bottomLine="Tap to count stitches and rows — your progress saves automatically and works without an internet connection."
        lastUpdated="2026-03-16"
      />
      <div className="sr-only">
        <h2>Stitch and Row Counter Tool</h2>
        <h2>How to Use the Stitch Counter</h2>
        <h2>Stitch Counter Features and Offline Support</h2>
      </div>
      <StitchCounterTool />
    </ToolLayout>
  );
}
