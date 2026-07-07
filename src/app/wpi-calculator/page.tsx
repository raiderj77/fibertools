import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import WpiCalculatorTool from "./WpiCalculatorTool";

export const metadata: Metadata = {
  title: "WPI to Yarn Weight Converter",
  description:
    "Enter wraps per inch to identify yarn weight, recommended needles, hooks, gauge range, and project ideas. Free WPI tool.",
  keywords: [
    "wraps per inch calculator",
    "WPI yarn weight",
    "identify yarn weight",
    "WPI chart",
    "yarn weight from WPI",
    "wraps per inch chart",
  ],
  alternates: { canonical: "/wpi-calculator" },
};

export default function WpiCalculatorPage() {
  return (
    <ToolLayout slug="wpi-calculator">
      <AnswerBlock
        what="A converter that identifies yarn weight from your wraps-per-inch measurement, with recommended needles, hooks, gauge range, and project ideas."
        who="Fiber artists with unlabeled yarn who need to determine the weight category before starting a project."
        bottomLine="Wrap your yarn around a ruler, count the wraps per inch, and enter the number to identify the yarn weight instantly."
        lastUpdated="2026-03-16"
      />
      <div className="sr-only">
        <h2>WPI to Yarn Weight Converter</h2>
        <h2>How to Measure Wraps Per Inch</h2>
        <h2>Yarn Weight Identification Results and Recommendations</h2>
      </div>
      <WpiCalculatorTool />

      {/* Content sections */}

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          How does wraps per inch help you choose the right needle size?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Once you know your yarn weight from the WPI measurement, you can match it to needle recommendations that designers use for that weight class. A fingering yarn (14+ wraps per inch) typically knits on US 1-3 needles, while a bulky yarn (5-8 wraps per inch) uses US 9-11. This prevents the most common knitting mistakes: needles too large that create loose fabric, or needles too small that make the work exhausting.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          The WPI chart shows these ranges because yarn weight and needle compatibility go hand in hand. A needle that is too big swallows the yarn and creates floppy stitches that distort your stitch definition. A needle that is too small forces you to work harder and can split thinner yarns. By determining your unlabeled yarn is, say, worsted weight (9-11 wraps per inch), you know to reach for US 7-9 needles instead of guessing.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Different projects also benefit from different needle sizes within the same yarn weight. A sock knitter might use US 0-1 needles for a tighter fabric, while a lightweight sweater designer might use US 5-6 for the same yarn to create drape. Knowing your yarn weight gives you the anchor point to make those adjustments confidently instead of starting over when the first attempt does not feel right.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          Why should you measure yarn weight before diving into a new project?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Starting a project with unlabeled or mystery yarn without knowing its weight invites frustration, wasted hours, and yarn used. Knowing the weight upfront lets you choose an appropriate pattern, estimate yardage needs accurately, and set realistic gauge expectations from the beginning.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Many fiber artists inherit stash yarn, buy unmarked yarn from local spinners, or unravel old projects for reuse. The only way to turn mystery yarn into a workable project is to identify what you have. The WPI measurement takes about one minute and then you know whether that yarn can make a delicate lace scarf or a sturdy blanket. You avoid the scenario where you cast on based on a guess, work for three hours, and discover the fabric is completely wrong for your pattern.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          A quick WPI check also helps you respect the fiber content. Delicate fingering-weight silk needs different treatment than chunky wool, and the weight category gives you the first clue about the appropriate needles, blocking method, and washing instructions. Pattern designers assume you know your yarn weight when they recommend casting on 100 stitches on size US 6 needles. By measuring your WPI first, you join those design assumptions and avoid the pattern-fit problems that plague rushed projects.
        </p>
      </section>
    </ToolLayout>
  );
}
