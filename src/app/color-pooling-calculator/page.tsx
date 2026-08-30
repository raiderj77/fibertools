import type { Metadata } from "next";
import Link from "next/link";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import ColorPoolingCalculatorTool from "./ColorPoolingCalculatorTool";

const description =
  "Build a bounded, idealized color-placement grid from stitch counts measured across one variegated-yarn repeat. Compare turned rows with same-direction rows before swatching.";

export const metadata: Metadata = {
  title: "Planned Color Pooling Sequence Preview",
  description,
  keywords: [
    "color pooling preview",
    "planned pooling crochet",
    "variegated yarn color repeat",
    "planned pooling swatch",
    "color sequence stitch grid",
  ],
  openGraph: {
    title: "Planned Color Pooling Sequence Preview",
    description,
    url: "https://fibertools.app/color-pooling-calculator",
    images: [{
      url: "https://fibertools.app/og-image.png",
      width: 1200,
      height: 630,
      alt: "Idealized planned color pooling stitch grid",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Planned Color Pooling Sequence Preview",
    description,
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/color-pooling-calculator" },
  other: { dateModified: "2026-08-29" },
};

export default function ColorPoolingCalculatorPage() {
  return (
    <ToolLayout slug="color-pooling-calculator" widgetFirst>
      <AnswerBlock
        what="A bounded stitch-grid simulator that repeats your measured color-section counts across rows and places return rows in the selected direction."
        who="Knitters and crocheters comparing trial row widths for a consistently repeating variegated yarn before making a physical swatch."
        bottomLine="The grid is an idealized sequence preview, not an exact foundation-chain calculation or a guarantee of argyle, plaid, or vertical pooling."
        lastUpdated="2026-08-29"
      />
      <ColorPoolingCalculatorTool />

      <section className="mt-12">
        <h2 className="mb-3 text-xl font-semibold text-bark-800 dark:text-cream-100">
          What does the color pooling preview calculate?
        </h2>
        <p className="mb-4 text-[15px] leading-relaxed text-bark-600 dark:text-bark-400">
          The preview expands the entered color sections into one idealized stitch-by-stitch repeat. Its
          trial row width is the repeat total plus your adjustment. It then consumes that sequence
          continuously across the requested rows. When you choose turned rows, the second, fourth, and
          other return rows are placed from right to left so the grid matches the visual direction of flat work.
        </p>
        <p className="text-[15px] leading-relaxed text-bark-600 dark:text-bark-400">
          The model begins with the first listed color and does not consume yarn for a foundation chain,
          turning chain, skipped chain, join, or edge treatment. The reported row width is therefore a count
          of worked stitches in the idealized row, not a foundation-chain prescription. Follow the setup
          instructions for the stitch you actually plan to use.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-xl font-semibold text-bark-800 dark:text-cream-100">
          How should you measure and test a trial width?
        </h2>
        <div className="mb-5 rounded-r-lg border-l-4 border-sage-500 bg-sage-50/50 py-3 pl-4 dark:bg-sage-950/20">
          <p className="text-[15px] leading-relaxed text-bark-700 dark:text-cream-300">
            Swatch in the intended stitch, tool size, and tension. Starting at a recognizable point in the
            color order, count the whole stitches covered by each color section through a complete repeat.
            Measure several repeats when possible and note any variation before treating an integer count as representative.
          </p>
        </div>
        <p className="mb-4 text-[15px] leading-relaxed text-bark-600 dark:text-bark-400">
          Enter the colors in yarn order, choose whether the work turns after each row, and compare small
          row-width adjustments. Then make a physical swatch at the selected worked-stitch count. A color
          transition that falls partway through a stitch, changes length between repeats, or is consumed by
          setup work cannot be reproduced exactly by this whole-stitch grid.
        </p>
        <p className="text-[15px] leading-relaxed text-bark-600 dark:text-bark-400">
          Buy enough yarn from one dye lot before you start. Color section lengths can vary between lots
          of the same colorway, and a mid-project lot change can break the sequence. The{' '}
          <Link href="/yarn-calculator" className="text-sage-600 dark:text-sage-400 underline hover:opacity-80">yarn calculator</Link>
          {' '}can scale yarn use from a representative pooled swatch when the finished piece is a flat rectangle. It does not predict how a colorway will pool or cover shaped pieces.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-xl font-semibold text-bark-800 dark:text-cream-100">
          Why can the real fabric differ from the grid?
        </h2>
        <p className="mb-4 text-[15px] leading-relaxed text-bark-600 dark:text-bark-400">
          The grid assumes each listed color always spans the same whole number of stitches. Real placement
          can move when tension changes, a color boundary lands within a stitch, a factory join interrupts
          the sequence, a new skein starts at another point, or setup and turning chains consume part of the repeat.
          Those effects are reasons to swatch, not defects the preview can solve.
        </p>
        <p className="text-[15px] leading-relaxed text-bark-600 dark:text-bark-400">
          If the repeat is too irregular for a stable comparison, use the yarn without trying to force a
          geometric pool or plan a separate solid-yarn stripe sequence with the{' '}
          <Link href="/stripe-generator" className="text-sage-600 dark:text-sage-400 underline hover:opacity-80">stripe generator</Link>.
        </p>
      </section>
    </ToolLayout>
  );
}
