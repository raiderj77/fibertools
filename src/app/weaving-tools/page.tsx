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
    "Free online calculators for weavers and spinners, sett, EPI, drive ratio, TPI, and yarn weight. No signup required.",
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
      "Free online calculators for weavers and spinners, sett, EPI, drive ratio, TPI, and yarn weight. No signup required.",
    url: "https://fibertools.app/weaving-tools",
    images: [
      {
        url: "https://fibertools.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Free Weaving & Spinning Calculators, FiberTools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Weaving & Spinning Calculators (2026)",
    description:
      "Free online calculators for weavers and spinners, sett, EPI, drive ratio, TPI, and yarn weight. No signup required.",
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
      "Free online calculators for weavers and spinners, sett, EPI, drive ratio, TPI, and yarn weight.",
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
        <span className="text-bark-600 dark:text-cream-400">Weaving & Spinning Tools</span>
      </nav>

      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-bark-800 dark:text-cream-100 leading-tight mb-1">
          Free Weaving & Spinning Calculators
        </h1>
        <p className="text-sm text-gray-600 mt-1 mb-4 text-center">Last updated: March 16, 2026</p>
        <div className="space-y-4 text-bark-600 dark:text-cream-300 max-w-3xl">
          <p className="text-lg leading-relaxed">
            Weaving and spinning involve some of the most calculation-heavy math in fiber arts. Before
            a weaver throws the first shuttle, they need to know the correct ends per inch (EPI) for
            their yarn and intended sett, how many yards to wind onto the warp beam, and how much loom
            waste to factor in. Before a handspinner winds off the bobbin, they need to confirm their
            drive ratio and whorl size are producing the twist-per-inch their target yarn weight
            requires. Get this math wrong and you waste fiber, warp thread, and hours of setup time.
          </p>
          <p className="leading-relaxed">
            FiberTools weaving and spinning calculators are built on the technical specifications used
            by the handweaving and handspinning communities. The sett calculator uses the standard
            formula, sett equals WPI divided by 2 for plain weave, divided by 1.5 for twill, to
            generate a recommended EPI from your actual yarn rather than a generic chart value. The WPI
            calculator walks you through the wrapping procedure to measure your yarn&rsquo;s true weight
            category, which is the necessary first step before any other weaving calculation. The
            spinning ratio calculator handles multi-whorl wheel setups so you can compare drive
            combinations on paper before committing at the wheel.
          </p>
          <p className="leading-relaxed">
            The thread converter bridges the gap between commercial weaving thread systems: denier,
            tex, and yards-per-pound all appear on thread labels from different manufacturers with no
            direct comparison, and this tool converts between all three in both directions. For
            finished yarn, the standard yarn calculator estimates yardage requirements from sett and
            project dimensions.
          </p>
          <p className="leading-relaxed">
            These calculators are built for weavers, spinners, and fiber artists who need accurate
            technical math without digging through handbooks or spreadsheets. All tools are free, work
            on any device, and require no account or login.
          </p>
        </div>
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
    </div>
  );
}
