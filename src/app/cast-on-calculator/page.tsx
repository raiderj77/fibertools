import type { Metadata } from "next";
import Link from "next/link";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import CastOnCalculatorTool from "./CastOnCalculatorTool";

export const metadata: Metadata = {
  title: "Cast On Calculator",
  description:
    "Calculate how many stitches to cast on for any width with stitch pattern multiple rounding and edge stitch notes.",
  keywords: [
    "cast on calculator",
    "how many stitches to cast on",
    "knitting cast on count",
    "foundation chain calculator",
    "stitch count calculator",
    "cast on for width",
  ],
  authors: [{ name: "Jason Ramirez", url: "https://fibertools.app/about" }],
  openGraph: {
    title: "Cast On Calculator",
    description:
      "Calculate how many stitches to cast on for any width with stitch pattern multiple rounding and edge stitch notes.",
    url: "https://fibertools.app/cast-on-calculator",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Cast On Calculator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cast On Calculator",
    description:
      "Calculate how many stitches to cast on for any width with stitch pattern multiple rounding and edge stitch notes.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/cast-on-calculator" },
  other: { dateModified: "2026-05-05" },
};

export default function CastOnCalculatorPage() {
  return (
    <ToolLayout slug="cast-on-calculator" widgetFirst>
      <AnswerBlock
        what="A calculator that determines how many stitches to cast on for any target width, with stitch pattern multiple rounding and edge stitch adjustments."
        who="Knitters who need the exact cast-on count for a custom-width project or when substituting yarn at a different gauge."
        bottomLine="Enter your gauge and desired width to get a cast-on number rounded to your pattern repeat."
        lastUpdated="2026-05-05"
      />

      <CastOnCalculatorTool />

      {/* ── Content sections ── */}

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          How many stitches do I cast on for a specific width?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Divide gauge stitches by gauge measurement to get stitches per inch, then multiply by desired width. For
            18 stitches over 4 inches gauge (4.5 sts/inch) and a 50-inch blanket: 4.5 &times; 50 = 225 stitches.
            Round to your stitch pattern multiple. Always cast on with the same yarn and needles you&rsquo;ll use
            for the project, not what the pattern recommends.<sup>1</sup>
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Gauge swatching matters more than yarn label gauge because label gauge is an industry average across many
          knitters and conditions &mdash; your specific tension, needle material, and knitting style produce a
          different result. A knitter who works tightly might get 5 stitches per inch on a yarn that labels at 4.5;
          a loose knitter might get 4. That half-stitch-per-inch difference across 50 inches adds up to 25 stitches,
          which is the difference between a blanket that fits and one that doesn&rsquo;t.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Flat gauge and in-the-round gauge differ for most knitters. When working flat, you purl on the wrong side;
          when working in the round, you knit every round. Most knitters purl more loosely than they knit, which
          creates a slightly different gauge. The difference is often half a stitch per 4 inches &mdash; small
          enough to ignore for a dishcloth, meaningful for a fitted sweater. Swatch flat for flat projects and in
          the round for circular projects.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Swatch at least 6 inches wide and 4 inches tall before measuring. Edge stitches are always distorted by
          selvedge tension and should be excluded from the measurement. Pin the swatch to a flat surface, measure
          4 inches across the center (at least 1 inch from any edge), and count the stitches. Take two or three
          measurements and average them for the most accurate stitch-per-inch number.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          What is a stitch pattern multiple and why does it matter?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            A stitch pattern multiple is the smallest stitch count a pattern repeats over. K2P2 ribbing has a
            multiple of 4. Cable patterns commonly use multiples of 6, 8, or 10. Lace patterns often have a
            multiple plus extra edge stitches (e.g., &ldquo;multiple of 8 + 3&rdquo;). Round your cast-on up
            to fit the pattern; the calculator handles this automatically.<sup>2</sup>
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Common multiples for standard stitch patterns: K1P1 ribbing uses a multiple of 2; K2P2 ribbing uses a
          multiple of 4; K3P3 ribbing uses a multiple of 6. Basic lace repeats are typically 4 or 6 stitches;
          basic cable panels are commonly 6 or 8. Seed stitch and moss stitch use multiples of 2. Knowing your
          pattern&rsquo;s multiple before calculating stitch count saves the frustration of discovering a
          misalignment after you&rsquo;re several inches in.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          &ldquo;Multiple of 8 + 3&rdquo; means you cast on a number divisible by 8, then add 3 additional
          stitches for selvedge or balance stitches at the edges. If the base calculation gives you 78 stitches,
          round up to the next multiple of 8 (80), then add 3 to reach 83. Those 3 extra stitches create
          symmetry at both edges &mdash; often 1 or 2 at one end and the remainder at the other.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Ignoring the pattern multiple breaks pattern alignment in two ways. In flat knitting, the pattern
          won&rsquo;t end cleanly at the right edge, creating a partial repeat that looks unfinished. In the
          round, a misaligned multiple means the pattern repeat won&rsquo;t join cleanly at the end of the
          round. Either problem requires ripping back &mdash; better to catch it at the cast-on stage.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          Do I need to add edge stitches or selvedge stitches?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Yes, if you&rsquo;re seaming pieces together. Add 1&ndash;2 selvedge stitches on each side of flat
            pieces &mdash; these get absorbed into the seam and don&rsquo;t show in finished measurements.
            Knitting in the round doesn&rsquo;t need selvedges. Garter stitch borders (5&ndash;10 stitches per
            side) prevent stockinette curling but should be added to your cast-on count, not subtracted from
            project width.<sup>3</sup>
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          The most common selvedge construction is slip the first stitch purlwise and knit the last stitch on
          every row, regardless of the main stitch pattern. This creates a neat chain along both edges that is
          easy to seam and easy to pick up stitches along for added borders. It works with any flat stitch
          pattern and adds just one stitch per side (two total) to the cast-on count.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Garter stitch borders on stockinette projects require more planning. Work the first 5&ndash;10 stitches
          and last 5&ndash;10 stitches in garter (knit every row) throughout the project. These stitches prevent
          the curling inherent in stockinette and produce a neat, flat edge without a separate border piece.
          Account for them in your cast-on: the total includes pattern stitches plus border stitches.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Circular knitting eliminates the selvedge question entirely because there are no open edges. The
          stitches join at the end of the round, and the fabric is a continuous tube. All cast-on stitches
          contribute to the project width or circumference, with none absorbed by a seam. This is why
          in-the-round stitch counts are often lower than flat equivalents even at the same target width.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          How do I figure out my gauge accurately?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Knit a swatch at least 6 inches wide and 4 inches tall in your pattern stitch. Block it the way
            you&rsquo;ll block the finished project. Lay flat, measure 4 inches across the center (away from
            edges), and count the stitches. That&rsquo;s your stitch gauge. Repeat vertically for row gauge.
            Always swatch flat for flat projects, in the round for circular projects.<sup>4</sup>
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Blocking before measuring matters because most yarns relax 5&ndash;10% after wet-finishing. A wool
          swatch that measures 20 stitches per 4 inches dry may measure 19 after blocking &mdash; that single
          stitch per 4 inches changes the cast-on count for a 50-inch blanket by more than 10 stitches. Block
          your swatch the same way you&rsquo;ll block the finished project: wet-finishing for wool, steam for
          acrylic, or just pinning for lace.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          If your gauge doesn&rsquo;t match the pattern, change needle size rather than trying to adjust your
          tension. Go up one needle size if you have too many stitches per inch (working too tight), down one
          size if too few (working too loose). Needle size has a predictable effect on gauge; trying to
          consciously loosen or tighten your tension across an entire project is unreliable.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Measure the swatch in multiple places because yarn tension can drift across a swatch, especially near
          the cast-on row where tension is often uneven. Take measurements at three points: left of center,
          center, and right of center. Average the stitch counts. If the three measurements vary by more than
          half a stitch, consider re-swatching with more even tension before committing to the project.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          Why doesn&rsquo;t my finished width match my cast-on calculation?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Gauge shifts between a 4-inch swatch and a full-width project. Knitters often work tighter when
            concentrating on cables or colorwork than on plain stockinette. Blocking changes dimensions &mdash;
            most natural fibers grow 5&ndash;10% during wet-finishing. Measure your project periodically as you
            knit and adjust if dimensions drift more than 5% from target.<sup>5</sup>
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Needle material affects gauge across larger projects in ways that don&rsquo;t show in a small swatch.
          Metal needles have a slippery surface that allows stitches to move freely, producing a slightly
          tighter fabric than wood or bamboo, which grip the yarn. The difference is subtle across 20 stitches
          but visible across 200. If you gauge-swatch on one needle material and knit the project on another,
          expect a small gauge shift. For sock-specific gauge considerations, the{' '}
          <Link href="/sock-calculator" className="text-sage-600 dark:text-sage-400 underline hover:opacity-80">sock calculator</Link>
          {' '}handles foot circumference math with negative ease built in.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Row gauge matters as much as stitch gauge for fitted garments. A garment with correct stitch gauge but
          incorrect row gauge will have the right width but wrong length, even if you count rows precisely.
          Row gauge is harder to adjust with needle size alone &mdash; a needle change that corrects stitch gauge
          usually shifts row gauge in the same direction but not proportionally. Measure both and flag any
          significant discrepancy before starting a fitted piece.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          A partial-skein test helps predict yarn behavior across a full project. Knit approximately 20% of the
          project yardage, then wet-finish that section and measure. A full project scales predictably from this
          sample &mdash; if the test section grew 5% after blocking, the full project will too. This approach
          surfaces both gauge drift and dye lot issues before you&rsquo;re committed to the entire project.
        </p>
      </section>

      {/* ── References ── */}
      <section className="mt-12 pt-6 border-t border-bark-200 dark:border-bark-700">
        <h2 className="text-base font-semibold text-bark-700 dark:text-cream-300 mb-3">References</h2>
        <ol className="space-y-1.5 text-sm text-bark-500 dark:text-bark-400">
          <li>
            <span className="font-medium">1.</span>{" "}
            Craft Yarn Council, How to Measure Wraps Per Inch.{" "}
            <Link
              href="https://www.craftyarncouncil.com/standards/how-measure-wraps-inch-wpi"
              className="text-sage-600 dark:text-sage-400 underline"
              target="_blank"
              rel="nofollow noopener"
            >
              craftyarncouncil.com
            </Link>
          </li>
          <li>
            <span className="font-medium">2.</span>{" "}
            Tin Can Knits, Stitch Patterns Guide.{" "}
            <Link
              href="https://www.tincanknits.com/blog/stitch-patterns"
              className="text-sage-600 dark:text-sage-400 underline"
              target="_blank"
              rel="nofollow noopener"
            >
              tincanknits.com
            </Link>
          </li>
          <li>
            <span className="font-medium">3.</span>{" "}
            Tin Can Knits, Selvedge Stitches.{" "}
            <Link
              href="https://www.tincanknits.com/blog/selvedge"
              className="text-sage-600 dark:text-sage-400 underline"
              target="_blank"
              rel="nofollow noopener"
            >
              tincanknits.com
            </Link>
          </li>
          <li>
            <span className="font-medium">4.</span>{" "}
            Tin Can Knits, How to Measure Gauge.{" "}
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
            <span className="font-medium">5.</span>{" "}
            Schacht Spindle, Yarn Swatching 3 Ways.{" "}
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
