import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import BlockingCalculatorTool from "./BlockingCalculatorTool";

const description = "Calculate the signed percentage change between current and requested project dimensions before testing a finishing method on a representative swatch.";

export const metadata: Metadata = {
  title: "Blocking Dimension Change Calculator",
  description,
  keywords: [
    "blocking calculator",
    "blocking dimension calculator",
    "knitting size percentage change",
    "crochet size percentage change",
    "blocking swatch",
  ],
  alternates: { canonical: "/blocking-calculator" },
  openGraph: {
    title: "Blocking Dimension Change Calculator",
    description,
    url: "https://fibertools.app/blocking-calculator",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Blocking Dimension Change Calculator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blocking Dimension Change Calculator",
    description,
    images: ["/og-image.png"],
  },
};

export default function BlockingCalculatorPage() {
  return (
    <ToolLayout slug="blocking-calculator" pageTitle="Blocking Dimension Change Calculator">
      <AnswerBlock
        what="A calculator for the signed percentage difference between current and requested width or length."
        who="Fiber artists comparing measurements before testing a care-instruction-compatible finishing method."
        bottomLine="The result describes the requested size change only. It cannot determine a safe method or predict what the fabric will do."
        lastUpdated="2026-08-29"
      />
      <BlockingCalculatorTool />

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          What does the percentage mean?
        </h2>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          The calculator uses (requested dimension − current dimension) ÷ current dimension × 100.
          Positive results are requested increases, negative results are requested decreases, and zero
          means the entered dimensions match. Width and length are calculated independently.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          For example, 48 to 50 is a +4.2% requested width change, while 60 to 57 is a −5.0%
          requested length change. Those figures do not establish that a fabric can reach or retain either target.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          How do I choose a blocking or finishing method?
        </h2>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Start with the pattern and the item&apos;s care instructions. Fiber names alone do not capture blends,
          dyes, construction, finishes, equipment, or manufacturer-specific limits, so this calculator does not
          choose wet, spray, or steam treatment for you.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Test the intended treatment on a representative swatch and measure it after the full treatment and
          drying cycle. Use heat only when the product and appliance instructions permit it. If a valuable item
          lacks clear instructions, get qualified textile-care guidance before proceeding.
        </p>
      </section>
    </ToolLayout>
  );
}
