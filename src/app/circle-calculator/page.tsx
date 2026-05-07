import type { Metadata } from "next";
import Link from "next/link";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import CircleCalculatorTool from "./CircleCalculatorTool";

export const metadata: Metadata = {
  title: "Crochet Circle Pattern Generator - Free Increase Calculator",
  description:
    "Generate flat circle crochet patterns for any stitch. Round-by-round increase instructions with staggered placement. Free, no signup, instant.",
  keywords: [
    "crochet circle pattern",
    "perfect circle crochet",
    "crochet circle calculator",
    "flat circle crochet",
    "crochet circle increase pattern",
    "how to crochet a flat circle",
    "crochet circle formula",
    "magic ring circle pattern",
    "crochet round pattern generator",
    "crochet circle increases per round",
    "single crochet circle pattern",
    "double crochet circle pattern",
    "crochet hat crown calculator",
    "crochet circle instructions",
    "flat circle increase calculator",
  ],
  authors: [{ name: "Jason Ramirez", url: "https://fibertools.app/about" }],
  openGraph: {
    title: "Crochet Circle Pattern Generator - Free Increase Calculator",
    description:
      "Generate flat circle crochet patterns for any stitch. Round-by-round increase instructions with staggered placement. Free, no signup, instant.",
    url: "https://fibertools.app/circle-calculator",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Crochet Circle Pattern Generator - Free Increase Calculator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crochet Circle Pattern Generator - Free Increase Calculator",
    description:
      "Generate flat circle crochet patterns for any stitch. Round-by-round increase instructions with staggered placement. Free, no signup, instant.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/circle-calculator" },
  other: { dateModified: "2026-05-05" },
};

export default function CircleCalculatorPage() {
  return (
    <ToolLayout slug="circle-calculator" widgetFirst>
      <AnswerBlock
        what="A pattern generator that creates round-by-round increase instructions for flat crochet circles in any stitch type with staggered placement."
        who="Crocheters making hats, rugs, mandalas, or any project that starts with a flat circle and needs even increases."
        bottomLine="Choose your stitch type and number of rounds to get a complete flat circle pattern with no curling or ruffling."
        lastUpdated="2026-05-05"
      />

      <CircleCalculatorTool />

      {/* ── Content sections ── */}

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          How does the flat circle increase rule work?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            A flat crochet circle requires a fixed number of increases per round to stay flat. Single crochet
            starts with 6 stitches and adds 6 per round. Half double crochet starts with 8 and adds 8. Double
            crochet starts with 12 and adds 12. Treble starts with 16 and adds 16. Each stitch height has its
            own increase count because taller stitches cover more circumference.<sup>1</sup>
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          The increase count equals the starting stitch count because of the geometry of a flat disk. Each
          subsequent round sits at a larger radius, and the circumference grows proportionally. To stay flat,
          every round must add the same number of stitches as the first round — the amount needed to cover
          the additional arc at each ring&rsquo;s edge.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Stitch height changes the increase count because taller stitches occupy more arc length per stitch.
          A double crochet is roughly twice the height of a single crochet, so it takes twice as many increases
          per round to cover the same growth in circumference. This is why switching stitch type mid-circle
          without adjusting increases produces distortion.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Too few increases and the circle pulls inward, forming a bowl or cup shape. Too many increases and
          the extra fabric has nowhere to go, so it folds and waves — the ruffling effect. The correct increase
          count keeps the circle lying flat under normal tension with your specific hook and yarn combination.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          Why is my crochet circle turning into a hexagon?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Hexagon shaping happens when increases stack directly on top of each other every round. The corners
            of the hexagon form where the increases pile up. Stagger your increases by working them in different
            positions each round — the calculator above generates a staggered placement pattern that produces a
            true round circle instead.<sup>2</sup>
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          When an increase sits directly above the increase from the previous round, the two extra stitches
          form a visible corner. With 6 increases per round, those 6 corners produce a hexagon. With 8, you
          get an octagon. The staggered formula shifts the increase position by one stitch each round, so the
          corners never have a chance to build on each other and the edge stays smooth.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          The standard stagger alternates between two placement patterns: round N places the increase before
          the plain stitches, round N+1 places it after. This simple alternation distributes increases evenly
          around the circumference and is the basis for all round circle patterns in commercial crochet
          publications.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Some patterns intentionally stack increases to create hexagonal motifs — this is the basis for
          hexagonal mandalas and traditional granny-square-adjacent motifs. If you want a hexagon, work
          increases directly above prior-round increases every round. If you want a circle, always stagger.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          How do I make a crochet bowl or hat crown?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            To intentionally cup a flat circle into a bowl or hat crown, decrease the number of increases per
            round. After the desired flat diameter, work plain rounds with no increases — the circle will start
            curving downward. Hat crowns typically work 6&ndash;8 increase rounds, then transition to plain rounds
            at the desired head size.<sup>3</sup>
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Standard hat crown construction uses the flat circle pattern until the diameter reaches approximately
          one-third of the target head circumference, then stops increasing. For an adult head (22 inches
          circumference), that means working a flat circle to about 7 inches across before switching to plain
          rounds. The hat sides then grow straight down at that circumference.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Bowl depth is controlled by when you stop increasing relative to the base diameter. A gradual
          transition (reducing increases slowly over several rounds) creates a shallow, wide bowl. An abrupt
          stop (going directly from full increases to none) creates a tighter, rounder curve. Most crochet
          bowl patterns use the abrupt method for a clean shoulder. For sphere and cone construction
          specifically, the{' '}
          <Link href="/amigurumi-shapes" className="text-sage-600 dark:text-sage-400 underline hover:opacity-80">amigurumi shapes calculator</Link>
          {' '}generates round-by-round patterns for both.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          This curvature principle is also the basis for amigurumi sphere shapes. Work a flat circle to the
          widest point, then decrease by the same count per round until closed. The two halves mirror each
          other: the increase section and the decrease section produce a symmetrical sphere when stuffed.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          What size circle can I make?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Circle diameter depends on yarn weight, hook size, and round count. A 10-round single crochet
            circle in worsted weight (US H / 5mm hook) measures roughly 6 inches across. Each additional round
            adds approximately 0.5&ndash;0.75 inches to the diameter, depending on stitch height. The calculator
            generates patterns up to 30 rounds — large enough for blanket-sized circles.<sup>4</sup>
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Project scale varies widely. Coasters and trivets need 3&ndash;5 rounds in worsted weight. A hat crown
          needs 6&ndash;8 rounds. Decorative mandalas and placemats run 12&ndash;18 rounds. Round rugs and large
          blanket circles need 25&ndash;30 rounds in bulky or super bulky yarn. Taller stitches (dc, tr) produce
          larger circles in the same round count because each stitch is physically taller.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Diameter growth slows as rounds increase — not in stitch count, but visually. Each additional round
          adds the same number of stitches, but those stitches are spread across a larger circumference, so
          the visual width increase per round shrinks slightly as the circle grows. This is why early rounds
          look dramatic and later rounds look smaller in comparison.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          To estimate diameter before starting, work a gauge swatch and measure your row height. Multiply
          stitch height by round count by 2 for the diameter (since diameter crosses the center twice).
          Add roughly 10% for the join and slip stitch at the end of each round. This gives a reasonable
          estimate before committing to the full project.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          Magic ring vs chain-2 starting method?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            The magic ring (adjustable ring) creates a tight closed center that can be pulled completely closed,
            eliminating the visible hole at the center of the circle. Chain-2 and join produces a small visible
            hole. Use magic ring for amigurumi, hat crowns, and any project where center hole closure matters.
            Chain-2 is acceptable for openwork doilies and projects where the hole is decorative.<sup>5</sup>
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          The magic ring works by forming a slip loop around your fingers, working the first round of stitches
          into that loop, then pulling the yarn tail to tighten the loop completely closed. The key step most
          beginners miss is anchoring the ring with a slip stitch before pulling the tail — without it, the
          ring can loosen as you work subsequent rounds.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Magic ring is harder for beginners because the loop wants to slip loose before you have enough
          stitches to hold it in place. If you find the magic ring unreliable, the chain-3-and-join method
          (chain 3, slip stitch to form a ring, work first round into the ring) is more stable and leaves
          only a tiny hole that can be sewn closed with the yarn tail.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          For very fine yarn (fingering or lace weight), neither method closes completely without a visible
          hole due to the thin yarn. In those cases, sewing the center closed with a tapestry needle after
          finishing gives the neatest result. For bulky yarn, the magic ring almost always closes cleanly
          because the thick yarn fills the gap.
        </p>
      </section>

      {/* ── References ── */}
      <section className="mt-12 pt-6 border-t border-bark-200 dark:border-bark-700">
        <h2 className="text-base font-semibold text-bark-700 dark:text-cream-300 mb-3">References</h2>
        <ol className="space-y-1.5 text-sm text-bark-500 dark:text-bark-400">
          <li>
            <span className="font-medium">1.</span>{" "}
            Craft Yarn Council — Stitch Symbols and Standards.{" "}
            <Link
              href="https://www.craftyarncouncil.com/standards/stitch-symbols"
              className="text-sage-600 dark:text-sage-400 underline"
              target="_blank"
              rel="nofollow noopener"
            >
              craftyarncouncil.com
            </Link>
          </li>
          <li>
            <span className="font-medium">2.</span>{" "}
            Edie Eckman — Around the Corner Crochet Borders (geometry reference).{" "}
            <Link
              href="https://www.edieeckman.com/around-the-corner"
              className="text-sage-600 dark:text-sage-400 underline"
              target="_blank"
              rel="nofollow noopener"
            >
              edieeckman.com
            </Link>
          </li>
          <li>
            <span className="font-medium">3.</span>{" "}
            Craft Yarn Council — Hat Sizing Standards.{" "}
            <Link
              href="https://www.craftyarncouncil.com/standards/hat-sizing"
              className="text-sage-600 dark:text-sage-400 underline"
              target="_blank"
              rel="nofollow noopener"
            >
              craftyarncouncil.com
            </Link>
          </li>
          <li>
            <span className="font-medium">4.</span>{" "}
            Ravelry — Crochet circle pattern database.{" "}
            <Link
              href="https://www.ravelry.com/patterns/search#craft=crochet&pc=circle"
              className="text-sage-600 dark:text-sage-400 underline"
              target="_blank"
              rel="nofollow noopener"
            >
              ravelry.com
            </Link>
          </li>
          <li>
            <span className="font-medium">5.</span>{" "}
            Yarnspirations — Crochet Magic Ring Tutorial.{" "}
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
