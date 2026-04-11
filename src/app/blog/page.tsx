import type { Metadata } from "next";
import Link from "next/link";
import { getAllMarkdownPosts } from "@/lib/blog-markdown";

export const metadata: Metadata = {
  title: "Fiber Arts Blog — Guides & Tutorials",
  description:
    "Free guides for knitting, crochet, weaving, spinning, and embroidery. Learn yarn calculation, gauge, needle sizing, and more.",
  keywords: ["fiber arts blog", "knitting guides", "crochet tutorials", "yarn tips"],
  robots: { index: true, follow: true, googleBot: { "max-snippet": -1 } },
  openGraph: {
    title: "Fiber Arts Blog — Guides & Tutorials",
    description:
      "Free guides for knitting, crochet, weaving, spinning, and embroidery. Learn yarn calculation, gauge, needle sizing, and more.",
    url: "https://fibertools.app/blog",
    images: [
      {
        url: "https://fibertools.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Fiber Arts Blog — FiberTools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fiber Arts Blog — Guides & Tutorials",
    description:
      "Free guides for knitting, crochet, weaving, spinning, and embroidery.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const posts = getAllMarkdownPosts();

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Fiber Arts Blog — FiberTools.app",
    description:
      "Knitting, crochet, and fiber arts guides and tutorials from FiberTools.app",
    url: "https://fibertools.app/blog",
    numberOfItems: posts.length,
    hasPart: posts.map((post) => ({
      "@type": "BlogPosting",
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

      <h1 className="text-3xl sm:text-4xl font-display font-bold text-bark-800 dark:text-cream-100 mb-3">
        Fiber Arts Blog
      </h1>
      <p className="text-bark-500 dark:text-bark-400 mb-10 max-w-2xl">
        In-depth guides for knitting, crochet, weaving, and spinning — with free
        tools to put every technique into practice.
      </p>

      {posts.length === 0 ? (
        <p className="text-bark-400 dark:text-bark-500">No posts published yet.</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block bg-white dark:bg-bark-800 rounded-2xl border border-cream-300 dark:border-bark-700 p-6 hover:shadow-lg hover:shadow-sage-200/40 dark:hover:shadow-sage-900/30 hover:-translate-y-0.5 hover:border-sage-300 dark:hover:border-sage-700 transition-all group"
            >
              <h2 className="text-lg font-semibold text-bark-700 dark:text-cream-200 group-hover:text-sage-600 dark:group-hover:text-sage-400 transition-colors mb-1">
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="text-sm text-bark-500 dark:text-bark-400 line-clamp-2 mb-2">
                  {post.excerpt}
                </p>
              )}
              {post.date && (
                <time
                  dateTime={post.date}
                  className="text-xs text-bark-400 dark:text-bark-500"
                >
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              )}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
