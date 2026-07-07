import type { Metadata } from "next";
import Link from "next/link";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import ColorPoolingCalculatorTool from "./ColorPoolingCalculatorTool";

export const metadata: Metadata = {
  title: "Planned Pooling Crochet Calculator, Free",
  description:
    "Calculate exact stitch counts for planned pooling with variegated yarn. Live argyle and plaid preview before you start. Free, no login.",
  keywords: [
    "color pooling calculator", "planned pooling crochet", "variegated yarn pooling",
    "color pooling stitch count", "how to plan color pooling crochet",
    "color pooling calculator moss stitch", "variegated yarn color repeat length",
    "planned pooling argyle", "color pooling foundation chain",
    "planned pooling calculator", "yarn pooling pattern generator",
  ],
  openGraph: {
    title: "Planned Pooling Crochet Calculator, Free",
    description:
      "Calculate exact stitch counts for planned pooling with variegated yarn. Live argyle and plaid preview before you start. Free, no login.",
    url: "https://fibertools.app/color-pooling-calculator",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Planned Pooling Crochet Calculator, Free" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Planned Pooling Crochet Calculator, Free",
    description:
      "Calculate exact stitch counts for planned pooling with variegated yarn. Live argyle and plaid preview before you start. Free, no login.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/color-pooling-calculator" },
  other: { dateModified: "2026-07-07" },
};

export default function ColorPoolingCalculatorPage() {
  return (
    <ToolLayout slug="color-pooling-calculator" widgetFirst>
      <AnswerBlock
        what="A calculator that determines the exact stitch count and foundation chain length for planned pooling with variegated yarn, with a live argyle preview."
        who="Crocheters who want to create intentional argyle or plaid patterns from variegated yarn by controlling stitch placement."
        bottomLine="Enter your yarn's color repeat length and stitch gauge to see exactly how many stitches you need for a clean pooling pattern."
        lastUpdated="2026-07-07"
      />
      <ColorPoolingCalculatorTool />

      {/* Content sections */}

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          How does a planned pooling calculator work?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            A planned pooling calculator turns two measurements into a working stitch count: how many
            stitches each color in your variegated yarn covers, and your gauge. From those it finds the
            row width where the colors stack into diagonal columns instead of landing randomly. That
            stacking is what creates the argyle look.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          The math behind it is simple to state and tedious to do by hand. Every color section in the
          yarn uses up a fixed number of stitches. When your row width is close to one full color repeat,
          each new row shifts the colors over by a stitch or two. That steady shift is what draws the
          diagonal argyle lines. If the row width is far off the repeat, the shift becomes irregular and
          the colors scatter.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          The calculator handles the counting so you only swatch once. If you have not measured your
          gauge yet, run a quick swatch through the{' '}
          <Link href="/gauge-calculator" className="text-sage-600 dark:text-sage-400 underline hover:opacity-80">gauge calculator</Link>
          {' '}first. Knowing your stitches per inch makes the pooling numbers far more reliable.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          How do you plan color pooling step by step?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Work a small swatch in your planned stitch. Count exactly how many stitches each color makes
            before the next color starts. Enter those counts into the calculator in order, chain the
            suggested length, and crochet the first three or four rows. If the columns lean the wrong way,
            add or remove one chain and try again.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Count color sections in stitches, not inches. The same colorway can crochet up differently for
          two people because tension changes how much yarn each stitch uses. Your swatch tells you what
          the yarn does in your hands, which is the only measurement that matters for pooling.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Expect to restart the first rows once or twice. Even with exact numbers, most crocheters adjust
          the starting chain by a stitch or two before the pattern locks in. That is normal. Once the
          first full repeat stacks cleanly, the rest of the project tends to hold the pattern as long as
          your tension stays steady.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Buy enough yarn from one dye lot before you start. Color section lengths can vary between lots
          of the same colorway, and a mid-project lot change can break the sequence. The{' '}
          <Link href="/yarn-calculator" className="text-sage-600 dark:text-sage-400 underline hover:opacity-80">yarn calculator</Link>
          {' '}estimates total yardage so you can buy it all up front.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          Why does my color pooling drift or stop lining up?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Drift almost always comes from a tension change or a knot in the yarn. A tighter or looser
            stretch of stitches shifts where each color lands. Fix small drift by easing your tension
            back, or by quietly adding or skipping one stitch at the end of a row to bring the columns
            back in line.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Factory knots are the most common pattern breaker. When a knot joins the yarn mid-ball, the
          color sequence usually restarts at a different point. Cut the knot out, find the spot in the
          new end that matches where your sequence left off, and rejoin there. It wastes a little yarn
          and saves the whole pattern.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          If a colorway refuses to pool no matter what you try, the repeat may simply be too long or too
          uneven for your project width. Those yarns still make beautiful fabric in regular stripes. The{' '}
          <Link href="/stripe-generator" className="text-sage-600 dark:text-sage-400 underline hover:opacity-80">stripe generator</Link>
          {' '}can turn the same skein into a planned stripe sequence instead.
        </p>
      </section>
    </ToolLayout>
  );
}
