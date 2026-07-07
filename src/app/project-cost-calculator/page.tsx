import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import ProjectCostCalculatorTool from "./ProjectCostCalculatorTool";

export const metadata: Metadata = {
  title: "Yarn & Project Cost Calculator, Free",
  description:
    "Calculate the total cost of any knitting or crochet project, yarn, notions, and time. See your hourly rate for selling. Free, no signup needed.",
  keywords: [
    "crochet cost calculator", "knitting cost calculator", "how much does a blanket cost to make",
    "yarn project cost estimator", "cost to crochet a blanket", "is it cheaper to knit or buy",
    "how much does it cost to knit a sweater", "yarn budget planner",
    "handmade pricing calculator", "craft project cost",
  ],
  openGraph: {
    title: "Yarn & Project Cost Calculator, Free",
    description:
      "Calculate the total cost of any knitting or crochet project, yarn, notions, and time. See your hourly rate for selling. Free, no signup needed.",
    url: "https://fibertools.app/project-cost-calculator",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Yarn & Project Cost Calculator, Free" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yarn & Project Cost Calculator, Free",
    description:
      "Calculate the total cost of any knitting or crochet project, yarn, notions, and time. See your hourly rate for selling. Free, no signup needed.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/project-cost-calculator" },
};

export default function ProjectCostCalculatorPage() {
  return (
    <ToolLayout slug="project-cost-calculator" widgetFirst>
      <AnswerBlock
        what="A calculator that totals yarn, notions, and time costs for any knitting or crochet project, plus shows your effective hourly rate if selling."
        who="Fiber artists who want to know the true cost of a project before buying supplies or setting a sale price for finished items."
        bottomLine="Enter your yarn quantities, prices, and estimated hours to see total project cost and a realistic pricing guide."
        lastUpdated="2026-03-16"
      />
      <div className="sr-only">
        <h2>Project Cost Calculator Tool</h2>
        <h2>How to Estimate Project Costs</h2>
        <h2>Project Cost Breakdown and Time Estimates</h2>
      </div>
      <ProjectCostCalculatorTool />

      {/* Content sections */}

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          How do I track yarn costs when buying from multiple sources?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            The calculator handles yarn from anywhere by letting you add each purchase separately with the actual price you paid. Track discount bins, sales, outlet stores, or bulk orders all in one project total.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Keep your receipts or prices written down so you can enter them accurately. If you bought 2 skeins from one store and 4 skeins from another, add them as separate yarn entries with their actual per-skein costs. The calculator totals them automatically. This way you get a real picture of what you spent instead of averaging.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Over time you will notice which yarn sources are actually cheaper when you account for what you bought. Some online shops have shipping costs built in, while local shops might charge more but save you wait time. Knowing your actual yarn budget by project helps you make smarter shopping choices next time.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          What should I include in my craft project cost besides yarn?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Beyond yarn, add the cost of needles or hooks if you bought new ones, buttons, zippers, stitch markers, linings, tags, or packaging. The calculator has a notions field so you can account for every supply that goes into your finished piece.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Notions are the small things that finish a project. If you knit a sweater, add the zipper cost. If you crochet a blanket with a crochet-on border, count those extra skeins. Did you add a label with your name on it? That costs something too. Even stitch markers you bought count if they are project-specific supplies rather than reusable tools you own already.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          The most honest project cost includes your time as well. If you sold this piece, you would charge for your labor, not just materials. The calculator shows you what hourly rate you end up with based on your estimated hours worked, which helps you understand whether the project was worth your time investment.
        </p>
      </section>
    </ToolLayout>
  );
}
