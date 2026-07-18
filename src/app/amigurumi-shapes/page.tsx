import type { Metadata } from "next";
import Link from "next/link";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import AmigurumiShapesTool from "./AmigurumiShapesTool";

export const metadata: Metadata = {
  title: "Crochet Sphere Calculator - Amigurumi Shapes Generator",
  description:
    "Calculate increases and decreases for crochet spheres, cones, cylinders, and ovals. Free amigurumi shape calculator with round-by-round patterns.",
  keywords: [
    "amigurumi shapes",
    "crochet sphere pattern",
    "amigurumi ball pattern",
    "crochet cone shape",
    "crochet cylinder pattern",
    "amigurumi basic shapes",
    "crochet 3d shapes",
    "amigurumi increase pattern",
    "amigurumi decrease pattern",
    "crochet oval pattern",
    "amigurumi body shapes",
    "crochet sphere calculator",
    "amigurumi tutorial shapes",
    "crochet round shapes",
    "amigurumi pattern generator",
  ],
  authors: [{ name: "Jason Ramirez", url: "https://fibertools.app/about" }],
  openGraph: {
    title: "Crochet Sphere Calculator - Amigurumi Shapes Generator",
    description:
      "Calculate increases and decreases for crochet spheres, cones, cylinders, and ovals. Free amigurumi shape calculator with round-by-round patterns.",
    url: "https://fibertools.app/amigurumi-shapes",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Crochet Sphere Calculator - Amigurumi Shapes Generator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crochet Sphere Calculator - Amigurumi Shapes Generator",
    description:
      "Calculate increases and decreases for crochet spheres, cones, cylinders, and ovals. Free amigurumi shape calculator with round-by-round patterns.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/amigurumi-shapes" },
  other: { dateModified: "2026-05-05" },
};

export default function AmigurumiShapesPage() {
  return (
    <ToolLayout slug="amigurumi-shapes" widgetFirst>
      <AnswerBlock
        what="A calculator that generates round-by-round increase and decrease instructions for crochet spheres, cones, cylinders, and ovals."
        who="Amigurumi makers who need custom shape patterns without guessing at stitch counts for each round."
        bottomLine="Select your shape, enter your starting stitch count, and get a complete round-by-round pattern instantly."
        lastUpdated="2026-05-05"
      />

      <aside className="mb-6 rounded-xl border border-plum-200 bg-plum-50 p-4 text-[15px] leading-relaxed text-bark-700 dark:border-plum-800 dark:bg-plum-950/30 dark:text-cream-300">
        Already have an amigurumi pattern? Use the free{" "}
        <Link href="/amigurumi-pattern-checker" className="font-semibold text-plum-700 underline dark:text-plum-300">
          StitchProof pattern checker
        </Link>{" "}
        to verify supported round math and written stitch totals before you start crocheting.
      </aside>

      <AmigurumiShapesTool />

      {/* ── Content sections ── */}

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          How do you crochet a sphere shape?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            A crochet sphere is two flat circles joined at their widest point. Start with 6 single crochet in
            a magic ring, increase by 6 stitches per round until reaching the equator (the widest round), work
            plain rounds for the middle, then mirror the increase pattern as decreases to close the bottom. The
            number of increase rounds equals the number of decrease rounds for a true sphere.<sup>1</sup>
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          The magic ring is essential for spheres because it closes the center hole completely. With a chain-2
          start, the top and bottom of the sphere have a small visible hole, acceptable for most shapes but
          noticeable on sphere tops where the poles are prominent. Pull the magic ring tail firmly before
          continuing to the second round to lock it closed. The{' '}
          <Link href="/circle-calculator" className="text-sage-600 dark:text-sage-400 underline hover:opacity-80">flat circle calculator</Link>
          {' '}generates the increase pattern for either half independently if you want to vary stitch types.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          The equator round count determines sphere diameter predictably. Each additional increase round before
          the equator adds approximately 0.5&ndash;0.75 inches to the finished diameter in worsted weight yarn.
          An 8-round sphere (widest point = 48 stitches) measures roughly 3&ndash;4 inches across; a 12-round
          sphere measures 5&ndash;6 inches. Scaling is consistent enough to plan without swatching.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Half double or double crochet can replace single crochet in a sphere, but the result is looser and
          less suitable for amigurumi. The taller stitches produce a less dense fabric, and stuffing becomes
          visible between stitches. Single crochet worked tightly on a smaller hook is the standard for
          amigurumi precisely because it creates fabric dense enough to hide the polyfill inside.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          What hook size should I use for amigurumi?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Use a hook one to two sizes smaller than the yarn label recommends. For worsted weight yarn (CYC 4)
            labeled for a US H/8 (5mm) hook, drop to a US G/6 (4mm) or US 7 (4.5mm) for amigurumi. Tighter
            fabric prevents stuffing from showing through and gives the finished piece structure.<sup>2</sup>
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Looser amigurumi shows its stuffing between stitches and loses structural shape over time, the
          polyfill migrates to the lowest point and the piece goes lopsided. A tight fabric keeps stuffing
          evenly distributed and maintains the geometric shape the pattern intends. The quick test: try to
          push a fingertip through the fabric. It should resist firmly without the stitches visibly spreading.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Cotton yarn typically requires going down two sizes rather than one. Cotton has no natural elasticity,
          so the stitches don&rsquo;t compress the way wool or acrylic do. A cotton worsted labeled for US H
          (5mm) usually needs a US F (3.75mm) or US 6 (4mm) for amigurumi density. Gauge swatching is
          especially important when switching fiber types.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Finger fatigue is the practical cost of going smaller. Working tightly on a small hook for several
          hours causes hand strain faster than normal gauge work. Taking breaks every 30&ndash;45 minutes, using
          an ergonomic hook grip, and keeping the yarn tension controlled rather than yanked all reduce strain
          over long amigurumi sessions.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          What does sc2tog mean and how do I close my amigurumi?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Sc2tog (single crochet two together) is the standard amigurumi decrease, insert hook into next
            stitch, pull up loop, insert into following stitch, pull up loop, yarn over and pull through all
            three loops. For invisible decreases, work into front loops only of both stitches. Close the final
            round with a yarn needle by weaving through the front loops and pulling tight.<sup>3</sup>
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          The invisible decrease (front-loop-only sc2tog) produces a noticeably cleaner finish on faces and
          any surface that will be prominently visible. Standard sc2tog creates a small bump where the decrease
          sits; the invisible method keeps the decrease surface flat. For the back of a head or the base of a
          body where it won&rsquo;t be seen, standard sc2tog is faster and equally functional.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          The cinch-close technique for the final round gives a neater result than slip-stitch joining. After
          the last decrease round leaves 6 stitches, cut yarn leaving a 6-inch tail. Thread onto a tapestry
          needle and slip through the front loops of each remaining stitch without pulling through. After all
          6 stitches, pull the tail firmly to cinch the hole closed, then weave through several interior
          stitches to lock it.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Amigurumi finishing shows on every completed piece because the closure sits at a visible point, typically the bottom of a sphere or the tip of a cone. A clean closure makes the piece look
          professionally finished; a sloppy one draws the eye even if every other stitch is perfect. The
          extra 30 seconds spent on a neat cinch-close is worth it.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          Why won&rsquo;t my amigurumi sphere look round?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            An off-shape sphere usually means uneven increase distribution, mismatched increase and decrease
            counts, or skipping the equator plain rounds. Check that your increase rounds and decrease rounds
            use the same staggered pattern, and verify the decrease count exactly matches the increase count.
            Plain rounds at the equator add structural roundness, don&rsquo;t skip them on small spheres.<sup>4</sup>
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Egg shapes result from too many plain equator rounds, the sphere elongates in the direction of
          work. A pointed top comes from stacking increases rather than staggering them, creating a hexagonal
          peak instead of a smooth curve. Wobbly or inconsistent shape usually traces back to tension changes
          between rounds, particularly if you work some rounds tighter when tired.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Stuffing technique affects final shape more than most makers expect. Overstuffing distorts the
          sphere by pressing outward unevenly at the widest point, creating a bulging equator. Understuffing
          allows the sphere to collapse and sag. Fill firmly enough that the sphere holds shape when held
          by the top, but not so firmly that stitches stretch visibly apart.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Stitch markers prevent round-counting errors that throw off the increase-decrease symmetry. Missing
          a round during the decrease section, the most common mistake, produces a flat-bottomed sphere
          instead of a closed ball. A simple split-ring marker in the first stitch of each round takes 2
          seconds to move and eliminates the most common source of amigurumi shape problems.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          How do I make bigger amigurumi shapes?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Scale up amigurumi by adding more increase rounds before the equator. Each additional increase
            round adds 6 stitches (for sphere / sc-based shapes) and roughly 0.5&ndash;0.75 inches to the
            finished diameter. The calculator handles up to 30 rounds, sufficient for shapes 6&ndash;8 inches
            across. For larger pieces, also size up to bulky yarn rather than only adding rounds.<sup>5</sup>
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Adding rounds alone has diminishing visual returns because each round adds the same number of
          stitches to an ever-larger circumference. The diameter growth per round slows slightly as the
          sphere grows. Going from 6 to 7 increase rounds adds more diameter proportionally than going from
          20 to 21 increase rounds, even though both add the same 6 stitches.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Sizing up yarn weight is the faster route to large amigurumi. A 12-round sphere in worsted weight
          takes significantly longer than the same shape in bulky (CYC 5) or super bulky (CYC 6) yarn. The
          stitch geometry is identical, just scale the hook size to match. A bulky-yarn sphere at 8 rounds
          can match the diameter of a worsted-yarn sphere at 12+ rounds.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Stuffing volume scales cubically with diameter, not linearly. A sphere twice as wide needs roughly
          8 times the stuffing to fill properly. Plan your polyfill quantity accordingly, large amigurumi
          pieces consume surprising amounts of stuffing, and underfilling a large sphere produces a sad,
          floppy result even if the crochet itself is perfectly executed.
        </p>
      </section>

      {/* ── References ── */}
      <section className="mt-12 pt-6 border-t border-bark-200 dark:border-bark-700">
        <h2 className="text-base font-semibold text-bark-700 dark:text-cream-300 mb-3">References</h2>
        <ol className="space-y-1.5 text-sm text-bark-500 dark:text-bark-400">
          <li>
            <span className="font-medium">1.</span>{" "}
            Craft Yarn Council, Stitch Symbols and Standards.{" "}
            <Link
              href="https://www.craftyarncouncil.com/standards/crochet-chart-symbols"
              className="text-sage-600 dark:text-sage-400 underline"
              target="_blank"
              rel="nofollow noopener"
            >
              craftyarncouncil.com
            </Link>
          </li>
          <li>
            <span className="font-medium">2.</span>{" "}
            Craft Yarn Council, Needle and Hook Size Chart.{" "}
            <Link
              href="https://www.craftyarncouncil.com/standards/hooks-and-needles"
              className="text-sage-600 dark:text-sage-400 underline"
              target="_blank"
              rel="nofollow noopener"
            >
              craftyarncouncil.com
            </Link>
          </li>
          <li>
            <span className="font-medium">3.</span>{" "}
            Yarnspirations, Crochet and Knitting How-To Hub.{" "}
            <Link
              href="https://www.yarnspirations.com/blogs/how-to"
              className="text-sage-600 dark:text-sage-400 underline"
              target="_blank"
              rel="nofollow noopener"
            >
              yarnspirations.com
            </Link>
          </li>
          <li>
            <span className="font-medium">4.</span>{" "}
            Ravelry, Amigurumi pattern database.{" "}
            <Link
              href="https://www.ravelry.com/patterns/search#craft=crochet&pc=toysandhobbies"
              className="text-sage-600 dark:text-sage-400 underline"
              target="_blank"
              rel="nofollow noopener"
            >
              ravelry.com
            </Link>
          </li>
          <li>
            <span className="font-medium">5.</span>{" "}
            Craft Yarn Council, Standard Yarn Weight System.{" "}
            <Link
              href="https://www.craftyarncouncil.com/standards/yarn-weight-system"
              className="text-sage-600 dark:text-sage-400 underline"
              target="_blank"
              rel="nofollow noopener"
            >
              craftyarncouncil.com
            </Link>
          </li>
        </ol>
      </section>
    </ToolLayout>
  );
}
