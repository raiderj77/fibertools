import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import SpinningCalculatorTool from "./SpinningCalculatorTool";

export const metadata: Metadata = {
  title: "Spinning Wheel Ratio Calculator, Free",
  description:
    "Calculate drive ratios, twists per inch, and plying twist for handspinning. Includes fiber guide with TPI ranges. Free, no signup needed.",
  keywords: [
    "spinning wheel ratio", "spinning wheel drive ratio", "twist per inch calculator",
    "spinning wheel ratio chart", "TPI calculator", "what ratio for sock yarn spinning",
    "spinning wheel whorl size calculator", "how to calculate drive ratio spinning wheel",
    "plying twist calculator", "wraps per inch spinning",
    "handspinning calculator", "spinning fiber guide",
  ],
  openGraph: {
    title: "Spinning Wheel Ratio Calculator, Free",
    description:
      "Calculate drive ratios, twists per inch, and plying twist for handspinning. Includes fiber guide with TPI ranges. Free, no signup needed.",
    url: "https://fibertools.app/spinning-ratio-calculator",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Spinning Wheel Ratio Calculator, Free" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Spinning Wheel Ratio Calculator, Free",
    description:
      "Calculate drive ratios, twists per inch, and plying twist for handspinning. Includes fiber guide with TPI ranges. Free, no signup needed.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/spinning-ratio-calculator" },
};

export default function SpinningCalculatorPage() {
  return (
    <ToolLayout slug="spinning-ratio-calculator">
      <AnswerBlock
        what="A calculator for handspinners that computes drive ratios, twists per inch, and plying twist with a fiber guide showing recommended TPI ranges."
        who="Handspinners who need to dial in their spinning wheel settings for a specific yarn weight or fiber type."
        bottomLine="Enter your whorl and drive wheel measurements to calculate your ratio, then match it to the TPI your target yarn needs."
        lastUpdated="2026-03-16"
      />
      <div className="sr-only">
        <h2>Spinning Wheel Ratio Calculator</h2>
        <h2>How to Calculate Drive Ratios</h2>
        <h2>Spinning Ratio Results and Plying Guide</h2>
      </div>
      <SpinningCalculatorTool />

      {/* Content sections */}

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          How does fiber type change the TPI I need in my spinning wheel ratio?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Different fibers need different amounts of twist to hold together and feel balanced. Slippery fibers like silk need more twist to stay stable, while fuzzy fibers like mohair hold together with less. Your spinning wheel ratio controls how much twist enters per rotation, so matching it to your fiber keeps the yarn from being either too limp or too stiff.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Short-staple fibers like merino wool are shorter and weaker individually, so they need more twist to lock together firmly. Long-staple fibers like combed tops from long-wool breeds grab each other more easily and can handle less twist without becoming overworked. The fiber length and character determine how much holding power the twist needs to create.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          You can test this by spinning small samples with your current ratio, looking at the single, and asking yourself whether it feels soft and balanced or whether the twist is fighting the fiber. If your mohair feels stiff and wiry, dial down your ratio. If your merino feels mushy or keeps splitting apart, raise your ratio. The goal is a single that feels like it holds together naturally without the twist becoming aggressive.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          What happens if my whorl size does not match the yarn weight I want to spin?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            If your whorl is too large relative to your drive wheel, your spinning wheel ratio will be high, forcing a lot of twist into the yarn quickly. Too small a whorl gives a low ratio and slower twist insertion. You cannot change your wheel, but you can switch whorls, use a different drive method, or adjust your drafting speed to compensate.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          The relationship between your drive wheel and whorl is what creates your ratio, and it sets the range of twists per inch you can realistically achieve. A wheel built for fine silk might have small whorls that make thick chunky yarn feel overtwisted and ropey. A wheel built for thick roving might have large whorls that cannot put enough twist into delicate fingering weight before the yarn breaks apart.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Experienced spinners often have wheels with different ratios, or they use variable-whorl systems and tension devices to adjust how much twist goes in. If your current wheel feels like it does not match your preferred yarn weight, swapping to a compatible whorl size or experimenting with a sliding hook can bring the ratio into the range your target yarn needs. You can also spin singles slightly thinner or thicker to naturally shift the twist amount without changing equipment.
        </p>
      </section>
    </ToolLayout>
  );
}
