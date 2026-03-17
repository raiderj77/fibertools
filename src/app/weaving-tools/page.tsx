import type { Metadata } from "next";
import Link from "next/link";
import { getToolBySlug, CATEGORY_COLORS, CATEGORY_LABELS, type Tool } from "@/lib/tools";

const WEAVING_SLUGS = [
  "weaving-sett-calculator",
  "spinning-ratio-calculator",
  "wpi-calculator",
  "yarn-weight-chart",
  "stash-estimator",
  "thread-converter",
  "yarn-calculator",
];

const weavingTools = WEAVING_SLUGS.map((s) => getToolBySlug(s)).filter(
  (t): t is Tool => t !== undefined && t.ready
);

export const metadata: Metadata = {
  title: "Free Weaving & Spinning Calculators (2026)",
  description:
    "Free online calculators for weavers and spinners — sett, EPI, drive ratio, TPI, and yarn weight. No signup required.",
  keywords: [
    "weaving calculator",
    "sett calculator",
    "EPI calculator",
    "spinning wheel calculator",
    "TPI calculator",
    "drive ratio calculator",
    "weaving tools online",
    "handspinning calculator",
  ],
  openGraph: {
    title: "Free Weaving & Spinning Calculators (2026)",
    description:
      "Free online calculators for weavers and spinners — sett, EPI, drive ratio, TPI, and yarn weight. No signup required.",
    url: "https://fibertools.app/weaving-tools",
    images: [
      {
        url: "https://fibertools.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Free Weaving & Spinning Calculators — FiberTools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Weaving & Spinning Calculators (2026)",
    description:
      "Free online calculators for weavers and spinners — sett, EPI, drive ratio, TPI, and yarn weight. No signup required.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/weaving-tools" },
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

export default function WeavingToolsPage() {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Free Weaving & Spinning Calculators",
    description:
      "Free online calculators for weavers and spinners — sett, EPI, drive ratio, TPI, and yarn weight.",
    url: "https://fibertools.app/weaving-tools",
    numberOfItems: weavingTools.length,
    hasPart: weavingTools.map((t) => ({
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
      { "@type": "ListItem", position: 2, name: "Weaving & Spinning Tools" },
    ],
  };

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
        <span className="text-bark-600 dark:text-cream-400">Weaving & Spinning Tools</span>
      </nav>

      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-bark-800 dark:text-cream-100 leading-tight mb-1">
          Free Weaving & Spinning Calculators
        </h1>
        <p className="text-sm text-gray-500 mt-1 mb-4 text-center">Last updated: March 16, 2026</p>
        <p className="text-lg text-bark-600 dark:text-cream-300 max-w-3xl leading-relaxed">
          Weaving and spinning involve precise ratios — sett, EPI, TPI, and drive ratios all need
          to be right before you start. These free calculators handle the math for weavers and
          handspinners so you can focus on fiber, not formulas. No signup required.
        </p>
      </div>

      {/* All Weaving & Spinning Tools */}
      <section className="mb-12">
        <h2 className="text-2xl font-display font-bold text-bark-800 dark:text-cream-100 mb-6">
          All Weaving & Spinning Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {weavingTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      {/* More tools coming */}
      <div className="p-6 bg-bark-50 dark:bg-bark-800 rounded-2xl border border-bark-200 dark:border-bark-700">
        <h2 className="text-lg font-display font-bold text-bark-800 dark:text-cream-100 mb-2">
          More weaving and spinning tools are on the way
        </h2>
        <p className="text-sm text-bark-600 dark:text-cream-300 leading-relaxed mb-4">
          FiberTools continues to add calculators for weavers and spinners. Have a tool request?
          Drop us a line at{" "}
          <a
            href="mailto:hello@fibertools.app"
            className="text-sage-600 dark:text-sage-400 hover:underline"
          >
            hello@fibertools.app
          </a>
          .
        </p>
        <Link
          href="/"
          className="text-sage-600 dark:text-sage-400 hover:underline font-medium text-sm"
        >
          Browse all {weavingTools.length > 0 ? "31" : ""} tools on the homepage →
        </Link>
      </div>
    </main>
  );
}
