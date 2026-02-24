import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuideBySlug, getAllGuides } from "@/lib/guides";
import { getToolBySlug } from "@/lib/tools";

// Generate all guide paths at build time
export function generateStaticParams() {
  const guides = getAllGuides();
  return guides.map((guide) => ({ slug: guide.slug }));
}

// Dynamic metadata per guide
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const guide = getGuideBySlug(params.slug);
  if (!guide) return {};

  return {
    title: guide.title,
    description: guide.description,
    keywords: guide.keywords,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: {
      type: "article",
      title: guide.title,
      description: guide.description,
      publishedTime: guide.date,
    },
  };
}

export default function GuidePage({ params }: { params: { slug: string } }) {
  const guide = getGuideBySlug(params.slug);
  if (!guide) notFound();

  const tool = getToolBySlug(guide.toolSlug);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: guide.date,
    author: { "@type": "Organization", name: "FiberTools" },
    publisher: { "@type": "Organization", name: "FiberTools", url: "https://fibertools.app" },
    keywords: guide.keywords.join(", "),
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
        <Link href="/guides" className="hover:text-sage-600 dark:hover:text-sage-400 transition-colors">Guides</Link>
        <span>/</span>
        <span className="text-bark-600 dark:text-cream-400 truncate">{guide.title}</span>
      </nav>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-bark-800 dark:text-cream-100 leading-tight mb-4">
        {guide.title}
      </h1>

      <div className="flex items-center gap-4 mb-8 text-sm text-bark-400 dark:text-bark-500">
        <time>{new Date(guide.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time>
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
        {guide.sections.map((section, i) => (
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

      {/* Related guides */}
      <section className="mt-12">
        <h2 className="text-xl font-display font-bold text-bark-800 dark:text-cream-100 mb-4">
          More Guides
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {getAllGuides()
            .filter((g) => g.slug !== guide.slug)
            .slice(0, 4)
            .map((g) => {
              const t = getToolBySlug(g.toolSlug);
              return (
                <Link
                  key={g.slug}
                  href={`/guides/${g.slug}`}
                  className="tool-card group"
                >
                  <div className="flex items-start gap-3">
                    {t && <span className="text-2xl flex-shrink-0">{t.icon}</span>}
                    <div>
                      <h3 className="text-sm font-medium text-bark-700 dark:text-cream-200 group-hover:text-sage-600 dark:group-hover:text-sage-400 transition-colors line-clamp-2">
                        {g.title}
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