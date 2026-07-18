import type { Metadata } from "next";
import Link from "next/link";
import { FaqSchema, BreadcrumbSchema, SoftwareAppSchema } from "@/components/StructuredData";
import YarnWeightCalculatorTool from "./YarnWeightCalculatorTool";

// ── Metadata ──────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Yarn Weight Calculator, Identify CYC Category Free",
  description:
    "Identify any yarn's CYC weight category from wraps per inch or stitch gauge. Covers all 8 weights: Lace through Jumbo. Free, instant, no signup.",
  keywords: [
    "yarn weight calculator",
    "identify yarn weight",
    "yarn weight from WPI",
    "yarn weight from gauge",
    "CYC yarn weight categories",
    "yarn weight chart",
    "what weight is my yarn",
    "yarn weight identifier",
    "worsted vs DK weight",
    "yarn weight needle size",
    "yarn substitution weight",
  ],
  robots: "index, follow, max-snippet:-1",
  alternates: { canonical: "/yarn-weight-calculator" },
  openGraph: {
    title: "Yarn Weight Calculator, Identify CYC Category Free",
    description:
      "Identify any yarn's CYC weight category from wraps per inch or stitch gauge. All 8 weights covered. Free and instant.",
    url: "https://fibertools.app/yarn-weight-calculator",
    images: [
      {
        url: "https://fibertools.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Yarn Weight Calculator, FiberTools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yarn Weight Calculator, Identify CYC Category Free",
    description:
      "Identify any yarn's CYC weight category from wraps per inch or stitch gauge. Free, instant, no signup.",
    images: ["https://fibertools.app/og-image.png"],
  },
};

// ── FAQ data (drives both FAQPage schema and visible Q&A sections) ──

const FAQS = [
  {
    q: "What yarn weight is right for a beginner project?",
    a: "Worsted weight (CYC 4) is the best choice for beginners. It works up quickly on US 7–9 needles or an I/9–K/10.5 crochet hook, stitches are easy to see and count, and the vast majority of beginner patterns specify worsted. Bulky (CYC 5) is an even faster option when you want quick visible progress.",
  },
  {
    q: "How do US CYC yarn weights compare to UK terminology?",
    a: "US worsted (CYC 4) is UK aran. US DK (CYC 3) is UK DK, one of the few consistent cross-market terms. US fingering (CYC 1) is UK 4-ply. US sport (CYC 2) is UK 5-ply or light DK. US bulky (CYC 5) is UK chunky. Note: US and UK crochet stitch names also differ, US single crochet equals UK double crochet.",
  },
  {
    q: "What needle or hook size pairs with each yarn weight?",
    a: "CYC 0 Lace: US 000–1 needle, B/1–E/4 hook. CYC 1 Fingering: US 1–3, B/1–E/4 hook. CYC 2 Sport: US 3–5, E/4–7 hook. CYC 3 DK: US 5–7, 7–I/9 hook. CYC 4 Worsted: US 7–9, I/9–K/10.5 hook. CYC 5 Bulky: US 9–11, K/10.5–M/13 hook. CYC 6 Super Bulky: US 11–17, M/13–Q hook. CYC 7 Jumbo: US 17+, Q+ hook.",
  },
  {
    q: "How do I substitute one yarn weight for another?",
    a: "Always substitute within the same CYC weight category for the closest result. If you substitute across categories, adjust your needle or hook size and swatch to match the pattern gauge before starting. Jumping two or more categories changes fabric structure significantly and usually requires recalculating stitch counts and yardage.",
  },
  {
    q: "Why does gauge matter when choosing a yarn weight?",
    a: "Gauge determines the finished size of your project. Two yarns labeled the same CYC weight can produce different gauges depending on fiber, twist, and your individual tension. Always knit or crochet a gauge swatch before starting. Even a half-stitch difference per inch translates to several inches of error on a large project like a sweater or blanket.",
  },
];

// ── Page component ────────────────────────────────────────────────

export default function YarnWeightCalculatorPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* ── Structured Data ── */}
      <SoftwareAppSchema
        name="Yarn Weight Calculator"
        description="Identify any yarn's CYC weight category from wraps per inch or stitch gauge. Covers all 8 standard weights from Lace to Jumbo."
        url="https://fibertools.app/yarn-weight-calculator"
      />
      <FaqSchema items={FAQS} toolName="Yarn Weight Calculator" />
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Yarn Weight Calculator", href: "/yarn-weight-calculator" },
        ]}
      />

      {/* ── Breadcrumb ── */}
      <nav className="flex items-center gap-2 text-sm text-bark-400 mb-4" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-plum-500 transition-colors">Home</Link>
        <span aria-hidden="true">/</span>
        <span className="text-bark-600">Yarn Weight Calculator</span>
      </nav>

      {/* ── Title ── */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl" aria-hidden="true">🧶</span>
          <h1 className="text-2xl sm:text-3xl font-display text-bark-800">
            Yarn Weight Calculator
          </h1>
        </div>
        <p className="text-xs text-bark-400">Last updated: May 1, 2026</p>
        <p className="text-bark-600 text-[15px] leading-relaxed mt-2">
          Identify any yarn&apos;s CYC weight category from wraps per inch (WPI)
          or stitch gauge. Covers all eight standard weights from Lace (0) through
          Jumbo (7).
        </p>
      </div>

      {/* ── Answer block ── */}
      <section
        aria-label="Quick Answer"
        className="border-l-4 border-plum-500 bg-plum-50 dark:bg-plum-900/20 rounded-r-lg p-5 mb-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
          <div>
            <span className="block text-xs font-semibold uppercase tracking-widest text-bark-400 mb-1">
              What is this?
            </span>
            <p className="text-sm text-bark-700 dark:text-bark-200 leading-relaxed">
              A calculator that identifies the CYC yarn weight category from your WPI
              count or gauge swatch measurement.
            </p>
          </div>
          <div>
            <span className="block text-xs font-semibold uppercase tracking-widest text-bark-400 mb-1">
              Who needs it?
            </span>
            <p className="text-sm text-bark-700 dark:text-bark-200 leading-relaxed">
              Any fiber artist working with unlabeled yarn, inherited stash, or
              yarn whose label has been lost.
            </p>
          </div>
          <div>
            <span className="block text-xs font-semibold uppercase tracking-widest text-bark-400 mb-1">
              Bottom line
            </span>
            <p className="text-sm text-bark-700 dark:text-bark-200 leading-relaxed">
              Wrap yarn around a ruler, count wraps in one inch, enter the number, your CYC category appears instantly.
            </p>
          </div>
        </div>
        <time dateTime="2026-05-01" className="block text-right text-xs text-bark-400">
          Last updated: May 1, 2026
        </time>
      </section>

      {/* ── Tool UI (client component) ── */}
      <YarnWeightCalculatorTool />

      {/* ════════════════════════════════════════════════
          GEO CONTENT SECTIONS, SSR static text
          ════════════════════════════════════════════════ */}

      {/* ── Section 1: How the calculator works ── */}
      <section className="mt-12" aria-labelledby="how-it-works">
        <h2 id="how-it-works" className="section-heading">
          How does the yarn weight calculator work?
        </h2>
        <p className="text-bark-600 text-[15px] leading-relaxed mb-1 p-4 bg-sage-50 dark:bg-sage-900/10 border-l-4 border-sage-400 rounded-r-lg">
          Enter your wraps per inch or stitch gauge and the calculator instantly
          maps your measurement to one of the eight{" "}
          <a
            href="https://www.craftyarncouncil.com/standards/yarn-weight-system"
            target="_blank"
            rel="noopener noreferrer"
            className="text-plum-500 hover:underline"
          >
            Craft Yarn Council standard weight categories
          </a>{" "}
          (CYC 0–7), displaying the matching needle and hook sizes, gauge range,
          and project suggestions.
        </p>
        <p className="text-bark-600 text-[15px] leading-relaxed mt-4 mb-3">
          The WPI method is the fastest option for unlabeled yarn. Hold a ruler
          horizontal and wrap your yarn around it for exactly one inch, snug but
          not stretched, no overlapping, no gaps. Count the wraps. That number maps
          directly to a CYC category: 30 or more wraps is Lace (0), around 10 wraps
          is Worsted (4), and 4 or fewer wraps is Jumbo (7). The Craft Yarn Council
          has published standardized WPI ranges for all eight categories, and this
          calculator uses those official ranges.
        </p>
        <p className="text-bark-600 text-[15px] leading-relaxed mb-3">
          The gauge method suits crafters who have already swatched. Knit or crochet
          a small test square with your yarn, measure across 4 inches, and count the
          stitches. Enter that number into the gauge tab. Lace weight produces 33 or
          more stitches across 4 inches, while Worsted produces 16 to 20. Note that
          WPI ranges overlap between adjacent categories, if your result shows two
          possible weights, swatch with needles from both categories to decide which
          fabric you prefer.
        </p>
        <p className="text-bark-600 text-[15px] leading-relaxed">
          Neither method replaces swatching. Fiber content, twist direction, and
          individual tension all affect how a yarn knits or crochets up. The
          calculator gives you a reliable starting point; your swatch confirms the
          final answer.
        </p>
      </section>

      {/* ── Section 2: Best weight for beginners ── */}
      <section className="mt-10" aria-labelledby="beginner-weight">
        <h2 id="beginner-weight" className="section-heading">
          What yarn weight is best for a beginner project?
        </h2>
        <p className="text-bark-600 text-[15px] leading-relaxed mb-1 p-4 bg-sage-50 dark:bg-sage-900/10 border-l-4 border-sage-400 rounded-r-lg">
          Worsted weight (CYC 4) is the standard beginner choice. It works on US
          7–9 needles or an I/9–K/10.5 crochet hook, individual stitches are easy
          to see and count, and most beginner patterns are written for worsted.
        </p>
        <p className="text-bark-600 text-[15px] leading-relaxed mt-4 mb-3">
          Worsted weight (CYC 4) dominates beginner patterns for good reason. The
          stitches are large enough to see clearly when you make a mistake, essential when learning, and the yarn moves smoothly on standard-size
          needles and hooks without splitting or snagging. A worsted-weight scarf
          or hat works up quickly enough to hold a beginner&apos;s attention through
          completion. The{" "}
          <a
            href="https://www.ravelry.com/yarns/weights/worsted"
            target="_blank"
            rel="noopener noreferrer"
            className="text-plum-500 hover:underline"
          >
            Ravelry yarn database
          </a>{" "}
          lists worsted as the most popular weight across all beginner-tagged
          patterns, and most local yarn stores stock the widest variety at this
          weight.
        </p>
        <p className="text-bark-600 text-[15px] leading-relaxed mb-3">
          Bulky weight (CYC 5) is a strong alternative for absolute beginners who
          want fast results. A bulky yarn scarf can be completed in a single evening,
          which builds the positive reinforcement needed to continue learning.
          However, bulky weight is less forgiving of uneven tension, lumpy stitches
          are more visible at larger scale. Start with worsted, and once your tension
          is consistent, explore bulky for quick gift-making.
        </p>
        <p className="text-bark-600 text-[15px] leading-relaxed">
          Avoid Lace (CYC 0) and Fingering (CYC 1) weights until you have basic
          technique down. These thin yarns split easily, mistakes are hard to see,
          and the fine needle and hook sizes (US 000–3) require precise control that
          takes time to develop.
        </p>
      </section>

      {/* ── Section 3: US vs UK / Australian terminology ── */}
      <section className="mt-10" aria-labelledby="us-uk-terms">
        <h2 id="us-uk-terms" className="section-heading">
          How do US yarn weights compare to UK and Australian terminology?
        </h2>
        <p className="text-bark-600 text-[15px] leading-relaxed mb-1 p-4 bg-sage-50 dark:bg-sage-900/10 border-l-4 border-sage-400 rounded-r-lg">
          US worsted = UK aran. US DK = UK DK (consistent across both markets). US
          fingering = UK 4-ply. US bulky = UK chunky. Australian names use ply
          counts: 8-ply = DK, 10-ply = worsted, 12-ply = bulky.
        </p>
        <p className="text-bark-600 text-[15px] leading-relaxed mt-4 mb-3">
          The naming inconsistency across English-speaking markets is one of the
          biggest sources of confusion in international pattern reading. The{" "}
          <a
            href="https://www.craftyarncouncil.com/standards/yarn-weight-system"
            target="_blank"
            rel="noopener noreferrer"
            className="text-plum-500 hover:underline"
          >
            Craft Yarn Council&apos;s standardized weight system
          </a>{" "}
          was designed to resolve this by assigning numeric categories (0–7) that
          apply regardless of national naming convention. When a pattern specifies
          CYC 4, it means worsted in North America, aran in the UK, and 10-ply in
          Australia, the same physical yarn thickness.
        </p>
        <p className="text-bark-600 text-[15px] leading-relaxed mb-3">
          US crochet terminology adds another layer of confusion when reading UK
          patterns. What the UK calls a double crochet (dc) is the same stitch as
          the US single crochet (sc). The UK treble crochet (tr) equals the US
          double crochet (dc). Always verify which terminology system a pattern uses
          before following its stitch instructions, a mislabeled conversion can
          produce a garment that is twice as long or half as wide as intended.
        </p>
        <p className="text-bark-600 text-[15px] leading-relaxed">
          The safest approach with international patterns is to cross-check the
          recommended needle or hook size in millimeters, that measurement is
          consistent worldwide. If the pattern recommends 5.0 mm needles, that is
          US 8 and approximately UK 6, regardless of what weight name is on the
          label.
        </p>
      </section>

      {/* ── Section 4: Needle and hook sizes ── */}
      <section className="mt-10" aria-labelledby="needle-hook-sizes">
        <h2 id="needle-hook-sizes" className="section-heading">
          What needle and hook size should I use for each yarn weight?
        </h2>
        <p className="text-bark-600 text-[15px] leading-relaxed mb-1 p-4 bg-sage-50 dark:bg-sage-900/10 border-l-4 border-sage-400 rounded-r-lg">
          The{" "}
          <a
            href="https://www.craftyarncouncil.com/standards/hooks-and-needles"
            target="_blank"
            rel="noopener noreferrer"
            className="text-plum-500 hover:underline"
          >
            Craft Yarn Council needle and hook size chart
          </a>{" "}
          pairs each CYC category with US and metric sizes. Worsted (CYC 4) uses
          US 7–9 needles (4.5–5.5 mm) or I/9–K/10.5 hooks. DK (CYC 3) uses US
          5–7 needles (3.75–4.5 mm) or 7–I/9 hooks.
        </p>
        <p className="text-bark-600 text-[15px] leading-relaxed mt-4 mb-3">
          These are recommended starting sizes, not absolute rules. Your personal
          tension, how tightly or loosely you hold the yarn, determines whether
          you need to go up or down a needle size to hit pattern gauge. A tight
          knitter working worsted weight may need US 8 or 9 needles where the
          pattern specifies US 7. A loose crocheter might use an H/8 hook where the
          pattern calls for I/9. Always swatch and measure before committing to the
          full project.
        </p>
        <p className="text-bark-600 text-[15px] leading-relaxed mb-3">
          Crochet hooks follow US letter or number sizing. B/1 is the smallest
          standard size (2.25 mm), progressing through G/6, H/8, I/9, J/10,
          K/10.5, and M/13 up to jumbo sizes. The letter-based US system has no
          consistent metric equivalent for all manufacturers, verify millimeter
          size when possible, especially for fine-weight projects where a fraction
          of a millimeter changes gauge noticeably.
        </p>
        <p className="text-bark-600 text-[15px] leading-relaxed">
          For lace weight crochet (CYC 0), a steel hook in the B/1 to E/4 range
          (2.25–3.5 mm) is standard. Steel hooks use a reverse numbering system:
          larger numbers mean smaller hooks, unlike the letter/number system used
          for all other weights. This is another cross-terminology inconsistency
          worth noting before purchasing tools for a first lace project.
        </p>
      </section>

      {/* ── Section 5: Substituting yarn weights ── */}
      <section className="mt-10" aria-labelledby="substituting-weights">
        <h2 id="substituting-weights" className="section-heading">
          How do I substitute one yarn weight for another?
        </h2>
        <p className="text-bark-600 text-[15px] leading-relaxed mb-1 p-4 bg-sage-50 dark:bg-sage-900/10 border-l-4 border-sage-400 rounded-r-lg">
          Substitute within the same CYC weight category whenever possible. If you
          must go one category up or down, adjust needle or hook size and swatch to
          match pattern gauge. Jumping two or more categories requires recalculating
          stitch counts and yardage.
        </p>
        <p className="text-bark-600 text-[15px] leading-relaxed mt-4 mb-3">
          The first step in any substitution is to identify both yarns&apos; CYC
          categories. Use this calculator for unlabeled yarn, or check the label
          band for the category number (the skein icon with a number 0–7). Once you
          know both weights,{" "}
          <a
            href="https://yarnsub.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-plum-500 hover:underline"
          >
            YarnSub
          </a>{" "}
          is a free tool that cross-references substitute yarns by weight, fiber,
          and yardage so you can find commercially available equivalents.
        </p>
        <p className="text-bark-600 text-[15px] leading-relaxed mb-3">
          If the substitution is within the same CYC category, your main variables
          are fiber content and yardage per skein. A worsted-weight merino wool and
          a worsted-weight cotton are both CYC 4, but cotton has fewer yards per
          100g due to its higher density, you will need more skeins. Wool has
          memory and elasticity; cotton does not. These differences affect drape,
          gauge stability over time, and how the finished fabric blocks and washes.
          Always swatch with the actual substitute yarn.
        </p>
        <p className="text-bark-600 text-[15px] leading-relaxed">
          See the{" "}
          <Link href="/yarn-weight-chart" className="text-plum-500 hover:underline">
            Yarn Weight Chart
          </Link>{" "}
          for a side-by-side comparison of all CYC categories and substitution
          compatibility. Use the{" "}
          <Link href="/gauge-calculator" className="text-plum-500 hover:underline">
            Gauge Calculator
          </Link>{" "}
          to verify your swatch numbers match the pattern before starting, and the{" "}
          <Link href="/yarn-calculator" className="text-plum-500 hover:underline">
            Yarn Yardage Calculator
          </Link>{" "}
          to recalculate how much substitute yarn to buy.
        </p>
      </section>

      {/* ── Section 6: Why gauge matters ── */}
      <section className="mt-10" aria-labelledby="why-gauge-matters">
        <h2 id="why-gauge-matters" className="section-heading">
          Why does gauge matter when choosing a yarn weight?
        </h2>
        <p className="text-bark-600 text-[15px] leading-relaxed mb-1 p-4 bg-sage-50 dark:bg-sage-900/10 border-l-4 border-sage-400 rounded-r-lg">
          Gauge determines the finished dimensions of your project. A half-stitch
          difference per inch becomes several inches of error across a full sweater
          or blanket. Two yarns in the same CYC category can produce different
          gauges depending on fiber, twist, and your personal tension.
        </p>
        <p className="text-bark-600 text-[15px] leading-relaxed mt-4 mb-3">
          Gauge is measured as the number of stitches (and rows) per 4 inches in
          the pattern&apos;s specified stitch. Each CYC category has a standard gauge
          range: Worsted (CYC 4) targets 16–20 stitches per 4 inches, DK (CYC 3)
          targets 21–24. If your swatch produces 22 stitches at 4 inches with a
          yarn labeled DK, but the pattern is written for 20 stitches at 4 inches
          in worsted, your finished piece will be about 10% smaller than intended
          in every direction. On a 20-inch-wide sweater body, that is a 2-inch
          discrepancy, enough to change the fit entirely.
        </p>
        <p className="text-bark-600 text-[15px] leading-relaxed mb-3">
          Interweave and other major pattern publishers require a gauge swatch for
          every garment pattern precisely because yarn behavior varies this much
          between brands, fibers, and knitters. The{" "}
          <a
            href="https://www.interweave.com/article/knitting/gauge/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-plum-500 hover:underline"
          >
            Interweave guide to gauge
          </a>{" "}
          explains how to measure accurately and adjust needle size when your swatch
          is off. For accessories like hats and mittens, even a one-stitch
          difference per inch can mean the difference between a snug fit and a
          too-loose piece.
        </p>
        <p className="text-bark-600 text-[15px] leading-relaxed">
          Wash and block your swatch before measuring, some yarns (especially
          natural fibers like wool and cotton) relax significantly after washing.
          Superwash wool, for instance, can grow noticeably in both dimensions after
          the first wash. Measuring an unwashed swatch against a pattern designed
          for washed fabric can add another source of sizing error. Swatching
          completely, wash, dry, then measure, is the only reliable way to confirm
          gauge.
        </p>
      </section>

      {/* ── References ── */}
      <section className="mt-12">
        <h2 className="section-heading">References and Industry Standards</h2>
        <ul className="space-y-2 text-sm text-bark-500">
          <li>
            <a
              href="https://www.craftyarncouncil.com/standards/yarn-weight-system"
              target="_blank"
              rel="noopener noreferrer"
              className="text-plum-500 hover:underline"
            >
              Craft Yarn Council, Yarn Weight System
            </a>
            {", Official CYC categories 0–7 with gauge and needle ranges"}
          </li>
          <li>
            <a
              href="https://www.craftyarncouncil.com/standards/hooks-and-needles"
              target="_blank"
              rel="noopener noreferrer"
              className="text-plum-500 hover:underline"
            >
              Craft Yarn Council, Needle & Hook Size Chart
            </a>
            {", US, metric, and UK needle sizes by CYC category"}
          </li>
          <li>
            <a
              href="https://www.ravelry.com/yarns/weights"
              target="_blank"
              rel="noopener noreferrer"
              className="text-plum-500 hover:underline"
            >
              Ravelry, Yarn Weight Database
            </a>
            {", Browse yarn by CYC weight category across thousands of brands"}
          </li>
          <li>
            <a
              href="https://yarnsub.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-plum-500 hover:underline"
            >
              YarnSub
            </a>
            {", Free yarn substitution finder matching by weight, fiber, and yardage"}
          </li>
          <li>
            <a
              href="https://www.interweave.com/article/knitting/gauge/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-plum-500 hover:underline"
            >
              Interweave, How to Measure Knitting Gauge
            </a>
            {", Practical guide to swatching and gauge adjustment"}
          </li>
        </ul>
      </section>

      {/* ── Related tools ── */}
      <section className="mt-12">
        <h2 className="section-heading">Related Fiber Arts Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              href: "/yarn-weight-chart",
              icon: "⚖️",
              name: "Yarn Weight & Substitution Guide",
              desc: "Interactive chart of all 8 CYC weights with US, UK, and Australian names",
            },
            {
              href: "/gauge-calculator",
              icon: "📐",
              name: "Gauge Calculator",
              desc: "Calculate your gauge from a swatch or resize a pattern to a new gauge",
            },
            {
              href: "/yarn-calculator",
              icon: "🧮",
              name: "Yarn Yardage Calculator",
              desc: "Estimate how much yarn you need for any project size",
            },
            {
              href: "/needle-converter",
              icon: "🪡",
              name: "Needle & Hook Converter",
              desc: "Convert between US, metric, and UK needle and hook sizes",
            },
          ].map((t) => (
            <Link key={t.href} href={t.href} className="tool-card group">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0" aria-hidden="true">
                  {t.icon}
                </span>
                <div>
                  <h3 className="font-medium text-bark-700 group-hover:text-plum-500 transition-colors">
                    {t.name}
                  </h3>
                  <p className="text-sm text-bark-400 mt-1">{t.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FAQ (visible Q&A) ── */}
      <section className="mt-12">
        <h2 className="section-heading">Frequently Asked Questions</h2>
        <dl className="space-y-6">
          {FAQS.map((faq) => (
            <div key={faq.q}>
              <dt className="font-semibold text-bark-700 dark:text-cream-100 text-[15px] mb-1">
                {faq.q}
              </dt>
              <dd className="text-bark-500 dark:text-bark-300 text-[15px] leading-relaxed">
                {faq.a}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
