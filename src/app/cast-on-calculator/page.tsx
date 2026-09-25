import type { Metadata } from "next";
import Link from "next/link";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import CastOnCalculatorTool from "./CastOnCalculatorTool";

export const metadata: Metadata = {
  title: { absolute: "Cast On Calculator: Stitches for Any Width" },
  description:
    "Calculate how many stitches to cast on from your measured gauge and target width, with pattern-repeat rounding and edge-stitch guidance.",
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
    title: "Cast On Calculator: Stitches for Any Width",
    description:
      "Calculate how many stitches to cast on from your measured gauge and target width, with pattern-repeat rounding.",
    url: "https://fibertools.app/cast-on-calculator",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Cast On Calculator: Stitches for Any Width" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cast On Calculator: Stitches for Any Width",
    description:
      "Calculate how many stitches to cast on from your measured gauge and target width, with pattern-repeat rounding.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/cast-on-calculator" },
  other: { dateModified: "2026-09-05" },
};

export default function CastOnCalculatorPage() {
  return (
    <ToolLayout
      slug="cast-on-calculator"
      widgetFirst
      focused
      nextAction={{
        href: "/gauge-calculator",
        label: "Check the gauge math",
        description: "Compare your swatch with the pattern gauge or calculate the stitch count for a finished width.",
      }}
    >
      <AnswerBlock
        what="A planning calculator that converts target width and measured gauge to a whole stitch count, with optional rounding up to a repeat multiple."
        who="Knitters comparing cast-on counts for a custom width or a different measured gauge."
        bottomLine="Enter your measured gauge and desired width to calculate how many stitches to cast on, rounded to your pattern repeat."
        lastUpdated="2026-09-05"
      />

      <CastOnCalculatorTool />

      {/* ── Content sections ── */}

      <section className="mt-12 space-y-4">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">How many stitches do I cast on for a specific width?</h2>
        <p>Divide the stitches measured in your swatch by its measured width, then multiply by the target width.
          For 18 stitches over 4 inches and a 50-inch target, the unrounded count is 18 / 4 &times; 50 = 225 stitches.
          Use inches for both measurements; a 10 cm gauge span is not exactly 4 inches.</p>
        <p>Without a stitch multiple, the calculator rounds to the nearest whole stitch, with half stitches rounding up.
          With a multiple, it rounds the unrounded count upward to that multiple. For example, 12.2 stitches with a
          multiple of 6 becomes 18 stitches. The modeled width is the final count divided by your measured stitches per inch.</p>
        <p>The supported range is a positive width up to 1,000 inches, up to 1,000 gauge stitches over a positive span
          of at most 100 inches, and a whole multiple from 1 through 1,000. Results must be from 1 through 10,000 stitches.
          These are arithmetic limits, not recommended project dimensions.</p>
      </section>
      <section className="mt-10 space-y-4">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">What is a stitch pattern multiple and why does it matter?</h2>
        <p>A multiple describes the repeated portion of a stitch pattern. For an uninterrupted K2P2 repeat, the
          repeated portion uses four stitches. Read the pattern for additional balancing, edge, or joining stitches.</p>
        <p>This calculator handles a pure multiple only. It does not automatically add the +3 in a pattern written
          as a multiple of 8 + 3. For a base count of 78, rounding up to 80 and manually adding 3 gives 83 stitches;
          that addition changes the modeled width. Use the{' '}
          <Link href="/stitch-pattern-calculator" className="text-sage-600 dark:text-sage-400 underline">stitch pattern calculator</Link>
          {' '}to compare counts with plus offsets and edge stitches.</p>
      </section>
      <section className="mt-10 space-y-4">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">Do I need to add edge stitches or selvedge stitches?</h2>
        <p>Add only the extra stitches required by the selected pattern. Seaming allowances, slipped edges, and borders
          depend on construction; there is no universal number to add. Border stitches can contribute to the finished
          width and may have a different gauge. Avoid counting the same edge allowance twice.</p>
        <p>A crochet foundation chain can require turning chains or other setup stitches. The displayed count is a
          stitch-width calculation, not a complete foundation-chain instruction.</p>
      </section>
      <section className="mt-10 space-y-4">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">How do I figure out my gauge accurately?</h2>
        <p>Make the swatch in the yarn, needles or hook, and stitch pattern you intend to use. Follow the pattern&rsquo;s
          swatching instructions and measure across the center of the swatch on a flat surface. Use the actual measured
          span in the calculator. The Craft Yarn Council explains this method in its{' '}
          <a href="https://media.craftyarncouncil.com/read_instructions.html" className="text-sage-600 dark:text-sage-400 underline" target="_blank" rel="noopener noreferrer">gauge instructions</a>.</p>
        <p>Match the project&rsquo;s construction and the treatment allowed by the pattern and product care instructions.
          Measure again after finishing the swatch. A label gauge is a reference; the calculation needs your measured gauge.</p>
      </section>
      <section className="mt-10 space-y-4">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">Why doesn&rsquo;t my finished width match my cast-on calculation?</h2>
        <p>The result assumes your project keeps the entered stitch gauge. Stitch pattern, tension, construction,
          finishing, borders, and seams can change the finished measurements. Rounding also changes the modeled width,
          so compare the displayed width with your target before using the count. No calculation guarantees fit or finished size.</p>
        <p>This tool does not add ease or plan garment shaping. The{' '}
          <Link href="/sock-calculator" className="text-sage-600 dark:text-sage-400 underline">sock calculator</Link>
          {' '}can compare circumference with an explicitly entered ease allowance; use a tested pattern for construction.</p>
      </section>
      <section className="mt-10 space-y-4">
        <h2 className="section-heading">References</h2>
        <p>The arithmetic uses your measured gauge. For the measurement method, see the{' '}
          <a href="https://media.craftyarncouncil.com/read_instructions.html" className="text-sage-600 dark:text-sage-400 underline" target="_blank" rel="noopener noreferrer">Craft Yarn Council gauge instructions</a>.
          Pattern offsets, edges, construction, and finishing still require the selected pattern&rsquo;s instructions.</p>
      </section>
    </ToolLayout>
  );
}
