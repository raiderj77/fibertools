import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import HatCalculatorTool from "./HatCalculatorTool";

export const metadata: Metadata = {
  title: "Eight-Section Knitted Hat Crown Calculator",
  description:
    "Build a bounded bottom-up knitted hat reference from your gauge, including a candidate cast-on and an eight-section K2tog crown schedule.",
  keywords: [
    "hat calculator",
    "knit hat size chart",
    "beanie calculator",
    "crown decrease calculator",
    "hat stitch count",
    "knitted hat crown calculator",
  ],
  alternates: { canonical: "/hat-calculator" },
  openGraph: {
    title: "Eight-Section Knitted Hat Crown Calculator",
    description:
      "Build a bounded bottom-up knitted hat reference from your gauge, including a candidate cast-on and an eight-section K2tog crown schedule.",
    url: "https://fibertools.app/hat-calculator",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Hat Size Calculator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eight-Section Knitted Hat Crown Calculator",
    description:
      "Build a bounded bottom-up knitted hat reference from your gauge, including a candidate cast-on and an eight-section K2tog crown schedule.",
    images: ["/og-image.png"],
  },
};

export default function HatCalculatorPage() {
  return (
    <ToolLayout slug="hat-calculator" widgetFirst>
      <AnswerBlock
        what="A bounded bottom-up knitting reference that combines the entered gauge and selected ease with an eight-section K2tog crown schedule."
        who="Knitters comparing a measured swatch and head measurement with a simple eight-section crown construction."
        bottomLine="Treat the cast-on and crown schedule as a starting reference, then follow your pattern and swatch for fit, depth, yarn needs, and finishing."
        lastUpdated="2026-08-29"
      />
      <div className="sr-only">
        <h2>Hat Size Calculator Tool</h2>
        <h2>How to Calculate Hat Dimensions</h2>
        <h2>Hat Size Results and Crown Decrease Schedule</h2>
      </div>
      <HatCalculatorTool />

      {/* Content sections */}

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          What does this hat reference calculate?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            The tool applies the selected ease percentage to the entered head circumference, scales that target by your measured stitch gauge, and rounds the candidate cast-on to a multiple of eight.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          That arithmetic does not establish a universal fit. Fiber, stitch pattern, fabric recovery, wearer preference, measurement technique, and the difference between a swatch and the finished fabric can all change the result. Check the calculated circumference against a trusted pattern and a representative washed swatch.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          The size presets and height ranges are broad references rather than project-specific predictions. This calculator does not determine how much yarn your particular hat will use.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          What does the eight-section crown schedule guarantee?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Within this limited model, every decrease round consumes the current stitch count exactly once, works one K2tog in each of eight equal sections, and leaves eight fewer stitches until eight remain.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          The schedule is for bottom-up knitting with eight decrease sections. It does not model a top-down hat, crochet shaping, a different number of decrease lines, pattern repeats that conflict with the rounded cast-on, or crown depth from row gauge.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          The included knit-even rounds are a simple reference sequence, not a substitute for a pattern. Use the pattern&rsquo;s decrease placement and frequency when it differs, and confirm crown length before finishing.
        </p>
      </section>
    </ToolLayout>
  );
}
