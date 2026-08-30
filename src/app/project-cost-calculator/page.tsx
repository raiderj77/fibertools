import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import ProjectCostCalculatorTool from "./ProjectCostCalculatorTool";

export const metadata: Metadata = {
  title: "Yarn & Material Cost Calculator, Free",
  description:
    "Total entered yarn and notion amounts, estimate time from stitches and speed, and compare an entered selling price with materials and estimated hours.",
  keywords: [
    "crochet cost calculator", "knitting cost calculator", "how much does a blanket cost to make",
    "yarn project cost estimator", "cost to crochet a blanket", "is it cheaper to knit or buy",
    "how much does it cost to knit a sweater", "yarn budget planner",
    "handmade pricing calculator", "craft project cost",
  ],
  openGraph: {
    title: "Yarn & Material Cost Calculator, Free",
    description:
      "Total entered yarn and notion amounts, estimate time from stitches and speed, and compare an entered selling price with materials and estimated hours.",
    url: "https://fibertools.app/project-cost-calculator",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Yarn & Project Cost Calculator, Free" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yarn & Material Cost Calculator, Free",
    description:
      "Total entered yarn and notion amounts, estimate time from stitches and speed, and compare an entered selling price with materials and estimated hours.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/project-cost-calculator" },
};

export default function ProjectCostCalculatorPage() {
  return (
    <ToolLayout slug="project-cost-calculator" widgetFirst>
      <AnswerBlock
        what="A calculator that adds entered yarn and notion amounts, estimates time from an entered stitch count and stitch rate, and compares an entered selling price with materials and estimated hours."
        who="Fiber artists who want to check a material subtotal or explore a time and selling-price scenario from their own inputs."
        bottomLine="The total is entered materials only. Optional time and selling-price outputs do not add labor cost, calculate net profit, or recommend a price."
        lastUpdated="2026-08-29"
      />
      <div className="sr-only">
        <h2>Project Cost Calculator Tool</h2>
        <h2>How to Estimate Project Costs</h2>
        <h2>Material Subtotal and Optional Time Arithmetic</h2>
      </div>
      <ProjectCostCalculatorTool />

      {/* Content sections */}

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          How do I track yarn costs when buying from multiple sources?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Add each yarn purchase as a separate line with its quantity and price per skein. The calculator
            multiplies each pair of values and adds the results; it does not retrieve prices or verify receipts.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          If you bought 2 skeins at one price and 4 at another, enter two lines so each quantity is multiplied
          by its matching price. The displayed yarn subtotal reflects only the values currently entered.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          The calculator does not compare stores, retain purchase history, or add shipping, taxes, discounts,
          or fees automatically. Add an applicable amount as a notion or extra if you want it included, and
          keep source records separately.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          What should I include in my craft project cost besides yarn?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            The notions and extras section adds the amounts you enter for items such as buttons, zippers,
            stuffing, a pattern, packaging, shipping, taxes, or fees. It cannot identify missing costs or decide
            whether a reusable tool belongs in this project.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Review your own accounting scope before entering extras. A one-time material, a reusable tool, overhead,
          and a business expense are different categories even though this form can add any entered amount. The
          result remains an arithmetic subtotal, not a complete project or business budget.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          The optional time estimate divides total stitches by the stitches-per-minute value you enter, then by
          60. With a selling price, the tool subtracts entered materials and divides that remainder by estimated
          hours. It does not add labor cost, time setup or finishing work, determine net profit, or advise what
          anyone should charge.
        </p>
      </section>
    </ToolLayout>
  );
}
