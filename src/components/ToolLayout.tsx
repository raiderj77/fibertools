import Link from "next/link";
import { getToolBySlug, getRelatedTools, CATEGORY_LABELS, CATEGORY_COLORS } from "@/lib/tools";
import { toolFaqs } from "@/lib/faqs";
import AdSlot from "./AdSlot";
import FAQSection from "./FAQSection";
import { ToolSchema } from "./StructuredData";

interface ToolLayoutProps {
  slug: string;
  children: React.ReactNode;
}

export default function ToolLayout({ slug, children }: ToolLayoutProps) {
  const tool = getToolBySlug(slug);
  if (!tool) return null;

  const related = getRelatedTools(slug, 4);
  const faqs = toolFaqs[slug] || [];

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Structured Data for SEO */}
      <ToolSchema tool={tool} faqs={faqs} />
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-bark-400 dark:text-bark-500 mb-4">
        <Link href="/" className="hover:text-sage-600 dark:hover:text-sage-400 transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-bark-600 dark:text-cream-400">{tool.name}</span>
      </nav>

      {/* Title & category badge */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{tool.icon}</span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-bark-800 dark:text-cream-100">
            {tool.name}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full ${CATEGORY_COLORS[tool.category]}`}>
            {CATEGORY_LABELS[tool.category]}
          </span>
          <p className="text-bark-500 dark:text-bark-400 text-sm">
            {tool.description}
          </p>
        </div>
      </div>

      {/* === TOOL UI === */}
      {children}

      {/* Ad: after tool */}
      <AdSlot position="after-tool" />

      {/* Related tools */}
      <section className="mt-12">
        <h2 className="section-heading">Related Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {related.map((t) => (
            <Link key={t.slug} href={`/${t.slug}`} className="tool-card group">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{t.icon}</span>
                <div>
                  <h3 className="font-medium text-bark-700 dark:text-cream-200 group-hover:text-sage-600 dark:group-hover:text-sage-400 transition-colors">
                    {t.shortName}
                  </h3>
                  <p className="text-sm text-bark-400 dark:text-bark-500 mt-1 line-clamp-2">
                    {t.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Ad: mid-content */}
      <AdSlot position="mid-content" />

      {/* FAQ */}
      <FAQSection faqs={toolFaqs[slug] || []} toolName={tool.name} />

      {/* Project tracking callout */}
      <section className="mt-12">
        <div className="bg-cream-100 dark:bg-bark-800 rounded-2xl border border-cream-300 dark:border-bark-700 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <span className="text-3xl flex-shrink-0">🎙️</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-bark-700 dark:text-cream-200 text-sm mb-1">
              Ready to start your project?
            </h3>
            <p className="text-sm text-bark-500 dark:text-bark-400 leading-relaxed">
              {"You've done the planning — now keep track while you craft. "}
              <a
                href="https://mycrochetkit.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sage-600 dark:text-sage-400 hover:underline font-medium"
              >
                MyCrochetKit
              </a>
              {" is a free voice-activated row counter that lets you say \"next\" to count rows hands-free. Track multiple projects, save your progress, and never lose count again."}
            </p>
          </div>
          <a
            href="https://mycrochetkit.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-sm whitespace-nowrap flex-shrink-0"
          >
            Try It Free →
          </a>
        </div>
      </section>

      {/* Ad: before footer */}
      <AdSlot position="before-footer" />
    </main>
  );
}
