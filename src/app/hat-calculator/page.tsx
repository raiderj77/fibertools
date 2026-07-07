import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import HatCalculatorTool from "./HatCalculatorTool";

export const metadata: Metadata = {
  title: "Hat Size Calculator",
  description:
    "Get cast-on count, crown decrease schedule, and yardage for any head size, preemie to large adult with ease adjustments.",
  keywords: [
    "hat calculator",
    "knit hat size chart",
    "beanie calculator",
    "crown decrease calculator",
    "hat stitch count",
    "crochet hat calculator",
  ],
  alternates: { canonical: "/hat-calculator" },
};

export default function HatCalculatorPage() {
  return (
    <ToolLayout slug="hat-calculator" widgetFirst>
      <AnswerBlock
        what="A calculator that provides cast-on count, crown decrease schedule, and yardage for any head size from preemie to large adult with ease adjustments."
        who="Knitters and crocheters making hats who need accurate stitch counts and shaping instructions for a specific head circumference."
        bottomLine="Select the head size and enter your gauge to get a complete hat blueprint with crown shaping instructions."
        lastUpdated="2026-03-16"
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
          How much negative ease should your hat stitch count have?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Most hats work best with 0.5 to 1 inch of negative ease, meaning your hat circumference at the cast-on is 0.5 to 1 inch smaller than the head measurement you entered. This creates a snug fit that won&rsquo;t slip off but stretches comfortably over the head when you put it on.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          The right amount of ease depends on your yarn and personal preference. Stretchy, elastic yarns like merino blends can use more negative ease, sometimes 1.5 inches, without feeling uncomfortable. Less elastic yarns like cotton or linen should stick closer to 0.5 inches, or even zero ease, because they do not recover as quickly after stretching over the head.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          If you always end up with hats that feel too loose or constantly slip forward, try increasing your negative ease by 0.25 inch next time. Conversely, if your finished hat feels tight around the forehead or causes headaches after an hour of wearing, reduce ease by 0.25 inch. Small adjustments make a big difference in comfort.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          Why does the beanie calculator round your cast-on to a multiple of 8?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Rounding to a multiple of 8 allows most crown decrease patterns to work evenly. Common hat patterns use 8 decrease lines running from the rim to the crown, and dividing your cast-on into 8 equal sections makes those decrease lines land at the same interval every round.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          If your hat stitch count does not divide evenly by 8, your decreases will bunch up in some spots and thin out in others, creating a lumpy crown. Most knitters and crocheters expect that balanced, symmetrical look. The multiple of 8 also pairs well with other common stitch multiples used for ribbing or texture patterns at the brim.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          That said, not every pattern uses 8 decreases. Some use 6 or 10. The hat calculator gives you the exact stitch count the tool recommends based on your gauge and head size, but always check your specific pattern to see how many decrease lines it calls for. If your pattern uses 6 decreases, you can modify the cast-on to a multiple of 6 instead and the hat will still turn out great.
        </p>
      </section>
    </ToolLayout>
  );
}
