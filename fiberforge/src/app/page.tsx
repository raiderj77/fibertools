import Link from "next/link";
import { tools, CATEGORY_LABELS, CATEGORY_COLORS, type Tool } from "@/lib/tools";

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

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sage-50 via-cream-50 to-cream-50 dark:from-bark-900 dark:via-bark-900 dark:to-bark-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-bark-800 dark:text-cream-100 leading-tight">
              Free tools for
              <span className="text-sage-600 dark:text-sage-400"> every fiber crafter</span>
            </h1>
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
            ].map(({ icon, text }) => (
              <span
                key={text}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/70 dark:bg-bark-800/70 border border-cream-300 dark:border-bark-700 rounded-full text-sm text-bark-600 dark:text-cream-300"
              >
                <span>{icon}</span>
                {text}
              </span>
            ))}
          </div>
        </div>

        {/* Decorative yarn ball */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-sage-200/30 dark:bg-sage-900/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-rose-200/20 dark:bg-rose-900/10 blur-3xl pointer-events-none" />
      </section>

      {/* Tool Grid */}
      <section id="all-tools" className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        {/* Essential Tools */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-display font-bold text-bark-800 dark:text-cream-100">
              Essential Tools
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
            More Calculators
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
            Specialty Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tier3.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
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
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="text-center sm:text-left bg-white dark:bg-bark-800 rounded-2xl p-6 border border-cream-200 dark:border-bark-700"
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
