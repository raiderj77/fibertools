import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbSchema, FaqSchema } from "@/components/StructuredData";

const LAST_REVIEWED = "August 7, 2026";

export const metadata: Metadata = {
  title: "Fiber Arts Formula Library: Gauge, Yarn, Circles and Fit",
  description:
    "See the formulas behind FiberTools calculators, with worked examples for gauge, stitch counts, swatch-based yarn estimates, circles, socks and skeins.",
  keywords: [
    "knitting formulas",
    "crochet formulas",
    "gauge calculation formula",
    "yarn yardage formula",
    "crochet circle formula",
    "sock stitch count formula",
  ],
  alternates: { canonical: "/formula-library" },
  openGraph: {
    title: "Fiber Arts Formula Library",
    description: "Transparent formulas and worked examples behind FiberTools calculators.",
    url: "https://fibertools.app/formula-library",
    type: "article",
  },
};

const FAQS = [
  { q: "Are calculator results exact?", a: "They are planning estimates based on the measurements you enter. Fiber, stitch pattern, tension, blocking and finishing can change the real result, so a project swatch remains the best evidence." },
  { q: "Why does FiberTools use a measured swatch for blanket yarn?", a: "Gauge alone measures dimensions, not yarn consumption. Weighing a swatch captures the combined effect of yarn, fiber, stitch pattern, hook or needle, and personal tension." },
  { q: "Why are stitches rounded?", a: "A fraction of a stitch cannot be worked. Tools round to a whole stitch and, where requested, to a pattern repeat or construction multiple." },
];

const formulas = [
  {
    id: "gauge",
    title: "Gauge from a swatch",
    formula: "stitches per inch = stitches counted ÷ measured width",
    second: "rows per inch = rows counted ÷ measured height",
    example: "If 22 stitches span 4 inches, the gauge is 22 ÷ 4 = 5.5 stitches per inch.",
    link: "/gauge-calculator",
    label: "Open the gauge calculator",
  },
  {
    id: "stitch-count",
    title: "Stitches for a target width",
    formula: "raw stitch count = target width × stitches per inch",
    second: "For an at-or-above width checkpoint, round upward to a whole stitch and then to the next compatible pattern count; review the modeled width.",
    example: "At 5.5 stitches per inch, a 36-inch width starts at 36 × 5.5 = 198 stitches before construction adjustments.",
    link: "/cast-on-calculator",
    label: "Open the cast-on calculator",
  },
  {
    id: "gauge-conversion",
    title: "Resize a stitch count for your gauge",
    formula: "new stitch count = original stitches × your gauge ÷ pattern gauge",
    second: "This proportion scales only the entered count. Confirm shaping, construction, repeats, and modeled dimensions separately.",
    example: "A 120-stitch section written at 20 stitches per 4 inches becomes 120 × 22 ÷ 20 = 132 stitches at your 22-stitch gauge.",
    link: "/gauge-calculator",
    label: "Scale an entered count",
  },
  {
    id: "swatch-yarn",
    title: "Swatch-based blanket yarn estimate",
    formula: "project grams = swatch grams × project area ÷ swatch area",
    second: "planning grams = project grams × 1.10; yards = planning grams × label yards ÷ label grams",
    example: "A 4 × 4-inch swatch weighing 8 g scaled to a 40 × 50-inch blanket estimates 1,000 g, then 1,100 g with the transparent 10% planning buffer.",
    link: "/blanket-calculator",
    label: "Estimate blanket yarn",
  },
  {
    id: "skeins",
    title: "Whole skeins to buy",
    formula: "skeins by length = ceiling(total yards ÷ yards per skein)",
    second: "For swatch-based estimates, FiberTools also checks weight and uses the larger whole-skein result.",
    example: "1,050 yards with 220 yards per skein gives ceiling(1,050 ÷ 220) = 5 skeins.",
    link: "/yarn-calculator",
    label: "Calculate whole skeins",
  },
  {
    id: "circle",
    title: "Circle circumference and diameter",
    formula: "circumference = π × diameter",
    second: "diameter = circumference ÷ π",
    example: "A 22-inch circumference corresponds to a geometric diameter of about 22 ÷ π = 7.0 inches before ease or fabric behavior.",
    link: "/circle-calculator",
    label: "Plan a crochet circle",
  },
  {
    id: "sock",
    title: "Sock target circumference",
    formula: "target circumference = measured foot circumference × (1 − negative ease)",
    second: "stitch count = target circumference × stitches per inch, rounded for construction",
    example: "A 9-inch foot with 10% negative ease targets 8.1 inches. At 8 stitches per inch, that is 64.8 stitches before repeat rounding.",
    link: "/sock-calculator",
    label: "Calculate sock stitches",
  },
];

export default function FormulaLibraryPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Formula Library", href: "/formula-library" }]} />
      <FaqSchema items={FAQS} toolName="Fiber Arts Formula Library" />

      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-bark-500 dark:text-cream-400">
        <Link href="/" className="hover:text-plum-500">Home</Link> <span aria-hidden="true">/</span> Formula Library
      </nav>

      <header className="max-w-3xl mb-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-plum-500 mb-3">Show the work</p>
        <h1 className="font-display text-4xl sm:text-5xl text-bark-800 dark:text-cream-100 mb-5">Fiber arts formula library</h1>
        <p className="text-lg leading-relaxed text-bark-600 dark:text-cream-300 mb-4">The math behind FiberTools, written so you can audit it, calculate by hand, or understand why a result changes.</p>
        <p className="text-sm text-bark-500 dark:text-cream-400">Last reviewed: {LAST_REVIEWED}</p>
      </header>

      <aside className="rounded-2xl border border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20 p-6 mb-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-2">A swatch is the strongest input</h2>
        <p className="text-sm leading-relaxed text-bark-700 dark:text-cream-300">These formulas are transparent planning estimates, not promises. Yarn construction, fiber, stitch pattern, personal tension, blocking and finishing all affect the finished project. Make and treat a swatch the same way you will treat the project.</p>
      </aside>

      <section aria-labelledby="formula-index" className="mb-12">
        <h2 id="formula-index" className="text-2xl font-semibold text-bark-800 dark:text-cream-100 mb-5">Formula index</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {formulas.map((item) => (
            <a key={item.id} href={`#${item.id}`} className="card block p-5 hover:border-plum-300 transition-colors">
              <span className="font-semibold text-bark-800 dark:text-cream-100">{item.title}</span>
            </a>
          ))}
        </div>
      </section>

      <div className="space-y-8">
        {formulas.map((item) => (
          <section key={item.id} id={item.id} className="scroll-mt-20 rounded-2xl border border-cream-300 dark:border-bark-700 bg-white dark:bg-bark-800 p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-bark-800 dark:text-cream-100 mb-5">{item.title}</h2>
            <div className="space-y-3 mb-5">
              <p className="rounded-lg bg-cream-100 dark:bg-bark-900 px-4 py-3 font-mono text-sm text-bark-800 dark:text-cream-200">{item.formula}</p>
              <p className="rounded-lg bg-cream-100 dark:bg-bark-900 px-4 py-3 font-mono text-sm text-bark-800 dark:text-cream-200">{item.second}</p>
            </div>
            <p className="text-sm leading-relaxed text-bark-600 dark:text-cream-300 mb-5"><strong>Worked example:</strong> {item.example}</p>
            <Link href={item.link} className="font-semibold text-plum-500 hover:underline">{item.label} →</Link>
          </section>
        ))}
      </div>

      <section aria-labelledby="standards" className="mt-12">
        <h2 id="standards" className="text-2xl font-semibold text-bark-800 dark:text-cream-100 mb-4">Standards and measurement sources</h2>
        <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4">FiberTools uses the Craft Yarn Council category system as a reference for yarn weights, common gauge ranges and hook or needle ranges. The council describes those ranges as guidelines and tells makers to follow pattern gauge.</p>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li><a href="https://www.craftyarncouncil.com/standards/yarn-weight-system" target="_blank" rel="noopener noreferrer" className="text-plum-500 underline">Craft Yarn Council Standard Yarn Weight System</a></li>
          <li><a href="https://www.craftyarncouncil.com/standards/how-measure-wraps-inch-wpi" target="_blank" rel="noopener noreferrer" className="text-plum-500 underline">Craft Yarn Council WPI measurement guide</a></li>
          <li><a href="https://www.craftyarncouncil.com/standards/hooks-and-needles" target="_blank" rel="noopener noreferrer" className="text-plum-500 underline">Craft Yarn Council hook and needle sizing</a></li>
        </ul>
      </section>

      <section aria-labelledby="faq" className="mt-12">
        <h2 id="faq" className="text-2xl font-semibold text-bark-800 dark:text-cream-100 mb-5">Frequently asked questions</h2>
        <div className="space-y-4">
          {FAQS.map((item) => (
            <article key={item.q} className="card p-6">
              <h3 className="font-semibold text-bark-800 dark:text-cream-100 mb-2">{item.q}</h3>
              <p className="text-sm leading-relaxed text-bark-600 dark:text-cream-300">{item.a}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
