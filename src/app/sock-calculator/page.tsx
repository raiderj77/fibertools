import type { Metadata } from "next";
import Link from "next/link";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import SockCalculatorTool from "./SockCalculatorTool";

export const metadata: Metadata = {
  title: "Heel Flap & Gusset Sock Calculator - Free Knitting Tool",
  description:
    "Free heel flap and gusset calculator for sock knitting. Top-down or toe-up stitch counts with short-row heel option. No signup, instant results.",
  keywords: [
    "sock calculator",
    "sock knitting calculator",
    "toe up sock calculator",
    "heel flap calculator",
    "sock stitch count",
    "top down sock calculator",
  ],
  authors: [{ name: "Jason Ramirez", url: "https://fibertools.app/about" }],
  openGraph: {
    title: "Heel Flap & Gusset Sock Calculator - Free Knitting Tool",
    description:
      "Free heel flap and gusset calculator for sock knitting. Top-down or toe-up stitch counts with short-row heel option. No signup, instant results.",
    url: "https://fibertools.app/sock-calculator",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Heel Flap & Gusset Sock Calculator - Free Knitting Tool" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Heel Flap & Gusset Sock Calculator - Free Knitting Tool",
    description:
      "Free heel flap and gusset calculator for sock knitting. Top-down or toe-up stitch counts with short-row heel option. No signup, instant results.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/sock-calculator" },
  other: { dateModified: "2026-05-05" },
};

export default function SockCalculatorPage() {
  return (
    <ToolLayout slug="sock-calculator" widgetFirst>
      <AnswerBlock
        what="A sock calculator that provides stitch counts for top-down or toe-up construction with heel flap, gusset, and short-row heel instructions."
        who="Sock knitters who need accurate stitch counts for any foot size and want shaping instructions for their preferred heel style."
        bottomLine="Enter your foot measurements and gauge to get a complete sock blueprint including heel and toe shaping."
        lastUpdated="2026-05-05"
      />

      <SockCalculatorTool />

      {/* ── Content sections ── */}

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          How do I calculate sock cast-on stitches?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Multiply your foot circumference (in inches) by your stitch gauge per inch, then subtract 10% for
            negative ease. Round to a multiple of 4 for top-down ribbing or your stitch pattern repeat. A 9-inch
            foot at 8 sts/inch = 72 stitches, minus 10% = 65, rounded to 64.<sup>1</sup>
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Negative ease is essential for socks — a sock knit to your exact foot measurement will slide down,
          bunch inside your shoe, and wear out faster at pressure points. The 10% reduction means the knit
          fabric is constantly under slight tension, which holds the sock in place and extends its life.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Measure circumference at the ball of the foot — the widest point across the knuckles of the toes —
          not at the ankle. The ankle is narrower and will underestimate the cast-on needed for the foot tube.
          If your measurements straddle two sizes, round up for a more comfortable fit.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Cast-on multiples also affect ribbing. K2P2 ribbing requires a multiple of 4; K3P3 requires a
          multiple of 6; K1P1 works on any even number. If your gauge-based cast-on doesn&rsquo;t hit the
          right multiple, rounding up or down by a few stitches is standard practice and has negligible impact
          on fit.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          Top-down vs toe-up: which sock construction is better?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Top-down socks cast on at the cuff and work down to the toe with a heel flap and gusset midway.
            Toe-up starts at the toe with an increase round, works up the foot, and uses a short-row heel.
            Top-down has a more durable heel; toe-up lets you stop when you run out of yarn.<sup>2</sup>
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Yardage management is the primary toe-up advantage. Since you work up from the toe, you can knit the
          leg until your skein runs low and simply bind off — no guessing how much yarn to reserve for the
          heel. With top-down construction you must estimate your midpoint before starting or risk running out
          before finishing the toe.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Heel durability favors top-down. The heel flap uses a reinforced slip-stitch pattern — alternating
          slipped stitches create a double-thickness fabric at the high-wear point. Short-row heels (the
          standard for toe-up) are faster but produce a thinner, less reinforced heel turn.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          New sock knitters often find top-down easier to learn because the pattern library is larger and most
          YouTube tutorials use cuff-down construction. Once you understand the heel flap and gusset logic,
          the rest of the sock is straightforward knitting in the round.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          What gauge should sock yarn knit at?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Standard sock yarn (fingering / CYC 1) typically knits at 7&ndash;9 stitches per inch on US 1 (2.25mm)
            or US 2 (2.75mm) needles. Tight gauge produces durable socks; loose gauge makes faster but less
            durable socks. Always swatch on the needles you&rsquo;ll use in the round, not flat.<sup>3</sup>
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Round vs flat gauge is a meaningful difference for socks. Most knitters pull slightly tighter when
          purling than when knitting, so flat stockinette swatches often run half a stitch looser per inch
          than circular knitting on the same needles. Since socks are knit entirely in the round, a circular
          swatch gives a more accurate starting point.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Needle material affects gauge for many knitters. Metal needles (stainless steel or nickel-plated
          brass) typically produce a tighter, more even fabric than wood or bamboo because yarn slides more
          freely. If you&rsquo;re switching needle material, swatch first — you may need to adjust needle
          size by one step.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Going down a needle size from the yarn label recommendation is common for sock knitting. A denser
          fabric holds up better at the heel and ball of foot where abrasion is highest. If the label says
          US 2&ndash;3, try US 1 for socks you intend to wear regularly rather than display. If you need to
          calculate cast-on stitches for a different project, the{' '}
          <Link href="/cast-on-calculator" className="text-sage-600 dark:text-sage-400 underline hover:opacity-80">cast-on calculator</Link>
          {' '}uses the same gauge math.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          How do I knit a heel flap and gusset?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            After working the leg, divide stitches in half. Work back and forth on half the stitches for the
            heel flap (typically 30&ndash;40 rows of slip-stitch pattern). Turn the heel with short rows. Pick up
            stitches along the heel flap edges to form the gusset, then decrease back to original sock
            circumference for the foot.<sup>4</sup>
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          The slip-stitch heel flap pattern — slip 1 purlwise, knit 1 across on right-side rows, purl back
          on wrong-side rows — doubles the fabric thickness at the heel. Each slipped stitch spans two rows,
          creating a dense, reinforced fabric at the highest-wear point of the sock. This is why heel flap
          socks outlast short-row heel socks in everyday wear.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Gusset pickup count is typically half the heel flap row count, plus 2&ndash;3 stitches at each corner
          where the flap meets the instep. Picking up an extra stitch or two at the corners prevents holes
          at the gusset join. The calculator uses half the heel flap row count as the base; adding 1&ndash;2
          extra stitches at each corner is good practice.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Gusset decreases work on alternating rounds rather than every round to create a gradual taper that
          lies flat. Decreasing every round produces a sharper angle that can pull the sock fabric and make
          the gusset feel tight across the instep. Most patterns specify k2tog at the end of the gusset
          stitches and ssk at the beginning on every other round.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          How much yarn do I need for a pair of socks?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Adult socks typically need 350&ndash;450 yards of fingering-weight yarn for a pair. Heavy patterns
            (cables, colorwork) push that to 500&ndash;550 yards. Children&rsquo;s socks need 200&ndash;300 yards. A
            standard 100g skein of sock yarn (400&ndash;450 yards) is enough for one pair of adult socks with
            minimal leftover.<sup>5</sup>
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Most sock yarn is sold in 100g skeins precisely because that matches the average adult pair
          yardage. The 400&ndash;450 yard range is a standard that yarn manufacturers and pattern designers
          work around together — it&rsquo;s not a coincidence that most sock patterns are written for a single
          skein.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Shoe size affects yardage more than most knitters expect. Men&rsquo;s size 10&ndash;12 socks typically
          need 50&ndash;75 more yards than women&rsquo;s size 7&ndash;9 socks — longer foot length and wider
          circumference both add rows. If you&rsquo;re knitting for someone with large feet, 450&ndash;500 yards
          is a safer target than the standard estimate.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Buy two skeins for cabled or stranded colorwork sock patterns even if the yardage estimate says
          one skein is enough. Cables consume 20&ndash;30% more yarn per inch than stockinette due to the
          crossings; colorwork with two colors running throughout roughly doubles yardage for each round
          worked. Running out mid-sock and finding your dye lot is discontinued is a common — and avoidable
          — frustration.
        </p>
      </section>

      {/* ── References ── */}
      <section className="mt-12 pt-6 border-t border-bark-200 dark:border-bark-700">
        <h2 className="text-base font-semibold text-bark-700 dark:text-cream-300 mb-3">References</h2>
        <ol className="space-y-1.5 text-sm text-bark-500 dark:text-bark-400">
          <li>
            <span className="font-medium">1.</span>{" "}
            Craft Yarn Council — Standard Yarn Weight System.{" "}
            <Link
              href="https://www.craftyarncouncil.com/standards/yarn-weight"
              className="text-sage-600 dark:text-sage-400 underline"
              target="_blank"
              rel="nofollow noopener"
            >
              craftyarncouncil.com
            </Link>
          </li>
          <li>
            <span className="font-medium">2.</span>{" "}
            Ravelry — Sock pattern database.{" "}
            <Link
              href="https://www.ravelry.com/patterns/search#craft=knitting&pc=socks"
              className="text-sage-600 dark:text-sage-400 underline"
              target="_blank"
              rel="nofollow noopener"
            >
              ravelry.com
            </Link>
          </li>
          <li>
            <span className="font-medium">3.</span>{" "}
            Craft Yarn Council — Needle and Hook Size Chart.{" "}
            <Link
              href="https://www.craftyarncouncil.com/standards/needle-hook-chart"
              className="text-sage-600 dark:text-sage-400 underline"
              target="_blank"
              rel="nofollow noopener"
            >
              craftyarncouncil.com
            </Link>
          </li>
          <li>
            <span className="font-medium">4.</span>{" "}
            Interweave Knits — Sock Construction Reference.{" "}
            <Link
              href="https://www.interweave.com/article/knitting/sock-knitting-101"
              className="text-sage-600 dark:text-sage-400 underline"
              target="_blank"
              rel="nofollow noopener"
            >
              interweave.com
            </Link>
          </li>
          <li>
            <span className="font-medium">5.</span>{" "}
            Yarnspirations — Sock Yarn Buying Guide.{" "}
            <Link
              href="https://www.yarnspirations.com/blogs/ideas-and-inspiration"
              className="text-sage-600 dark:text-sage-400 underline"
              target="_blank"
              rel="nofollow noopener"
            >
              yarnspirations.com
            </Link>
          </li>
        </ol>
      </section>
    </ToolLayout>
  );
}
