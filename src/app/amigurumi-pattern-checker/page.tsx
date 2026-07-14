import type { Metadata } from "next";
import Link from "next/link";
import AnswerBlock from "@/components/AnswerBlock";
import ToolLayout from "@/components/ToolLayout";
import AmigurumiPatternCheckerTool from "./AmigurumiPatternCheckerTool";

export const metadata: Metadata = {
  title: "Free Amigurumi Pattern Checker, Verify Round Math",
  description:
    "Check crochet and amigurumi stitch counts round by round. See stitches consumed, stitches created, written totals, and possible errors. Private and free.",
  keywords: [
    "crochet pattern checker",
    "amigurumi stitch count checker",
    "crochet round calculator",
    "crochet pattern error checker",
    "check AI crochet pattern",
    "amigurumi pattern math",
  ],
  alternates: { canonical: "/amigurumi-pattern-checker" },
  openGraph: {
    title: "Free Amigurumi Pattern Checker",
    description: "Verify crochet round math and written stitch totals without uploading your pattern.",
    url: "https://fibertools.app/amigurumi-pattern-checker",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "FiberTools Amigurumi Pattern Checker" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Amigurumi Pattern Checker",
    description: "Verify crochet round math and written stitch totals, locally in your browser.",
    images: ["https://fibertools.app/og-image.png"],
  },
  other: { dateModified: "2026-07-13" },
};

export default function AmigurumiPatternCheckerPage() {
  return (
    <ToolLayout slug="amigurumi-pattern-checker" widgetFirst showDefaultReferences={false}>
      <AnswerBlock
        what="A deterministic checker that calculates how many stitches each amigurumi round consumes and creates, then compares the result with the pattern's written total."
        who="Crocheters, amigurumi designers, testers, and anyone reviewing a human- or AI-written US crochet pattern."
        bottomLine="A matching total confirms the arithmetic for supported notation, not that the entire pattern will produce the intended shape."
        lastUpdated="2026-07-13"
      />

      <AmigurumiPatternCheckerTool />

      <section className="mt-12">
        <h2 className="section-heading">How the crochet round checker calculates stitch totals</h2>
        <p className="text-bark-600 leading-relaxed text-[15px] dark:text-bark-400">
          Every instruction has two numbers: stitches consumed from the previous round and stitches created
          for the next round. A single crochet consumes one stitch and creates one. An increase consumes one
          and creates two. A decrease consumes two and creates one. The checker multiplies those values by the
          repeat count, then compares the calculated total with the number written at the end of the round.
        </p>
        <div className="mt-5 overflow-x-auto rounded-xl border border-bark-200 dark:border-bark-700">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead className="bg-cream-100 text-bark-700 dark:bg-bark-800 dark:text-cream-200">
              <tr><th className="px-4 py-3">Instruction</th><th className="px-4 py-3">Consumes</th><th className="px-4 py-3">Creates</th></tr>
            </thead>
            <tbody className="divide-y divide-bark-100 dark:divide-bark-700">
              <tr><td className="px-4 py-3">sc, hdc, or dc</td><td className="px-4 py-3">1 stitch</td><td className="px-4 py-3">1 stitch</td></tr>
              <tr><td className="px-4 py-3">inc or 2 sc in next st</td><td className="px-4 py-3">1 stitch</td><td className="px-4 py-3">2 stitches</td></tr>
              <tr><td className="px-4 py-3">dec or sc2tog</td><td className="px-4 py-3">2 stitches</td><td className="px-4 py-3">1 stitch</td></tr>
              <tr><td className="px-4 py-3">ch 1 or sl st to join</td><td className="px-4 py-3">Excluded in amigurumi mode</td><td className="px-4 py-3">Excluded from total</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="section-heading">Worked example: (5 sc, inc) x 6 [42]</h2>
        <div className="rounded-xl border-l-4 border-sage-500 bg-sage-50 p-5 dark:bg-sage-950/20">
          <p className="text-[15px] leading-relaxed text-bark-700 dark:text-cream-300">
            One repeat consumes 6 starting stitches: five for the single crochets and one for the increase.
            It creates 7 stitches: five single crochets plus the two stitches created by the increase. Repeating
            six times consumes 36 and creates 42. If the previous round has 36 stitches and the written total is
            42, the arithmetic is consistent.
          </p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="section-heading">Supported US crochet notation</h2>
        <p className="text-bark-600 leading-relaxed text-[15px] dark:text-bark-400">
          This first release supports sc, hdc, dc, inc, dec, sc2tog, hdc2tog, dc2tog, chains, joining slip
          stitches, FLO, BLO, magic rings, numbered repeats, and simple “in each stitch around” instructions.
          Write one round per line and place a total such as <code>[42]</code> or <code>(42 sts)</code> at the end.
          It uses US terminology. Convert UK instructions first with the{" "}
          <Link href="/uk-to-us-converter" className="text-sage-600 underline hover:text-sage-700">UK-to-US crochet converter</Link>.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="section-heading">What a correct result does—and does not—prove</h2>
        <div className="space-y-4 text-bark-600 leading-relaxed text-[15px] dark:text-bark-400">
          <p>
            “Correct” means the supported stitch instructions consume the available stitches and produce the
            written total. It does not prove the shaping is attractive, the gauge is suitable, the pieces fit,
            or the finished object is safe. Pattern testing with real yarn remains necessary.
          </p>
          <p>
            The checker deliberately returns “Not verified” when it encounters notation it does not understand.
            It does not ask an AI model to guess. Complex nested repeats, colorwork, bobbles, popcorn stitches,
            special designer abbreviations, rows worked back and forth, and nonstandard chain-count rules require
            human review in this release.
          </p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="section-heading">Privacy and pattern ownership</h2>
        <p className="text-bark-600 leading-relaxed text-[15px] dark:text-bark-400">
          Pattern text is processed locally in your browser. FiberTools does not send the pasted text to a
          server, save it to an account, publish it, or use it for model training. Standard page analytics can
          run only after consent and do not include the pattern text or calculated stitch values.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="section-heading">Continue planning your amigurumi project</h2>
        <ul className="space-y-3 text-[15px]">
          <li><Link href="/amigurumi-shapes" className="font-medium text-sage-600 underline">Generate basic amigurumi shapes</Link><span className="text-bark-500"> — build spheres, cones, cylinders, and ovals round by round.</span></li>
          <li><Link href="/circle-calculator" className="font-medium text-sage-600 underline">Check flat-circle increases</Link><span className="text-bark-500"> — compare standard increase schedules and staggered placements.</span></li>
          <li><Link href="/increase-decrease-calculator" className="font-medium text-sage-600 underline">Distribute increases or decreases</Link><span className="text-bark-500"> — create evenly spaced shaping instructions.</span></li>
          <li><Link href="/yarn-calculator" className="font-medium text-sage-600 underline">Estimate amigurumi yarn</Link><span className="text-bark-500"> — plan material quantities before buying a full project palette.</span></li>
        </ul>
      </section>

      <section className="mt-12 border-t border-bark-200 pt-6 dark:border-bark-700">
        <h2 className="text-base font-semibold text-bark-700 dark:text-cream-300">Sources and standards</h2>
        <ul className="mt-3 space-y-2 text-sm text-bark-500 dark:text-bark-400">
          <li><a href="https://www.craftyarncouncil.com/standards/crochet-abbreviations" target="_blank" rel="noopener noreferrer" className="text-sage-600 underline">Craft Yarn Council, Crochet Abbreviations</a> — standardized US stitch names and abbreviations.</li>
          <li><a href="https://www.craftyarncouncil.com/standards/crochet-chart-symbols" target="_blank" rel="noopener noreferrer" className="text-sage-600 underline">Craft Yarn Council, Crochet Chart Symbols</a> — standard stitch-symbol reference.</li>
        </ul>
      </section>
    </ToolLayout>
  );
}
