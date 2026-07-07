import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import IncDecCalculatorTool from "./IncDecCalculatorTool";

export const metadata: Metadata = {
  title: "Evenly Spaced Increase & Decrease Calculator",
  description:
    "Calculate exactly where to place increases or decreases evenly across any row or round. Step-by-step instructions for knitting and crochet. Free.",
  keywords: [
    "increase evenly calculator", "decrease evenly knitting", "distribute increases",
    "evenly spaced decreases", "knitting increase calculator", "how to increase evenly across a row",
    "distribute decreases crochet", "increase 10 stitches evenly", "knitting math increase",
    "crochet increase calculator", "even decrease calculator", "stitch distribution calculator",
  ],
  openGraph: {
    title: "Evenly Spaced Increase & Decrease Calculator",
    description:
      "Calculate exactly where to place increases or decreases evenly across any row or round. Step-by-step instructions for knitting and crochet. Free.",
    url: "https://fibertools.app/increase-decrease-calculator",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Evenly Spaced Increase & Decrease Calculator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Evenly Spaced Increase & Decrease Calculator",
    description:
      "Calculate exactly where to place increases or decreases evenly across any row or round. Step-by-step instructions for knitting and crochet. Free.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/increase-decrease-calculator" },
};

export default function IncDecCalculatorPage() {
  return (
    <ToolLayout slug="increase-decrease-calculator">
      <AnswerBlock
        what="A calculator that tells you exactly where to place increases or decreases evenly across a row or round with step-by-step instructions."
        who="Knitters and crocheters following a pattern that says 'increase X stitches evenly' without telling you where to place them."
        bottomLine="Enter your current stitch count and how many to add or remove, the tool shows you the exact placement for each one."
        lastUpdated="2026-03-16"
      />
      <div className="sr-only">
        <h2>Increase and Decrease Calculator</h2>
        <h2>How to Distribute Increases Evenly</h2>
        <h2>Increase and Decrease Stitch Instructions</h2>
      </div>
      <IncDecCalculatorTool />

      {/* Content sections */}

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          Why distribute increases instead of bunching them together?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Spreading increases evenly across your row prevents holes, bumps, and uneven edges that happen when you bunch increases in one spot. Distributed increases blend smoothly into your fabric so your finished project looks neat and your edges stay straight.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          When you add multiple stitches in quick succession, your fabric gets a ridge or bulge at that location. Even if you space those increases only a few stitches apart, they still create a visible column of extra fabric that catches the eye. Your eye naturally wants to follow the line of those increases, and it breaks the rhythm of your pattern. Evenly spreading them forces your brain to look at the fabric as a whole instead of a problem spot.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Distributed increases also make edges more stable. When you have a dense cluster of new stitches, that section has less structural integrity because the stitches are all young and not yet supported by rows of fabric above them. Spreading them out gives each new stitch room to settle into the surrounding fabric and become part of a stable edge. This matters most for garment edges that get handled a lot or for blankets where the edge needs to lay flat.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          How do knitting math increases differ from crochet when distributing evenly?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            The math principle stays the same, but knitting and crochet handle the spacing differently because stitches sit at different heights. Crochet stitches are taller, so increases look proportional when spread by the same spacing method. Knitting stitches are shorter, so you may need to use edge increases differently to avoid diagonal lines in your shaping.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          In knitting, increases made at the edge (like raised increases or yarn overs at stitch 1 and the last stitch) create a clean selvage line and help you sew seams later. When you use an <Link href="/gauge-calculator" className="text-sage-600 dark:text-sage-400 underline hover:opacity-80">evenly distributed method</Link> across a row, knitters often prefer to anchor increases at the edges and then space the remaining increases inside the row. This prevents the edge from getting wavy or distorted.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Crochet increases (like double crochets in the same stitch) live at a single height, so your spacing looks consistent no matter where you place them. Crocheters working in the round often space increases by multiples to keep stripes and color patterns aligned. Since crochet stitches are tall, the visual spacing feels balanced across the row without the edge fiddling that knitting requires.
        </p>
      </section>
    </ToolLayout>
  );
}
