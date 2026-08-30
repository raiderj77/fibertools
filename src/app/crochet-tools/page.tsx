import type { Metadata } from "next";
import Link from "next/link";
import { getToolBySlug, CATEGORY_COLORS, CATEGORY_LABELS, type Tool } from "@/lib/tools";

const CROCHET_SLUGS = [
  "yarn-calculator",
  "gauge-calculator",
  "needle-converter",
  "yarn-weight-chart",
  "blanket-calculator",
  "increase-decrease-calculator",
  "circle-calculator",
  "amigurumi-pattern-checker",
  "amigurumi-shapes",
  "granny-square-planner",
  "c2c-calculator",
  "uk-to-us-converter",
  "color-pooling-calculator",
  "stitch-counter",
  "abbreviation-glossary",
  "stash-estimator",
  "project-cost-calculator",
  "stripe-generator",
];

const crochetTools = CROCHET_SLUGS.map((s) => getToolBySlug(s)).filter(
  (t): t is Tool => t !== undefined && t.ready
);

export const metadata: Metadata = {
  title: "Free Crochet Calculators & Tools (2026)",
  description:
    "Free online crochet calculators for yarn, gauge, hooks, amigurumi, granny squares, and more. No signup required.",
  keywords: [
    "crochet calculators",
    "crochet tools online",
    "free crochet calculator",
    "amigurumi calculator",
    "granny square calculator",
    "crochet yarn calculator",
    "crochet gauge calculator",
    "crochet hook size chart",
  ],
  openGraph: {
    title: "Free Crochet Calculators & Tools (2026)",
    description:
      "Free online crochet calculators for yarn, gauge, hooks, amigurumi, granny squares, and more. No signup required.",
    url: "https://fibertools.app/crochet-tools",
    images: [
      {
        url: "https://fibertools.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Free Crochet Calculators & Tools, FiberTools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Crochet Calculators & Tools (2026)",
    description:
      "Free online crochet calculators for yarn, gauge, hooks, amigurumi, granny squares, and more. No signup required.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/crochet-tools" },
};

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link href={`/${tool.slug}`} className="tool-card group">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-4xl">{tool.icon}</span>
          <span
            className={`inline-block px-2.5 py-1 text-[11px] font-medium rounded-full ${CATEGORY_COLORS[tool.category]}`}
          >
            {CATEGORY_LABELS[tool.category]}
          </span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-bark-700 dark:text-cream-200 group-hover:text-sage-600 dark:group-hover:text-sage-400 transition-colors mb-1.5">
            {tool.shortName}
          </h3>
          <p className="text-sm text-bark-500 dark:text-bark-400 leading-relaxed">
            {tool.description}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default function CrochetToolsPage() {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Free Crochet Calculators & Tools",
    description:
      "Free online crochet calculators for yarn, gauge, hooks, amigurumi, granny squares, and more.",
    url: "https://fibertools.app/crochet-tools",
    numberOfItems: crochetTools.length,
    hasPart: crochetTools.map((t) => ({
      "@type": "WebApplication",
      name: t.name,
      url: `https://fibertools.app/${t.slug}`,
      applicationCategory: "UtilityApplication",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://fibertools.app" },
      { "@type": "ListItem", position: 2, name: "Crochet Tools" },
    ],
  };

  const garmentTools = crochetTools.filter((t) =>
    ["amigurumi-pattern-checker", "amigurumi-shapes", "circle-calculator", "increase-decrease-calculator", "granny-square-planner", "c2c-calculator"].includes(t.slug)
  );
  const blanketTools = crochetTools.filter((t) =>
    ["blanket-calculator", "stripe-generator", "color-pooling-calculator", "stash-estimator", "project-cost-calculator"].includes(t.slug)
  );
  const referenceTools = crochetTools.filter((t) =>
    ["yarn-calculator", "gauge-calculator", "needle-converter", "yarn-weight-chart", "stitch-counter", "abbreviation-glossary", "uk-to-us-converter"].includes(t.slug)
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-bark-400 dark:text-bark-500 mb-4" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-sage-600 dark:hover:text-sage-400 transition-colors">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-bark-600 dark:text-cream-400">Crochet Tools</span>
      </nav>

      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-bark-800 dark:text-cream-100 leading-tight mb-1">
          Free Crochet Calculators & Tools
        </h1>
        <p className="text-sm text-gray-600 mt-1 mb-4 text-center">Last updated: July 13, 2026</p>
        <div className="space-y-4 text-bark-600 dark:text-cream-300 max-w-3xl">
          <p className="text-lg leading-relaxed">
            Crochet projects can involve material estimates, gauge measurements, compatible stitch counts,
            and round-by-round arithmetic. The needed model depends on the actual construction, so each
            calculator states the inputs and limits it supports instead of inferring a whole project.
          </p>
          <p className="leading-relaxed">
            FiberTools crochet calculators use the inputs and arithmetic models stated on each page.
            The yarn calculator scales yarn length actually consumed by a representative swatch to a
            flat rectangle; it does not infer consumption from stitch gauge or choose a hook. The gauge
            calculator compares measured proportions and counts, but it cannot prescribe an exact hook
            change because yarn, stitch pattern, technique, and maker tension also affect the fabric.
            Blanket sizes use nominal presets and measured-swatch inputs. Its displayed 10% planning
            allowance is part of the model, not a measurement of borders, joins, or every source of waste.
          </p>
          <p className="leading-relaxed">
            The construction tools provide bounded arithmetic references for their displayed models.
            The amigurumi and circle tools generate basic count schedules that still require a suitable
            pattern and physical sample. The granny square planner rounds a target up to a nominal grid,
            counts unique internal seam distance, and can scale measured yarn per square; it does not
            infer joining yarn or guarantee finished dimensions.
          </p>
          <p className="leading-relaxed">
            Treat each result according to the inputs and limitations shown by that tool. Rounded counts,
            nominal dimensions, and measured-input yarn scenarios are planning references rather than
            exact finished-size or purchase guarantees. Every self-service calculator listed here is free.
            Optional professional reviews and project downloads are separate paid offers.
          </p>
        </div>
      </div>

      {/* Reference & Essentials */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-2xl font-display font-bold text-bark-800 dark:text-cream-100">
            Crochet Essentials and Reference Tools
          </h2>
        </div>
        <p className="text-sm text-bark-500 dark:text-bark-400 mb-6 max-w-2xl">
          Yarn estimation, gauge calculation, hook size conversion, and stitch references, the tools you reach for on every project.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {referenceTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      {/* Shapes & Construction */}
      <section className="mb-12">
        <h2 className="text-2xl font-display font-bold text-bark-800 dark:text-cream-100 mb-2">
          Crochet Shapes and Construction Calculators
        </h2>
        <p className="text-sm text-bark-500 dark:text-bark-400 mb-6 max-w-2xl">
          Calculators for amigurumi, flat circles, increase/decrease spacing, granny squares, and corner-to-corner blankets.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {garmentTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      {/* Blanket & Project Planning */}
      <section className="mb-12">
        <h2 className="text-2xl font-display font-bold text-bark-800 dark:text-cream-100 mb-2">
          Blanket & Project Planning
        </h2>
        <p className="text-sm text-bark-500 dark:text-bark-400 mb-6 max-w-2xl">
          Size your blanket, plan stripe patterns, estimate costs, and figure out how much yarn is left in that partial skein.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {blanketTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      <section className="mb-12 rounded-2xl border border-plum-200 bg-plum-50 p-6 dark:border-plum-800 dark:bg-plum-950/20 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-plum-600 dark:text-plum-300">For crochet pattern designers</p>
        <h2 className="mt-2 text-2xl font-display font-bold text-bark-800 dark:text-cream-100">Need a person to preflight the whole pattern?</h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-bark-600 dark:text-bark-400">
          The $39 Designer Pattern Preflight pilot reviews one version of one crochet pattern, up to 10 pages, for supported arithmetic, numbering, terminology, missing details, and areas that need human review before testers or professional tech editing. It includes one written report.
        </p>
        <Link href="/designer-pattern-preflight" className="btn-primary mt-5">See the manual preflight pilot</Link>
      </section>

      {/* Cross-link to knitting */}
      <div className="mt-8 p-6 bg-rose-50 dark:bg-rose-900/20 rounded-2xl border border-rose-200 dark:border-rose-800 text-center">
        <p className="text-bark-700 dark:text-cream-200 font-medium">
          Also a knitter?{" "}
          <Link
            href="/knitting-tools"
            className="text-sage-600 dark:text-sage-400 hover:underline font-semibold"
          >
            See our Knitting Calculators →
          </Link>
        </p>
      </div>
    </div>
  );
}
