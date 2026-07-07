import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import C2cCalculatorTool from "./C2cCalculatorTool";

export const metadata: Metadata = {
  title: "C2C Blanket Calculator",
  description:
    "Plan your corner-to-corner crochet blanket with block counts, diagonal rows, and yardage estimates from your gauge swatch.",
  keywords: [
    "C2C calculator",
    "corner to corner crochet calculator",
    "C2C blanket size",
    "C2C block calculator",
    "diagonal crochet planner",
    "corner to corner blanket",
  ],
  alternates: { canonical: "/c2c-calculator" },
};

export default function C2cCalculatorPage() {
  return (
    <ToolLayout slug="c2c-calculator" widgetFirst>
      <AnswerBlock
        what="A corner-to-corner crochet planner that calculates block counts, diagonal rows, and yardage estimates from your gauge swatch."
        who="Crocheters planning a C2C blanket or project who need to know how many blocks and how much yarn the design requires."
        bottomLine="Enter your target dimensions and gauge to get accurate block counts and yarn estimates for your C2C project."
        lastUpdated="2026-03-16"
      />
      <div className="sr-only">
        <h2>Corner-to-Corner Blanket Calculator</h2>
        <h2>How to Plan a C2C Crochet Blanket</h2>
        <h2>C2C Block Counts and Yardage Estimates</h2>
      </div>
      <C2cCalculatorTool />

      {/* Content sections */}

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          How do I use the corner to corner crochet calculator to plan my project?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Start by measuring a gauge swatch in your chosen yarn and hook, then enter your target blanket width and length. The calculator shows you exactly how many blocks you need across and up, then gives you the diagonal row count and total yardage. It takes the guesswork out of planning any size C2C project from scraps to king-size blankets.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Your gauge swatch should be at least 4 blocks by 4 blocks so you get an accurate measurement of both stitch and row height. Measure from the center of your edge stitches, not from the very edge where tension tends to be looser. Enter the width and height of your swatch in inches, plus how many blocks fit in that space. The calculator then divides your target dimensions by your block size to figure out the final block count.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Once you have your block count, the tricky part is understanding how C2C grows. You start with one block in the corner, then add one more block to each end of every diagonal row as you work outward. The calculator shows you which diagonal row number you are on at any point, and the total yardage is based on your yarn weight and how much yarn a single block requires. This makes it easy to plan whether you need one skein or ten before you buy anything.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          Why does my C2C block calculator give different yardage estimates than other sources?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Yardage estimates depend on your actual gauge swatch and how tightly you crochet. Two people using the same yarn and hook size can end up with different block heights if one person crochets looser or tighter, and that directly changes how much yarn the whole blanket needs. This calculator uses your personal gauge data, so it gives you the most accurate estimate for your hands and style.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Generic yardage charts assume a standard gauge that may not match your swatch. If your blocks are bigger than the chart assumes, each block takes more yarn, and the whole blanket will too. The calculator measures your actual row height from your swatch, so it accounts for whether you tend to crochet tight, loose, or somewhere in between. This is why measuring a real swatch in your yarn matters so much more than trusting a generic estimate.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          It also helps to remember that yardage estimates are just starting points. When you start crocheting, keep track of how much yarn you use for the first few diagonal rows. If you are using yarn faster or slower than the estimate predicted, you can adjust your blanket size or buy extra yarn before you get stuck. Some crocheters add 10 to 20 percent extra just to be safe, especially when making gifts where running out partway through is not an option.
        </p>
      </section>
    </ToolLayout>
  );
}
