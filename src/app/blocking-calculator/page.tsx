import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import BlockingCalculatorTool from "./BlockingCalculatorTool";

export const metadata: Metadata = {
  title: "Blocking Calculator & Fiber Guide",
  description:
    "Get the right blocking method for your fiber type with stretch feasibility ratings and step-by-step instructions.",
  keywords: [
    "blocking calculator",
    "how to block knitting",
    "blocking guide",
    "wet blocking",
    "steam blocking",
    "blocking crochet",
    "fiber blocking method",
  ],
  alternates: { canonical: "/blocking-calculator" },
};

export default function BlockingCalculatorPage() {
  return (
    <ToolLayout slug="blocking-calculator">
      <AnswerBlock
        what="A tool that recommends the correct blocking method for your fiber type with stretch feasibility ratings and step-by-step instructions."
        who="Fiber artists who need to know whether to wet block, steam block, or spray block their finished project based on fiber content."
        bottomLine="Enter your fiber type to get the recommended blocking method, always test on a swatch first if you are unsure."
        lastUpdated="2026-03-16"
      />
      <div className="sr-only">
        <h2>Blocking Calculator Tool</h2>
        <h2>How to Choose a Blocking Method</h2>
        <h2>Blocking Method Results and Step-by-Step Guide</h2>
      </div>
      <BlockingCalculatorTool />

      {/* Content sections */}

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          What is the difference between wet blocking and steam blocking for your fiber type?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Wet blocking soaks your finished piece in cool water and lets it dry flat, perfect for natural fibers like wool, cotton, and linen that need relaxation. Steam blocking uses heat from a steamer or iron held above the fabric, ideal for synthetics and blends that hold their shape better with heat.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Wet blocking is gentler and allows more dramatic reshaping, which is why it works so well on delicate lace or openwork patterns. You can stretch and pin the piece to your exact desired dimensions, and the relaxed fibers will remember that shape as they dry. This method takes longer but gives you the most control.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Steam blocking is faster and works well when you just need to soften stitches or even out texture without major reshaping. Many spinners and fiber artists use it as a finishing touch on garments before wearing. Always test any method on your gauge swatch first, and hold the steamer at least 1 inch above the fabric to avoid creating shine or flattening your stitches too much.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          How do you avoid over-blocking knitting and crochet projects?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Over-blocking happens when you stretch a piece too much or block it when it does not need it, which can distort your stitches, flatten texture, or make garments sag. Work with your fiber type and block only as much as needed to even out tension and open lace.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          The best approach is to block each fiber type less aggressively than you think. Most natural fibers only need 10 to 20 percent extra stretch, not dramatic reshaping. Use the calculator to match your fiber, then aim for the lower end of the stretch range. For example, acrylic should barely move at all since heat relaxation is limited.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Textured stitches like popcorn, bobble, or cable patterns often should not be wet blocked at all because flattening will destroy the dimensional quality you worked to create. Instead, gently pin the piece to shape without stretching those sections. If your finished project already has even tension and the right drape, you may only need a light mist spray to relax wrinkles, not a full blocking session.
        </p>
      </section>
    </ToolLayout>
  );
}
