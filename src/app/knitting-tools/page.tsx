import type { Metadata } from "next";
import Link from "next/link";
import { getToolBySlug, CATEGORY_COLORS, CATEGORY_LABELS, type Tool } from "@/lib/tools";

const KNITTING_SLUGS = [
  "yarn-calculator",
  "gauge-calculator",
  "needle-converter",
  "yarn-weight-chart",
  "cast-on-calculator",
  "hat-calculator",
  "sock-calculator",
  "sleeve-calculator",
  "raglan-calculator",
  "increase-decrease-calculator",
  "blanket-calculator",
  "stitch-counter",
  "wpi-calculator",
  "blocking-calculator",
  "stash-estimator",
  "project-cost-calculator",
  "stripe-generator",
  "abbreviation-glossary",
];

const knittingTools = KNITTING_SLUGS.map((s) => getToolBySlug(s)).filter(
  (t): t is Tool => t !== undefined && t.ready
);

export const metadata: Metadata = {
  title: "Free Knitting Calculators & Tools (2026)",
  description:
    "Free online knitting calculators for yarn, gauge, needles, sweaters, socks, and hats. No signup required.",
  keywords: [
    "knitting calculators",
    "knitting tools online",
    "free knitting calculator",
    "knitting gauge calculator",
    "sock knitting calculator",
    "hat knitting calculator",
    "raglan calculator",
    "cast on calculator",
  ],
  openGraph: {
    title: "Free Knitting Calculators & Tools (2026)",
    description:
      "Free online knitting calculators for yarn, gauge, needles, sweaters, socks, and hats. No signup required.",
    url: "https://fibertools.app/knitting-tools",
    images: [
      {
        url: "https://fibertools.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Free Knitting Calculators & Tools — FiberTools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Knitting Calculators & Tools (2026)",
    description:
      "Free online knitting calculators for yarn, gauge, needles, sweaters, socks, and hats. No signup required.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/knitting-tools" },
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

export default function KnittingToolsPage() {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Free Knitting Calculators & Tools",
    description:
      "Free online knitting calculators for yarn, gauge, needles, sweaters, socks, and hats.",
    url: "https://fibertools.app/knitting-tools",
    numberOfItems: knittingTools.length,
    hasPart: knittingTools.map((t) => ({
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
      { "@type": "ListItem", position: 2, name: "Knitting Tools" },
    ],
  };

  const garmentTools = knittingTools.filter((t) =>
    ["hat-calculator", "sock-calculator", "sleeve-calculator", "raglan-calculator", "cast-on-calculator"].includes(t.slug)
  );
  const accessoryTools = knittingTools.filter((t) =>
    ["blanket-calculator", "stripe-generator", "blocking-calculator", "stash-estimator", "project-cost-calculator", "increase-decrease-calculator"].includes(t.slug)
  );
  const referenceTools = knittingTools.filter((t) =>
    ["yarn-calculator", "gauge-calculator", "needle-converter", "yarn-weight-chart", "stitch-counter", "wpi-calculator", "abbreviation-glossary"].includes(t.slug)
  );

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
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
        <span className="text-bark-600 dark:text-cream-400">Knitting Tools</span>
      </nav>

      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-bark-800 dark:text-cream-100 leading-tight mb-1">
          Free Knitting Calculators & Tools
        </h1>
        <p className="text-sm text-gray-500 mt-1 mb-4 text-center">Last updated: March 16, 2026</p>
        <p className="text-lg text-bark-600 dark:text-cream-300 max-w-3xl leading-relaxed">
          Knitting is precision craft — every stitch count, needle size, and yardage estimate matters.
          These free calculators take the guesswork out of your projects, from cast-on to bind-off.
          Plan sweaters, socks, hats, and blankets with accurate math and no signup required.
        </p>
      </div>

      {/* Garment Tools */}
      <section className="mb-12">
        <h2 className="text-2xl font-display font-bold text-bark-800 dark:text-cream-100 mb-2">
          Knitting Garment and Construction Calculators
        </h2>
        <p className="text-sm text-bark-500 dark:text-bark-400 mb-6 max-w-2xl">
          Cast-on counts, hat crowns, sock construction, sleeve shaping, and raglan yoke math — everything you need for fitted knitting.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {garmentTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      {/* Accessory & Project Tools */}
      <section className="mb-12">
        <h2 className="text-2xl font-display font-bold text-bark-800 dark:text-cream-100 mb-2">
          Project Planning and Finishing Tools
        </h2>
        <p className="text-sm text-bark-500 dark:text-bark-400 mb-6 max-w-2xl">
          Blanket sizing, stripe patterns, blocking methods, stash yardage estimation, and project costing.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {accessoryTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      {/* Reference Tools */}
      <section className="mb-12">
        <h2 className="text-2xl font-display font-bold text-bark-800 dark:text-cream-100 mb-2">
          Reference and Essential Knitting Tools
        </h2>
        <p className="text-sm text-bark-500 dark:text-bark-400 mb-6 max-w-2xl">
          Yarn estimation, gauge calculation, needle conversion, WPI identification, and stitch abbreviations — the tools you need on every project.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {referenceTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      {/* Cross-link to crochet */}
      <div className="mt-8 p-6 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 text-center">
        <p className="text-bark-700 dark:text-cream-200 font-medium">
          Also a crocheter?{" "}
          <Link
            href="/crochet-tools"
            className="text-sage-600 dark:text-sage-400 hover:underline font-semibold"
          >
            See our Crochet Calculators →
          </Link>
        </p>
      </div>
    </main>
  );
}
