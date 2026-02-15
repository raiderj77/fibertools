import Link from "next/link";
import { tools, CATEGORY_LABELS } from "@/lib/tools";

export default function Footer() {
  const categories = Array.from(new Set(tools.map((t) => t.category)));

  return (
    <footer className="bg-cream-100 dark:bg-bark-900 border-t border-cream-300 dark:border-bark-700 mt-16 no-print">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <span className="text-xl">🧶</span>
              <span className="font-display text-lg font-bold text-bark-800 dark:text-cream-100">
                FiberTools
              </span>
            </Link>
            <p className="text-sm text-bark-500 dark:text-bark-400 max-w-xs">
              Free online calculators and tools for knitters, crocheters, weavers,
              spinners, and embroiderers. No login. Works offline.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-sm font-semibold text-bark-700 dark:text-cream-300 uppercase tracking-wider mb-3">
              Popular Tools
            </h3>
            <ul className="space-y-2">
              {tools.slice(0, 6).map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/${tool.slug}`}
                    className="text-sm text-bark-500 dark:text-bark-400 hover:text-sage-600 dark:hover:text-sage-400 transition-colors"
                  >
                    {tool.shortName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-bark-700 dark:text-cream-300 uppercase tracking-wider mb-3">
              Categories
            </h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat}>
                  <span className="text-sm text-bark-500 dark:text-bark-400">
                    {CATEGORY_LABELS[cat]}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-bark-700 dark:text-cream-300 uppercase tracking-wider mb-3">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-bark-500 dark:text-bark-400 hover:text-sage-600 dark:hover:text-sage-400 transition-colors"
                >
                  📖 Guides &amp; Tutorials
                </Link>
              </li>
              <li>
                <span className="text-sm text-bark-500 dark:text-bark-400">
                  100% free, 100% client-side
                </span>
              </li>
              <li>
                <span className="text-sm text-bark-500 dark:text-bark-400">
                  Works offline
                </span>
              </li>
              <li>
                <span className="text-sm text-bark-500 dark:text-bark-400">
                  No account required
                </span>
              </li>
              <li>
                <span className="text-sm text-bark-500 dark:text-bark-400">
                  Mobile-first design
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-cream-300 dark:border-bark-700 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-bark-400 dark:text-bark-500">
            © {new Date().getFullYear()} FiberTools. All tools are free to use.
          </p>
          <p className="text-xs text-bark-400 dark:text-bark-500">
            Made with 🧶 for the fiber arts community
          </p>
        </div>
      </div>
    </footer>
  );
}
