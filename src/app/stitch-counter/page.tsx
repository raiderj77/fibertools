import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import StitchCounterTool from "./StitchCounterTool";

export const metadata: Metadata = {
  title: "Free Stitch & Row Counter for Knitting Online",
  description:
    "Free online row counter for knitting and crochet. Track stitches, rows, and repeats with undo/redo. Works offline, no login required.",
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
      "Free online row counter for knitting and crochet. Track stitches, rows, and repeats with undo/redo. Works offline, no login required.",
    url: "https://fibertools.app/stitch-counter",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Free Stitch & Row Counter for Knitting Online" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Stitch & Row Counter for Knitting Online",
    description:
      "Free online row counter for knitting and crochet. Track stitches, rows, and repeats with undo/redo. Works offline, no login required.",
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
        bottomLine="Tap to count stitches and rows, your progress saves automatically and works without an internet connection."
        lastUpdated="2026-03-16"
      />
      <div className="sr-only">
        <h2>Stitch and Row Counter Tool</h2>
        <h2>How to Use the Stitch Counter</h2>
        <h2>Stitch Counter Features and Offline Support</h2>
      </div>
      <StitchCounterTool />

      {/* Content sections */}

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          Why is keeping track of rows and repeats important for accuracy?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Missing a single row or losing count mid-repeat can throw off your entire pattern, especially for stitch patterns with specific heights and shaping sequences. Keeping careful track prevents frogging back and wasting time and yarn.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Stockinette stitch might look forgiving, but once you start increasing or decreasing for sleeves or necklines, you need to know exactly which row you are on. If you lose your place in an increase sequence and jump ahead, your shaping will be lopsided. Lace patterns are even less forgiving since the yarn overs and decreases need to stack in the right columns.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          A digital tally counter keeps you honest and lets you mark row reminders at key points. Rather than counting backward through live stitches and getting confused, you just glance at your tracker and know exactly where you are in the sequence.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          What is the best way to track stitch counts for a blanket project?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            For blankets, especially larger projects, use a separate counter for cast-on stitches and mark your row progress frequently with reminders or markers every 10 to 20 rows so you can spot mistakes before they spread too far.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Blanket patterns often have a main stitch repeat and then a border pattern that frames the whole thing. Keep one counter going for your rows and set reminders at the row numbers where you need to switch from the body pattern to the border. If your blanket has stripes or color changes at specific intervals, mark those rows too so you never apply the wrong yarn color at the wrong time.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Many blankets are wide enough that you also want to count stitches at least once every few rows to catch a dropped stitch before it ruins many rows of fabric. A good workflow is to set a row reminder, knit to that row, pause and recount your stitches against your cast-on count, then reset your counter and keep going.
        </p>
      </section>
    </ToolLayout>
  );
}
