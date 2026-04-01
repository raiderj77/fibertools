import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/blog";
import { getToolBySlug } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Guides & Tutorials — Fiber Arts Tips and How-Tos",
  description:
    "Free guides for knitting, crochet, weaving, spinning, and embroidery. Learn yarn calculation, gauge, needle sizing, and more.",
  keywords: ["fiber arts blog", "knitting guides", "crochet tutorials", "yarn tips"],
  openGraph: {
    title: "Guides & Tutorials — Fiber Arts Tips and How-Tos",
    description:
      "Free guides for knitting, crochet, weaving, spinning, and embroidery. Learn yarn calculation, gauge, needle sizing, and more.",
    url: "https://fibertools.app/blog",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Guides & Tutorials — Fiber Arts Tips and How-Tos" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Guides & Tutorials — Fiber Arts Tips and How-Tos",
    description:
      "Free guides for knitting, crochet, weaving, spinning, and embroidery. Learn yarn calculation, gauge, needle sizing, and more.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Fiber Arts Blog — FiberTools.app",
    description:
      "Knitting, crochet, and fiber arts guides and tutorials from FiberTools.app",
    url: "https://fibertools.app/blog",
    numberOfItems: blogPosts.length,
    hasPart: blogPosts.map((post) => ({
      "@type": "Article",
      name: post.title,
      url: `https://fibertools.app/blog/${post.slug}`,
    })),
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <h1 className="text-3xl sm:text-4xl font-display font-bold text-bark-800 dark:text-cream-100 mb-1">
        Guides &amp; Tutorials
      </h1>
      <p className="text-sm text-gray-500 mt-1 mb-4 text-center">Last updated: March 16, 2026</p>
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
