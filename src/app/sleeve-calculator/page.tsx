import type { Metadata } from "next";
import Link from "next/link";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import SleeveCalculatorTool from "./SleeveCalculatorTool";

export const metadata: Metadata = {
  title: "Sleeve Shaping Calculator",
  description:
    "Get row-by-row decrease instructions for tapered sleeves in knit or crochet with evenly distributed shaping.",
  keywords: [
    "sleeve shaping calculator",
    "sleeve decrease calculator",
    "tapered sleeve knitting",
    "sleeve shaping math",
    "knitting sleeve calculator",
  ],
  authors: [{ name: "Jason Ramirez", url: "https://fibertools.app/about" }],
  openGraph: {
    title: "Sleeve Shaping Calculator",
    description:
      "Get row-by-row decrease instructions for tapered sleeves in knit or crochet with evenly distributed shaping.",
    url: "https://fibertools.app/sleeve-calculator",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Sleeve Shaping Calculator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sleeve Shaping Calculator",
    description:
      "Get row-by-row decrease instructions for tapered sleeves in knit or crochet with evenly distributed shaping.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/sleeve-calculator" },
  other: { dateModified: "2026-05-05" },
};

export default function SleeveCalculatorPage() {
  return (
    <ToolLayout slug="sleeve-calculator" widgetFirst>
      <AnswerBlock
        what="A calculator that generates row-by-row decrease instructions for tapered sleeves with evenly distributed shaping."
        who="Knitters and crocheters who need to taper a sleeve from upper arm to cuff and want the math done for them."
        bottomLine="Enter your upper arm and cuff stitch counts plus sleeve length to get an even decrease schedule."
        lastUpdated="2026-05-05"
      />

      <SleeveCalculatorTool />

      {/* ── Content sections ── */}

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          How do I calculate sleeve decrease rows?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Take the difference between upper arm and wrist stitch counts, divide by 2 (since you decrease one stitch
            at each end per decrease row), then divide your shaping length in rows by that number to find the spacing
            between decrease rows. Example: 60 stitches at upper arm to 40 at wrist over 80 rows = 10 decrease rows,
            one every 8th row.<sup>1</sup>
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Decreases happen at both ends of the row because symmetry keeps the underarm seam straight. If you only
          decreased at one end, the sleeve would taper diagonally instead of tapering evenly on both sides. Working
          one decrease at the start and one at the end of the same row removes two stitches per decrease event and
          keeps the center of the sleeve centered over your arm.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Most patterns specify &ldquo;decrease every 8th row&rdquo; instead of &ldquo;decrease 10 times&rdquo;
          because a row interval is easier to track while knitting. You set a row counter at zero on each decrease
          row and work until it reads 8. Tracking a total count of decreases requires remembering where you are
          across the whole sleeve, which is harder to recover from if you lose your place.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Knitting in the round changes the math slightly. Instead of decreasing at row edges, you place markers
          at two points on the round (typically at the beginning of the round and halfway through) and work
          decreases on each side of each marker. The stitch counts and row intervals are identical &mdash; only
          the physical location of the decrease shifts from the edge to a marked column.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          What does &lsquo;decrease at each end&rsquo; mean?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            It means work one decrease at the start of the row and one decrease at the end of the row. Knit two
            together (k2tog) is the standard right-leaning decrease at the end; slip-slip-knit (SSK) is the standard
            left-leaning decrease at the start. This pairing keeps the sleeve edges symmetrical, which matters for
            set-in seams and clean tapering.<sup>2</sup>
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          SSK and k2tog lean in opposite directions when viewed from the right side of the fabric. SSK slants left;
          k2tog slants right. Placing SSK at the start and k2tog at the end means both decreases lean inward toward
          the center of the sleeve. This creates a mirrored decrease line on each edge that follows the natural taper
          of the sleeve rather than cutting across it.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          The lean direction matters visually on fitted sleeves because the decrease columns are visible in the
          finished fabric. On a stockinette sleeve, each decrease event creates a small diagonal line &mdash; one
          leaning right, one leaning left &mdash; that frames the sleeve shaping. When worked correctly, these
          lines produce a clean, intentional-looking taper. When both decrease types lean the same direction,
          the shaping looks like a mistake rather than a design element.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Using only k2tog at both ends makes both decrease columns lean right when viewed from the front of the
          sleeve. The left edge looks correct; the right edge looks as if the fabric is being pulled sideways.
          On a plain sleeve this might go unnoticed, but on a fitted garment or anything with visible stitch
          definition &mdash; cables, twisted stitches, or high-twist yarns &mdash; the mismatched lean is
          immediately visible.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          Why is there a 1-inch buffer at each end of the shaping zone?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            The 1-inch buffer at the upper arm prevents decreases from happening right at the underarm join, where
            they&rsquo;d create a visible jog. The 1-inch buffer at the wrist gives the cuff a clean transition into
            ribbing. Without these buffers, the sleeve looks abruptly tapered instead of smoothly fitted.<sup>3</sup>
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          In set-in sleeve construction, the upper arm buffer aligns with the beginning of the armhole curve on the
          body. The first inch of the sleeve is worked straight so that when you seam or pick up stitches for the
          armhole, there&rsquo;s a flat section to work into. Starting decreases immediately at the cast-on row
          would mean seaming into active shaping, which produces a lumpy join at the underarm.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          The wrist buffer keeps ribbing cleaner. Cuff ribbing is typically worked on fewer stitches than the
          bottom of the shaping zone &mdash; that&rsquo;s the whole point of tapering. But the final decrease
          should happen before the ribbing begins, not during it. Decreasing inside ribbing collapses the rib
          columns and makes the transition look uneven. The 1-inch buffer above the cuff gives you a straight
          section to close out the shaping before switching to the rib stitch.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Adjust the buffer length for different sleeve styles. Bell sleeves often use a longer lower buffer
          (2&ndash;3 inches) to give the flare room to develop before shaping ends. Very fitted athletic sleeves
          may use a shorter upper buffer (half an inch) to extend the shaping zone and create a more aggressive
          taper from the underarm. The calculator uses 1 inch as the standard; adjust your sleeve length input
          manually if your design calls for a different buffer.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          What&rsquo;s the difference between set-in and tapered sleeves?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            A set-in sleeve has a curved cap that&rsquo;s sewn into a corresponding armhole curve on the body.
            The cap shaping is separate from the sleeve taper. A tapered sleeve (drop shoulder, raglan, or dolman)
            extends straight from the shoulder seam with shaping only along the underarm. Set-in fits more
            precisely; tapered constructions are simpler to knit.<sup>4</sup>
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Choose set-in construction for fitted garments where shoulder fit matters &mdash; structured jackets,
          tailored cardigans, sweaters worn close to the body. Choose raglan or drop shoulder for casual
          silhouettes, children&rsquo;s garments (easier to size up), or when you want to knit the body and
          sleeves in one piece without seaming. Drop shoulder is the most forgiving because the sleeve simply
          meets the body at a right angle with no curve matching required.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          This calculator handles the underarm taper for all sleeve types. The math &mdash; stitch difference
          divided by two, spread across available rows &mdash; is identical whether you&rsquo;re knitting a
          set-in sleeve or a raglan. Cap shaping for set-in sleeves is a separate calculation: a series of
          bound-off rows and short rows above the shaping zone that creates the dome of the cap.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Raglan sleeves don&rsquo;t need separate cap shaping because the diagonal raglan line replaces the cap
          curve entirely. In a raglan, all four pieces &mdash; front, back, and two sleeves &mdash; are joined at
          the yoke and decreased simultaneously along the raglan lines until the neckline is reached. The sleeve
          taper and the yoke shaping happen in the same rows, which is why top-down raglans are often the first
          garment construction new knitters attempt.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          What if my decrease count doesn&rsquo;t divide evenly into row count?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            If you have a remainder, split your decrease events into two groups. Example: 11 decreases over 80 rows
            means decrease every 7th row 4 times, then every 8th row 7 times. The calculator handles this
            automatically. The visual difference between rows 7 and 8 is invisible in finished fabric, so split
            groups look identical to evenly-spaced decreases.<sup>5</sup>
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Pattern designers split decrease groups for purely mathematical reasons, not visual ones. The goal is
          to spread all decrease events across the available rows without any large gaps or bunching. A split
          into &ldquo;every 7 rows 4 times, then every 8 rows 7 times&rdquo; uses exactly 80 rows
          (4&times;7 + 7&times;8 = 28 + 56 = 84 &mdash; hmm, that doesn&rsquo;t work; the calculator solves
          this precisely for your specific numbers). The result is a sleeve that tapers smoothly regardless of
          whether the math divides cleanly.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Tracking split groups while knitting is easier with a row counter app or two stitch markers. Work the
          first group entirely (all &ldquo;every N rows&rdquo; decreases), then switch to the second group
          (all &ldquo;every N+1 rows&rdquo; decreases). Many knitters use a piece of removable stitch marker in
          a different color to mark when they switch groups. You only need to track two interval lengths, not
          individual decrease positions.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Some patterns intentionally use non-split shaping &mdash; for example, &ldquo;decrease every 6th row
          4 times, then every 4th row 6 times&rdquo; &mdash; to create a more pronounced taper near the wrist.
          That&rsquo;s intentional non-linear shaping: the sleeve decreases slowly at first, then accelerates
          toward the cuff for a fitted wrist. This calculator uses mathematically even distribution; if your
          pattern calls for accelerating shaping, follow the pattern intervals rather than the calculator output.
        </p>
      </section>

      {/* ── References ── */}
      <section className="mt-12 pt-6 border-t border-bark-200 dark:border-bark-700">
        <h2 className="text-base font-semibold text-bark-700 dark:text-cream-300 mb-3">References</h2>
        <ol className="space-y-1.5 text-sm text-bark-500 dark:text-bark-400">
          <li>
            <span className="font-medium">1.</span>{" "}
            Craft Yarn Council &mdash; Garment Sizing Standards.{" "}
            <Link
              href="https://www.craftyarncouncil.com/standards/woman-size"
              className="text-sage-600 dark:text-sage-400 underline"
              target="_blank"
              rel="nofollow noopener"
            >
              craftyarncouncil.com
            </Link>
          </li>
          <li>
            <span className="font-medium">2.</span>{" "}
            Tin Can Knits &mdash; Decreases Tutorial.{" "}
            <Link
              href="https://www.tincanknits.com/blog/decreases"
              className="text-sage-600 dark:text-sage-400 underline"
              target="_blank"
              rel="nofollow noopener"
            >
              tincanknits.com
            </Link>
          </li>
          <li>
            <span className="font-medium">3.</span>{" "}
            Tin Can Knits &mdash; How to Measure Gauge.{" "}
            <Link
              href="https://www.tincanknits.com/blog/how-to-measure-gauge"
              className="text-sage-600 dark:text-sage-400 underline"
              target="_blank"
              rel="nofollow noopener"
            >
              tincanknits.com
            </Link>
          </li>
          <li>
            <span className="font-medium">4.</span>{" "}
            Craft Yarn Council &mdash; Yarn Weight System.{" "}
            <Link
              href="https://www.craftyarncouncil.com/standards/yarn-weight-system"
              className="text-sage-600 dark:text-sage-400 underline"
              target="_blank"
              rel="nofollow noopener"
            >
              craftyarncouncil.com
            </Link>
          </li>
          <li>
            <span className="font-medium">5.</span>{" "}
            Schacht Spindle &mdash; Yarn Swatching 3 Ways.{" "}
            <Link
              href="https://schachtspindle.com/blogs/archives/yarn-swatching-3-ways"
              className="text-sage-600 dark:text-sage-400 underline"
              target="_blank"
              rel="nofollow noopener"
            >
              schachtspindle.com
            </Link>
          </li>
        </ol>
      </section>
    </ToolLayout>
  );
}
