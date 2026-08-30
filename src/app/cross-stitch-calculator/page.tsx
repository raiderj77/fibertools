import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import CrossStitchCalculatorTool from "./CrossStitchCalculatorTool";

const description =
  "Calculate cross-stitch design and fabric-cut dimensions with consistent over-one or over-two semantics, plus a floss planning model with visible user-entered assumptions.";

export const metadata: Metadata = {
  title: "Cross Stitch Size, Fabric & Floss Planning Calculator",
  description,
  keywords: [
    "cross stitch size calculator",
    "cross stitch fabric calculator",
    "over two cross stitch size",
    "cross stitch floss planning",
    "Aida design dimensions",
  ],
  openGraph: {
    title: "Cross Stitch Size, Fabric & Floss Planning Calculator",
    description,
    url: "https://fibertools.app/cross-stitch-calculator",
    images: [{
      url: "https://fibertools.app/og-image.png",
      width: 1200,
      height: 630,
      alt: "Cross stitch size, fabric, and floss planning calculator",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cross Stitch Size, Fabric & Floss Planning Calculator",
    description,
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/cross-stitch-calculator" },
  other: { dateModified: "2026-08-29" },
};

export default function CrossStitchCalculatorPage() {
  return (
    <ToolLayout slug="cross-stitch-calculator">
      <AnswerBlock
        what="A three-mode calculator for finished design size, fabric-cut arithmetic, and full-cross floss planning under explicit fabric-count, stitch-span, and skein assumptions."
        who="Cross stitchers comparing fabric counts or planning a cut and floss quantity from known pattern dimensions and full-cross counts."
        bottomLine="Size and cut results are direct arithmetic. The floss result is a geometric planning model, not an exact consumption prediction."
        lastUpdated="2026-08-29"
      />
      <CrossStitchCalculatorTool />

      <section className="mt-12">
        <h2 className="mb-3 text-xl font-semibold text-bark-800 dark:text-cream-100">
          How do fabric count and over-one or over-two stitching combine?
        </h2>
        <p className="mb-4 text-[15px] leading-relaxed text-bark-600 dark:text-bark-400">
          The selected count is the fabric grid count per inch: stitchable squares for Aida, or thread
          intervals for evenweave and linen. A full cross worked over one grid interval uses that count as
          its stitches per inch. A full cross worked over two grid intervals uses half that count. The same
          rule is applied in the finished-size, fabric-cut, and floss-planning modes.
        </p>
        <p className="text-[15px] leading-relaxed text-bark-600 dark:text-bark-400">
          Finished width is pattern width divided by effective stitches per inch; height uses the same
          formula. For example, 140 stitches on 14-count fabric over one and 140 stitches on 28-count
          fabric over two both finish 10 inches wide before any margin.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-xl font-semibold text-bark-800 dark:text-cream-100">
          What does the fabric-cut result include?
        </h2>
        <p className="mb-4 text-[15px] leading-relaxed text-bark-600 dark:text-bark-400">
          The fabric mode adds your entered margin to both sides of each finished design dimension:
          total width equals design width plus twice the side margin, and total height equals design height
          plus twice the top or bottom margin. The calculator does not choose a universal margin because
          hooping, framing, finishing, and fraying allowances depend on the project and finisher.
        </p>
        <p className="text-[15px] leading-relaxed text-bark-600 dark:text-bark-400">
          Confirm the required margin with the framing or finishing method you plan to use, then enter that
          positive amount. Round a purchase cut up according to the seller&apos;s increments after checking
          fabric orientation and whether the edges require additional finishing room.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-xl font-semibold text-bark-800 dark:text-cream-100">
          How does the floss planning model work?
        </h2>
        <p className="mb-4 text-[15px] leading-relaxed text-bark-600 dark:text-bark-400">
          For each full cross, the model calculates two ideal front diagonals across one stitch square.
          It multiplies that path by the full-cross count, then applies the allowance percentage you enter
          for back travel, starts, stops, tails, and waste. Holding more strands increases the required
          constituent-strand length without changing the needle&apos;s geometric path.
        </p>
        <p className="text-[15px] leading-relaxed text-bark-600 dark:text-bark-400">
          Skein equivalence divides the planned constituent-strand length by the labeled skein length times
          the number of strands in the unopened bundle. The result assumes usable strand remnants and does
          not model partial crosses, backstitch, specialty stitches, knots, beads, cut-length preferences,
          tension, or color loss. Treat it as a transparent scenario to compare with your pattern&apos;s stated
          requirements, not an exact promise of floss use.
        </p>
      </section>
    </ToolLayout>
  );
}
