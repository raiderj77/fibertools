import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import GaugeCalculatorTool from "./GaugeCalculatorTool";

export const metadata: Metadata = {
  title: "Knitting Gauge Calculator, Stitches Per Inch",
  description:
    "Enter your swatch measurements and get stitches per inch, row gauge, and resized stitch counts instantly. Free knitting and crochet gauge tool.",
  keywords: [
    "gauge calculator",
    "crochet gauge calculator",
    "knitting gauge converter",
    "pattern resizer",
    "resize crochet pattern",
    "stitch calculator",
    "how to calculate gauge",
    "stitches per inch calculator",
    "crochet blanket stitch calculator",
    "how many stitches per inch",
    "resize knitting pattern different yarn",
    "cast on calculator",
    "foundation chain calculator",
    "gauge swatch calculator",
    "knitting math calculator",
  ],
  alternates: { canonical: "/gauge-calculator" },
};

export default function GaugeCalculatorPage() {
  return (
    <ToolLayout slug="gauge-calculator" widgetFirst>
      <AnswerBlock
        what="A gauge calculator that converts your swatch measurements into stitches and rows per inch, then resizes pattern stitch counts to match your actual gauge."
        who="Knitters and crocheters who need to check whether their swatch matches a pattern's gauge, or resize a pattern for a different yarn weight."
        bottomLine="Measure your swatch, enter the numbers, and get your exact gauge plus adjusted stitch counts so your finished project comes out the right size."
        lastUpdated="2026-03-16"
      />
      <div className="sr-only">
        <h2>Gauge Calculator and Pattern Resizer</h2>
        <h2>How to Calculate Your Gauge</h2>
        <h2>Gauge Calculation Results and Adjustments</h2>
      </div>
      <GaugeCalculatorTool />

      {/* Content sections */}

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          How do I know if my stitches per inch matches my pattern?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Your pattern has a required gauge, and your swatch gauge needs to match it. If you have more stitches per inch than the pattern calls for, your project will be too small. If you have fewer, it will be too large. This tool compares your measured swatch to the pattern requirement instantly.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Gauge is just a measurement of density. Count the stitches and rows in a 4-inch section of your swatch, enter them here, and the calculator shows your stitch count and row count per inch. Then compare those numbers to what the pattern says. If they match within half a stitch, you are good to start. If they are off by more than half a stitch per inch, you need to change your needle or hook size and make another swatch.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Most knitters and crocheters go up a needle or hook size to get looser gauge (fewer stitches per inch), or down a size to get tighter gauge (more stitches per inch). The swatch is your blueprint for success. Many experienced crafters make test swatches without measuring, hit the gauge by luck, and learn nothing. Measure this one, record what you find, and you will adjust faster next time.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          Can this gauge calculator also resize stitch counts for a different yarn weight?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Yes. Enter your measured gauge and the original stitch count from the pattern, and the tool calculates what stitch count you need for a different width. This works because a heavier yarn uses fewer stitches per inch, and a lighter yarn uses more.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Resizing lets you use yarn you already have instead of shopping for the exact weight the pattern names. If a pattern calls for worsted weight and 120 cast-on stitches, but your yarn is worsted and your gauge is 4 stitches per inch instead of 5, you divide the width by the difference and cast on fewer stitches. You can also resize for a different finished width on the same yarn, like making a wider scarf or a narrower blanket.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          The math is simple but easy to mess up by hand. Enter your gauge and the width you want, and let the tool handle the division. Your resized project will fit right when you work to your actual gauge, which is why getting gauge right matters so much. A small error in stitch count adds up over 30 rows or 100 stitches.
        </p>
      </section>
    </ToolLayout>
  );
}
