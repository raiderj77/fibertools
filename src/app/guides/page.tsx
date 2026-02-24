import type { Metadata } from "next";
import Link from "next/link";
import { getAllGuides } from "@/lib/guides";
import { getToolBySlug } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Fiber Arts Guides & Tutorials | FiberTools",
  description: "Comprehensive guides for knitters, crocheters, weavers, spinners, and embroiderers. Learn yarn labels, gauge, needle sizes, and more.",
  keywords: [
    "knitting guides",
    "crochet tutorials",
    "yarn label guide",
    "gauge tutorial",
    "needle size guide",
    "fiber arts education",
    "how to read yarn labels",
    "crochet hook sizes",
    "knitting needle conversion",
  ],
};

export default function GuidesPage() {
  const guides = getAllGuides();

  const guidesByCategory = guides.reduce((acc, guide) => {
    const tool = getToolBySlug(guide.toolSlug);
    const category = tool?.category || "both";
    if (!acc[category]) acc[category] = [];
    acc[category].push(guide);
    return acc;
  }, {} as Record<string, typeof guides>);

  const CATEGORY_LABELS: Record<string, string> = {
    knitting: "Knitting Guides",
    crochet: "Crochet Guides",
    both: "Knitting & Crochet",
    weaving: "Weaving Guides",
    spinning: "Spinning Guides",
    embroidery: "Embroidery Guides",
    "cross-stitch": "Cross Stitch Guides",
  };

  const CATEGORY_COLORS: Record<string, string> = {
    knitting: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
    crochet: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    both: "bg-sage-100 text-sage-700 dark:bg-sage-900/30 dark:text-sage-300",
    weaving: "bg-bark-100 text-bark-700 dark:bg-bark-700 dark:text-bark-200",
    spinning: "bg-cream-300 text-bark-700 dark:bg-bark-700 dark:text-cream-300",
    embroidery: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
    "cross-stitch": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-bark-800 dark:text-cream-100 leading-tight mb-4">
          Fiber Arts Guides & Tutorials
        </h1>
        <p className="text-lg text-bark-600 dark:text-cream-300 max-w-3xl mx-auto">
          Comprehensive guides for knitters, crocheters, weavers, spinners, and embroiderers. 
          Learn everything from reading yarn labels to mastering gauge and needle conversions.
        </p>
      </div>

      {/* Guides by category */}
      {Object.entries(guidesByCategory).map(([category, categoryGuides]) => (
        <section key={category} className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${CATEGORY_COLORS[category] || CATEGORY_COLORS.both}`}>
              {CATEGORY_LABELS[category] || CATEGORY_LABELS.both}
            </span>
            <h2 className="text-xl font-display font-bold text-bark-700 dark:text-cream-200">
              {categoryGuides.length} {categoryGuides.length === 1 ? 'Guide' : 'Guides'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryGuides.map((guide) => {
              const tool = getToolBySlug(guide.toolSlug);
              return (
                <Link
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className="tool-card group"
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-start gap-3 mb-3">
                      {tool && <span className="text-2xl flex-shrink-0">{tool.icon}</span>}
                      <div className="flex-1">
                        <h3 className="text-lg font-display font-bold text-bark-800 dark:text-cream-100 group-hover:text-sage-600 dark:group-hover:text-sage-400 transition-colors mb-2">
                          {guide.title}
                        </h3>
                        <p className="text-sm text-bark-500 dark:text-bark-400 line-clamp-2">
                          {guide.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-cream-200 dark:border-bark-700">
                      <div className="flex items-center justify-between">
                        <time className="text-xs text-bark-400 dark:text-bark-500">
                          {new Date(guide.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </time>
                        {tool && (
                          <span className="text-xs text-sage-600 dark:text-sage-400">
                            {tool.shortName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}

      {/* Empty state */}
      {guides.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🧶</div>
          <h2 className="text-xl font-display font-bold text-bark-700 dark:text-cream-200 mb-2">
            Guides Coming Soon
          </h2>
          <p className="text-bark-500 dark:text-bark-400 max-w-md mx-auto">
            We&apos;re working on comprehensive guides for all fiber arts topics. 
            Check back soon for tutorials on yarn labels, gauge, needle sizes, and more.
          </p>
        </div>
      )}

      {/* CTA */}
      <div className="mt-12 p-8 bg-sage-50 dark:bg-sage-900/20 rounded-2xl border border-sage-200 dark:border-sage-800 text-center">
        <h2 className="text-2xl font-display font-bold text-bark-800 dark:text-cream-100 mb-3">
          Want to suggest a guide topic?
        </h2>
        <p className="text-bark-600 dark:text-cream-300 mb-6 max-w-2xl mx-auto">
          We&apos;re constantly adding new guides based on community feedback. 
          Is there a fiber arts topic you&apos;d like us to cover?
        </p>
        <a 
          href="mailto:hello@fibertools.app" 
          className="btn-primary inline-flex items-center gap-2"
        >
          ✉️ Suggest a Guide Topic
        </a>
      </div>
    </main>
  );
}