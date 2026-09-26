import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";
import { notFound } from "next/navigation";
import { getGuideBySlug, getAllGuides } from "@/lib/guides";
import { getToolBySlug } from "@/lib/tools";

type Params = Promise<{ slug: string }>;

// Generate all guide paths at build time
export function generateStaticParams() {
  const guides = getAllGuides();
  return guides.map((guide) => ({ slug: guide.slug }));
}

// Dynamic metadata per guide
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};

  return {
    title: { absolute: guide.title },
    description: guide.description,
    keywords: guide.keywords,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: {
      type: "article",
      title: guide.title,
      description: guide.description,
      publishedTime: guide.date,
      ...(guide.modifiedDate ? { modifiedTime: guide.modifiedDate } : {}),
    },
  };
}

export default async function GuidePage({ params }: { params: Params }) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const tool = getToolBySlug(guide.toolSlug);

  const renderedSections = await Promise.all(guide.sections.map(async section => ({
    ...section,
    html: section.markdown ? String(await remark().use(remarkGfm).use(html).process(section.content)) : null,
  })));

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: guide.date,
    ...(guide.modifiedDate ? { dateModified: guide.modifiedDate } : {}),
    url: `https://fibertools.app/guides/${guide.slug}`,
    mainEntityOfPage: `https://fibertools.app/guides/${guide.slug}`,
    author: guide.editorialNote
      ? { "@type": "Organization", name: "FiberTools", url: "https://fibertools.app/about" }
      : { "@type": "Person", name: "Jason Ramirez", jobTitle: "Founder of FiberTools", url: "https://fibertools.app/about" },
    publisher: { "@type": "Organization", name: "FiberTools", url: "https://fibertools.app" },
    keywords: guide.keywords.join(", "),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://fibertools.app" },
      { "@type": "ListItem", position: 2, name: "Guides", item: "https://fibertools.app/guides" },
      { "@type": "ListItem", position: 3, name: guide.title },
    ],
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
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
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-bark-800 dark:text-cream-100 leading-tight mb-1">
        {guide.title}
      </h1>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-8 text-sm text-bark-400 dark:text-bark-500">
        <time dateTime={guide.date}>{new Date(guide.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time>
        <span aria-hidden="true">&middot;</span>
        {guide.editorialNote ? <span>By <strong className="text-bark-600 dark:text-cream-400">FiberTools</strong></span> : <span>By <strong className="text-bark-600 dark:text-cream-400">Jason Ramirez</strong></span>}
        <span aria-hidden="true">&middot;</span>
        <span>Practical reference connected to a working calculator</span>
        {guide.modifiedDate && <span>Updated: <time dateTime={guide.modifiedDate}>{guide.modifiedDate}</time></span>}
        <span aria-hidden="true">&middot;</span>
        <Link href="/about" className="text-sage-600 dark:text-sage-400 hover:underline">About us</Link>
        {tool && (
          <>
            <span aria-hidden="true">&middot;</span>
            <Link href={`/${tool.slug}`} className="text-sage-600 dark:text-sage-400 hover:underline">
              {tool.icon} Try the {tool.shortName}
            </Link>
          </>
        )}
      </div>

      {guide.editorialNote && <p className="mb-6 text-sm text-bark-600 dark:text-cream-300">{guide.editorialNote}</p>}

      {/* In this guide TOC */}
      <nav className="bg-cream-50 dark:bg-bark-800 border border-cream-300 dark:border-bark-700 rounded-2xl p-5 mb-8" aria-label="In this guide">
        <p className="text-xs font-semibold uppercase tracking-wider text-bark-400 dark:text-bark-500 mb-3">In this guide</p>
        <ol className="space-y-1 list-decimal list-inside">
          {guide.sections.map((section, i) => {
            const id = section.heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            return (
              <li key={i}>
                <a href={`#${id}`} className="text-sm text-sage-600 dark:text-sage-400 hover:underline">
                  {section.heading}
                </a>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Content */}
      <article className="prose-fiber">
        {renderedSections.map((section, i) => {
          const id = section.heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          return (
            <div key={i} className="mb-8">
              <h2 id={id} className="text-xl font-display font-bold text-bark-700 dark:text-cream-200 mb-3">
                {section.heading}
              </h2>
              {section.image && <figure className="my-6">
                <Image src={section.image.src} alt={section.image.alt} width={section.image.width} height={section.image.height} unoptimized className="w-full h-auto rounded-lg" />
                <figcaption className="mt-2 text-sm text-bark-600 dark:text-cream-300">{section.image.caption}</figcaption>
              </figure>}
              {section.html ? <div tabIndex={section.html.includes("<table>") ? 0 : undefined} role={section.html.includes("<table>") ? "region" : undefined} aria-labelledby={section.html.includes("<table>") ? id : undefined} className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-600 overflow-x-auto text-bark-600 dark:text-cream-300 leading-relaxed text-[15px] [&_p]:mb-4 [&_a]:underline [&_h3]:font-semibold [&_h3]:text-lg [&_h3]:mb-3 [&_table]:w-full [&_table]:mb-4 [&_th]:text-left [&_th]:p-2 [&_td]:p-2 [&_td]:border [&_th]:border" dangerouslySetInnerHTML={{ __html: section.html }} /> : section.content.split("\n\n").map((paragraph, j) => (
                <p key={j} className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
                  {paragraph}
                </p>
              ))}
            </div>
          );
        })}
      </article>
      {guide.sources && <section className="mt-8" aria-label="Sources">
        <h2 className="text-xl font-semibold mb-3">Sources</h2>
        <ul className="space-y-2">{guide.sources.map((source) => <li key={source.url}>
          <a href={source.url} className="underline">{source.title}</a>
        </li>)}</ul>
      </section>}

      {/* CTA to tool */}
      {tool && (
        <div className="mt-12 p-6 bg-sage-50 dark:bg-sage-900/20 rounded-2xl border border-sage-200 dark:border-sage-800 text-center">
          <p className="text-lg font-semibold text-bark-700 dark:text-cream-200 mb-2">
            Ready to put this into practice?
          </p>
          <p className="text-sm text-bark-500 dark:text-bark-400 mb-4">
            Use our free {tool.name}, no login required, works offline.
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
    </div>
  );
}
