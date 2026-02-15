import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, getBlogPost } from "@/lib/blog";
import { getToolBySlug } from "@/lib/tools";

// Generate all blog paths at build time
export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

// Dynamic metadata per post
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getBlogPost(params.slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  const tool = getToolBySlug(post.toolSlug);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Organization", name: "FiberTools" },
    publisher: { "@type": "Organization", name: "FiberTools", url: "https://fibertools.app" },
    keywords: post.keywords.join(", "),
  };

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-bark-400 dark:text-bark-500 mb-6">
        <Link href="/" className="hover:text-sage-600 dark:hover:text-sage-400 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-sage-600 dark:hover:text-sage-400 transition-colors">Guides</Link>
        <span>/</span>
        <span className="text-bark-600 dark:text-cream-400 truncate">{post.title}</span>
      </nav>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-bark-800 dark:text-cream-100 leading-tight mb-4">
        {post.title}
      </h1>

      <div className="flex items-center gap-4 mb-8 text-sm text-bark-400 dark:text-bark-500">
        <time>{new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time>
        {tool && (
          <>
            <span>&middot;</span>
            <Link href={`/${tool.slug}`} className="text-sage-600 dark:text-sage-400 hover:underline">
              {tool.icon} Try the {tool.shortName}
            </Link>
          </>
        )}
      </div>

      {/* Content */}
      <article className="prose-fiber">
        {post.sections.map((section, i) => (
          <div key={i} className="mb-8">
            <h2 className="text-xl font-display font-bold text-bark-700 dark:text-cream-200 mb-3">
              {section.heading}
            </h2>
            {section.content.split("\n\n").map((paragraph, j) => (
              <p key={j} className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
                {paragraph}
              </p>
            ))}
          </div>
        ))}
      </article>

      {/* CTA to tool */}
      {tool && (
        <div className="mt-12 p-6 bg-sage-50 dark:bg-sage-900/20 rounded-2xl border border-sage-200 dark:border-sage-800 text-center">
          <p className="text-lg font-semibold text-bark-700 dark:text-cream-200 mb-2">
            Ready to put this into practice?
          </p>
          <p className="text-sm text-bark-500 dark:text-bark-400 mb-4">
            Use our free {tool.name} — no login required, works offline.
          </p>
          <Link href={`/${tool.slug}`} className="btn-primary">
            {tool.icon} Open {tool.shortName}
          </Link>
        </div>
      )}

      {/* Related posts */}
      <section className="mt-12">
        <h2 className="text-xl font-display font-bold text-bark-800 dark:text-cream-100 mb-4">
          More Guides
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {blogPosts
            .filter((p) => p.slug !== post.slug)
            .slice(0, 4)
            .map((p) => {
              const t = getToolBySlug(p.toolSlug);
              return (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="tool-card group"
                >
                  <div className="flex items-start gap-3">
                    {t && <span className="text-2xl flex-shrink-0">{t.icon}</span>}
                    <div>
                      <h3 className="text-sm font-medium text-bark-700 dark:text-cream-200 group-hover:text-sage-600 dark:group-hover:text-sage-400 transition-colors line-clamp-2">
                        {p.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      </section>
    </main>
  );
}
