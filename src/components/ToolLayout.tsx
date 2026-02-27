import Link from "next/link";
import { getToolBySlug, getRelatedTools, CATEGORY_LABELS, CATEGORY_COLORS } from "@/lib/tools";
import { toolFaqs } from "@/lib/faqs";
import AdSlot from "./AdSlot";
import FAQSection from "./FAQSection";

interface ToolLayoutProps {
  slug: string;
  children: React.ReactNode;
}

export default function ToolLayout({ slug, children }: ToolLayoutProps) {
  const tool = getToolBySlug(slug);
  if (!tool) return null;

  const related = getRelatedTools(slug, 4);
  const faqs = toolFaqs[slug] || [];

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    description: tool.description,
    url: `https://fibertools.app/${slug}`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    author: { "@type": "Organization", name: "FiberTools", url: "https://fibertools.app" },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://fibertools.app" },
      { "@type": "ListItem", position: 2, name: tool.name, item: `https://fibertools.app/${slug}` },
    ],
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <nav className="flex items-center gap-2 text-sm text-bark-400 dark:text-bark-500 mb-4" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-sage-600 dark:hover:text-sage-400 transition-colors">Home</Link>
        <span aria-hidden="true">/</span>
        <span className="text-bark-600 dark:text-cream-400">{tool.name}</span>
      </nav>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl" aria-hidden="true">{tool.icon}</span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-bark-800 dark:text-cream-100">{tool.name}</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full ${CATEGORY_COLORS[tool.category]}`}>
            {CATEGORY_LABELS[tool.category]}
          </span>
          <p className="text-bark-500 dark:text-bark-400 text-sm">{tool.description}</p>
        </div>
      </div>

      {children}

      <AdSlot position="after-tool" />

      <section className="mt-12">
        <h2 className="section-heading">Related Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {related.map((t) => (
            <Link key={t.slug} href={`/${t.slug}`} className="tool-card group">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{t.icon}</span>
                <div>
                  <h3 className="font-medium text-bark-700 dark:text-cream-200 group-hover:text-sage-600 dark:group-hover:text-sage-400 transition-colors">{t.shortName}</h3>
                  <p className="text-sm text-bark-400 dark:text-bark-500 mt-1 line-clamp-2">{t.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <AdSlot position="mid-content" />
      <FAQSection faqs={faqs} toolName={tool.name} />

      <section className="mt-12">
        <div className="bg-cream-100 dark:bg-bark-800 rounded-2xl border border-cream-300 dark:border-bark-700 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <span className="text-3xl flex-shrink-0">🎙️</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-bark-700 dark:text-cream-200 text-sm mb-1">Ready to start your project?</h3>
            <p className="text-sm text-bark-500 dark:text-bark-400 leading-relaxed">
              {"You've done the planning — now keep track while you craft. "}
              <a href="https://mycrochetkit.com" target="_blank" rel="noopener noreferrer" className="text-sage-600 dark:text-sage-400 hover:underline font-medium">MyCrochetKit</a>
              {" is a free voice-activated row counter that lets you say \"next\" to count rows hands-free."}
            </p>
          </div>
          <a href="https://mycrochetkit.com" target="_blank" rel="noopener noreferrer" className="btn-primary text-sm whitespace-nowrap flex-shrink-0">Try It Free →</a>
        </div>
      </section>

      <AdSlot position="before-footer" />
    </main>
  );
}
