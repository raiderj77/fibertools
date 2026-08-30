import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import SleeveCalculatorTool from "./SleeveCalculatorTool";

export const metadata: Metadata = {
  title: "Sleeve Taper Arithmetic Reference",
  description:
    "Compare one paired-decrease interval model for a straight sleeve taper using explicit measurements, gauge, length, and cuff assumptions.",
  keywords: [
    "sleeve shaping calculator",
    "sleeve decrease calculator",
    "tapered sleeve knitting",
    "sleeve shaping math",
    "knitting sleeve calculator",
  ],
  authors: [{ name: "Jason Ramirez", url: "https://fibertools.app/about" }],
  openGraph: {
    title: "Sleeve Taper Arithmetic Reference",
    description:
      "Compare one paired-decrease interval model for a straight sleeve taper using explicit measurements, gauge, length, and cuff assumptions.",
    url: "https://fibertools.app/sleeve-calculator",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Sleeve Taper Arithmetic Reference" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sleeve Taper Arithmetic Reference",
    description:
      "Compare one paired-decrease interval model for a straight sleeve taper using explicit measurements, gauge, length, and cuff assumptions.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/sleeve-calculator" },
  other: { dateModified: "2026-08-29" },
};

export default function SleeveCalculatorPage() {
  return (
    <ToolLayout slug="sleeve-calculator" widgetFirst>
      <AnswerBlock
        what="A limited arithmetic reference that converts two entered circumferences to nominal whole-stitch counts and checks one paired-decrease interval model."
        who="Knitters and crocheters comparing this explicit straight-taper model with a selected sleeve pattern."
        bottomLine="The model uses two fixed one-inch exclusions and declines odd stitch gaps or schedules that need more decrease events than available shaping rows. It does not design a sleeve or validate fit."
        lastUpdated="2026-08-29"
      />

      <SleeveCalculatorTool />

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          What arithmetic does this sleeve reference use?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            The tool multiplies each entered circumference by stitch gauge and rounds each result to
            the nearest whole stitch count. A paired decrease removes two stitches per event. The
            rounded upper-arm and cuff counts therefore need an even difference for this model to
            reach the displayed cuff count exactly.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          The shaping zone equals the entered sleeve length minus the entered cuff length and exactly
          two more inches: one fixed one-inch exclusion at each end. The tool multiplies that zone by
          row gauge and rounds to the nearest whole shaping-row count. Those exclusions are calculator
          assumptions, not universal construction guidance.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          When the arithmetic is supported, the tool divides the shaping rows by the paired-decrease
          event count. If there is a remainder, it reports two adjacent whole-row interval lengths whose
          event spans add to the displayed shaping-row total. The selected pattern still controls the
          first event, interval order, eligible rows, placement, and row-count convention.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          Worked arithmetic example
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            If the rounded nominal counts are 60 stitches at the upper arm and 40 stitches at the cuff,
            the 20-stitch difference requires 10 paired-decrease events. With 80 shaping rows, the
            arithmetic divides exactly: one paired-decrease event every 8 rows, 10 times.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          This example verifies only the interval arithmetic. It does not establish that those counts,
          80 shaping rows, or an every-eighth-row sequence are appropriate for a particular sleeve.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          When does the calculator decline a schedule?
        </h2>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          If the rounded stitch-count difference is odd, paired two-stitch decreases cannot reach the
          displayed cuff count exactly. The calculator does not silently change either target. Compare a
          same-parity count or an explicit single-stitch adjustment only when the selected pattern supports it.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          The calculator also declines a plan that needs more paired-decrease events than shaping rows;
          this model permits at most one paired event per row. If the event count equals the row count,
          the arithmetic result is one event every row, which is useful only if the selected construction
          and technique permit every shaping row to be eligible.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Blank or non-finite inputs, nonpositive circumferences, sleeve length or gauges, a negative
          cuff length, and a sleeve length that does not leave a positive modeled shaping zone also
          produce no interval result. Cuff length may be zero. The wrist circumference and rounded cuff
          count must each remain below their upper-arm counterpart. Revise an input only from pattern or
          sample evidence rather than to force a result.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          What remains outside the model?
        </h2>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          The calculator does not add ease, choose measurement landmarks, model a sleeve cap or armhole,
          schedule pickups or short rows, allocate compound shaping, or decide whether the sleeve is worked
          flat, in the round, top-down, or bottom-up. It does not predict fit, appearance, comfort, finished
          dimensions after treatment, or compatibility with the garment body.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Any displayed knitting or crochet language is a notation example, not a prescribed technique.
          Follow the selected pattern for craft, direction, placement, lean, edge or round treatment, and
          stitch consumption. Use its specified sample and physical fit checks before committing a sleeve.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          When should I use a different calculation?
        </h2>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Use a pattern-specific model when a sleeve has a cap, asymmetric or centered shaping, a change
          other than two stitches per event, a variable rate, different unshaped zones, restricted eligible
          rows, or any construction that this straight-taper interval model does not represent.
        </p>
      </section>
    </ToolLayout>
  );
}
