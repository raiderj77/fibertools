import type { Metadata } from "next";
import Link from "next/link";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import YarnCalculatorTool from "./YarnCalculatorTool";

export const metadata: Metadata = {
  title: "Yarn Yardage Calculator — Free Online",
  description:
    "Calculate how much yarn you need for any knitting or crochet project. Enter your gauge and dimensions for instant yardage estimates. Free, no signup.",
  keywords: [
    "yarn calculator",
    "how much yarn do I need",
    "yarn yardage calculator",
    "yarn estimator",
    "crochet yarn calculator",
    "knitting yarn calculator",
    "how much yarn for a blanket",
    "yarn needed for sweater",
    "estimate yarn for crochet project",
    "how many skeins do I need",
    "yarn calculator by weight",
    "leftover yarn yardage calculator",
    "yarn yardage estimator",
    "blanket yarn calculator",
    "crochet blanket yarn needed",
  ],
  authors: [{ name: "Jason Ramirez", url: "https://fibertools.app/about" }],
  openGraph: {
    title: "Yarn Yardage Calculator — Free Online",
    description:
      "Calculate how much yarn you need for any knitting or crochet project. Enter your gauge and dimensions for instant yardage estimates. Free, no signup.",
    url: "https://fibertools.app/yarn-calculator",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Yarn Yardage Calculator — Free Online" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yarn Yardage Calculator — Free Online",
    description:
      "Calculate how much yarn you need for any knitting or crochet project. Enter your gauge and dimensions for instant yardage estimates. Free, no signup.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/yarn-calculator" },
  other: { dateModified: "2026-05-05" },
};

export default function YarnCalculatorPage() {
  return (
    <>
      <ToolLayout slug="yarn-calculator" widgetFirst>
      <AnswerBlock
        what="A yardage estimator that calculates how much yarn you need for any knitting or crochet project based on your gauge, dimensions, and yarn weight (CYC Lace 0 through Jumbo 7)."
        who="Any knitter or crocheter planning a project — especially if you're buying yarn and need to know how many skeins to get before you start."
        bottomLine="Enter your gauge swatch numbers and project size to get an instant yardage estimate, so you buy the right amount of yarn the first time."
        lastUpdated="2026-05-05"
      />
      <YarnCalculatorTool />

      {/* ── Content sections ── */}

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          How do you calculate how much yarn you need for any project?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Multiply finished area by your yarn weight&rsquo;s coverage factor. Worsted (CYC 4) covers
            approximately 1.3 yards per square inch; DK about 1.1; bulky about 0.95; lace about 2.5. Add
            a 10% buffer, then divide by skein yardage. A gauge swatch gives more accuracy than weight
            averages alone &mdash; even a half-stitch difference per inch shifts total yardage by
            10&ndash;20%.<sup>1</sup>
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          A 4&times;4 inch gauge swatch reveals tension drift that yarn labels never account for. Knitters
          who work tight consistently underestimate yardage because their stitch density runs higher than
          the label average. Measure your actual stitches per inch from the swatch and enter those numbers
          into the calculator&rsquo;s precise mode for a more reliable result.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Textured stitches add yardage because yarn wraps around more structure per square inch. Cables
          add 20&ndash;35% over stockinette. Brioche adds roughly 50% because every stitch is worked
          twice. Always calculate the base yardage first, then apply the pattern&rsquo;s texture
          multiplier before dividing by skein yardage.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Multi-color projects need yardage tracked per color, not just in total. If a colorwork pattern
          uses five colors in unequal proportions, estimate each color&rsquo;s area separately and add
          individual buffers &mdash; running out of one colorway mid-row is harder to recover from than
          running short on a solid project.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          How much yarn do I need for a sweater?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Adult sweaters in worsted weight typically need 1,000&ndash;2,000 yards depending on size and
            length. A small fitted pullover runs 900&ndash;1,200 yards; a long oversized cardigan
            1,800&ndash;2,400. Children&rsquo;s sweaters need 400&ndash;900 yards. Always add a buffer
            skein for sleeves and finishing &mdash; seams and cast-offs consume more yarn than most
            patterns account for.<sup>2</sup>
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Garment style drives yardage more than size alone. A cropped pullover in size L uses less yarn
          than a hip-length fitted pullover in the same size. Raglan construction typically uses slightly
          less than set-in sleeves because there&rsquo;s less seam finishing. Cardigans need 10&ndash;15%
          more than pullovers because front bands and button bands add linear yardage.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Fiber content affects apparent weight, not always yardage. Wool sweaters feel substantial at
          lower yardage because wool has more loft. Cotton at the same yardage feels heavier and drapier
          because cotton is denser. When substituting fiber types, match yards-per-100g on the label
          rather than skein count &mdash; grams and yards diverge significantly across fiber families.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Cables and colorwork stack directly onto base yardage. A cabled Aran sweater can run
          1,600&ndash;2,200 yards in a medium because cables add 25&ndash;35% over a plain stockinette
          version of the same pattern. Fair Isle colorwork in a pullover adds 20&ndash;30% depending on
          float length and color count.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          Does stitch pattern affect yarn usage?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Yes, significantly. Cables consume 20&ndash;30% more yarn than stockinette. Bobbles and
            popcorns add similar overhead. Lace uses less yarn per square inch but more rows per inch.
            Slipped-stitch and mosaic colorwork save yarn but slow knitting. The calculator&rsquo;s stitch
            pattern selector applies these multipliers automatically &mdash; always add 15% for heavily
            textured patterns.<sup>3</sup>
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Brioche knitting is the most yarn-hungry common stitch at roughly 50% above stockinette &mdash;
          every stitch is worked twice and the fabric is twice as thick. Garter stitch adds about 8% over
          stockinette due to extra row height. Seed stitch adds 10&ndash;12%. Ribbing adds 10% but
          compresses fabric width, meaning you need more stitches to hit the same finished measurement.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Entrelac and intarsia behave differently on yardage. Intarsia requires a separate bobbin per
          color section but adds no extra consumption beyond the base design. Entrelac involves constant
          turning and picking up stitches, which adds 5&ndash;10% waste at joins. For colorwork palette
          planning and fiber recommendations by color family, see{" "}
          <Link href="/blog/crochet-color-trends-2026" className="text-sage-600 dark:text-sage-400 underline hover:opacity-80">
            Crochet Color Trends 2026
          </Link>
          .
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Lace and cables are often compared because they appear in the same weight range. Given the same
          1,200-yard skein, a lace shawl typically finishes larger than a cabled version because lace uses
          15% less yarn per square inch. The cabled version will be denser, warmer, and shorter &mdash; a
          real tradeoff worth calculating before you commit.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          How do I match yarn substitutions?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Match yarn weight (CYC number) first, then fiber blend, then yards-per-100g for an accurate
            substitution. A pattern calling for 5 skeins of 200-yard worsted needs 1,000 total yards in
            any worsted-weight yarn. Check Ravelry&rsquo;s yarn database for community-verified
            substitutions before buying &mdash; actual project results are more reliable than label
            comparisons alone.<sup>4</sup>
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Grams alone don&rsquo;t substitute because different fibers have different densities. A 100g
          skein of merino at worsted weight yields roughly 200 yards; a 100g skein of cotton at the same
          gauge yields only 160&ndash;180. Matching by CYC number and yards-per-100g avoids the
          skein-count trap that catches most knitters doing substitutions for the first time.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Superwash-treated wool and untreated wool gauge differently even at the same nominal weight.
          Superwash treatment makes the fiber slightly heavier and drapier. You may need to go down a
          needle size to match the original pattern gauge when substituting superwash for non-superwash,
          especially in fitted garments where drape and row gauge both affect finished length.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Always swatch the substitute before committing to a full purchase. A 4&times;4 inch swatch
          costs one partial skein and confirms gauge, drape, and hand &mdash; all three matter for a
          finished garment. Fiber blends with synthetic content (acrylic, nylon) often have more
          consistent gauge than pure naturals but may block differently, which changes finished
          measurements.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          How much extra yarn should I buy?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Buy at least 10% more than your calculated total, or one extra skein &mdash; whichever is
            greater. Dye lots vary between production batches and matching one later is unreliable. For
            colorwork and detailed garments, buy 15&ndash;20% extra. Most yarn stores allow returns of
            unopened skeins with a receipt, so buying extra carries little risk.<sup>5</sup>
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Dye lot numbers are printed on yarn labels and indicate which production batch the yarn came
          from. Two skeins from different dye lots may look identical on the shelf but show a visible
          color shift mid-project under natural light. Always buy your full quantity from the same dye
          lot. If you run out, alternate one row of old and one row of new yarn for several inches to
          blend the transition gradually.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Buy two extra skeins for heavy colorwork, cable-dense patterns, or any project with significant
          finishing work &mdash; buttonbands, pockets, linings, and edgings consume more yarn than most
          pattern yardage estimates include. Patterns written for a specific yarn brand are calibrated to
          that yarn&rsquo;s wraps-per-inch, which may not match a substitute exactly.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          If you run short mid-project, the partial skein calculator in the tool above tells you exactly
          how much remains by weight. Weigh your remaining yarn on a kitchen scale, enter the full skein
          weight and listed yardage, and you&rsquo;ll know whether you have enough to finish the current
          section before ordering more.
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
            Ravelry — Sweater pattern database, yardage data from project records.{" "}
            <Link
              href="https://www.ravelry.com/patterns/search#craft=knitting&pc=sweater"
              className="text-sage-600 dark:text-sage-400 underline"
              target="_blank"
              rel="nofollow noopener"
            >
              ravelry.com
            </Link>
          </li>
          <li>
            <span className="font-medium">3.</span>{" "}
            Craft Yarn Council — Knit and Crochet Stitch Charts.{" "}
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
            <span className="font-medium">4.</span>{" "}
            Craft Yarn Council — Substituting Yarns Guide.{" "}
            <Link
              href="https://www.craftyarncouncil.com/quick-guide-to-yarn"
              className="text-sage-600 dark:text-sage-400 underline"
              target="_blank"
              rel="nofollow noopener"
            >
              craftyarncouncil.com
            </Link>
          </li>
          <li>
            <span className="font-medium">5.</span>{" "}
            Yarnspirations — Buying the Right Amount of Yarn.{" "}
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
    </>
  );
}
