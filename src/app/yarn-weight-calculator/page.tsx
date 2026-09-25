import type { Metadata } from "next";
import Link from "next/link";
import { FaqSchema, BreadcrumbSchema, SoftwareAppSchema } from "@/components/StructuredData";
import YarnWeightCalculatorTool from "./YarnWeightCalculatorTool";

// ── Metadata ──────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: { absolute: "Yarn Weight Calculator: WPI & Gauge to CYC Category" },
  description:
    "Estimate possible CYC categories from WPI or knitting stockinette gauge. Covers all 8 weights: Lace through Jumbo. Free, instant, no signup.",
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
      "Estimate possible CYC categories from WPI or knitting stockinette gauge. All 8 weights covered. Free and instant.",
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
      "Estimate possible CYC categories from WPI or knitting stockinette gauge. Free, instant, no signup.",
    images: ["https://fibertools.app/og-image.png"],
  },
};

// ── FAQ data (drives both FAQPage schema and visible Q&A sections) ──

const FAQS = [
  {
    q: "What yarn weight is right for a beginner project?",
    a: "Choose the yarn specified by a beginner pattern. CYC Medium (4), often called worsted or aran, has suggested knitting needles of 4.5–5.5 mm and crochet hooks of 5.5–6.5 mm; swatch to meet the pattern gauge.",
  },
  {
    q: "How do US CYC yarn weights compare to UK terminology?",
    a: "US worsted (CYC 4) is UK aran. US DK (CYC 3) is UK DK, one of the few consistent cross-market terms. US fingering (CYC 1) is UK 4-ply. US sport (CYC 2) is UK 5-ply or light DK. US bulky (CYC 5) is UK chunky. Note: US and UK crochet stitch names also differ, US single crochet equals UK double crochet.",
  },
  {
    q: "What needle or hook size pairs with each yarn weight?",
    a: "CYC 0 Lace: US 000–1 needle; steel 6–8 hook (1.4–1.6 mm) or regular B/1 (2.25 mm). CYC 1 Fingering: US 1–3, B/1–E/4 hook. CYC 2 Sport: US 3–5, E/4–7 hook. CYC 3 DK: US 5–7, 7–I/9 hook. CYC 4 Worsted: US 7–9, I/9–K/10.5 hook. CYC 5 Bulky: US 9–11, K/10.5–M/13 hook. CYC 6 Super Bulky: US 11–17, M/13–Q hook. CYC 7 Jumbo: US 17+, Q+ hook.",
  },
  {
    q: "How do I substitute one yarn weight for another?",
    a: "Matching categories do not guarantee interchangeable yarn. Compare the yarn labels, fiber and care, then swatch in the pattern stitch to check gauge, drape, and finished fabric. Category differences alone cannot prescribe a needle adjustment or yardage requirement.",
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
        description="Estimate possible CYC categories from WPI or knitting stockinette gauge. Covers all 8 standard weights from Lace to Jumbo."
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
        <p className="text-xs text-bark-400">Last updated: September 5, 2026</p>
        <p className="text-bark-600 text-[15px] leading-relaxed mt-2">
          Estimate possible CYC yarn weight categories from wraps per inch (WPI)
          or knitting stockinette gauge. Covers all eight standard weights from Lace (0) through
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
              A reference that estimates possible CYC yarn weight categories from your WPI
              count or knitting stockinette swatch measurement.
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
              Wrap yarn around a ruler, count wraps in one inch, enter the number, possible categories appear; swatch before choosing a yarn.
            </p>
          </div>
        </div>
        <time dateTime="2026-09-05" className="block text-right text-xs text-bark-400">
          Last updated: September 5, 2026
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
        <p className="text-bark-600 text-[15px] leading-relaxed">Enter WPI or knitting stockinette stitches per 4 inches to compare with CYC ranges. WPI is subjective and overlapping categories all remain possible. Gauge mode uses knitting only: lace is 33–40 stockinette stitches per 4 inches. Measurements outside a listed range are not assigned a category. Neither method establishes the fiber content or guarantees substitution.</p>
      </section>

      {/* ── Section 2: Best weight for beginners ── */}
      <section className="mt-10" aria-labelledby="beginner-weight">
        <h2 id="beginner-weight" className="section-heading">
          What yarn weight is best for a beginner project?
        </h2>
        <p className="text-bark-600 text-[15px] leading-relaxed">Start with the yarn and tools specified by a beginner pattern. Smooth yarn with visible stitches can make learning easier. No weight is universally best for every beginner or project; make a swatch before committing.</p>
      </section>

      {/* ── Section 3: US vs UK / Australian terminology ── */}
      <section className="mt-10" aria-labelledby="us-uk-terms">
        <h2 id="us-uk-terms" className="section-heading">
          How do US yarn weights compare to UK and Australian terminology?
        </h2>
        <p className="text-bark-600 text-[15px] leading-relaxed">Regional names such as aran, worsted, DK, and ply labels are approximate comparisons, not a guarantee of identical thickness or gauge. Check the actual yarn label and pattern gauge. UK double crochet is US single crochet; confirm the pattern terminology before converting stitches.</p>
      </section>

      {/* ── Section 4: Needle and hook sizes ── */}
      <section className="mt-10" aria-labelledby="needle-hook-sizes">
        <h2 id="needle-hook-sizes" className="section-heading">
          What needle and hook size should I use for each yarn weight?
        </h2>
        <p className="text-bark-600 text-[15px] leading-relaxed">CYC needle and hook ranges are guidelines, not requirements. For lace, the chart lists 1.5–2.25 mm knitting needles, steel crochet hooks 1.4–1.6 mm, or a regular 2.25 mm hook. Brand letter and number sizes vary: check the marked millimetres and swatch to meet the pattern gauge.</p>
      </section>

      {/* ── Section 5: Substituting yarn weights ── */}
      <section className="mt-10" aria-labelledby="substituting-weights">
        <h2 id="substituting-weights" className="section-heading">
          How do I substitute one yarn weight for another?
        </h2>
        <p className="text-bark-600 text-[15px] leading-relaxed">A shared CYC category does not establish equivalent gauge, drape, or yardage per gram. Compare both labels and care instructions, then wash and measure a representative swatch in the pattern stitch. Different fibers and constructions can behave differently even within the same category.</p>
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
          in worsted, the unchanged stitch count models a width of 20 / 22 times the intended width. A nominal 20-inch width becomes about 18.18 inches, approximately 9.1% narrower. This says nothing about height; row gauge needs a separate comparison, enough to change the fit entirely.
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
              desc: "Calculate measured gauge or proportionally scale an entered count, then review repeats, shaping, and fit separately",
            },
            {
              href: "/yarn-calculator",
              icon: "🧮",
              name: "Yarn Yardage Calculator",
              desc: "Scale measured swatch use to a flat rectangular project",
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
