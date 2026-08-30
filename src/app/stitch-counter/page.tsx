import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import StitchCounterTool from "./StitchCounterTool";

export const metadata: Metadata = {
  title: "Free Stitch & Row Counter for Knitting Online",
  description:
    "Track up to six named stitch, row, or repeat counts with undo/redo and exact-count reminders. Browser-local saving is attempted; no login required.",
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
      "Track up to six named stitch, row, or repeat counts with undo/redo and exact-count reminders. Browser-local saving is attempted; no login required.",
    url: "https://fibertools.app/stitch-counter",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Free Stitch & Row Counter for Knitting Online" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Stitch & Row Counter for Knitting Online",
    description:
      "Track up to six named stitch, row, or repeat counts with undo/redo and exact-count reminders. Browser-local saving is attempted; no login required.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/stitch-counter" },
};

export default function StitchCounterPage() {
  return (
    <ToolLayout slug="stitch-counter">
      <AnswerBlock
        what="A manual stitch and row tracker with up to six named counters, undo/redo, and exact-count reminders on the first counter."
        who="Knitters and crocheters who need a digital tally counter to track stitches, rows, and pattern repeats while working."
        bottomLine="Each total reflects the taps you record. This browser attempts a local save, but storage can be unavailable or cleared, so keep a separate checkpoint when the count matters."
        lastUpdated="2026-08-29"
      />
      <div className="sr-only">
        <h2>Stitch and Row Counter Tool</h2>
        <h2>How to Use the Stitch Counter</h2>
        <h2>Stitch Counter Features and Browser-Local Saving</h2>
      </div>
      <StitchCounterTool />

      {/* Content sections */}

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          Why is keeping track of rows and repeats important for accuracy?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            A recorded row or repeat count can make it easier to resume after an interruption and compare your progress with the written pattern. It cannot verify the fabric or prevent mistakes by itself.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Shaping, lace, and color sequences can depend on specific rows. A counter is one checkpoint: compare it with the pattern and the actual work, especially after correcting or undoing a row.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          The displayed total is only as accurate as the taps entered. Exact-count reminder notes are checked against the first counter; they do not interpret the pattern or repeat automatically at later intervals.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          What is the best way to track stitch counts for a blanket project?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Choose a checkpoint method that matches the pattern: a row counter, physical markers, and written notes can complement one another. Recount at intervals appropriate to the project rather than relying on one universal schedule.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          You can keep the first counter as the total row count and attach reminder notes to selected exact counts. Additional counters can track other totals, but reminders do not attach independently to them or generate a repeating schedule.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          The per-counter reset is recorded as one undoable count change. The Settings action labeled “Reset all counters to 0” clears the undo and redo history, so record important totals elsewhere first. Browser-local saving is fallible, and a separate project note remains the safer recovery checkpoint.
        </p>
      </section>
    </ToolLayout>
  );
}
