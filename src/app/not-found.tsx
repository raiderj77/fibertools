import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist. Find free knitting and crochet calculators on FiberTools.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-20 text-center">
      <p className="text-6xl mb-6" aria-hidden="true">🧶</p>

      <h1 className="text-3xl sm:text-4xl font-display font-bold text-bark-800 dark:text-cream-100 mb-4">
        Looks like your stitches got dropped!
      </h1>

      <p className="text-bark-500 dark:text-bark-400 text-lg leading-relaxed mb-10">
        That page doesn&rsquo;t exist, it may have been moved, renamed, or never cast on
        in the first place. Let&rsquo;s get you back to something useful.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        <Link
          href="/crochet-tools"
          className="tool-card group flex flex-col items-center gap-2 py-6"
        >
          <span className="text-3xl" aria-hidden="true">🪡</span>
          <span className="font-semibold text-bark-700 dark:text-cream-200 group-hover:text-sage-600 dark:group-hover:text-sage-400 transition-colors">
            Crochet Tools
          </span>
          <span className="text-xs text-bark-400 dark:text-bark-500">
            Yarn, gauge, amigurumi &amp; more
          </span>
        </Link>

        <Link
          href="/knitting-tools"
          className="tool-card group flex flex-col items-center gap-2 py-6"
        >
          <span className="text-3xl" aria-hidden="true">🧵</span>
          <span className="font-semibold text-bark-700 dark:text-cream-200 group-hover:text-sage-600 dark:group-hover:text-sage-400 transition-colors">
            Knitting Tools
          </span>
          <span className="text-xs text-bark-400 dark:text-bark-500">
            Gauge, sweaters, socks &amp; hats
          </span>
        </Link>

        <Link
          href="/blog"
          className="tool-card group flex flex-col items-center gap-2 py-6"
        >
          <span className="text-3xl" aria-hidden="true">📝</span>
          <span className="font-semibold text-bark-700 dark:text-cream-200 group-hover:text-sage-600 dark:group-hover:text-sage-400 transition-colors">
            Blog
          </span>
          <span className="text-xs text-bark-400 dark:text-bark-500">
            Guides, tips &amp; tutorials
          </span>
        </Link>
      </div>

      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sage-600 dark:text-sage-400 hover:underline font-medium"
      >
        ← Back to all tools
      </Link>
    </main>
  );
}
