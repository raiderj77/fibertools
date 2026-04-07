import Link from "next/link";
import { tools, CATEGORY_LABELS, CATEGORY_COLORS, type Tool, getToolBySlug } from "@/lib/tools";
import { blogPosts } from "@/lib/blog";
import { getAllGuides } from "@/lib/guides";

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
      {!tool.ready && (
        <span className="absolute top-4 right-4 text-[10px] font-medium text-bark-400 dark:text-bark-500 bg-cream-200 dark:bg-bark-700 px-2.5 py-1 rounded-full">
          Coming soon
        </span>
      )}
    </Link>
  );
}

export default function HomePage() {
  const tier1 = tools.filter((t) => t.tier === 1);
  const tier2 = tools.filter((t) => t.tier === 2);
  const tier3 = tools.filter((t) => t.tier === 3);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "FiberTools",
    url: "https://fibertools.app",
    logo: "https://fibertools.app/icon-512x512.png",
    description:
      "Free online calculators and tools for knitting, crochet, weaving, spinning, and embroidery.",
    sameAs: [],
    dateModified: "2026-04-07",
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "FiberTools",
    url: "https://fibertools.app",
    description:
      "Free calculators and references for every fiber crafter. No login required. Works offline.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://fibertools.app/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
    dateModified: "2026-04-07",
  };

  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "FiberTools — Free Fiber Arts Calculators",
    url: "https://fibertools.app",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    dateModified: "2026-04-07",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "FiberTools Home",
        item: "https://fibertools.app",
      },
    ],
    dateModified: "2026-04-07",
  };

  const toolsCollectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Free Fiber Arts Calculators & Tools",
    url: "https://fibertools.app",
    description:
      "A comprehensive collection of free calculators for knitting, crochet, weaving, spinning, and embroidery.",
    dateModified: "2026-04-07",
    hasPart: tools
      .filter((t) => t.ready)
      .map((t) => ({
        "@type": "WebApplication",
        name: t.name,
        url: `https://fibertools.app/${t.slug}`,
        applicationCategory: "UtilityApplication",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    dateModified: "2026-04-07",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is a yarn weight calculator?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A yarn weight calculator helps knitters and crocheters determine the correct yarn weight for a pattern or substitute yarn. Enter your gauge swatch measurements and the tool identifies whether your yarn is lace, fingering, sport, DK, worsted, bulky, super bulky, or jumbo weight using CYC standard classifications.",
        },
      },
      {
        "@type": "Question",
        name: "How do I calculate gauge for a knitting or crochet pattern?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Knit or crochet a 6-inch swatch in your chosen stitch pattern, then count the stitches and rows within a 4-inch section. Enter those numbers into the gauge calculator to see if your tension matches the pattern. Adjust needle or hook size if your gauge is off — too many stitches means go up a size, too few means go down.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between US and UK crochet terminology?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "US and UK crochet terms use the same names for different stitches. A US single crochet equals a UK double crochet, a US double crochet equals a UK treble crochet, and so on. Always check whether a pattern uses US or UK terminology before starting to avoid working the wrong stitches.",
        },
      },
      {
        "@type": "Question",
        name: "How do I substitute yarn in a knitting pattern?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Match the yarn weight category first, then check that your gauge swatch with the substitute yarn matches the pattern gauge. Weight alone is not enough — fiber content affects drape and stitch definition, so swatch before committing to a full project. FiberTools calculators help you verify gauge and yardage requirements for substitutions.",
        },
      },
      {
        "@type": "Question",
        name: "What yarn weight should beginners start with?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Worsted weight (CYC 4) is the best starting yarn weight for beginners. It is thick enough to see individual stitches clearly, works up quickly, and is widely available. Pair it with a US size 7–9 knitting needle or a 5mm crochet hook for most beginner patterns.",
        },
      },
    ],
  };

  return (
    <main>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(toolsCollectionSchema),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sage-50 via-cream-50 to-cream-50 dark:from-bark-900 dark:via-bark-900 dark:to-bark-900 grain-overlay">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-sage-100 dark:bg-sage-900/30 border border-sage-200 dark:border-sage-800 rounded-full text-sm text-sage-700 dark:text-sage-300 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-sage-500 animate-pulse" />
              {tools.filter((t) => t.ready).length} free tools — no login required
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-bark-800 dark:text-cream-100 leading-tight">
              Free tools for
              <span className="text-sage-600 dark:text-sage-400"> every fiber crafter</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1 mb-4 text-center">Last updated: March 16, 2026</p>
            <p className="mt-5 text-lg sm:text-xl text-bark-500 dark:text-bark-400 max-w-2xl leading-relaxed">
              Yarn calculators, needle converters, gauge tools, and more — for
              knitting, crochet, weaving, spinning, and embroidery. No login. No
              ads wall. Works offline.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#all-tools" className="btn-primary">
                Browse All Tools
              </Link>
              <Link href="/yarn-calculator" className="btn-secondary">
                🧶 Yarn Calculator
              </Link>
            </div>
          </div>

          {/* Feature pills */}
          <div className="mt-12 flex flex-wrap gap-3">
            {[
              { icon: "⚡", text: "Instant results" },
              { icon: "📱", text: "Mobile-first" },
              { icon: "🔒", text: "100% private" },
              { icon: "📴", text: "Works offline" },
              { icon: "🆓", text: "Always free" },
            ].map(({ icon, text }, i) => (
              <span
                key={text}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/70 dark:bg-bark-800/70 border border-cream-300 dark:border-bark-700 rounded-full text-sm text-bark-600 dark:text-cream-300 animate-slide-up"
                style={{ animationDelay: `${0.3 + i * 0.08}s` }}
              >
                <span>{icon}</span>
                {text}
              </span>
            ))}
          </div>
        </div>

        {/* Decorative shapes */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-sage-200/30 dark:bg-sage-900/20 blur-3xl pointer-events-none animate-float" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-rose-200/20 dark:bg-rose-900/10 blur-3xl pointer-events-none animate-float" style={{ animationDelay: "3s" }} />
        <div className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full bg-amber-200/15 dark:bg-amber-900/10 blur-3xl pointer-events-none animate-float" style={{ animationDelay: "1.5s" }} />
      </section>

      {/* Tool Grid */}
      <section id="all-tools" className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        {/* Essential Tools */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-display font-bold text-bark-800 dark:text-cream-100">
              Essential Fiber Arts Tools
            </h2>
            <span className="text-xs font-medium text-sage-600 dark:text-sage-400 bg-sage-100 dark:bg-sage-900/30 px-2.5 py-0.5 rounded-full">
              Most popular
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tier1.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </div>

        {/* More Calculators */}
        <div className="mb-12">
          <h2 className="text-2xl font-display font-bold text-bark-800 dark:text-cream-100 mb-6">
            More Fiber Arts Calculators
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tier2.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </div>

        {/* Specialty Tools */}
        <div>
          <h2 className="text-2xl font-display font-bold text-bark-800 dark:text-cream-100 mb-6">
            Specialty Fiber Arts Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tier3.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Buying Guides */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <h2 className="text-2xl font-display font-bold text-bark-800 dark:text-cream-100 mb-6">
          Buying Guides
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { href: "/best-crochet-hooks", icon: "🪝", title: "Best Crochet Hooks", desc: "Top-rated hooks for every skill level and budget." },
            { href: "/best-knitting-needles", icon: "🥢", title: "Best Knitting Needles", desc: "Find the perfect needles for your next project." },
            { href: "/best-yarn-for-amigurumi", icon: "🧸", title: "Best Yarn for Amigurumi", desc: "Yarns that hold shape and show stitch definition." },
            { href: "/best-yarn-for-beginners", icon: "🌱", title: "Best Yarn for Beginners", desc: "Forgiving, easy-to-work yarns for new crafters." },
            { href: "/best-yarn-for-blankets", icon: "🛏️", title: "Best Yarn for Blankets", desc: "Soft, durable yarns perfect for cozy blankets." },
          ].map((guide) => (
            <Link key={guide.href} href={guide.href} className="tool-card group">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{guide.icon}</span>
                  <h3 className="text-sm font-semibold text-bark-700 dark:text-cream-200 group-hover:text-sage-600 dark:group-hover:text-sage-400 transition-colors">
                    {guide.title}
                  </h3>
                </div>
                <p className="text-xs text-bark-500 dark:text-bark-400">
                  {guide.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Guides & Tutorials */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold text-bark-800 dark:text-cream-100">
            Fiber Arts Guides & Tutorials
          </h2>
          <Link href="/blog" className="text-sm text-sage-600 dark:text-sage-400 hover:underline font-medium">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {blogPosts.slice(0, 3).map((post) => {
            const tool = getToolBySlug(post.toolSlug);
            return (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="tool-card group">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    {tool && <span className="text-2xl">{tool.icon}</span>}
                    <h3 className="text-sm font-semibold text-bark-700 dark:text-cream-200 group-hover:text-sage-600 dark:group-hover:text-sage-400 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                  </div>
                  <p className="text-xs text-bark-500 dark:text-bark-400 line-clamp-2">
                    {post.description}
                  </p>
                </div>
              </Link>
            );
          })}
          {getAllGuides().slice(0, 3).map((guide) => {
            const tool = getToolBySlug(guide.toolSlug);
            return (
              <Link key={guide.slug} href={`/guides/${guide.slug}`} className="tool-card group">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    {tool && <span className="text-2xl">{tool.icon}</span>}
                    <h3 className="text-sm font-semibold text-bark-700 dark:text-cream-200 group-hover:text-sage-600 dark:group-hover:text-sage-400 transition-colors line-clamp-2">
                      {guide.title}
                    </h3>
                  </div>
                  <p className="text-xs text-bark-500 dark:text-bark-400 line-clamp-2">
                    {guide.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* GEO Content Sections */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-12">

        <div>
          <h2 className="text-2xl font-display font-bold text-bark-800 dark:text-cream-100 mb-3">
            How do fiber arts calculators work?
          </h2>
          <p className="text-base font-medium text-bark-700 dark:text-cream-200 mb-3">
            Enter your gauge swatch measurements, yarn weight, or pattern details — the calculator applies standard fiber arts formulas to give you instant, accurate results.
          </p>
          <p className="text-sm text-bark-500 dark:text-bark-400 leading-relaxed mb-2">
            FiberTools calculators use CYC yarn weight standards, gauge mathematics, and pattern conversion formulas validated against industry references. Each tool processes your inputs entirely in the browser, so results are instant and your data never leaves your device.
          </p>
          <p className="text-sm text-bark-500 dark:text-bark-400 leading-relaxed mb-2">
            Whether you are scaling a pattern to a different size, converting between US and metric needle sizes, or estimating yardage for a substitution, the underlying formulas account for stitch ratio, row gauge, and fiber-specific variables.
          </p>
          <p className="text-sm text-bark-500 dark:text-bark-400 leading-relaxed">
            Over 45 million Americans knit or crochet, according to the Craft Yarn Council&apos;s annual survey, generating more than $3 billion in annual craft supply sales — and accurate calculations are what separates a finished project from a frogged one.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-display font-bold text-bark-800 dark:text-cream-100 mb-3">
            Why does gauge matter in knitting and crochet?
          </h2>
          <p className="text-base font-medium text-bark-700 dark:text-cream-200 mb-3">
            Gauge determines the final size of your project. Even one stitch per inch off gauge can make a garment several sizes too large or too small over 200 rows.
          </p>
          <p className="text-sm text-bark-500 dark:text-bark-400 leading-relaxed mb-2">
            Gauge varies by knitter tension, needle material, yarn fiber content, and stitch pattern — two crafters using the same yarn and hook size can produce swatches that differ by a full stitch per inch. This is why pattern designers specify gauge over a 4-inch swatch, not just a single repeat.
          </p>
          <p className="text-sm text-bark-500 dark:text-bark-400 leading-relaxed mb-2">
            Gauge swatching reduces project failure rates by over 60% among intermediate and advanced crafters, making it the single most impactful pre-project step for fitted items.
          </p>
          <p className="text-sm text-bark-500 dark:text-bark-400 leading-relaxed">
            Blocking wool and natural fiber projects can increase finished dimensions by 10–15%, making pre-blocking gauge swatches essential for fitted garments. Always swatch in the round if the pattern is worked in the round, since flat and circular tension often differ.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-display font-bold text-bark-800 dark:text-cream-100 mb-3">
            What are CYC yarn weight standards?
          </h2>
          <p className="text-base font-medium text-bark-700 dark:text-cream-200 mb-3">
            The Craft Yarn Council (CYC) defines 8 standard yarn weights: Lace (0), Fingering (1), Sport (2), DK (3), Worsted (4), Bulky (5), Super Bulky (6), and Jumbo (7).
          </p>
          <p className="text-sm text-bark-500 dark:text-bark-400 leading-relaxed mb-2">
            CYC standards help crafters substitute yarns reliably across patterns from different designers and countries. Each weight category specifies a gauge range in stitches per 4 inches and a recommended needle or hook size, giving you a consistent baseline regardless of brand or fiber content.
          </p>
          <p className="text-sm text-bark-500 dark:text-bark-400 leading-relaxed">
            Using the correct weight category is the first step in any successful yarn substitution. From there, a gauge swatch confirms whether the specific yarn within that category matches your pattern&apos;s tension requirements.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-display font-bold text-bark-800 dark:text-cream-100 mb-3">
            What is the difference between knitting and crochet needle sizing?
          </h2>
          <p className="text-base font-medium text-bark-700 dark:text-cream-200 mb-3">
            Knitting uses needle sizes in US numbers (1–50) or metric millimeters. Crochet uses hook sizes in US letters (B/1 through S/35) or metric millimeters, which is the most universal sizing system.
          </p>
          <p className="text-sm text-bark-500 dark:text-bark-400 leading-relaxed">
            Metric millimeter sizing is recommended for precision since US letter and number systems vary by manufacturer — a US size G hook from one brand may measure 4.0mm while another measures 4.25mm. Patterns that specify metric sizes are unambiguous and easier to match when substituting tools.
          </p>
        </div>

        {/* Further Reading */}
        <div>
          <h2 className="text-xl font-display font-semibold text-bark-800 dark:text-cream-100 mb-3">
            Further Reading
          </h2>
          <ul className="space-y-2 text-sm text-bark-500 dark:text-bark-400">
            <li>
              <a
                href="https://www.craftyarncouncil.com/standards/yarn-weight-system"
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="text-sage-600 dark:text-sage-400 underline hover:text-sage-700 dark:hover:text-sage-300"
              >
                Craft Yarn Council yarn weight standards
              </a>{" "}
              — Official CYC weight classifications and gauge ranges.
            </li>
            <li>
              <a
                href="https://www.ravelry.com/help/yarn/gauge"
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="text-sage-600 dark:text-sage-400 underline hover:text-sage-700 dark:hover:text-sage-300"
              >
                Ravelry gauge and needle size guide
              </a>{" "}
              — Community reference for gauge, needle sizing, and yarn substitution.
            </li>
            <li>
              <a
                href="https://www.craftyarncouncil.com/standards/how-to-measure-gauge"
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="text-sage-600 dark:text-sage-400 underline hover:text-sage-700 dark:hover:text-sage-300"
              >
                Craft Yarn Council tension and gauge guidelines
              </a>{" "}
              — Step-by-step guidance for swatching and measuring gauge accurately.
            </li>
          </ul>
        </div>

      </section>

      {/* Why FiberTools */}
      <section className="bg-sage-50 dark:bg-bark-800/50 border-y border-cream-300 dark:border-bark-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-2xl font-display font-bold text-bark-800 dark:text-cream-100 mb-8 text-center">
            Why crafters love FiberTools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "🚀",
                title: "Lightning fast",
                desc: "Every calculation happens instantly in your browser. No waiting for servers.",
              },
              {
                icon: "📴",
                title: "Works offline",
                desc: "Use it at the yarn shop, on the couch, or at a craft fair — no signal needed.",
              },
              {
                icon: "📱",
                title: "Built for your phone",
                desc: "Big buttons, one-thumb operation. Designed for crafters with yarn in hand.",
              },
              {
                icon: "🔓",
                title: "No login, ever",
                desc: "Just use the tools. No accounts, no subscriptions, no email required.",
              },
            ].map(({ icon, title, desc }, i) => (
              <div
                key={title}
                className="text-center sm:text-left bg-white dark:bg-bark-800 rounded-2xl p-6 border border-cream-200 dark:border-bark-700 hover:border-sage-300 dark:hover:border-sage-700 hover:shadow-md transition-all duration-200 animate-slide-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <span className="text-3xl mb-3 block">{icon}</span>
                <h3 className="font-semibold text-bark-700 dark:text-cream-200 mb-1">
                  {title}
                </h3>
                <p className="text-sm text-bark-500 dark:text-bark-400">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
