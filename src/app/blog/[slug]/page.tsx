import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllMarkdownPosts, getMarkdownPost } from "@/lib/blog-markdown";
import { getToolBySlug } from "@/lib/tools";

export function generateStaticParams() {
  return getAllMarkdownPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getMarkdownPost(params.slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description || undefined,
    keywords: post.keywords.length ? post.keywords : undefined,
    robots: { index: true, follow: true, googleBot: { "max-snippet": -1 } },
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description || undefined,
      publishedTime: post.date,
      url: `https://fibertools.app/blog/${post.slug}`,
      images: [
        {
          url: "https://fibertools.app/og-image.png",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description || undefined,
      images: ["https://fibertools.app/og-image.png"],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getMarkdownPost(params.slug);
  if (!post) notFound();

  const tool = post.toolSlug ? getToolBySlug(post.toolSlug) : null;

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description || undefined,
    datePublished: post.date,
    dateModified: post.date,
    url: `https://fibertools.app/blog/${post.slug}`,
    mainEntityOfPage: `https://fibertools.app/blog/${post.slug}`,
    image: "https://fibertools.app/og-image.png",
    author: {
      "@type": "Organization",
      name: "FiberTools",
      url: "https://fibertools.app",
    },
    publisher: {
      "@type": "Organization",
      name: "FiberTools",
      url: "https://fibertools.app",
    },
    keywords: post.keywords.join(", "),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://fibertools.app",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://fibertools.app/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `https://fibertools.app/blog/${post.slug}`,
      },
    ],
  };

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-sm text-bark-400 dark:text-bark-500 mb-6"
      >
        <Link
          href="/"
          className="hover:text-sage-600 dark:hover:text-sage-400 transition-colors"
        >
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link
          href="/blog"
          className="hover:text-sage-600 dark:hover:text-sage-400 transition-colors"
        >
          Blog
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-bark-600 dark:text-cream-400 truncate">
          {post.title}
        </span>
      </nav>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-bark-800 dark:text-cream-100 leading-tight mb-3">
        {post.title}
      </h1>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-8 text-sm text-bark-400 dark:text-bark-500">
        {post.date && (
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </time>
        )}
        <span aria-hidden="true">&middot;</span>
        <span>By a fiber arts expert with 30+ years experience</span>
        {tool && (
          <>
            <span aria-hidden="true">&middot;</span>
            <Link
              href={`/${tool.slug}`}
              className="text-sage-600 dark:text-sage-400 hover:underline"
            >
              {tool.icon} Try the {tool.shortName}
            </Link>
          </>
        )}
      </div>

      {/* Rendered markdown content */}
      <article
        className="prose-fiber"
        dangerouslySetInnerHTML={{ __html: post.htmlContent }}
      />

      {/* Companion tool CTA */}
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
    </main>
  );
}
