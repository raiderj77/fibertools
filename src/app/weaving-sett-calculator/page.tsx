import type { Metadata } from "next";
import Link from "next/link";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import WeavingSettCalculatorTool from "./WeavingSettCalculatorTool";

export const metadata: Metadata = {
  title: "Weaving Sett & EPI Calculator, Free",
  description:
    "Estimate a starting sett and warp allowance, or generate exact bounded reed-sleying arithmetic. Sample before committing yarn. Free, no signup.",
  keywords: [
    "weaving sett calculator", "warp sett chart", "ends per inch calculator",
    "reed substitution chart", "weaving yarn calculator", "how many ends per inch for weaving",
    "warp calculator weaving", "how to calculate warp length", "rigid heddle sett guide",
    "weaving EPI calculator", "warp length calculator",
  ],
  authors: [{ name: "Jason Ramirez", url: "https://fibertools.app/about" }],
  openGraph: {
    title: "Weaving Sett & EPI Calculator, Free",
    description:
      "Estimate a starting sett and warp allowance, or generate exact bounded reed-sleying arithmetic. Sample before committing yarn.",
    url: "https://fibertools.app/weaving-sett-calculator",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Weaving Sett & EPI Calculator, Free" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Weaving Sett & EPI Calculator, Free",
    description:
      "Estimate a starting sett and warp allowance, or generate exact bounded reed-sleying arithmetic. Sample before committing yarn.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/weaving-sett-calculator" },
  other: { dateModified: "2026-08-29" },
};

export default function WeavingSettCalculatorPage() {
  return (
    <ToolLayout slug="weaving-sett-calculator" widgetFirst>
      <AnswerBlock
        what="A bounded planning calculator for a WPI-based starting sett, provisional warp quantities, and exact whole-number reed-sleying arithmetic."
        who="Weavers comparing a measured yarn and structure or checking whether a supported reed can produce a target whole-number EPI."
        bottomLine="Use every output as a starting estimate and weave a wet-finished sample. Exact sleying arithmetic does not prove that the yarn fits the reed or that reed marks will disappear."
        lastUpdated="2026-08-29"
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
            inch) for warp, with a corresponding PPI (picks per inch) for weft. Sett influences fabric
            density and hand, but yarn, beat, structure, and finishing also affect the result.<sup>1</sup>
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Sett interacts directly with weave structure. Plain weave (over one, under one) requires a looser
          sett than twill for a balanced fabric: the warp and weft interlace more frequently and need more
          room. Twill has fewer interlacement points, so a somewhat closer starting sett may be appropriate,
          but the useful value depends on the draft&apos;s float lengths and the desired fabric hand.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Beat weight matters as much as sett in determining final fabric density. A tightly beaten weft
          can compress an otherwise open warp into a weft-faced structure, even if the theoretical sett
          was calculated for a balanced weave. Beat pressure is partly controlled by loom type (counterbalance
          looms produce a different beat than jack looms) and partly by the weaver&rsquo;s technique.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Always weave a sample warp of 6&ndash;12 inches before committing to a full project. Sample warps
          reveal how a specific yarn-and-structure combination actually behaves at a given sett, and how
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
            wraps in one inch. Half the measured WPI is a common starting point for a balanced plain weave.
            Twill is usually sett somewhat closer, but there is no rule to use the full WPI; float length,
            yarn, and desired hand matter. Always weave and wet-finish a sample before warping the full
            piece.<sup>2</sup>
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          WPI gives a starting point, not a final answer. Selecting a yarn-weight range in this calculator
          uses that range&apos;s midpoint; enter a measured WPI when available. Yarn elasticity and finishing affect actual
          fabric sett after the cloth comes off the loom. A springy wool at 12 WPI may relax to an effective
          10 EPI after wet-finishing, while a linen at the same WPI might barely move. Published sett charts
          from loom and weaving publishers can provide comparison points, but they do not replace sampling
          the actual yarn and draft.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          The supported plain-weave and 2/2-twill choices use the starting formula WPI &times; warp threads
          in one repeat &divide; (interlacements plus warp threads). Other drafts require their actual repeat
          counts and are not assigned a universal factor here.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          The calculator does not infer finishing change from a fiber label. Enter a length allowance based
          on your own sampling if you use the warp worksheet, and compensate for width change separately.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Yarn construction, twist, elasticity, abrasion, beat, loom setup, and finishing can all change a
          workable sett. Record those variables with the sample rather than treating WPI as a complete yarn description.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          What is loom waste and how do I plan for it?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Loom waste is the entered length reserved for warp that will not become the planned woven area.
            Measure or confirm it for the actual loom, tie-on method, and project rather than relying on a universal preset.<sup>3</sup>
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          The worksheet adds the loom-waste and sampling lengths you enter to the entered project length.
          Switching inches and centimeters converts those existing values so their physical meaning does not change.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          The optional length allowance is one explicit percentage applied only to the entered project length.
          If you intend it to cover both take-up and finishing change, derive the combined value from a representative sample.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Width change is not modeled, and the tool does not predict finished dimensions. Enter the width at
          which you want to calculate warp ends, then verify both axes after weaving and wet-finishing a sample.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          How do I substitute a different reed for my project?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Reed dent count determines how warp ends are grouped. The calculator reduces target EPI and reed
            dent by their greatest common divisor, then distributes the required ends across that shortest
            repeating dent sequence. For 8 EPI in a 12-dent reed, repeat skip, 1 end, 1 end across 3 dents:
            2 ends per 3 dents repeated four times equals exactly 8 EPI.<sup>4</sup>
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          This calculator supports 6-, 8-, 10-, 12-, 15-, 16-, and 20-dent reeds and whole-number targets
          from 1 through 120 EPI. It returns one exact repeating arithmetic sequence. Whether that sequence
          is practical depends on yarn diameter, abrasion, the reed, and how irregular groups behave after
          wet-finishing.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Reed marks, subtle vertical lines visible in the finished cloth caused by uneven spacing between
          thread groups, are minimized by using even sleying patterns. Threading two ends per dent evenly
          produces fewer marks than alternating one and two per dent. If reed marks appear in a sample, try
          a different reed dent that allows more even sleying for your target EPI.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          A reed that allows the same number of ends in every dent gives the most even spacing, but an exact
          irregular sequence can still leave visible reed marks. Sample the proposed sleying before deciding
          whether a different reed is useful for the yarn and project.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          How much yarn do I need for a weaving project?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Calculate warp yardage as: total warp length &times; number of warp threads. Calculate weft yardage
            as: woven length &times; picks per inch &times; project width. Before allowances, a 6-foot by
            8-inch scarf at 12 EPI and 12 PPI uses about 192 yards in each direction. Add project-specific
            loom waste, sampling, take-up, finishing, and contingency based on your loom and sample.<sup>5</sup>
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          For a balanced rectangle with equal EPI and PPI, the unadjusted warp and weft yardages are similar.
          Actual totals diverge because warp includes loom waste and tie-on allowances while weft includes
          selvedge turns and take-up. The calculator&apos;s weft value uses a provisional 10% allowance; replace
          it with evidence from the loom and a woven sample.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Warp-faced and weft-faced fabrics dramatically change the yardage ratio. A warp-faced rug uses very
          little weft (often a single thick core cord) but enormous quantities of warp yarn. A weft-faced
          tapestry uses minimal warp but hundreds of yards of weft in multiple colors. Always calculate based
          on your actual intended structure, not a generic balanced-weave estimate.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          For per-project yardage planning beyond weaving, use a method that accounts for the construction you are making. The{' '}
          <Link href="/yarn-calculator" className="text-sage-600 dark:text-sage-400 underline hover:opacity-80">yarn calculator</Link>
          {' '}only scales measured knit or crochet swatch use to a flat rectangle; it does not calculate warp or weft.
          Compare the estimate with the actual draft, sample, yarn put-up, dye-lot needs, and the retailer&rsquo;s
          current return policy before deciding how much to purchase.
        </p>
      </section>

      {/* ── References ── */}
      <section className="mt-12 pt-6 border-t border-bark-200 dark:border-bark-700">
        <h2 className="text-base font-semibold text-bark-700 dark:text-cream-300 mb-3">References</h2>
        <ol className="space-y-1.5 text-sm text-bark-500 dark:text-bark-400">
          <li>
            <span className="font-medium">1.</span>{" "}
            Schacht Spindle, How to Choose the Right Sett.{" "}
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
            Ashford Wheels and Looms, Let&rsquo;s Talk About Setts.{" "}
            <Link
              href="https://www.ashford.co.nz/lets-talk-about-setts-2/"
              className="text-sage-600 dark:text-sage-400 underline"
              target="_blank"
              rel="nofollow noopener"
            >
              ashford.co.nz
            </Link>
          </li>
          <li>
            <span className="font-medium">3.</span>{" "}
            Handwoven Magazine, Minimizing Warp Waste.{" "}
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
            Schacht Spindle Company, Reed Substitution Chart.{" "}
            <Link
              href="https://schachtspindle.com/pages/reed-substitution-chart"
              className="text-sage-600 dark:text-sage-400 underline"
              target="_blank"
              rel="nofollow noopener"
            >
              schachtspindle.com
            </Link>
          </li>
          <li>
            <span className="font-medium">5.</span>{" "}
            Handwoven Magazine, Calculating Yarn for Handweaving.{" "}
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
