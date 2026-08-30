import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import C2cCalculatorTool from "./C2cCalculatorTool";

const description =
  "Round target dimensions to a bounded C2C block grid from a measured two-axis swatch, with an optional measured yarn-per-block planning total.";

export const metadata: Metadata = {
  title: "C2C Blanket Calculator",
  description,
  keywords: [
    "C2C calculator",
    "corner to corner crochet calculator",
    "C2C block planner",
    "C2C gauge swatch",
    "diagonal row count",
  ],
  alternates: { canonical: "/c2c-calculator" },
  openGraph: {
    title: "C2C Blanket Calculator",
    description,
    url: "https://fibertools.app/c2c-calculator",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Measured-swatch C2C block planner" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "C2C Blanket Calculator",
    description,
    images: ["/og-image.png"],
  },
  other: { dateModified: "2026-08-29" },
};

export default function C2cCalculatorPage() {
  return (
    <ToolLayout slug="c2c-calculator" widgetFirst>
      <AnswerBlock
        what="A bounded worksheet that derives separate C2C block width and height from a measured swatch, rounds each target axis to at least one whole block, and reports the corresponding diagonal-row count."
        who="Crocheters planning a rectangular C2C panel from a representative swatch made with the intended yarn, hook, stitch construction, tension, and finishing."
        bottomLine="The result is a nominal block grid. Nearest-block rounding can finish above or below the target, and the tool does not guarantee finished dimensions or yarn quantity."
        lastUpdated="2026-08-29"
      />
      <C2cCalculatorTool />

      <section className="mt-12">
        <h2 className="mb-3 text-xl font-semibold text-bark-800 dark:text-cream-100">
          How is the C2C block grid calculated?
        </h2>
        <p className="mb-4 text-[15px] leading-relaxed text-bark-600 dark:text-bark-400">
          Measured block width is swatch width divided by blocks measured across. Measured block height is
          swatch height divided by blocks measured down. The planner divides each requested dimension by its
          corresponding measured block size, rounds to the nearest whole block, and keeps at least one block on each axis.
        </p>
        <p className="text-[15px] leading-relaxed text-bark-600 dark:text-bark-400">
          Total blocks are blocks wide multiplied by blocks tall. The rectangular diagonal-row count is blocks
          wide plus blocks tall minus one. The displayed nominal dimensions multiply the rounded counts by the
          measured block sizes; they are arithmetic, not a promise about treated fabric.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-xl font-semibold text-bark-800 dark:text-cream-100">
          What does the optional yarn total include?
        </h2>
        <div className="mb-5 rounded-r-lg border-l-4 border-sage-500 bg-sage-50/50 py-3 pl-4 dark:bg-sage-950/20">
          <p className="text-[15px] leading-relaxed text-bark-700 dark:text-cream-300">
            If you enter inches of yarn measured per representative block, the planner multiplies that amount by
            total blocks, converts inches to yards, and then applies the allowance percentage you entered.
          </p>
        </div>
        <p className="mb-4 text-[15px] leading-relaxed text-bark-600 dark:text-bark-400">
          The base and allowance are shown separately. The model assumes the measured per-block amount represents
          the full panel; color changes, joins, borders, ends, construction changes, and a nonrepresentative sample
          need their own measured quantities.
        </p>
        <p className="text-[15px] leading-relaxed text-bark-600 dark:text-bark-400">
          Leave yarn per block blank when you only need the grid. Do not convert the planning total into a purchase
          count until you have checked the exact label length, dye-lot needs, and every separately measured component.
        </p>
      </section>
    </ToolLayout>
  );
}
