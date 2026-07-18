import type { Metadata } from "next";
import Link from "next/link";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import BlanketCalculatorTool from "./BlanketCalculatorTool";

export const metadata: Metadata = {
  title: "Blanket Yarn Calculator from Your Gauge Swatch",
  description:
    "Estimate blanket yarn and skeins from your measured swatch. Calculate blanket dimensions, stitch counts, rows, and a transparent 10% buffer.",
  keywords: [
    "blanket size chart", "crochet blanket sizes", "blanket size calculator",
    "how big should a blanket be", "baby blanket size crochet", "throw blanket dimensions",
    "king size blanket crochet stitches", "how many chains for a throw blanket",
    "crochet blanket yardage chart", "blanket dimensions chart",
    "blanket yarn calculator", "crochet blanket calculator",
    "knitting blanket size guide", "blanket stitch count",
  ],
  authors: [{ name: "Jason Ramirez", url: "https://fibertools.app/about" }],
  openGraph: {
    title: "Blanket Yarn Calculator from Your Gauge Swatch",
    description:
      "Estimate blanket yarn and skeins from your measured swatch, with blanket dimensions, stitch counts, rows, and a transparent 10% buffer.",
    url: "https://fibertools.app/blanket-calculator",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Blanket Yarn Calculator, How Much Do I Need?" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blanket Yarn Calculator from Your Gauge Swatch",
    description:
      "Estimate blanket yarn and skeins from your measured swatch, with blanket dimensions, stitch counts, rows, and a transparent 10% buffer.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/blanket-calculator" },
  other: { dateModified: "2026-07-17" },
};

export default function BlanketCalculatorPage() {
  return (
    <ToolLayout slug="blanket-calculator" widgetFirst>
      <AnswerBlock
        what="A calculator that scales the yarn used by your own swatch to a selected blanket size, then calculates stitch counts, rows, total yarn, and skeins."
        who="Knitters and crocheters planning a blanket project who want to buy the right amount of yarn before starting."
        bottomLine="For a defensible yarn estimate, make a swatch in the actual stitch pattern, weigh it, and enter the yarn-label yardage and weight."
        lastUpdated="2026-07-17"
      />

      <BlanketCalculatorTool />

      {/* ── Content sections ── */}

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          How do you calculate how much yarn you need for a blanket?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Make a swatch in the yarn and stitch pattern you will use, measure its width and height, and
            weigh it in grams. The calculator divides the finished blanket area by the swatch area, multiplies
            that ratio by the swatch weight, adds a visible 10% planning buffer, and converts the result to
            yards and skeins using the values printed on your yarn label.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Gauge determines the cast-on stitch count and number of rows, but gauge alone does not reveal how
          much yarn a stitch pattern consumes. Two swatches can have the same dimensions while using different
          amounts of yarn because cables, bobbles, lace, and plain stitches follow different yarn paths.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Stitch pattern matters too. Work the sample in the same stitch pattern, yarn, and tool size planned
          for the blanket. If the project includes a separate border, fringe, seams, or multiple stitch patterns,
          measure those components separately instead of assuming they consume the same amount as the main fabric.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          What are the standard blanket sizes?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            This tool provides common planning presets: a 50×60-inch throw, a 36×52-inch baby/crib blanket,
            and bed-blanket presets from 66×90 inches for twin to 108×100 inches for king. These are editable
            starting points, not universal standards; measure the intended bed, recipient, or pattern before buying yarn.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Lap blankets and stroller blankets fall in the 36×48 to 30×40 inch range, useful for portability
          without the yardage commitment of a full throw. Lovey blankets are typically 12×12 inches and use
          as little as 50–100 yards.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          When measuring for a bed blanket, measure from the mattress surface down to where you want the
          blanket to fall on each side. Most makers target mid-mattress depth (10–12 inches) rather than
          floor-length. Add both sides together and add that to the mattress width before calculating.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          How much yarn do I need for a baby blanket?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            There is no single reliable yardage number for every baby blanket. Size, yarn construction,
            stitch pattern, hook or needle size, and personal tension all change consumption. Use a swatch
            made in the actual pattern and yarn; the calculator scales that measured use to your chosen size.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          If you are comparing yarn weights, make and weigh a swatch for each candidate rather than applying
          a fixed multiplier. The{' '}
          <Link href="/yarn-calculator" className="text-sage-600 dark:text-sage-400 underline hover:opacity-80">yarn calculator</Link>
          {' '}can help with broader project planning, while this blanket tool uses your measured swatch for its estimate.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Receiving (30×30 inches) and stroller (30×40 inches) presets are included, along with custom
          dimensions. Confirm the finished size required by your pattern or recipient before calculating.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          What yarn weight is best for blankets?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Choose yarn weight for the fabric you want, then swatch. The Craft Yarn Council publishes
            guideline ranges for yarn categories, gauge, needles, and hooks, while noting that the ranges are
            guidelines and that makers should follow the pattern and make a gauge swatch.<sup>1</sup>
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Fiber type affects drape and washability. Acrylic and acrylic blends are the practical choice for
          blankets that see heavy use, they&rsquo;re machine washable and hold color well. Wool makes
          warm, luxurious blankets but usually requires hand-washing or gentle machine cycles. Cotton and
          cotton blends work well for summer-weight throws but have less stretch, making gauge consistency
          more demanding.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Super Bulky and Jumbo weights (CYC 6–7) complete a throw in hours rather than days, which is
          appealing, but they require oversized hooks or needles (12–25mm) and produce a stiffer fabric
          with less drape. Arm-knitting blankets fall in the jumbo range.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          How do pillow tuck and bed overhang affect yardage?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            In this calculator, pillow tuck is an optional 20-inch allowance. Overhang is a value you choose;
            it is added to both sides of the width and to the foot of the length. Measure the mattress and the
            desired drop instead of relying on a universal allowance.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          A blanket without overhang or tuck, just covering the mattress top, uses far less yarn but looks
          flat and moves around during sleep. Most bed blanket patterns assume at least a 10-inch drop on
          each side. The calculator adds overhang to both the width and one end of the length (footboard
          side), matching how most makers work.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Because yarn use scales with finished area, extra overhang and tuck can materially increase the
          estimate. Set the dimensions first, then use the same measured swatch to compare alternatives before buying.
        </p>
      </section>

      {/* ── References ── */}
      <section className="mt-12 pt-6 border-t border-bark-200 dark:border-bark-700">
        <h2 className="text-base font-semibold text-bark-700 dark:text-cream-300 mb-3">References</h2>
        <ol className="space-y-1.5 text-sm text-bark-500 dark:text-bark-400">
          <li>
            <span className="font-medium">1.</span>{" "}
            Craft Yarn Council, Standard Yarn Weight System (guideline gauge, needle, and hook ranges).{" "}
            <Link
              href="https://www.craftyarncouncil.com/standards/yarn-weight-system"
              className="text-sage-600 dark:text-sage-400 underline"
              target="_blank"
              rel="nofollow noopener"
            >
              craftyarncouncil.com
            </Link>
          </li>
          <li>
            <span className="font-medium">2.</span>{" "}
            Calculation method: finished area ÷ swatch area × measured swatch grams × 1.10 buffer;
            yarn-label length and weight convert grams to yards and whole skeins.
          </li>
        </ol>
      </section>
    </ToolLayout>
  );
}
