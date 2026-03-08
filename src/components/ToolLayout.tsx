import Link from "next/link";
import { getToolBySlug, getRelatedTools, CATEGORY_LABELS, CATEGORY_COLORS } from "@/lib/tools";
import { toolFaqs } from "@/lib/faqs";
import { toolContent } from "@/lib/toolContent";
import { getBlogPostByToolSlug } from "@/lib/blog";
import { getGuideByToolSlug } from "@/lib/guides";
import FAQSection from "./FAQSection";
import PrintShareButtons from "./PrintShareButtons";
import AdUnit from "./AdUnit";
import LazyAdUnit from "./LazyAdUnit";
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
  const content = toolContent[slug];
  const companionBlog = getBlogPostByToolSlug(slug);
  const companionGuide = getGuideByToolSlug(slug);

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Structured Data: SoftwareApplication + FAQPage + BreadcrumbList */}
      <ToolSchema tool={tool} faqs={faqs} />

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-bark-400 dark:text-bark-500 mb-4" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-sage-600 dark:hover:text-sage-400 transition-colors">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-bark-600 dark:text-cream-400">{tool.name}</span>
      </nav>

      {/* Title & category badge */}
      <div className="mb-8">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-3">
            <span className="text-3xl" aria-hidden="true">{tool.icon}</span>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-bark-800 dark:text-cream-100">
              {tool.name}
            </h1>
          </div>
          <PrintShareButtons toolName={tool.name} />
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full ${CATEGORY_COLORS[tool.category]}`}>
            {CATEGORY_LABELS[tool.category]}
          </span>
          <p className="text-xs text-bark-400 dark:text-bark-500">
            Last updated: March 2026
          </p>
        </div>
        <p className="text-bark-600 dark:text-cream-300 text-[15px] leading-relaxed mt-3">
          {tool.description}
        </p>
      </div>

      {/* Pre-tool educational content */}
      {content?.introduction && (
        <section className="mb-10">
          <h2 className="section-heading">{content.introduction.title}</h2>
          {content.introduction.paragraphs.map((p, i) => (
            <p key={i} className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
              {p}
            </p>
          ))}
        </section>
      )}

      {content?.whatIs && (
        <section className="mb-10">
          <h2 className="section-heading">{content.whatIs.title}</h2>
          {content.whatIs.paragraphs.map((p, i) => (
            <p key={i} className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
              {p}
            </p>
          ))}
        </section>
      )}

      {content?.howCalculated && (
        <section className="mb-10">
          <h2 className="section-heading">{content.howCalculated.title}</h2>
          {content.howCalculated.paragraphs.map((p, i) => (
            <p key={i} className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
              {p}
            </p>
          ))}
        </section>
      )}

      {/* === TOOL UI === */}
      {children}

      <AdUnit slot="" id="ad-after-tool" />

      {/* Educational content */}
      {content && (
        <>
          <section className="mt-12">
            <h2 className="section-heading">{content.howToUse.title}</h2>
            {content.howToUse.paragraphs.map((p, i) => (
              <p key={i} className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
                {p}
              </p>
            ))}
          </section>

          <section className="mt-10">
            <h2 className="section-heading">{content.understandingResults.title}</h2>
            {content.understandingResults.paragraphs.map((p, i) => (
              <p key={i} className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
                {p}
              </p>
            ))}
          </section>

          <section className="mt-10">
            <h2 className="section-heading">{content.proTips.title}</h2>
            <div className="bg-sage-50 dark:bg-sage-900/20 border border-sage-200 dark:border-sage-800 rounded-2xl p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-sage-600 dark:text-sage-400 mb-4">
                From 30+ years of fiber arts experience
              </p>
              <ul className="space-y-3">
                {content.proTips.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 text-bark-600 dark:text-cream-300 text-[15px] leading-relaxed">
                    <span className="text-sage-500 dark:text-sage-400 mt-1 flex-shrink-0">&#10003;</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </>
      )}

      {/* Authority references */}
      <section className="mt-10">
        <h2 className="section-heading">References & Standards</h2>
        <ul className="space-y-2 text-sm text-bark-500 dark:text-bark-400">
          <li>
            <a href="https://www.craftyarncouncil.com/standards/yarn-weight-system" target="_blank" rel="noopener noreferrer" className="text-sage-600 dark:text-sage-400 hover:underline">
              Craft Yarn Council — Yarn Weight System
            </a>
            {" — Industry-standard yarn weight categories and gauge ranges"}
          </li>
          <li>
            <a href="https://www.craftyarncouncil.com/standards/needle-hook-sizes" target="_blank" rel="noopener noreferrer" className="text-sage-600 dark:text-sage-400 hover:underline">
              Craft Yarn Council — Needle & Hook Sizes
            </a>
            {" — Standard sizing charts for knitting needles and crochet hooks"}
          </li>
          <li>
            <a href="https://www.ravelry.com" target="_blank" rel="noopener noreferrer" className="text-sage-600 dark:text-sage-400 hover:underline">
              Ravelry
            </a>
            {" — Yarn database, pattern library, and community for fiber artists"}
          </li>
        </ul>
      </section>

      {/* Companion guides */}
      {(companionBlog || companionGuide) && (
        <section className="mt-12">
          <h2 className="section-heading">Learn More</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {companionBlog && (
              <Link
                href={`/blog/${companionBlog.slug}`}
                className="tool-card group"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">📝</span>
                  <div>
                    <h3 className="font-medium text-bark-700 dark:text-cream-200 group-hover:text-sage-600 dark:group-hover:text-sage-400 transition-colors">
                      {companionBlog.title}
                    </h3>
                    <p className="text-sm text-bark-400 dark:text-bark-500 mt-1 line-clamp-2">
                      {companionBlog.description}
                    </p>
                  </div>
                </div>
              </Link>
            )}
            {companionGuide && (
              <Link
                href={`/guides/${companionGuide.slug}`}
                className="tool-card group"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">📖</span>
                  <div>
                    <h3 className="font-medium text-bark-700 dark:text-cream-200 group-hover:text-sage-600 dark:group-hover:text-sage-400 transition-colors">
                      {companionGuide.title}
                    </h3>
                    <p className="text-sm text-bark-400 dark:text-bark-500 mt-1 line-clamp-2">
                      {companionGuide.description}
                    </p>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </section>
      )}

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

      {/* FAQ */}
      <FAQSection faqs={faqs} />

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

      <LazyAdUnit slot="" id="ad-before-footer" />
    </main>
  );
}
