import type { Metadata } from "next";
import Link from "next/link";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import WeavingSettCalculatorTool from "./WeavingSettCalculatorTool";

export const metadata: Metadata = {
  title: "Weaving Sett & EPI Calculator — Free",
  description:
    "Calculate the right sett (EPI) for your yarn and weave structure. Includes warp length, loom waste, and reed substitution. Free, no signup.",
  keywords: [
    "weaving sett calculator", "warp sett chart", "ends per inch calculator",
    "reed substitution chart", "weaving yarn calculator", "how many ends per inch for weaving",
    "warp calculator weaving", "how to calculate warp length", "rigid heddle sett guide",
    "weaving EPI calculator", "warp length calculator",
  ],
  authors: [{ name: "Jason Ramirez", url: "https://fibertools.app/about" }],
  openGraph: {
    title: "Weaving Sett & EPI Calculator — Free",
    description:
      "Calculate the right sett (EPI) for your yarn and weave structure. Includes warp length, loom waste, and reed substitution. Free, no signup.",
    url: "https://fibertools.app/weaving-sett-calculator",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Weaving Sett & EPI Calculator — Free" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Weaving Sett & EPI Calculator — Free",
    description:
      "Calculate the right sett (EPI) for your yarn and weave structure. Includes warp length, loom waste, and reed substitution. Free, no signup.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/weaving-sett-calculator" },
  other: { dateModified: "2026-05-05" },
};

export default function WeavingSettCalculatorPage() {
  return (
    <ToolLayout slug="weaving-sett-calculator" widgetFirst>
      <AnswerBlock
        what="A calculator that determines the correct sett (ends per inch) for your yarn and weave structure, with warp length, loom waste, and reed substitution."
        who="Weavers planning a new project who need to calculate how many warp ends to wind and which reed dent to use."
        bottomLine="Enter your yarn WPI and weave structure to get the recommended sett, total warp ends, and warp yardage."
        lastUpdated="2026-05-05"
      />

      <WeavingSettCalculatorTool />

      {/* ── Content sections ── */}

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          What is sett in weaving and how is it measured?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Sett is the number of warp threads per inch in a woven fabric. It&rsquo;s measured in EPI (ends per
            inch) for warp, with a corresponding PPI (picks per inch) for weft. Sett determines how dense,
            drapey, or stiff the finished fabric will be. The same yarn at 12 EPI produces a loose, drapey
            scarf; at 24 EPI it produces a stiff, structured fabric.<sup>1</sup>
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Sett interacts directly with weave structure. Plain weave (over one, under one) requires a looser
          sett than twill for a balanced fabric — the warp and weft interlace more frequently, which means
          they need more room to pass through each other without packing too tightly. Twill (over two, under
          two or similar) has fewer interlacement points per inch, allowing threads to sit closer together at
          a higher sett.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Beat weight matters as much as sett in determining final fabric density. A tightly beaten weft
          can compress an otherwise open warp into a weft-faced structure, even if the theoretical sett
          was calculated for a balanced weave. Beat pressure is partly controlled by loom type (counterbalance
          looms produce a different beat than jack looms) and partly by the weaver&rsquo;s technique.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Always weave a sample warp of 6&ndash;12 inches before committing to a full project. Sample warps
          reveal how a specific yarn-and-structure combination actually behaves at a given sett — and how
          much it changes after wet-finishing. Adjusting sett after sampling is far easier than rethreading
          an entire loom mid-project.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          How do I calculate the right sett for my yarn?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            The standard method is wraps per inch (WPI). Wrap your yarn around a ruler without overlap, count
            wraps in one inch, then divide by 2 for plain weave or use the full count for twill. Singles yarns
            wrap differently than plied &mdash; singles need a slightly looser sett. Always weave a sample
            header to verify before warping the full piece.<sup>2</sup>
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          WPI gives a starting point, not a final answer. Yarn elasticity and finishing both affect actual
          fabric sett after the cloth comes off the loom. A springy wool at 12 WPI may relax to an effective
          10 EPI after wet-finishing, while a linen at the same WPI might barely move. Published sett charts
          from Ashford, Schacht, and Handwoven magazine are reliable references for common yarns and save
          significant sampling time when working with familiar fiber types.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Finishing tightens sett by 5&ndash;10% as fibers bloom and interlock. This is especially true for
          wool: the scales on wool fibers interlock during wet-finishing and shrink the fabric both in length
          and width. Cotton and linen shrink primarily in length (warp direction) due to take-up relaxation
          rather than fiber bloom.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Sticky fibers like wool grip each other and can be sett more closely without the warp threads
          shifting during weaving. Slippery fibers like silk, bamboo, or Tencel need a slightly tighter sett
          (more threads per inch) to prevent warp threads from migrating and creating uneven spacing in the
          finished cloth.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          What is loom waste and how do I plan for it?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Loom waste is the unwoven warp yarn at both ends of the project &mdash; the portion that can&rsquo;t
            be woven because of loom geometry. Plan 18&ndash;24 inches of loom waste for floor looms,
            12&ndash;18 inches for table looms, and 8&ndash;12 inches for rigid heddle. Add this to your warp
            length calculation, plus 10% for take-up and 5&ndash;10% for shrinkage during wet-finishing.<sup>3</sup>
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Loom waste varies by loom design because the distance from heddles to cloth beam differs between
          loom types. Floor looms have longer loom waste because more warp must be tied to the front and back
          beams. Rigid heddle looms have minimal loom waste relative to warp length because the rigid heddle
          sits close to the cloth beam and the warp ties are short.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Take-up accounts for the warp length consumed by weft interlacement. As weft travels over and under
          warp threads, it forces the warp to zigzag, shortening the visible warp length by roughly 10%.
          This is separate from shrinkage — take-up happens during weaving, shrinkage happens during
          wet-finishing, and both must be added to the warp length before you begin winding.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Shrinkage varies significantly by fiber: cotton shrinks 3&ndash;5%, wool 8&ndash;10%, silk
          minimally. Pre-washing your warp yarn (or skeining and washing before warping) eliminates most
          shrinkage from the calculation for cotton and linen, where controlling final dimensions is critical
          for functional projects like towels or table runners.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          How do I substitute a different reed for my project?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Reed dent count determines how warp threads are spaced. To substitute, multiply your target EPI by
            your reed&rsquo;s dent count and divide. A 12-dent reed sleyed 2 ends per dent gives 24 EPI; the
            same EPI from a 10-dent reed needs sleying 2 ends in some dents and 3 in others (called
            skip-and-double). The calculator handles the math automatically.<sup>4</sup>
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Standard reed sizes available in modern looms are typically 6, 8, 10, 12, and 15-dent. Most weavers
          find that an 8-dent and a 12-dent reed together cover the common sett range for worsted through
          fingering weights. A 10-dent reed handles mid-range DK and sport weight setts without requiring
          skip-and-double threading in most cases.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Reed marks — subtle vertical lines visible in the finished cloth caused by uneven spacing between
          thread groups — are minimized by using even sleying patterns. Threading two ends per dent evenly
          produces fewer marks than alternating one and two per dent. If reed marks appear in a sample, try
          a different reed dent that allows more even sleying for your target EPI.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Investing in additional reeds is worthwhile once you&rsquo;re weaving regularly with a range of
          yarns. A 15-dent reed opens up lace-weight and fine cotton setts without requiring skip-and-double
          threading, which is especially useful for lace weave structures where even thread spacing is
          critical to the pattern appearance.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          How much yarn do I need for a weaving project?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Calculate warp yardage as: total warp length &times; number of warp threads. Calculate weft yardage
            as: woven length &times; picks per inch &times; project width. Add 15&ndash;20% to both for
            sampling, take-up, finishing, and waste. A 6-foot scarf at 12 EPI, 12 PPI, 8 inches wide needs
            roughly 250 yards warp and 400 yards weft.<sup>5</sup>
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Weft yardage usually exceeds warp yardage because weft travels back and forth across the full width
          of the project on every pick, plus the selvedge turn adds a small amount at each edge. For a
          balanced weave (equal EPI and PPI), weft typically uses 20&ndash;30% more yarn than warp because
          of this lateral travel plus the additional take-up from crossing over warp threads.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Warp-faced and weft-faced fabrics dramatically change the yardage ratio. A warp-faced rug uses very
          little weft (often a single thick core cord) but enormous quantities of warp yarn. A weft-faced
          tapestry uses minimal warp but hundreds of yards of weft in multiple colors. Always calculate based
          on your actual intended structure, not a generic balanced-weave estimate.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Buying extra of any singles yarn matters more in weaving than in knitting or crochet; for
          per-project yardage planning beyond weaving, the{' '}
          <Link href="/yarn-calculator" className="text-sage-600 dark:text-sage-400 underline hover:opacity-80">yarn calculator</Link>
          {' '}covers knit and crochet projects with the same coverage-factor approach. Adjacent warp
          threads sit side by side for the entire length of the project, making dye lot variation immediately
          visible as a vertical stripe. Purchase all warp yarn from the same dye lot, and if you&rsquo;re
          uncertain, err toward buying an extra skein — most yarn shops accept returns of unopened skeins.
        </p>
      </section>

      {/* ── References ── */}
      <section className="mt-12 pt-6 border-t border-bark-200 dark:border-bark-700">
        <h2 className="text-base font-semibold text-bark-700 dark:text-cream-300 mb-3">References</h2>
        <ol className="space-y-1.5 text-sm text-bark-500 dark:text-bark-400">
          <li>
            <span className="font-medium">1.</span>{" "}
            Schacht Spindle — How to Choose the Right Sett.{" "}
            <Link
              href="https://schachtspindle.com/blogs/archives/how-to-choose-the-right-sett"
              className="text-sage-600 dark:text-sage-400 underline"
              target="_blank"
              rel="nofollow noopener"
            >
              schachtspindle.com
            </Link>
          </li>
          <li>
            <span className="font-medium">2.</span>{" "}
            Schacht Spindle — Measuring and Describing Yarn (WPI Reference).{" "}
            <Link
              href="https://schachtspindle.com/blogs/faqs/measuring-and-describing-yarn"
              className="text-sage-600 dark:text-sage-400 underline"
              target="_blank"
              rel="nofollow noopener"
            >
              schachtspindle.com
            </Link>
          </li>
          <li>
            <span className="font-medium">3.</span>{" "}
            Handwoven Magazine — Minimizing Warp Waste.{" "}
            <Link
              href="https://handwovenmagazine.com/minimizing-warp-waste/"
              className="text-sage-600 dark:text-sage-400 underline"
              target="_blank"
              rel="nofollow noopener"
            >
              handwovenmagazine.com
            </Link>
          </li>
          <li>
            <span className="font-medium">4.</span>{" "}
            Schacht Spindle — Variable Dent Reeds Explained.{" "}
            <Link
              href="https://schachtspindle.com/blogs/faqs/what-is-a-variable-dent-reed-and-how-do-i-use-it"
              className="text-sage-600 dark:text-sage-400 underline"
              target="_blank"
              rel="nofollow noopener"
            >
              schachtspindle.com
            </Link>
          </li>
          <li>
            <span className="font-medium">5.</span>{" "}
            Handwoven Magazine — Calculating Yarn for Handweaving.{" "}
            <Link
              href="https://handwovenmagazine.com/calculating-yarn/"
              className="text-sage-600 dark:text-sage-400 underline"
              target="_blank"
              rel="nofollow noopener"
            >
              handwovenmagazine.com
            </Link>
          </li>
        </ol>
      </section>
    </ToolLayout>
  );
}
