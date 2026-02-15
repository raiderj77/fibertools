import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/blog";
import { getToolBySlug } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Guides & Tutorials — Fiber Arts Tips and How-Tos",
  description:
    "Free guides for knitting, crochet, weaving, spinning, and embroidery. Learn yarn calculation, gauge, needle sizing, and more.",
};

export default function BlogIndexPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl sm:text-4xl font-display font-bold text-bark-800 dark:text-cream-100 mb-3">
        Guides &amp; Tutorials
      </h1>
      <p className="text-bark-500 dark:text-bark-400 mb-10 max-w-2xl">
        In-depth guides for every fiber craft. Each guide pairs with one of our
        free tools to help you put the knowledge into practice.
      </p>

      <div className="space-y-6">
        {blogPosts.map((post) => {
          const tool = getToolBySlug(post.toolSlug);
          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block bg-white dark:bg-bark-800 rounded-2xl border border-cream-300 dark:border-bark-700 p-6 hover:shadow-lg hover:shadow-sage-200/40 dark:hover:shadow-sage-900/30 hover:-translate-y-0.5 hover:border-sage-300 dark:hover:border-sage-700 transition-all group"
            >
              <div className="flex items-start gap-4">
                {tool && <span className="text-3xl flex-shrink-0 mt-0.5">{tool.icon}</span>}
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-bark-700 dark:text-cream-200 group-hover:text-sage-600 dark:group-hover:text-sage-400 transition-colors mb-1">
                    {post.title}
                  </h2>
                  <p className="text-sm text-bark-500 dark:text-bark-400 line-clamp-2 mb-2">
                    {post.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-bark-400 dark:text-bark-500">
                    <time>{new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time>
                    {tool && (
                      <>
                        <span>&middot;</span>
                        <span>Companion tool: {tool.shortName}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
